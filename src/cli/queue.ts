import select from "./select";
import toggle from "./toggle";
import path from "path";
import {readdir, readFile} from "fs/promises";
import read_json from "./read_json";
import convert_steam_id_to_xuid from "./utils/convert_steam_id_to_xuid";
import text_input from "./text_input";
import prompt_for_demo_props from "./prompt_for_demo_props";
import record_demo from "./record_demo";

// Choose recording config to be used by default
// Choose steamid to be used by default
// Choose demo
// Parse players
// If steamid wasn't found, select player (or cancel demo)
// Choose another demo or start recording

type steam_id_type = "steam_id" | "community_id" | "vanity_url";

export default async function queue() {

    const recording_cfgs_path = path.join(__dirname, "..", "cfg", "recording");
    const recording_cfgs_names = await readdir(recording_cfgs_path);

    const use_default_recording_cfg =
        await toggle(
            "Do you want to provide Recording Config to be used by default?"
        );

    let default_recording_cfg;
    if (use_default_recording_cfg) {
        const default_recording_cfg_name = await prompt_for_default_recording_cfg(recording_cfgs_names);
        default_recording_cfg = await read_json(recording_cfgs_path, default_recording_cfg_name);
    }

    const use_default_steam_id =
        await toggle(
            "Do you want to provide Steam ID to be used by default?"
        );

    let default_steam_id, default_steam_id_type;
    if (use_default_steam_id) {
        const prompt = await prompt_for_default_steam_id();
        default_steam_id = prompt.default_steam_id;
        default_steam_id_type = prompt.default_steam_id_type;
    }

    const default_steam_xuid = convert_steam_id_to_xuid({
        steam_id: default_steam_id,
        steam_id_type: default_steam_id_type
    });

    await add_demos_to_queue({
        default_recording_cfg,
        default_steam_xuid
    });

}

async function add_demos_to_queue(props: { default_recording_cfg?: string, default_steam_xuid?: string }) {

    let demos_props = [];

    let next_action = "Add more demos";
    while (next_action === "Add more demos") {

        const demo_props = await prompt_for_demo_props({
            default_recording_cfg: props.default_recording_cfg,
            default_steam_xuid: props.default_steam_xuid
        });

        demos_props.push(demo_props);

        next_action =
            await select(
                "What do you want to do next?",
                [ "Add more demos", "Start recording" ]
            );

    }

    demos_props.forEach(
        async (demo_props) =>
            await record_demo(
                demo_props.recording_cfg,
                demo_props.demo_path,
                demo_props.start_tick,
                demo_props.end_tick,
                demo_props.pov_player
            )
    );

}

async function prompt_for_default_steam_id() {
    const default_steam_id_type =
        await select<steam_id_type>(
            "Select Steam ID type",
            [{
                title: "Steam ID (STEAM_0:1:X)",
                value: "steam_id"
            },
                {
                    title: "Community ID (7656119XXXXXXXXXX)",
                    value: "community_id"
                },
                {
                    title: "Vanity URL (id/X)",
                    value: "vanity_url"
                }]
        );

    if (default_steam_id_type === "steam_id")
        console.log(`
                Example input: STEAM_0:1:570784162
                (not 570884162)
            `);

    if (default_steam_id_type === "community_id")
        console.log(`
                Example input: 76561199101834053
                (not https://steamcommunity.com/profiles/76561199101834053)
            `);

    if (default_steam_id_type === "vanity_url")
        console.log(`
                Example input: lesson
                (neither https://steamcommunity.com/id/lesson nor id/lesson)
            `);

    const default_steam_id =
        await text_input(
            "Provide Steam ID"
        );

    return { default_steam_id, default_steam_id_type };
}

async function prompt_for_default_recording_cfg(recording_cfg_names: string[]) {
    return await select(
        "Select Recording Config to be used by default",
        recording_cfg_names
    );
}
