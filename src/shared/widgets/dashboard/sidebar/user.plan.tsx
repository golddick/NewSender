import { manageSubscription } from "@/actions/manage.subscription";
import useGetMembership from "@/shared/hooks/useGetMembership";
import useSubscribersData from "@/shared/hooks/useSubscribersData"; 
import { ICONS } from "@/shared/utils/icons";
import { Slider } from "@nextui-org/slider";
import { useRouter } from "next/navigation";

const UserPlan = () => {
  const { data, loading } = useSubscribersData();
  const { data: membershipData, loading: membershipLoading } =
    useGetMembership();
  const history = useRouter();

  console.log(data, "data from user plan");
  console.log(membershipData, "mem from user plan");

  // const handleManage = async () => {
  //   try {
  //     const res = await manageSubscription({
  //       customerId: membershipData?.stripeCustomerId,
  //     });
  
  //     if ("url" in res) {
  //       history.push(res.url);
  //     } else {
  //       console.error("Stripe error:", res.error);
  //       // Optionally show a toast or alert here
  //     }
  //   } catch (error) {
  //     console.error("Unexpected error during subscription:", error);
  //   }
  // };


  const handleManage = async () => {
    const customerId = membershipData?.stripeCustomerId;

    if (!customerId) {
      console.error("Missing Stripe customer ID");
      // Optionally show a toast or message to the user
      return;
    }

    try {
      const res = await manageSubscription({ customerId });

      console.log(res, "res from manage subscription");

      if ("url" in res) {
        console.log("Redirecting to Stripe billing portal:", res.url);
        history.push(res.url); // or window.location.href = res.url
      
      } else {
        console.error("Stripe error:", res.error);
        // Optionally notify user here
      }
    } catch (error) {
      console.error("Unexpected error during subscription:", error);
      // Optionally notify user here
    }
  };
  

  return (
    <div className="w-full my-3 p-3 bg-red-700 rounded hover:shadow-xl cursor-pointer">
      <div className="w-full flex items-center">
        <h5 className="text-lg font-medium">
          {membershipLoading ? "..." : "GROW"} Plan
        </h5>
        <div
          className="w-[95px] shadow ml-2 cursor-pointer h-[32px] flex justify-center items-center space-x-1 rounded-lg bg-red-500"
          onClick={handleManage}
        >
          <span className="text-white text-xl">{ICONS.electric}</span>
          <span className="text-white text-sm">Upgrade</span>
        </div>
      </div>
      <h5 className="text-white">Total subscribers</h5>
      <Slider
        aria-label="Player progress"
        hideThumb={true}
        defaultValue={1}
        className="max-w-md"
      />
      <h6 className="text-white">
        {loading ? "..." : data?.length} of{" "}
        {membershipData?.plan === "lunch"
          ? "2500"
          : membershipData?.plan === "SCALE"
          ? "10,000"
          : "1,00,000"}{" "}
        added
      </h6>
    </div>
  );
};

export default UserPlan;
