// "use client"

// import { motion, useInView } from "framer-motion"
// import { useRef, useState } from "react"
// import Image from "next/image"
// import Link from "next/link"
// import { Calendar, Clock, ChevronRight, ChevronLeft } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// export function BlogList() {
//   const ref = useRef(null)
//   const isInView = useInView(ref, { once: true, amount: 0.1 })
//   const [currentPage, setCurrentPage] = useState(1)

//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.1,
//       },
//     },
//   }

//   const itemVariants = {
//     hidden: { y: 20, opacity: 0 },
//     visible: {
//       y: 0,
//       opacity: 1,
//       transition: {
//         type: "spring",
//         stiffness: 100,
//         damping: 10,
//       },
//     },
//   }

//   const blogPosts = [
//     {
//       title: "Email Automation Workflows That Save You 10+ Hours Every Week",
//       excerpt:
//         "Set up these five automation workflows to nurture leads, onboard new subscribers, and re-engage inactive users without lifting a finger.",
//       date: "April 10, 2024",
//       readTime: "9 min read",
//       category: "Automation",
//       image: "/gnb.png",
//       author: {
//         name: "Sarah Johnson",
//         avatar: "/2logo.jpg",
//       },
//     },
//     {
//       title: "GDPR and Email Marketing: What You Need to Know in 2024",
//       excerpt:
//         "Stay compliant with the latest privacy regulations while still creating effective email campaigns that convert.",
//       date: "April 5, 2024",
//       readTime: "7 min read",
//       category: "Compliance",
//       image: "/placeholder.svg?height=300&width=500",
//       author: {
//         name: "Michael Chen",
//         avatar: "/placeholder.svg?height=40&width=40",
//       },
//     },
//     {
//       title: "The Psychology of Subject Lines: Words That Get Emails Opened",
//       excerpt:
//         "Learn the psychological triggers that make subscribers curious enough to open your emails and how to apply them ethically.",
//       date: "March 28, 2024",
//       readTime: "6 min read",
//       category: "Copywriting",
//       image: "/placeholder.svg?height=300&width=500",
//       author: {
//         name: "Emily Rodriguez",
//         avatar: "/placeholder.svg?height=40&width=40",
//       },
//     },
//     {
//       title: "How to Create a Content Calendar for Your Newsletter",
//       excerpt:
//         "A step-by-step guide to planning your newsletter content months in advance to ensure consistency and quality.",
//       date: "March 22, 2024",
//       readTime: "8 min read",
//       category: "Strategy",
//       image: "/placeholder.svg?height=300&width=500",
//       author: {
//         name: "David Kim",
//         avatar: "/placeholder.svg?height=40&width=40",
//       },
//     },
//     {
//       title: "A/B Testing for Newsletters: Beyond Subject Lines",
//       excerpt:
//         "Discover advanced A/B testing strategies that go beyond subject lines to optimize every element of your newsletters.",
//       date: "March 15, 2024",
//       readTime: "11 min read",
//       category: "Analytics",
//       image: "/placeholder.svg?height=300&width=500",
//       author: {
//         name: "Olivia Martinez",
//         avatar: "/placeholder.svg?height=40&width=40",
//       },
//     },
//   ]

//   return (
//     <motion.div
//       ref={ref}
//       variants={containerVariants}
//       initial="hidden"
//       animate={isInView ? "visible" : "hidden"}
//       className="space-y-8"
//     >
//       <motion.div
//         variants={itemVariants}
//         className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
//       >
//         <h2 className="text-2xl font-bold font-heading">Latest Articles</h2>
//         <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
//           <div className="relative w-full sm:w-64">
//             <Input
//               type="search"
//               placeholder="Search articles..."
//               className="w-full border-neutral-200 focus-visible:ring-gold-500"
//             />
//           </div>
//           <Select defaultValue="all">
//             <SelectTrigger className="w-full sm:w-40 border-neutral-200 focus:ring-gold-500">
//               <SelectValue placeholder="Category" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="all">All Categories</SelectItem>
//               <SelectItem value="strategy">Strategy</SelectItem>
//               <SelectItem value="design">Design</SelectItem>
//               <SelectItem value="automation">Automation</SelectItem>
//               <SelectItem value="analytics">Analytics</SelectItem>
//               <SelectItem value="compliance">Compliance</SelectItem>
//               <SelectItem value="copywriting">Copywriting</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>
//       </motion.div>

