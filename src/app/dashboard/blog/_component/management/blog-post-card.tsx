"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Edit3,
  Eye,
  Trash2,
  MoreVertical,
  Calendar,
  Clock,
  Users,
  Heart,
  MessageSquare,
  Copy,
  Share2,
  Archive,
  Globe,
  Lock,
  Star,
} from "lucide-react"
import { PostStatus, PostVisibility } from "@prisma/client"

interface BlogPost {
  id: string
  title: string
  excerpt: string
  featuredImage: string | null
  category: string
  tags: string[]
  author: string
  status: PostStatus
  visibility:PostVisibility
  createdAt: string
  updatedAt: string
  publishedAt: string | null
  wordCount: number
  readTime: number
  views: number
  likes: number
  comments: number
  seoScore: number
  isFeatured: boolean
}

interface BlogPostCardProps {
  post: BlogPost
  onEdit: () => void
  onView: () => void
  onDelete: () => void
  onArchive: () => void
  getStatusIcon: (status: string) => React.ReactNode
  getStatusColor: (status: string) => string
}

export function BlogPostCard({
  post,
  onEdit,
  onView,
  onDelete,
  onArchive,
  getStatusIcon,
  getStatusColor,
}: BlogPostCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const getSeoScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-100"
    if (score >= 60) return "text-yellow-600 bg-yellow-100"
    return "text-red-600 bg-red-100"
  }

  return (
    <motion.div whileHover={{ y: -2 }} onHoverStart={() => setIsHovered(true)} onHoverEnd={() => setIsHovered(false)}>
      <Card className="h-full overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-300">
        {/* Featured Image */}
        <div className="relative h-48 overflow-hidden">
          {post.featuredImage ? (
            <Image
              src={post.featuredImage}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-300 hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <div className="text-gray-400 text-center">
                <div className="text-4xl mb-2">📝</div>
                <div className="text-sm">No Image</div>
              </div>
            </div>
          )}

          {/* Status Badge */}
          <div className="absolute top-3 left-3">
            <Badge className={`${getStatusColor(post.status)} border flex items-center gap-1`}>
              {getStatusIcon(post.status)}
              {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
            </Badge>
          </div>

          {/* Visibility Badge */}
          <div className="absolute top-3 right-3">
            <Badge variant="secondary" className="bg-white/90 text-gray-700">
              {post.visibility === "PUBLIC" ? <Globe className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
            </Badge>
          </div>

          {/* Featured Star */}
          {post.isFeatured && (
            <div className="absolute bottom-3 left-3">
              <Badge className="bg-yellow-500 text-white border-yellow-600">
                <Star className="h-3 w-3 mr-1 fill-current" />
                Featured
              </Badge>
            </div>
          )}

          {/* Actions Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            className="absolute inset-0 bg-black/50 flex items-center justify-center gap-2"
          >
            <Button size="sm" variant="secondary" onClick={onView}>
              <Eye className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="secondary" onClick={onEdit}>
              <Edit3 className="h-4 w-4" />
            </Button>
          </motion.div>
        </div>

        <CardHeader className=" p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className=" flex items-center w-full justify-between">
                <Badge variant="outline" className="mb-2 text-xs">
                  {post.category}
                </Badge>

                <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={onView}>
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={onEdit}>
                    <Edit3 className="h-4 w-4 mr-2" />
                    Edit Post
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {post.status !== "ARCHIVED" && (
                    <DropdownMenuItem onClick={onArchive}>
                      <Archive className="h-4 w-4 mr-2" />
                      Archive
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={onDelete} className="text-red-600">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              </div>
              <h3 className="font-bold text-lg leading-tight text-black line-clamp-2 ">{post.title}</h3>
              {/* <p className="text-gray-600 text-sm line-clamp-2 mb-3">{post.excerpt}</p> */}
            </div>

           
          </div>
        </CardHeader>

        <CardContent className="pt-0 px-4 ">
          {/* Tags */}
          <div className="flex flex-wrap gap-1 ">
            {post.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs capitalize">
                #{tag}
              </Badge>
            ))}
            {post.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{post.tags.length - 3}
              </Badge>
            )}
          </div>

          {/* Metrics */}
          <div className="flex flex-col gap-4 mb-4 text-sm  w-full text-gray-600">
            <div className=" flex items-center justify-between w-full">
                     <div className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    <span>{post.views.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                    <Heart className="h-3 w-3" />
                    <span>{post.likes}</span>
                    </div>
            </div>

            <div className=" flex items-center justify-between w-full">
                     <div className="flex items-center gap-1">
                    <MessageSquare className="h-3 w-3" />
                    <span>{post.comments}</span>
                    </div>
                    <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{post.readTime} min read</span>
                    </div>
            </div>
       
           
          </div>

          {/* SEO Score */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-600">SEO Score:</span>
            <Badge className={`${getSeoScoreColor(post.seoScore)} border-0`}>{post.seoScore}%</Badge>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>
                {post.status === "PUBLISHED" && post.publishedAt
                  ? `Published ${formatDate(post.publishedAt)}`
                  : `Updated ${formatDate(post.updatedAt)}`}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              <span>{post.wordCount.toLocaleString()} words</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
