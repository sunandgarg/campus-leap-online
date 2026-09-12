#!/usr/bin/env python3
"""Resolve and download high-quality university logos with an audit manifest.

The resolver prefers the Wikidata logo property (P154), then a tightly-scored
Wikimedia Commons file search. It never accepts a generic page image, campus
photo, or low-resolution favicon. Ambiguous records remain unresolved so the
website can use its deterministic initials fallback.
"""

from __future__ import annotations

import argparse
import concurrent.futures
import csv
import hashlib
import html as html_lib
import json
import base64
import re
import threading
import time
import unicodedata
import urllib.error
import urllib.parse
import urllib.request
from html.parser import HTMLParser
from pathlib import Path
from typing import Any


USER_AGENT = "DekhoCampusUniversityDirectory/1.0 (https://dekhocampus.com/)"
WIKIDATA_API = "https://www.wikidata.org/w/api.php"
COMMONS_API = "https://commons.wikimedia.org/w/api.php"
ENWIKI_API = "https://en.wikipedia.org/w/api.php"
SUPPORTED_MIME = {
    "image/svg+xml": ".svg",
    "image/png": ".png",
    "image/webp": ".webp",
    "image/jpeg": ".jpg",
}
STOP_WORDS = {
    "and",
    "deemed",
    "for",
    "higher",
    "institute",
    "institution",
    "of",
    "research",
    "science",
    "sciences",
    "technology",
    "the",
    "to",
    "university",
    "vidyapeeth",
}
LOGO_WORDS = ("logo", "crest", "seal", "emblem", "insignia", "mark")
REJECT_WORDS = (
    "campus",
    "building",
    "convocation",
    "gate",
    "hostel",
    "map",
    "photo",
    "portrait",
    "view",
)
REJECT_DOMAINS = {
    "bing.com",
    "careerbracket.com",
    "careers360.com",
    "collegevidya.com",
    "facebook.com",
    "findmycollege.com",
    "instagram.com",
    "learningroutes.in",
    "linkedin.com",
    "onlineadmission.college",
    "scribd.com",
    "shiksha.com",
    "twitter.com",
    "wikipedia.org",
    "x.com",
    "youtube.com",
}
_ENTITY_CACHE: dict[str, tuple[float, dict[str, Any], dict[str, Any]] | None] = {}
_ENTITY_CACHE_LOCK = threading.Lock()


def http_json(url: str, params: dict[str, str], attempts: int = 6) -> dict[str, Any]:
    query = urllib.parse.urlencode(params)
    request = urllib.request.Request(f"{url}?{query}", headers={"User-Agent": USER_AGENT})
    for attempt in range(attempts):
        try:
            with urllib.request.urlopen(request, timeout=30) as response:
                return json.load(response)
        except (urllib.error.URLError, TimeoutError, json.JSONDecodeError) as error:
            if attempt == attempts - 1:
                raise
            retry_after = 0
            if isinstance(error, urllib.error.HTTPError):
                retry_after = int(error.headers.get("Retry-After", "0") or 0)
            time.sleep(max(retry_after, 1.5 * (attempt + 1)))
    raise RuntimeError("unreachable")


def normalize(value: str) -> str:
    value = unicodedata.normalize("NFKD", value).encode("ascii", "ignore").decode()
    value = value.lower().replace("&", " and ")
    return " ".join(re.findall(r"[a-z0-9]+", value))


def tokens(value: str) -> set[str]:
    return {token for token in normalize(value).split() if token not in STOP_WORDS and len(token) > 1}


def aliases(row: dict[str, str]) -> list[str]:
    return [
        row["university_name"],
        *[value.strip() for value in row["also_known_as"].split(";") if value.strip()],
    ]


def match_score(row: dict[str, str], candidate: str, description: str = "") -> float:
    candidate_norm = normalize(candidate)
    candidate_tokens = tokens(candidate)
    best = 0.0
    for name in aliases(row):
        name_norm = normalize(name)
        name_tokens = tokens(name)
        if candidate_norm == name_norm:
            best = max(best, 1.0)
            continue
        union = name_tokens | candidate_tokens
        token_score = len(name_tokens & candidate_tokens) / len(union) if union else 0.0
        containment = (
            len(name_tokens & candidate_tokens) / min(len(name_tokens), len(candidate_tokens))
            if name_tokens and candidate_tokens
            else 0.0
        )
        from difflib import SequenceMatcher

        sequence = SequenceMatcher(None, name_norm, candidate_norm).ratio()
        best = max(best, 0.45 * token_score + 0.35 * containment + 0.20 * sequence)

    state = normalize(row["state_or_ut"])
    if state and state in normalize(description):
        best += 0.05
    return min(best, 1.0)