//       <div className="space-y-8">
//         {blogPosts.map((post, index) => (
//           <motion.article
//             key={index}
//             variants={itemVariants}
//             className="border-b border-neutral-100 pb-8 last:border-0"
//           >
//             <div className="grid md:grid-cols-3 gap-6">
//               <div className="md:col-span-1">
//                 <Link href={`/blog/${post.title.toLowerCase().replace(/\s+/g, "-")}`} className="block">
//                   <div className="relative overflow-hidden rounded-lg aspect-[4/3]">
//                     <Image
//                       src={post.image || "/placeholder.svg"}
//                       alt={post.title}
//                       width={500}
//                       height={300}
//                       className="object-cover w-full h-full transition-transform duration-500 hover:scale-105 border shadow-md"
//                     />
//                     <div className="absolute top-3 left-3 bg-gold-500 text-dark-900 text-xs font-bold px-2 py-0.5 rounded-full">
//                       {post.category}
//                     </div>
//                   </div>
//                 </Link>
//               </div>
//               <div className="md:col-span-2">
//                 <div className="flex items-center gap-4 text-sm text-neutral-500 mb-2">
//                   <div className="flex items-center gap-2">
//                     <Image
//                       src={post.author.avatar || "/placeholder.svg"}
//                       alt={post.author.name}
//                       width={24}
//                       height={24}
//                       className="rounded-full"
//                     />
//                     <span>{post.author.name}</span>
//                   </div>
//                   <div className="flex items-center gap-1">
//                     <Calendar className="h-4 w-4" />
//                     <span>{post.date}</span>
//                   </div>
//                   <div className="flex items-center gap-1">
//                     <Clock className="h-4 w-4" />
//                     <span>{post.readTime}</span>
//                   </div>
//                 </div>
//                 <h3 className="text-xl font-bold mb-2 hover:text-gold-600 transition-colors">
//                   <Link href={`/blog/${post.title.toLowerCase().replace(/\s+/g, "-")}`}>{post.title}</Link>
//                 </h3>
//                 <p className="text-neutral-600 mb-4">{post.excerpt}</p>
//                 <Button variant="link" asChild className="text-gold-600 hover:text-gold-700 p-0 h-auto font-medium">
//                   <Link href={`/blog/${post.title.toLowerCase().replace(/\s+/g, "-")}`}>
//                     Read More <ChevronRight className="h-4 w-4 ml-1" />
//                   </Link>
//                 </Button>
//               </div>
//             </div>
//           </motion.article>
//         ))}
//       </div>

//       <motion.div variants={itemVariants} className="flex justify-center mt-8">
//         <div className="flex items-center gap-2">
//           <Button
//             variant="outline"
//             size="icon"
//             className="h-9 w-9 border-neutral-200"
//             onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
//             disabled={currentPage === 1}
//           >
//             <ChevronLeft className="h-4 w-4" />
//             <span className="sr-only">Previous page</span>
//           </Button>
//           {[1, 2, 3].map((page) => (
//             <Button
//               key={page}
//               variant={currentPage === page ? "default" : "outline"}
//               className={`h-9 w-9 ${currentPage === page ? "bg-gold-500 hover:bg-gold-600" : "border-neutral-200"}`}
//               onClick={() => setCurrentPage(page)}
//             >
//               {page}
//             </Button>
//           ))}
//           <Button
//             variant="outline"
//             size="icon"
//             className="h-9 w-9 border-neutral-200"
//             onClick={() => setCurrentPage(Math.min(3, currentPage + 1))}
//             disabled={currentPage === 3}
//           >
//             <ChevronRight className="h-4 w-4" />
//             <span className="sr-only">Next page</span>
//           </Button>
//         </div>
//       </motion.div>
//     </motion.div>
//   )
// }








"use client"

import { motion, useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Calendar, Clock, ChevronRight, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getBlogCategories, getBlogPosts } from "@/actions/blog/get.blog"


type BlogPost = {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  format: 'MARKDOWN' | 'HTML';
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  visibility: 'PUBLIC' | 'PRIVATE' | 'MEMBERS_ONLY';
  featuredImage?: string | null;
  isFeatured: boolean;
  isPinned: boolean;
  allowComments: boolean;
  wordCount: number;
  characterCount: number;
  readTime: number;
  views: number;
  likes: number;
  seoTitle?: string | null;
  seoDescription?: string | null;
  seoKeywords: string[];
  publishedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  category?: {
    id: string;
    name: string;
    slug: string;
    description?: string | null;
  } | null;
  tags: {
    id: string;
    name: string;
    slug: string;
  }[];
  membership: {
    id: string;
    userId: string;
    email: string;
    fullName: string;
    userName?: string | null;
    imageUrl?: string | null;
  };
};

