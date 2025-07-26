
// import Header from "@/shared/widgets/header"
// import { notFound } from "next/navigation"
// import Read from "../_component/Read"
// import { getBlogPost, getRelatedPosts } from "@/actions/blog/get.blog"

// interface BlogPostPageProps {

//     slug: string
// }

// export default async function BlogPostPage({ slug }: BlogPostPageProps) {
//   // Fetch the main blog post
//   const post = await getBlogPost(slug)

//   console.log(post, 'post'  )
//   console.log(slug, 'slug post'  )


//   if (!post.success || !post.data) {
//     return notFound()
//   }

//   // Fetch related posts
//   let relatedPosts = null
//   if (post.data) {
//     const related = await getRelatedPosts(post.data.id)
//     console.log(related.data, 'related'  )
//     if (related.success) {
//       relatedPosts = related.data
//     }
//   }

//     return (
//     <div>
//       <Header />

//       <Read
//       post={post} 
//       relatedPosts={relatedPosts || []}
//        />
//     </div>
//   )

// }


'use client';

import { useEffect, useState } from 'react';
import { notFound, useRouter } from 'next/navigation';
import { getBlogPost, getRelatedPosts } from '@/actions/blog/get.blog';
import Read from '@/app/blog/_component/Read';
import Loader from '@/components/Loader';
import Header from '@/shared/widgets/header';

interface BlogPostPageProps {

    slug: string;

}

interface PostData {
  id: string;
  title: string;
  content: string;
  // ... other post fields
}

export default function BlogPostPage({ slug }: BlogPostPageProps) {
  const router = useRouter();
  const [post, setPost] = useState<any | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch main blog post
        const postResponse = await getBlogPost(slug);

        console.log('postResponse:', postResponse);
        
        if (!postResponse.success || !postResponse.data) {
          setError('Post not found');
          return;
        }
        
        setPost(postResponse.data);
        
        // Fetch related posts if main post exists
        if (postResponse.data) {
          const relatedResponse = await getRelatedPosts(postResponse.data.id);
          if (relatedResponse.success && relatedResponse.data) {
            setRelatedPosts(relatedResponse.data);
          }
        }
      } catch (err) {
        setError('Failed to load post');
        console.error('Error fetching post:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  if (error) {
    return notFound();
  }

  if (loading || !post) {
    return <Loader />;
  }

  return (
    <div>
    <Header />
      <Read 
        post={post} 
        relatedPosts={relatedPosts} 
      />
    </div>
  );
}