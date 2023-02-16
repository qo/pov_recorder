import {readdir, readFile} from "fs/promises";
import * as path from "path";
import prompts from 'prompts';
import get_players from "./get_players";
import get_entity_id_by_xuid from "./get_entity_id_by_xuid";
import get_demo_length from "./get_demo_length";
import launch_hlae from "./hlae_handler";
import create_vdm from "./vdm_handler";

export default async function record() {
    const path_cfg_path = path.join(__dirname, "..", "cfg", "paths", "paths.json");
    const path_cfg_data = await readFile(path_cfg_path);
    const path_cfg = JSON.parse(path_cfg_data.toString());

    const recording_cfgs_path = path.join(__dirname, "..", "cfg", "recording")

    const recording_cfgs_names = await readdir(recording_cfgs_path);

    const recording_cfg_choices = recording_cfgs_names.map(
        cfg => ({ title: cfg, value: cfg })
    );
    const recording_cfg_name_selection = await prompts({
        type: 'select',
        name: 'selected_cfg',
        message: 'Select a recording config',
        choices: recording_cfg_choices
    });

    const recording_cfg_path = path.join(recording_cfgs_path, recording_cfg_name_selection.selected_cfg);

    const recording_cfg_data = await readFile(recording_cfg_path);
    const recording_cfg = JSON.parse(recording_cfg_data.toString());

    const demos_path = path.join(__dirname, "..", "demos");

    const demo_path_files = await readdir(demos_path);
    const demo_files = demo_path_files.filter(file => file.endsWith(".dem"));

    const demo_choices = demo_files.map(
        name => ({ title: name, value: name })
    );
    const demo_selection = await prompts({
        type: 'select',
        name: 'selected_demo',
        message: 'Select a .dem',
        choices: demo_choices
    });

    const selected_demo = demo_selection.selected_demo;

    const demo_path = path.join(demos_path, selected_demo);

    const players = await get_players(demo_path);

    const player_choices = players.map(
        player => (
            {
                title: `${player.name} - https://steamcommunity.com/profiles/${player.xuid}`,
                value: player
            })
    );
    const player_selection = await prompts({
        type: 'select',
        name: 'selected_player',
        message: 'Select a POV player',
        choices: player_choices
    });

    const selected_player = player_selection.selected_player;

    const demo_length = await get_demo_length(demo_path);

    const start_tick_input = await prompts({
        type: 'number',
        name: 'value',
        message: `Enter start tick (0-${demo_length})`
    });
    const start_tick = start_tick_input.value;

    const end_tick_input = await prompts({
        type: 'number',
        name: 'value',
        message: `Enter end tick (${start_tick+1}-${demo_length})`
    });
    const end_tick = end_tick_input.value;

    const entity_id = await get_entity_id_by_xuid(
        selected_player.xuid,
        demo_path,
        start_tick,
        end_tick
    );

    await create_vdm(demo_path, start_tick, end_tick, recording_cfg);

    launch_hlae(demo_path, entity_id, recording_cfg, path_cfg);
}