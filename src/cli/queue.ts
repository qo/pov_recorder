import select from "./select";
import input from "./input"
import toggle from "./toggle";
import path from "path";
import {readdir, readFile} from "fs/promises";
import get_players from "./get_players";
import read_json from "./read_json";

// Choose recording config to be used by default
// Choose steamid to be used by default
// Choose demo
// Parse players
// If steamid wasn't found, select player (or cancel demo)
// Choose another demo or start recording

type steam_id = "steam_id" | "community_id" | "vanity_url";

export default async function queue() {

    const recording_cfgs_path = path.join(__dirname, "..", "cfg", "recording");
    const recording_cfgs_names = await readdir(recording_cfgs_path);

    const use_default_recording_cfg =
        await toggle(
            "Do you want to provide Recording Config to be used by default?"
        );

    let default_recording_cfg;
    if (use_default_recording_cfg) {
        const default_recording_cfg_name =
            await select(
                "Select Recording Config to be used by default",
                recording_cfgs_names
            );
        default_recording_cfg = await read_json(recording_cfgs_path, default_recording_cfg_name);
    }

    const use_default_steam_id =
        await toggle(
            "Do you want to provide Steam ID to be used by default?"
        );

    let default_steam_id, default_steam_id_type;
    if (use_default_steam_id) {
        default_steam_id_type =
            await select<steam_id>(
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

        default_steam_id =
            await input(
                "Provide Steam ID"
            );

    }

    await add_demos_to_queue(default_recording_cfg, default_steam_id, default_steam_id_type);

}

async function add_demos_to_queue(default_recording_cfg: string, default_steam_id: string, default_steam_id_type: steam_id) {

    if (default_steam_id_type === "vanity_url") {
        // https://wiki.teamfortress.com/wiki/WebAPI/ResolveVanityURL
        default_steam_id_type = "community_id";
        default_steam_id = "76561199101834053";
    }

    const demos_path = path.join(__dirname, "..", "demos");
    const demos_path_files = await readdir(demos_path);
    const demos = demos_path_files.filter(file => file.endsWith(".dem"));

    let next_action = "Add more demos";
    while (next_action === "Add more demos") {
        const demo =
            await select(
                "Select a demo",
                demos
            );
        const demo_path = path.join(demos_path, demo);

        const players = await get_players(demo_path);
        const default_player =
            players.find(player => {
                if (default_steam_id_type === "steam_id")
                    return player.guid === default_steam_id;
                if (default_steam_id_type === "community_id")
                    return player.xuid.toString() === default_steam_id;
            });

        let player;
        if (default_player)
            player = default_player
        else {
            const player_choices = players.map(
                player => (
                    {
                        title: `${player.name} - https://steamcommunity.com/profiles/${player.xuid}`,
                        value: player
                    }));
            player =
                await select(
                    "Select POV Player",
                    player_choices
                );
        }

        // todo: get the rest of the code from record.ts, ask user if he wants to add more demos
    }

}
