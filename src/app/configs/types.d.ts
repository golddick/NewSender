
type NavItems = {
  title: String;
  link: string;
};
type PartnersTypes = {
  url: string;
};

type PlanType = {
  title: string;
};

type DashboardSideBarTypes = {
  title: string;
  url: string;
  icon: any;
};

type subscribersDataTypes = {
  _id: string;
  email: string;
  createdAt: string | Date;
  source: string;
  status?: string;
};



type MembershipTypes = {
  _id: string;
  userId: string;
  email?: string;
  paystackCustomerId: string;
  paystackSubscriptionId?: string;
  plan: "FREE" | "LUNCH" | "GROW" | "SCALE";
  subscriptionStatus?: "active" | "inactive" | "past_due" | "cancelled";
  currentPeriodEnd?: Date | string;
  lastPaymentDate?: Date | string;
  cancellationDate?: Date | string;
  createdAt: Date | string;
  updatedAt: Date | string;
  subscriberLimit?: number; // new
  emailLimit?: number; // new
};




export type SubscriberWithCampaign = {
  email: string;
  name: string | null;
  createdAt: Date;
  campaign: {
    id: string;
    name: string;
  } | null;
};






// export Membership