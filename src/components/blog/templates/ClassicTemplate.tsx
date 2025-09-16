"use client"

import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Clock, Eye, Heart, Share2, Bookmark, User } from "lucide-react"

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
  headerStyle?: "minimal" | "bordered" | "centered"
  contentWidth?: "narrow" | "medium" | "wide"
  typography?: "serif" | "sans-serif"
}

interface ClassicTemplateProps {
  content: BlogContent
  config?: TemplateConfig
}

export function ClassicTemplate({ content, config = {} }: ClassicTemplateProps) {
  const {
    primaryColor = "#1F2937",
    secondaryColor = "#6B7280",
    fontFamily = "Georgia, serif",
    showAuthorBio = true,
    showSocialShare = true,
    showReadingProgress = false,
    headerStyle = "minimal",
    contentWidth = "narrow",
    typography = "serif",
  } = config

  const widthClasses = {
    narrow: "max-w-3xl",
    medium: "max-w-4xl",
    wide: "max-w-6xl",
  }

  const typeClasses = {
    serif: "font-serif",
    "sans-serif": "font-sans",
  }

  const parseContent = (text: string) => {
    return text
      .replace(/^# (.*$)/gm, '<h1 class="text-4xl font-bold mt-12 mb-6 text-gray-900 leading-tight">$1</h1>')
      .replace(/^## (.*$)/gm, '<h2 class="text-3xl font-bold mt-10 mb-5 text-gray-900 leading-tight">$1</h2>')
      .replace(/^### (.*$)/gm, '<h3 class="text-2xl font-semibold mt-8 mb-4 text-gray-900 leading-tight">$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-gray-900">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic text-gray-800">$1</em>')
      .replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-2 py-1 rounded text-sm font-mono border">$1</code>')
      .replace(
        /^> (.*$)/gm,
        '<blockquote class="border-l-4 border-gray-300 pl-6 py-2 my-6 italic text-gray-700 bg-gray-50 rounded-r">$1</blockquote>',
      )
      .replace(/\n\n/g, '</p><p class="mb-6 text-gray-800 leading-relaxed text-lg">')
      .replace(/^(?!<[h|p|b])(.+)$/gm, '<p class="mb-6 text-gray-800 leading-relaxed text-lg">$1</p>')
  }

  return (
    <div className={`min-h-screen bg-white ${typeClasses[typography]}`} style={{ fontFamily }}>
      {/* Reading Progress Bar */}
      {showReadingProgress && (
        <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
          <div className="h-full transition-all duration-300" style={{ backgroundColor: primaryColor, width: "0%" }} />
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        <div className={`mx-auto ${widthClasses[contentWidth]}`}>
          {/* Header */}
          <header
            className={`mb-12 ${
              headerStyle === "bordered"
                ? "border-b-2 border-gray-200 pb-8"
                : headerStyle === "centered"
                  ? "text-center"
                  : ""
            }`}
          >
            <div className="mb-6">
              <Badge variant="outline" className="mb-4" style={{ borderColor: primaryColor, color: primaryColor }}>
                {content.category}
              </Badge>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">{content.title}</h1>
              <p className="text-xl text-gray-600 leading-relaxed mb-8">{content.excerpt}</p>
            </div>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 text-gray-600 border-t border-b border-gray-200 py-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="font-medium">{content.author.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>
                  {new Date(content.publishedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{content.readTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                <span>{content.views.toLocaleString()}</span>
              </div>
            </div>
          </header>

          {/* Featured Image */}
          <div className="mb-12">
            <div className="relative">
              <Image
                src={content.featuredImage || "/placeholder.svg"}
                alt={content.title}
                width={800}
                height={500}
                className="w-full h-auto rounded-lg shadow-lg"
              />
              <div className="absolute inset-0 rounded-lg ring-1 ring-inset ring-gray-900/10" />
            </div>
          </div>

          {/* Author Bio */}
          {showAuthorBio && (
            <div className="mb-12 p-6 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-start gap-4">
                <Avatar className="h-12 w-12 ring-2 ring-gray-200">
                  <AvatarImage src={content.author.avatar || "/placeholder.svg"} alt={content.author.name} />
                  <AvatarFallback className="text-white font-semibold" style={{ backgroundColor: primaryColor }}>
                    {content.author.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">About {content.author.name}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{content.author.bio}</p>
                </div>
              </div>
            </div>
          )}

          {/* Article Content */}
          <article className="mb-12">
            <div
              className="prose prose-lg prose-gray max-w-none"
              dangerouslySetInnerHTML={{ __html: parseContent(content.content) }}
            />
          </article>

          {/* Social Actions */}
          {showSocialShare && (
            <div className="mb-12 p-6 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Button variant="outline" size="sm" className="border-gray-300 hover:bg-gray-100 bg-transparent">
                    <Heart className="h-4 w-4 mr-2" />
                    Like ({content.likes})
                  </Button>
                  <Button variant="outline" size="sm" className="border-gray-300 hover:bg-gray-100 bg-transparent">
                    <Bookmark className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                </div>
                <Button variant="outline" size="sm" className="border-gray-300 hover:bg-gray-100 bg-transparent">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Article
                </Button>
              </div>
            </div>
          )}

          {/* Tags */}
          <div className="mb-12">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Filed Under</h3>
            <div className="flex flex-wrap gap-2">
              {content.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="px-3 py-1 text-sm cursor-pointer hover:bg-gray-100"
                  style={{ borderColor: secondaryColor, color: secondaryColor }}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Footer */}
          <footer className="border-t border-gray-200 pt-8">
            <div className="text-center text-gray-500 text-sm">
              <p>
                Published on{" "}
                {new Date(content.publishedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <p className="mt-2">© 2025 TheNews. All rights reserved.</p>
            </div>
          </footer>
        </div>
      </div>
    </div>
  )
}
