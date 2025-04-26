// import { Button } from "@nextui-org/button";
// import Image from "next/image";

// const FeatureHighlight = () => {
//   return (
//     <div className="w-full md:flex items-center bg-[#9399F4] py-5 text-center md:py-0 md:text-left md:min-h-[55vh]">
//       <div className="w-full md:w-[50%]">
//         <Image
//           src="https://media.beehiiv.com/cdn-cgi/image/fit=scale-down,onerror=redirect,format=auto,width=1080,quality=75/www/homepage/Publish.png"
//           alt=""
//           width={400}
//           height={400}
//           className="w-[85%] ml-5"
//         />
//       </div>
//       <div className="md:w-[50%]">
//         <h2 className="font-clashDisplay uppercase text-cyber-ink text-3xl md:text-5xl mx-auto mb-2 md:text-left">
//           CREATE
//         </h2>
//         <br />
//         <h3 className="text-cyber-ink text-xl md:text-3xl max-w-lg font-semibold">
//           The most powerful editing and design tools in email.
//         </h3>
//         <br />
//         <p className="text-cyber-ink text-xl md:text-2xl max-w-lg font-[400]">
//           Warning: A writing experience unlike anything you&lsquo;ve ever
//           experienced - proceed with caution.
//         </p>
//         <br />
//         <Button className="bg-white border-[2px] border-[#000] rounded text-2xl !p-7 !px-16">
//           Start Building
//         </Button>
//       </div>
//     </div>
//   );
// };

// export default FeatureHighlight;


"use client"

import type React from "react"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { PaintBucket, Wand2, LayoutTemplate, Clock, Zap, Users } from "lucide-react"
import Image from "next/image"

export function FeatureHighlight() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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

  // Current features
  const currentFeatures = [
    {
      icon: <PaintBucket />,
      title: "Custom Branding",
      description: "Match your newsletter to your brand with custom colors, fonts, and logos.",
    },
    {
      icon: <LayoutTemplate />,
      title: "Drag & Drop Editor",
      description: "Create beautiful newsletters with our intuitive drag-and-drop editor. No coding required.",
    },
    {
      icon: <Users />,
      title: "Audience Segmentation",
      description: "Target specific segments of your audience based on their behavior and preferences.",
    },
  ]

  // Coming soon features
  const comingSoonFeatures = [
    {
      icon: <Wand2 />,
      title: "AI-Powered Content",
      description: "Generate engaging content with our AI assistant to save time and boost creativity.",
    },
    {
      icon: <Clock />,
      title: "Scheduled Sending",
      description: "Schedule your newsletters to be sent at the optimal time for your audience.",
    },
    {
      icon: <Zap />,
      title: "Automation",
      description: "Set up automated workflows to send the right content to the right people at the right time.",
    },
  ]

  return (
    <section id="features" className="py-16 md:py-24 bg-dark-800 text-white relative">
      <div className="absolute left-0 top-1/4 w-1/3 h-1/2 bg-gradient-to-r from-gold-500/10 to-transparent"></div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="max-w-6xl mx-auto"
        >
          <motion.div variants={itemVariants} className="text-center mb-12 md:mb-16">
            <span className="inline-block px-4 py-1.5 bg-gold-500/20 text-gold-300 rounded-full text-sm font-medium mb-4">
              Features
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-6 font-heading">
              Everything You Need to <span className="text-gold-300">Succeed</span>
            </h2>
            <p className="text-lg text-neutral-300 max-w-3xl mx-auto leading-relaxed">
              Our platform gives you the tools to create stunning newsletters that engage your audience and drive
              results.
            </p>
          </motion.div>

          {/* Current Features */}
          <motion.div variants={itemVariants} className="mb-8">
            {/* <h3 className="text-xl md:text-2xl font-bold mb-6 text-white">Available Now</h3> */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentFeatures.map((feature, index) => (
                <FeatureCard
                  key={index}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  variants={itemVariants}
                />
              ))}
            </div>
          </motion.div>

          {/* Coming Soon Features */}
          <motion.div variants={itemVariants} className="mb-16">
            {/* <h3 className="text-xl md:text-2xl font-bold mb-6 text-white">Coming Soon</h3> */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {comingSoonFeatures.map((feature, index) => (
                <FeatureCard
                  key={index}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  variants={itemVariants}
                  comingSoon={true}
                />
              ))}
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="mt-16 md:mt-20 relative">
            <div className="bg-dark-700 border border-dark-600 rounded-xl p-6 md:p-10 overflow-hidden shadow-dark">
              <div className="grid md:grid-cols-2 gap-8 md:gap-10 items-center">
                <div>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 md:mb-6 font-heading text-white">
                    Powerful Analytics Dashboard
                  </h3>
                  <p className="text-neutral-300 mb-6 md:mb-8 leading-relaxed">
                    Gain valuable insights into your newsletter performance with our comprehensive analytics dashboard.
                    Track opens, clicks, subscriber growth, and more to optimize your content strategy.
                  </p>
                  <ul className="space-y-3 md:space-y-4">
                    {[
                      "Real-time performance tracking",
                      "Subscriber growth analytics",
                      "Content engagement metrics",
                      "Geographical distribution data",
                      "Conversion tracking",
                    ].map((item, index) => (
                      <li key={index} className="flex items-center">
                        <span className="h-2 w-2 bg-gold-400 rounded-full mr-3"></span>
                        <span className="text-neutral-200">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="relative">
                  <div className="rounded-xl border border-dark-500 shadow-dark overflow-hidden">
                    <Image
                      src="/GeeLogo.png"
                      width={600}
                      height={400}
                      alt="Analytics Dashboard"
                      className="w-full h-auto"
                    />
                  </div>
                  <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gold-500/20 rounded-full blur-2xl opacity-70 hidden md:block"></div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

function FeatureCard({
  icon,
  title,
  description,
  variants,
  comingSoon = false,
}: {
  icon: React.ReactNode
  title: string
  description: string
  variants: any
  comingSoon?: boolean
}) {
  return (
    <motion.div
      variants={variants}
      className="bg-dark-700 border border-dark-600 rounded-xl p-6 md:p-7 hover:border-gold-500/30 transition-all shadow-dark group hover:shadow-gold/10 relative h-full"
    >
      {comingSoon && (
        <div className="absolute top-3 right-3 bg-gold-500/20 text-gold-300 text-xs font-medium py-1 px-2 rounded">
          Coming Soon
        </div>
      )}
      <div className="bg-gold-500/20 p-3 rounded-full w-fit mb-4 md:mb-5 text-gold-300 group-hover:bg-gold-500/30 transition-colors">
        <span className="text-gold-300">{icon}</span>
      </div>
      <h3 className="text-lg font-bold mb-2 md:mb-3 text-white">{title}</h3>
      <p className="text-neutral-300 text-sm leading-relaxed">{description}</p>
    </motion.div>
  )
}

