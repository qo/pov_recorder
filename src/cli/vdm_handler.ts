import recording_cfg from "./interfaces/recording_cfg";
import path from "path";
import {readFile, writeFile} from "fs/promises";
import {render} from "ejs";
import vdm_entry from "./interfaces/vdm_entry";

const smoother_demos_tick = 100;
const hud_tick = 100;
const streams_tick = 100;
const settings_tick = 100;
const settings2_tick = 100;
const goto_starttick_tick = 150;
const framerate_and_folder_tick = 100;

function build_vdm(start_tick: number, end_tick: number, recording_config: recording_cfg): vdm_entry[] {

    const vdm_entries: vdm_entry[] = [];

    // Execute commands required for smoother demos
    // https://github.com/advancedfx/advancedfx/wiki/Source%3ASmoother-Demos
    vdm_entries.push({
        starttick: smoother_demos_tick,
        commands: "sv_cheats 1; host_timescale 0; mirv_snd_timescale 1; cl_clock_correction 0; mirv_fix playerAnimState 1; cl_interpolate 1;"
    });

    // Execute hud commands
    vdm_entries.push({
        starttick: hud_tick,
        commands: `cl_drawhud ${recording_config.hud_cfg.draw_hud ? "1" : "0"}; cl_chatfilters ${recording_config.hud_cfg.draw_chat ? "1" : "0"}; cl_drawhud_force_radar ${recording_config.hud_cfg.draw_radar ? "0" : "-1"}; mp_display_kill_assists ${recording_config.hud_cfg.draw_assists ? "1" : "0"}; cl_draw_only_deathnotices ${recording_config.hud_cfg.draw_only_killfeed ? "1" : "0"}; mirv_deathmsg debug 1;`
    });

    // Add streams
    // todo: depth, entity, world, other streams
    vdm_entries.push({
        starttick: streams_tick,
        commands: "mirv_streams add baseFx myStream"
    });

    // Add a ffmpeg setting
    vdm_entries.push({
        starttick: settings_tick,
        commands: `mirv_streams settings add ffmpeg myFfmpegCrf \\"-c:v libx264 -preset slow -crf ${recording_config.video_cfg.compression_factor} {QUOTE}{AFX_STREAM_PATH}\\\\video.mp4{QUOTE}\\"; mirv_streams settings add sampler mySampler; mirv_streams settings edit mySampler settings myFfmpegCrf;`
    });

    // Apply ffmpeg setting
    vdm_entries.push({
       starttick: settings2_tick,
        commands: `mirv_streams settings edit mySampler fps ${recording_config.video_cfg.resample_fps}; mirv_streams edit myStream settings mySampler;`
    });

    // Set framerate and output folder
    vdm_entries.push({
        starttick: framerate_and_folder_tick,
        commands: `host_framerate ${recording_config.video_cfg.recording_fps}; mirv_streams record name \\\"${path.join(__dirname, "..", "recordings").replaceAll("\\", "\\\\")}\\\"`
    })

    // Goto start  tick
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

export default async function create_vdm(demo_path: string, start_tick: number, end_tick: number, recording_config: recording_cfg) {

    const vdm_entries = build_vdm(start_tick, end_tick, recording_config);

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