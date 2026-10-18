import type { MessageTree } from "@/lib/i18n/types";
import { landingHi } from "@/lib/i18n/messages/landing-hi";
import { patchMessages } from "@/lib/i18n/merge-messages";

const hiCore: MessageTree = {
  nav: {
    dashboard: "डैशबोर्ड",
    createInvoice: "इनवॉइस बनाएं",
    invoiceHistory: "इनवॉइस इतिहास",
    customers: "ग्राहक",
    settings: "सेटिंग्स",
    features: "फ़ीचर्स",
    pricing: "मूल्य",
    signIn: "साइन इन",
    signUp: "साइन अप",
    getStarted: "मुफ़्त शुरू करें",
  },
  locale: {
    chooseCountry: "देश और भाषा",
    searchCountries: "देश खोजें…",
    languageLabel: "भाषा",
    noCountries: "कोई देश नहीं मिला",
    commonCountries: "सामान्य देश। और खोजें",
  },
  userMenu: {
    settings: "सेटिंग्स",
    support: "सहायता अनुरोध",
    signOut: "साइन आउट",
    signOutFailed: "साइन आउट विफल",
  },
  sidebar: { privacy: "गोपनीयता" },
  mobileNav: { create: "बनाएं", history: "इतिहास" },
  dashboard: {
    title: "डैशबोर्ड",
    subtitle: "आपके इनवॉइस का अवलोकन",
    newInvoice: "नया इनवॉइस",
    viewAll: "सभी देखें",
    recentInvoices: "हाल के इनवॉइस",
    totalInvoices: "कुल इनवॉइस",
    paid: "भुगतान हो चुका",
    pending: "लंबित",
    revenue: "आय",
    emptyTitle: "अभी कोई इनवॉइस नहीं",
    emptyDescription: "शुरू करने के लिए अपना पहला इनवॉइस बनाएं।",
  },
  settings: {
    title: "सेटिंग्स",
    subtitle: "नए इनवॉइस के लिए डिफ़ॉल्ट विवरण",
    save: "सेटिंग्स सहेजें",
    saving: "सहेजा जा रहा है…",
    saved: "सेटिंग्स सहेजी गईं",
  },
  customers: {
    title: "ग्राहक",
    subtitle: "सहेजे गए ग्राहक, उनके इनवॉइस और स्टेटमेंट देखें।",
    createInvoice: "इनवॉइस बनाएं",
    search: "ग्राहक खोजें…",
  },
  support: {
    title: "सहायता",
    subtitle: "अपना अनुरोध भेजें - यह हमारी सहायता ईमेल पर जाएगा।",
  },
  cookie: {
    message:
      "हम इस साइट को मुफ़्त रखने के लिए एनालिटिक्स और वैकल्पिक विज्ञापन कुकीज़ का उपयोग करते हैं। देखें",
    privacyPolicy: "गोपनीयता नीति",
    cookieSettings: "कुकी सेटिंग्स",
    essentialOnly: "केवल आवश्यक",
    accept: "सभी स्वीकारें",
  },
};

export const hi = patchMessages(landingHi, hiCore);
