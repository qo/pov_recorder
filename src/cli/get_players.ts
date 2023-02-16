import {createReadStream} from "fs";
import {DemoFile} from "demofile";
import Player from "./interfaces/player";
import {convert_high_low_to_full} from "./utils/convert_xuid";

export default function get_players(demo_path: string) {
    return new Promise<Player[]>((resolve, reject) => {

        const demo_stream = createReadStream(demo_path);
        const demo_file = new DemoFile();

        const players: Player[] = [];

        demo_file.on("start", e => console.log("Started parsing..."));
        demo_file.stringTables.on("update", e => {
            if (e.table.name === "userinfo" && e.userData != null && !e.userData.fakePlayer && !e.userData.isHltv) {
                const currentPlayer = {
                    name: e.userData.name,
                    xuid: convert_high_low_to_full({
                        high: e.userData.xuid.high,
                        low: e.userData.xuid.low}
                    ),
                    low: e.userData.xuid.low,
                    high: e.userData.xuid.high
                };
                if (players.every(player => player.xuid !== currentPlayer.xuid))
                    players.push(currentPlayer);
            }
        });
        demo_file.on("end", e => {
            console.log("Finished parsing.")
            resolve(players);
        });

        demo_file.parseStream(demo_stream);

    })
}