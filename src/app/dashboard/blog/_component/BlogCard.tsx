"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Clock, Calendar, ArrowRight } from "lucide-react"
import { format } from 'date-fns';
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { formatString } from "@/lib/utils";

interface Membership {
  userId: string;
  email: string;
  fullName: string;
  userName: string ;
  imageUrl: string ;
}



interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface BlogPost {
  id: string
  title: string
  slug: string;
  excerpt: string
  featuredImage: string
  category: Category | null;
  author: string
  authorAvatar: string
  createdAt: Date
  readTime: string
  tags: string[]
  membership: Membership
}

interface BlogCardProps {
  post: BlogPost
  layout: "grid" | "list"
}

export function BlogCard({ post, layout }: BlogCardProps) {
  if (layout === "grid") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow border border-neutral-100 h-full flex flex-col"
      >
        <Link href={`/dashboard/blog/${post.slug}`} className="block">
        <div className=" relative w-full h-40">
            <Image src={post.featuredImage || '/logo.jpg' } fill alt={post.title} className=" absolute object-cover" />
        </div>
          
        </Link>
        <div className="p-6 flex-grow flex flex-col">
          <div className="mb-3">
            <Badge className="bg-gold-500 hover:bg-amber-600">{post.category?.name}</Badge>
          </div>
          <Link href={`/dashboard/blog/${post.slug}`} className="block group">
            <h3 className="text-xl font-bold mb-2 text-black group-hover:text-amber-500 transition-colors capitalize">
              {formatString(post.title)}
            </h3>
          </Link>
          <p className="text-neutral-600 mb-4 flex-grow">{post.excerpt}</p>
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center">
              <div className=" w-8 h-8  relative">
                <Image
                src={post.membership.imageUrl }
                alt={post.membership.userName}
                fill
                className="rounded-full mr-2 absolute object-cover"
              />
                </div>
              <span className="text-sm text-neutral-600 ml-2 capitalize">{post.membership.fullName}</span>
            </div>
            <div className="flex items-center text-sm text-neutral-500">
              <Clock className="h-3 w-3 mr-1" />
              {post.readTime} min read
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-neutral-100">
            <Link href={`/dashboard/blog/${post.slug}`}>
              <Button variant="link" className="text-gold-500 hover:text-amber-600 p-0 h-auto font-medium">
                Read Article
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow border border-neutral-100"
    >
      <div className="flex flex-col md:flex-row">
        <Link href={`/dashboard/blog/${post.slug}`} className="block md:w-1/3">
        <div className=" w-full h-48 md:h-full relative">
            <Image
            fill
            src={post.featuredImage || "/placeholder.svg"}
            alt={post.title}
            className=" object-cover absolute"
          />
        </div>
          
        </Link>
        <div className="p-6 md:w-2/3">
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <Badge className="bg-gold-500 hover:bg-amber-600 capitalize">{post.category?.name}</Badge>
            <div className="flex items-center text-sm text-neutral-500">
              <Calendar className="h-3 w-3 mr-1" />
              {format(new Date(post.createdAt), 'PPP')}
            </div>
            <div className="flex items-center text-sm text-neutral-500">
              <Clock className="h-3 w-3 mr-1" />
              {post.readTime} min read
            </div>
          </div>
          <Link href={`/dashboard/blog/${post.slug}`} className="block group">
            <h3 className="text-2xl font-bold mb-2 text-black group-hover:text-amber-500 transition-colors">
              {formatString(post.title)}
            </h3>
          </Link>
          <p className="text-neutral-600 mb-4">{post.excerpt}</p>
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center">
                <div className=" w-8 h-8  relative">
                <Image
                src={post.membership.imageUrl }
                alt={post.membership.userName}
                fill
                className="rounded-full mr-2 absolute object-cover"
              />
                </div>
            
              <span className="text-sm text-neutral-600 ml-2 capitalize">{post.membership.fullName}</span>
            </div>
            <Link href={`/dashboard/blog/${post.slug}`}>
              <Button variant="link" className="text-gold-600 hover:text-amber-600 p-0 h-auto font-medium">
                Read Article
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
