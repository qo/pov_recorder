import select from "./select";
import path from "path";
import get_players from "./get_players";
import get_demo_length from "./get_demo_length";
import number_input from "./number_input";
import get_entity_id_by_xuid from "./get_entity_id_by_xuid";
import {readdir, readFile} from "fs/promises";
import read_json from "./read_json";

interface props {
    default_recording_cfg?: string,
    default_steam_xuid?: string,
}

export default async function prompt_for_demo_props(props?: props) {

    const demos_path = path.join(__dirname, "..", "demos");
    const demos_path_files = await readdir(demos_path);
    const demos = demos_path_files.filter(file => file.endsWith(".dem"));

    const demo =
        await select(
            "Select a demo",
            demos
        );
    const demo_path = path.join(demos_path, demo);

    const recording_cfgs_path = path.join(__dirname, "..", "cfg", "recording")

    const recording_cfgs_names = await readdir(recording_cfgs_path);

    const default_recording_cfg_is_found =
        recording_cfgs_names.find(
            cfg => cfg === props.default_recording_cfg
        );

    const recording_cfg_name =
        await select(
            "Select Recording Config",
            recording_cfgs_names,
            default_recording_cfg_is_found ? props.default_recording_cfg : recording_cfgs_names[0]
        );

    const recording_cfg = await read_json(recording_cfgs_path, recording_cfg_name);

    const players = await get_players(demo_path);

    let default_player;
    if (props.default_steam_xuid) {
        default_player =
            players.find(player => player.xuid.toString() === props.default_steam_xuid);
    }

    const player_choices = players.map(
        player => (
            {
                title: `${player.name} - https://steamcommunity.com/profiles/${player.xuid}`,
                value: player
            }));
    const player =
        await select(
            "Select POV Player",
            player_choices,
            default_player
        );

    const demo_length = await get_demo_length(demo_path);

    const start_tick =
        await number_input(
            `Enter start tick (0-${demo_length})`
        );

    const end_tick =
        await number_input(
            `Enter end tick (${start_tick+1}-${demo_length})`,
        );

    const entity_id = await get_entity_id_by_xuid(
        player.xuid,
        demo_path,
        start_tick,
        end_tick
    );
    player.entity_id = entity_id;

    return {
        demo_path: demo_path,
        recording_cfg: recording_cfg,
        pov_player: player,
        start_tick: start_tick,
        end_tick: end_tick
    }

}
