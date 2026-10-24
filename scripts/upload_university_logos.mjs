#!/usr/bin/env node

import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { basename, join, resolve } from "node:path";

function option(name, fallback) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : fallback;
}

const bucket = option("--bucket", "dekhocampus-online-assets");
const profile = option("--profile", "chetan-deploy");
const manifestPath = resolve(option("--manifest", "data/university-logo-manifest.json"));
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
if (!Array.isArray(manifest) || !manifest.length) throw new Error("Logo manifest is empty.");

const directory = await mkdtemp(join(tmpdir(), "dekhocampus-r2-"));
try {
  let uploaded = 0;
  for (const item of manifest) {
    if (
      typeof item.public_url !== "string" ||
      typeof item.storage_path !== "string" ||
      item.storage_path.includes("..")
    ) {
      throw new Error(`Unsafe logo manifest entry: ${item.slug ?? "unknown"}`);
    }
    const response = await fetch(item.public_url);
    if (!response.ok) throw new Error(`Could not download ${item.public_url}: ${response.status}`);
    const contents = Buffer.from(await response.arrayBuffer());
    const digest = createHash("sha256").update(contents).digest("hex");
    if (item.sha256 && digest !== item.sha256) {
      throw new Error(`Checksum mismatch for ${item.public_url}`);
    }
    const localPath = join(directory, basename(item.storage_path));
    await writeFile(localPath, contents);
    execFileSync(
      "npx",
      [
        "wrangler",
        "r2",
        "object",
        "put",
        `${bucket}/university-logos/${item.storage_path}`,
        "--remote",
        "--profile",
        profile,
        "--file",
        localPath,
        "--content-type",
        item.content_type || "application/octet-stream",
        "--cache-control",
        "public, max-age=31536000, immutable",
      ],
      { stdio: "inherit" },
    );
    uploaded += 1;
    process.stdout.write(`\rUploaded ${uploaded}/${manifest.length}`);
  }
  process.stdout.write("\n");
} finally {
  await rm(directory, { recursive: true, force: true });
}
