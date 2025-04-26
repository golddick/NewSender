"use client"

import type React from "react"

import { motion } from "framer-motion"
import Link from "next/link"
import { Twitter, Instagram, Linkedin, Github } from "lucide-react"
import { Button, Input } from "@nextui-org/react"


export function XFooter() {
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
    <footer className="bg-dark-800 text-white border-t border-dark-700 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-4 gap-10"
        >
          <motion.div variants={itemVariants} className="md:col-span-2">
            <Link href="/" className="inline-block mb-6">
              <span className="text-2xl font-bold">
                <span className="text-gold-400 font-heading">The</span>
                <span className="text-white font-heading">News</span>
              </span>
            </Link>
            <p className="text-neutral-300 mb-6 max-w-md leading-relaxed">
              TheNews helps you create, send, and analyze beautiful newsletters that engage your audience and grow your
              business.
            </p>
            <div className="flex space-x-4">
              <SocialLink href="#" icon={<Twitter size={18} />} />
              <SocialLink href="#" icon={<Instagram size={18} />} />
              <SocialLink href="#" icon={<Linkedin size={18} />} />
              <SocialLink href="#" icon={<Github size={18} />} />
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h4 className="text-lg font-bold mb-5 text-white">Company</h4>
            <ul className="space-y-3">
              <FooterLink href="#about">About</FooterLink>
              <FooterLink href="#features">Features</FooterLink>
              <FooterLink href="#pricing">Pricing</FooterLink>
            </ul>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h4 className="text-lg font-bold mb-5 text-white">Subscribe</h4>
            <p className="text-neutral-300 mb-4">Get the latest news and updates from TheNews.</p>
            <div className="flex flex-col space-y-3">
              <Input
                type="email"
                placeholder="Your email"
                className="border-dark-600 bg-dark-700 focus:border-gold-400 text-white"
              />
              <Button className="bg-gold-700 text-dark-900 hover:bg-gold-400 w-full">Subscribe</Button>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="border-t border-dark-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center"
        >
          <p className="text-neutral-400 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} TheNews. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link href="#" className="text-neutral-400 text-sm hover:text-gold-300 transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="text-neutral-400 text-sm hover:text-gold-300 transition-colors">
              Terms of Service
            </Link>
            <Link href="#" className="text-neutral-400 text-sm hover:text-gold-300 transition-colors">
              Cookie Policy
            </Link>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}

function SocialLink({ href, icon }: { href: string; icon: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="w-9 h-9 flex items-center justify-center rounded-full bg-dark-700 text-neutral-300 hover:bg-gold-500/20 hover:text-gold-300 transition-colors"
    >
      {icon}
    </Link>
  )
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="text-neutral-300 hover:text-gold-300 transition-colors">
        {children}
      </Link>
    </li>
  )
}
