#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import { isAbsolute, relative, resolve } from "node:path";

import { createClient } from "@supabase/supabase-js";

const PROJECT_URL = "https://tzhjdxewkwjftuofaelk.supabase.co";
const BUCKET = "university-logos";
const CACHE_SECONDS = "31536000";
const CONCURRENCY = 8;

function readOption(name) {
  const index = process.argv.indexOf(name);
  const value = index >= 0 ? process.argv[index + 1] : undefined;
  if (!value) throw new Error(`Missing required option: ${name}`);
  return value;
}

function resolveLocalAsset(root, file) {
  if (typeof file !== "string" || !file) throw new Error("Manifest logo filename is missing.");
  const target = resolve(root, file);
  const pathFromRoot = relative(root, target);
  if (pathFromRoot.startsWith("..") || isAbsolute(pathFromRoot)) {
    throw new Error(`Manifest logo filename escapes the asset directory: ${file}`);
  }
  return target;
}

function storageObjectPath(item) {
  const path = item.storage_path ?? (item.storage_file ? `v1/${item.storage_file}` : undefined);
  if (typeof path !== "string" || !path || path.startsWith("/") || path.includes("..")) {
    throw new Error("Manifest storage path is missing or unsafe.");
  }
  return path;
}

async function main() {
  const keyFile = resolve(readOption("--key-file"));
  const manifestFile = resolve(readOption("--manifest"));
  const logoDirectory = resolve(readOption("--directory"));
  const serviceKey = (await readFile(keyFile, "utf8")).trim();
  const manifest = JSON.parse(await readFile(manifestFile, "utf8"));

  if (!serviceKey || !Array.isArray(manifest) || manifest.length === 0) {
    throw new Error("The service key or logo manifest is empty.");
  }

  const supabase = createClient(PROJECT_URL, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const failures = [];
  let uploaded = 0;

  for (let start = 0; start < manifest.length; start += CONCURRENCY) {
    const batch = manifest.slice(start, start + CONCURRENCY);
    const results = await Promise.all(
      batch.map(async (item) => {
        const localFile = item.local_file ?? item.storage_file;
        const objectPath = storageObjectPath(item);
        const contents = await readFile(resolveLocalAsset(logoDirectory, localFile));
        const { error } = await supabase.storage.from(BUCKET).upload(objectPath, contents, {
          cacheControl: CACHE_SECONDS,
          contentType: item.content_type,
          upsert: true,
        });
        return { file: localFile, objectPath, error };
      }),
    );

    for (const result of results) {
      if (result.error) {
        failures.push(`${result.file} -> ${result.objectPath}: ${result.error.message}`);
      } else uploaded += 1;
    }
    process.stdout.write(`\rUploaded ${uploaded}/${manifest.length}`);
  }

  process.stdout.write("\n");
  if (failures.length > 0) {
    throw new Error(`Upload failures:\n${failures.join("\n")}`);
  }
}

await main();
