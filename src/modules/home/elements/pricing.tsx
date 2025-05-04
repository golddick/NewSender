"use client";
import { Button } from "@/components/ui/button";
import PricingCard from "@/shared/components/cards/pricing.card";
import { motion, useInView } from "framer-motion"
import { useRef, useState } from "react";

const Pricing = () => {
  const [active, setActive] = useState("Monthly");
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

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
    <div className="w-full py-24 bg-black text-white  relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-gold-500/10 via-transparent to-transparent opacity-50"></div>


      <div className="  py-5 container mx-auto px-4 relative z-10">
        <div className="w-full  flex flex-col gap-2  justify-center">
            <motion.div variants={itemVariants} className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-gold-500/20 text-gold-300 rounded-full text-sm font-medium mb-4">
              Pricing
            </span>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 font-heading">
              Simple, <span className="text-gold-400">Transparent</span> Pricing
            </h2>
            <p className="text-lg text-neutral-300 max-w-3xl mx-auto leading-relaxed">
              Choose the plan that&apos;s right for you. All plans include a 30-day free trial.
            </p>
          </motion.div>
          <div className="flex items-end justify-end mt-2 md:mt-0">
            <Button
              className={`${
                active === "Monthly"
                  ? "bg-gold-700 text-white"
                  : "bg-white text-black"
              } rounded-r-[0] !p-2 text-xl !px-16 border border-[#000]`}
              onClick={() => setActive("Monthly")}
            >
              Monthly
            </Button>
            <Button
              className={`${
                active === "Yearly"
                  ? "bg-gold-700 text-white"
                  : "bg-white text-black"
              } rounded-l-[0] !p-2 text-xl !px-16 border border-[#000]`}
              onClick={() => setActive("Yearly")}
            >
              Yearly
            </Button>
          </div>
        </div>
        <PricingCard active={active} />
      </div>
    </div>
  );
};

export default Pricing;

