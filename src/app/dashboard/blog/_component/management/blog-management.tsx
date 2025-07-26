





"use client"

import { useState, useEffect, KeyboardEvent } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Search, Plus, Edit3, Clock, Globe, FileText, BarChart3, Archive, CheckCircle, XCircle, X } from "lucide-react"
import { BlogAnalytics } from "./blog-analytics"
import { BlogPostDetails } from "./blog-post-details"
import { BlogPostCard } from "./blog-post-card"
import { useUser } from "@clerk/nextjs"
import { getAllCategories, getFilteredPosts } from "@/lib/sharedApi/actions"
import Loader from "@/components/Loader"
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
  status: PostStatus
  visibility:PostVisibility   
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

export function BlogManagement() {
const { user } = useUser()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [searchInput, setSearchInput] = useState("") 
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [sortBy, setSortBy] = useState("updated")
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [showAnalytics, setShowAnalytics] = useState(false)
  const [activeTab, setActiveTab] = useState("all")
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [categories, setCategories] = useState<string[]>([])



   

  useEffect(() => {
    async function fetchData() {
      if (!user?.id) return
      const [postData, categoryData] = await Promise.all([
        getFilteredPosts({ 
          authorId: user.id, 
        //   category: categoryFilter !== "all" ? categoryFilter : undefined, 
          search: searchQuery, 
          sort: sortBy, 
          order: "desc" 
        }),
        getAllCategories()
      ])
      setPosts(postData)
      setCategories(["all", ...categoryData.map((c) => c.slug)])
    }

    fetchData()
  }, [user?.id, searchQuery, categoryFilter, sortBy])

  
  console.log(categories, 'categories')
  console.log(posts, 'posts')


  if (posts.length === 0 && categories.length === 0) {
    return <Loader />
  }

  // Filter and sort posts
  const filteredPosts = posts
    .filter((post) => {
      const matchesSearch =
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesStatus = statusFilter === "all" || post.status === statusFilter
      const matchesCategory = categoryFilter === "all" || (post.category && post.category.toLowerCase() === categoryFilter.toLowerCase())
      const matchesTab =
        activeTab === "all" ||
        (activeTab === "published" && post.status === 'PUBLISHED') ||
        (activeTab === "drafts" && post.status === "DRAFT") ||
        (activeTab === "scheduled" && post.status === "SCHEDULED") ||
        (activeTab === "archived" && post.status === "ARCHIVED")

      return matchesSearch && matchesStatus && matchesCategory && matchesTab
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "updated":
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        case "created":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case "published":
          if (!a.publishedAt && !b.publishedAt) return 0
          if (!a.publishedAt) return 1
          if (!b.publishedAt) return -1
          return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
        case "views":
          return b.views - a.views
        case "likes":
          return b.likes - a.likes
        case "title":
          return a.title.localeCompare(b.title)
        default:
          return 0
      }
    })

  // Get statistics
  const stats = {
    total: posts.length,
    published: posts.filter((p) => p.status === 'PUBLISHED').length,
    drafts: posts.filter((p) => p.status === "DRAFT").length,
    scheduled: posts.filter((p) => p.status === "SCHEDULED").length,
    archived: posts.filter((p) => p.status === "SCHEDULED").length,
    totalViews: posts.reduce((sum, p) => sum + p.views, 0),
    totalLikes: posts.reduce((sum, p) => sum + p.likes, 0),
    totalComments: posts.reduce((sum, p) => sum + p.comments, 0),
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PUBLISHED":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "DRAFT":
        return <FileText className="h-4 w-4 text-yellow-600" />
      case "SCHEDULED":
        return <Clock className="h-4 w-4 text-blue-600" />
      case "ARCHIVED":
        return <Archive className="h-4 w-4 text-gray-600" />
      default:
        return <XCircle className="h-4 w-4 text-red-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800 border-green-200"
      case "draft":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "scheduled":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "archived":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-red-100 text-red-800 border-red-200"
    }
  }

  const handleDeletePost = (postId: string) => {
    setPosts((posts) => posts.filter((p) => p.id !== postId))
    toast({
      title: "Post deleted",
      description: "The blog post has been permanently deleted.",
    })
  }


  const handleArchivePost = (postId: string) => {
    setPosts((posts) =>
      posts.map((p) =>
        p.id === postId ? { ...p, status: 'ARCHIVED' as const, updatedAt: new Date().toISOString() } : p,
      ),
    )
    toast({
      title: "Post archived",
      description: "The blog post has been moved to archives.",
    })
  }

//     const handleSearch = () => {
//     setSearchQuery(searchInput) 
//   }

//     const handleSearchKeyDown = (e: KeyboardEvent) => {
//     if (e.key === 'Enter') {
//       e.preventDefault()
//       handleSearch()
//     }
//   }

const handleSearchKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      setSearchQuery(searchInput)
    }
  }

  const handleSearch = () => {
    setSearchQuery(searchInput)
  }

   const clearSearch = () => {
    setSearchInput("")
    setSearchQuery("")
  }

  return (
    <div className="w-full px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Blog Management</h1>
            <p className="text-gray-600">Manage your blog posts, track performance, and create new content</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setShowAnalytics(true)} className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </Button>
            <Link href="/dashboard/blog/write">
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                New Post
              </Button>
            </Link>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-6">
          <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-700">{stats.total}</div>
              <div className="text-sm text-blue-600">Total Posts</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-700">{stats.published}</div>
              <div className="text-sm text-green-600">Published</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-700">{stats.drafts}</div>
              <div className="text-sm text-yellow-600">Drafts</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-700">{stats.scheduled}</div>
              <div className="text-sm text-purple-600">Scheduled</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-indigo-50 to-indigo-100 border-indigo-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-indigo-700">{stats.totalViews.toLocaleString()}</div>
              <div className="text-sm text-indigo-600">Total Views</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-red-50 to-red-100 border-red-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-700">{stats.totalLikes}</div>
              <div className="text-sm text-red-600">Total Likes</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-teal-50 to-teal-100 border-teal-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-teal-700">{stats.totalComments}</div>
              <div className="text-sm text-teal-600">Comments</div>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Filters and Search */}
       <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6"
      >
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              {searchInput && (
                <X 
                  onClick={clearSearch}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-red-600 cursor-pointer h-5 w-5"
                  aria-label="Clear search"
                />
              )}
              <Input
                placeholder="Search posts by title, content, or tags..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                className="pl-10"
              />
               <Search  onClick={handleSearch} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-6 w-6" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={handleSearch} variant="outline">
              Search
            </Button>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="PUBLISHED">Published</SelectItem>
                <SelectItem value="DRAFT">Draft</SelectItem>
                <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                <SelectItem value="ARCHIVED">Archived</SelectItem>
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.filter(c => c !== "all").map((category) => (
                  <SelectItem key={category} value={category} className="capitalize">
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="updated">Last Updated</SelectItem>
                <SelectItem value="created">Date Created</SelectItem>
                <SelectItem value="published">Date Published</SelectItem>
                <SelectItem value="views">Most Views</SelectItem>
                <SelectItem value="likes">Most Likes</SelectItem>
                <SelectItem value="title">Title A-Z</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </motion.div>
      {/* <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6"
      >
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search posts by title, content, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value={PostStatus.PUBLISHED}>Published</SelectItem>
                <SelectItem value={PostStatus.DRAFT}>Draft</SelectItem>
                <SelectItem value={PostStatus.SCHEDULED}>Scheduled</SelectItem>
                <SelectItem value={PostStatus.ARCHIVED}>Archived</SelectItem>
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.filter(c => c !== "all").map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="updated">Last Updated</SelectItem>
                <SelectItem value="created">Date Created</SelectItem>
                <SelectItem value="published">Date Published</SelectItem>
                <SelectItem value="views">Most Views</SelectItem>
                <SelectItem value="likes">Most Likes</SelectItem>
                <SelectItem value="title">Title A-Z</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </motion.div> */}

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:grid-cols-5">
            <TabsTrigger value="all" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              All ({stats.total})
            </TabsTrigger>
            <TabsTrigger value="published" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Published ({stats.published})
            </TabsTrigger>
            <TabsTrigger value="drafts" className="flex items-center gap-2">
              <Edit3 className="h-4 w-4" />
              Drafts ({stats.drafts})
            </TabsTrigger>
            <TabsTrigger value="scheduled" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Scheduled ({stats.scheduled})
            </TabsTrigger>
            <TabsTrigger value="archived" className="flex items-center gap-2">
              <Archive className="h-4 w-4" />
              Archived ({stats.archived})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            {filteredPosts.length === 0 ? (
              <Card className="p-12 text-center">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No posts found</h3>
                <p className="text-gray-600 mb-4">
                  {searchQuery || statusFilter !== "all" || categoryFilter !== "all"
                    ? "Try adjusting your filters or search terms."
                    : "Get started by creating your first blog post."}
                </p>
                {!searchQuery && statusFilter === "all" && categoryFilter === "all" && (
                  <Link href="/dashboard/blog/write">
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Your First Post
                    </Button>
                  </Link>
                )}
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <AnimatePresence>
                  {filteredPosts.map((post, index) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <BlogPostCard
                        post={post}
                        onEdit={() => window.open(`/dashboard/blog/write?edit=${post.slug}`, "_blank")}
                        onView={() => {
                          setSelectedPost(post)
                          setShowDetails(true)
                        }}
                        onDelete={() => handleDeletePost(post.id)}
                        onArchive={() => handleArchivePost(post.id)}
                        getStatusIcon={getStatusIcon}
                        getStatusColor={getStatusColor}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Blog Post Details Modal */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Blog Post Details</DialogTitle>
          </DialogHeader>
          {selectedPost && (
            <BlogPostDetails
              post={selectedPost}
              onClose={() => setShowDetails(false)}
              onEdit={() => {
                setShowDetails(false)
                window.open(`/dashboard/blog/write?edit=${selectedPost.slug}`, "_blank")
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Analytics Modal */}
      <Dialog open={showAnalytics} onOpenChange={setShowAnalytics}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Blog Analytics</DialogTitle>
          </DialogHeader>
          <BlogAnalytics posts={posts} />
        </DialogContent>
      </Dialog>
    </div>
  )
}