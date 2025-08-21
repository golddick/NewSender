// "use client"

// import { useEffect, useState } from "react"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Textarea } from "@/components/ui/textarea"
// import { Label } from "@/components/ui/label"
// import { Separator } from "@/components/ui/separator"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import {
//   Flag,
//   FlagOff,
//   Eye,
//   ThumbsUp,
//   MessageCircle,
//   Calendar,
//   User,
//   Mail,
//   AlertTriangle,
//   CheckCircle,
// } from "lucide-react"
// import { useToast } from "@/hooks/use-toast"
// import Link from "next/link"
// import { fetchBlogPostById } from "@/actions/blog/superAdmin"
// import { BlogPost } from "@/app/type"

// interface BlogReviewProps {
//   blogId: string
// }

// const mockBlogData = {
//   id: "blog_002",
//   title: "Building Effective Newsletter Campaigns",
//   content: `
//     <h2>Introduction</h2>
//     <p>Newsletter campaigns are one of the most effective ways to engage with your audience and drive conversions. In this comprehensive guide, we'll explore the key strategies and best practices for creating newsletters that your subscribers will actually want to read.</p>
    
//     <h2>Understanding Your Audience</h2>
//     <p>Before you start crafting your newsletter, it's crucial to understand who your audience is and what they're looking for. This involves analyzing your subscriber data, conducting surveys, and creating detailed buyer personas.</p>
    
//     <h2>Content Strategy</h2>
//     <p>Your content strategy should align with your audience's interests and your business goals. Consider mixing different types of content such as:</p>
//     <ul>
//       <li>Industry news and updates</li>
//       <li>Educational content and tutorials</li>
//       <li>Product announcements</li>
//       <li>Customer success stories</li>
//     </ul>
    
//     <h2>Design and Layout</h2>
//     <p>A well-designed newsletter not only looks professional but also improves readability and engagement. Use a clean, mobile-responsive design with clear hierarchy and compelling visuals.</p>
    
//     <h2>Conclusion</h2>
//     <p>Building effective newsletter campaigns requires a combination of strategic planning, quality content, and continuous optimization. By following these best practices, you'll be well on your way to creating newsletters that drive results.</p>
//   `,
//   author: {
//     name: "Michael Brown",
//     email: "m.brown@thenews.com",
//     avatar: "/placeholder.svg?height=40&width=40&text=MB",
//     joinedAt: "2023-06-15T00:00:00Z",
//     totalPosts: 24,
//     totalViews: 45600,
//   },
//   status: "published",
//   category: "Strategy",
//   tags: ["Newsletter", "Campaigns", "Best Practices"],
//   publishedAt: "2024-01-18T09:15:00Z",
//   views: 890,
//   likes: 67,
//   comments: 15,
//   isFlagged: true,
//   flagReason: "Potential copyright infringement in images",
//   flaggedAt: "2024-01-19T14:30:00Z",
//   flaggedBy: "Admin User",
//   createdAt: "2024-01-17T11:20:00Z",
//   updatedAt: "2024-01-18T09:15:00Z",
//   flagHistory: [
//     {
//       action: "flagged",
//       reason: "Potential copyright infringement in images",
//       timestamp: "2024-01-19T14:30:00Z",
//       reviewer: "Admin User",
//       comment: "Images used without proper attribution. Please verify licensing.",
//     },
//   ],
// }

// const flagReasons = [
//   "Copyright infringement",
//   "Inappropriate content",
//   "Spam or misleading information",
//   "Violation of community guidelines",
//   "Plagiarism",
//   "Offensive language",
//   "Other",
// ]

// export function BlogReview({ blogId }: BlogReviewProps) {
//   const [flagReason, setFlagReason] = useState("")
//   const [flagComment, setFlagComment] = useState("")
//   const [unflagComment, setUnflagComment] = useState("")
//   const [isProcessing, setIsProcessing] = useState(false)
//   const [blog, setBlog] = useState<BlogPost>()
//   const { toast } = useToast()

//   useEffect(() => {
//     const fetchBlog = async () => {
//       const res = await fetchBlogPostById(blogId)

//       console.log(res, 'fetchBlog')

//       if (res.error) {
//         toast({
//           title: "Error",
//           description: res.error,
//           variant: "destructive",
//         })
//       } else {
//         setBlog(res)
//       }
//       // setLoading(false)
//     }

