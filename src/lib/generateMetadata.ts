// lib/generateMetadata.ts
interface BlogMetadata {
  title: string;
  description: string;
  url: string;
  imageUrl: string;
  author: string;
  publishedTime: string;
  tags: string[];
}

export function generateBlogMetadata({
  title,
  description,
  url,
  imageUrl,
  author,
  publishedTime,
  tags = [],
}: Partial<BlogMetadata>): BlogMetadata {
  return {
    title: title || "Blog Post",
    description: description || "Read this interesting blog post",
    url: url || "",
    imageUrl: imageUrl || "/default-social-image.png",
    author: author || "Unknown Author",
    publishedTime: publishedTime || new Date().toISOString(),
    tags: tags || [],
  };
}