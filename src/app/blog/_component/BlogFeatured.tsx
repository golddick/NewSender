"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { Calendar, Clock, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function BlogFeatured() {
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

  return (
    <section className="py-12 bg-white relative">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="max-w-6xl mx-auto"
        >
          <motion.div variants={itemVariants} className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold font-heading">Featured Articles</h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div variants={itemVariants} className="relative">
              <div className="relative overflow-hidden rounded-xl mb-4 aspect-[16/9]">
                <Image
                  src="/placeholder.svg?height=400&width=600"
                  alt="How to Increase Your Newsletter Open Rates by 50%"
                  width={600}
                  height={400}
                  className="object-cover w-full h-full transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute top-4 left-4 bg-gold-500 text-dark-900 text-xs font-bold px-3 py-1 rounded-full">
                  Featured
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm text-neutral-500 mb-2">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>May 2, 2024</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>8 min read</span>
                </div>
              </div>
              <h3 className="text-xl md:text-2xl font-bold mb-2 hover:text-gold-600 transition-colors">
                <Link href="/blog/how-to-increase-newsletter-open-rates">
                  How to Increase Your Newsletter Open Rates by 50%
                </Link>
              </h3>
              <p className="text-neutral-600 mb-4">
                Learn the proven strategies that helped our customers dramatically improve their email open rates and
                engagement metrics in just 30 days.
              </p>
              <Button variant="link" className="text-gold-600 hover:text-gold-700 p-0 h-auto font-medium">
                Read Article <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </motion.div>

            <div className="space-y-6">
              {[
                {
                  title: "7 Newsletter Design Tips That Drive Engagement",
                  excerpt:
                    "Discover design principles that make your newsletters more appealing and drive higher click-through rates.",
                  date: "April 28, 2024",
                  readTime: "6 min read",
                  category: "Design",
                  image: "/placeholder.svg?height=200&width=300",
                },
                {
                  title: "The Ultimate Guide to Segmenting Your Email List",
                  excerpt:
                    "Learn how to divide your subscribers into targeted groups to deliver more relevant content and increase conversions.",
                  date: "April 22, 2024",
                  readTime: "10 min read",
                  category: "Strategy",
                  image: "/placeholder.svg?height=200&width=300",
                },
                {
                  title: "Case Study: How Company X Grew Their Subscriber Base by 200%",
                  excerpt:
                    "An in-depth look at the strategies and tactics that led to exponential growth for this B2B newsletter.",
                  date: "April 15, 2024",
                  readTime: "12 min read",
                  category: "Case Study",
                  image: "/placeholder.svg?height=200&width=300",
                },
              ].map((post, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="flex gap-4 items-start border-b border-neutral-100 pb-6 last:border-0"
                >
                  <div className="hidden sm:block shrink-0">
                    <div className="relative overflow-hidden rounded-lg w-24 h-24">
                      <Image
                        src={post.image || "/placeholder.svg"}
                        alt={post.title}
                        width={100}
                        height={100}
                        className="object-cover w-full h-full transition-transform duration-500 hover:scale-105"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-xs text-neutral-500 mb-1">
                      <span className="bg-neutral-100 px-2 py-0.5 rounded-full">{post.category}</span>
                      <span>{post.date}</span>
                      <span>•</span>
                      <span>{post.readTime}</span>
                    </div>
                    <h3 className="text-base font-bold mb-1 hover:text-gold-600 transition-colors">
                      <Link href={`/blog/${post.title.toLowerCase().replace(/\s+/g, "-")}`}>{post.title}</Link>
                    </h3>
                    <p className="text-sm text-neutral-600 line-clamp-2">{post.excerpt}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
