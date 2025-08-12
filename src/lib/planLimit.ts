export interface PlanLimits {
    categoryLimit: number;
    campaignLimit: number ;
    emailLimit: number;
    subscriberLimit: number;
  }
  
  // export const PLAN_LIMITS: Record<"FREE" | "LUNCH" | "SCALE", PlanLimits> = {
  //   FREE: {
  //     categoryLimit: 1,
  //     campaignLimit: 1,
  //     emailLimit: 2,
  //     subscriberLimit: 500,
  //   },
  //   LUNCH: {
  //     categoryLimit: 2,
  //     campaignLimit: 5,
  //     emailLimit: 10,
  //     subscriberLimit: 2000,
  //   },
  //   SCALE: {
  //     categoryLimit: 5,
  //     campaignLimit: 10,
  //     emailLimit: 50,
  //     subscriberLimit: 10000,
  //   },
  // };

  
  export  const planDetails = {
    FREE: {
      amount: 0,
      subscriberLimit: 500,
      emailLimit: 5,
      campaignLimit: 3,
      appIntegratedLimit: 2,
      blogPostLimit: 10,
      aiGenerationLimit: 5,
    },
    LAUNCH: {
      amount: 2900, // in cents/kobo
      subscriberLimit: 5000,
      emailLimit: 20,
      campaignLimit: 10,
      appIntegratedLimit: 5,
      blogPostLimit: 50,
      aiGenerationLimit: 20,
    },
    SCALE: {
      amount: 9900, // in cents/kobo
      subscriberLimit: 20000,
      emailLimit: 100,
      campaignLimit: 50,
      appIntegratedLimit: 10,
      blogPostLimit: 200,
      aiGenerationLimit: 100,
    },
  }


//   export const PLAN_CONFIG = {
//   "PLN_xpxme65ldog950p": { amount: 15000, name: "LAUNCH" },
//   // "PLN_zpaqmox70eunvd9": { amount: 540000, name: "LUNCH" },
//   "PLN_4idp8h4m8ptak6k": { amount: 50000, name: "SCALE" },
//   // "PLN_l1ck8bvf49k9nhx": { amount: 1000000, name: "SCALE" },
// } as const;


export const PLAN_CONFIG = {
  LAUNCH: {
    monthly: { id: "PLN_xpxme65ldog950p", amount: 15000, name:"LAUNCH" },
    yearly: { id: "PLN_zpaqmox70eunvd9", amount: 540000 },
  },
  SCALE: {
    monthly: { id: "PLN_4idp8h4m8ptak6k", amount: 50000 },
    yearly: { id: "PLN_l1ck8bvf49k9nhx", amount: 1000000 },
  },
  FREE: {
    monthly: { id: "PLN_free_monthly_id", amount: 0 },
    yearly: { id: "PLN_free_yearly_id", amount: 0 },
  },
} as const;



export const availablePlans = [
  {
    id: "FREE",
    name: "Free",
    paystackId: { monthly: null, yearly: null },
    price: { monthly: 0, yearly: 0 },
    features: [
      "Up to 500 subscribers",
      "Send up to 2 emails",
      "Custom subscription page",
      "Basic analytics",
      "Email support",
    ],
  },
  {
    id: "LAUNCH",
    name: "LAUNCH",
    paystackId: {
      monthly: PLAN_CONFIG.LAUNCH.monthly.id,
      yearly: PLAN_CONFIG.LAUNCH.yearly.id,
    },
    price: { monthly: PLAN_CONFIG.LAUNCH.monthly.amount, yearly: PLAN_CONFIG.LAUNCH.yearly.amount },
    features: [
      "Everything in FREE plus:",
      "Up to 5,000 subscribers",
      "Send up to 10 emails",
      "Create 10 campaigns",
      "Add 5 website integrations",
      "50 blog posts",
      "AI-powered content generation",
      "Custom subscription page",
      "Dev API access",
    ],
    popular: true,
  },
  {
    id: "SCALE",
    name: "SCALE",
    paystackId: {
      monthly: PLAN_CONFIG.SCALE.monthly.id,
      yearly: PLAN_CONFIG.SCALE.yearly.id,
    },
    price: { monthly: PLAN_CONFIG.SCALE.monthly.amount, yearly: PLAN_CONFIG.SCALE.yearly.amount },
    features: [
      "Everything in LAUNCH plus:",
      "Up to 10,000 subscribers",
      "Send 50 emails",
      "Create 50 campaigns",
      "Add 10 website integrations",
      "100 blog posts",
      "AI-powered content generation",
      "Custom subscription page",
      "Advanced analytics",
      "Priority support",
      "Extended Dev API access",
    ],
  },
];
