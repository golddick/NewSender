"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function AboutParent() {
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
    <section className="py-16 md:py-24 bg-white text-black relative">
      <div className="absolute left-0 top-1/4 w-1/3 h-1/2 bg-gradient-to-r from-gold-500/10 to-transparent"></div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="max-w-6xl mx-auto"
        >
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <motion.div variants={itemVariants}>
              <span className="inline-block px-4 py-1.5 bg-gold-500/20 text-gold-700 rounded-full text-sm font-medium mb-4">
                Part of Sithgrid Technology
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 font-heading">
                Innovative Software Solutions for Modern Businesses
              </h2>

              <div className="space-y-6 text-neutral-300">
                <p className="leading-relaxed text-neutral-600">
                  TheNews is one of two flagship products developed by Sithgrid Technology, a growing software
                  development company focused on creating innovative digital solutions. Sithgrid Technology is committed
                  to building software that helps businesses connect with their audiences in meaningful ways.
                </p>

                <p className="leading-relaxed text-neutral-600">
                  As part of the Sithgrid Technology portfolio, TheNews benefits from the company&lsquo;s expertise in
                  building scalable, user-friendly applications and its commitment to continuous innovation and
                  improvement.
                </p>

                <p className="leading-relaxed text-neutral-600">
                  Sithgrid Technology currently offers two main products: Xonnect, a cutting-edge streaming platform,
                  and TheNews, our comprehensive newsletter solution designed for the modern creator economy and
                  businesses of all sizes.
                </p>

                <div className="pt-2">
                  <Button className="bg-gold-700 text-dark-900 hover:bg-gold-500">
                    Visit Sithgrid Technology <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <div className="relative">
                <div className="bg-black border border-dark-600 rounded-xl p-6 md:p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="bg-gold-500/20 p-3 rounded-lg">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-gold-400"
                      >
                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-white">Sithgrid Technology</h3>
                  </div>

                  <p className="text-neutral-300 mb-6">
                    Creating innovative software solutions with a focus on user experience, performance, and
                    scalability.
                  </p>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-dark-600/50 rounded-lg p-4">
                      <div className="text-2xl font-bold text-gold-400 mb-1">2</div>
                      <div className="text-sm text-neutral-400">Software Products</div>
                    </div>
                    <div className="bg-dark-600/50 rounded-lg p-4">
                      <div className="text-2xl font-bold text-gold-400 mb-1">5+</div>
                      <div className="text-sm text-neutral-400">Years of Experience</div>
                    </div>
                    <div className="bg-dark-600/50 rounded-lg p-4">
                      <div className="text-2xl font-bold text-gold-400 mb-1">99.9%</div>
                      <div className="text-sm text-neutral-400">Uptime SLA</div>
                    </div>
                    <div className="bg-dark-600/50 rounded-lg p-4">
                      <div className="text-2xl font-bold text-gold-400 mb-1">24/7</div>
                      <div className="text-sm text-neutral-400">Expert Support</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-sm text-neutral-400">Sithgrid products:</span>
                    <div className="flex gap-2">
                      <span className="bg-dark-600 text-xs px-2 py-1 rounded text-neutral-300">Xonnect</span>
                      <span className="bg-dark-600 text-xs px-2 py-1 rounded text-neutral-300">TheNews</span>
                    </div>
                  </div>
                </div>

                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gold-500/20 rounded-full blur-2xl opacity-70 hidden md:block"></div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
