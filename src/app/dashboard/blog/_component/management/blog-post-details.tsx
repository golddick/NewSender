"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import {
  Edit3,
  Calendar,
  Globe,
  Lock,
  Star,
  BarChart3,
  Share2,
  Copy,
  Download,
  FileText,
  Tag,
  Settings,
  Trash2,
} from "lucide-react"
import { PostStatus, PostVisibility } from "@prisma/client"

interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string
  featuredImage: string | null
  category: string
  tags: string[]
  author: string
  authorTitle: string
  status: PostStatus,
  visibility: PostVisibility
  createdAt: string
  updatedAt: string
  publishedAt: string | null
  scheduledAt: string | null
  wordCount: number
  readTime: number
  views: number
  likes: number
  comments: number
  shares: number
  seoScore: number
  isFeatured: boolean
  slug: string
}

interface BlogPostDetailsProps {
  post: BlogPost
  onClose: () => void
  onEdit: () => void
}

export function BlogPostDetails({ post, onClose, onEdit }: BlogPostDetailsProps) {
  const [activeTab, setActiveTab] = useState("overview")

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getSeoScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-100 border-green-200"
    if (score >= 60) return "text-yellow-600 bg-yellow-100 border-yellow-200"
    return "text-red-600 bg-red-100 border-red-200"
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PUBLISHED":
        return "bg-green-100 text-green-800 border-green-200"
      case "DRAFT":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "SCHEDULED":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "ARCHIVED":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-red-100 text-red-800 border-red-200"
    }
  }

  // Parse markdown content for preview (simplified)
  const parseMarkdownPreview = (content: string) => {
    return content
      .replace(/^### (.*$)/gm, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>')
      .replace(/^## (.*$)/gm, '<h2 class="text-xl font-bold mt-6 mb-3">$1</h2>')
      .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mt-8 mb-4">$1</h1>')
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-1 rounded">$1</code>')
      .replace(/\n\n/g, '</p><p class="mb-4">')
      .replace(/^/, '<p class="mb-4">')
      .replace(/$/, "</p>")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <Badge className={`${getStatusColor(post.status)} border`}>
              {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
            </Badge>
            <Badge variant="outline">
              {post.visibility === "PUBLIC" ? (
                <>
                  <Globe className="h-3 w-3 mr-1" />
                  Public
                </>
              ) : (
                <>
                  <Lock className="h-3 w-3 mr-1" />
                  {post.visibility.charAt(0).toUpperCase() + post.visibility.slice(1)}
                </>
              )}
            </Badge>
            {post.isFeatured && (
              <Badge className="bg-yellow-500 text-white">
                <Star className="h-3 w-3 mr-1 fill-current" />
                Featured
              </Badge>
            )}
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{post.title}</h2>
          <p className="text-gray-600 mb-4">{post.excerpt}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onEdit}>
            <Edit3 className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button variant="outline">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </div>

      {/* Featured Image */}
      {post.featuredImage && (
        <div className="relative h-64 rounded-lg overflow-hidden">
          <Image src={post.featuredImage } alt={post.title} fill className="object-cover" />
        </div>
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Category</label>
                  <p className="text-gray-900">{post.category}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Author</label>
                  <p className="text-gray-900">{post.author}</p>
                  <p className="text-sm text-gray-600">{post.authorTitle}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Word Count</label>
                  <p className="text-gray-900">{post.wordCount.toLocaleString()} words</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Read Time</label>
                  <p className="text-gray-900">{post.readTime} minutes</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">SEO Score</label>
                  <Badge className={getSeoScoreColor(post.seoScore)}>{post.seoScore}%</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{post.views.toLocaleString()}</div>
                    <div className="text-sm text-blue-600">Views</div>
                  </div>
                  <div className="text-center p-3 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">{post.likes}</div>
                    <div className="text-sm text-red-600">Likes</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{post.comments}</div>
                    <div className="text-sm text-green-600">Comments</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{post.shares}</div>
                    <div className="text-sm text-purple-600">Shares</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Dates */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Created</label>
                  <p className="text-gray-900 text-sm">{formatDate(post.createdAt)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Last Updated</label>
                  <p className="text-gray-900 text-sm">{formatDate(post.updatedAt)}</p>
                </div>
                {post.publishedAt && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Published</label>
                    <p className="text-gray-900 text-sm">{formatDate(post.publishedAt)}</p>
                  </div>
                )}
                {post.scheduledAt && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Scheduled</label>
                    <p className="text-gray-900 text-sm">{formatDate(post.scheduledAt)}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Tags */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="h-5 w-5" />
                  Tags
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Content Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <div
                  dangerouslySetInnerHTML={{
                    __html: parseMarkdownPreview(post.content.substring(0, 1000) + "..."),
                  }}
                />
                {post.content.length > 1000 && <p className="text-gray-500 italic">... (content truncated)</p>}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Engagement Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {post.views > 0 ? (((post.likes + post.comments) / post.views) * 100).toFixed(1) : 0}%
                </div>
                <p className="text-gray-600">Based on likes and comments vs views</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {Math.round((post.seoScore + (post.views > 1000 ? 20 : 0) + (post.likes > 50 ? 15 : 0)) / 1.35)}
                </div>
                <p className="text-gray-600">Overall content performance</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Traffic Sources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>Direct</span>
                  <span className="font-medium">45%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Search</span>
                  <span className="font-medium">30%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Social</span>
                  <span className="font-medium">15%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Referral</span>
                  <span className="font-medium">10%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Post Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">URL Slug</label>
                <p className="text-gray-900 font-mono text-sm bg-gray-100 p-2 rounded">/blog/post/{post.slug}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Status</label>
                <p className="text-gray-900">{post.status}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Visibility</label>
                <p className="text-gray-900">{post.visibility}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Featured Post</label>
                <p className="text-gray-900">{post.isFeatured ? "Yes" : "No"}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" onClick={onEdit}>
                <Edit3 className="h-4 w-4 mr-2" />
                Edit Post
              </Button>
              <Button variant="outline" className="w-full bg-transparent">
                <Copy className="h-4 w-4 mr-2" />
                Duplicate Post
              </Button>
              <Button variant="outline" className="w-full bg-transparent">
                <Download className="h-4 w-4 mr-2" />
                Export as Markdown
              </Button>
              <Separator />
              <Button variant="destructive" className="w-full">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Post
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
