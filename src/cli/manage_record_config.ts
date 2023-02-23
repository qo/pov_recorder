import prompts from 'prompts';
import path from "path";
import {readFile, writeFile} from "fs/promises";
import {existsSync} from "fs";
import recording_cfg from "./interfaces/recording_cfg";

async function create_record_config() {

    const path_cfg_path = path.join(__dirname, "..", "cfg", "paths", "paths.json");
    const paths_are_configured = existsSync(path_cfg_path);

    if (!paths_are_configured)
        throw Error("Paths are not configured yet");

    const width_input = await prompts({
        type: 'number',
        name: 'value',
        message: 'Width'
    });

    const height_input = await prompts({
        type: 'number',
        name: 'value',
        message: 'Height'
    });

    const recording_fps_input = await prompts({
        type: 'number',
        name: 'value',
        message: 'Recording FPS'
    });

    const compression_factor_input = await prompts({
        type: 'number',
        name: 'value',
        message: 'Compression Factor',
        min: 1,
        max: 51
    });

    const use_resample_toggle = await prompts({
        type: 'toggle',
        name: 'value',
        message: 'Use Resample'
    });

    const resample_fps_input = await prompts({
        type: use_resample_toggle.value ? 'number' : null,
        name: 'value',
        message: 'Resample FPS'
    })

    const record_hud_separately_toggle = await prompts({
        type: 'toggle',
        name: 'value',
        message: 'Record HUD Stream'
    });

    const record_viewmodel_separately_toggle = await prompts({
        type: 'toggle',
        name: 'value',
        message: 'Record Viewmodel Stream'
    });

    const record_depth_toggle = await prompts({
        type: 'toggle',
        name: 'value',
        message: 'Record Depth Stream'
    });


    const draw_skins_toggle = await prompts({
        type: 'toggle',
        name: 'value',
        message: 'Draw Skins'
    });

    const draw_flash_toggle = await prompts({
        type: 'toggle',
        name: 'value',
        message: 'Draw Flash'
    });

    const draw_smoke_toggle = await prompts({
        type: 'toggle',
        name: 'value',
        message: 'Draw Smoke'
    });

    const skybox_input = await prompts({
        type: 'text',
        name: 'value',
        message: 'Skybox Name',
        initial: 'default'
    });

    const draw_hud_toggle = await prompts({
        type: 'toggle',
        name: 'value',
        message: 'Draw HUD'
    });
    const draw_hud = draw_hud_toggle.value;

    const draw_only_killfeed_toggle = await prompts({
        type: draw_hud ? 'toggle' : null,
        name: 'value',
        message: 'Draw killfeed only'
    });

    const show_killfeed_only_related_to_pov_player_toggle = await prompts({
        type: draw_hud ? 'toggle' : null,
        name: 'value',
        message: 'Hide all killfeed entries that are not related to POV Player'
    });

    const show_kills_of_pov_player_toggle = await prompts({
        type: draw_hud && show_killfeed_only_related_to_pov_player_toggle ? 'toggle' : null,
        name: 'value',
        message: 'Show kills of the POV Player'
    });

    const show_deaths_of_pov_player_toggle = await prompts({
        type: draw_hud && show_killfeed_only_related_to_pov_player_toggle ? 'toggle' : null,
        name: 'value',
        message: 'Show deaths of the POV Player'
    });

    const killfeed_entry_time_input = await prompts({
        type: draw_hud ? 'number' : null,
        name: 'value',
        message: 'Killfeed entry time'
    });

    const killfeed_disable_new_icons_toggle = await prompts({
        type: draw_hud ? 'toggle' : null,
        name: 'value',
        message: 'Disable new icons in killfeed'
    });

    const draw_chat_toggle = await prompts({
        type: draw_hud ? 'toggle' : null,
        name: 'value',
        message: 'Draw Chat'
    });

    const draw_radar_toggle = await prompts({
        type: draw_hud ? 'toggle' : null,
        name: 'value',
        message: 'Draw Radar'
    });

    const draw_assists_toggle = await prompts({
        type: draw_hud ? 'toggle' : null,
        name: 'value',
        message: 'Draw Assists'
    });

    const volume_input = await prompts({
        type: 'number',
        name: 'value',
        message: 'Volume',
        min: 0,
        max: 1
    });

    const voice_enable_toggle = await prompts({
        type: 'toggle',
        name: 'value',
        message: 'Enable Voice'
    });
    const voice_enable = voice_enable_toggle.value;

    const voice_scale_input = await prompts({
        type: voice_enable ? 'number' : null,
        name: 'value',
        message: 'Voice Scale',
        min: 0,
        max: 1
    });

    const c4_volume_input = await prompts({
        type: 'number',
        name: 'value',
        message: 'C4 Volume',
        min: 0,
        max: 1
    });

    const dialog_volume_input = await prompts({
        type: 'number',
        name: 'value',
        message: 'Radio Commands Volume',
        min: 0,
        max: 1
    });

    const ambient_volume_input = await prompts({
        type: 'number',
        name: 'value',
        message: 'Ambient Volume',
        min: 0,
        max: 1
    });

    const player_footsteps_volume_input = await prompts({
        type: 'number',
        name: 'value',
        message: 'POV Player\'s Footsteps Volume',
        min: 0,
        max: 1
    });

    const global_footsteps_volume_input = await prompts({
        type: 'number',
        name: 'value',
        message: 'Other Players\' Footsteps Volume',
        min: 0,
        max: 1
    });

    const gunshots_volume_input = await prompts({
        type: 'number',
        name: 'value',
        message: 'Gunshots Volume',
        min: 0,
        max: 1
    });

    const path_cfg_data = await readFile(path_cfg_path);
    const path_cfg = JSON.parse(path_cfg_data.toString());
    const migi_path = path.join(path_cfg.csgo_exe, "..", "migi");
    const migi_is_configured = existsSync(migi_path);

    if (!migi_is_configured)
        console.log("MIGI is not installed, can't use it");

    const use_migi_toggle = await prompts({
        type: migi_is_configured ? 'toggle' : null,
        name: 'value',
        message: 'Use MIGI'
    });

    const override_panorama_ui_toggle = await prompts({
        type: migi_is_configured && use_migi_toggle.value ? 'toggle' : null,
        name: 'value',
        message: 'Override Panorama UI'
    });

    const nskinz_path = path_cfg.nskinz_dll;
    const nskinz_is_configured = existsSync(nskinz_path);

    if (!nskinz_is_configured)
        console.log("nSkinz is not installed, can't use it");

    const use_nskinz_toggle = await prompts({
        type: nskinz_is_configured ? 'toggle' : null,
        name: 'value',
        message: 'Use nSkinz'
    });

    const override_nskinz_xuids_toggle = await prompts({
        type: nskinz_is_configured && use_nskinz_toggle.value ? 'toggle' : null,
        name: 'value',
        message: 'Override nSkinz XUIDs to POV Player'
    });

    const recording_config_name_input = await prompts({
        type: 'text',
        name: 'value',
        message: 'Recording Config Name'
    });

    const recording_config: recording_cfg = {
        "video_cfg": {
            "width": width_input.value,
            "height": height_input.value,
            "recording_fps": recording_fps_input.value,
            "compression_factor": compression_factor_input.value,
            "use_resample": use_resample_toggle.value,
            "resample_fps": resample_fps_input.value,
            "record_hud_separately": record_hud_separately_toggle.value,
            "record_viewmodel_separately": record_viewmodel_separately_toggle.value,
            "record_depth": record_depth_toggle.value,
        },
        "graphics_cfg": {
            "draw_skins": draw_skins_toggle.value,
            "draw_flash": draw_flash_toggle.value,
            "draw_smoke": draw_smoke_toggle.value,
            "skybox": skybox_input.value,
            "hide_players": false
        },
        "hud_cfg": {
            "draw_hud": draw_hud_toggle.value,
            "draw_only_killfeed": draw_only_killfeed_toggle.value,
            "show_killfeed_only_related_to_pov_player": show_killfeed_only_related_to_pov_player_toggle.value,
            "show_kills_of_pov_player": show_kills_of_pov_player_toggle.value,
            "show_deaths_of_pov_player": show_deaths_of_pov_player_toggle,
            "killfeed_entry_time": killfeed_entry_time_input.value,
            "killfeed_old_icons": killfeed_disable_new_icons_toggle.value,
            "draw_chat": draw_chat_toggle.value,
            "draw_radar": draw_radar_toggle.value,
            "draw_assists": draw_assists_toggle.value,
            "replace_names": false
        },
        "sound_cfg": {
            "volume": volume_input.value,
            "voice_enable": voice_enable_toggle.value,
            "voice_scale": voice_scale_input.value,
            "c4_volume": c4_volume_input.value,
            "dialog_volume": dialog_volume_input.value,
            "ambient_volume": ambient_volume_input.value,
            "player_footsteps_volume": player_footsteps_volume_input.value,
            "global_footsteps_volume": global_footsteps_volume_input.value,
            "gunshots_volume": gunshots_volume_input.value
        },
        "additional_settings": {
            "csgo_launch_options": "",
            "use_migi": use_migi_toggle.value,
            "override_panorama_ui": override_panorama_ui_toggle.value,
            "use_nskinz": use_nskinz_toggle.value,
            "override_nskinz_xuids": override_nskinz_xuids_toggle.value
        }
    };

    const recording_cfgs_path = path.join(__dirname, "..", "cfg", "recording");
    const new_recording_cfg_path = path.join(recording_cfgs_path, `${recording_config_name_input.value}.json`);

    const new_recording_cfg = JSON.stringify(recording_config, null, '\t');

    await writeFile(new_recording_cfg_path, new_recording_cfg);

}

