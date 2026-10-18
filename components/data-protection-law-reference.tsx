import Link from "next/link";
import { getPrimaryDataLaw } from "@/data/data-protection-laws";
import { getIsoCountryName } from "@/lib/iso-data";

export function DataProtectionLawReference() {
  return (
    <section>
      <h2 className="text-lg font-semibold">Regional privacy notices</h2>
      <p className="mt-2">
        We localize consent and privacy notices to the country detected from
        your IP or chosen in the site locale switcher - for example GDPR in the
        EU, UK GDPR in Britain, DPDP in India, or LGPD in Brazil. You only see
        the notice that applies where you are; we do not ask you to review laws
        for other countries.
      </p>
      <p className="mt-3 text-muted-foreground">
        Full details for your region are in the sections above and in our{" "}
        <Link href="/privacy" className="text-primary hover:underline">
          Privacy Policy
        </Link>
        .
      </p>
    </section>
  );
}

/** Short message when consent is required before Google sign-in. */
export function consentRequiredToastMessage(
  countryCode: string | null | undefined
): string {
  const law = getPrimaryDataLaw(countryCode);
  const countryName = getIsoCountryName(countryCode);
  if (!countryName || law.id === "general") {
    return "Please accept the Terms and Privacy Policy above before continuing.";
  }
  return `Please accept the Terms and Privacy Policy above first.`;
}
