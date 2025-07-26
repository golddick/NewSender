import React from 'react'
import { BlogPostReader } from './Read-Blog'
import { BlogPostReaderProps } from '@/app/type'


// interface BlogPostReaderProps {
//   // slug: string
//   post: any
//   relatedPosts?: any[] | null
// }


const Read = ({ post, relatedPosts}:BlogPostReaderProps) => {

  console.log(post, 'post from Read component')

  return (
    <div>
      <BlogPostReader 
      // slug={slug} 
      post={post} 
      relatedPosts={relatedPosts || []}
      />
    </div>
  )
}

export default Read
