"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { Button } from "@nextui-org/react"

export function About() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

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
    <section id="about" className="py-16 md:py-24 bg-white relative">
      <div className="absolute right-0 top-0 w-1/3 h-full bg-gradient-to-l from-gold-50 to-transparent opacity-50"></div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="max-w-6xl mx-auto"
        >
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <motion.div variants={itemVariants} className="order-2 md:order-1">
              <div className="relative">
                <Image
                  src="/gnb.png"
                  width={600}
                  height={600}
                  alt="TheNews Team"
                  className="rounded-lg shadow-elegant w-full h-auto"
                />
                <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-gold-100 rounded-full blur-xl opacity-70 hidden md:block"></div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="order-1 md:order-2">
              <span className="inline-block px-4 py-1.5 bg-gold-100 text-gold-700 rounded-full text-sm font-medium mb-4">
                About TheNews
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 font-heading">
                Revolutionizing Newsletter Creation Since 2023
              </h2>

              <div className="space-y-4 md:space-y-6 text-neutral-600">
                <p className="leading-relaxed">
                  TheNews was born from a simple observation: creating professional newsletters was too complicated and
                  time-consuming for most creators and businesses. We set out to change that.
                </p>

                <p className="leading-relaxed">
                  Our platform combines intuitive design tools with powerful analytics to help you create newsletters
                  that not only look beautiful but also drive real results. We believe that effective communication
                  shouldn&apos;t require technical expertise or design skills.
                </p>

                <p className="leading-relaxed">
                  Founded by a team of marketing experts and developers, TheNews is committed to helping creators,
                  businesses, and organizations build meaningful connections with their audiences through engaging
                  newsletters.
                </p>

                <div className="pt-2">
                  <Button className="bg-gold-700 text-white hover:bg-gold-500">
                    Learn More <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>

        </motion.div>
      </div>
    </section>
  )
}
