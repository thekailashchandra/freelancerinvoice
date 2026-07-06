/** Google Analytics (gtag.js) */

function resolveMeasurementId(): string {
  return process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() || "G-CKRTQSP84C";
}

const measurementId = resolveMeasurementId();

export const analyticsConfig = {
  measurementId,
  gtagScriptUrl: `https://www.googletagmanager.com/gtag/js?id=${measurementId}`,
} as const;
