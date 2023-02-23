import recording_cfg from "./interfaces/recording_cfg";
import path from "path";
import {readFile, writeFile} from "fs/promises";
import {render} from "ejs";
import vdm_entry from "./interfaces/vdm_entry";
import {unlinkSync} from "fs";
import split_commands from "./utils/split_commands";
import escape from "./utils/escape";

const setup_commands_tick = 100;
const goto_starttick_tick = 150;

function get_setup_commands(start_tick: number, end_tick: number, recording_config: recording_cfg, pov_player_xuid: string, pov_player_uid: number): string {

    let commands = "";

    // Unblock all commands
    commands += "sv_cheats 1; mirv_cvar_unhide_all;"

    // Add commands for smoother demos
    // https://github.com/advancedfx/advancedfx/wiki/Source%3ASmoother-Demos
    commands += "host_timescale 0; mirv_snd_timescale 1; cl_clock_correction 0; mirv_fix playerAnimState 1; cl_interpolate 1;"

    // Add hud options
    commands += `cl_drawhud ${recording_config.hud_cfg.draw_hud ? "1" : "0"}; cl_chatfilters ${recording_config.hud_cfg.draw_chat ? "1" : "0"}; cl_drawhud_force_radar ${recording_config.hud_cfg.draw_radar ? "0" : "-1"}; mp_display_kill_assists ${recording_config.hud_cfg.draw_assists ? "1" : "0"}; cl_draw_only_deathnotices ${recording_config.hud_cfg.draw_only_killfeed ? "1" : "0"}; mirv_deathmsg debug 1; mirv_deathmsg cfg noticeLifeTime ${recording_config.hud_cfg.killfeed_entry_time};`
    if (recording_config.hud_cfg.show_killfeed_only_related_to_pov_player)
        commands += `mirv_deathmsg block ${recording_config.hud_cfg.show_kills_of_pov_player ? `!${pov_player_uid}` : "*"} ${recording_config.hud_cfg.show_deaths_of_pov_player ? `!${pov_player_uid}` : "*"};`;
    if (recording_config.hud_cfg.killfeed_old_icons)
        commands += "mirv_deathmsg filter add noscope=0 thrusmoke=0 attackerblind=0;";

    // Add base ffmpeg setting
    commands += `mirv_streams settings add ffmpeg myFfmpegCrf "-c:v libx264 -preset slow -crf ${recording_config.video_cfg.compression_factor} {QUOTE}{AFX_STREAM_PATH}\\video.mp4{QUOTE}";`;

    // Add resample setting
    if (recording_config.video_cfg.use_resample)
        commands += `mirv_streams settings add sampler mySampler; mirv_streams settings edit mySampler settings myFfmpegCrf; mirv_streams settings edit mySampler fps ${recording_config.video_cfg.resample_fps};`

    const ffmpegSetting = recording_config.video_cfg.use_resample ? "myFfmpegCrf" : "mySampler";

    // Add game stream
    commands += "mirv_streams add baseFx game;";
    if (recording_config.video_cfg.record_hud_separately)
        commands += "mirv_streams edit game drawHud 0;";
    if (recording_config.video_cfg.record_viewmodel_separately)
        commands += "mirv_streams edit game drawViewModel 0;";
    commands += `mirv_streams edit game settings ${ffmpegSetting};`;

    // Add depth stream
    if (recording_config.video_cfg.record_depth)
        commands += `mirv_streams add depth depth; mirv_streams edit depth drawHud 0; mirv_streams edit depth drawViewModel 0; mirv_streams edit depth clientEffectTexturesAction noDraw; mirv_streams edit depth worldTexturesAction debugDepth; mirv_streams edit depth skyBoxTexturesAction noDraw; mirv_streams edit depth staticPropTexturesAction debugDepth; mirv_streams edit depth cableAction noDraw; mirv_streams edit depth playerModelsAction debugDepth; mirv_streams edit depth weaponModelsAction debugDepth; mirv_streams edit depth statTrakAction debugDepth; mirv_streams edit depth shellModelsAction debugDepth; mirv_streams edit depth otherModelsAction debugDepth; mirv_streams edit depth decalTexturesAction noDraw; mirv_streams edit depth effectsAction noDraw; mirv_streams edit depth shellParticleAction noDraw; mirv_streams edit depth otherParticleAction noDraw; mirv_streams edit depth stickerAction noDraw; mirv_streams edit depth errorMaterialAction debugDepth; mirv_streams edit depth otherAction debugDepth; mirv_streams edit depth settings ${ffmpegSetting};`;

    // Add hud stream
    if (recording_config.video_cfg.record_hud_separately)
        commands += `mirv_streams add hudBlack hudBlack; mirv_streams add hudWhite hudWhite; mirv_streams edit hudBlack settings ${ffmpegSetting}; mirv_streams edit hudWhite settings ${ffmpegSetting};`;

    // Add viewmodel stream
    if (recording_config.video_cfg.record_viewmodel_separately)
        commands += `mirv_streams add baseFx viewmodel; mirv_streams edit viewmodel actionFilter clear; mirv_streams edit viewmodel actionFilter addEx "className=predicted_viewmodel" "action=draw"; mirv_streams edit viewmodel actionFilter addEx "name=vgui_\\*" "action=draw"; mirv_streams edit viewmodel actionFilter addEx "name=dev/glow_\\*" "action=noDraw"; mirv_streams edit viewmodel actionFilter addEx "name=dev/halo_\\*" "action=noDraw"; mirv_streams edit viewmodel actionFilter addEx "name=particle/\\*" "action=noDraw"; mirv_streams edit viewmodel actionFilter addEx "name=engine/\\*" "action=draw"; mirv_streams edit viewmodel actionFilter addEx "name=dev/\\*" "action=draw"; mirv_streams edit viewmodel actionFilter addEx "textureGroup=SkyBox textures" "action=mask"; mirv_streams edit viewmodel actionFilter addEx "action=noDraw"; mirv_streams edit viewmodel drawHud 0; mirv_streams edit viewmodel settings ${ffmpegSetting};`

    // Add graphics settings
    commands += `cl_custom_material_override ${recording_config.graphics_cfg.draw_skins ? 1 : 0}; mat_suppress effects/flashbang.vmt; mat_suppress effects/flashbang_white.vmt;`
    if (!recording_config.graphics_cfg.draw_smoke) {
        commands += "mirv_streams edit myStream actionFilter add \"particle/vistasmokev1/vistasmokev1\" noDraw; mirv_streams edit myStream actionFilter add \"particle/vistasmokev1/vistasmokev1_smokegrenade\" noDraw; mirv_streams edit myStream actionFilter add \"particle/vistasmokev1/vistasmokev1_emods\" noDraw; mirv_streams edit myStream actionFilter add \"particle/vistasmokev1/vistasmokev1_emods_impactdust\" noDraw; mirv_streams edit myStream actionFilter add \"particle/vistasmokev1/vistasmokev1_fire\" noDraw; mirv_streams edit myStream actionFilter add \"effects/overlaysmoke\" noDraw; mirv_streams edit myStream smokeOverlayAlphaFactor 0;"
    }

    // Add sound settings
    commands += `volume ${recording_config.sound_cfg.volume}; voice_enable ${recording_config.sound_cfg.voice_enable ? "1" : "0"}; voice_scale ${recording_config.sound_cfg.voice_scale}; snd_setmixer dialog vol ${recording_config.sound_cfg.dialog_volume}; snd_setmixer c4 vol ${recording_config.sound_cfg.c4_volume}; snd_setmixer ambient vol ${recording_config.sound_cfg.ambient_volume}; snd_setmixer playerfootsteps vol ${recording_config.sound_cfg.player_footsteps_volume}; snd_setmixer globalfootsteps vol ${recording_config.sound_cfg.global_footsteps_volume}; snd_setmixer weapon vol ${recording_config.sound_cfg.gunshots_volume};`

    // Add framerate and recording folder settings
    commands += `host_framerate ${recording_config.video_cfg.recording_fps}; mirv_streams record name "${path.join(__dirname, "..", "recordings")}"`;

    return commands;

}

