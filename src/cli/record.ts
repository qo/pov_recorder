import {readdir, readFile, writeFile} from "fs/promises";
import { watch } from "fs";
import * as path from "path";
import prompts from 'prompts';
import get_players from "./get_players";
import get_entity_id_by_xuid from "./get_entity_id_by_xuid";
import get_demo_length from "./get_demo_length";
import launch_hlae from "./hlae_handler";
import {create_vdm, delete_vdm} from "./vdm_handler";
import create_nskinz_cfg_if_doesnt_exist from "./create_nskinz_cfg_if_doesnt_exist";
import prompt_for_demo_props from "./prompt_for_demo_props";
import record_demo from "./record_demo";

export default async function record() {

    const {
        demo_path,
        recording_cfg,
        pov_player,
        start_tick,
        end_tick
    } = await prompt_for_demo_props();

    await record_demo(recording_cfg, demo_path, start_tick, end_tick, pov_player);

}
