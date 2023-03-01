import path from "path";
import read_json from "./read_json";

export default async function get_path_cfg() {
    const path_cfg_directory = path.join(__dirname, "..", "cfg", "paths");
    return await read_json(path_cfg_directory, "paths.json");
}
