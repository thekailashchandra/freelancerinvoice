import type { MessageTree } from "@/lib/i18n/types";
import { landingAr } from "@/lib/i18n/messages/landing-ar";
import { patchMessages } from "@/lib/i18n/merge-messages";

const arCore: MessageTree = {
  nav: {
    dashboard: "لوحة التحكم",
    createInvoice: "إنشاء فاتورة",
    invoiceHistory: "سجل الفواتير",
    customers: "العملاء",
    settings: "الإعدادات",
    features: "الميزات",
    pricing: "الأسعار",
    signIn: "تسجيل الدخول",
    signUp: "إنشاء حساب",
    getStarted: "ابدأ مجانًا",
  },
  locale: {
    chooseCountry: "البلد واللغة",
    searchCountries: "ابحث عن البلدان…",
    languageLabel: "اللغة",
  },
  userMenu: {
    settings: "الإعدادات",
    support: "طلب دعم",
    signOut: "تسجيل الخروج",
  },
  dashboard: {
    title: "لوحة التحكم",
    subtitle: "نظرة عامة على فواتيرك",
    newInvoice: "فاتورة جديدة",
    totalInvoices: "إجمالي الفواتير",
    paid: "مدفوعة",
    pending: "معلقة",
    revenue: "الإيرادات",
  },
  settings: { title: "الإعدادات", save: "حفظ الإعدادات" },
  customers: { title: "العملاء", search: "ابحث عن العملاء…" },
  cookie: {
    title: "نستخدم ملفات تعريف الارتباط لإبقاء هذا الموقع مجانياً",
    intro:
      "{name} أداة فواتير مجانية للمستقلين. تساعدنا ملفات تعريف الارتباط في تشغيل التطبيق وفهم الاستخدام — وإذا وافقت — عرض إعلانات تساعد في تغطية الاستضافة والتطوير.",
    pointEssential:
      "الملفات الأساسية تشغّل تسجيل الدخول والأمان وتفضيل اللغة. وهي مفعّلة دائماً.",
    pointAnalytics:
      "ملفات التحليلات (Google Analytics) تجمع إحصاءات زيارة مجهولة لتحسين المنتج.",
    pointAds:
      "ملفات الإعلانات (Google AdSense) قد تعرض إعلانات ذات صلة عند الموافقة — مما يساعد في إبقاء الفوترة مجانية.",
    pointData:
      "لا نستخدم ملفات تعريف الارتباط لقراءة فواتيرك أو عملائك أو بيانات الدفع في حسابك.",
    privacyLead: "اقرأ",
    privacyPolicy: "سياسة الخصوصية",
    cookieSettings: "إعدادات ملفات تعريف الارتباط",
    essentialOnly: "الأساسية والتحليلات",
    essentialHint: "بدون إعلانات مخصصة",
    accept: "قبول جميع ملفات تعريف الارتباط",
    acceptHint: "إعلانات + تحليلات · يدعم الوصول المجاني",
  },
};

export const ar = patchMessages(landingAr, arCore);