//     fetchBlog()
//   }, [blogId, toast]
// )

//   const handleFlag = async () => {
//     if (!flagReason) {
//       toast({
//         title: "Flag Reason Required",
//         description: "Please select a reason for flagging this post.",
//         variant: "destructive",
//       })
//       return
//     }

//     setIsProcessing(true)

//     // Simulate API call
//     await new Promise((resolve) => setTimeout(resolve, 2000))

//     toast({
//       title: "Post Flagged",
//       description: `Blog post has been flagged for: ${flagReason}`,
//       variant: "destructive",
//     })

//     setIsProcessing(false)
//   }

//   const handleUnflag = async () => {
//     setIsProcessing(true)

//     // Simulate API call
//     await new Promise((resolve) => setTimeout(resolve, 2000))

//     toast({
//       title: "Flag Removed",
//       description: "The flag has been removed from this blog post.",
//     })

//     setIsProcessing(false)
//   }

//   const getStatusBadge = (status: string) => {
//     const statusConfig = {
//       published: {
//         label: "Published",
//         variant: "default" as const,
//         className: "bg-green-100 text-green-800 border-green-200",
//       },
//       draft: { label: "Draft", variant: "secondary" as const, className: "bg-gray-100 text-gray-800 border-gray-200" },
//       scheduled: {
//         label: "Scheduled",
//         variant: "outline" as const,
//         className: "bg-blue-100 text-blue-800 border-blue-200",
//       },
//       archived: {
//         label: "Archived",
//         variant: "outline" as const,
//         className: "bg-yellow-100 text-yellow-800 border-yellow-200",
//       },
//     }

//     const config = statusConfig[status as keyof typeof statusConfig]

//     return (
//       <Badge variant={config.variant} className={config.className}>
//         {config.label}
//       </Badge>
//     )
//   }

//   return (
//     <div className="space-y-8">
//       <div className="flex justify-between items-start">
//         <div>
//           <div className="flex items-center space-x-2 mb-2">
//             <Link href="/admin/blog">
//               <Button variant="outline" size="sm">
//                 ← Back to Blog Management
//               </Button>
//             </Link>
//           </div>
//           <h1 className="text-3xl font-bold">{mockBlogData.title}</h1>
//           <p className="text-muted-foreground">Blog ID: {mockBlogData.id}</p>
//         </div>

//         <div className="flex items-center space-x-2">
//           {getStatusBadge(mockBlogData.status)}
//           {mockBlogData.isFlagged && (
//             <Badge variant="destructive" className="flex items-center gap-1">
//               <Flag className="w-3 h-3" />
//               Flagged
//             </Badge>
//           )}
//         </div>
//       </div>

//       {/* Post Summary */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Post Summary</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//             <div className="space-y-2">
//               <Label className="text-sm font-medium text-muted-foreground">Performance</Label>
//               <div className="space-y-1">
//                 <div className="flex items-center space-x-2">
//                   <Eye className="w-4 h-4 text-muted-foreground" />
//                   <span className="font-medium">{mockBlogData.views.toLocaleString()} views</span>
//                 </div>
//                 <div className="flex items-center space-x-2">
//                   <ThumbsUp className="w-4 h-4 text-muted-foreground" />
//                   <span className="font-medium">{mockBlogData.likes} likes</span>
//                 </div>
//                 <div className="flex items-center space-x-2">
//                   <MessageCircle className="w-4 h-4 text-muted-foreground" />
//                   <span className="font-medium">{mockBlogData.comments} comments</span>
//                 </div>
//               </div>
//             </div>

//             <div className="space-y-2">
//               <Label className="text-sm font-medium text-muted-foreground">Category & Tags</Label>
//               <div className="space-y-2">
//                 <Badge variant="outline">{mockBlogData.category}</Badge>
//                 <div className="flex flex-wrap gap-1">
//                   {mockBlogData.tags.map((tag) => (
//                     <Badge key={tag} variant="secondary" className="text-xs">
//                       {tag}
//                     </Badge>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             <div className="space-y-2">
//               <Label className="text-sm font-medium text-muted-foreground">Published</Label>
//               <div className="flex items-center space-x-2">
//                 <Calendar className="w-4 h-4 text-muted-foreground" />
//                 <span className="font-medium">
//                   {mockBlogData.publishedAt ? new Date(mockBlogData.publishedAt).toLocaleDateString() : "Not published"}
//                 </span>
//               </div>
//             </div>