def commons_file(file_name: str) -> dict[str, Any] | None:
    return wiki_file(COMMONS_API, file_name)


def wiki_file(api_url: str, file_name: str) -> dict[str, Any] | None:
    data = http_json(
        api_url,
        {
            "action": "query",
            "format": "json",
            "formatversion": "2",
            "prop": "imageinfo",
            "iiprop": "url|size|mime|extmetadata",
            "titles": f"File:{file_name.replace('_', ' ')}",
        },
    )
    pages = data.get("query", {}).get("pages", [])
    if not pages or pages[0].get("missing"):
        return None
    info = (pages[0].get("imageinfo") or [None])[0]
    if not info:
        return None
    return {"title": pages[0].get("title", ""), **info}


def resolve_wikidata(row: dict[str, str]) -> dict[str, Any] | None:
    entity_match = wikidata_entity(row)
    if not entity_match:
        return None
    score, item, entity = entity_match
    claims = entity.get("claims", {})
    logo_claims = claims.get("P154", [])
    if not logo_claims:
        return None
    file_name = logo_claims[0].get("mainsnak", {}).get("datavalue", {}).get("value")
    if not isinstance(file_name, str):
        return None
    info = commons_file(file_name)
    if not info:
        return None
    return {
        "method": "wikidata-p154",
        "entity_id": item["id"],
        "entity_label": item.get("label"),
        "match_score": round(score, 4),
        **info,
    }


def wikidata_entity(
    row: dict[str, str],
) -> tuple[float, dict[str, Any], dict[str, Any]] | None:
    cache_key = row["university_id"]
    with _ENTITY_CACHE_LOCK:
        if cache_key in _ENTITY_CACHE:
            return _ENTITY_CACHE[cache_key]
    search = http_json(
        WIKIDATA_API,
        {
            "action": "wbsearchentities",
            "format": "json",
            "language": "en",
            "uselang": "en",
            "type": "item",
            "limit": "10",
            "search": row["university_name"],
        },
    )
    ranked = []
    for item in search.get("search", []):
        description = item.get("description") or ""
        score = match_score(row, item.get("label") or "", description)
        if any(word in description.lower() for word in ("university", "institute", "education")):
            score += 0.03
        ranked.append((min(score, 1.0), item))
    if not ranked:
        with _ENTITY_CACHE_LOCK:
            _ENTITY_CACHE[cache_key] = None
        return None
    score, item = max(ranked, key=lambda pair: pair[0])
    if score < 0.72:
        with _ENTITY_CACHE_LOCK:
            _ENTITY_CACHE[cache_key] = None
        return None

    entity = http_json(
        WIKIDATA_API,
        {
            "action": "wbgetentities",
            "format": "json",
            "ids": item["id"],
            "props": "claims|labels|descriptions|sitelinks",
            "languages": "en",
        },
    ).get("entities", {}).get(item["id"], {})
    result = (score, item, entity)
    with _ENTITY_CACHE_LOCK:
        _ENTITY_CACHE[cache_key] = result
    return result


