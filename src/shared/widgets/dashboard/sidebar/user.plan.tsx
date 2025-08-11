

"use client";

import useSubscribersData from "@/shared/hooks/useSubscribersData";
import useGetMembership from "@/shared/hooks/useGetMembership";
import { ICONS } from "@/shared/utils/icons";
import { Slider } from "@nextui-org/slider";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { managePaystackSubscription } from "@/actions/paystack/manage.paystack.subcription";
import { useUser } from "@clerk/nextjs";

const UserPlan = () => {

  const { subscribers, loading: subscribersLoading } = useSubscribersData( );
  const { data: membership, loading: membershipLoading } = useGetMembership();

  console.log(subscribers, 'sub data cart')
  console.log(membership, 'membership data')

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
    <div className="w-full my-3 p-4 bg-black text-white rounded-lg hover:shadow-xl transition-shadow">
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
            track: "bg-gold-700",
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
