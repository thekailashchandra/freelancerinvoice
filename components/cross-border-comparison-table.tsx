import type { CrossBorderComparisonRow } from "@/data/cross-border-comparisons";

type CrossBorderComparisonTableProps = {
  rows: CrossBorderComparisonRow[];
  caption?: string;
};

export function CrossBorderComparisonTable({
  rows,
  caption = "India freelancer payout channels compared",
}: CrossBorderComparisonTableProps) {
  return (
    <div className="ai-content-table mt-4 overflow-x-auto rounded-xl border border-border/50">
      <table className="w-full min-w-[48rem] text-left text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead className="border-b border-border/50 bg-muted/50">
          <tr>
            <th className="px-4 py-3 font-semibold">Payout channel</th>
            <th className="px-4 py-3 font-semibold">Speed</th>
            <th className="px-4 py-3 font-semibold">Typical fees</th>
            <th className="px-4 py-3 font-semibold">Tax / withholding</th>
            <th className="px-4 py-3 font-semibold">Best for</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.channel}
              className="border-b border-border/30 last:border-0"
            >
              <th className="px-4 py-3 font-medium text-foreground align-top">
                {row.channel}
              </th>
              <td className="px-4 py-3 text-muted-foreground align-top">
                {row.payoutSpeed}
              </td>
              <td className="px-4 py-3 text-muted-foreground align-top">
                {row.typicalFees}
              </td>
              <td className="px-4 py-3 text-muted-foreground align-top">
                {row.taxWithholding}
              </td>
              <td className="px-4 py-3 text-muted-foreground align-top">
                {row.bestFor}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