//             <div className="space-y-2">
//               <Label className="text-sm font-medium text-muted-foreground">Last Updated</Label>
//               <p className="font-medium">{new Date(mockBlogData.updatedAt).toLocaleDateString()}</p>
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//         {/* Author Information */}
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center space-x-2">
//               <User className="w-5 h-5" />
//               <span>Author Information</span>
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div className="flex items-center space-x-3">
//               <img
//                 src={mockBlogData.author.avatar || "/placeholder.svg"}
//                 alt={mockBlogData.author.name}
//                 className="w-12 h-12 rounded-full"
//               />
//               <div>
//                 <p className="font-medium">{mockBlogData.author.name}</p>
//                 <div className="flex items-center space-x-1 text-sm text-muted-foreground">
//                   <Mail className="w-3 h-3" />
//                   <span>{mockBlogData.author.email}</span>
//                 </div>
//               </div>
//             </div>

//             <Separator />

//             <div className="space-y-2">
//               <div className="flex justify-between">
//                 <span className="text-sm text-muted-foreground">Member Since</span>
//                 <span className="text-sm font-medium">
//                   {new Date(mockBlogData.author.joinedAt).toLocaleDateString()}
//                 </span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-sm text-muted-foreground">Total Posts</span>
//                 <span className="text-sm font-medium">{mockBlogData.author.totalPosts}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-sm text-muted-foreground">Total Views</span>
//                 <span className="text-sm font-medium">{mockBlogData.author.totalViews.toLocaleString()}</span>
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Flag Management */}
//         <Card className="lg:col-span-2">
//           <CardHeader>
//             <CardTitle className="flex items-center space-x-2">
//               <AlertTriangle className="w-5 h-5" />
//               <span>Content Moderation</span>
//             </CardTitle>
//             <CardDescription>Flag or unflag this post based on content policy violations.</CardDescription>
//           </CardHeader>
//           <CardContent>
//             {mockBlogData.isFlagged ? (
//               <div className="space-y-4">
//                 <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
//                   <div className="flex items-start space-x-2">
//                     <Flag className="w-5 h-5 text-red-600 mt-0.5" />
//                     <div className="flex-1">
//                       <h3 className="font-medium text-red-800">This post is currently flagged</h3>
//                       <p className="text-sm text-red-700 mt-1">
//                         <strong>Reason:</strong> {mockBlogData.flagReason}
//                       </p>
//                       <p className="text-xs text-red-600 mt-2">
//                         Flagged on {new Date(mockBlogData.flaggedAt!).toLocaleString()} by {mockBlogData.flaggedBy}
//                       </p>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="unflag-comment">Remove Flag (Optional Comment)</Label>
//                   <Textarea
//                     id="unflag-comment"
//                     placeholder="Add a comment about why the flag is being removed..."
//                     value={unflagComment}
//                     onChange={(e) => setUnflagComment(e.target.value)}
//                     rows={3}
//                   />
//                 </div>

//                 <Dialog>
//                   <DialogTrigger asChild>
//                     <Button variant="outline" className="w-full bg-transparent">
//                       <FlagOff className="w-4 h-4 mr-2" />
//                       Remove Flag
//                     </Button>
//                   </DialogTrigger>
//                   <DialogContent>
//                     <DialogHeader>
//                       <DialogTitle>Remove Flag</DialogTitle>
//                       <DialogDescription>
//                         Are you sure you want to remove the flag from this post? This will make it visible to all users
//                         again.
//                       </DialogDescription>
//                     </DialogHeader>
//                     <div className="flex justify-end space-x-2">
//                       <Button variant="outline">Cancel</Button>
//                       <Button onClick={handleUnflag} disabled={isProcessing}>
//                         {isProcessing ? "Processing..." : "Remove Flag"}
//                       </Button>
//                     </div>
//                   </DialogContent>
//                 </Dialog>
//               </div>
//             ) : (
//               <div className="space-y-4">
//                 <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
//                   <div className="flex items-center space-x-2">
//                     <CheckCircle className="w-5 h-5 text-green-600" />
//                     <span className="text-green-800 font-medium">This post is not flagged</span>
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="flag-reason">Flag Reason</Label>
//                   <Select value={flagReason} onValueChange={setFlagReason}>
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select a reason for flagging" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {flagReasons.map((reason) => (
//                         <SelectItem key={reason} value={reason}>
//                           {reason}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="flag-comment">Additional Comment</Label>
//                   <Textarea
//                     id="flag-comment"
//                     placeholder="Provide additional details about the flag..."
//                     value={flagComment}
//                     onChange={(e) => setFlagComment(e.target.value)}
//                     rows={3}
//                   />
//                 </div>

