import { execFileSync, spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

/**
 * Final render: a 240 fps master (4 subframes per 60 fps frame), blended with
 * ffmpeg tmix into 60 fps motion blur, then the deliverables.
 *
 *   node scripts/render.ts <CompositionId> <file-name> --duration 26.25 --poster 25 --out out/<film>/v1
 *
 * The composition must take `fps` as a prop (calculateMetadata sets fps and
 * durationInFrames from it). ffmpeg comes from imageio-ffmpeg in the local .venv:
 * Remotion's own build has no tmix or select filters. The big intermediate files go to
 * the system temp folder, so they stay out of the repo and out of OneDrive.
 */
const args = process.argv.slice(2);
const flag = (name: string) => {
  const index = args.indexOf(name);
  return index === -1 ? undefined : args[index + 1];
};
const [composition, name] = args;
const duration = Number(flag("--duration"));
const posterSeconds = Number(flag("--poster") ?? duration / 2);
const concurrency = flag("--concurrency") ?? "8";
if (!composition || !name || !duration || !flag("--out")) {
  throw new Error("Usage: node scripts/render.ts <CompositionId> <file-name> --duration <s> --out <dir> [--poster <s>] [--concurrency <n>]");
}

const root = resolve(import.meta.dirname, "..");
const out = resolve(root, flag("--out")!);
const work = mkdtempSync(join(tmpdir(), "portfolio-film-"));
mkdirSync(out, { recursive: true });
const run = (command: string, list: string[]) => execFileSync(command, list, { cwd: root, stdio: "inherit" });
const remotion = (list: string[]) => run(process.execPath, ["node_modules/@remotion/cli/remotion-cli.js", ...list]);
const python = join(root, ".venv", "Scripts", "python.exe");
const ffmpeg = execFileSync(python, ["-c", "import imageio_ffmpeg as i; print(i.get_ffmpeg_exe())"], { encoding: "utf8" }).trim();

// `--master` and `--audio` reuse the files of an earlier run and skip steps 1 and 2
const reuse = flag("--master");
const master = reuse ? resolve(reuse) : join(work, "master-240.mp4");
const audio = flag("--audio") ? resolve(flag("--audio")!) : join(work, "audio.wav");
const withMusic = join(out, `${name}-1080p60-audio.mp4`);
const muted = join(out, `${name}-1080p60.mp4`);

if (!reuse) {
  // 1. The 240 fps master: lossless-ish PNG frames, 4:4:4 so fine textures keep their edges. No audio.
  remotion(["render", "src/index.ts", composition, master, "--props", JSON.stringify({ fps: 240, debug: false }), "--codec", "h264", "--crf", "12", "--pixel-format", "yuv444p", "--image-format", "png", "--muted", "--concurrency", concurrency, "--log", "error"]);

  // 2. The mix, once, at 60 fps (audio does not depend on fps).
  remotion(["render", "src/index.ts", composition, audio, "--codec", "wav", "--log", "error"]);
}

// 3. Motion blur and the film with music, with no ProRes intermediate, which keeps
//    disk use low: average each group of 4 subframes, keep one per group -> 60 fps.
//    Read the master's real range from its tags: reading full range as limited, or the
//    other way around, shifts every color. Out: BT.709 limited range. The colorspace filter
//    keeps grays neutral; scale's matrix change tinted #121212 to (14, 16, 16).
const probe = spawnSync(ffmpeg, ["-hide_banner", "-i", master], { encoding: "utf8" }).stderr;
const range = /yuvj|\(pc[,)]/.test(probe) ? "pc" : "tv";
console.log(`master range: ${range}`);
const h264 = ["-c:v", "libx264", "-preset", "slow", "-crf", "18", "-pix_fmt", "yuv420p", "-x264-params", "colorprim=bt709:transfer=bt709:colormatrix=bt709", "-color_primaries", "bt709", "-color_trc", "bt709", "-colorspace", "bt709", "-color_range", "tv", "-movflags", "+faststart", "-r", "60"];
run(ffmpeg, [
  "-v", "error", "-y", "-i", master, "-i", audio,
  "-filter_complex", `[0:v]tmix=frames=4:weights='1 1 1 1',select='not(mod(n+1\\,4))',setpts=N/(60*TB),colorspace=all=bt709:iall=bt601-6-625:irange=${range}:range=tv:format=yuv444p,format=yuv420p[film]`,
  "-map", "[film]", "-map", "1:a", ...h264, "-c:a", "aac", "-b:a", "256k", "-shortest", withMusic,
]);

// 4. The muted copy shares the same video stream, so the two never differ.
run(ffmpeg, ["-v", "error", "-y", "-i", withMusic, "-map", "0:v", "-c:v", "copy", "-an", "-movflags", "+faststart", muted]);

// 5. The poster, from the finished film. JPEG wants full range, so convert it there.
run(ffmpeg, ["-v", "error", "-y", "-ss", String(posterSeconds), "-i", withMusic, "-frames:v", "1", "-vf", "scale=in_range=tv:out_range=pc,format=yuvj420p", "-q:v", "2", join(out, "poster.jpg")]);

rmSync(work, { recursive: true, force: true });
for (const file of [`${name}-1080p60-audio.mp4`, `${name}-1080p60.mp4`, "poster.jpg"]) {
  console.log(`${file}: ${(statSync(join(out, file)).size / 1e6).toFixed(1)} MB`);
}
