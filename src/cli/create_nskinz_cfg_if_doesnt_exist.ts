import path from "path";
import {existsSync} from "fs";
import {writeFile} from "fs/promises";
import recording_cfg from "./interfaces/recording_cfg";
import path_cfg from "./interfaces/path_cfg";

export default async function create_nskinz_cfg_if_doesnt_exist(recording_cfg: recording_cfg, path_cfg: path_cfg) {
    if (recording_cfg.additional_settings.use_nskinz) {
        const path_to_csgo_cfgs = path.join(path_cfg.csgo_exe, "..", "csgo", "cfg");
        const path_to_nskinz_cfg = path.join(path_to_csgo_cfgs, "nSkinz.cfg");
        if (!existsSync(path_to_nskinz_cfg)) {
            console.log("Creating nSkinz.cfg in csgo/cfg");
            const path_to_nskinz_dll_with_escaped_slashes = path_cfg.nskinz_dll.replace('\\', '\\\\');
            const nskinz_cfg_content = `mirv_loadlibrary "${path_to_nskinz_dll_with_escaped_slashes}"`;
            await writeFile(path_to_nskinz_cfg, nskinz_cfg_content);
        }
    }
}