//                 <Dialog>
//                   <DialogTrigger asChild>
//                     <Button variant="destructive" className="w-full">
//                       <Flag className="w-4 h-4 mr-2" />
//                       Flag Post
//                     </Button>
//                   </DialogTrigger>
//                   <DialogContent>
//                     <DialogHeader>
//                       <DialogTitle>Flag Post</DialogTitle>
//                       <DialogDescription>
//                         Are you sure you want to flag this post? This will hide it from public view and notify the
//                         author.
//                       </DialogDescription>
//                     </DialogHeader>
//                     <div className="flex justify-end space-x-2">
//                       <Button variant="outline">Cancel</Button>
//                       <Button variant="destructive" onClick={handleFlag} disabled={isProcessing || !flagReason}>
//                         {isProcessing ? "Processing..." : "Flag Post"}
//                       </Button>
//                     </div>
//                   </DialogContent>
//                 </Dialog>
//               </div>
//             )}
//           </CardContent>
//         </Card>
//       </div>

//       {/* Blog Content */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Blog Content</CardTitle>
//           <CardDescription>Full content of the blog post for review</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: mockBlogData.content }} />
//         </CardContent>
//       </Card>

//       {/* Flag History */}
//       {mockBlogData.flagHistory.length > 0 && (
//         <Card>
//           <CardHeader>
//             <CardTitle>Flag History</CardTitle>
//             <CardDescription>Complete history of flags and moderation actions</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-4">
//               {mockBlogData.flagHistory.map((entry, index) => (
//                 <div key={index} className="flex items-start space-x-3 pb-4 border-b last:border-b-0">
//                   <div className="w-2 h-2 bg-red-600 rounded-full mt-2"></div>
//                   <div className="flex-1">
//                     <div className="flex items-center justify-between">
//                       <p className="font-medium capitalize text-red-800">{entry.action}</p>
//                       <p className="text-sm text-muted-foreground">{new Date(entry.timestamp).toLocaleString()}</p>
//                     </div>
//                     <p className="text-sm text-muted-foreground">By: {entry.reviewer}</p>
//                     <p className="text-sm mt-1 font-medium">{entry.reason}</p>
//                     {entry.comment && (
//                       <p className="text-sm mt-1 p-2 bg-red-50 rounded border border-red-200">{entry.comment}</p>
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </CardContent>
//         </Card>
//       )}
//     </div>
//   )
// }




















"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Flag,
  FlagOff,
  Eye,
  ThumbsUp,
  MessageCircle,
  Calendar,
  User,
  Mail,
  AlertTriangle,
  CheckCircle,
  Loader2,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { fetchBlogPostById, flagBlogAction, unflagBlogAction  } from "@/actions/blog/superAdmin"
import { BlogPost } from "@/app/type"
import { formatDate } from "@/lib/utils"
import { PostStatus } from "@prisma/client"
import Loader from "@/components/Loader"
import Image from "next/image"
import { parseMarkdown } from "@/shared/libs/markdown-parser"

interface BlogReviewProps {
  blogId: string
}

const flagReasons = [
  "Copyright infringement",
  "Inappropriate content",
  "Spam or misleading information",
  "Violation of community guidelines",
  "Plagiarism",
  "Offensive language",
  "Other",
]

