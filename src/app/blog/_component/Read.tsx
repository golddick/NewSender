import React from 'react'
import { BlogPostReader } from './Read-Blog'
import { BlogPostReaderProps } from '@/app/type'




const Read = ({ post, relatedPosts}:BlogPostReaderProps) => {

  console.log(post, 'post from Read component')

  return (
    <div>
      <BlogPostReader 
      post={post} 
      relatedPosts={relatedPosts || []}
      />
    </div>
  )
}

export default Read
