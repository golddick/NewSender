"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import Image from "next/image"
import { Target, Users, Zap } from "lucide-react"

export function AboutMission() {
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
    <section className="py-16 md:py-24 bg-white relative">
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
                  alt="TheNews Mission"
                  className="rounded-lg shadow-elegant w-full h-auto"
                />
                <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-gold-100 rounded-full blur-xl opacity-70 hidden md:block"></div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="order-1 md:order-2">
              <span className="inline-block px-4 py-1.5 bg-gold-100 text-gold-700 rounded-full text-sm font-medium mb-4">
                Our Mission & Vision
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 font-heading">
                Empowering Communication Through Innovation
              </h2>

              <div className="space-y-6 text-neutral-600">
                <p className="leading-relaxed">
                At TheNews, we empower businesses and creators to build stronger connections with their audiences through seamless newsletter tools, 
                cutting-edge automation, and real-time performance tracking.
                </p>

                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="bg-gold-100 p-3 rounded-full h-12 w-12 flex items-center justify-center shrink-0">
                      <Target className="h-6 w-6 text-gold-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-1">Our Mission</h3>
                      <p className="text-neutral-600">
                      To make powerful communication tools accessible to businesses of all sizes, enabling them to build meaningful relationships with their audience.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="bg-gold-100 p-3 rounded-full h-12 w-12 flex items-center justify-center shrink-0">
                      <Zap className="h-6 w-6 text-gold-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-1">Our Vision</h3>
                      <p className="text-neutral-600">
                      To create an ecosystem of innovative tools that empowers businesses to engage with their audiences across multiple platforms, starting with TheNews and Xonnect.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="bg-gold-100 p-3 rounded-full h-12 w-12 flex items-center justify-center shrink-0">
                      <Users className="h-6 w-6 text-gold-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-1">Our Values</h3>
                      <p className="text-neutral-600">
                      We prioritize innovation, accessibility, reliability, and customer success. These core values guide every product decision and service we offer at SIXTHGRID
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}



