"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight } from "lucide-react"

export function BlogSidebar() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })

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

  const categories = [
    { name: "Strategy", count: 12 },
    { name: "Design", count: 8 },
    { name: "Automation", count: 7 },
    { name: "Analytics", count: 6 },
    { name: "Compliance", count: 5 },
    { name: "Copywriting", count: 9 },
    { name: "Case Studies", count: 4 },
  ]

  const popularPosts = [
    {
      title: "10 Subject Line Formulas That Get 80%+ Open Rates",
      date: "April 18, 2024",
      image: "/placeholder.svg?height=80&width=80",
    },
    {
      title: "How to Build Your First 1,000 Subscribers",
      date: "April 2, 2024",
      image: "/placeholder.svg?height=80&width=80",
    },
    {
      title: "The Best Time to Send Newsletters Based on Data",
      date: "March 25, 2024",
      image: "/placeholder.svg?height=80&width=80",
    },
    {
      title: "5 Newsletter Metrics You Should Track (But Probably Don't)",
      date: "March 10, 2024",
      image: "/placeholder.svg?height=80&width=80",
    },
  ]

  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className="space-y-8"
    >
      <motion.div variants={itemVariants} className="bg-neutral-50 rounded-xl p-6 border border-neutral-100">
        <h3 className="text-lg font-bold mb-4">Subscribe to Our Newsletter</h3>
        <p className="text-neutral-600 text-sm mb-4">
          Get the latest articles, tips, and insights delivered straight to your inbox.
        </p>
        <div className="space-y-3">
          <Input
            type="email"
            placeholder="Your email address"
            className="border-neutral-200 focus-visible:ring-gold-500"
          />
          <Button className="w-full bg-gold-500 hover:bg-gold-600">
            Subscribe <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="bg-neutral-50 rounded-xl p-6 border border-neutral-100">
        <h3 className="text-lg font-bold mb-4">Categories</h3>
        <ul className="space-y-2">
          {categories.map((category, index) => (
            <li key={index}>
              <Link
                href={`/blog/category/${category.name.toLowerCase()}`}
                className="flex justify-between items-center py-2 text-neutral-700 hover:text-gold-600 transition-colors"
              >
                <span>{category.name}</span>
                <span className="bg-neutral-200 text-neutral-700 text-xs px-2 py-0.5 rounded-full">
                  {category.count}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </motion.div>

      <motion.div variants={itemVariants} className="bg-neutral-50 rounded-xl p-6 border border-neutral-100">
        <h3 className="text-lg font-bold mb-4">Popular Articles</h3>
        <div className="space-y-4">
          {popularPosts.map((post, index) => (
            <div key={index} className="flex gap-3">
              <div className="shrink-0">
                <Image
                  src={post.image || "/placeholder.svg"}
                  alt={post.title}
                  width={60}
                  height={60}
                  className="rounded-md object-cover w-[60px] h-[60px]"
                />
              </div>
              <div>
                <h4 className="font-medium text-sm line-clamp-2 hover:text-gold-600 transition-colors">
                  <Link href={`/blog/${post.title.toLowerCase().replace(/\s+/g, "-")}`}>{post.title}</Link>
                </h4>
                <p className="text-xs text-neutral-500 mt-1">{post.date}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="bg-dark-800 text-white rounded-xl p-6 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/20 rounded-full blur-xl -mr-10 -mt-10"></div>
        <div className="relative z-10">
          <h3 className="text-lg font-bold mb-2">Need Help With Your Newsletter?</h3>
          <p className="text-neutral-300 text-sm mb-4">
            Our team of experts can help you create, optimize, and grow your newsletter.
          </p>
          <Button className="bg-gold-500 text-dark-900 hover:bg-gold-400">Book a Consultation</Button>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="bg-neutral-50 rounded-xl p-6 border border-neutral-100">
        <h3 className="text-lg font-bold mb-4">Tags</h3>
        <div className="flex flex-wrap gap-2">
          {[
            "Email Marketing",
            "Newsletters",
            "Design",
            "Automation",
            "Growth",
            "Conversion",
            "Analytics",
            "Best Practices",
            "Subject Lines",
            "Segmentation",
            "Deliverability",
            "Content",
          ].map((tag, index) => (
            <Link
              key={index}
              href={`/blog/tag/${tag.toLowerCase().replace(/\s+/g, "-")}`}
              className="bg-neutral-200 hover:bg-gold-100 text-neutral-700 hover:text-gold-700 px-3 py-1 rounded-full text-xs transition-colors"
            >
              {tag}
            </Link>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}
