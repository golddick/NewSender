"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mail, CheckCircle, Sparkles, TrendingUp, Bell, Gift } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { formatString } from "@/lib/utils"

interface NewsletterSubscriptionProps {
  blogTitle?: string
  blogAuthor: string
  variant?: "inline" | "sidebar" | "footer"
  className?: string
}

export function NewsletterSubscription({
  blogTitle,
  blogAuthor ,
  variant = "inline",
  className = "",
}: NewsletterSubscriptionProps) {
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !name) {
      toast({
        title: "Missing Information",
        description: "Please fill in both your name and email address.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setIsSubscribed(true)

      toast({
        title: "Successfully Subscribed!",
        description: "Welcome to our newsletter. Check your email for confirmation.",
      })
    }, 1500)
  }

  const benefits = [
    { icon: TrendingUp, text: "Weekly AI & Tech insights" },
    { icon: Bell, text: "Breaking news alerts" },
    { icon: Gift, text: "Exclusive content & resources" },
    { icon: Sparkles, text: "Expert analysis & predictions" },
  ]

  if (isSubscribed) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className={`${className}`}>
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-8 text-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring" }}>
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            </motion.div>
            <h3 className="text-2xl font-bold text-green-800 mb-2">You&apos;re All Set!</h3>
            <p className="text-green-700 mb-4">
              Thanks for subscribing! You&apos;ll receive our latest {blogAuthor.toLowerCase()} insights and updates.
            </p>
            <div className="bg-green-100 rounded-lg p-4">
              <p className="text-sm text-green-800">
                <strong>What&apos;s next?</strong> Check your email for a confirmation message and get ready for amazing
                content!
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  const getVariantStyles = () => {
    switch (variant) {
      case "sidebar":
        return "bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200"
      case "footer":
        return "bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200"
      default:
        return "bg-gradient-to-br from-white via-gold-50 to-white border-blue-200"
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`${className}`}
    >
      <Card className={`shadow-lg ${getVariantStyles()}`}>
        <CardContent className="p-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-gold-100 to-gold-50 rounded-full mb-4">
              <Mail className="h-8 w-8 text-black" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Stay Updated with {formatString (blogAuthor)} Insights</h3>
            <p className="text-gray-600 leading-relaxed">
              {blogTitle
                ? `Enjoyed "${ blogTitle}"? Get more expert insights delivered to your inbox.`
                : "Join thousands of readers getting the latest AI and technology insights."}
            </p>
          </div>

          <form onSubmit={handleSubscribe} className="space-y-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                required
              />
              <Input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-black to-black hover:from-black hover:to-gold-700 text-white py-3 text-lg font-semibold"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Subscribing...
                </div>
              ) : (
                <>
                  <Mail className="h-5 w-5 mr-2" />
                  Subscribe to {formatString(blogAuthor)} Newletter 
                </>
              )}
            </Button>
          </form>

          {/* Benefits */}
          {/* <div className="space-y-3">
            <h4 className="font-semibold text-gray-900 text-center mb-4">What you'll get:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="flex items-center gap-3 text-sm text-gray-700"
                >
                  <div className="flex-shrink-0 w-8 h-8 bg-gold-100 rounded-full flex items-center justify-center">
                    <benefit.icon className="h-4 w-4 text-black" />
                  </div>
                  <span>{benefit.text}</span>
                </motion.div>
              ))}
            </div>
          </div> */}

          {/* Trust indicators */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-black text-white">
                  TheNews
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>No spam, unsubscribe anytime</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
