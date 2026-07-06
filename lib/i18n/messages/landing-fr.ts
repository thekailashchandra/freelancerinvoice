import type { MessageTree } from "@/lib/i18n/types";

/** French translations for landing page and public navigation. */
export const landingFr: MessageTree = {
  nav: {
    guides: "Guides",
    blog: "Blog",
    templates: "Modèles",
    home: "Accueil",
    about: "À propos",
    contact: "Contact",
    indiaInvoicing: "Facturation en Inde",
    freelanceFinances: "Finances freelance",
    globalCompliance: "Conformité mondiale",
    privacyPolicy: "Politique de confidentialité",
    terms: "Conditions",
    refundPolicy: "Politique de remboursement",
    login: "Connexion",
    signup: "Inscription",
    menu: "Menu",
    openMenu: "Ouvrir le menu",
  },
  guides: {
    label: "Guides",
    learn: "Apprendre",
    allGuides: "Tous les guides de facturation",
    financesHub: "Hub finances freelance",
    popularArticles: "Articles populaires",
    viewAll: "Voir tous les guides",
    minRead: "min de lecture",
  },
  footer: {
    tagline: "Générateur de factures gratuit pour les freelances",
    sitemap: "Plan du site",
    llmsTxt: "LLMs.txt",
  },
  geo: {
    keyFacts: "Faits clés",
    summary:
      "Réponses rapides pour les freelances qui évaluent un générateur de factures gratuit.",
  },
  landing: {
    hero: {
      badge: "Conçu pour les freelances et agences",
      titlePrefix: "Gratuit",
      titleHighlight: "Facture pour freelances",
      titleSuffix: " : facturation professionnelle en quelques minutes",
      description:
        "{name} est le moyen le plus rapide de créer une facture pour du travail freelance. Générez de belles factures PDF, suivez les paiements et gérez tout votre flux de facturation freelance sur une plateforme cloud, sans tableurs ni modèles désordonnés.",
      ctaPrimary: "Créez votre première facture freelance",
      ctaFeatures: "Voir les fonctionnalités",
      ctaSignIn: "Connexion",
      metaFree: "Gratuit pour commencer",
      metaPricing: "Voir les tarifs",
      metaPdf: "Export PDF",
      metaCloud: "Historique des factures cloud",
    },
    features: {
      title: "Tout ce dont les freelances ont besoin pour facturer leurs clients",
      subtitle:
        "De votre premier contrat freelance à un portefeuille complet de clients, notre générateur de factures garde la facturation simple, professionnelle et organisée.",
      f1: {
        title: "Factures professionnelles pour freelances",
        description:
          "Créez des factures soignées pour le travail freelance avec aperçu en direct, votre logo, lignes détaillées et export PDF en un clic.",
      },
      f2: {
        title: "Stockage de factures dans le cloud",
        description:
          "Chaque facture freelance est sauvegardée en toute sécurité dans le cloud. Accédez à votre historique de facturation depuis n'importe quel appareil.",
      },
      f3: {
        title: "Historique et filtres de factures",
        description:
          "Suivez les factures freelance payées, en attente et en retard avec recherche et filtres de statut conçus pour les entrepreneurs occupés.",
      },
      f4: {
        title: "Comptes sécurisés et isolés",
        description:
          "La sécurité au niveau des lignes garde chaque compte freelance privé. Vos clients et factures restent les vôtres.",
      },
      f5: {
        title: "Export PDF",
        description:
          "Téléchargez une facture PDF prête pour le client en quelques secondes, sans mise en forme manuelle dans Word ou Excel.",
      },
      f6: {
        title: "Facturation multi-devises",
        description:
          "Facturez des clients internationaux avec la bonne devise et des champs de paiement spécifiques au pays sur chaque facture.",
      },
    },
    about: {
      title: "Qu'est-ce qu'une facture pour freelances ?",
      p1: "Une facture pour freelances est le document que vous envoyez après avoir terminé un travail pour demander le paiement à un client. Contrairement aux salariés qui reçoivent un salaire, les freelances et indépendants doivent facturer chaque projet, heure ou période de rétention.",
      p2: "Beaucoup de freelances luttent encore avec des modèles Word, Google Sheets ou des outils génériques. {name} supprime cette friction : aperçu en direct, PDF personnalisés et historique consultable de chaque facture envoyée.",
    },
    steps: {
      title: "Comment créer une facture pour du travail freelance",
      subtitle:
        "Trois étapes de l'inscription au PDF prêt pour le client. La plupart des freelances terminent leur première facture en moins de cinq minutes.",
      s1: {
        title: "Créez votre compte gratuit",
        description:
          "Inscrivez-vous en moins d'une minute. Ajoutez une fois le nom de votre activité freelance, votre logo et vos coordonnées de paiement par défaut.",
      },
      s2: {
        title: "Créez votre facture",
        description:
          "Saisissez les infos client, services, tarifs et dates d'échéance. Regardez votre facture freelance se mettre à jour en temps réel.",
      },
      s3: {
        title: "Envoyez et encaissez",
        description:
          "Exportez un PDF professionnel, envoyez-le par e-mail à votre client et suivez le statut de paiement depuis votre tableau de bord.",
      },
    },
    benefits: {
      title: "Pourquoi les freelances choisissent {name}",
      intro:
        "Que vous soyez designer, développeur, rédacteur, marketeur ou consultant, être payé à temps commence par une facture claire et professionnelle.",
      cta: "Commencez à facturer gratuitement",
      b1: "Générateur de factures gratuit conçu spécifiquement pour les freelances",
      b2: "Pas de tableurs, pas de modèles Word cassés",
      b3: "Factures PDF personnalisées qui paraissent professionnelles à chaque client",
      b4: "Synchronisation cloud pour ne plus jamais perdre une facture freelance",
      b5: "Suivi des paiements pour factures payées, en attente et en retard",
      b6: "Pour designers, développeurs, rédacteurs, consultants et agences",
    },
    useCases: {
      title: "Pour tous les types de facturation freelance",
      u1: {
        title: "Travail freelance par projet",
        body: "Facturez des clients pour des livrables à portée fixe, des sites web aux packs de branding, en passant par la rédaction et le conseil, avec des lignes et totaux clairs.",
      },
      u2: {
        title: "Facturation horaire et rétention",
        body: "Facturez des heures freelance ou des rétentions mensuelles avec des lignes descriptives pour que les clients comprennent exactement ce qu'ils paient.",
      },
      u3: {
        title: "Clients internationaux",
        body: "Envoyez des factures pour des services freelance dans le monde entier avec une devise configurable et des coordonnées de paiement adaptées à votre mode de règlement.",
      },
    },
    guideSection: {
      title: "Guides de facturation freelance",
      subtitle:
        "Articles approfondis sur la facturation internationale, les impôts freelance, les conditions de paiement et les bonnes pratiques de facturation.",
    },
    faq: {
      title: "Questions fréquentes sur les factures freelance",
      subtitle:
        "Réponses aux questions courantes sur la création de factures pour freelances, l'export PDF, la sécurité et l'encaissement plus rapide.",
    },
    cta: {
      title: "Prêt à créer votre facture freelance ?",
      descriptionBefore:
        "Rejoignez des milliers de freelances qui facturent professionnellement avec {name}.",
      descriptionAfter: ", export PDF instantané, historique de factures dans le cloud.",
      freeLink: "Gratuit pour toujours",
      primary: "Commencer, c'est gratuit",
      secondary: "Lire les guides freelance",
    },
  },
};