export function BlogList() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
 const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<{name: string, slug: string}[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(true)

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

  // Fetch categories on initial load
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoriesResponse = await getBlogCategories()
        console.log(categoriesResponse, 'category data')
        if (categoriesResponse.success) {
          setCategories(categoriesResponse.data || [])
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error)
      }
    }
    loadCategories()
  }, [])

  // Fetch blog posts when filters change
  useEffect(() => {
    const loadBlogPosts = async () => {
      setIsLoading(true)
      try {
        const postsResponse = await getBlogPosts({
          page: currentPage,
          limit: 5,
          search: searchTerm,
          category: selectedCategory !== "all" ? selectedCategory : undefined
        })

        console.log(postsResponse, 'post data')

        if (postsResponse.success) {
          console.log(postsResponse.data, 'blog post data')
          setBlogPosts(postsResponse.data as BlogPost[] || []);
        setTotalPages(postsResponse.pagination?.totalPages || 1);
        }
      } catch (error) {
        console.error("Failed to fetch blog posts:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadBlogPosts()
  }, [currentPage, searchTerm, selectedCategory])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className="space-y-8"
    >
      <motion.div
        variants={itemVariants}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <h2 className="text-2xl font-bold font-heading">Latest Articles</h2>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Input
              type="search"
              placeholder="Search articles..."
              className="w-full border-neutral-200 focus-visible:ring-gold-500"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1)
              }}
            />
          </div>
          <Select 
            value={selectedCategory}
            onValueChange={(value) => {
              setSelectedCategory(value)
              setCurrentPage(1)
            }}
          >
            <SelectTrigger className="w-full sm:w-40 border-neutral-200 focus:ring-gold-500">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem 
                  key={category.slug} 
                  value={category.slug}
                >
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      {isLoading ? (
        <div className="space-y-8">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="border-b border-neutral-100 pb-8">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-1 bg-neutral-100 rounded-lg aspect-[4/3] animate-pulse"></div>
                <div className="md:col-span-2 space-y-3">
                  <div className="h-4 bg-neutral-100 rounded w-3/4 animate-pulse"></div>
                  <div className="h-4 bg-neutral-100 rounded w-full animate-pulse"></div>
                  <div className="h-4 bg-neutral-100 rounded w-5/6 animate-pulse"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : blogPosts.length === 0 ? (
        <motion.div variants={itemVariants} className="text-center py-12">
          <p className="text-neutral-500">No articles found matching your criteria.</p>
        </motion.div>
      ) : (
        <div className="space-y-8">
          {blogPosts.map((post) => (
            <motion.article
              key={post.id}
              variants={itemVariants}
              className="border-b border-neutral-100 pb-8 last:border-0"
            >
              <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                  <Link href={`/blog/${post.slug}`} className="block">
                    <div className="relative overflow-hidden rounded-lg aspect-[4/3]">
                      <Image
                        src={post.featuredImage || "/placeholder.svg"}
                        alt={post.title}
                        width={500}
                        height={300}
                        className="object-cover w-full h-full transition-transform duration-500 hover:scale-105 border shadow-md"
                      />
                      {post.category && (
                        <div className="absolute top-3 left-3 bg-gold-500 text-dark-900 text-xs font-bold px-2 py-0.5 rounded-full">
                          {post.category.name}
                        </div>
                      )}
                    </div>
                  </Link>
                </div>
                <div className="md:col-span-2">
                  <div className="flex items-center gap-4 text-sm text-neutral-500 mb-2">
                    <div className="flex items-center gap-2">
                      <Image
                        src={post.membership?.imageUrl || "/logo.jpg"}
                        alt={post.membership?.userName || "Author"}
                        width={24}
                        height={24}
                        className="rounded-full"
                      />
                      <span>{post.membership?.fullName || "Unknown Author"}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {/* <span>{post.publishedAt ? formatDate(post.publishedAt) : "Draft"}</span> */}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{post.readTime || 0} min read</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-2 hover:text-gold-600 transition-colors">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h3>
                  <p className="text-neutral-600 mb-4">{post.excerpt}</p>
                  <Button variant="link" asChild className="text-gold-600 hover:text-gold-700 p-0 h-auto font-medium">
                    <Link href={`/blog/${post.slug}`}>
                      Read More <ChevronRight className="h-4 w-4 ml-1" />
                    </Link>
                  </Button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <motion.div variants={itemVariants} className="flex justify-center mt-8">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 border-neutral-200"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1 || isLoading}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous page</span>
            </Button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum
              if (totalPages <= 5) {
                pageNum = i + 1
              } else if (currentPage <= 3) {
                pageNum = i + 1
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i
              } else {
                pageNum = currentPage - 2 + i
              }
              
              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "default" : "outline"}
                  className={`h-9 w-9 ${currentPage === pageNum ? "bg-gold-500 hover:bg-gold-600" : "border-neutral-200"}`}
                  onClick={() => setCurrentPage(pageNum)}
                  disabled={isLoading}
                >
                  {pageNum}
                </Button>
              )
            })}
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 border-neutral-200"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages || isLoading}
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next page</span>
            </Button>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}