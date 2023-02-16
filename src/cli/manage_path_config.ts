import prompts from 'prompts';
import path from "path";
import {readFile, writeFile} from "fs/promises";

async function create_path_config() {

    const path_inputs = [
        {
            type: 'text',
            name: 'csgo_exe',
            message: 'Provide Full Path to csgo.exe'
        },
        {
            type: 'text',
            name: 'hlae_exe',
            message: 'Provide Full Path to hlae.exe'
        },
        {
            type: 'text',
            name: 'nskinz_dll',
            message: 'Provide Full Path to nskinz.dll (leave empty if you don\'t use it)'
        }
    ]

    const new_path_cfg = await prompts(path_inputs);

    const path_cfg_path = path.join(__dirname, "..", "cfg", "paths", "paths.json");
    await writeFile(path_cfg_path, JSON.stringify(new_path_cfg));

}

async function edit_path_config() {

    const path_cfg_path = path.join(__dirname, "..", "cfg", "paths", "paths.json");
    const path_cfg_data = await readFile(path_cfg_path);
    const path_cfg = JSON.parse(path_cfg_data.toString());
    const new_path_cfg = path_cfg;

    // todo: make a function instead

    const csgo_path_action_selection = await prompts({
        type: 'select',
        name: 'selected_action',
        message: `Your current csgo.exe path is ${path_cfg.csgo_exe}`,
        choices: [
            { title: "Leave unchanged", value: "save" },
            { title: "Edit", value: "edit" }
        ]
    });

    if (csgo_path_action_selection.selected_action === "edit") {
        const csgo_new_path_selection = await prompts({
            type: 'text',
            name: 'selected_path',
            message: 'Provide Full Path to csgo.exe'
        });
        new_path_cfg.csgo_exe = csgo_new_path_selection.selected_path;
    }

    const hlae_path_action_selection = await prompts({
        type: 'select',
        name: 'selected_action',
        message: `Your current hlae.exe path is ${path_cfg.hlae_exe}`,
        choices: [
            { title: "Leave unchanged", value: "save" },
            { title: "Edit", value: "edit" }
        ]
    });

    if (hlae_path_action_selection.selected_action === "edit") {
        const hlae_new_path_selection = await prompts({
            type: 'text',
            name: 'selected_path',
            message: 'Provide Full Path to hlae.exe'
        });
        new_path_cfg.hlae_exe = hlae_new_path_selection.selected_path;
    }

    const nskinz_path_action_selection = await prompts({
        type: 'select',
        name: 'selected_action',
        message: `Your current csgo.exe path is ${path_cfg.nskinz_dll}`,
        choices: [
            { title: "Leave unchanged", value: "save" },
            { title: "Edit", value: "edit" }
        ]
    });

    if (nskinz_path_action_selection.selected_action === "edit") {
        const nskinz_new_path_selection = await prompts({
            type: 'text',
            name: 'selected_path',
            message: 'Provide Full Path to nskinz.dll'
        });
        new_path_cfg.nskinz_dll = nskinz_new_path_selection.selected_path;
    }

    await writeFile(path_cfg_path, JSON.stringify(new_path_cfg));
}

export default async function manage_path_config(paths_are_configured: boolean) {

    // Path config can only be created or edited

    const action_selection = await prompts({
        type: 'select',
        name: 'selected_action',
        message: 'What do you want to do with Path Config?',
        choices: [
            { title: "Create Path Config", value: "create", disabled: paths_are_configured },
            { title: "Edit Path Config", value: "edit", disabled: !paths_are_configured }
        ]
    });

    if (action_selection.selected_action === "create")
        await create_path_config();

    else if (action_selection.selected_action === "edit")
        await edit_path_config();

    else
        throw new Error("Unexpected path config action (neither create nor edit)");

}