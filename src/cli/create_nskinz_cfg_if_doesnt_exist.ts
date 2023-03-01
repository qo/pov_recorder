import path from "path";
import {existsSync} from "fs";
import {writeFile} from "fs/promises";
import get_path_cfg from "./get_path_cfg";

export default async function create_nskinz_cfg_if_doesnt_exist() {

    const path_cfg = await get_path_cfg();
    const path_to_csgo_cfgs = path.join(path_cfg.csgo_exe, "..", "csgo", "cfg");
    const path_to_nskinz_cfg = path.join(path_to_csgo_cfgs, "nSkinz.cfg");

    if (existsSync(path_to_nskinz_cfg))
        return;

    console.log("Creating nSkinz.cfg in csgo/cfg");
    const path_to_nskinz_dll_with_escaped_slashes = path_cfg.nskinz_dll.replace('\\', '\\\\');
    const nskinz_cfg_content = `mirv_loadlibrary "${path_to_nskinz_dll_with_escaped_slashes}"`;
    await writeFile(path_to_nskinz_cfg, nskinz_cfg_content);
}
