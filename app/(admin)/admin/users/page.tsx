"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { PageTransition } from "@/components/page-transition";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchAdminUsersClient } from "@/lib/api/superadmin-client";
import { countryFlagEmoji } from "@/lib/i18n/country-locale";
import type { AdminUserRow, Paginated } from "@/types/superadmin";

export default function SuperadminUsersPage() {
  const [data, setData] = useState<Paginated<AdminUserRow> | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const result = await fetchAdminUsersClient({ page, search });
        if (!cancelled) setData(result);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    const timer = setTimeout(() => void load(), search ? 250 : 0);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [page, search]);

  const totalPages = data ? Math.max(1, Math.ceil(data.total / data.pageSize)) : 1;

  return (
    <PageTransition className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Users</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          All registered freelancers and their usage.
        </p>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="pl-9"
          placeholder="Search email or company…"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="space-y-3 p-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-muted-foreground">
                    <th className="px-4 py-3 font-medium">User</th>
                    <th className="px-4 py-3 font-medium">Country</th>
                    <th className="px-4 py-3 font-medium">Invoices</th>
                    <th className="px-4 py-3 font-medium">Clients</th>
                    <th className="px-4 py-3 font-medium">Joined</th>
                    <th className="px-4 py-3 font-medium">Last active</th>
                  </tr>
                </thead>
                <tbody>
                  {(data?.items ?? []).map((user) => (
                    <tr key={user.id} className="border-b border-border/70">
                      <td className="px-4 py-3">
                        <p className="font-medium">{user.companyName || "—"}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </td>
                      <td className="px-4 py-3">
                        {countryFlagEmoji(user.countryCode)} {user.countryCode}
                      </td>
                      <td className="px-4 py-3">{user.invoiceCount}</td>
                      <td className="px-4 py-3">{user.clientCount}</td>
                      <td className="px-4 py-3">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        {user.lastActiveAt
                          ? new Date(user.lastActiveAt).toLocaleString()
                          : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {data ? `${data.total} users total` : ""}
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </PageTransition>
  );
}
