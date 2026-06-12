/** Date formats used by the Modern invoice template. */

import { modernTheme } from "@/lib/invoice-modern-theme";

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

/** Hero fill for the Total Due highlight box. */
export const modernTotalDuePattern = modernTheme.totalGradient;
