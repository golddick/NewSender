"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export function Banner() {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section
      ref={targetRef}
      className="relative h-[calc(100vh-100px)] flex items-center justify-center overflow-hidden bg-black text-white"
    >
      {/* Animated background */}
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

        {/* Floating gradient orbs */}
        <motion.div
          className="absolute top-1/4 -left-20 w-96 h-96 rounded-full bg-gold-500/10 blur-3xl"
          animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
          transition={{ duration: 15, repeat: Infinity, repeatType: "reverse" }}
        />
        <motion.div
          className="absolute bottom-1/4 -right-20 w-96 h-96 rounded-full bg-gold-500/5 blur-3xl"
          animate={{ x: [0, -40, 0], y: [0, -30, 0] }}
          transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
        />
      </div>

      {/* Main banner content */}
      <div className="container mx-auto px-4 relative z-10 py-20 md:py-0">
        <div className="flex flex-col items-center text-center mb-16">
          {/* Top Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <span className="inline-block px-4 py-1.5 bg-dark-700/80 border border-dark-600 rounded-full text-sm font-medium text-gold-400">
            The Complete Email Toolkit
            </span>
          </motion.div>
        
          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 font-heading leading-tight max-w-4xl"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-neutral-300 ">
            Not Just a Newsletter Tool.
            </span>    <br/>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-gold-300 to-gold-700 ">
            Welcome to TheNews.
            </span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg sm:text-xl text-neutral-300 mb-10 max-w-2xl"
          >
           TheNews Create, automate, and send content with ease. Power your growth with our seamless API.
          </motion.p>

          {/* Optional CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <a
              href="/documentation"
              className="inline-flex items-center px-6 py-3 bg-gold-700 text-black font-semibold rounded-lg shadow hover:bg-gold-600 transition text-sm sm:text-base"
            >
              Explore API Docs
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}



// "use client"

// import { motion, useScroll, useTransform } from "framer-motion"
// import Image from "next/image"
// import { useRef } from "react"
// import { BiChevronDown } from "react-icons/bi"
// import { CgArrowRight } from "react-icons/cg"

// export function Banner() {
//   const targetRef = useRef(null)
//   const { scrollYProgress } = useScroll({
//     target: targetRef,
//     offset: ["start start", "end start"],
//   })

//   const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"])
//   const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

//   return (
//     <section
//       ref={targetRef}
//       className="relative h-[calc(100vh-100px)] flex items-center justify-center overflow-hidden bg-black text-white"
//     >
//       {/* Animated background elements */}
//       <div className="absolute inset-0 overflow-hidden">
//         <motion.div
//           className="absolute top-0 left-0 w-full h-full"
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 0.6 }}
//           transition={{ duration: 2 }}
//         >
//           {/* Grid pattern */}
//           <div className="absolute inset-0 bg-[linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_40%,transparent_100%)]"></div>
//         </motion.div>

//         {/* Gradient orbs */}
//         <motion.div
//           className="absolute top-1/4 -left-20 w-96 h-96 rounded-full bg-gold-500/10 blur-3xl"
//           animate={{
//             x: [0, 40, 0],
//             y: [0, 30, 0],
//           }}
//           transition={{
//             duration: 15,
//             repeat: Number.POSITIVE_INFINITY,
//             repeatType: "reverse",
//           }}
//         ></motion.div>

//         <motion.div
//           className="absolute bottom-1/4 -right-20 w-96 h-96 rounded-full bg-gold-500/5 blur-3xl"
//           animate={{
//             x: [0, -40, 0],
//             y: [0, -30, 0],
//           }}
//           transition={{
//             duration: 20,
//             repeat: Number.POSITIVE_INFINITY,
//             repeatType: "reverse",
//           }}
//         ></motion.div>
//       </div>

//       <div className="container mx-auto px-4 relative z-10 py-20 md:py-0">
//         <div className="flex flex-col items-center text-center mb-16">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6 }}
//             className="mb-6"
//           >
//             <span className="inline-block px-4 py-1.5 bg-dark-700/80 border border-dark-600 rounded-full text-sm font-medium text-gold-400">
//               Reimagine Your Newsletters
//             </span>
//           </motion.div>

//           <motion.h1
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6, delay: 0.2 }}
//             className="text-5xl md:text-7xl font-bold mb-6 font-heading leading-tight max-w-4xl"
//           >
//             <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-neutral-300">
//               Create Newsletters That
//             </span>{" "}
//             <span className="bg-clip-text text-transparent bg-gradient-to-r from-gold-300 to-gold-600">
//               Captivate & Convert
//             </span>
//           </motion.h1>

//           <motion.p
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6, delay: 0.4 }}
//             className="text-xl text-neutral-300 mb-10 max-w-2xl"
//           >
//             Powerful tools to design, automate, and analyze newsletters that grow your audience and drive engagement.
//           </motion.p>

    

         
//         </div>

//       </div>
//     </section>
//   )
// }
