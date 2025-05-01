
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
  _id: string,
  userId: string,
  stripeCustomerId: string,
  plan: string,
  createdAt: Date | string,
  updatedAt: Date | string,
}


// export Membership