export function BlogReview({ blogId }: BlogReviewProps) {
  const [flagReason, setFlagReason] = useState("")
  const [flagComment, setFlagComment] = useState("")
  const [unflagComment, setUnflagComment] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [blog, setBlog] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true)
        const res = await fetchBlogPostById(blogId)
        console.log(res, 'res blog')
        console.log(res.blog?.member?.email, 'email')
        if (res.error) {
          toast({
            title: "Error",
            description: res.error,
            variant: "destructive",
          })
        } else {
          setBlog(res.blog ?? null)
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch blog data",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchBlog()
  }, [blogId, toast])

  const handleFlag = async () => {
    if (!flagReason) {
      toast({
        title: "Flag Reason Required",
        description: "Please select a reason for flagging this post.",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)

    try {
      const result = await flagBlogAction(blogId, flagReason, flagComment)
      
      if (result.success) {
        toast({
          title: "Post Flagged",
          description: `Blog post has been flagged for: ${flagReason}`,
          variant: "destructive",
        })
        // Refresh the blog data
        const updatedBlog = await fetchBlogPostById(blogId)
        if (updatedBlog.blog) {
          setBlog(updatedBlog.blog)
        }
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to flag post",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to flag post",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleUnflag = async () => {
    setIsProcessing(true)

    try {
      const result = await unflagBlogAction(blogId, unflagComment)
      
      if (result.success) {
        toast({
          title: "Flag Removed",
          description: "The flag has been removed from this blog post.",
        })
        // Refresh the blog data
        const updatedBlog = await fetchBlogPostById(blogId)
        if (updatedBlog.blog) {
          setBlog(updatedBlog.blog)
        }
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to remove flag",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove flag",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const getStatusBadge = (status: PostStatus) => {
    const statusConfig = {
      PUBLISHED: {
        label: "Published",
        variant: "default" as const,
        className: "bg-green-100 text-green-800 border-green-200",
      },
      DRAFT: { 
        label: "Draft", 
        variant: "secondary" as const, 
        className: "bg-gray-100 text-gray-800 border-gray-200" 
      },
      SCHEDULED: {
        label: "Scheduled",
        variant: "outline" as const,
        className: "bg-blue-100 text-blue-800 border-blue-200",
      },
      ARCHIVED: {
        label: "Archived",
        variant: "outline" as const,
        className: "bg-yellow-100 text-yellow-800 border-yellow-200",
      },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.DRAFT

    return (
      <Badge variant={config.variant} className={config.className}>
        {config.label}
      </Badge>
    )
  }

  if (loading) {
    return (
     <Loader/>
    )
  }

  if (!blog) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <AlertTriangle className="w-12 h-12 text-destructive mb-4" />
        <h2 className="text-xl font-bold">Blog not found</h2>
        <p className="text-muted-foreground">The blog post with ID {blogId} could not be found.</p>
        <Link href="/xontrol/blog" className="mt-4">
          <Button variant="outline">← Back to Blog Management</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-8 mt-6">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <Link href="/xontrol/blog">
              <Button variant="outline" size="sm">
                ← Back to Blog Management
              </Button>
            </Link>
          </div>
          <h1 className="text-3xl font-bold">{blog.title}</h1>
          <p className="text-muted-foreground">Blog ID: {blog.id}</p>
        </div>

        <div className="flex items-center space-x-2">
          {getStatusBadge(blog.status)}
          {blog.isFlagged && (
            <Badge variant="destructive" className="flex items-center gap-1">
              <Flag className="w-3 h-3" />
              Flagged
            </Badge>
          )}
        </div>
      </div>

      {/* Post Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Post Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">Performance</Label>
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <Eye className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">{blog.views.toLocaleString()} views</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ThumbsUp className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">{blog.likes} likes</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MessageCircle className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">{blog.comments.length} comments</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">Category & Tags</Label>
              <div className="space-y-2">
                <Badge variant="outline">{blog?.category?.name || ''}</Badge>
                <div className="flex flex-wrap gap-1">
                  {blog.tags.map((tag) => (
                    <Badge key={tag.id} variant="secondary" className="text-xs">
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">Published</Label>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium">
                  {blog.publishedAt ? formatDate(blog.publishedAt): "Not published"}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">Last Updated</Label>
              <p className="font-medium">{formatDate(blog.updatedAt)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Author Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="w-5 h-5" />
              <span>Author Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
             <div className=" relative  w-12 h-12">
               <Image
                fill
                unoptimized
                src={blog.member?.imageUrl  || '/2logo.jpg'}
                alt={blog.member?.email || " author's image"}
                className=" rounded-full absolute object-cover "
              />
             </div>
              <div>
                <p className="font-medium">{blog.author}</p>
                <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                  <Mail className="w-3 h-3" />
                  <span>{blog.member?.email}</span>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Member Since</span>
                <span className="text-sm font-medium">
                  {formatDate (blog.member?.createdAt)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Author Bio</span>
                <span className="text-sm font-medium">{blog.authorBio}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Total Views</span>
                <span className="text-sm font-medium">{blog.authorTitle}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Flag Management */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5" />
              <span>Content Moderation</span>
            </CardTitle>
            <CardDescription>Flag or unflag this post based on content policy violations.</CardDescription>
          </CardHeader>
          <CardContent>
            {blog.isFlagged ? (
              <div className="space-y-4">
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <Flag className="w-5 h-5 text-red-600 mt-0.5" />
                    <div className="flex-1">
                      <h3 className="font-medium text-red-800">This post is currently flagged</h3>
                      <p className="text-sm text-red-700 mt-1">
                        <strong>Reason:</strong> {blog.flagReason}
                      </p>
                    <p className="text-xs text-red-600 mt-2">
                      {blog.isFlagged && blog.flaggedPosts.length > 0
                        ? `Flagged on ${new Date(blog.flaggedPosts[0].createdAt).toLocaleString()} by TheNews Team}`
                        : "Unknown date"}
                    </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="unflag-comment">Remove Flag (Optional Comment)</Label>
                  <Textarea
                    id="unflag-comment"
                    placeholder="Add a comment about why the flag is being removed..."
                    value={unflagComment}
                    onChange={(e) => setUnflagComment(e.target.value)}
                    rows={3}
                  />
                </div>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full bg-transparent">
                      <FlagOff className="w-4 h-4 mr-2" />
                      Remove Flag
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Remove Flag</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to remove the flag from this post? This will make it visible to all users
                        again.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline">Cancel</Button>
                      <Button onClick={handleUnflag} disabled={isProcessing}>
                        {isProcessing ? "Processing..." : "Remove Flag"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-green-800 font-medium">This post is not flagged</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="flag-reason">Flag Reason</Label>
                  <Select value={flagReason} onValueChange={setFlagReason}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a reason for flagging" />
                    </SelectTrigger>
                    <SelectContent>
                      {flagReasons.map((reason) => (
                        <SelectItem key={reason} value={reason}>
                          {reason}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="flag-comment">Additional Comment</Label>
                  <Textarea
                    id="flag-comment"
                    placeholder="Provide additional details about the flag..."
                    value={flagComment}
                    onChange={(e) => setFlagComment(e.target.value)}
                    rows={3}
                  />
                </div>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="destructive" className="w-full">
                      <Flag className="w-4 h-4 mr-2" />
                      Flag Post
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Flag Post</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to flag this post? This will hide it from public view and notify the
                        author.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline">Cancel</Button>
                      <Button variant="destructive" onClick={handleFlag} disabled={isProcessing || !flagReason}>
                        {isProcessing ? "Processing..." : "Flag Post"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Blog Content */}
      <Card>
        <CardHeader>
          <CardTitle>Blog Content</CardTitle>
          <CardDescription>Full content of the blog post for review</CardDescription>
        </CardHeader>
        <CardContent>
           <div
                          className="prose prose-lg max-w-none"
                          dangerouslySetInnerHTML={{
                            __html: parseMarkdown(blog.content.substring(0, 1000) + "..."),
                          }}
                        />
                          <Link href={`/blog/${blog.slug}`} target="_blank" className=" ">
                    <Button>
                      Read Full Blog
                    </Button>
                </Link>
        </CardContent>
              
      </Card>

      {/* Flag History */}
      {blog.flaggedPosts && blog.flaggedPosts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Flag History</CardTitle>
            <CardDescription>Complete history of flags and moderation actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {blog.flaggedPosts.map((entry, index) => (
                <div key={index} className="flex items-start space-x-3 pb-4 border-b last:border-b-0">
                  <div className="w-2 h-2 bg-red-600 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium capitalize text-red-800">{entry.status}</p>
                      <p className="text-sm text-muted-foreground">{new Date(entry.createdAt).toLocaleString()}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">By: {entry.userId}</p>
                    <p className="text-sm mt-1 font-medium">{entry.reason}</p>
                    {entry.comment && (
                      <p className="text-sm mt-1 p-2 bg-red-50 rounded border border-red-200 capitalize">{entry.comment}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