def resolve_wikipedia_logo(row: dict[str, str]) -> dict[str, Any] | None:
    entity_match = wikidata_entity(row)
    if not entity_match:
        return None
    score, item, entity = entity_match
    title = entity.get("sitelinks", {}).get("enwiki", {}).get("title")
    if not isinstance(title, str):
        return None
    data = http_json(
        ENWIKI_API,
        {
            "action": "query",
            "format": "json",
            "formatversion": "2",
            "prop": "images",
            "imlimit": "max",
            "titles": title,
        },
    )
    images = (data.get("query", {}).get("pages") or [{}])[0].get("images") or []
    candidates = []
    for image in images:
        file_title = image.get("title") or ""
        title_lower = file_title.lower()
        if not any(word in title_lower for word in LOGO_WORDS):
            continue
        if any(word in title_lower for word in REJECT_WORDS):
            continue
        info = wiki_file(ENWIKI_API, re.sub(r"^File:", "", file_title, flags=re.I))
        if not info:
            continue
        file_score = match_score(row, re.sub(r"^File:|\.[^.]+$", "", file_title, flags=re.I))
        candidates.append((min(file_score + 0.12, 1.0), info))
    if not candidates:
        return None
    file_score, info = max(candidates, key=lambda pair: pair[0])
    if file_score < 0.60:
        return None
    return {
        "method": "wikipedia-logo-file",
        "entity_id": item["id"],
        "entity_label": item.get("label"),
        "match_score": round(min(score, file_score), 4),
        "article_url": f"https://en.wikipedia.org/wiki/{urllib.parse.quote(title.replace(' ', '_'))}",
        **info,
    }


class ImageTagParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.images: list[dict[str, str]] = []
        self.stylesheets: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        tag = tag.lower()
        values = {key.lower(): value or "" for key, value in attrs}
        if tag == "link" and "stylesheet" in values.get("rel", "").lower():
            if values.get("href"):
                self.stylesheets.append(values["href"])
            return
        if tag == "meta" and values.get("property", "").lower() in {
            "og:image",
            "og:image:url",
        }:
            if values.get("content"):
                self.images.append(
                    {"src": values["content"], "class": "social-preview", "alt": ""}
                )
            return
        if tag not in {"img", "source"}:
            return
        source = (
            values.get("src")
            or values.get("srcset", "").split(",")[-1].strip().split(" ")[0]
            or values.get("data-src")
            or values.get("data-srcset", "").split(",")[-1].strip().split(" ")[0]
            or values.get("data-lazy-src")
            or values.get("data-original")
        )
        if source:
            values["src"] = source
            self.images.append(values)


def official_site_from_entity(entity: dict[str, Any]) -> str | None:
    for claim in entity.get("claims", {}).get("P856", []):
        value = claim.get("mainsnak", {}).get("datavalue", {}).get("value")
        if isinstance(value, str) and value.startswith(("http://", "https://")):
            return value
    return None


def fetch_html(url: str) -> tuple[str, str]:
    request = urllib.request.Request(
        url,
        headers={
            "User-Agent": USER_AGENT,
            "Accept": "text/html,application/xhtml+xml",
        },
    )
    with urllib.request.urlopen(request, timeout=35) as response:
        final_url = response.geturl()
        content_type = response.headers.get_content_type()
        if content_type not in ("text/html", "application/xhtml+xml"):
            raise ValueError(f"official URL returned {content_type}")
        body = response.read(2 * 1024 * 1024 + 1)
        if len(body) > 2 * 1024 * 1024:
            raise ValueError("official homepage exceeds 2 MiB")
        charset = response.headers.get_content_charset() or "utf-8"
    return final_url, body.decode(charset, errors="replace")


def probe_image(url: str) -> tuple[bytes, str, int]:
    request = urllib.request.Request(
        url,
        headers={"User-Agent": USER_AGENT, "Accept": "image/avif,image/webp,image/*,*/*;q=0.8"},
    )
    with urllib.request.urlopen(request, timeout=45) as response:
        content_type = response.headers.get_content_type()
        body = response.read(8 * 1024 * 1024 + 1)
    if len(body) > 8 * 1024 * 1024:
        raise ValueError("asset exceeds 8 MiB")
    if content_type == "image/jpg":
        content_type = "image/jpeg"
    if content_type not in SUPPORTED_MIME:
        raise ValueError(f"unsupported content type: {content_type}")
    return body, content_type, len(body)


