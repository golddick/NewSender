export interface PlanLimits {
    categoryLimit: number;
    campaignLimit: number ;
    emailLimit: number;
    subscriberLimit: number;
  }
  
  export const PLAN_LIMITS: Record<"FREE" | "LUNCH" | "SCALE", PlanLimits> = {
    FREE: {
      categoryLimit: 1,
      campaignLimit: 1,
      emailLimit: 2,
      subscriberLimit: 500,
    },
    LUNCH: {
      categoryLimit: 2,
      campaignLimit: 5,
      emailLimit: 10,
      subscriberLimit: 2000,
    },
    SCALE: {
      categoryLimit: 5,
      campaignLimit: 10,
      emailLimit: 50,
      subscriberLimit: 10000,
    },
  };
  