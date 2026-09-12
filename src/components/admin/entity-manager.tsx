import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Loader2, Pencil, Plus, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import type { SupabaseClient } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

/** Untyped view of the client so one component can manage several tables. */
const db = supabase as unknown as SupabaseClient;
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

export type FieldType = "text" | "number" | "textarea" | "list" | "json" | "bool" | "select";

export interface FieldDef {
  name: string;
  label: string;
  type: FieldType;
  help?: string;
  min?: number;
  step?: number | "any";
  options?: string[];
  required?: boolean;
  /** Persist an empty field as SQL NULL instead of an empty string or zero. */
  nullable?: boolean;
  defaultValue?: unknown;
  wide?: boolean;
}

export type SelectOption = string | { value: string; label: string };

type Row = Record<string, unknown>;

interface EntityManagerProps {
  table: string;
  title: string;
  description: string;
  fields: FieldDef[];
  /** columns shown in the list */
  listColumns: { name: string; label: string; maxLength?: number }[];
  orderBy?: string;
  orderAscending?: boolean;
  /** extra select options loaded for select fields, e.g. slugs */
  selectSources?: Record<string, SelectOption[]>;
  /** primary key column, defaults to "id" */
  idColumn?: string;
  /** Disable record creation for audit-sensitive tables such as enquiries. */
  allowCreate?: boolean;
}

const PAGE_SIZE = 50;

function emptyDraft(fields: FieldDef[]): Row {
  const draft: Row = {};
  for (const f of fields) {
    draft[f.name] =
      f.defaultValue ??
      (f.nullable
        ? null
        : f.type === "list"
          ? []
          : f.type === "json"
            ? []
            : f.type === "bool"
              ? true
              : f.type === "number"
                ? 0
                : "");
  }
  return draft;
}

function toInputValue(field: FieldDef, value: unknown): string {
  if (value === null || value === undefined) return "";
  if (field.type === "list") return Array.isArray(value) ? value.join("\n") : String(value);
  if (field.type === "json") return JSON.stringify(value, null, 2);
  return String(value);
}

