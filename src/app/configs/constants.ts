import { ICONS } from "@/shared/utils/icons";
import { atom } from "jotai";

export const navItems: NavItems[] = [
  {
    title: "Home",
    link: "/",
  },
  {
    title: "About",
    link: "/about",
  },
  {
    title: "Resources",
    link: "/coming-soon",
  },
  {
    title: "Blogs",
    link: "/coming-soon",
  },
  {
    title: "Docs",
    link: "/documentation",
  },
];

export const partners: PartnersTypes[] = [
  {
    url: "https://media.beehiiv.com/cdn-cgi/image/fit=scale-down,onerror=redirect,format=auto,width=1080,quality=75/www/company-logos-cyber-ink-bg/CompanyLogosCyberInkBG/resume-worded.svg",
  },
  {
    url: "https://media.beehiiv.com/cdn-cgi/image/fit=scale-down,onerror=redirect,format=auto,width=1080,quality=75/www/company-logos-cyber-ink-bg/CompanyLogosCyberInkBG/clickhole.svg",
  },
  {
    url: "https://media.beehiiv.com/cdn-cgi/image/fit=scale-down,onerror=redirect,format=auto,width=1080,quality=75/www/company-logos-cyber-ink-bg/CompanyLogosCyberInkBG/cre.svg",
  },
  {
    url: "https://media.beehiiv.com/cdn-cgi/image/fit=scale-down,onerror=redirect,format=auto,width=1080,quality=75/www/company-logos-cyber-ink-bg/CompanyLogosCyberInkBG/rap-tv.svg",
  },
  {
    url: "https://media.beehiiv.com/cdn-cgi/image/fit=scale-down,onerror=redirect,format=auto,width=1080,quality=75/www/company-logos-cyber-ink-bg/CompanyLogosCyberInkBG/awa.svg",
  },
  {
    url: "/GeeLogo.png",
  },
  {
    url: "/gnb.png",
  },
];

export const FreePlan: PlanType[] = [
  { title: "Up to 500 subscribers" }, // matched with PLAN_LIMITS.FREE
  { title: "Send up to 2 emails" },
  { title: "1 campaign and 1 category" },
  { title: "Custom subcribtion page" },
  { title: "Newsletter analytics" },
];



export const GrowPlan: PlanType[] = [
  { title: "Up to 2,000 subscribers" }, // matched with PLAN_LIMITS.LUNCH
  { title: "Send up to 10 emails" },
  { title: "5 campaigns and 2 categories" },
  { title: "Custom subcribtion page" },
  { title: "API access" },
  // { title: "Blog access" },
  { title: "Access to TheNews community" },
];

export const ScalePlan: PlanType[] = [
  { title: "Up to 10,000 subscribers" }, 
  { title: "Send up to 50 emails" },
  { title: "10 campaigns and 5 categories" },
  { title: "Advanced support system" },
  { title: "Ad Network" },
];

export const sideBarActiveItem = atom<string>("/dashboard");

export const reportFilterActiveItem = atom<string>("Overview");

export const emailEditorDefaultValue = atom<string>("");

export const settingsActiveItem = atom<string>("Profile");

export const sideBarItems: DashboardSideBarTypes[] = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: ICONS.dashboard,
  },
  {
    title: "Integration",
    url: "/dashboard/integration",
    icon: ICONS.analytics,
  },
  {
    title: "Audience",
    url: "/dashboard/subscribers",
    icon: ICONS.audience,
  },
    {
    title: "Write Email",
    url: "/dashboard/auto-email",
    icon: ICONS.write,
  },
  //   {
  //   title: "Write",
  //   url: "/dashboard/write",
  //   icon: ICONS.write,
  // },
  // {
  //   title: "Campaigns",
  //   url: "/dashboard/campaigns",
  //   icon: ICONS.analytics,
  // },
];

export const sideBarBottomItems: DashboardSideBarTypes[] = [
  {
    title: "Settings",
    url: "/dashboard/settings",
    icon: ICONS.settings,
  },
  {
    title: "Generated URL",
    url: "/dashboard/url",
    icon: ICONS.world,
  },

];


export const AdminsideBarItems: DashboardSideBarTypes[] = [
  {
    title: "Dashboard",
    url: "/xontrol",
    icon: ICONS.dashboard,
  },
  {
    title: "Users",
    url: "/xontrol/users",
    icon: ICONS.profile,
  },
  {
    title: "KYC",
    url: "/xontrol/kyc",
    icon: ICONS.form,
  },
  {
    title: "Blog",
    url: "/xontrol/Blog",
    icon: ICONS.blog,
  },
];

export const AdminsideBarBottomItems: DashboardSideBarTypes[] = [
  {
    title: "Settings",
    url: "/xontrol/settings",
    icon: ICONS.settings,
  },
  {
    title: "Generated URL",
    url: "/dashboard/url",
    icon: ICONS.world,
  },

];