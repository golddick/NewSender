// import { Button } from "@nextui-org/button";
// import Image from "next/image";
// import React from "react";

// const Banner = () => {
//   return (
//     <div className="bg-[#f7f5ff] h-[95vh]">
//       <svg
//         xmlns="http://www.w3.org/2000/svg"
//         width="214"
//         height="214"
//         fill="none"
//         className="absolute block -top-3 -left-24 md:-left-0"
//       >
//         <path
//           fill="#F092DD"
//           stroke="#0B0D2A"
//           stroke-width="2"
//           d="M177.711 31.85c2.435-2.017 5.683 1.232 3.667 3.666L136.329 89.9c-2.359 2.848-.567 7.175 3.115 7.52l70.309 6.601c3.148.296 3.148 4.89 0 5.185l-70.309 6.601c-3.682.346-5.474 4.673-3.115 7.521l45.049 54.383c2.016 2.435-1.232 5.683-3.667 3.667l-54.383-45.049c-2.848-2.359-7.175-.567-7.521 3.115l-6.601 70.309c-.295 3.148-4.889 3.148-5.185 0l-6.6-70.309c-.346-3.682-4.673-5.474-7.521-3.115l-54.384 45.049c-2.434 2.016-5.683-1.232-3.666-3.667l45.048-54.383c2.36-2.848.568-7.175-3.115-7.521l-70.309-6.601c-3.147-.295-3.147-4.889 0-5.185l70.31-6.6c3.681-.346 5.474-4.673 3.114-7.521L31.85 35.516c-2.017-2.434 1.232-5.683 3.666-3.666L89.9 76.898c2.848 2.36 7.175.568 7.52-3.115l6.601-70.309c.296-3.147 4.89-3.147 5.185 0l6.601 70.31c.346 3.681 4.673 5.474 7.521 3.114l54.383-45.048Z"
//         ></path>
//       </svg>
//       <div className="w-full h-full flex justify-center items-center relative overflow-hidden">
//         <Image
//           src={
//             "https://media.beehiiv.com/cdn-cgi/image/fit=scale-down,onerror=redirect,format=auto,width=1920,quality=75/www/homepage/MobileHero.png"
//           }
//           alt=""
//           width={800}
//           height={500}
//           className="w-[80%] object-cover spin-slow"
//         />
//         <div className="absolute">
//           <h1 className="font-clashDisplay uppercase font-bold text-cyber-ink text-[2.75rem] md:text-[7xl] lg:text-[4rem] xl:text-[5.75rem] max-w-4xl mx-auto text-center z-10">
//             THE NEWSLETTER PLATFORM BUILT FOR
//             <span className="font-style">GROW</span>
//           </h1>
//           <br />
//           <h3 className="text-3xl text-center">Built by newsletter people</h3>
//           <br />
//           <div className="flex w-full justify-center">
//             <Button color="primary" className="text-xl !p-8">
//               Get Started
//             </Button>
//           </div>
//           <br />
//           <h5 className="text-center text-lg">start a 30day free trial</h5>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Banner;



"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import Image from "next/image"
import { useRef } from "react"
import { BiChevronDown } from "react-icons/bi"
import { CgArrowRight } from "react-icons/cg"

export function Banner() {
  const targetRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  return (
    <section
      ref={targetRef}
      className="relative h-[calc(100vh-100px)] flex items-center justify-center overflow-hidden bg-dark-800 text-white"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-0 left-0 w-full h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ duration: 2 }}
        >
          {/* Grid pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_40%,transparent_100%)]"></div>
        </motion.div>

        {/* Gradient orbs */}
        <motion.div
          className="absolute top-1/4 -left-20 w-96 h-96 rounded-full bg-gold-500/10 blur-3xl"
          animate={{
            x: [0, 40, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 15,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        ></motion.div>

        <motion.div
          className="absolute bottom-1/4 -right-20 w-96 h-96 rounded-full bg-gold-500/5 blur-3xl"
          animate={{
            x: [0, -40, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        ></motion.div>
      </div>

      <div className="container mx-auto px-4 relative z-10 py-20 md:py-0">
        <div className="flex flex-col items-center text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <span className="inline-block px-4 py-1.5 bg-dark-700/80 border border-dark-600 rounded-full text-sm font-medium text-gold-400">
              Reimagine Your Newsletters
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold mb-6 font-heading leading-tight max-w-4xl"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-neutral-300">
              Create Newsletters That
            </span>{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-gold-300 to-gold-600">
              Captivate & Convert
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl text-neutral-300 mb-10 max-w-2xl"
          >
            Powerful tools to design, automate, and analyze newsletters that grow your audience and drive engagement.
          </motion.p>

          {/* <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center gap-4 mb-8 w-full max-w-md"
          >
            <Input
              type="email"
              placeholder="Enter your email"
              className="border-dark-600 bg-dark-700/60 focus:border-gold-400 h-12 text-base text-white"
            />
            <Button className="bg-gold-700 text-dark-900 hover:bg-gold-400 w-full sm:w-auto h-12 text-base font-medium px-6">
              Get Started <CgArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div> */}

         
        </div>

      </div>
    </section>
  )
}
