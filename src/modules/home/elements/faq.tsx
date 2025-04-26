"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function FAQ() {
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

  const faqItems = [
    {
      question: "How does TheNews compare to other newsletter platforms?",
      answer:
        "TheNews stands out with its intuitive design tools, powerful analytics, and focus on deliverability. Unlike other platforms, we offer a true drag-and-drop editor that requires no technical skills, comprehensive performance tracking, and industry-leading delivery rates. Our platform is designed specifically for creators and businesses who want professional newsletters without the complexity.",
    },
    {
      question: "Can I migrate my existing subscribers to TheNews?",
      answer:
        "We make migration simple with our easy-to-use import tools. You can import subscribers from CSV files or directly from other popular platforms. Our migration wizard guides you through the process step by step, ensuring your subscriber data transfers correctly. We also provide dedicated migration support for Professional and Business plan subscribers.",
    },
    {
      question: "What kind of support does TheNews offer?",
      answer:
        "We provide comprehensive support across all plans. Starter plan subscribers receive email support with 24-hour response times. Professional plan users get priority email support with 12-hour response times. Business plan subscribers enjoy 24/7 priority support and a dedicated account manager. Additionally, all users have access to our extensive knowledge base, video tutorials, and regular webinars.",
    },
    {
      question: "When will the AI-powered features be available?",
      answer:
        "We're currently in the final stages of developing our AI-powered content generation, scheduled sending, and automation features. These advanced capabilities are scheduled for release in Q3 2023. Beta access will be available to Professional and Business plan subscribers starting next month. If you'd like early access, you can join our waiting list through your account dashboard.",
    },
  ]

  return (
    <section className="py-16 md:py-24 bg-white relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gold-50 via-transparent to-transparent opacity-40"></div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="max-w-4xl mx-auto"
        >
          <motion.div variants={itemVariants} className="text-center mb-12 md:mb-16">
            <span className="inline-block px-4 py-1.5 bg-gold-100 text-gold-700 rounded-full text-sm font-medium mb-4">
              FAQ
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-6 font-heading">
              Frequently Asked <span className="text-gold-500">Questions</span>
            </h2>
            <p className="text-lg text-neutral-600 max-w-3xl mx-auto leading-relaxed">
              Find answers to the most common questions about TheNews platform.
            </p>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Accordion type="single" collapsible className="space-y-4">
              {faqItems.map((item, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="border border-neutral-200 rounded-lg px-4 md:px-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <AccordionTrigger className="text-left font-medium py-4 md:py-5 text-base md:text-lg hover:text-gold-600 hover:no-underline">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-neutral-600 pb-4 md:pb-5 leading-relaxed text-sm md:text-base">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>

          <motion.div variants={itemVariants} className="mt-10 md:mt-12 text-center">
            <p className="text-neutral-600">
              Still have questions?{" "}
              <a href="#" className="text-gold-600 font-medium hover:text-gold-700 underline">
                Contact our support team
              </a>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
