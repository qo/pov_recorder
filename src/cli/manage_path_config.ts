import prompts from 'prompts';
import path from "path";
import {readFile, writeFile} from "fs/promises";
import get_path_cfg from "./get_path_cfg";
import select from "./select";
import text_input from "./text_input";

async function create_path_config() {

    let new_path_cfg: {
        csgo_exe?: string,
        hlae_exe?: string,
        nskinz_dll?: string
    } = {};
    new_path_cfg.csgo_exe =
        await text_input('Provide Full Path to csgo.exe');
    new_path_cfg.hlae_exe =
        await text_input('Provide Full Path to hlae.exe');
    new_path_cfg.nskinz_dll =
        await text_input('Provide Full Path to nskinz.dll (leave empty if you don\'t use it)');

    const path_cfg_path = path.join(__dirname, "..", "cfg", "paths", "paths.json");
    await writeFile(path_cfg_path, JSON.stringify(new_path_cfg));

}

async function save_or_edit_path(props: { name_of_file: string, current_path_to_file: string }) {

    const choices = [
        { title: "Leave unchanged", value: "save" },
        { title: "Edit", value: "edit" }
    ];

    const path_action =
        await select(
            `Your current ${props.name_of_file} path is ${props.current_path_to_file}`,
            choices
        )

    if (path_action === "edit")
        return await text_input('Provide Full Path to csgo.exe');

}

async function edit_path_config() {

    const path_cfg = await get_path_cfg();
    const new_path_cfg = path_cfg;

    new_path_cfg.csgo_exe = save_or_edit_path({
        name_of_file: "csgo.exe",
        current_path_to_file: path_cfg.csgo_exe
    });

    new_path_cfg.hlae_exe = save_or_edit_path({
        name_of_file: "hlae.exe",
        current_path_to_file: path_cfg.hlae_exe
    });

    new_path_cfg.nskinz_dll = save_or_edit_path({
        name_of_file: "nSkinz.dll",
        current_path_to_file: path_cfg.nskinz_dll
    });

    const path_cfg_path = path.join(__dirname, "..", "cfg", "paths");

    await writeFile(path_cfg_path, JSON.stringify(new_path_cfg));
}

export default async function manage_path_config(props: { paths_are_configured: boolean }) {

    // Path config can only be created or edited

    const action =
        await select(
            'What do you want to do with Path Config?',
            [
                { title: "Create Path Config", value: "create" },
                { title: "Edit Path Config", value: "edit", disabled: !props.paths_are_configured }
            ]
        )

    if (action === "create")
        await create_path_config();

    else if (action === "edit")
        await edit_path_config();

    else
        throw new Error("Unexpected path config action (neither create nor edit)");

}
