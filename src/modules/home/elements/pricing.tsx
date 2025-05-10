"use client";

import { Button } from "@/components/ui/button";
import PricingCard from "@/shared/components/cards/pricing.card";
import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

const Pricing = () => {
  const [active, setActive] = useState("Monthly");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 25,
      },
    },
  };

  return (
    <div className="w-full py-24 bg-black text-white relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-gold-500/10 via-transparent to-transparent opacity-50"></div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="w-full flex flex-col gap-8 justify-center text-center"
        >
          {/* Heading Section */}
          <motion.div variants={itemVariants} className="mb-16">
            <span className="inline-block px-6 py-2 bg-gold-500/20 text-gold-400 rounded-full text-sm font-medium mb-4">
              Pricing Plans
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 font-heading">
              Simple, <span className="text-gold-400">Transparent</span> Pricing
            </h2>
            <p className="text-lg text-neutral-300 max-w-2xl mx-auto leading-relaxed">
              Choose the plan that fits your needs. All plans come with a 30-day free trial to explore all features.
            </p>
          </motion.div>

          {/* Pricing Plan Toggle */}
          <motion.div variants={itemVariants} className="flex justify-center gap-2 mb-6">
            <Button
              className={`${
                active === "Monthly"
                  ? "bg-gold-700 text-white"
                  : "bg-white text-black"
              } rounded-l-lg text-xl px-8 py-3 border border-[#000] transition-colors duration-300`}
              onClick={() => setActive("Monthly")}
            >
              Monthly
            </Button>
            <Button
              className={`${
                active === "Yearly"
                  ? "bg-gold-700 text-white"
                  : "bg-white text-black"
              } rounded-r-lg text-xl px-8 py-3 border border-[#000] transition-colors duration-300`}
              onClick={() => setActive("Yearly")}
            >
              Yearly
            </Button>
          </motion.div>
        </motion.div>

        {/* Pricing Cards */}
        <PricingCard active={active} />
      </div>
    </div>
  );
};

export default Pricing;