def raster_dimensions(data: bytes, mime: str) -> tuple[int, int]:
    if mime == "image/png" and data[:8] == b"\x89PNG\r\n\x1a\n":
        return int.from_bytes(data[16:20], "big"), int.from_bytes(data[20:24], "big")
    if mime == "image/jpeg" and data[:2] == b"\xff\xd8":
        index = 2
        while index + 9 < len(data):
            if data[index] != 0xFF:
                index += 1
                continue
            marker = data[index + 1]
            if marker in (0xC0, 0xC1, 0xC2, 0xC3, 0xC5, 0xC6, 0xC7, 0xC9, 0xCA, 0xCB, 0xCD, 0xCE, 0xCF):
                height = int.from_bytes(data[index + 5 : index + 7], "big")
                width = int.from_bytes(data[index + 7 : index + 9], "big")
                return width, height
            if marker in (0xD8, 0xD9) or 0xD0 <= marker <= 0xD7:
                index += 2
                continue
            length = int.from_bytes(data[index + 2 : index + 4], "big")
            index += 2 + max(length, 2)
    if mime == "image/webp" and data[:4] == b"RIFF" and data[8:12] == b"WEBP":
        kind = data[12:16]
        if kind == b"VP8X" and len(data) >= 30:
            return int.from_bytes(data[24:27], "little") + 1, int.from_bytes(data[27:30], "little") + 1
        if kind == b"VP8L" and len(data) >= 25:
            bits = int.from_bytes(data[21:25], "little")
            return (bits & 0x3FFF) + 1, ((bits >> 14) & 0x3FFF) + 1
    return 0, 0


def resolve_official_site(row: dict[str, str]) -> dict[str, Any] | None:
    entity_match = wikidata_entity(row)
    if not entity_match:
        return None
    score, item, entity = entity_match
    official_url = official_site_from_entity(entity)
    if not official_url:
        return None
    return resolve_logo_from_site(
        row,
        official_url,
        score,
        entity_id=item["id"],
        entity_label=item.get("label"),
        method="official-website",
    )


def resolve_logo_from_site(
    row: dict[str, str],
    official_url: str,
    entity_score: float,
    *,
    entity_id: str | None = None,
    entity_label: str | None = None,
    method: str,
) -> dict[str, Any] | None:
    final_url, html = fetch_html(official_url)
    parser = ImageTagParser()
    parser.feed(html)
    raw_logo_paths = re.findall(
        r'''["']([^"']*logo[^"'?#]*\.(?:svg|png|webp|jpe?g)(?:\?[^"']*)?)["']''',
        html,
        flags=re.I,
    )
    for path in raw_logo_paths:
        parser.images.append({"src": path, "class": "logo-html-reference", "alt": ""})
    for stylesheet in parser.stylesheets[:8]:
        stylesheet_url = urllib.parse.urljoin(final_url, stylesheet)
        try:
            request = urllib.request.Request(stylesheet_url, headers={"User-Agent": USER_AGENT})
            with urllib.request.urlopen(request, timeout=25) as response:
                css = response.read(1024 * 1024).decode("utf-8", errors="replace")
        except Exception:
            continue
        for match in re.finditer(r"url\(([^)]+)\)", css, flags=re.I):
            path = match.group(1).strip(" \t\r\n\"'")
            context = css[max(0, match.start() - 180) : match.end() + 40].lower()
            if "logo" not in context or not re.search(r"\.(svg|png|webp|jpe?g)(?:\?|$)", path, re.I):
                continue
            parser.images.append(
                {
                    "src": urllib.parse.urljoin(stylesheet_url, path),
                    "class": "logo-stylesheet-reference",
                    "alt": "",
                }
            )
    page_tokens = tokens(row["university_name"])
    candidates: list[tuple[float, str, dict[str, str]]] = []
    for image in parser.images:
        source = image.get("src", "").strip()
        if not source or source.startswith(("data:", "blob:")):
            continue
        source = source.split()[0]
        absolute = urllib.parse.urljoin(final_url, source)
        if not absolute.startswith(("http://", "https://")):
            continue
        descriptor = " ".join(
            [source, image.get("alt", ""), image.get("class", ""), image.get("id", "")]
        ).lower()
        if not any(word in descriptor for word in LOGO_WORDS) and "social-preview" not in descriptor:
            continue
        if any(word in descriptor for word in REJECT_WORDS):
            continue
        descriptor_tokens = tokens(descriptor)
        token_overlap = len(page_tokens & descriptor_tokens) / len(page_tokens) if page_tokens else 0
        image_score = 0.58 + min(token_overlap, 0.25)
        if any(word in descriptor for word in LOGO_WORDS):
            image_score += 0.08
        try:
            declared_width = int(re.sub(r"[^0-9].*", "", image.get("width", "0")) or 0)
            declared_height = int(re.sub(r"[^0-9].*", "", image.get("height", "0")) or 0)
        except ValueError:
            declared_width = declared_height = 0
        if max(declared_width, declared_height) >= 256:
            image_score += 0.05
        candidates.append((min(image_score, 1.0), absolute, image))
    if not candidates:
        return None

    errors = []
    for image_score, source_url, _image in sorted(
        candidates, key=lambda candidate: candidate[0], reverse=True
    )[:8]:
        try:
            body, mime, size_bytes = probe_image(source_url)
        except Exception as error:
            errors.append(str(error))
            continue
        width, height = raster_dimensions(body, mime)
        if mime != "image/svg+xml" and (
            max(width, height) < 256 or min(width, height) < 32
        ):
            continue
        return {
            "method": "official-website",
            "entity_id": entity_id,
            "entity_label": entity_label,
            "match_score": round(min(entity_score, image_score), 4),
            "url": source_url,
            "descriptionurl": final_url,
            "title": urllib.parse.unquote(Path(urllib.parse.urlparse(source_url).path).name),
            "mime": mime,
            "width": width or None,
            "height": height or None,
            "_downloaded_body": body,
            "_downloaded_size": size_bytes,
            "official_site": final_url,
            "resolver_errors": errors,
        }
    return None


