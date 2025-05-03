// // import { manageSubscription } from "@/actions/manage.subscription";
// import { managePaystackSubscription } from "@/actions/manage.paystack.subcription";
// import useGetMembership from "@/shared/hooks/useGetMembership";
// import useSubscribersData from "@/shared/hooks/useSubscribersData"; 
// import { ICONS } from "@/shared/utils/icons";
// import { Slider } from "@nextui-org/slider";
// import { useRouter } from "next/navigation";

// const UserPlan = () => {
//   const { data, loading } = useSubscribersData();
//   const { data: membershipData, loading: membershipLoading } =
//     useGetMembership();
//   const history = useRouter();

//   console.log(data, "data from user plan");
//   console.log(membershipData, "mem from user plan");

//   // const handleManage = async () => {
//   //   try {
//   //     const res = await manageSubscription({
//   //       customerId: membershipData?.stripeCustomerId,
//   //     });
  
//   //     if ("url" in res) {
//   //       history.push(res.url);
//   //     } else {
//   //       console.error("Stripe error:", res.error);
//   //       // Optionally show a toast or alert here
//   //     }
//   //   } catch (error) {
//   //     console.error("Unexpected error during subscription:", error);
//   //   }
//   // };


//   const handleManage = async () => {
//     const customerId = membershipData?.stripeCustomerId;

//     if (!customerId) {
//       console.error("Missing Stripe customer ID");
//       // Optionally show a toast or message to the user
//       return;
//     }

//     try {
//       const res = await managePaystackSubscription({ customerId });

//       console.log(res, "res from manage subscription");

//       if ("url" in res) {
//         console.log("Redirecting to Stripe billing portal:", res.url);
//         history.push(res.url); // or window.location.href = res.url
      
//       } else {
//         console.error("Stripe error:", res.error);
//         // Optionally notify user here
//       }
//     } catch (error) {
//       console.error("Unexpected error during subscription:", error);
//       // Optionally notify user here
//     }
//   };
  

//   return (
//     <div className="w-full my-3 p-3 bg-red-700 rounded hover:shadow-xl cursor-pointer">
//       <div className="w-full flex items-center">
//         <h5 className="text-lg font-medium">
//           {membershipLoading ? "..." : "GROW"} Plan
//         </h5>
//         <div
//           className="w-[95px] shadow ml-2 cursor-pointer h-[32px] flex justify-center items-center space-x-1 rounded-lg bg-red-500"
//           onClick={handleManage}
//         >
//           <span className="text-white text-xl">{ICONS.electric}</span>
//           <span className="text-white text-sm">Upgrade</span>
//         </div>
//       </div>
//       <h5 className="text-white">Total subscribers</h5>
//       <Slider
//         aria-label="Player progress"
//         hideThumb={true}
//         defaultValue={1}
//         className="max-w-md"
//       />
//       <h6 className="text-white">
//         {loading ? "..." : data?.length} of{" "}
//         {membershipData?.plan === "lunch"
//           ? "2500"
//           : membershipData?.plan === "SCALE"
//           ? "10,000"
//           : "1,00,000"}{" "}
//         added
//       </h6>
//     </div>
//   );
// };

// export default UserPlan;


"use client";

import { managePaystackSubscription } from "@/actions/manage.paystack.subcription";
import useGetMembership from "@/shared/hooks/useGetMembership";
import useSubscribersData from "@/shared/hooks/useSubscribersData";
import { ICONS } from "@/shared/utils/icons";
import { Slider } from "@nextui-org/slider";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const UserPlan = () => {
  const { data: subscribers, loading: subscribersLoading } = useSubscribersData();
  const { data: membership, loading: membershipLoading } = useGetMembership();

  const router = useRouter();

  const handleManageSubscription = async () => {
    if (!membership?.paystackCustomerId) {
      toast.error("No active subscription found");
      return;
    }

    try {
      toast.loading("Redirecting to payment portal...", { id: "manage-sub" });

      const result = await managePaystackSubscription({
        customerCode: membership.paystackCustomerId
      });

      toast.dismiss("manage-sub");

      if ("url" in result) {
        window.location.href = result.url;
      } else {
        toast.error(result.error || "Failed to access payment portal");
      }
    } catch (error: any) {
      toast.dismiss("manage-sub");
      toast.error(error.message || "An error occurred");
      console.error("Subscription management error:", error);
    }
  };

  const getSubscriberLimit = () => {
    if (!membership) return 500;
    return membership.subscriberLimit || 500; // fallback to FREE limit
  };

  return (
    <div className="w-full my-3 p-4 bg-red-700 rounded-lg hover:shadow-xl transition-shadow">
      <div className="w-full flex items-center justify-between">
        <h5 className="text-lg font-medium text-white">
          {membershipLoading ? "Loading..." : `${membership?.plan || "FREE"} Plan`}
        </h5>

        {membership?.subscriptionStatus === "active" && (
          <button
            className="flex items-center gap-1 px-3 py-1 rounded-lg bg-red-500 hover:bg-red-600 transition-colors"
            onClick={handleManageSubscription}
            disabled={membershipLoading}
          >
            <span className="text-white text-xl">{ICONS.electric}</span>
            <span className="text-white text-sm">
              {membership?.plan?.toUpperCase() === "FREE" ? "Upgrade" : "Manage"}
            </span>
          </button>
        )}
      </div>

      <div className="mt-4">
        <h5 className="text-white mb-2">Total subscribers</h5>
        <Slider
          aria-label="Subscriber usage"
          value={subscribers?.length || 0}
          maxValue={getSubscriberLimit()}
          hideThumb={true}
          classNames={{
            base: "max-w-md",
            track: "bg-red-800",
            filler: "bg-white"
          }}
        />
        <h6 className="text-white mt-1">
          {subscribersLoading ? "Loading..." : subscribers?.length || 0} of {getSubscriberLimit().toLocaleString()} used
        </h6>
      </div>
    </div>
  );
};

export default UserPlan;
