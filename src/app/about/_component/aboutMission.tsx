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
                  src="/placeholder.svg?height=600&width=600"
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
                  At TheNews, we believe that effective communication is the foundation of successful businesses. Our
                  mission is to provide powerful, intuitive tools that enable creators and businesses to build
                  meaningful connections with their audiences through engaging newsletters.
                </p>

                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="bg-gold-100 p-3 rounded-full h-12 w-12 flex items-center justify-center shrink-0">
                      <Target className="h-6 w-6 text-gold-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-1">Our Mission</h3>
                      <p className="text-neutral-600">
                        To democratize email marketing by making professional newsletter tools accessible to businesses
                        of all sizes, complementing our streaming solution Xonnect.
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
                        To build a suite of software solutions that empower businesses to connect with their audiences
                        across multiple channels, starting with Xonnect and TheNews.
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
                        Innovation, accessibility, reliability, and customer success drive everything we do at Sithgrid
                        Technology and across our product offerings.
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