def decoded_bing_url(href: str) -> str | None:
    href = html_lib.unescape(href)
    parsed = urllib.parse.urlparse(href)
    if parsed.netloc.lower().endswith("bing.com"):
        encoded = urllib.parse.parse_qs(parsed.query).get("u", [None])[0]
        if not encoded:
            return None
        if encoded.startswith("a1"):
            encoded = encoded[2:]
        try:
            href = base64.b64decode(encoded + "===").decode("utf-8")
        except (ValueError, UnicodeDecodeError):
            return None
    return href if href.startswith(("http://", "https://")) else None


def rejected_domain(url: str) -> bool:
    host = (urllib.parse.urlparse(url).hostname or "").lower()
    return any(host == domain or host.endswith(f".{domain}") for domain in REJECT_DOMAINS)


def resolve_web_search(row: dict[str, str]) -> dict[str, Any] | None:
    query = urllib.parse.urlencode(
        {"q": f'"{row["university_name"]}" official university website'}
    )
    request = urllib.request.Request(
        f"https://www.bing.com/search?{query}",
        headers={"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/140 Safari/537.36"},
    )
    with urllib.request.urlopen(request, timeout=35) as response:
        body = response.read(2 * 1024 * 1024).decode("utf-8", errors="replace")

    results = re.findall(
        r'<li class="b_algo".*?<h2[^>]*><a[^>]+href="([^"]+)"[^>]*>(.*?)</a>',
        body,
        flags=re.I | re.S,
    )
    candidates = []
    for href, raw_title in results:
        url = decoded_bing_url(href)
        if not url or rejected_domain(url):
            continue
        title = re.sub(r"<[^>]+>", "", html_lib.unescape(raw_title)).strip()
        score = match_score(row, title)
        host = (urllib.parse.urlparse(url).hostname or "").lower()
        if host.endswith((".edu.in", ".ac.in", ".edu")):
            score += 0.06
        candidates.append((min(score, 1.0), url, title))

    for score, url, title in sorted(candidates, key=lambda candidate: candidate[0], reverse=True)[:4]:
        if score < 0.58:
            continue
        try:
            result = resolve_logo_from_site(
                row,
                url,
                score,
                entity_label=title,
                method="official-web-search",
            )
        except Exception:
            continue
        if result:
            result["method"] = "official-web-search"
            return result
    return None


