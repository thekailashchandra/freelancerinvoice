import type { MessageTree } from "@/lib/i18n/types";
import { landingZh } from "@/lib/i18n/messages/landing-zh";
import { patchMessages } from "@/lib/i18n/merge-messages";

const zhCore: MessageTree = {
  nav: {
    dashboard: "仪表板",
    createInvoice: "创建发票",
    invoiceHistory: "发票历史",
    customers: "客户",
    settings: "设置",
    features: "功能",
    pricing: "定价",
    signIn: "登录",
    signUp: "注册",
    getStarted: "免费开始",
  },
  locale: {
    chooseCountry: "国家和语言",
    searchCountries: "搜索国家…",
    languageLabel: "语言",
  },
  userMenu: {
    settings: "设置",
    support: "提交请求",
    signOut: "退出登录",
  },
  dashboard: {
    title: "仪表板",
    subtitle: "发票概览",
    newInvoice: "新建发票",
    totalInvoices: "发票总数",
    paid: "已付款",
    pending: "待付款",
    revenue: "收入",
  },
  settings: { title: "设置", save: "保存设置" },
  customers: { title: "客户", search: "搜索客户…" },
  cookie: {
    message:
      "我们使用 Cookie 进行分析和可选广告，以保持本网站免费。请参阅",
    privacyPolicy: "隐私政策",
    cookieSettings: "Cookie 设置",
    essentialOnly: "仅必要",
    accept: "全部接受",
  },
};

export const zh = patchMessages(landingZh, zhCore);
