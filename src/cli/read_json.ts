import path from "path";
import {readFile} from "fs/promises";

export default async function read_json(dir: string, name: string) {
    const _path = path.join(dir, name);
    const data = await readFile(_path);
    return JSON.parse(data.toString());
}
