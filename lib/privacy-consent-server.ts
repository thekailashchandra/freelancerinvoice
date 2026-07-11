export {
  recordLegalConsentForUser,
  recordPrivacyConsentForUser,
  hasLegalConsent,
} from "@/lib/legal-consent-server";

import { hasLegalConsent } from "@/lib/legal-consent-server";

/** @deprecated Use hasLegalConsent */
export const hasPrivacyConsent = hasLegalConsent;
