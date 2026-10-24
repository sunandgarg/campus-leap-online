import { createFileRoute } from "@tanstack/react-router";
import {
  getDatabase,
  getTableDefinition,
  parseDatabaseRow,
  serializeAdminPayload,
  type AdminTable,
} from "@/lib/db.server";

const PAGE_SIZE = 50;

function response(body: unknown, status = 200) {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

function isSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return !import.meta.env.PROD;
  try {
    return new URL(origin).origin === new URL(request.url).origin;
  } catch {
    return false;
  }
}

function requestTable(url: URL) {
  const table = url.searchParams.get("table") ?? "";
  const definition = getTableDefinition(table);
  return { table: table as AdminTable, definition };
}

async function parseJson(request: Request) {
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
    throw new Error("JSON request required");
  }
  const text = await request.text();
  if (new TextEncoder().encode(text).byteLength > 100_000) throw new Error("Payload too large");
  return JSON.parse(text) as unknown;
}

export const Route = createFileRoute("/api/admin/data")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const url = new URL(request.url);
          const { table, definition } = requestTable(url);
          const requestedColumns = (url.searchParams.get("columns") ?? "")
            .split(",")
            .filter(Boolean);
          const columns = requestedColumns.length ? requestedColumns : [...definition.columns];
          if (columns.some((column) => !definition.columns.includes(column as never))) {
            return response({ error: "Unsupported column" }, 400);
          }
          const orderBy = url.searchParams.get("orderBy") || definition.id;
          if (!definition.columns.includes(orderBy as never)) {
            return response({ error: "Unsupported sort" }, 400);
          }
          const ascending = url.searchParams.get("ascending") !== "false";
          const page = Math.max(0, Number.parseInt(url.searchParams.get("page") ?? "0", 10) || 0);
          const offset = page * PAGE_SIZE;
          const database = await getDatabase();
          const [rows, count] = await Promise.all([
            database
              .prepare(
                `SELECT ${columns.join(",")} FROM ${table} ORDER BY ${orderBy} ${ascending ? "ASC" : "DESC"} LIMIT ? OFFSET ?`,
              )
              .bind(PAGE_SIZE, offset)
              .all<Record<string, unknown>>(),
            database.prepare(`SELECT count(*) AS count FROM ${table}`).first<{ count: number }>(),
          ]);
          return response({
            rows: rows.results.map((row) => parseDatabaseRow(table, row)),
            count: count?.count ?? 0,
          });
        } catch (error) {
          console.error("admin_read_failed", error);
          return response({ error: "Admin data is unavailable." }, 500);
        }
      },
      POST: async ({ request }) => {
        if (!isSameOrigin(request)) return response({ error: "Invalid origin" }, 403);
        try {
          const { table } = requestTable(new URL(request.url));
          if (table === "leads") return response({ error: "Leads cannot be created here." }, 405);
          const payload = serializeAdminPayload(table, await parseJson(request));
          const columns = Object.keys(payload);
          const values = Object.values(payload);
          const database = await getDatabase();
          await database
            .prepare(
              `INSERT INTO ${table} (${columns.join(",")}) VALUES (${columns.map(() => "?").join(",")})`,
            )
            .bind(...values)
            .run();
          return response({ ok: true }, 201);
        } catch (error) {
          console.error("admin_create_failed", error);
          return response(
            { error: error instanceof Error ? error.message : "Could not save." },
            400,
          );
        }
      },
      PATCH: async ({ request }) => {
        if (!isSameOrigin(request)) return response({ error: "Invalid origin" }, 403);
        try {
          const url = new URL(request.url);
          const { table, definition } = requestTable(url);
          const id = url.searchParams.get("id");
          if (!id || id.length > 200) return response({ error: "Invalid record id" }, 400);
          const payload = serializeAdminPayload(table, await parseJson(request));
          const columns = Object.keys(payload);
          const values = Object.values(payload);
          const database = await getDatabase();
          const result = await database
            .prepare(
              `UPDATE ${table} SET ${columns.map((column) => `${column} = ?`).join(",")}${definition.columns.includes("updated_at" as never) ? ",updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')" : ""} WHERE ${definition.id} = ?`,
            )
            .bind(...values, id)
            .run();
          if (!(result.meta.changes ?? 0)) return response({ error: "Record not found" }, 404);
          return response({ ok: true });
        } catch (error) {
          console.error("admin_update_failed", error);
          return response(
            { error: error instanceof Error ? error.message : "Could not save." },
            400,
          );
        }
      },
      DELETE: async ({ request }) => {
        if (!isSameOrigin(request)) return response({ error: "Invalid origin" }, 403);
        try {
          const url = new URL(request.url);
          const { table, definition } = requestTable(url);
          const id = url.searchParams.get("id");
          if (!id || id.length > 200) return response({ error: "Invalid record id" }, 400);
          const database = await getDatabase();
          const result = await database
            .prepare(`DELETE FROM ${table} WHERE ${definition.id} = ?`)
            .bind(id)
            .run();
          if (!(result.meta.changes ?? 0)) return response({ error: "Record not found" }, 404);
          return response({ ok: true });
        } catch (error) {
          console.error("admin_delete_failed", error);
          return response({ error: "Could not delete this record." }, 400);
        }
      },
    },
  },
});
