export default interface recording_cfg {
    "video_cfg": {
        "width": number,
        "height": number,
        "recording_fps": number,
        "compression_factor": number,
        "use_resample": boolean,
        "resample_fps": number
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
        "block_killfeed_except_for_the_pov_player": boolean,
        "killfeed_entry_time": 10,
        "killfeed_old_icons": boolean,
        "draw_chat": boolean,
        "draw_radar": boolean,
        "draw_assists": boolean,
        "replace_names": boolean
    },
    "sound_cfg": {
        "volume": number,
        "voice_enable": number,
        "c4_volume": number,
        "dialog_volume": number,
        "ambient_volume": number,
        "player_footsteps_volume": number,
        "global_footsteps_volume": number
    },
    "additional_settings": {
        "csgo_launch_options": string,
        "use_migi": boolean,
        "override_panorama_ui": boolean,
        "use_nskinz": boolean,
        "modify_nskinz_config": boolean
    }
}