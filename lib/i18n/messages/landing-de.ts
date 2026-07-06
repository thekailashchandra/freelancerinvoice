import type { MessageTree } from "@/lib/i18n/types";

/** German translations for landing page and public navigation. */
export const landingDe: MessageTree = {
  nav: {
    guides: "Leitfäden",
    blog: "Blog",
    templates: "Vorlagen",
    home: "Startseite",
    about: "Über uns",
    contact: "Kontakt",
    indiaInvoicing: "Rechnungsstellung Indien",
    freelanceFinances: "Freelance-Finanzen",
    globalCompliance: "Globale Compliance",
    privacyPolicy: "Datenschutzerklärung",
    terms: "AGB",
    refundPolicy: "Rückerstattungsrichtlinie",
    login: "Anmelden",
    signup: "Registrieren",
    menu: "Menü",
    openMenu: "Menü öffnen",
  },
  guides: {
    label: "Leitfäden",
    learn: "Lernen",
    allGuides: "Alle Abrechnungsleitfäden",
    financesHub: "Freelance-Finanzen-Hub",
    popularArticles: "Beliebte Artikel",
    viewAll: "Alle Leitfäden anzeigen",
    minRead: "Min. Lesezeit",
  },
  footer: {
    tagline: "Kostenloser Rechnungsgenerator für Freelancer",
    sitemap: "Sitemap",
    llmsTxt: "LLMs.txt",
  },
  geo: {
    keyFacts: "Wichtige Fakten",
    summary:
      "Schnelle Antworten für Freelancer, die einen kostenlosen Rechnungsgenerator evaluieren.",
  },
  landing: {
    hero: {
      badge: "Für Freelancer und Agenturen entwickelt",
      titlePrefix: "Kostenlos",
      titleHighlight: "Rechnung für Freelancer",
      titleSuffix: ": Professionelle Abrechnung in Minuten",
      description:
        "{name} ist der schnellste Weg, eine Rechnung für Freelance-Arbeit zu erstellen. Erstellen Sie schöne PDF-Rechnungen, verfolgen Sie Zahlungen und verwalten Sie Ihren gesamten Freelance-Abrechnungsworkflow auf einer Cloud-Plattform – ohne Tabellenkalkulationen oder unübersichtliche Vorlagen.",
      ctaPrimary: "Erstellen Sie Ihre erste Freelancer-Rechnung",
      ctaFeatures: "Funktionen ansehen",
      ctaSignIn: "Anmelden",
      metaFree: "Kostenlos starten",
      metaPricing: "Preise ansehen",
      metaPdf: "PDF-Export",
      metaCloud: "Cloud-Rechnungsverlauf",
    },
    features: {
      title: "Alles, was Freelancer brauchen, um Kunden abzurechnen",
      subtitle:
        "Vom ersten Freelance-Auftrag bis zur vollen Kundenliste hält unser Rechnungsgenerator die Abrechnung einfach, professionell und organisiert.",
      f1: {
        title: "Professionelle Freelancer-Rechnungen",
        description:
          "Erstellen Sie polierte Rechnungen für Freelance-Arbeit mit Live-Vorschau, Ihrem Logo, detaillierten Positionen und PDF-Export mit einem Klick.",
      },
      f2: {
        title: "Cloud-basierte Rechnungsspeicherung",
        description:
          "Jede Freelancer-Rechnung wird sicher in der Cloud gespeichert. Greifen Sie von jedem Gerät auf Ihren Abrechnungsverlauf zu.",
      },
      f3: {
        title: "Rechnungsverlauf und Filter",
        description:
          "Verfolgen Sie bezahlte, ausstehende und überfällige Freelance-Rechnungen mit Suche und Statusfiltern für vielbeschäftigte Auftragnehmer.",
      },
      f4: {
        title: "Sichere, isolierte Konten",
        description:
          "Sicherheit auf Zeilenebene hält jedes Freelancer-Konto privat. Ihre Kunden und Rechnungen gehören nur Ihnen.",
      },
      f5: {
        title: "PDF-Export",
        description:
          "Laden Sie in Sekunden eine kundenfertige PDF-Rechnung herunter – ohne manuelle Formatierung in Word oder Excel.",
      },
      f6: {
        title: "Multi-Währungs-Abrechnung",
        description:
          "Rechnen Sie internationale Kunden mit der richtigen Währung und länderspezifischen Zahlungsfeldern auf jeder Rechnung ab.",
      },
    },
    about: {
      title: "Was ist eine Rechnung für Freelancer?",
      p1: "Eine Rechnung für Freelancer ist das Dokument, das Sie nach Abschluss einer Arbeit senden, um die Zahlung vom Kunden anzufordern. Anders als Angestellte, die Gehalt erhalten, müssen Freelancer und Selbstständige für jedes Projekt, jede Stunde oder jeden Retainer-Zeitraum abrechnen.",
      p2: "Viele Freelancer kämpfen noch mit Word-Vorlagen, Google Sheets oder generischen Tools. {name} beseitigt diese Reibung: Live-Vorschau, gebrandete PDFs und ein durchsuchbarer Verlauf jeder gesendeten Rechnung.",
    },
    steps: {
      title: "So erstellen Sie eine Rechnung für Freelance-Arbeit",
      subtitle:
        "Drei Schritte von der Anmeldung bis zum kundenfertigen PDF. Die meisten Freelancer schließen ihre erste Rechnung in unter fünf Minuten ab.",
      s1: {
        title: "Kostenloses Konto erstellen",
        description:
          "Registrieren Sie sich in unter einer Minute. Fügen Sie einmalig Ihren Freelance-Firmennamen, Logo und Standard-Zahlungsdaten hinzu.",
      },
      s2: {
        title: "Rechnung erstellen",
        description:
          "Geben Sie Kundendaten, Leistungen, Sätze und Fälligkeitsdaten ein. Sehen Sie, wie sich Ihre Freelancer-Rechnung in Echtzeit aktualisiert.",
      },
      s3: {
        title: "Senden und bezahlt werden",
        description:
          "Exportieren Sie ein professionelles PDF, senden Sie es per E-Mail an Ihren Kunden und verfolgen Sie den Zahlungsstatus im Dashboard.",
      },
    },
    benefits: {
      title: "Warum Freelancer {name} wählen",
      intro:
        "Ob Designer, Entwickler, Autor, Marketer oder Berater – pünktliche Bezahlung beginnt mit einer klaren, professionellen Rechnung.",
      cta: "Kostenlos mit der Abrechnung beginnen",
      b1: "Kostenloser Rechnungsgenerator speziell für Freelancer entwickelt",
      b2: "Keine Tabellenkalkulationen, keine kaputten Word-Vorlagen",
      b3: "Gebrandete PDF-Rechnungen, die bei jedem Kunden professionell wirken",
      b4: "Cloud-Sync – verlieren Sie nie wieder eine Freelance-Rechnung",
      b5: "Zahlungsverfolgung für bezahlte, ausstehende und überfällige Rechnungen",
      b6: "Für Designer, Entwickler, Autoren, Berater und Agenturen",
    },
    useCases: {
      title: "Für jede Art von Freelance-Abrechnung",
      u1: {
        title: "Projektbasierte Freelance-Arbeit",
        body: "Rechnen Sie Kunden für fest definierte Leistungen ab – von Websites und Branding-Paketen bis zu Texten und Beratung – mit klaren Positionen und Summen.",
      },
      u2: {
        title: "Stunden- und Retainer-Abrechnung",
        body: "Rechnen Sie Freelance-Stunden oder monatliche Retainer mit beschreibenden Positionen ab, damit Kunden genau verstehen, wofür sie zahlen.",
      },
      u3: {
        title: "Internationale Kunden",
        body: "Senden Sie Rechnungen für Freelance-Dienstleistungen weltweit mit konfigurierbarer Währung und Zahlungsdaten, die zu Ihrer tatsächlichen Bezahlung passen.",
      },
    },
    guideSection: {
      title: "Freelance-Abrechnungsleitfäden",
      subtitle:
        "Ausführliche Artikel zu internationaler Rechnungsstellung, Freelance-Steuern, Zahlungsbedingungen und Rechnungs-Best-Practices.",
    },
    faq: {
      title: "Häufig gestellte Fragen zu Freelancer-Rechnungen",
      subtitle:
        "Antworten auf häufige Fragen zur Erstellung von Rechnungen für Freelancer, PDF-Export, Sicherheit und schnellere Bezahlung.",
    },
    cta: {
      title: "Bereit, Ihre Freelancer-Rechnung zu erstellen?",
      descriptionBefore:
        "Schließen Sie sich Tausenden von Freelancern an, die professionell mit {name} abrechnen.",
      descriptionAfter: ", sofortiger PDF-Export, Cloud-Rechnungsverlauf.",
      freeLink: "Für immer kostenlos",
      primary: "Loslegen, es ist kostenlos",
      secondary: "Freelancer-Leitfäden lesen",
    },
  },
};