def resolve_commons_search(row: dict[str, str]) -> dict[str, Any] | None:
    queries = [
        f'"{row["university_name"]}" logo',
        f'{row["university_name"]} logo',
    ]
    if row["also_known_as"]:
        queries.append(f'{row["also_known_as"].split(";")[0].strip()} logo university')

    candidates: dict[str, tuple[float, dict[str, Any]]] = {}
    for query in queries:
        data = http_json(
            COMMONS_API,
            {
                "action": "query",
                "format": "json",
                "formatversion": "2",
                "generator": "search",
                "gsrnamespace": "6",
                "gsrlimit": "12",
                "gsrsearch": query,
                "prop": "imageinfo",
                "iiprop": "url|size|mime|extmetadata",
            },
        )
        for page in data.get("query", {}).get("pages", []):
            info = (page.get("imageinfo") or [None])[0]
            if not info:
                continue
            title = page.get("title", "")
            title_lower = title.lower()
            if any(word in title_lower for word in REJECT_WORDS):
                continue
            name_score = match_score(row, re.sub(r"^File:|\.[^.]+$", "", title, flags=re.I))
            logo_bonus = 0.10 if any(word in title_lower for word in LOGO_WORDS) else 0.0
            score = min(name_score + logo_bonus, 1.0)
            current = candidates.get(title)
            if current is None or score > current[0]:
                candidates[title] = (score, {"title": title, **info})
    if not candidates:
        return None
    score, info = max(candidates.values(), key=lambda pair: pair[0])
    if score < 0.78:
        return None
    return {"method": "commons-search", "match_score": round(score, 4), **info}


def license_fields(info: dict[str, Any]) -> dict[str, str | None]:
    metadata = info.get("extmetadata") or {}

    def value(name: str) -> str | None:
        raw = metadata.get(name, {}).get("value")
        if not isinstance(raw, str):
            return None
        return re.sub(r"<[^>]+>", "", raw).strip() or None

    return {
        "license": value("LicenseShortName"),
        "license_url": value("LicenseUrl"),
        "artist": value("Artist"),
        "credit": value("Credit"),
    }


def high_quality(info: dict[str, Any]) -> bool:
    mime = info.get("mime")
    if mime == "image/svg+xml":
        return True
    width = int(info.get("width") or 0)
    height = int(info.get("height") or 0)
    return (max(width, height) >= 512 and min(width, height) >= 32) or (
        max(width, height) >= 256 and min(width, height) >= 96
    )


def resolve_reviewed_override(source_url: str) -> dict[str, Any]:
    """Resolve a human-reviewed logo URL while retaining its exact provenance."""
    body, mime, size_bytes = probe_image(source_url)
    width, height = raster_dimensions(body, mime)
    return {
        "method": "manual-source-review",
        "match_score": 1.0,
        "url": source_url,
        "descriptionurl": source_url,
        "title": urllib.parse.unquote(Path(urllib.parse.urlparse(source_url).path).name),
        "mime": mime,
        "width": width or None,
        "height": height or None,
        "_downloaded_body": body,
        "_downloaded_size": size_bytes,
    }


def download(url: str, destination: Path) -> tuple[str, int]:
    request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(request, timeout=60) as response:
        content_type = response.headers.get_content_type()
        data = response.read(8 * 1024 * 1024 + 1)
    if len(data) > 8 * 1024 * 1024:
        raise ValueError("asset exceeds 8 MiB")
    if content_type not in SUPPORTED_MIME:
        raise ValueError(f"unsupported content type: {content_type}")
    destination.write_bytes(data)
    return content_type, len(data)


