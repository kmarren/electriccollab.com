#!/usr/bin/env node
/**
 * Downloads the homepage's images and videos from the Squarespace CDN into this
 * repo, as listed in scripts/squarespace-assets.json.
 *
 * Squarespace CDN URLs stop working once the Squarespace subscription ends, so
 * every asset the site uses must live in the repo.
 *
 * - Images are fetched at original resolution (no `?format=` param). Images in
 *   src/assets/ are optimized at build time by astro:assets.
 * - Videos are only served as HLS streams, so ffmpeg remuxes the 1080p rendition
 *   into scripts/.cache/ (gitignored), then encodes a web MP4 at the width the
 *   page actually needs (`width` in the manifest; ~2× the largest display size).
 *   Audio is dropped because the videos autoplay muted. The Squarespace
 *   thumbnail is saved as the poster image.
 *
 * Usage:
 *   node scripts/fetch-squarespace-assets.mjs           # skip files that exist
 *   node scripts/fetch-squarespace-assets.mjs --force   # re-download everything
 *
 * Requires Node 22+ and ffmpeg on PATH (for videos).
 */
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const manifest = JSON.parse(await readFile(resolve(root, 'scripts/squarespace-assets.json'), 'utf8'));
const force = process.argv.includes('--force');

async function download(url, dest) {
  const out = resolve(root, dest);
  if (!force && existsSync(out)) return console.log(`skip  ${dest}`);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} — ${url}`);
  await mkdir(dirname(out), { recursive: true });
  await writeFile(out, Buffer.from(await res.arrayBuffer()));
  console.log(`saved ${dest}`);
}

/** Resolve the variant playlist (e.g. 1080:1350) from the HLS master playlist. */
async function variantPlaylist(masterUrl, variant) {
  const text = await (await fetch(masterUrl)).text();
  const line = text.split('\n').find((l) => l.includes(`mpegts-h264-${variant}.m3u8`));
  if (!line) throw new Error(`Variant ${variant} not found in ${masterUrl}`);
  return line.trim();
}

async function downloadVideo({ playlist, thumbnail, variant, dest, width }) {
  const mp4 = `${dest}.mp4`;
  const out = resolve(root, mp4);
  // Cache key includes the folder so same-named clips from different projects don't collide.
  const cacheName = dest.replace(/^public\/videos\//, '').replaceAll('/', '--');
  const master = resolve(root, 'scripts/.cache', `${cacheName}-${variant.replace(':', 'x')}.mp4`);
  const encode = force || !existsSync(out);

  if (encode && !existsSync(master)) {
    await mkdir(dirname(master), { recursive: true });
    const source = await variantPlaylist(playlist, variant);
    execFileSync(
      'ffmpeg',
      // Squarespace segment URLs have no file extension, which ffmpeg rejects by default.
      ['-y', '-loglevel', 'error', '-extension_picky', '0', '-i', source, '-c:v', 'copy', '-an', master],
      { stdio: 'inherit' },
    );
  }

  if (encode) {
    await mkdir(dirname(out), { recursive: true });
    execFileSync(
      'ffmpeg',
      ['-y', '-loglevel', 'error', '-i', master, '-vf', `scale=${width}:-2`, '-c:v', 'libx264', '-preset', 'slow',
        '-crf', '23', '-pix_fmt', 'yuv420p', '-an', '-movflags', '+faststart', out],
      { stdio: 'inherit' },
    );
    console.log(`saved ${mp4} (${width}px wide)`);
  } else {
    console.log(`skip  ${mp4}`);
  }
  await download(thumbnail, `${dest}.jpg`);
}

let failures = 0;
for (const file of manifest.files) {
  try {
    await download(file.url, file.dest);
  } catch (err) {
    failures++;
    console.error(`FAIL  ${file.dest}: ${err.message}`);
  }
}
for (const video of manifest.videos) {
  try {
    await downloadVideo(video);
  } catch (err) {
    failures++;
    console.error(`FAIL  ${video.dest}: ${err.message}`);
  }
}

if (failures) {
  console.error(`\n${failures} asset(s) failed.`);
  process.exit(1);
}