async function edit_record_config() {
    throw new Error("Not implemented yet");
}

async function rename_record_config() {
    throw new Error("Not implemented yet");
}

async function duplicate_record_config() {
    throw new Error("Not implemented yet");
}

async function delete_record_config() {
    throw new Error("Not implemented yet");
}

async function import_record_config() {
    throw new Error("Not implemented yet");
}

async function export_record_config() {
    throw new Error("Not implemented yet");
}

export default async function manage_record_configs() {

    // Path config can only be created or edited

    const action_selection = await prompts({
        type: 'select',
        name: 'selected_action',
        message: 'What do you want to do with Recording Config?',
        choices: [
            { title: "Create Record Config", value: "create" },
            { title: "Edit Record Config", value: "edit" },
            { title: "Rename Record Config", value: "rename" },
            { title: "Duplicate Record Config", value: "duplicate" },
            { title: "Delete Record Config", value: "delete" },
            { title: "Import Record Config", value: "import" },
            { title: "Export Record Config", value: "export" },
        ]
    });

    switch(action_selection.selected_action) {
        case "create":
            await create_record_config();
            break;
        case "edit":
            await edit_record_config();
            break;
        case "rename":
            await rename_record_config();
            break;
        case "duplicate":
            await duplicate_record_config();
            break;
        case "delete":
            await delete_record_config();
            break;
        case "import":
            await import_record_config();
            break;
        case "export":
            await export_record_config();
            break;
        default:
            throw new Error("Unexpected Recording Config Action");
    }

}