function build_vdm(start_tick: number, end_tick: number, recording_config: recording_cfg, pov_player_xuid: string, pov_player_uid: number): vdm_entry[] {

    const vdm_entries: vdm_entry[] = [];

    const setup_commands = split_commands(
        get_setup_commands(start_tick, end_tick, recording_config, pov_player_xuid, pov_player_uid)
    );

    setup_commands.forEach(
        command => vdm_entries.push({
            starttick: setup_commands_tick,
            commands: escape(command)
        })
    );

    // Goto start tick
    vdm_entries.push({
        starttick: goto_starttick_tick,
        commands: `demo_gototick ${start_tick}`
    });

    // Start recording
    vdm_entries.push({
        starttick: start_tick,
        commands: "mirv_streams record start"
    });

    // Stop recording, exit
    vdm_entries.push({
        starttick: end_tick,
        commands: "mirv_streams record end; exit;"
    });

    return vdm_entries;
}

export async function create_vdm(demo_path: string, start_tick: number, end_tick: number, recording_config: recording_cfg, pov_player_xuid: string, pov_player_uid: number) {

    const vdm_entries = build_vdm(start_tick, end_tick, recording_config, pov_player_xuid, pov_player_uid);

    const template_path = path.join(__dirname, "..", "src", "cli", "templates", "vdm.ejs");
    const template = (await readFile(template_path))
        .toString();
    const vdm_content = render(template, { vdm_entries: vdm_entries });

    const demo_dir = path.parse(demo_path).dir;
    const demo_name = path.parse(demo_path).name;
    const vdm_path = path.join(demo_dir, `${demo_name}.vdm`);
    await writeFile(vdm_path, vdm_content);

    console.log(`${vdm_path} created.`);

}

export async function delete_vdm(demo_path: string) {
    const demo_dir = path.parse(demo_path).dir;
    const demo_name = path.parse(demo_path).name;
    const vdm_path = path.join(demo_dir, `${demo_name}.vdm`);
    await unlinkSync(vdm_path);
}