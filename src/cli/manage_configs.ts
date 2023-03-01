import prompts from 'prompts';
import manage_path_config from "./manage_path_config";
import manage_record_configs from "./manage_record_config";
import select from "./select";

export default async function manage_configs(paths_are_configured: boolean) {

    const cfg_type =
        await select(
            'What do you want to configure?',
            [
                { title: "Paths config", value: "paths-cfg" },
                { title: "Record config", value: "record-cfg", disabled: !paths_are_configured }
            ]
        )

    if (cfg_type === "paths-cfg")
        await manage_path_config({ paths_are_configured });

    else if (cfg_type === "record-cfg")
        await manage_record_configs();

    else
        throw new Error("Unexpected config type");
}
