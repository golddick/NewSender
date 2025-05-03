import { stripeSubscribe } from "@/actions/stripe.subscribe";
import { GrowPlan, freePlan, scalePlan } from "@/app/configs/constants";
import { ICONS } from "@/shared/utils/icons";
import { useUser } from "@clerk/nextjs";
import { Button } from "@nextui-org/button";
import { useRouter } from "next/navigation";
import { motion, useInView } from "framer-motion"
import { paystackSubscribe } from "@/actions/paystack.subscribe";
import { toast } from "sonner";


const PricingCard = ({ active }: { active: string }) => {
  
  const { user } = useUser();
  const history = useRouter();


  const handleSubscription = async ({ planCode }: { planCode: string }) => {
    if (!user || !user.id) {
      history.push("/sign-in");
      return;
    }

    try {
      const authorizationUrl = await paystackSubscribe({ 
        planCode,
        userId: user.id 
      });

      if (authorizationUrl) {
        window.location.href = authorizationUrl;
        // history.push(authorizationUrl);
      } else {
        console.error("Invalid response from stripeSubscribe:", authorizationUrl);
        toast.error("Failed to initiate payment");
      }
    } catch (error: any) {
      toast.error(error.message || "Payment failed");
    } 
  };


  // const handleSubscription = async ({ price }: { price: string }) => {
  //   if (!user || !user.id) {
  //     history.push("/sign-in");
  //     return;
  //   }
  
  //   try {
  //     const res = await stripeSubscribe({ price: price, userId: user?.id! });
  
  //     // Ensure res is valid and contains a URL
  //     if (res && typeof res === "string") {
  //       console.log(res, "res"); // Log the response for debugging
  //       history.push(res);  // Push the URL to history for navigation
  //     } else {
  //       console.error("Invalid response from stripeSubscribe:", res);
  //       // Handle invalid response, maybe notify the user
  //     }
  //   } catch (error) {
  //     console.error("Error during subscription:", error);
  //     // Handle errors (e.g., show an error message to the user)
  //   }
  // };
  

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
  }

  return (
    <div className="w-full md:flex items-start justify-around py-8 ">
      {/* free plan */}
        <motion.div
          variants={itemVariants}
          className={`bg-dark-700 border border-dark-600 text-white hover:shadow-gold/10 transition-all md:w-[400px]  rounded p-5 my-5 md:my-0  shadow-gold-700 shadow-sm`}
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
        {freePlan.map((i: PlanType, index: number) => (
          <div key={index} className="flex w-full items-center py-4">
            <span className="text-xl text-gold-400">{ICONS.right}</span>
            <p className="pl-2 text-lg">{i.title}</p>
          </div>
        ))}
        <br />
        <Button color="primary" className="w-full text-xl !py-6">
          Get Started
        </Button>
        <p className="pt-1 opacity-[.7] text-center">
           Free 4 ever
        </p>
        </motion.div>

      {/* grow plan */}
      <motion.div
          variants={itemVariants}
          className={`bg-dark-700 border border-dark-600 text-white hover:shadow-gold-700 transition-all md:w-[400px]  rounded p-5 my-5 md:my-0 shadow-gold-700 shadow-sm`}
        >

       
        <h5 className="font-clashDisplay uppercase text-cyber-ink text-3xl pb-8 border-b border-[#000]">
          LUNCH
        </h5>
        <br />
        <div className="border-b pb-8 border-black">
          <h5 className="font-clashDisplay uppercase text-cyber-ink text-3xl">
            N{active === "Monthly" ? "45,000" : "45,000"} /month
          </h5>
          <p className="text-lg">Billed {active}</p>
        </div>
        <div className="pt-5">
          <p className="text-xl">Everything in Lunch, plus...</p>
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
          className="w-full text-xl !py-6"
          onClick={() =>
            handleSubscription({
              planCode: active === "Monthly" 
                ? "PLN_qqs88g3s909068i" 
                : "PLN_zpaqmox70eunvd9",
            })
          }
        >
          Get Started
        </Button>
        <p className="pt-1 opacity-[.7] text-center">
          30-day free trial of Scale features, then $
          {/* {active === "Monthly" ? "42" : "49"}/mo */}
        </p>
        </motion.div>

      {/* scale plan */}
      <motion.div
          variants={itemVariants}
          className={`bg-dark-700 border border-dark-600 text-white hover:shadow-gold/10  transition-all md:w-[400px]  rounded p-5 my-5 md:my-0 shadow-gold-700 shadow-sm`}
        >
        <h5 className="font-clashDisplay uppercase text-cyber-ink text-3xl pb-8 border-b border-[#000]">
          SCALE
        </h5>
        <br />
        <div className="border-b pb-8 border-[#000]">
          <h5 className="font-clashDisplay uppercase text-cyber-ink text-3xl">
            N{active === "Monthly" ? "120,000" : "100,000"} /month
          </h5>
          <p className="text-lg">Billed {active}</p>
        </div>
        <div className="pt-5">
          <p className="text-xl">Everything in Grow, plus...</p>
        </div>
        {scalePlan.map((i: PlanType, index: number) => (
          <div key={index} className="flex w-full items-center py-4">
            <span className="text-xl text-gold-400">{ICONS.right}</span>
            <p className="pl-2 text-lg">{i.title}</p>
          </div>
        ))}
        <br />
        <Button
          color="primary"
          className="w-full text-xl !py-6"
          onClick={() =>
            handleSubscription({
              planCode: active === "Monthly" 
                ? "PLN_4idp8h4m8ptak6k" 
                : "PLN_l1ck8bvf49k9nhx",
            })
          }
        >
          Get Started
        </Button>
        <p className="pt-1 opacity-[.7] text-center">
          30-day free trial of Scale features, then $
          {/* {active === "Monthly" ? "120,000" : "100,000"}/mo */}
        </p>
        </motion.div>
    </div>
  );
};

export default PricingCard;
