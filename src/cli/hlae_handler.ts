import recording_cfg from "./interfaces/recording_cfg";
import path_cfg from "./interfaces/path_cfg";
import {execFile} from "child_process";

function get_csgo_launch_options(demo_path: string, entity_id: number, recording_cfg: recording_cfg): string  {
    return `-insecure -steam -novid -fullscreen +sv_lan 1 -console -game ${recording_cfg.additional_settings.use_migi ? recording_cfg.additional_settings.override_panorama_ui ? "migi/csgo -afxdetourpanorama" : "migi/csgo" : "csgo"} ${recording_cfg.additional_settings.use_nskinz ? "+exec nSkinz" : ""} +playdemo "${demo_path}" -fullscreen -w ${recording_cfg.video_cfg.width} -h ${recording_cfg.video_cfg.height} +mirv_pov ${entity_id}`;
}

function get_hlae_launch_options(demo_path: string, entity_id: number, recording_cfg: recording_cfg, path_cfg: path_cfg): string[] {
    return [
        `-csgoExe "${path_cfg.csgo_exe}"`,
        '-csgoLauncher',
        '-noGui',
        '-autoStart',
        `-customLaunchOptions`,
        get_csgo_launch_options(demo_path, entity_id, recording_cfg)
    ];
}

export default function launch_hlae(demo_path: string, entity_id: number, recording_cfg: recording_cfg, path_cfg: path_cfg) {
    return new Promise((resolve, reject) => {
        execFile(
            path_cfg.hlae_exe,
            get_hlae_launch_options(
                demo_path,
                entity_id,
                recording_cfg,
                path_cfg),
            {},
            (error, stdout, stderr) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(stdout);
                }
            }
        );
    });
}
