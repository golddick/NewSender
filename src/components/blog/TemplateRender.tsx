// "use client"

// import { useEffect } from "react"
// import { ClassicTemplate } from "./templates/ClassicTemplate"
// import { ModernTemplate } from "./templates/ModernTemplate"


// interface BlogContent {
//   id: string
//   title: string
//   content: string
//   excerpt: string
//   featuredImage: string
//   author: {
//     name: string
//     avatar: string
//     bio: string
//   }
//   publishedAt: string
//   readTime: string
//   views: number
//   likes: number
//   category: string
//   tags: string[]
// }

// interface TemplateConfig {
//   primaryColor?: string
//   secondaryColor?: string
//   fontFamily?: string
//   showAuthorBio?: boolean
//   showSocialShare?: boolean
//   showReadingProgress?: boolean
//   headerStyle?: string
//   contentWidth?: "narrow" | "medium" | "wide"
//   typography?: "serif" | "sans-serif"
//   [key: string]: any
// }

// interface TemplateRendererProps {
//   templateId: string
//   content: BlogContent
//   config?: TemplateConfig
//   userId?: string
//   websiteUrl?: string
//   trackUsage?: boolean
// }

// export function TemplateRenderer({
//   templateId,
//   content,
//   config,
//   userId,
//   websiteUrl,
//   trackUsage = false,
// }: TemplateRendererProps) {
//   // Track template usage if enabled
//   useEffect(() => {
//     if (trackUsage && userId && websiteUrl) {
//       trackTemplateUsage()
//     }
//   }, [templateId, userId, websiteUrl, trackUsage])

//   const trackTemplateUsage = async () => {
//     try {
//       await fetch("/api/usage/templates", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           userId,
//           templateId,
//           websiteUrl,
//           customConfig: config,
//         }),
//       })
//     } catch (error) {
//       console.error("Error tracking template usage:", error)
//     }
//   }

//   const renderTemplate = () => {
//     switch (templateId) {
//       case "modern":
//         return <ModernTemplate content={content} config={config} />
//       case "classic":
//         return <ClassicTemplate content={content} config={config} />
//       default:
//         // Fallback to modern template
//         return <ModernTemplate content={content} config={config} />
//     }
//   }

//   return <div className="template-renderer">{renderTemplate()}</div>
// }
