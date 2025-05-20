"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@nextui-org/react";
import Link from "next/link";

export function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
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
        damping: 10,
      },
    },
  };

  return (
    <section id="about" className="py-20 md:py-32 bg-white relative overflow-hidden">
      <div className="absolute right-0 top-0 w-1/3 h-full bg-gradient-to-l from-gold-100 to-transparent opacity-40 pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="max-w-7xl mx-auto"
        >
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Image */}
            <motion.div variants={itemVariants}>
              <div className="relative ">
                <Image
                  src="/logo.jpg"
                  width={640}
                  height={640}
                  alt="TheNews in action"
                  className="rounded-xl shadow-xl w-full h-auto bg-black object-cover"
                />
                <div className="absolute -bottom-6 -right-6 w-36 h-36 bg-gold-100 rounded-full blur-2xl opacity-60 hidden md:block"></div>
              </div>
            </motion.div>

            {/* Text */}
            <motion.div variants={itemVariants}>
              <span className="inline-block px-4 py-1.5 bg-gold-100 text-gold-700 rounded-full text-sm font-medium mb-5">
                About TheNews
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 leading-tight font-heading">
                Powering Newsletters, Blogs & APIs for the Next Era of Content
              </h2>

              <div className="space-y-5 text-neutral-600 text-lg">
                <p>
                  TheNews is built for creators, developers, and marketers who need more than a basic email tool.
                  With stunning designs, scheduling, automation, and publishing features—it’s content creation, reimagined.
                </p>

                <p>
                  From sending captivating newsletters to publishing blog posts and integrating via our flexible API, TheNews gives you full control over how, when, and where your content reaches your audience.
                </p>

                <p>
                  Backed by Sixthgrid, we merge simplicity with scale—whether you’re a solo blogger or a growing team.
                </p>
              </div>

              <div className="pt-6">
                <Link href="/about">
                  <Button className="bg-gold-700 text-white hover:bg-gold-600 transition-all">
                    Learn More
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