def resolve_one(
    row: dict[str, str],
    output_dir: Path,
    web_only: bool = False,
    override_url: str | None = None,
) -> dict[str, Any]:
    base = {
        "serial_no": int(row["serial_no"]),
        "university_id": row["university_id"],
        "university_name": row["university_name"],
        "state_or_ut": row["state_or_ut"],
        "status": "unresolved",
    }
    errors: list[str] = []
    resolvers = (
        (resolve_web_search,)
        if web_only
        else (
            resolve_wikidata,
            resolve_wikipedia_logo,
            resolve_commons_search,
            resolve_official_site,
            resolve_web_search,
        )
    )
    if override_url:
        try:
            override = resolve_reviewed_override(override_url)
            if high_quality(override):
                resolvers = (lambda _row: override, *resolvers)
            else:
                errors.append("reviewed override did not meet the minimum dimensions")
        except Exception as error:
            errors.append(f"reviewed override: {error}")
    for resolver in resolvers:
        try:
            info = resolver(row)
        except Exception as error:  # keep the batch moving; manifest records the failure
            errors.append(f"{resolver.__name__}: {error}")
            continue
        if not info or not high_quality(info):
            continue
        mime = info.get("mime")
        extension = SUPPORTED_MIME.get(mime)
        source_url = info.get("url")
        if not extension or not isinstance(source_url, str):
            continue
        path = output_dir / f'{row["university_id"]}{extension}'
        downloaded_body = info.pop("_downloaded_body", None)
        if downloaded_body is not None:
            path.write_bytes(downloaded_body)
            downloaded_mime = mime
            size_bytes = int(info.pop("_downloaded_size", len(downloaded_body)))
        else:
            try:
                downloaded_mime, size_bytes = download(source_url, path)
            except Exception as error:
                errors.append(f"download: {error}")
                continue
        if downloaded_mime != mime and not (mime == "image/jpeg" and downloaded_mime == "image/jpeg"):
            path.unlink(missing_ok=True)
            errors.append(f"mime mismatch: API {mime}, download {downloaded_mime}")
            continue
        digest = hashlib.sha256(path.read_bytes()).hexdigest()
        return {
            **base,
            "status": "resolved",
            "storage_file": path.name,
            "source_url": source_url,
            "source_page": info.get("descriptionurl"),
            "source_title": info.get("title"),
            "source_method": info.get("method"),
            "source_entity_id": info.get("entity_id"),
            "source_entity_label": info.get("entity_label"),
            "official_site": info.get("official_site"),
            "match_score": info.get("match_score"),
            "content_type": mime,
            "width": info.get("width"),
            "height": info.get("height"),
            "size_bytes": size_bytes,
            "sha256": digest,
            **license_fields(info),
            "errors": errors,
        }
    return {**base, "errors": errors}


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("csv_path", type=Path)
    parser.add_argument("output_dir", type=Path)
    parser.add_argument("manifest_path", type=Path)
    parser.add_argument("--workers", type=int, default=6)
    parser.add_argument("--resume", action="store_true")
    parser.add_argument("--web-only", action="store_true")
    parser.add_argument("--overrides", type=Path)
    args = parser.parse_args()

    with args.csv_path.open(encoding="utf-8-sig", newline="") as handle:
        rows = list(csv.DictReader(handle))
    if len(rows) != 140:
        raise SystemExit(f"Expected 140 university rows, found {len(rows)}")
    if len({row["university_id"] for row in rows}) != len(rows):
        raise SystemExit("Duplicate university_id values found")
    overrides = json.loads(args.overrides.read_text()) if args.overrides else {}
    unknown_overrides = set(overrides) - {row["university_id"] for row in rows}
    if unknown_overrides:
        raise SystemExit(f"Unknown override ids: {sorted(unknown_overrides)}")

    args.output_dir.mkdir(parents=True, exist_ok=True)
    preserved: dict[str, dict[str, Any]] = {}
    if args.resume and args.manifest_path.exists():
        previous = json.loads(args.manifest_path.read_text())
        preserved = {
            item["university_id"]: item
            for item in previous
            if item.get("status") == "resolved"
            and (args.output_dir / item.get("storage_file", "missing")).exists()
        }

    pending = [row for row in rows if row["university_id"] not in preserved]
    results: list[dict[str, Any]] = list(preserved.values())
    with concurrent.futures.ThreadPoolExecutor(max_workers=args.workers) as executor:
        futures = [
            executor.submit(
                resolve_one,
                row,
                args.output_dir,
                args.web_only,
                overrides.get(row["university_id"]),
            )
            for row in pending
        ]
        for index, future in enumerate(concurrent.futures.as_completed(futures), start=1):
            result = future.result()
            results.append(result)
            print(
                f"[{index:03}/{len(pending)}] {result['status']:10} {result['university_name']}",
                flush=True,
            )

    results.sort(key=lambda item: item["serial_no"])
    args.manifest_path.parent.mkdir(parents=True, exist_ok=True)
    args.manifest_path.write_text(json.dumps(results, ensure_ascii=False, indent=2) + "\n")
    resolved = sum(item["status"] == "resolved" for item in results)
    print(f"Resolved {resolved}/{len(results)} high-quality logos")


if __name__ == "__main__":
    main()
