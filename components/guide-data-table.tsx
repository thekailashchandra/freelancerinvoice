import type { GuideTable } from "@/data/guides/types";

type GuideDataTableProps = {
  table: GuideTable;
};

export function GuideDataTable({ table }: GuideDataTableProps) {
  return (
    <div className="ai-content-table mt-4 overflow-x-auto rounded-xl border border-border/50">
      <table className="w-full min-w-[32rem] text-left text-sm">
        {table.caption ? (
          <caption className="sr-only">{table.caption}</caption>
        ) : null}
        <thead className="border-b border-border/50 bg-muted/50">
          <tr>
            {table.headers.map((header) => (
              <th key={header} className="px-4 py-3 font-semibold">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row) => (
            <tr
              key={row.join("-").slice(0, 48)}
              className="border-b border-border/30 last:border-0"
            >
              {row.map((cell) => (
                <td
                  key={cell.slice(0, 32)}
                  className="px-4 py-3 text-muted-foreground align-top"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
