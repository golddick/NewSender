import { stripeSubscribe } from "@/actions/stripe.subscribe";
import { GrowPlan, freePlan, scalePlan } from "@/app/configs/constants";
import { ICONS } from "@/shared/utils/icons";
import { useUser } from "@clerk/nextjs";
import { Button } from "@nextui-org/button";
import { useRouter } from "next/navigation";
import { motion, useInView } from "framer-motion"

const PricingCard = ({ active }: { active: string }) => {
  const { user } = useUser();
  const history = useRouter();
  const handleSubscription = async ({ price }: { price: string }) => {
    await stripeSubscribe({ price: price, userId: user?.id! }).then(
      (res: any) => {
        history.push(res);
      }
    );
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
  }

  return (
    <div className="w-full md:flex items-start justify-around py-8 ">
      {/* free plan */}
        <motion.div
          variants={itemVariants}
          className={`bg-dark-700 border border-dark-600 text-white hover:shadow-gold/10 transition-all md:w-[400px]  rounded p-5 my-5 md:my-0  shadow-gold-700 shadow-sm`}
        >
        <h5 className="font-clashDisplay uppercase text-cyber-ink text-3xl pb-8 border-b border-[#000]">
          Lunch
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
          30-day free trial of Scale features, then free forever
        </p>
        </motion.div>

      {/* grow plan */}
      <motion.div
          variants={itemVariants}
          className={`bg-dark-700 border border-dark-600 text-white hover:shadow-gold-700 transition-all md:w-[400px]  rounded p-5 my-5 md:my-0 shadow-gold-700 shadow-sm`}
        >

       
        <h5 className="font-clashDisplay uppercase text-cyber-ink text-3xl pb-8 border-b border-[#000]">
          GROW
        </h5>
        <br />
        <div className="border-b pb-8 border-black">
          <h5 className="font-clashDisplay uppercase text-cyber-ink text-3xl">
            N{active === "Monthly" ? "59,999" : "45,000"} /month
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
              price:
                active === "Monthly"
                  ? "price_1RICNw07CMWYBxaprPBPYKvx"
                  : "price_1RICCq07CMWYBxap68NwbYrQ",
            })
          }
        >
          Get Started
        </Button>
        <p className="pt-1 opacity-[.7] text-center">
          30-day free trial of Scale features, then $
          {active === "Monthly" ? "42" : "49"}/mo
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
              price:
                active === "Monthly"
                  ? "price_1RICQ607CMWYBxapvAMn5mRS"
                  : "price_1RICKT07CMWYBxapmdfhd3LQ",
            })
          }
        >
          Get Started
        </Button>
        <p className="pt-1 opacity-[.7] text-center">
          30-day free trial of Scale features, then $
          {active === "Monthly" ? "120,000" : "100,000"}/mo
        </p>
        </motion.div>
    </div>
  );
};

export default PricingCard;
