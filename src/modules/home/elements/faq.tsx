"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export function FAQ() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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

  const faqItems = [
    {
      question: "How does TheNews help marketers and bloggers?",
      answer:
        "TheNews provides powerful tools for creating, automating, and sending captivating newsletters and blog posts. With intuitive design tools, analytics, and powerful integration options, TheNews helps marketers and bloggers grow their audience and drive engagement effortlessly.",
    },
    {
      question: "Can I automate my content with TheNews?",
      answer:
        "Yes! TheNews offers advanced automation tools that let you schedule and automate your content campaigns. With features like automated workflows and content delivery based on your audience's behavior, you can save time while maximizing engagement. Our AI-powered features are coming in the next update to further enhance automation.",
    },
    {
      question: "What API features does TheNews offer for developers?",
      answer:
        "TheNews provides a robust API for developers to integrate content management, automate workflows, track performance metrics, and scale email campaigns. The API is designed to make it easy for developers to manage and optimize newsletters and blog posts seamlessly.",
    },
    {
      question: "Is there a way to track the performance of my newsletters?",
      answer:
        "Yes! TheNews offers detailed analytics and tracking features. You can monitor open rates, click-through rates, engagement, and more to measure the effectiveness of your campaigns and optimize your content strategy.",
    },
    {
      question: "Can I migrate my existing subscribers to TheNews?",
      answer:
        "Yes, migrating your existing subscriber list to TheNews is easy. You can import subscribers from CSV files or other platforms using our simple migration tools, ensuring a smooth transition.",
    },
    {
      question: "What kind of support does TheNews offer?",
      answer:
        "TheNews provides comprehensive support. Starter plan users get email support, while Professional and Business plan users receive priority support with faster response times and a dedicated account manager for personalized assistance.",
    },
  ];

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
  );
}
