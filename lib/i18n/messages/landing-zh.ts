import type { MessageTree } from "@/lib/i18n/types";

/** Chinese translations for landing page and public navigation. */
export const landingZh: MessageTree = {
  nav: {
    guides: "指南",
    blog: "博客",
    templates: "模板",
    home: "首页",
    about: "关于",
    contact: "联系",
    indiaInvoicing: "印度开票",
    freelanceFinances: "自由职业财务",
    globalCompliance: "全球合规",
    privacyPolicy: "隐私政策",
    terms: "条款",
    refundPolicy: "退款政策",
    login: "登录",
    signup: "注册",
    menu: "菜单",
    openMenu: "打开菜单",
  },
  guides: {
    label: "指南",
    learn: "学习",
    allGuides: "所有开票指南",
    financesHub: "自由职业财务中心",
    popularArticles: "热门文章",
    viewAll: "查看所有指南",
    minRead: "分钟阅读",
  },
  footer: {
    tagline: "面向自由职业者的免费发票生成器",
    sitemap: "网站地图",
    llmsTxt: "LLMs.txt",
  },
  geo: {
    keyFacts: "关键事实",
    summary:
      "为评估免费发票生成器的自由职业者提供快速解答。",
  },
  landing: {
    hero: {
      badge: "为自由职业者和代理机构打造",
      titlePrefix: "免费",
      titleHighlight: "自由职业者发票",
      titleSuffix: "：几分钟内完成专业开票",
      description:
        "{name} 是创建自由职业工作发票的最快方式。生成精美的 PDF 发票、跟踪付款，并在统一的云平台上管理整个自由职业开票流程，无需电子表格或杂乱的模板。",
      ctaPrimary: "创建您的第一张自由职业者发票",
      ctaFeatures: "查看功能",
      ctaSignIn: "登录",
      metaFree: "免费开始",
      metaPricing: "查看定价",
      metaPdf: "PDF 导出",
      metaCloud: "云端发票历史",
    },
    features: {
      title: "自由职业者向客户开票所需的一切",
      subtitle:
        "从您的第一个自由职业项目到完整的客户名单，我们的发票生成器让开票保持简单、专业且有条理。",
      f1: {
        title: "专业的自由职业者发票",
        description:
          "为自由职业工作创建精美的发票，支持实时预览、您的徽标、明细行项目和一键 PDF 导出。",
      },
      f2: {
        title: "云端发票存储",
        description:
          "每位自由职业者的每张发票都安全保存在云端。从任何设备访问您的开票历史。",
      },
      f3: {
        title: "发票历史与筛选",
        description:
          "通过为繁忙承包商打造的搜索和状态筛选，跟踪已付款、待付款和逾期的自由职业者发票。",
      },
      f4: {
        title: "安全、隔离的账户",
        description:
          "行级安全确保每个自由职业者账户的隐私。您的客户和发票只属于您。",
      },
      f5: {
        title: "PDF 导出",
        description:
          "几秒钟内下载可供客户使用的 PDF 发票，无需在 Word 或 Excel 中手动排版。",
      },
      f6: {
        title: "多币种开票",
        description:
          "以正确的货币和每张账单上的国家特定付款字段向国际客户开票。",
      },
    },
    about: {
      title: "什么是自由职业者发票？",
      p1: "自由职业者发票是您在完成工作后发送给客户的文件，用于请求付款。与领取薪水的员工不同，自由职业者和独立承包商必须为每个项目、工时或保留期开具账单。",
      p2: "许多自由职业者仍在与 Word 模板、Google 表格或通用工具作斗争。{name} 消除了这种摩擦：实时预览、品牌化 PDF 以及每张已发送发票的可搜索历史记录。",
    },
    steps: {
      title: "如何为自由职业工作创建发票",
      subtitle:
        "从注册到可供客户使用的 PDF，只需三步。大多数自由职业者在五分钟内完成第一张发票。",
      s1: {
        title: "创建免费账户",
        description:
          "不到一分钟即可注册。一次性添加您的自由职业企业名称、徽标和默认付款详情。",
      },
      s2: {
        title: "创建发票",
        description:
          "输入客户信息、服务、费率和到期日。实时查看您的自由职业者发票更新。",
      },
      s3: {
        title: "发送并收款",
        description:
          "导出专业 PDF，通过电子邮件发送给客户，并从仪表板跟踪付款状态。",
      },
    },
    benefits: {
      title: "自由职业者为何选择 {name}",
      intro:
        "无论您是设计师、开发者、作家、营销人员还是顾问，按时收款都始于清晰、专业的发票。",
      cta: "免费开始开票",
      b1: "专为自由职业者设计的免费发票生成器",
      b2: "无需电子表格，无需破损的 Word 模板",
      b3: "面向每位客户都显得专业的品牌化 PDF 发票",
      b4: "云端同步，再也不会丢失自由职业者发票",
      b5: "跟踪已付款、待付款和逾期账单的付款状态",
      b6: "适用于设计师、开发者、作家、顾问和代理机构",
    },
    useCases: {
      title: "适用于各类自由职业开票",
      u1: {
        title: "基于项目的自由职业工作",
        body: "为固定范围的交付物向客户开票，从网站和品牌套餐到文案和咨询，附带清晰的行项目和总计。",
      },
      u2: {
        title: "按小时和保留费开票",
        body: "为自由职业工时或月度保留费开具发票，附带描述性行项目，让客户清楚了解付款内容。",
      },
      u3: {
        title: "国际客户",
        body: "向全球发送自由职业服务发票，可配置货币和与您实际收款方式匹配的付款详情。",
      },
    },
    guideSection: {
      title: "自由职业者开票指南",
      subtitle:
        "关于国际开票、自由职业税务、付款条款和发票最佳实践的深度文章。",
    },
    faq: {
      title: "关于自由职业者发票的常见问题",
      subtitle:
        "关于创建自由职业者发票、PDF 导出、安全性和更快收款的常见问题解答。",
    },
    cta: {
      title: "准备好创建您的自由职业者发票了吗？",
      descriptionBefore:
        "加入数千名使用 {name} 专业开票的自由职业者。",
      descriptionAfter: "，即时 PDF 导出，云端发票历史。",
      freeLink: "永久免费",
      primary: "开始使用，完全免费",
      secondary: "阅读自由职业者指南",
    },
  },
};
