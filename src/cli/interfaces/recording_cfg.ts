export default interface recording_cfg {
    "video_cfg": {
        "width": number,
        "height": number,
        "recording_fps": number,
        "compression_factor": number,
        "use_resample": boolean,
        "resample_fps": number,
        "record_hud_separately": boolean,
        "record_viewmodel_separately": boolean,
        "record_depth": boolean
    },
    "graphics_cfg": {
        "draw_skins": boolean,
        "draw_flash": boolean,
        "draw_smoke": boolean,
        "skybox": string,
        "hide_players": boolean
    },
    "hud_cfg": {
        "draw_hud": boolean,
        "draw_only_killfeed": boolean,
        "show_killfeed_only_related_to_pov_player": boolean,
        "show_kills_of_pov_player": boolean,
        "show_deaths_of_pov_player": boolean,
        "killfeed_entry_time": number,
        "killfeed_old_icons": boolean,
        "draw_chat": boolean,
        "draw_radar": boolean,
        "draw_assists": boolean,
        "replace_names": boolean
    },
    "sound_cfg": {
        "volume": number,
        "voice_enable": number,
        "voice_scale": number,
        "c4_volume": number,
        "dialog_volume": number,
        "ambient_volume": number,
        "player_footsteps_volume": number,
        "global_footsteps_volume": number,
        "gunshots_volume": number
    },
    "additional_settings": {
        "csgo_launch_options": string,
        "use_migi": boolean,
        "override_panorama_ui": boolean,
        "use_nskinz": boolean,
        "override_nskinz_xuids": boolean
    }
}