/** Date formats used by the Modern invoice template. */

export function formatModernHeaderDate(dateString: string): string {
  if (!dateString) return "DATE. —";
  const date = new Date(`${dateString}T12:00:00`);
  if (Number.isNaN(date.getTime())) return `DATE. ${dateString}`;
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const yyyy = date.getFullYear();
  return `DATE. ${mm}.${dd}.${yyyy}`;
}

export function formatModernMetaDate(dateString: string): string {
  if (!dateString) return "—";
  const date = new Date(`${dateString}T12:00:00`);
  if (Number.isNaN(date.getTime())) return dateString;
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
    .format(date)
    .toUpperCase();
}

/** Diagonal stripe fill for the Total Due highlight box. */
export const modernTotalDuePattern =
  "repeating-linear-gradient(-45deg, #f2f2f2 0, #f2f2f2 10px, #e8e8e8 10px, #e8e8e8 20px)";
