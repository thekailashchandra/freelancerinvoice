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
    subtitle: "अपना अनुरोध भेजें — यह हमारी सहायता ईमेल पर जाएगा।",
  },
  cookie: {
    title: "इस साइट को मुफ़्त रखने के लिए हम कुकीज़ का उपयोग करते हैं",
    intro:
      "{name} फ्रीलांसर्स के लिए एक मुफ़्त इनवॉइस टूल है। कुकीज़ ऐप चलाने, उपयोग समझने और — यदि आप सहमत हों — होस्टिंग और विकास में मदद करने वाले विज्ञापन दिखाने में मदद करती हैं।",
    pointEssential:
      "आवश्यक कुकीज़ साइन-इन, सुरक्षा और आपकी भाषा प्राथमिकता के लिए हैं। ये हमेशा चालू रहती हैं।",
    pointAnalytics:
      "एनालिटिक्स कुकीज़ (Google Analytics) अनाम आँकड़े इकट्ठा करती हैं ताकि हम उत्पाद सुधार सकें।",
    pointAds:
      "विज्ञापन कुकीज़ (Google AdSense) स्वीकार करने पर प्रासंगिक विज्ञापन दिखा सकती हैं — इससे इनवॉइसिंग सभी के लिए मुफ़्त रहती है।",
    pointData:
      "हम आपके खाते में संग्रहीत इनवॉइस, ग्राहक या भुगतान विवरण पढ़ने के लिए कुकीज़ का उपयोग नहीं करते।",
    privacyLead: "हमारी",
    privacyPolicy: "गोपनीयता नीति",
    cookieSettings: "कुकी सेटिंग्स",
    essentialOnly: "आवश्यक और एनालिटिक्स",
    essentialHint: "कोई व्यक्तिगत विज्ञापन नहीं",
    accept: "सभी कुकीज़ स्वीकारें",
    acceptHint: "विज्ञापन + एनालिटिक्स · मुफ़्त पहुँच में मदद",
  },
};

export const hi = patchMessages(landingHi, hiCore);
