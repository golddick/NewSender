import { FreePlan, GrowPlan, ScalePlan } from "@/app/configs/constants";
import { ICONS } from "@/shared/utils/icons";
import { useUser } from "@clerk/nextjs";
import { Button } from "@nextui-org/button";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { paystackSubscribe } from "@/actions/paystack/paystack.subscribe";
import Link from "next/link";
import { PlanType } from "@/app/configs/types";
import toast from "react-hot-toast";

const PricingCard = ({ active }: { active: "Monthly" | "Yearly" }) => {
  const { user } = useUser();
  const history = useRouter();

 const handleSubscription = async (planName: "LAUNCH" | "SCALE") => {
  if (!user || !user.id) {
    history.push("/sign-in");
    return;
  }

  try {
    const result = await paystackSubscribe({
      planName,
      billingCycle: active === "Monthly" ? "monthly" : "yearly",
      userId: user.id,
    });

    // Redirect if KYC is required
    if (result?.kycRequired) {
      toast.error("KYC verification is required before upgrading.");
      history.push("/dashboard/settings?tab=KYC");
      return;
    }

    // Proceed with payment if URL provided
    if (result?.success && result?.url) {
      toast.success("Redirecting to payment...");
      window.location.href = result.url;
    } else {
      toast.error(result?.error || "Failed to initiate payment");
    }

  } catch (error: any) {
    toast.error(error.message || "Payment failed");
  }
};


  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Free Plan */}
      <motion.div
        variants={itemVariants}
        className="bg-dark-600/50 border border-dark-600 text-white hover:shadow-gold/10 transition-all rounded p-5 my-5 md:my-0 shadow-gold-700 shadow-sm"
      >
        <h5 className="font-clashDisplay uppercase text-cyber-ink text-3xl pb-8 border-b border-[#000]">
          FREE
        </h5>
        <br />
        <div className="border-b pb-8 border-[#000] flex gap-4 items-center">
          <h5 className="font-clashDisplay uppercase text-cyber-ink text-3xl">
            N0
          </h5>
          <p className="text-lg">No commitment</p>
        </div>
        <div className="pt-5">
          <p className="text-xl">What&apos;s included...</p>
        </div>
        {FreePlan.map((i: PlanType, index: number) => (
          <div key={index} className="flex w-full items-center py-4">
            <span className="text-xl text-gold-400">{ICONS.right}</span>
            <p className="pl-2 text-lg">{i.title}</p>
          </div>
        ))}
        <br />
        <Link href="/sign-up">
          <Button color="primary" className="w-full text-xl !py-6 bg-gold-700">
            Get Started
          </Button>
        </Link>
      </motion.div>

      {/* Launch Plan */}
      <motion.div
        variants={itemVariants}
        className="bg-dark-600/50 border border-dark-600 text-white hover:shadow-gold/10 transition-all rounded p-5 my-5 md:my-0 shadow-gold-700 shadow-sm"
      >
        <h5 className="font-clashDisplay uppercase text-cyber-ink text-3xl pb-8 border-b border-[#000]">
          LAUNCH
        </h5>
        <br />
        <div className="border-b pb-8 border-black">
          <h5 className="font-clashDisplay uppercase text-cyber-ink text-3xl">
            N{active === "Monthly" ? "15,000" : "540,000"} /{active === "Monthly" ? "month" : "year"}
          </h5>
          <p className="text-lg">Billed {active}</p>
        </div>
        <div className="pt-5">
          <p className="text-xl">Everything in Free, plus...</p>
        </div>
        {GrowPlan.map((i: PlanType, index: number) => (
          <div key={index} className="flex w-full items-center py-4">
            <span className="text-xl text-gold-400">{ICONS.right}</span>
            <p className="pl-2 text-lg">{i.title}</p>
          </div>
        ))}
        <br />
        <Button
          color="primary"
          className="w-full text-xl !py-6 bg-gold-700"
          onPress={() => handleSubscription("LAUNCH")}
        >
          Get Started
        </Button>
      </motion.div>

      {/* Scale Plan */}
      <motion.div
        variants={itemVariants}
        className="bg-dark-600/50 border border-dark-600 text-white hover:shadow-gold/10 transition-all rounded p-5 my-5 md:my-0 shadow-gold-700 shadow-sm"
      >
        <h5 className="font-clashDisplay uppercase text-cyber-ink text-3xl pb-8 border-b border-[#000]">
          SCALE
        </h5>
        <br />
        <div className="border-b pb-8 border-[#000]">
          <h5 className="font-clashDisplay uppercase text-cyber-ink text-3xl">
            N{active === "Monthly" ? "50,000" : "1,000,000"} /{active === "Monthly" ? "month" : "year"}
          </h5>
          <p className="text-lg">Billed {active}</p>
        </div>
        <div className="pt-5">
          <p className="text-xl">Everything in Launch, plus...</p>
        </div>
        {ScalePlan.map((i: PlanType, index: number) => (
          <div key={index} className="flex w-full items-center py-4">
            <span className="text-xl text-gold-400">{ICONS.right}</span>
            <p className="pl-2 text-lg">{i.title}</p>
          </div>
        ))}
        <br />
        <Button
          color="primary"
          className="w-full text-xl !py-6 bg-gold-700"
          onPress={() => handleSubscription("SCALE")}
        >
          Get Started
        </Button>
      </motion.div>
    </div>
  );
};

export default PricingCard;
