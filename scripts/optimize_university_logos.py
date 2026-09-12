#!/usr/bin/env python3
"""Create web-ready university logos and update their audit manifest.

Raster marks are capped at 1080 px and encoded as high-quality WebP. SVG marks
stay vector so they remain sharp at every density. Source provenance remains
unchanged; only delivery metadata and checksums are updated.
"""

from __future__ import annotations

import argparse
import concurrent.futures
import hashlib
import json
import shutil
import subprocess
from pathlib import Path


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("source_dir", type=Path)
    parser.add_argument("manifest_path", type=Path)
    parser.add_argument("output_dir", type=Path)
    parser.add_argument("output_manifest", type=Path)
    parser.add_argument("--max-side", type=int, default=1080)
    parser.add_argument("--workers", type=int, default=6)
    args = parser.parse_args()

    rows = json.loads(args.manifest_path.read_text())
    if len(rows) != 140 or any(row.get("status") != "resolved" for row in rows):
        raise SystemExit("All 140 source logos must be resolved before optimization")
    args.output_dir.mkdir(parents=True, exist_ok=True)

    def optimize(row: dict[str, object]) -> None:
        source = args.source_dir / row["storage_file"]
        if row["content_type"] == "image/svg+xml":
            target = args.output_dir / source.name
            shutil.copy2(source, target)
        else:
            width = int(row["width"])
            height = int(row["height"])
            scale = min(1.0, args.max_side / max(width, height))
            target_width = max(1, round(width * scale))
            target_height = max(1, round(height * scale))
            target = args.output_dir / f"{source.stem}.webp"
            command = [
                "cwebp",
                "-quiet",
                "-mt",
                "-m",
                "3",
                "-q",
                "92",
                "-alpha_q",
                "100",
            ]
            if scale < 1.0:
                command.extend(["-resize", str(target_width), str(target_height)])
            command.extend([str(source), "-o", str(target)])
            subprocess.run(command, check=True)
            row["storage_file"] = target.name
            row["content_type"] = "image/webp"
            row["width"] = target_width
            row["height"] = target_height

        row["size_bytes"] = target.stat().st_size
        row["sha256"] = hashlib.sha256(target.read_bytes()).hexdigest()

    with concurrent.futures.ThreadPoolExecutor(max_workers=args.workers) as executor:
        list(executor.map(optimize, rows))

    args.output_manifest.write_text(json.dumps(rows, ensure_ascii=False, indent=2) + "\n")
    total = sum(row["size_bytes"] for row in rows)
    print(f"Optimized 140 logos to {total / 1024 / 1024:.2f} MiB")


if __name__ == "__main__":
    main()
