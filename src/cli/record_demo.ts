import create_nskinz_cfg_if_doesnt_exist from "./create_nskinz_cfg_if_doesnt_exist";
import {create_vdm} from "./vdm_handler";
import launch_hlae from "./hlae_handler";

export default async function record_demo(recording_cfg, demo_path, start_tick, end_tick, pov_player) {
    // When user changes nskinz.dll path,
    // path in nskinz.cfg stays the same.
    // todo: fix it
    if (recording_cfg.use_nskinz)
        await create_nskinz_cfg_if_doesnt_exist();

    await create_vdm(demo_path, start_tick, end_tick, recording_cfg, pov_player.xuid, pov_player.uid);

    await launch_hlae(demo_path, pov_player.entity_id, recording_cfg);
}
