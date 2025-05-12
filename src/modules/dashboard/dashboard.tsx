import Main from "./elements/main/main";

const Dashboard = () => {
  return (
      <Main />
  );
};

export default Dashboard;







// app/dashboard/page.tsx
// import { redirect } from "next/navigation";
// import { currentUser } from "@clerk/nextjs/server";
// import Membership from "@/models/membership.model";
// import { connectDb } from "@/shared/libs/db";
// import Main from "./elements/main/main";

// const Dashboard = async () => {
//   await connectDb();

//   const user = await currentUser();
//   if (!user) {
//     redirect("/sign-in");
//   }

//   const member = await Membership.findOne({ userId: user.id });

//   if (!member || !member.termsAndConditionsAccepted) {
//     redirect("/legal");
//   }

//   return <Main />;
// };

// export default Dashboard;
