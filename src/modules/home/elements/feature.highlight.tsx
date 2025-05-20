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
import { PaintBucket, Wand2, LayoutTemplate, Clock, Zap, Users, CheckCircle, ArrowRight, Code, Mail, Upload, Activity } from "lucide-react"
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
    icon: <Mail />,
    title: "Email Verifying",
    description: "Verify user emails before allowing subscriptions to ensure a high-quality, engaged mailing list.",
    },
    {
      icon: <Upload />,
      title: "CSV Email Import & Verification",
      description: "Easily import subscribers via CSV. All emails are automatically verified during import to maintain list quality.",
    },
    {
      icon: <Activity />, 
      title: "Click & Open Tracking",
      description: "Track every email open and link click to measure engagement and improve your campaign performance.",
    },
    {
      icon: <Code />,
      title: "Developer API",
      description: "Integrate email marketing into your applications with our easy-to-use RESTful API.",
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
    <section id="features" className="py-16 md:py-24 bg-black text-white relative">
      {/* <div className="absolute left-0 top-1/4 w-1/3 h-1/2 bg-gradient-to-r from-gold-500/10 to-transparent"></div> */}

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
   
            
             <div className="flex flex-col gap-4 items-center">
                        <div className="w-full mb-8 md:mb-0">
                          <h2 className="text-3xl md:text-4xl font-bold mb-4">Built for <span className="text-gold-700">Developers</span></h2>
                          <p className="text-xl text-gray-300 mb-6">Integrate newsletter functionality into your applications with our simple and powerful API.</p>
                          
                          <ul className="space-y-4 mb-8">
                            <li className="flex items-start">
                              <CheckCircle className="h-6 w-6 text-gold-700 mr-2 mt-1 flex-shrink-0" />
                              <span>RESTful API with comprehensive documentation</span>
                            </li>
                            <li className="flex items-start">
                              <CheckCircle className="h-6 w-6 text-gold-700 mr-2 mt-1 flex-shrink-0" />
                              <span>Detailed API logs and error reporting</span>
                            </li>
                          </ul>
                          
                          <a href="/documentation" className="inline-flex items-center bg-gold-700 hover:bg-gold-700 text-black font-medium py-3 px-6 rounded-md transition-colors text-lg">
                            Explore API Documentation
                            <ArrowRight className="ml-2 h-5 w-5" />
                          </a>
                        </div>

                        <div className="  hidden md:block md:w-full md:pl-8">
                          <div className="bg-gray-800 rounded-lg p-4 shadow-xl">
                            <div className="flex items-center mb-4">
                              <div className="flex space-x-2">
                                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                              </div>
                              <div className="ml-4 text-gray-400 text-sm">Code Example</div>
                            </div>
                        <pre className="bg-gray-900 p-4 rounded-md text-green-400 text-sm overflow-x-auto whitespace-pre-wrap">
                          {`
                            // Import the necessary libraries

                            const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
                              e.preventDefault();
                              setLoading(true);
                              setMessage('');

                              try {
                                const payload = {
                                  email: value,
                                  source: \`\${process.env.NEXT_PUBLIC_SOURCE}/category?\${selectedCategoryName}\`,
                                  status: "Subscribed",
                                  categoryId: selectedCategory,
                                  metadata: {
                                    campaign: selectedCampaignName || "thenews website landing page",
                                    pageUrl: \`\${process.env.NEXT_PUBLIC_SOURCE}/\${selectedCategoryName}\`,
                                    formId: "TheNews landing page",
                                  },
                                };

                                const res = await axios.post(
                                  "http://thenews.africa/api/subscribe",
                                  payload,
                                  {
                                    headers: {
                                      "TheNews-api-key": process.env.NEXT_PUBLIC_TheNews_API_KEY!,
                                    },
                                  }
                                );

                                if (res.status === 200) {
                                  setMessage("✅ Successfully subscribed!");
                                  toast.success("Successfully subscribed!");
                                  setValue(''); // Reset email input
                                } else {
                                  toast.error("⚠️ Something went wrong. Please try again.");
                                }
                              } catch (err: any) {
                                const customMessage =
                                  err.response?.data?.error || "❌ Failed to subscribe. Please try again later.";
                                setMessage(customMessage);
                                toast.error(customMessage);
                                console.error("Subscription error:", err);
                              } finally {
                                setLoading(false);
                              }
                            };
                          `}
                          </pre>

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
      className="bg-dark-600/50 border border-dark-600 rounded-xl p-6 md:p-7 hover:border-gold-500/30 transition-all shadow-dark group hover:shadow-gold/10 relative h-full"
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