export function EntityManager({
  table,
  title,
  description,
  fields,
  listColumns,
  orderBy = "sort_order",
  orderAscending = true,
  selectSources,
  idColumn = "id",
  allowCreate = true,
}: EntityManagerProps) {
  const queryClient = useQueryClient();
  const [draft, setDraft] = useState<Row | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);

  const rowsQuery = useQuery({
    queryKey: ["admin", table, page, orderBy, orderAscending],
    queryFn: async () => {
      const start = page * PAGE_SIZE;
      const { data, error, count } = await db
        .from(table)
        .select("*", { count: "exact" })
        .order(orderBy, { ascending: orderAscending })
        .range(start, start + PAGE_SIZE - 1);
      if (error) throw error;
      return { rows: (data ?? []) as Row[], count: count ?? 0 };
    },
  });

  const save = useMutation({
    mutationFn: async (payload: Row) => {
      if (editingId) {
        const { error } = await db.from(table).update(payload).eq(idColumn, editingId);
        if (error) throw error;
      } else {
        const { error } = await db.from(table).insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success("Saved.");
      setDraft(null);
      setEditingId(null);
      void queryClient.invalidateQueries({ queryKey: ["admin", table] });
    },
    onError: (error: unknown) => {
      toast.error(error instanceof Error ? error.message : "Could not save.");
    },
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await db.from(table).delete().eq(idColumn, id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Deleted.");
      void queryClient.invalidateQueries({ queryKey: ["admin", table] });
    },
    onError: (error: unknown) => {
      toast.error(error instanceof Error ? error.message : "Could not delete.");
    },
  });

  const rows = useMemo(() => {
    const all = rowsQuery.data?.rows ?? [];
    if (!search.trim()) return all;
    const q = search.toLowerCase();
    return all.filter((r) =>
      listColumns.some((c) =>
        String(r[c.name] ?? "")
          .toLowerCase()
          .includes(q),
      ),
    );
  }, [rowsQuery.data?.rows, search, listColumns]);

  const totalRows = rowsQuery.data?.count ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalRows / PAGE_SIZE));

  function startEdit(row: Row) {
    const next: Row = {};
    for (const f of fields) next[f.name] = row[f.name];
    setDraft(next);
    setEditingId(String(row[idColumn]));
  }

  function updateField(field: FieldDef, raw: string | boolean) {
    setDraft((prev) => {
      const next = { ...(prev ?? {}) };
      if (field.type === "bool") next[field.name] = Boolean(raw);
      else if (field.type === "number") {
        next[field.name] = raw === "" && field.nullable ? null : Number(raw) || 0;
      } else if (field.type === "list")
        next[field.name] = String(raw)
          .split("\n")
          .map((v) => v.trim())
          .filter(Boolean);
      else if (field.type === "json") next[field.name] = String(raw);
      else next[field.name] = raw === "" && field.nullable ? null : raw;
      return next;
    });
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!draft) return;
    const payload: Row = { ...draft };
    for (const f of fields) {
      if (f.type === "json" && typeof payload[f.name] === "string") {
        const rawValue = String(payload[f.name]).trim();
        if (!rawValue && f.nullable) {
          payload[f.name] = null;
          continue;
        }
        try {
          payload[f.name] = JSON.parse(rawValue || "[]");
        } catch {
          toast.error(`${f.label} is not valid JSON.`);
          return;
        }
      }
    }
    save.mutate(payload);
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <h1 className="font-display text-2xl font-bold">{title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label={`Search the current ${title.toLowerCase()} page`}
            className="w-44"
          />
          {allowCreate ? (
            <Button
              onClick={() => {
                setDraft(emptyDraft(fields));
                setEditingId(null);
              }}
              className="bg-ink text-ink-foreground hover:bg-ink-soft"
            >
              <Plus className="mr-1.5 h-4 w-4" /> New
            </Button>
          ) : null}
        </div>
      </div>

      {draft && (
        <form
          onSubmit={submit}
          className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-card"
        >
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-bold">
              {editingId ? "Edit record" : "New record"}
            </h2>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              aria-label="Close editor"
              title="Close editor"
              onClick={() => {
                setDraft(null);
                setEditingId(null);
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {fields.map((f) => (
              <div
                key={f.name}
                className={`space-y-1.5 ${f.wide || f.type === "json" || f.type === "textarea" || f.type === "list" ? "md:col-span-2" : ""}`}
              >
                <Label htmlFor={`f-${f.name}`}>{f.label}</Label>
                {f.type === "bool" ? (
                  <div className="flex h-10 items-center">
                    <Switch
                      id={`f-${f.name}`}
                      checked={Boolean(draft[f.name])}
                      onCheckedChange={(v) => updateField(f, v)}
                    />
                  </div>
                ) : f.type === "select" ? (
                  <select
                    id={`f-${f.name}`}
                    value={String(draft[f.name] ?? "")}
                    onChange={(e) => updateField(f, e.target.value)}
                    required={f.required}
                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                  >
                    <option value="">Select…</option>
                    {(f.options ?? selectSources?.[f.name] ?? []).map((option) => {
                      const value = typeof option === "string" ? option : option.value;
                      const label = typeof option === "string" ? option : option.label;
                      return (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      );
                    })}
                  </select>
                ) : f.type === "textarea" || f.type === "list" || f.type === "json" ? (
                  <Textarea
                    id={`f-${f.name}`}
                    value={toInputValue(f, draft[f.name])}
                    onChange={(e) => updateField(f, e.target.value)}
                    required={f.required}
                    rows={f.type === "json" ? 10 : 4}
                    className={f.type === "json" ? "font-mono text-xs" : ""}
                  />
                ) : (
                  <Input
                    id={`f-${f.name}`}
                    type={f.type === "number" ? "number" : "text"}
                    min={f.type === "number" ? f.min : undefined}
                    step={f.type === "number" ? (f.step ?? "any") : undefined}
                    value={toInputValue(f, draft[f.name])}
                    onChange={(e) => updateField(f, e.target.value)}
                    required={f.required}
                  />
                )}
                {f.help && <p className="text-xs text-muted-foreground">{f.help}</p>}
              </div>
            ))}
          </div>

          <Button
            type="submit"
            disabled={save.isPending}
            className="mt-6 bg-ink text-ink-foreground hover:bg-ink-soft"
          >
            {save.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save
          </Button>
        </form>
      )}

      <div className="mt-6 overflow-x-auto rounded-2xl border border-border">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="bg-surface text-left">
            <tr>
              {listColumns.map((c) => (
                <th key={c.name} className="px-4 py-3 font-semibold">
                  {c.label}
                </th>
              ))}
              <th className="px-4 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {rowsQuery.isLoading && (
              <tr>
                <td colSpan={listColumns.length + 1} className="px-4 py-8 text-center">
                  <Loader2 className="mx-auto h-4 w-4 animate-spin" />
                </td>
              </tr>
            )}
            {!rowsQuery.isLoading && rows.length === 0 && (
              <tr>
                <td
                  colSpan={listColumns.length + 1}
                  className="px-4 py-8 text-center text-muted-foreground"
                >
                  No records yet.
                </td>
              </tr>
            )}
            {rows.map((row) => (
              <tr key={String(row[idColumn])} className="border-t border-border bg-card">
                {listColumns.map((c) => (
                  <td key={c.name} className="px-4 py-3">
                    {typeof row[c.name] === "boolean"
                      ? row[c.name]
                        ? "Yes"
                        : "No"
                      : String(row[c.name] ?? "—").slice(0, c.maxLength ?? 60)}
                  </td>
                ))}
                <td className="whitespace-nowrap px-4 py-3 text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => startEdit(row)}
                    aria-label={`Edit ${String(row[listColumns[0]?.name ?? idColumn] ?? "record")}`}
                    title="Edit record"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    aria-label={`Delete ${String(row[listColumns[0]?.name ?? idColumn] ?? "record")}`}
                    title="Delete record"
                    onClick={() => {
                      if (window.confirm("Delete this record?"))
                        remove.mutate(String(row[idColumn]));
                    }}
                  >
                    <Trash2 className="h-3.5 w-3.5 text-destructive" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalRows > PAGE_SIZE ? (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>
            Page {page + 1} of {totalPages} · {totalRows.toLocaleString("en-IN")} records · Search
            filters this page
          </p>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={page === 0 || rowsQuery.isFetching}
              onClick={() => setPage((value) => Math.max(0, value - 1))}
            >
              <ChevronLeft className="mr-1 h-3.5 w-3.5" /> Previous
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={page + 1 >= totalPages || rowsQuery.isFetching}
              onClick={() => setPage((value) => Math.min(totalPages - 1, value + 1))}
            >
              Next <ChevronRight className="ml-1 h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
