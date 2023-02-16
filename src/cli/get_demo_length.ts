import {createReadStream} from "fs";
import {DemoFile} from "demofile";

export default function get_demo_length(demo_path: string) {
    return new Promise<number>((resolve, reject) => {
        const demo_stream = createReadStream(demo_path);
        const demo_file = new DemoFile();
        demo_file.on("start", e => resolve(demo_file.header.playbackTicks));
        demo_file.parseStream(demo_stream);
    })
}