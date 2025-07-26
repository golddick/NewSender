



"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BlogCard } from "./BlogCard"
import { Search } from "lucide-react"
import Link from "next/link"
import { ICONS } from "@/shared/utils/icons"
import { useUser } from "@clerk/nextjs" // get current user
import { getAllCategories, getFilteredPosts } from "@/lib/sharedApi/actions"
import Loader from "@/components/Loader"


export function BlogList() {
  const { user } = useUser()
  const [posts, setPosts] = useState<any>([])
  const [categories, setCategories] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [category, setCategory] = useState("all")
  const [sortBy, setSortBy] = useState("publishedAt")

  useEffect(() => {
    async function fetchData() {
      if (!user?.id) return
      const [postData, categoryData] = await Promise.all([
        getFilteredPosts({ authorId: user.id, category: category !== "all" ? category : undefined, search: searchQuery, sort: sortBy, order: "desc" }),
        getAllCategories()
      ])
      setPosts(postData)
      setCategories(["all", ...categoryData.map((c) => c.slug)])
    }

    fetchData()
  }, [user?.id, searchQuery, category, sortBy])

  console.log(categories, 'categories')
  console.log(posts, 'posts')

if (posts.length === 0 && categories.length === 0) {
  return <Loader />;
}


  return (
    <div className="w-full px-4 py-12">
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4 mb-6 items-center">
          <div className="relative flex-grow ">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search articles..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-4 items-center">
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="publishedAt">Newest First</SelectItem>
                <SelectItem value="createdAt">Created At</SelectItem>
                <SelectItem value="title">Title</SelectItem>
              </SelectContent>
            </Select>
            <Link href="/dashboard/blog/write">
              <Button className="w-fit px-3 border rounded-lg flex items-center">
                <span className="text-sm">Write Blog</span>
                <span className="ml-1">{ICONS.link}</span>
              </Button>
            </Link>
          </div>
        </div>

        <Tabs defaultValue="grid" className="w-full">
          <div className="flex justify-end mb-6">
            <TabsList>
              <TabsTrigger value="grid">Grid</TabsTrigger>
              <TabsTrigger value="list">List</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="grid">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {posts.map((post: any) => (
                <BlogCard key={post.id} post={post} layout="grid" />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="list">
            <div className="space-y-6">
              {posts.map((post: any) => (
                <BlogCard key={post.id} post={post} layout="list" />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {posts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-lg text-neutral-600">No blog posts found matching your criteria.</p>
          <Button
            variant="link"
            className="text-amber-500 hover:text-amber-600 mt-2"
            onClick={() => {
              setSearchQuery("")
              setCategory("all")
            }}
          >
            Clear filters
          </Button>
        </div>
      )}
    </div>
  )
}
