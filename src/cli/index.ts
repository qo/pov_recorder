import prompts from 'prompts';
import record from "./record";
import * as path from "path";
import {existsSync} from "fs";
import manage_configs from "./manage_configs";
import select from "./select";

(async function () {

    const path_cfg_path = path.join(__dirname, "..", "cfg", "paths", "paths.json");
    const paths_are_configured = existsSync(path_cfg_path);

    if (!paths_are_configured)
        console.log(
            `Paths are not configured yet.
            Record will be unavailable until paths are configured.`
        )

    const action =
        await select(
            'What do you want to do?',
            [
                { title: "Manage configs", value: "manage-configs" },
                { title: "Record", value: "record", disabled: !paths_are_configured }
            ]
        );

    if (action === "manage-configs")
        await manage_configs(paths_are_configured);

    else if (action === "record")
        await record();

    else
        throw new Error("Unexpected action type (neither manage-configs nor record)");

})();
