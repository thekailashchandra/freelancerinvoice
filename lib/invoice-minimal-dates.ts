/** Date format for the Minimal template table (e.g. "15 DEC 2015"). */

export function formatMinimalTableDate(dateString: string): string {
  if (!dateString) return "—";
  const date = new Date(`${dateString}T12:00:00`);
  if (Number.isNaN(date.getTime())) return dateString;
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
    .format(date)
    .replace(/,/g, "")
    .toUpperCase();
}

export function formatMinimalFooterYear(dateString: string): string {
  if (!dateString) return String(new Date().getFullYear());
  const date = new Date(`${dateString}T12:00:00`);
  if (Number.isNaN(date.getTime())) return String(new Date().getFullYear());
  return String(date.getFullYear());
}
