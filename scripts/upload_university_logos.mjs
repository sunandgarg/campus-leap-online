#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

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
        const contents = await readFile(resolve(logoDirectory, item.storage_file));
        const { error } = await supabase.storage
          .from(BUCKET)
          .upload(`v1/${item.storage_file}`, contents, {
            cacheControl: CACHE_SECONDS,
            contentType: item.content_type,
            upsert: true,
          });
        return { file: item.storage_file, error };
      }),
    );

    for (const result of results) {
      if (result.error) failures.push(`${result.file}: ${result.error.message}`);
      else uploaded += 1;
    }
    process.stdout.write(`\rUploaded ${uploaded}/${manifest.length}`);
  }

  process.stdout.write("\n");
  if (failures.length > 0) {
    throw new Error(`Upload failures:\n${failures.join("\n")}`);
  }
}

await main();
