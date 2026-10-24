type Row = Record<string, unknown>;

async function adminFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, init);
  const body = (await response.json().catch(() => ({}))) as { error?: string };
  if (!response.ok) throw new Error(body.error || "Admin request failed.");
  return body as T;
}

export function listAdminRows(
  table: string,
  options: {
    page?: number;
    orderBy?: string;
    ascending?: boolean;
    columns?: string[];
  } = {},
) {
  const query = new URLSearchParams({ table });
  if (options.page !== undefined) query.set("page", String(options.page));
  if (options.orderBy) query.set("orderBy", options.orderBy);
  if (options.ascending !== undefined) query.set("ascending", String(options.ascending));
  if (options.columns?.length) query.set("columns", options.columns.join(","));
  return adminFetch<{ rows: Row[]; count: number }>(`/api/admin/data?${query}`);
}

export async function listAllAdminRows(
  table: string,
  options: { orderBy?: string; ascending?: boolean; columns?: string[] } = {},
) {
  const first = await listAdminRows(table, { ...options, page: 0 });
  const rows = [...first.rows];
  for (let page = 1; rows.length < first.count; page += 1) {
    const next = await listAdminRows(table, { ...options, page });
    if (!next.rows.length) break;
    rows.push(...next.rows);
  }
  return { rows, count: first.count };
}

export function saveAdminRow(table: string, payload: Row, id?: string) {
  const query = new URLSearchParams({ table });
  if (id) query.set("id", id);
  return adminFetch<{ ok: true }>(`/api/admin/data?${query}`, {
    method: id ? "PATCH" : "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export function deleteAdminRow(table: string, id: string) {
  const query = new URLSearchParams({ table, id });
  return adminFetch<{ ok: true }>(`/api/admin/data?${query}`, { method: "DELETE" });
}

export function getResearchBatch<T>() {
  return adminFetch<{ batch: T | null }>("/api/admin/research?mode=batch");
}

export function listResearchRecords<T>(options: { page: number; search: string; bucket: string }) {
  const query = new URLSearchParams({
    page: String(options.page),
    search: options.search,
    bucket: options.bucket,
  });
  return adminFetch<{ rows: T[]; count: number }>(`/api/admin/research?${query}`);
}
