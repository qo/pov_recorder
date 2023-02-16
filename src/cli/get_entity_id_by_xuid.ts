import {DemoFile, Player} from "demofile";
import {createReadStream} from "fs";

export default function get_entity_id_by_xuid(xuid: BigInt, demo_path: string, start_tick: number, end_tick: number) {

    return new Promise<number>((resolve, reject) => {

        /*
        * It is known that in non-official demos
        * (i.e. faceit) mirv_pov value for
        * the same player may change
        * as the player reconnects.
        * That's why I'm storing all entityIds
        * that user had throughout the match
        * */

        const demo_stream = createReadStream(demo_path);
        const demo_file = new DemoFile();

        let entity_ids_for_provided_xuid: {
            entity_id: number,
            start_tick: number,
            end_tick: number
        }[] = [];
        let entity_ids_for_provided_xuid_and_ticks = entity_ids_for_provided_xuid;

        demo_file.on("start", e => console.log("Started parsing..."));

        // todo: change e type
        demo_file.entities.on("create", (e: any) => {

            // We're only interested in player entities being created.
            if (!(e.entity instanceof Player)) return;

            // We're only interested in player with provided steamId
            if (e.entity.steam64Id !== xuid.toString()) return;

            // handle endTick on "player_disconnect" game event
            entity_ids_for_provided_xuid.push({
                entity_id: e.entity.index,
                start_tick: demo_file.currentTick,
                end_tick: demo_file.header.playbackTicks
            })

        });

        // handle endTick here
        demo_file.gameEvents.on("player_disconnect", e => {

            if (!e.player || e.player.steam64Id !== xuid.toString()) return;

            entity_ids_for_provided_xuid[entity_ids_for_provided_xuid.length-1].end_tick =
                demo_file.currentTick;
        });

        demo_file.on("end", e => {
            if (!entity_ids_for_provided_xuid.length)
                throw Error("No player with such SteamID was found");

            entity_ids_for_provided_xuid_and_ticks = entity_ids_for_provided_xuid.filter(
                entry =>
                    (start_tick > entry.start_tick)
                    &&
                    (end_tick < entry.end_tick)
            );

            if (!entity_ids_for_provided_xuid_and_ticks.length)
                throw Error("Player with such SteamID was not on the server in provided time");

            else if (entity_ids_for_provided_xuid_and_ticks.length !== 1)
                throw Error("Unexpected error - entityIdsForProvidedTicks returned more than one entry");

            const pov = entity_ids_for_provided_xuid_and_ticks[0].entity_id;

            console.log("Finished parsing.");

            return resolve(pov);
        })

        // Start parsing the stream now that we've added our event listeners
        // @ts-ignore
        demo_file.parseStream(demo_stream);

    })
};