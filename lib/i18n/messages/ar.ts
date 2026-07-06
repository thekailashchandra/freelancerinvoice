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
    message:
      "نستخدم ملفات تعريف الارتباط للتحليلات والإعلانات الاختيارية لإبقاء هذا الموقع مجانياً. راجع",
    privacyPolicy: "سياسة الخصوصية",
    cookieSettings: "إعدادات ملفات تعريف الارتباط",
    essentialOnly: "الأساسية فقط",
    accept: "قبول الكل",
  },
};

export const ar = patchMessages(landingAr, arCore);
