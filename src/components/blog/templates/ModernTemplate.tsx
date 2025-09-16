"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Clock, Eye, Heart, Share2, Bookmark } from "lucide-react"

interface BlogContent {
  id: string
  title: string
  content: string
  excerpt: string
  featuredImage: string
  author: {
    name: string
    avatar: string
    bio: string
  }
  publishedAt: string
  readTime: string
  views: number
  likes: number
  category: string
  tags: string[]
}

interface TemplateConfig {
  primaryColor?: string
  secondaryColor?: string
  fontFamily?: string
  showAuthorBio?: boolean
  showSocialShare?: boolean
  showReadingProgress?: boolean
  headerStyle?: "gradient" | "solid" | "image"
  contentWidth?: "narrow" | "medium" | "wide"
}

interface ModernTemplateProps {
  content: BlogContent
  config?: TemplateConfig
}

export function ModernTemplate({ content, config = {} }: ModernTemplateProps) {
  const {
    primaryColor = "#3B82F6",
    secondaryColor = "#1E40AF",
    fontFamily = "Inter, sans-serif",
    showAuthorBio = true,
    showSocialShare = true,
    showReadingProgress = true,
    headerStyle = "gradient",
    contentWidth = "medium",
  } = config

  const widthClasses = {
    narrow: "max-w-2xl",
    medium: "max-w-4xl",
    wide: "max-w-6xl",
  }

  const parseContent = (text: string) => {
    return text
      .replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold mt-8 mb-4 text-gray-900">$1</h1>')
      .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-bold mt-6 mb-3 text-gray-900">$1</h2>')
      .replace(/^### (.*$)/gm, '<h3 class="text-xl font-semibold mt-4 mb-2 text-gray-900">$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      .replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-2 py-1 rounded text-sm font-mono">$1</code>')
      .replace(/\n\n/g, '</p><p class="mb-4 text-gray-700 leading-relaxed">')
      .replace(/^(?!<[h|p])(.+)$/gm, '<p class="mb-4 text-gray-700 leading-relaxed">$1</p>')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white" style={{ fontFamily }}>
      {/* Reading Progress Bar */}
      {showReadingProgress && (
        <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
          <div className="h-full transition-all duration-300" style={{ backgroundColor: primaryColor, width: "0%" }} />
        </div>
      )}

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`relative overflow-hidden ${
          headerStyle === "gradient"
            ? "bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700"
            : headerStyle === "solid"
              ? "bg-gray-900"
              : "bg-black"
        }`}
      >
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative container mx-auto px-4 py-16">
          <div className={`mx-auto text-center text-white ${widthClasses[contentWidth]}`}>
            <Badge className="mb-4 text-white border-white/30" style={{ backgroundColor: `${primaryColor}40` }}>
              {content.category}
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">{content.title}</h1>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">{content.excerpt}</p>

            <div className="flex flex-wrap items-center justify-center gap-6 text-blue-100">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <span>{new Date(content.publishedAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <span>{content.readTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                <span>{content.views.toLocaleString()} views</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                <span>{content.likes} likes</span>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="container mx-auto px-4 py-12">
        <div className={`mx-auto ${widthClasses[contentWidth]}`}>
          {/* Author Info */}
          {showAuthorBio && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-200"
            >
              <div className="flex items-center gap-6">
                <Avatar className="h-16 w-16 ring-4 ring-blue-100">
                  <AvatarImage src={content.author.avatar || "/placeholder.svg"} alt={content.author.name} />
                  <AvatarFallback className="text-lg font-bold text-white" style={{ backgroundColor: primaryColor }}>
                    {content.author.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{content.author.name}</h3>
                  <p className="text-gray-600 mt-1">{content.author.bio}</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Featured Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-12"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src={content.featuredImage || "/placeholder.svg"}
                alt={content.title}
                width={800}
                height={400}
                className="w-full h-auto"
              />
            </div>
          </motion.div>

          {/* Content */}
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-12 border border-gray-200"
          >
            <div
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: parseContent(content.content) }}
            />

            {/* Social Share */}
            {showSocialShare && (
              <div className="mt-12 pt-8 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm" style={{ borderColor: primaryColor, color: primaryColor }}>
                      <Heart className="h-4 w-4 mr-2" />
                      {content.likes}
                    </Button>
                    <Button variant="outline" size="sm">
                      <Bookmark className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                  </div>
                  <Button variant="outline" size="sm" style={{ borderColor: primaryColor, color: primaryColor }}>
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>
            )}
          </motion.article>

          {/* Tags */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-4">Tags</h3>
            <div className="flex flex-wrap gap-3">
              {content.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="px-4 py-2 text-sm cursor-pointer hover:opacity-80"
                  style={{ backgroundColor: `${primaryColor}20`, color: primaryColor }}
                >
                  #{tag}
                </Badge>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
