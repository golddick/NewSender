


// "use client";

// import { useState, useRef, useEffect } from "react";
// import { motion } from "framer-motion";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Label } from "@/components/ui/label";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Switch } from "@/components/ui/switch";
// import { Badge } from "@/components/ui/badge";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Separator } from "@/components/ui/separator";
// import { useToast } from "@/hooks/use-toast";
// import {
//   Eye,
//   Save,
//   Settings,
//   Link as LinkIcon,
//   Info,
//   Clock,
//   Calendar,
//   X,
//   Plus,
//   Bold,
//   Italic,
//   Quote,
//   Code,
//   Heading1,
//   Heading2,
//   FileText,
//   TrendingUp,
//   Sparkles,
//   BookOpen,
//   PenTool,
//   Lightbulb,
//   CheckCircle,
//   AlertCircle,
//   Globe,
//   Lock,
//   Users,
//   HelpCircle,
//   ImageIcon,
//   Loader2,
//   ArrowLeft,
//   Video,
//   Film,
//   ImagePlus,
//   Bot,
//   Wand2,
//   Hash,
// } from "lucide-react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { createBlogPost } from "@/actions/blog/add.blog";
// import { useUser } from "@clerk/nextjs";
// import Image from "next/image";
// import { UploadButton } from "@/shared/utils/uploadthing";
// import { parseMarkdown } from "@/shared/libs/markdown-parser";
// import Link from "next/link";
// import { getBlogPost, updateBlogPost, updateGalleryImages } from "@/actions/blog/get.blog";
// import { BlogPost } from "@/app/type";
// import { PostStatus } from "@prisma/client";

// interface SEOAnalysis {
//   score: number;
//   issues: string[];
//   suggestions: string[];
// }

// const getTopicKeywords = (category: string) => {
//   // Common keywords for all categories
//   const commonKeywords = [
//     "how to", "guide", "tips", "best practices", "benefits", 
//     "advantages", "examples", "case study", "why", "what is", 
//     "comparison", "vs", "versus", "ultimate guide", "step by step"
//   ];
  
//   // Category-specific keywords
//   const categoryKeywords: Record<string, string[]> = {
//     "technology": [
//       "tech", "innovation", "digital", "future", "trends",
//       "software", "hardware", "gadgets", "devices", "internet",
//       "cybersecurity", "cloud computing", "blockchain", "IoT"
//     ],
//     "artificial intelligence": [
//       "AI", "machine learning", "deep learning", "neural networks",
//       "natural language processing", "computer vision", "robotics",
//       "automation", "chatbots", "generative AI"
//     ],
//     "business": [
//       "entrepreneur", "startup", "marketing", "strategy", "growth",
//       "leadership", "management", "finance", "investment", "ecommerce",
//       "sales", "productivity", "remote work"
//     ],
//     "health": [
//       "wellness", "fitness", "nutrition", "medical", "doctor",
//       "exercise", "diet", "mental health", "sleep", "recovery",
//       "prevention", "holistic", "alternative medicine"
//     ],
//     "food": [
//       "recipe", "cooking", "restaurant", "nutrition", "diet",
//       "healthy eating", "meal prep", "ingredients", "cuisine",
//       "baking", "vegan", "vegetarian", "gluten-free"
//     ],
//     "travel": [
//       "destination", "itinerary", "adventure", "budget travel",
//       "luxury travel", "backpacking", "hotels", "airbnb",
//       "sightseeing", "local culture", "travel tips"
//     ],
//     "education": [
//       "learning", "teaching", "online courses", "study tips",
//       "career development", "skills", "certification", "degree",
//       "student life", "e-learning", "homeschooling"
//     ]
//   };

//    // Convert category to lowercase for case-insensitive matching
//   const normalizedCategory = category.toLowerCase();

//   return [
//     ...commonKeywords,
//     ...(categoryKeywords[normalizedCategory] || [])
//   ];
// };

// const analyzeSEO = (title: string, content: string, excerpt: string, tags: string[], category: string) => {
//   let score = 0;
//   const issues: string[] = [];
//   const suggestions: string[] = [];

//   // Title analysis
//   if (title.length >= 30 && title.length <= 60) {
//     score += 20;
//   } else if (title.length > 60) {
//     issues.push("Title too long (over 60 characters)");
//     suggestions.push("Shorten title to under 60 characters for better SEO");
//   } else if (title.length < 30) {
//     issues.push("Title too short (under 30 characters)");
//     suggestions.push("Expand title to 30-60 characters for optimal SEO");
//   }

//   // Content length analysis
//   const wordCount = content.trim().split(/\s+/).length;
//   if (wordCount >= 1500) {
//     score += 25;
//   } else if (wordCount >= 800) {
//     score += 15;
//     suggestions.push("Consider expanding content to 1500+ words for better SEO ranking");
//   } else {
//     issues.push("Content too short (under 800 words)");
//     suggestions.push("Add more detailed content - aim for 1500+ words");
//   }

//   // Excerpt analysis
//   if (excerpt.length >= 150 && excerpt.length <= 160) {
//     score += 15;
//   } else if (excerpt.length > 160) {
//     issues.push("Meta description too long");
//     suggestions.push("Trim excerpt to 150-160 characters");
//   } else if (excerpt.length < 120) {
//     issues.push("Meta description too short");
//     suggestions.push("Expand excerpt to 150-160 characters");
//   }

//   // Heading structure analysis
//   const hasH1 = /^# /gm.test(content);
//   const hasH2 = /^## /gm.test(content);
//   const hasH3 = /^### /gm.test(content);
//   if (hasH1 && hasH2 && hasH3) {
//     score += 15;
//   } else {
//     issues.push("Missing proper heading structure");
//     suggestions.push("Use # for main headings, ## for subheadings and ### for sub-subheadings");
//   }

//   // Enhanced Keyword Analysis
//   const contentLower = content.toLowerCase();
//   const keywords = getTopicKeywords(category);
//   const foundKeywords = keywords.filter(keyword => 
//     contentLower.includes(keyword.toLowerCase())
//   );

//   if (foundKeywords.length >= 5) {
//     score += 15;
//   } else if (foundKeywords.length >= 3) {
//     score += 10;
//     suggestions.push("Consider adding more topic-specific keywords naturally in your content");
//   } else {
//     suggestions.push(`Include more relevant keywords about ${category} naturally in your content`);
//   }

//   // Tags analysis
//   if (tags.length >= 3 && tags.length <= 8) {
//     score += 10;
//   } else {
//     suggestions.push("Use 3-8 relevant tags for optimal categorization");
//   }

//   return { score: Math.min(score, 100), issues, suggestions };
// };

// const insertMarkdown = (textarea: HTMLTextAreaElement, before: string, after = "") => {
//   const start = textarea.selectionStart;
//   const end = textarea.selectionEnd;
//   const selectedText = textarea.value.substring(start, end);
//   const replacement = before + selectedText + after;

//   const newValue = 
//     textarea.value.substring(0, start) + 
//     replacement + 
//     textarea.value.substring(end);
    
//   return { 
//     newValue, 
//     newCursorPos: start + before.length + selectedText.length + after.length 
//   };
// };

// export function BlogWriteEditor() {
//   const searchParams = useSearchParams();
//   const editSlug = searchParams.get('edit');
//   const { toast } = useToast();
//   const { user } = useUser();
//   const router = useRouter();
//   const contentRef = useRef<HTMLTextAreaElement>(null);
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [existingPost, setExistingPost] = useState<any>(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [title, setTitle] = useState("");
//   const [subtitle, setSubtitle] = useState("");
//   const [content, setContent] = useState("");
//   const [excerpt, setExcerpt] = useState("");
//   const [category, setCategory] = useState("Technology");
//   const [showCustomCategory, setShowCustomCategory] = useState(false);
//   const [customCategory, setCustomCategory] = useState("");
//   const [tags, setTags] = useState<string[]>([]);
//   const [currentTag, setCurrentTag] = useState("");
//   const [readTime, setReadTime] = useState(0);
//   const [publishDate, setPublishDate] = useState(new Date().toISOString().split('T')[0]);
//   const [isDraft, setIsDraft] = useState(true);
//   const [isFeatured, setIsFeatured] = useState(false);
//   const [isPublic, setIsPublic] = useState(true);
//   const [allowComments, setAllowComments] = useState(true);
//   const [autoSaveStatus, setAutoSaveStatus] = useState("All changes saved");
//   const [seoScore, setSeoScore] = useState(0);
//   const [seoAnalysis, setSeoAnalysis] = useState<SEOAnalysis>({ 
//     score: 0, 
//     issues: [], 
//     suggestions: [] 
//   });
//   const [featuredImage, setFeaturedImage] = useState<string | null>(null);
//   const [showVideoSection, setShowVideoSection] = useState(false);
//   const [showGallerySection, setShowGallerySection] = useState(false);
//   const [featuredVideo, setFeaturedVideo] = useState<string | null>(null);
//   const [galleryImages, setGalleryImages] = useState<string[]>([]);
//   const [wordCount, setWordCount] = useState(0);
//   const [charCount, setCharCount] = useState(0);
//   const [activeTab, setActiveTab] = useState("write");
//   const [author, setAuthor] = useState("");
//   const [authorTitle, setAuthorTitle] = useState("");
//   const [authorBio, setAuthorBio] = useState("");
//   const [showFormattingHelp, setShowFormattingHelp] = useState(false);
//   const [isUploading, setIsUploading] = useState(false);
//   const [isVideoUploading, setIsVideoUploading] = useState(false);
//   const [isGalleryUploading, setIsGalleryUploading] = useState(false);
//   const [customCategories, setCustomCategories] = useState<string[]>([]);
//   const [isGeneratingSubtitle, setIsGeneratingSubtitle] = useState(false);
//   const [isGeneratingExcerpt, setIsGeneratingExcerpt] = useState(false);
//   const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
//   const [keywords, setKeywords] = useState<string[]>(getTopicKeywords(category));


//   useEffect(() => {
//     if (user?.username) {
//       setAuthor(user.firstName || '');
//     }
//   }, [user]);

//   useEffect(() => {
//     const fetchPostData = async () => {
//       if (editSlug) {
//         try {
//           const result = await getBlogPost(editSlug, isDraft);

//           console.log("Fetched post data:", result);

//           if (result.success && result.data) {
//             setExistingPost(result.data);
//             setIsEditMode(true);

//             setTitle(result.data.title);
//             setSubtitle(result.data.subtitle || "");
//             setContent(result.data.content);
//             setExcerpt(result.data.excerpt || "");
//             setCategory(result.data.category?.name || "Technology");
//             setTags(result.data.tags?.map((tag: any) => tag.name) || []);
//             setIsDraft(result.data.status === 'DRAFT');
//             setIsFeatured(result.data.isFeatured || false);
//             setIsPublic(result.data.visibility === 'PUBLIC' || true);
//             setAllowComments(result.data.allowComments || true);
//             setFeaturedImage(result.data.featuredImage || null);
//             setFeaturedVideo(result.data.featuredVideo || null);
//             setGalleryImages(result.data.galleryImages || []);
//             setAuthor(result.data.author || user?.firstName || "");
//             setAuthorTitle(result.data.authorTitle || "");
//             setAuthorBio(result.data.authorBio || "");
//             setPublishDate(new Date(result.data.createdAt).toISOString().split('T')[0]);
//           } else {
//             toast({
//               title: "Error loading post",
//               description: result.error || "Failed to load post data",
//               variant: "destructive",
//             });
//           }
//         } catch (error) {
//           console.error("Error fetching post:", error);
//           toast({
//             title: "Error",
//             description: "Failed to load post data",
//             variant: "destructive",
//           });
//         }
//       }
//     };

//     fetchPostData();
//   }, [editSlug, user, isDraft, toast]);

//   useEffect(() => {
//     if (content) {
//       const words = content.trim().split(/\s+/).length;
//       const chars = content.length;
//       setWordCount(words);
//       setCharCount(chars);
//       const time = Math.ceil(words / 200);
//       setReadTime(time || 1);
//     } else {
//       setWordCount(0);
//       setCharCount(0);
//       setReadTime(1);
//     }

//     const analysis = analyzeSEO(title, content, excerpt, tags, category);
//     setSeoAnalysis(analysis);
//     setSeoScore(analysis.score);
//   }, [content, title, excerpt, tags, category, wordCount]);

//     useEffect(() => {
//     setKeywords(getTopicKeywords(category));
//   }, [category]);


//   const handleAddTag = () => {
//     if (currentTag && !tags.includes(currentTag)) {
//       setTags([...tags, currentTag]);
//       setCurrentTag("");
//     }
//   };

//   const handleRemoveTag = (tagToRemove: string) => {
//     setTags(tags.filter((tag) => tag !== tagToRemove));
//   };

//   const handleCategoryChange = (value: string) => {
//     if (value === "custom") {
//       setShowCustomCategory(true);
//       setCategory("");
//     } else {
//       setShowCustomCategory(false);
//       setCategory(value);
//     }
//   };

//   const handleAddCustomCategory = () => {
//     if (customCategory.trim()) {
//       setCategory(customCategory);
//       setCustomCategories([...customCategories, customCategory]);
//       setShowCustomCategory(false);
//       setCustomCategory("");
//       toast({
//         title: "Category added",
//         description: "Your custom category has been added successfully.",
//       });
//     }
//   };

//   const handleRemoveGalleryImage = async (index: number) => {
//     const updatedImages = galleryImages.filter((_, i) => i !== index);
//     setGalleryImages(updatedImages);

//     if (isEditMode && existingPost?.id) {
//       const result = await updateGalleryImages(existingPost.id, updatedImages);

//       if (result.success) {
//         toast({ title: "Successfully", description: "Gallery images updated successfully." });
//       } else {
//         toast({
//           title: "Error",
//           description: result.error || "Failed to update gallery.",
//           variant: "destructive",
//         });
//       }
//     }
//   };

//   const generateSubtitle = async () => {
//     if (!title && !content) {
//       toast({
//         title: "Content needed",
//         description: "Please add a title or content before generating a subtitle.",
//         variant: "destructive",
//       });
//       return;
//     }

//     setIsGeneratingSubtitle(true);

//     try {
//       const res = await fetch("/api/ai/generate-subtitle", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ title, content }),
//       });

//       const data = await res.json();

//       if (!res.ok || !data.subtitle) {
//         throw new Error(data.error || "No subtitle returned");
//       }

//       setSubtitle(data.subtitle);

//       toast({
//         title: "Subtitle generated",
//         description: "AI has suggested a subtitle based on your content.",
//       });
//     } catch (err) {
//       toast({
//         title: "Generation failed",
//         description: "Could not generate subtitle. Please try again.",
//         variant: "destructive",
//       });
//     } finally {
//       setIsGeneratingSubtitle(false);
//     }
//   };

//   const generateExcerpt = async () => {
//     if (!content) {
//       toast({
//         title: "Content needed",
//         description: "Please add some content before generating an excerpt.",
//         variant: "destructive",
//       });
//       return;
//     }

//     setIsGeneratingExcerpt(true);
//     try {
//       const response = await fetch("/api/ai/generate-excerpt", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ title, content }),
//       });

//       const data = await response.json();

//       if (data.excerpt) {
//         setExcerpt(data.excerpt);
//         toast({
//           title: "Excerpt generated",
//           description: "AI has suggested an excerpt based on your content.",
//         });
//       } else {
//         throw new Error(data.error || "Failed to generate excerpt.");
//       }
//     } catch (error) {
//       toast({
//         title: "Generation failed",
//         description: "Could not generate excerpt. Please try again.",
//         variant: "destructive",
//       });
//     } finally {
//       setIsGeneratingExcerpt(false);
//     }
//   };

//   const handleKeywordClick = (keyword: string) => {
//     if (selectedKeywords.includes(keyword)) {
//       setSelectedKeywords(selectedKeywords.filter(k => k !== keyword));
//     } else {
//       setSelectedKeywords([...selectedKeywords, keyword]);
//     }
//   };

//   const insertKeywords = () => {
//     if (!contentRef.current || selectedKeywords.length === 0) return;

//     const textarea = contentRef.current;
//     const start = textarea.selectionStart;
//     const end = textarea.selectionEnd;
    
//     const keywordsToInsert = selectedKeywords.join(", ");
//     const newValue = 
//       textarea.value.substring(0, start) + 
//       keywordsToInsert + 
//       textarea.value.substring(end);
    
//     setContent(newValue);
//     setSelectedKeywords([]);
    
//     setTimeout(() => {
//       textarea.focus();
//       textarea.setSelectionRange(start + keywordsToInsert.length, start + keywordsToInsert.length);
//     }, 0);
//   };

//   const handleSubmit = async (publish: boolean) => {
//     if (!title.trim()) {
//       toast({
//         title: "Title required",
//         description: "Please add a title before publishing.",
//         variant: "destructive",
//       });
//       return;
//     }

//     if (!content.trim()) {
//       toast({
//         title: "Content required",
//         description: "Please add content before publishing.",
//         variant: "destructive",
//       });
//       return;
//     }

//     if (!featuredImage) {
//       toast({
//         title: "Image required",
//         description: "Please add a featured image before publishing.",
//         variant: "destructive",
//       });
//       return;
//     }

//     if (!user?.id) {
//       toast({
//         title: "Authentication required",
//         description: "Please sign in to create a blog post.",
//         variant: "destructive",
//       });
//       return;
//     }

//     setIsSubmitting(true);
//     try {
//       const status: PostStatus = publish ? "PUBLISHED" : "DRAFT";
//       const formData = {
//         title,
//         subtitle,
//         content,
//         excerpt,
//         category,
//         tags,
//         isDraft: publish ? false : true,
//         status: status,
//         isFeatured,
//         isPublic,
//         featuredImage: featuredImage,
//         featuredVideo: featuredVideo || undefined,
//         galleryImages: galleryImages.length > 0 ? galleryImages : undefined,
//         seoTitle: title,
//         seoDescription: excerpt,
//         seoKeywords: tags,
//         seoScore: seoScore,
//         allowComments,
//         authorBio,
//         author: author,
//         authorTitle: authorTitle,
//       };

//       let result;
//       if (isEditMode && existingPost) {
//         result = await updateBlogPost(existingPost.id, user.id, formData);
//       } else {
//         result = await createBlogPost(formData);
//       }

//       if (result.success) {
//         toast({
//           title: publish ? "Post published!" : isEditMode ? "Post updated!" : "Draft saved",
//           description: publish 
//             ? isEditMode 
//               ? "Your blog post has been updated and published successfully." 
//               : "Your blog post has been published successfully."
//             : isEditMode
//               ? "Your changes have been saved."
//               : "Your draft has been saved successfully.",
//         });
        
//         if (publish && result.post?.slug) {
//           router.push(`/blog/${result.post.slug}`);
//         }
//       } else {
//         toast({
//           title: "Error",
//           description: result.error || "Failed to save blog post",
//           variant: "destructive",
//         });
//       }
//     } catch (error) {
//       console.error("Error submitting blog post:", error);
//       toast({
//         title: "Error",
//         description: "An unexpected error occurred while saving your post.",
//         variant: "destructive",
//       });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handlePublish = () => handleSubmit(true);
//   const handleSaveDraft = () => handleSubmit(false);

//   const formatText = (format: string) => {
//     const textarea = contentRef.current;
//     if (!textarea) return;

//     let result;
//     switch (format) {
//       case "bold":
//         result = insertMarkdown(textarea, "**", "**");
//         break;
//       case "italic":
//         result = insertMarkdown(textarea, "_", "_");
//         break;
//       case "heading1":
//         result = insertMarkdown(textarea, "# ", "");
//         break;
//       case "heading2":
//         result = insertMarkdown(textarea, "## ", "");
//         break;
//       case "heading3":
//         result = insertMarkdown(textarea, "### ", "");
//         break;
//       case "quote":
//         result = insertMarkdown(textarea, "> ", "");
//         break;
//       case "code":
//         result = insertMarkdown(textarea, "`", "`");
//         break;
//       case "codeblock":
//         result = insertMarkdown(textarea, "```\n", "\n```");
//         break;
//       case "link":
//         const selectedText = textarea.value.substring(textarea.selectionStart, textarea.selectionEnd);
//         if (selectedText) {
//           result = insertMarkdown(textarea, "[", "](url)");
//         } else {
//           result = { newValue: textarea.value + "[text](url)", newCursorPos: textarea.value.length + 6 };
//         }
//         break;
//       case "unordered-list":
//         result = insertMarkdown(textarea, "- ", "");
//         break;
//       case "ordered-list":
//         result = insertMarkdown(textarea, "1. ", "");
//         break;
//       default:
//         return;
//     }

//     setContent(result.newValue);
//     setTimeout(() => {
//       textarea.focus();
//       textarea.setSelectionRange(result.newCursorPos, result.newCursorPos);
//     }, 0);
//   };

//   const getSeoScoreColor = (score: number) => {
//     if (score >= 80) return "text-green-600";
//     if (score >= 60) return "text-yellow-600";
//     return "text-red-600";
//   };

//   const getSeoScoreIcon = (score: number) => {
//     if (score >= 80) return <CheckCircle className="h-4 w-4 text-green-600" />;
//     if (score >= 60) return <AlertCircle className="h-4 w-4 text-yellow-600" />;
//     return <AlertCircle className="h-4 w-4 text-red-600" />;
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100">
//       {/* Header */}
//       <div className="bg-white border-b border-neutral-200 sticky top-0 z-50">
//         <div className="container mx-auto px-4 py-4">
//           <div className="flex justify-between items-center">
//             <div className="flex items-center gap-4">
//               <div className="flex items-center gap-2">
//                 <PenTool className="h-6 w-6 text-blue-500" />
//                 <h1 className="text-xl font-bold text-neutral-900">Blog Editor</h1>
//               </div>
//               <div className="flex items-center gap-2 text-sm text-neutral-500">
//                 <div className="flex items-center gap-1">
//                   <FileText className="h-4 w-4" />
//                   <span>{wordCount.toLocaleString()} words</span>
//                 </div>
//                 <Separator orientation="vertical" className="h-4" />
//                 <div className="flex items-center gap-1">
//                   <Clock className="h-4 w-4" />
//                   <span>{readTime} min read</span>
//                 </div>
//               </div>
//             </div>

//             <div className="flex items-center gap-3">
//               <Button 
//                 variant="outline" 
//                 size="sm" 
//                 onClick={handleSaveDraft}
//                 disabled={isSubmitting}
//               >
//                 <Save className="h-4 w-4 mr-2" />
//                 {isSubmitting 
//                   ? (isEditMode ? "Saving..." : "Saving Draft...") 
//                   : (isEditMode ? "Save Edit" : "Save Draft")}
//               </Button>

//               <Button 
//                 size="sm" 
//                 className="bg-gold-300 text-black hover:bg-gold-600"
//                 onClick={handlePublish}
//                 disabled={isSubmitting}
//               >
//                 <Globe className="h-4 w-4 mr-2" />
//                 {isSubmitting 
//                 ? (isEditMode ? "Publishing..." : "Publishing Edit...") 
//                 : (isEditMode ? "Publish Edit" : "Publish")}
//               </Button>

//               <Link href="/dashboard/blog" className="hover:underline">
//                 <Button 
//                   size="sm" 
//                   className="text-white hover:bg-white hover:text-gold-700"
//                 >
//                   <ArrowLeft className="h-4 w-4 mr-2" />
//                   Go Back
//                 </Button>
//               </Link>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="w-full px-4 py-8">
//         <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
//           {/* Main Editor - Scrollable Section */}
//           <div className="xl:col-span-3 h-[calc(100vh-100px)] overflow-y-auto hidden-scrollbar">
//             <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
//               <Card className="overflow-hidden shadow-lg">
//                 <CardHeader className="pb-0">
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center gap-2">
//                       <Sparkles className="h-5 w-5 text-blue-500" />
//                       <CardTitle>Create Your Story</CardTitle>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       {getSeoScoreIcon(seoAnalysis.score)}
//                       <span className={`text-sm font-medium ${getSeoScoreColor(seoAnalysis.score)}`}>
//                         SEO Score: {seoAnalysis.score}%
//                       </span>
//                       <Button variant="ghost" size="sm" onClick={() => setShowFormattingHelp(!showFormattingHelp)}>
//                         <HelpCircle className="h-4 w-4" />
//                       </Button>
//                     </div>
//                   </div>
//                 </CardHeader>

//                 <CardContent className="p-0">
//                   {showFormattingHelp && (
//                     <div className="mx-6 mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
//                       <h4 className="font-semibold text-blue-900 mb-3">Markdown Formatting Guide</h4>
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
//                         <div>
//                           <p className="font-medium text-blue-800 mb-2">Headers:</p>
//                           <div className="space-y-2">
//                             <div>
//                               <code className="block bg-white p-2 rounded"># Heading 1</code>
//                               <Button 
//                                 variant="ghost" 
//                                 size="sm" 
//                                 className="mt-1 text-xs"
//                                 onClick={() => formatText("heading1")}
//                               >
//                                 Apply H1
//                               </Button>
//                             </div>
//                             <div>
//                               <code className="block bg-white p-2 rounded">## Heading 2</code>
//                               <Button 
//                                 variant="ghost" 
//                                 size="sm" 
//                                 className="mt-1 text-xs"
//                                 onClick={() => formatText("heading2")}
//                               >
//                                 Apply H2
//                               </Button>
//                             </div>
//                             <div>
//                               <code className="block bg-white p-2 rounded">### Heading 3</code>
//                               <Button 
//                                 variant="ghost" 
//                                 size="sm" 
//                                 className="mt-1 text-xs"
//                                 onClick={() => formatText("heading3")}
//                               >
//                                 Apply H3
//                               </Button>
//                             </div>
//                           </div>
//                         </div>
                        
//                         <div>
//                           <p className="font-medium text-blue-800 mb-2">Text Formatting:</p>
//                           <div className="space-y-2">
//                             <div>
//                               <code className="block bg-white p-2 rounded">**Bold Text**</code>
//                               <Button 
//                                 variant="ghost" 
//                                 size="sm" 
//                                 className="mt-1 text-xs"
//                                 onClick={() => formatText("bold")}
//                               >
//                                 Apply Bold
//                               </Button>
//                             </div>
//                             <div>
//                               <code className="block bg-white p-2 rounded">*Italic Text*</code>
//                               <Button 
//                                 variant="ghost" 
//                                 size="sm" 
//                                 className="mt-1 text-xs"
//                                 onClick={() => formatText("italic")}
//                               >
//                                 Apply Italic
//                               </Button>
//                             </div>
//                             <div>
//                               <code className="block bg-white p-2 rounded">`Inline Code`</code>
//                               <Button 
//                                 variant="ghost" 
//                                 size="sm" 
//                                 className="mt-1 text-xs"
//                                 onClick={() => formatText("code")}
//                               >
//                                 Apply Code
//                               </Button>
//                             </div>
//                           </div>
//                         </div>
                        
//                         <div>
//                           <p className="font-medium text-blue-800 mb-2">Lists & Quotes:</p>
//                           <div className="space-y-2">
//                             <div>
//                               <code className="block bg-white p-2 rounded">- List Item</code>
//                               <Button 
//                                 variant="ghost" 
//                                 size="sm" 
//                                 className="mt-1 text-xs"
//                                 onClick={() => formatText("unordered-list")}
//                               >
//                                 Add Bullet
//                               </Button>
//                             </div>
//                             <div>
//                               <code className="block bg-white p-2 rounded">1. Ordered Item</code>
//                               <Button 
//                                 variant="ghost" 
//                                 size="sm" 
//                                 className="mt-1 text-xs"
//                                 onClick={() => formatText("ordered-list")}
//                               >
//                                 Add Number
//                               </Button>
//                             </div>
//                             <div>
//                               <code className="block bg-white p-2 rounded">&gt; Blockquote</code>
//                               <Button 
//                                 variant="ghost" 
//                                 size="sm" 
//                                 className="mt-1 text-xs"
//                                 onClick={() => formatText("quote")}
//                               >
//                                 Add Quote
//                               </Button>
//                             </div>
//                           </div>
//                         </div>
                        
//                         <div>
//                           <p className="font-medium text-blue-800 mb-2">Links & Code Blocks:</p>
//                           <div className="space-y-2">
//                             <div>
//                               <code className="block bg-white p-2 rounded">[Text](URL)</code>
//                               <Button 
//                                 variant="ghost" 
//                                 size="sm" 
//                                 className="mt-1 text-xs"
//                                 onClick={() => formatText("link")}
//                               >
//                                 Add Link
//                               </Button>
//                             </div>
//                             <div>
//                               <code className="block bg-white p-2 rounded">```\nCode Block\n```</code>
//                               <Button 
//                                 variant="ghost" 
//                                 size="sm" 
//                                 className="mt-1 text-xs"
//                                 onClick={() => formatText("codeblock")}
//                               >
//                                 Add Code Block
//                               </Button>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   )}

//                   <Tabs value={activeTab} onValueChange={setActiveTab}>
//                     <div className="border-b bg-neutral-50/50">
//                       <div className="flex items-center justify-between px-6 py-3">
//                         <TabsList className="bg-white">
//                           <TabsTrigger value="write" className="flex items-center gap-2">
//                             <PenTool className="h-4 w-4" />
//                             Write
//                           </TabsTrigger>
//                           <TabsTrigger value="preview" className="flex items-center gap-2">
//                             <Eye className="h-4 w-4" />
//                             Preview
//                           </TabsTrigger>
//                         </TabsList>

//                         {activeTab === "write" && (
//                           <div className="flex items-center gap-1">
//                             <Button
//                               variant="ghost"
//                               size="sm"
//                               onClick={() => formatText("bold")}
//                               title="Bold (**text**)"
//                             >
//                               <Bold className="h-4 w-4" />
//                             </Button>
//                             <Button
//                               variant="ghost"
//                               size="sm"
//                               onClick={() => formatText("italic")}
//                               title="Italic (*text*)"
//                             >
//                               <Italic className="h-4 w-4" />
//                             </Button>
//                             <Button
//                               variant="ghost"
//                               size="sm"
//                               onClick={() => formatText("heading1")}
//                               title="Heading 1 (# text)"
//                             >
//                               <Heading1 className="h-4 w-4" />
//                             </Button>
//                             <Button
//                               variant="ghost"
//                               size="sm"
//                               onClick={() => formatText("heading2")}
//                               title="Heading 2 (## text)"
//                             >
//                               <Heading2 className="h-4 w-4" />
//                             </Button>
//                             <Button
//                               variant="ghost"
//                               size="sm"
//                               onClick={() => formatText("quote")}
//                               title="Quote (> text)"
//                             >
//                               <Quote className="h-4 w-4" />
//                             </Button>
//                             <Button variant="ghost" size="sm" onClick={() => formatText("code")} title="Code (`text`)">
//                               <Code className="h-4 w-4" />
//                             </Button>
//                             <Button
//                               variant="ghost"
//                               size="sm"
//                               onClick={() => formatText("link")}
//                               title="Link ([text](url))"
//                             >
//                               <LinkIcon className="h-4 w-4" />
//                             </Button>
//                           </div>
//                         )}
//                       </div>
//                     </div>

//                     <TabsContent value="write" className="p-0 m-0">
//                       <div className="p-6 space-y-6">
//                         <div>
//                           <Input
//                             type="text"
//                             placeholder="Enter your captivating title here..."
//                             className="border-0 border-b-2 border-dashed border-neutral-200 rounded-none px-0 text-3xl font-bold focus-visible:ring-0 focus-visible:border-blue-500 placeholder:text-neutral-400"
//                             value={title}
//                             onChange={(e) => setTitle(e.target.value)}
//                           />
//                         </div>
                        
//                         <div className="relative">
//                           <Input
//                             type="text"
//                             placeholder="Add a subtitle (optional)"
//                             className="border-0 border-b border-dashed border-neutral-200 rounded-none px-0 text-xl focus-visible:ring-0 focus-visible:border-blue-500 placeholder:text-neutral-400 pl-8"
//                             value={subtitle}
//                             onChange={(e) => setSubtitle(e.target.value)}
//                           />
//                           <div className="absolute right-0 top-0 flex items-center h-full">
//                             <Button 
//                               variant="ghost" 
//                               size="sm" 
//                               className="flex items-center gap-1 bg-black text-white"
//                               onClick={generateSubtitle}
//                               disabled={isGeneratingSubtitle}
//                             >
//                               {isGeneratingSubtitle ? (
//                                 <>
//                                   <Loader2 className="h-4 w-4 animate-spin" />
//                                   <span>Generating...</span>
//                                 </>
//                               ) : (
//                                 <>
//                                   <Wand2 className="h-4 w-4" />
//                                   <span>Generate subtitle with AI</span>
//                                 </>
//                               )}
//                             </Button>
//                           </div>
//                         </div>

//                         <div>
//                           <Textarea
//                             ref={contentRef}
//                             placeholder="Start writing your amazing content here..."
//                             className="min-h-[600px] resize-y border-0 focus-visible:ring-0 p-0 text-lg leading-relaxed placeholder:text-neutral-400 font-mono"
//                             value={content}
//                             onChange={(e) => setContent(e.target.value)}
//                           />
//                         </div>
//                       </div>
//                     </TabsContent>

//                     <TabsContent value="preview" className="p-0 m-0">
//                       <div className="p-6">
//                         <div className="prose prose-lg max-w-none">
//                           {title ? (
//                             <h1 className="text-3xl font-bold mb-2 text-gray-900">{title}</h1>
//                           ) : (
//                             <div className="text-3xl font-bold text-neutral-300 mb-2">Your Title Here</div>
//                           )}
                          
//                           {subtitle && (
//                             <h2 className="text-xl text-gray-700 mb-6">{subtitle}</h2>
//                           )}

//                           {featuredImage && (
//                             <div className="relative w-full h-60 rounded-lg overflow-hidden my-6">
//                               <Image
//                                 src={featuredImage}
//                                 alt="Featured"
//                                 fill
//                                 className="object-cover"
//                               />
//                             </div>
//                           )}

//                           {content ? (
//                             <div
//                               className="prose-content"
//                               dangerouslySetInnerHTML={{
//                                 __html: parseMarkdown(content),
//                               }}
//                             />
//                           ) : (
//                             <div className="text-neutral-400">Your content will appear here...</div>
//                           )}

//                           {featuredVideo && (
//                             <div className="w-full my-6">
//                               <video controls className="w-full rounded-lg h-[300px]">
//                                 <source src={featuredVideo} type="video/mp4" />
//                                 Your browser does not support the video tag.
//                               </video>
//                             </div>
//                           )}

//                           {galleryImages.length > 0 && (
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
//                               {galleryImages.map((img, index) => (
//                                 <div key={index} className="relative h-40 rounded-lg overflow-hidden">
//                                   <Image
//                                     src={img}
//                                     alt={`Gallery image ${index + 1}`}
//                                     fill
//                                     className="object-cover"
//                                   />
//                                 </div>
//                               ))}
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     </TabsContent>
//                   </Tabs>
//                 </CardContent>
//               </Card>

//               {/* Excerpt Section */}
//               <Card className="mt-6">
//                 <CardHeader>
//                   <div className="flex items-center justify-between">
//                     <CardTitle className="flex items-center gap-2">
//                       <BookOpen className="h-5 w-5 text-blue-500" />
//                       Post Excerpt
//                     </CardTitle>
//                     <Button 
//                       variant="ghost" 
//                       size="sm" 
//                       className="flex items-center gap-1"
//                       onClick={generateExcerpt}
//                       disabled={isGeneratingExcerpt}
//                     >
//                       {isGeneratingExcerpt ? (
//                         <>
//                           <Loader2 className="h-4 w-4 animate-spin" />
//                           <span>Generating...</span>
//                         </>
//                       ) : (
//                         <>
//                           <Bot className="h-4 w-4" />
//                           <span>Generate with AI</span>
//                         </>
//                       )}
//                     </Button>
//                   </div>
//                 </CardHeader>
//                 <CardContent>
//                   <Textarea
//                     placeholder="Write a compelling summary that will appear in search results and blog listings..."
//                     className="resize-none h-24"
//                     value={excerpt}
//                     onChange={(e) => setExcerpt(e.target.value)}
//                   />
//                 </CardContent>
//               </Card>
//             </motion.div>
//           </div>

//           {/* Sidebar - Fixed Position */}
//           <div className="xl:col-span-1 h-[calc(100vh-100px)] overflow-y-auto sticky top-28 hidden-scrollbar">
//             <motion.div
//               initial={{ opacity: 0, x: 20 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ duration: 0.5, delay: 0.2 }}
//               className="space-y-6"
//             >
              

//               {/* Author Settings */}
//               <Card>
//                 <CardHeader>
//                   <CardTitle className="flex items-center gap-2">
//                     <Users className="h-5 w-5 text-blue-500" />
//                     Author Information
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="authorTitle">Author title</Label>
//                     <Input
//                       id="authorTitle"
//                       value={authorTitle}
//                       onChange={(e) => setAuthorTitle(e.target.value)}
//                       placeholder="Author's title"
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="author">Author Name</Label>
//                     <Input
//                       id="author"
//                       value={author}
//                       onChange={(e) => setAuthor(e.target.value)}
//                       placeholder="Your name"
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="authorBio">Author Bio</Label>
//                     <Textarea
//                       id="authorBio"
//                       value={authorBio}
//                       onChange={(e) => setAuthorBio(e.target.value)}
//                       placeholder="Your professional Bio"
//                     />
//                   </div>
//                 </CardContent>
//               </Card>

//               {/* Post Settings */}
//               <Card>
//                 <CardHeader>
//                   <CardTitle className="flex items-center gap-2">
//                     <Settings className="h-5 w-5 text-blue-500" />
//                     Post Settings
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="category">Category</Label>
//                     {showCustomCategory ? (
//                       <div className="flex gap-2">
//                         <Input
//                           placeholder="Enter custom category"
//                           value={customCategory}
//                           onChange={(e) => setCustomCategory(e.target.value)}
//                           onKeyDown={(e) => {
//                             if (e.key === "Enter") {
//                               e.preventDefault()
//                               handleAddCustomCategory()
//                             }
//                           }}
//                         />
//                         <Button type="button" variant="outline" size="icon" onClick={handleAddCustomCategory}>
//                           <CheckCircle className="h-4 w-4" />
//                         </Button>
//                         <Button
//                           type="button"
//                           variant="outline"
//                           size="icon"
//                           onClick={() => {
//                             setShowCustomCategory(false)
//                             setCustomCategory("")
//                           }}
//                         >
//                           <X className="h-4 w-4" />
//                         </Button>
//                       </div>
//                     ) : (
//                       <Select value={category} onValueChange={handleCategoryChange}>
//                         <SelectTrigger>
//                           <SelectValue placeholder="Select category" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           <SelectItem value="Technology">💻 Technology</SelectItem>
//                           <SelectItem value="Artificial Intelligence">🤖 AI</SelectItem>
//                           <SelectItem value="Business">💼 Business</SelectItem>
//                           <SelectItem value="Science">🔬 Science</SelectItem>
//                           <SelectItem value="Health">🏥 Health</SelectItem>
//                           <SelectItem value="Education">🎓 Education</SelectItem>
//                           <SelectItem value="Entertainment">🎬 Entertainment</SelectItem>
//                           <SelectItem value="Sports">⚽ Sports</SelectItem>
//                           <SelectItem value="Travel">✈️ Travel</SelectItem>
//                           <SelectItem value="Food">🍔 Food</SelectItem>
//                           {customCategories.map((cat) => (
//                             <SelectItem key={cat} value={cat}>
//                               {cat}
//                             </SelectItem>
//                           ))}
//                           <SelectItem value="custom">
//                             <div className="flex items-center gap-2">
//                               <Plus className="h-4 w-4" />
//                               <span>Add custom category</span>
//                             </div>
//                           </SelectItem>
//                         </SelectContent>
//                       </Select>
//                     )}
//                   </div>

//                   <div className="space-y-2">
//                     <Label>Tags</Label>
//                     <div className="flex gap-2">
//                       <Input
//                         placeholder="Add tag"
//                         value={currentTag}
//                         onChange={(e) => setCurrentTag(e.target.value)}
//                         onKeyDown={(e) => {
//                           if (e.key === "Enter") {
//                             e.preventDefault()
//                             handleAddTag()
//                           }
//                         }}
//                       />
//                       <Button type="button" variant="outline" size="icon" onClick={handleAddTag}>
//                         <Plus className="h-4 w-4" />
//                       </Button>
//                     </div>

//                     {tags.length > 0 && (
//                       <div className="flex flex-wrap gap-2 mt-2">
//                         {tags.map((tag) => (
//                           <Badge key={tag} variant="secondary" className="flex items-center gap-1">
//                             #{tag}
//                             <button onClick={() => handleRemoveTag(tag)}>
//                               <X className="h-3 w-3" />
//                             </button>
//                           </Badge>
//                         ))}
//                       </div>
//                     )}
//                   </div>

//                   {/* Featured Image Section */}
//                   <div className="space-y-2">
//                     <Label>Featured Image</Label>
//                     {featuredImage ? (
//                       <div className="relative">
//                         <div className="relative h-40 w-full rounded-lg overflow-hidden">
//                           <Image
//                             src={featuredImage}
//                             alt="Featured"
//                             fill
//                             className="object-cover"
//                           />
//                         </div>
//                         <Button
//                           variant="destructive"
//                           size="sm"
//                           className="absolute top-2 right-2"
//                           onClick={() => setFeaturedImage(null)}
//                         >
//                           <X className="h-4 w-4" />
//                         </Button>
//                       </div>
//                     ) : (
//                       <div className="border-2 border-dashed border-neutral-200 rounded-lg p-6 text-center hover:border-blue-300 transition-colors">
//                         <ImageIcon className="h-8 w-8 mx-auto text-neutral-400 mb-2" />
//                         <p className="text-sm text-neutral-500 mb-2">Upload featured image</p>
//                         {isUploading ? (
//                           <div className="flex items-center justify-center">
//                             <Loader2 className="h-4 w-4 animate-spin mr-2" />
//                             <span>Uploading...</span>
//                           </div>
//                         ) : (
//                           <UploadButton
//                             endpoint="blogFeaturedImg"
//                             onClientUploadComplete={(res) => {
//                               if (res && res[0]?.url) {
//                                 setFeaturedImage(res[0].url)
//                                 setIsUploading(false)
//                                 toast({
//                                   title: "Image uploaded",
//                                   description: "Featured image has been uploaded successfully.",
//                                 })
//                               }
//                             }}
//                             onUploadError={(error: Error) => {
//                               setIsUploading(false)
//                               toast({
//                                 title: "Upload error",
//                                 description: error.message,
//                                 variant: "destructive",
//                               })
//                             }}
//                             onUploadBegin={() => {
//                               setIsUploading(true)
//                             }}
//                           />
//                         )}
//                       </div>
//                     )}
//                   </div>

//                   {/* Toggle buttons for video and gallery sections */}
//                   <div className="flex gap-2">
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       className="flex-1"
//                       onClick={() => {
//                         setShowVideoSection(!showVideoSection)
//                         if (!showVideoSection) setShowGallerySection(false)
//                       }}
//                     >
//                       <Film className="h-4 w-4 mr-2" />
//                       {showVideoSection || featuredVideo ? "Hide Video" : "Add Video"}
//                     </Button>
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       className="flex-1"
//                       onClick={() => {
//                         setShowGallerySection(!showGallerySection)
//                         if (!showGallerySection) setShowVideoSection(false)
//                       }}
//                     >
//                       <ImagePlus className="h-4 w-4 mr-2" />
//                       {showGallerySection || galleryImages.length > 0 ? "Hide Gallery" : "Add Gallery"}
//                     </Button>
//                   </div>

//                   {/* Featured Video Section */}
//                   {(isEditMode && featuredVideo) || showVideoSection ? (
//                     <div className="space-y-2">
//                       <Label>Featured Video</Label>
//                       {featuredVideo ? (
//                         <div className="relative">
//                           <video controls className="w-full rounded-lg h-[200px]">
//                             <source src={featuredVideo} type="video/mp4" />
//                             Your browser does not support the video tag.
//                           </video>
//                           <Button
//                             variant="destructive"
//                             size="sm"
//                             className="absolute top-2 right-2"
//                             onClick={() => setFeaturedVideo(null)}
//                           >
//                             <X className="h-4 w-4" />
//                           </Button>
//                         </div>
//                       ) : (
//                         <div className="border-2 border-dashed border-neutral-200 rounded-lg p-6 text-center hover:border-blue-300 transition-colors">
//                           <Video className="h-8 w-8 mx-auto text-neutral-400 mb-2" />
//                           <p className="text-sm text-neutral-500 mb-2">
//                             {isEditMode ? 'Replace featured video' : 'Upload featured video'}
//                           </p>
//                           {isVideoUploading ? (
//                             <div className="flex items-center justify-center">
//                               <Loader2 className="h-4 w-4 animate-spin mr-2" />
//                               <span>Uploading...</span>
//                             </div>
//                           ) : (
//                             <UploadButton
//                               endpoint="blogVideoUpload"
//                               onClientUploadComplete={(res) => {
//                                 if (res && res[0]?.url) {
//                                   setFeaturedVideo(res[0].url)
//                                   setIsVideoUploading(false)
//                                   toast({
//                                     title: "Video uploaded",
//                                     description: "Featured video has been uploaded successfully.",
//                                   })
//                                 }
//                               }}
//                               onUploadError={(error: Error) => {
//                                 setIsVideoUploading(false)
//                                 toast({
//                                   title: "Upload error",
//                                   description: error.message,
//                                   variant: "destructive",
//                                 })
//                               }}
//                               onUploadBegin={() => {
//                                 setIsVideoUploading(true)
//                               }}
//                             />
//                           )}
//                         </div>
//                       )}
//                     </div>
//                   ) : null}

//                   {/* Image Gallery Section */}
//                   {(isEditMode && galleryImages.length > 0) || showGallerySection ? (
//                     <div className="space-y-2">
//                       <Label>Image Gallery ({galleryImages.length} images)</Label>
                      
//                       {galleryImages.length > 0 ? (
//                        <div className="grid grid-cols-2 gap-2 w-full">
//                         {galleryImages.map((img, index) => (
//                           <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
//                             <Image
//                               src={img}
//                               alt={`Gallery image ${index + 1}`}
//                               fill
//                               className="object-cover"
//                               sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
//                             />
//                             <Button
//                               variant="destructive"
//                               size="sm"
//                               className="absolute top-1 right-1 h-6 w-6 p-0"
//                               onClick={() => handleRemoveGalleryImage(index)}
//                             >
//                               <X className="h-3 w-3" />
//                             </Button>
//                           </div>
//                         ))}
//                       </div>
//                       ) : (
//                         <div className="border-2 border-dashed border-neutral-200 rounded-lg p-6 text-center hover:border-blue-300 transition-colors">
//                           <ImagePlus className="h-8 w-8 mx-auto text-neutral-400 mb-2" />
//                           <p className="text-sm text-neutral-500 mb-2">
//                             {isEditMode ? 'Add gallery images' : 'Upload gallery images'}
//                           </p>
//                           {isGalleryUploading ? (
//                             <div className="flex items-center justify-center">
//                               <Loader2 className="h-4 w-4 animate-spin mr-2" />
//                               <span>Uploading...</span>
//                             </div>
//                           ) : (
//                             <UploadButton
//                               endpoint="blogGalleryImg"
//                               onClientUploadComplete={(res) => {
//                                 if (res) {
//                                   setGalleryImages([...galleryImages, ...res.map(r => r.url)])
//                                   setIsGalleryUploading(false)
//                                   toast({
//                                     title: "Images uploaded",
//                                     description: `${res.length} images added to gallery.`,
//                                   })
//                                 }
//                               }}
//                               onUploadError={(error: Error) => {
//                                 setIsGalleryUploading(false)
//                                 toast({
//                                   title: "Upload error",
//                                   description: error.message,
//                                   variant: "destructive",
//                                 })
//                               }}
//                               onUploadBegin={() => {
//                                 setIsGalleryUploading(true)
//                               }}
//                             />
//                           )}
//                         </div>
//                       )}
//                     </div>
//                   ) : null}

//                   <div className="space-y-2">
//                     <Label>Publish Date</Label>
//                     <div className="flex items-center gap-2">
//                       <Calendar className="h-4 w-4 text-neutral-500" />
//                       <Input type="date" value={publishDate} onChange={(e) => setPublishDate(e.target.value)} />
//                     </div>
//                   </div>

//                   <div className="space-y-3 pt-2">
//                     <div className="flex items-center justify-between">
//                       <div className="flex items-center gap-2">
//                         <Switch checked={isFeatured} onCheckedChange={setIsFeatured} />
//                         <Label>Featured post</Label>
//                       </div>
//                     </div>

//                     <div className="flex items-center justify-between">
//                       <div className="flex items-center gap-2">
//                         <Switch checked={isPublic} onCheckedChange={setIsPublic} />
//                         <Label>Public visibility</Label>
//                       </div>
//                       {isPublic ? (
//                         <Globe className="h-4 w-4 text-green-600" />
//                       ) : (
//                         <Lock className="h-4 w-4 text-neutral-400" />
//                       )}
//                     </div>

//                     <div className="flex items-center justify-between">
//                       <div className="flex items-center gap-2">
//                         <Switch checked={allowComments} onCheckedChange={setAllowComments} />
//                         <Label>Allow comments</Label>
//                       </div>
//                       <HelpCircle className="h-4 w-4 text-neutral-400" />
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>

//                {/* Topic Keywords Card */}
//               <Card>
//                 <CardHeader>
//                   <CardTitle className="flex items-center gap-2">
//                     <Hash className="h-5 w-5 text-blue-500" />
//                     Topic Keywords
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-3">
//                   <p className="text-sm text-neutral-500">
//                     Select keywords to include in your content for better SEO:
//                   </p>
                  
//                   <div className="flex flex-wrap gap-2">
//                     {keywords.map((keyword) => (
//                       <Badge 
//                         key={keyword}
//                         variant={selectedKeywords.includes(keyword) ? "default" : "outline"}
//                         className="cursor-pointer hover:bg-blue-50"
//                         onClick={() => handleKeywordClick(keyword)}
//                       >
//                         {keyword}
//                       </Badge>
//                     ))}
//                   </div>

//                   {selectedKeywords.length > 0 && (
//                     <Button
//                       size="sm"
//                       className="w-full mt-2"
//                       onClick={insertKeywords}
//                     >
//                       <Plus className="h-4 w-4 mr-2" />
//                       Insert {selectedKeywords.length} selected keywords
//                     </Button>
//                   )}
//                 </CardContent>
//               </Card>

//               {/* SEO Analysis Card */}
//               <Card>
//                 <CardHeader>
//                   <CardTitle className="flex items-center gap-2">
//                     <TrendingUp className="h-5 w-5 text-blue-500" />
//                     SEO Analysis
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center gap-2">
//                       <span className="text-sm font-medium">Overall Score</span>
//                       {getSeoScoreIcon(seoAnalysis.score)}
//                     </div>
//                     <span className={`text-lg font-bold ${getSeoScoreColor(seoAnalysis.score)}`}>
//                       {seoAnalysis.score}%
//                     </span>
//                   </div>

//                   {seoAnalysis.issues.length > 0 && (
//                     <div className="space-y-2">
//                       <Label className="flex items-center gap-1 text-red-600">
//                         <AlertCircle className="h-4 w-4" />
//                         Issues to fix
//                       </Label>
//                       <div className="space-y-1">
//                         {seoAnalysis.issues.map((issue, index) => (
//                           <div key={index} className="flex items-start gap-2 text-sm">
//                             <X className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
//                             <span>{issue}</span>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   )}

//                   {seoAnalysis.suggestions.length > 0 && (
//                     <div className="space-y-2">
//                       <Label className="flex items-center gap-1 text-yellow-600">
//                         <Lightbulb className="h-4 w-4" />
//                         Suggestions
//                       </Label>
//                       <div className="space-y-1">
//                         {seoAnalysis.suggestions.map((suggestion, index) => (
//                           <div key={index} className="flex items-start gap-2 text-sm">
//                             <Info className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
//                             <span>{suggestion}</span>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   )}

//                   {seoAnalysis.score >= 80 && (
//                     <div className="p-3 bg-green-50 rounded-lg text-green-800 text-sm">
//                       <div className="flex items-center gap-2">
//                         <CheckCircle className="h-4 w-4 text-green-600" />
//                         <span>Great job! Your content is well optimized for SEO.</span>
//                       </div>
//                     </div>
//                   )}
//                 </CardContent>
//               </Card>

//               {/* Post Stats Card */}
//               <Card>
//                 <CardHeader>
//                   <CardTitle className="flex items-center gap-2">
//                     <FileText className="h-5 w-5 text-blue-500" />
//                     Post Stats
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent className="grid grid-cols-2 gap-4">
//                   <div className="space-y-1">
//                     <Label className="text-neutral-500">Word Count</Label>
//                     <p className="font-medium">{wordCount.toLocaleString()}</p>
//                   </div>
//                   <div className="space-y-1">
//                     <Label className="text-neutral-500">Character Count</Label>
//                     <p className="font-medium">{charCount.toLocaleString()}</p>
//                   </div>
//                   <div className="space-y-1">
//                     <Label className="text-neutral-500">Reading Time</Label>
//                     <p className="font-medium">{readTime} min</p>
//                   </div>
//                   <div className="space-y-1">
//                     <Label className="text-neutral-500">Images</Label>
//                     <p className="font-medium">
//                       {featuredImage ? 1 : 0}
//                       {galleryImages.length > 0 && ` + ${galleryImages.length}`}
//                     </p>
//                   </div>
//                 </CardContent>
//               </Card>
//             </motion.div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }





















"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  Eye,
  Save,
  Settings,
  Link as LinkIcon,
  Info,
  Clock,
  Calendar,
  X,
  Plus,
  Bold,
  Italic,
  Quote,
  Code,
  Heading1,
  Heading2,
  FileText,
  TrendingUp,
  Sparkles,
  BookOpen,
  PenTool,
  Lightbulb,
  CheckCircle,
  AlertCircle,
  Globe,
  Lock,
  Users,
  HelpCircle,
  ImageIcon,
  Loader2,
  ArrowLeft,
  Video,
  Film,
  ImagePlus,
  Bot,
  Wand2,
  Hash,
  Menu,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { createBlogPost } from "@/actions/blog/add.blog";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { UploadButton } from "@/shared/utils/uploadthing";
import { parseMarkdown } from "@/shared/libs/markdown-parser";
import Link from "next/link";
import { getBlogPost, updateBlogPost, updateGalleryImages } from "@/actions/blog/get.blog";
import { BlogPost } from "@/app/type";
import { PostStatus } from "@prisma/client";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";

interface SEOAnalysis {
  score: number;
  issues: string[];
  suggestions: string[];
}

const getTopicKeywords = (category: string) => {
  // Common keywords for all categories
  const commonKeywords = [
    "how to", "guide", "tips", "best practices", "benefits", 
    "advantages", "examples", "case study", "why", "what is", 
    "comparison", "vs", "versus", "ultimate guide", "step by step"
  ];
  
  // Category-specific keywords
  const categoryKeywords: Record<string, string[]> = {
    "technology": [
      "tech", "innovation", "digital", "future", "trends",
      "software", "hardware", "gadgets", "devices", "internet",
      "cybersecurity", "cloud computing", "blockchain", "IoT"
    ],
    "artificial intelligence": [
      "AI", "machine learning", "deep learning", "neural networks",
      "natural language processing", "computer vision", "robotics",
      "automation", "chatbots", "generative AI"
    ],
    "business": [
      "entrepreneur", "startup", "marketing", "strategy", "growth",
      "leadership", "management", "finance", "investment", "ecommerce",
      "sales", "productivity", "remote work"
    ],
    "health": [
      "wellness", "fitness", "nutrition", "medical", "doctor",
      "exercise", "diet", "mental health", "sleep", "recovery",
      "prevention", "holistic", "alternative medicine"
    ],
    "food": [
      "recipe", "cooking", "restaurant", "nutrition", "diet",
      "healthy eating", "meal prep", "ingredients", "cuisine",
      "baking", "vegan", "vegetarian", "gluten-free"
    ],
    "travel": [
      "destination", "itinerary", "adventure", "budget travel",
      "luxury travel", "backpacking", "hotels", "airbnb",
      "sightseeing", "local culture", "travel tips"
    ],
    "education": [
      "learning", "teaching", "online courses", "study tips",
      "career development", "skills", "certification", "degree",
      "student life", "e-learning", "homeschooling"
    ]
  };

  // Convert category to lowercase for case-insensitive matching
  const normalizedCategory = category.toLowerCase();

  return [
    ...commonKeywords,
    ...(categoryKeywords[normalizedCategory] || [])
  ];
};

const analyzeSEO = (title: string, content: string, excerpt: string, tags: string[], category: string) => {
  let score = 0;
  const issues: string[] = [];
  const suggestions: string[] = [];

  // Title analysis
  if (title.length >= 30 && title.length <= 60) {
    score += 20;
  } else if (title.length > 60) {
    issues.push("Title too long (over 60 characters)");
    suggestions.push("Shorten title to under 60 characters for better SEO");
  } else if (title.length < 30) {
    issues.push("Title too short (under 30 characters)");
    suggestions.push("Expand title to 30-60 characters for optimal SEO");
  }

  // Content length analysis
  const wordCount = content.trim().split(/\s+/).length;
  if (wordCount >= 1500) {
    score += 25;
  } else if (wordCount >= 800) {
    score += 15;
    suggestions.push("Consider expanding content to 1500+ words for better SEO ranking");
  } else {
    issues.push("Content too short (under 800 words)");
    suggestions.push("Add more detailed content - aim for 1500+ words");
  }

  // Excerpt analysis
  if (excerpt.length >= 150 && excerpt.length <= 160) {
    score += 15;
  } else if (excerpt.length > 160) {
    issues.push("Meta description too long");
    suggestions.push("Trim excerpt to 150-160 characters");
  } else if (excerpt.length < 120) {
    issues.push("Meta description too short");
    suggestions.push("Expand excerpt to 150-160 characters");
  }

  // Heading structure analysis
  const hasH1 = /^# /gm.test(content);
  const hasH2 = /^## /gm.test(content);
  const hasH3 = /^### /gm.test(content);
  if (hasH1 && hasH2 && hasH3) {
    score += 15;
  } else {
    issues.push("Missing proper heading structure");
    suggestions.push("Use # for main headings, ## for subheadings and ### for sub-subheadings");
  }

  // Enhanced Keyword Analysis
  const contentLower = content.toLowerCase();
  const keywords = getTopicKeywords(category);
  const foundKeywords = keywords.filter(keyword => 
    contentLower.includes(keyword.toLowerCase())
  );

  if (foundKeywords.length >= 5) {
    score += 15;
  } else if (foundKeywords.length >= 3) {
    score += 10;
    suggestions.push("Consider adding more topic-specific keywords naturally in your content");
  } else {
    suggestions.push(`Include more relevant keywords about ${category} naturally in your content`);
  }

  // Tags analysis
  if (tags.length >= 3 && tags.length <= 8) {
    score += 10;
  } else {
    suggestions.push("Use 3-8 relevant tags for optimal categorization");
  }

  return { score: Math.min(score, 100), issues, suggestions };
};

const insertMarkdown = (textarea: HTMLTextAreaElement, before: string, after = "") => {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const selectedText = textarea.value.substring(start, end);
  const replacement = before + selectedText + after;

  const newValue = 
    textarea.value.substring(0, start) + 
    replacement + 
    textarea.value.substring(end);
    
  return { 
    newValue, 
    newCursorPos: start + before.length + selectedText.length + after.length 
  };
};

export function BlogWriteEditor() {
  const searchParams = useSearchParams();
  const editSlug = searchParams.get('edit');
  const { toast } = useToast();
  const { user } = useUser();
  const router = useRouter();
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [existingPost, setExistingPost] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [category, setCategory] = useState("Technology");
  const [showCustomCategory, setShowCustomCategory] = useState(false);
  const [customCategory, setCustomCategory] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState("");
  const [readTime, setReadTime] = useState(0);
  const [publishDate, setPublishDate] = useState(new Date().toISOString().split('T')[0]);
  const [isDraft, setIsDraft] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isPublic, setIsPublic] = useState(true);
  const [allowComments, setAllowComments] = useState(true);
  const [autoSaveStatus, setAutoSaveStatus] = useState("All changes saved");
  const [seoScore, setSeoScore] = useState(0);
  const [seoAnalysis, setSeoAnalysis] = useState<SEOAnalysis>({ 
    score: 0, 
    issues: [], 
    suggestions: [] 
  });
  const [featuredImage, setFeaturedImage] = useState<string | null>(null);
  const [showVideoSection, setShowVideoSection] = useState(false);
  const [showGallerySection, setShowGallerySection] = useState(false);
  const [featuredVideo, setFeaturedVideo] = useState<string | null>(null);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [activeTab, setActiveTab] = useState("write");
  const [author, setAuthor] = useState("");
  const [authorTitle, setAuthorTitle] = useState("");
  const [authorBio, setAuthorBio] = useState("");
  const [showFormattingHelp, setShowFormattingHelp] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isVideoUploading, setIsVideoUploading] = useState(false);
  const [isGalleryUploading, setIsGalleryUploading] = useState(false);
  const [customCategories, setCustomCategories] = useState<string[]>([]);
  const [isGeneratingSubtitle, setIsGeneratingSubtitle] = useState(false);
  const [isGeneratingExcerpt, setIsGeneratingExcerpt] = useState(false);
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [keywords, setKeywords] = useState<string[]>(getTopicKeywords(category));
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isTablet = useMediaQuery("(max-width: 1024px)");

  useEffect(() => {
    if (user?.username) {
      setAuthor(user.firstName || '');
    }
  }, [user]);

  useEffect(() => {
    const fetchPostData = async () => {
      if (editSlug) {
        try {
          const result = await getBlogPost(editSlug, isDraft);

          console.log("Fetched post data:", result);

          if (result.success && result.data) {
            setExistingPost(result.data);
            setIsEditMode(true);

            setTitle(result.data.title);
            setSubtitle(result.data.subtitle || "");
            setContent(result.data.content);
            setExcerpt(result.data.excerpt || "");
            setCategory(result.data.category?.name || "Technology");
            setTags(result.data.tags?.map((tag: any) => tag.name) || []);
            setIsDraft(result.data.status === 'DRAFT');
            setIsFeatured(result.data.isFeatured || false);
            setIsPublic(result.data.visibility === 'PUBLIC' || true);
            setAllowComments(result.data.allowComments || true);
            setFeaturedImage(result.data.featuredImage || null);
            setFeaturedVideo(result.data.featuredVideo || null);
            setGalleryImages(result.data.galleryImages || []);
            setAuthor(result.data.author || user?.firstName || "");
            setAuthorTitle(result.data.authorTitle || "");
            setAuthorBio(result.data.authorBio || "");
            setPublishDate(new Date(result.data.createdAt).toISOString().split('T')[0]);
          } else {
            toast({
              title: "Error loading post",
              description: result.error || "Failed to load post data",
              variant: "destructive",
            });
          }
        } catch (error) {
          console.error("Error fetching post:", error);
          toast({
            title: "Error",
            description: "Failed to load post data",
            variant: "destructive",
          });
        }
      }
    };

    fetchPostData();
  }, [editSlug, user, isDraft, toast]);

  useEffect(() => {
    if (content) {
      const words = content.trim().split(/\s+/).length;
      const chars = content.length;
      setWordCount(words);
      setCharCount(chars);
      const time = Math.ceil(words / 200);
      setReadTime(time || 1);
    } else {
      setWordCount(0);
      setCharCount(0);
      setReadTime(1);
    }

    const analysis = analyzeSEO(title, content, excerpt, tags, category);
    setSeoAnalysis(analysis);
    setSeoScore(analysis.score);
  }, [content, title, excerpt, tags, category, wordCount]);

  useEffect(() => {
    setKeywords(getTopicKeywords(category));
  }, [category]);

  const handleAddTag = () => {
    if (currentTag && !tags.includes(currentTag)) {
      setTags([...tags, currentTag]);
      setCurrentTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleCategoryChange = (value: string) => {
    if (value === "custom") {
      setShowCustomCategory(true);
      setCategory("");
    } else {
      setShowCustomCategory(false);
      setCategory(value);
    }
  };

  const handleAddCustomCategory = () => {
    if (customCategory.trim()) {
      setCategory(customCategory);
      setCustomCategories([...customCategories, customCategory]);
      setShowCustomCategory(false);
      setCustomCategory("");
      toast({
        title: "Category added",
        description: "Your custom category has been added successfully.",
      });
    }
  };

  const handleRemoveGalleryImage = async (index: number) => {
    const updatedImages = galleryImages.filter((_, i) => i !== index);
    setGalleryImages(updatedImages);

    if (isEditMode && existingPost?.id) {
      const result = await updateGalleryImages(existingPost.id, updatedImages);

      if (result.success) {
        toast({ title: "Successfully", description: "Gallery images updated successfully." });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update gallery.",
          variant: "destructive",
        });
      }
    }
  };

  const generateSubtitle = async () => {
    if (!title && !content) {
      toast({
        title: "Content needed",
        description: "Please add a title or content before generating a subtitle.",
        variant: "destructive",
      });
      return;
    }

    setIsGeneratingSubtitle(true);

    try {
      const res = await fetch("/api/ai/generate-subtitle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });

      const data = await res.json();

      if (!res.ok || !data.subtitle) {
        throw new Error(data.error || "No subtitle returned");
      }

      setSubtitle(data.subtitle);

      toast({
        title: "Subtitle generated",
        description: "AI has suggested a subtitle based on your content.",
      });
    } catch (err) {
      toast({
        title: "Generation failed",
        description: "Could not generate subtitle. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingSubtitle(false);
    }
  };

  const generateExcerpt = async () => {
    if (!content) {
      toast({
        title: "Content needed",
        description: "Please add some content before generating an excerpt.",
        variant: "destructive",
      });
      return;
    }

    setIsGeneratingExcerpt(true);
    try {
      const response = await fetch("/api/ai/generate-excerpt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });

      const data = await response.json();

      if (data.excerpt) {
        setExcerpt(data.excerpt);
        toast({
          title: "Excerpt generated",
          description: "AI has suggested an excerpt based on your content.",
        });
      } else {
        throw new Error(data.error || "Failed to generate excerpt.");
      }
    } catch (error) {
      toast({
        title: "Generation failed",
        description: "Could not generate excerpt. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingExcerpt(false);
    }
  };

  const handleKeywordClick = (keyword: string) => {
    if (contentRef.current) {
      const textarea = contentRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      
      const newValue = 
        textarea.value.substring(0, start) + 
        keyword + 
        textarea.value.substring(end);
      
      setContent(newValue);
      
      // Focus back on the textarea and position cursor
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + keyword.length, start + keyword.length);
      }, 0);
    }
  };

  const handleSubmit = async (publish: boolean) => {
    if (!title.trim()) {
      toast({
        title: "Title required",
        description: "Please add a title before publishing.",
        variant: "destructive",
      });
      return;
    }

    if (!content.trim()) {
      toast({
        title: "Content required",
        description: "Please add content before publishing.",
        variant: "destructive",
      });
      return;
    }

    if (!featuredImage) {
      toast({
        title: "Image required",
        description: "Please add a featured image before publishing.",
        variant: "destructive",
      });
      return;
    }

    if (!user?.id) {
      toast({
        title: "Authentication required",
        description: "Please sign in to create a blog post.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const status: PostStatus = publish ? "PUBLISHED" : "DRAFT";
      const formData = {
        title,
        subtitle,
        content,
        excerpt,
        category,
        tags,
        isDraft: publish ? false : true,
        status: status,
        isFeatured,
        isPublic,
        featuredImage: featuredImage,
        featuredVideo: featuredVideo || undefined,
        galleryImages: galleryImages.length > 0 ? galleryImages : undefined,
        seoTitle: title,
        seoDescription: excerpt,
        seoKeywords: tags,
        seoScore: seoScore,
        allowComments,
        authorBio,
        author: author,
        authorTitle: authorTitle,
      };

      let result;
      if (isEditMode && existingPost) {
        result = await updateBlogPost(existingPost.id, user.id, formData);
      } else {
        result = await createBlogPost(formData);
      }

      if (result.success) {
        toast({
          title: publish ? "Post published!" : isEditMode ? "Post updated!" : "Draft saved",
          description: publish 
            ? isEditMode 
              ? "Your blog post has been updated and published successfully." 
              : "Your blog post has been published successfully."
            : isEditMode
              ? "Your changes have been saved."
              : "Your draft has been saved successfully.",
        });
        
        if (publish && result.post?.slug) {
          router.push(`/blog/${result.post.slug}`);
        }
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to save blog post",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error submitting blog post:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while saving your post.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePublish = () => handleSubmit(true);
  const handleSaveDraft = () => handleSubmit(false);

  const formatText = (format: string) => {
    const textarea = contentRef.current;
    if (!textarea) return;

    let result;
    switch (format) {
      case "bold":
        result = insertMarkdown(textarea, "**", "**");
        break;
      case "italic":
        result = insertMarkdown(textarea, "_", "_");
        break;
      case "heading1":
        result = insertMarkdown(textarea, "# ", "");
        break;
      case "heading2":
        result = insertMarkdown(textarea, "## ", "");
        break;
      case "heading3":
        result = insertMarkdown(textarea, "### ", "");
        break;
      case "quote":
        result = insertMarkdown(textarea, "> ", "");
        break;
      case "code":
        result = insertMarkdown(textarea, "`", "`");
        break;
      case "codeblock":
        result = insertMarkdown(textarea, "```\n", "\n```");
        break;
      case "link":
        const selectedText = textarea.value.substring(textarea.selectionStart, textarea.selectionEnd);
        if (selectedText) {
          result = insertMarkdown(textarea, "[", "](url)");
        } else {
          result = { newValue: textarea.value + "[text](url)", newCursorPos: textarea.value.length + 6 };
        }
        break;
      case "unordered-list":
        result = insertMarkdown(textarea, "- ", "");
        break;
      case "ordered-list":
        result = insertMarkdown(textarea, "1. ", "");
        break;
      default:
        return;
    }

    setContent(result.newValue);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(result.newCursorPos, result.newCursorPos);
    }, 0);
  };

  const getSeoScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getSeoScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="h-4 w-4 text-green-600" />;
    if (score >= 60) return <AlertCircle className="h-4 w-4 text-yellow-600" />;
    return <AlertCircle className="h-4 w-4 text-red-600" />;
  };

  // Responsive layout components
  const SidebarContent = () => (
    <div className="space-y-6">
      {/* Author Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-500" />
            Author Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="authorTitle">Author title</Label>
            <Input
              id="authorTitle"
              value={authorTitle}
              onChange={(e) => setAuthorTitle(e.target.value)}
              placeholder="Author's title"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="author">Author Name</Label>
            <Input
              id="author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Your name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="authorBio">Author Bio</Label>
            <Textarea
              id="authorBio"
              value={authorBio}
              onChange={(e) => setAuthorBio(e.target.value)}
              placeholder="Your professional Bio"
            />
          </div>
        </CardContent>
      </Card>

      {/* Post Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-blue-500" />
            Post Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            {showCustomCategory ? (
              <div className="flex gap-2">
                <Input
                  placeholder="Enter custom category"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      handleAddCustomCategory()
                    }
                  }}
                />
                <Button type="button" variant="outline" size="icon" onClick={handleAddCustomCategory}>
                  <CheckCircle className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    setShowCustomCategory(false)
                    setCustomCategory("")
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Select value={category} onValueChange={handleCategoryChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Technology">💻 Technology</SelectItem>
                  <SelectItem value="Artificial Intelligence">🤖 AI</SelectItem>
                  <SelectItem value="Business">💼 Business</SelectItem>
                  <SelectItem value="Science">🔬 Science</SelectItem>
                  <SelectItem value="Health">🏥 Health</SelectItem>
                  <SelectItem value="Education">🎓 Education</SelectItem>
                  <SelectItem value="Entertainment">🎬 Entertainment</SelectItem>
                  <SelectItem value="Sports">⚽ Sports</SelectItem>
                  <SelectItem value="Travel">✈️ Travel</SelectItem>
                  <SelectItem value="Food">🍔 Food</SelectItem>
                  {customCategories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                  <SelectItem value="custom">
                    <div className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      <span>Add custom category</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Add tag"
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    handleAddTag()
                  }
                }}
              />
              <Button type="button" variant="outline" size="icon" onClick={handleAddTag}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    #{tag}
                    <button onClick={() => handleRemoveTag(tag)}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Featured Image Section */}
          <div className="space-y-2">
            <Label>Featured Image</Label>
            {featuredImage ? (
              <div className="relative">
                <div className="relative h-40 w-full rounded-lg overflow-hidden">
                  <Image
                    src={featuredImage}
                    alt="Featured"
                    fill
                    className="object-cover"
                  />
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => setFeaturedImage(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-neutral-200 rounded-lg p-6 text-center hover:border-blue-300 transition-colors">
                <ImageIcon className="h-8 w-8 mx-auto text-neutral-400 mb-2" />
                <p className="text-sm text-neutral-500 mb-2">Upload featured image</p>
                {isUploading ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    <span>Uploading...</span>
                  </div>
                ) : (
                  <UploadButton
                    endpoint="blogFeaturedImg"
                    onClientUploadComplete={(res) => {
                      if (res && res[0]?.url) {
                        setFeaturedImage(res[0].url)
                        setIsUploading(false)
                        toast({
                          title: "Image uploaded",
                          description: "Featured image has been uploaded successfully.",
                        })
                      }
                    }}
                    onUploadError={(error: Error) => {
                      setIsUploading(false)
                      toast({
                        title: "Upload error",
                        description: error.message,
                        variant: "destructive",
                      })
                    }}
                    onUploadBegin={() => {
                      setIsUploading(true)
                    }}
                  />
                )}
              </div>
            )}
          </div>

          {/* Toggle buttons for video and gallery sections */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => {
                setShowVideoSection(!showVideoSection)
                if (!showVideoSection) setShowGallerySection(false)
              }}
            >
              <Film className="h-4 w-4 mr-2" />
              {showVideoSection || featuredVideo ? "Hide Video" : "Add Video"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => {
                setShowGallerySection(!showGallerySection)
                if (!showGallerySection) setShowVideoSection(false)
              }}
            >
              <ImagePlus className="h-4 w-4 mr-2" />
              {showGallerySection || galleryImages.length > 0 ? "Hide Gallery" : "Add Gallery"}
            </Button>
          </div>

          {/* Featured Video Section */}
          {(isEditMode && featuredVideo) || showVideoSection ? (
            <div className="space-y-2">
              <Label>Featured Video</Label>
              {featuredVideo ? (
                <div className="relative">
                  <video controls className="w-full rounded-lg h-[200px]">
                    <source src={featuredVideo} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => setFeaturedVideo(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-neutral-200 rounded-lg p-6 text-center hover:border-blue-300 transition-colors">
                  <Video className="h-8 w-8 mx-auto text-neutral-400 mb-2" />
                  <p className="text-sm text-neutral-500 mb-2">
                    {isEditMode ? 'Replace featured video' : 'Upload featured video'}
                  </p>
                  {isVideoUploading ? (
                    <div className="flex items-center justify-center">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      <span>Uploading...</span>
                    </div>
                  ) : (
                    <UploadButton
                      endpoint="blogVideoUpload"
                      onClientUploadComplete={(res) => {
                        if (res && res[0]?.url) {
                          setFeaturedVideo(res[0].url)
                          setIsVideoUploading(false)
                          toast({
                            title: "Video uploaded",
                            description: "Featured video has been uploaded successfully.",
                          })
                        }
                      }}
                      onUploadError={(error: Error) => {
                        setIsVideoUploading(false)
                        toast({
                          title: "Upload error",
                          description: error.message,
                          variant: "destructive",
                        })
                      }}
                      onUploadBegin={() => {
                        setIsVideoUploading(true)
                      }}
                    />
                  )}
                </div>
              )}
            </div>
          ) : null}

          {/* Image Gallery Section */}
          {(isEditMode && galleryImages.length > 0) || showGallerySection ? (
            <div className="space-y-2">
              <Label>Image Gallery ({galleryImages.length} images)</Label>
              
              {galleryImages.length > 0 ? (
                <div className="grid grid-cols-2 gap-2 w-full">
                  {galleryImages.map((img, index) => (
                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                      <Image
                        src={img}
                        alt={`Gallery image ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        className="absolute top-1 right-1 h-6 w-6 p-0"
                        onClick={() => handleRemoveGalleryImage(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="border-2 border-dashed border-neutral-200 rounded-lg p-6 text-center hover:border-blue-300 transition-colors">
                  <ImagePlus className="h-8 w-8 mx-auto text-neutral-400 mb-2" />
                  <p className="text-sm text-neutral-500 mb-2">
                    {isEditMode ? 'Add gallery images' : 'Upload gallery images'}
                  </p>
                  {isGalleryUploading ? (
                    <div className="flex items-center justify-center">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      <span>Uploading...</span>
                    </div>
                  ) : (
                    <UploadButton
                      endpoint="blogGalleryImg"
                      onClientUploadComplete={(res) => {
                        if (res) {
                          setGalleryImages([...galleryImages, ...res.map(r => r.url)])
                          setIsGalleryUploading(false)
                          toast({
                            title: "Images uploaded",
                            description: `${res.length} images added to gallery.`,
                          })
                        }
                      }}
                      onUploadError={(error: Error) => {
                        setIsGalleryUploading(false)
                        toast({
                          title: "Upload error",
                          description: error.message,
                          variant: "destructive",
                        })
                      }}
                      onUploadBegin={() => {
                        setIsGalleryUploading(true)
                      }}
                    />
                  )}
                </div>
              )}
            </div>
          ) : null}

          <div className="space-y-2">
            <Label>Publish Date</Label>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-neutral-500" />
              <Input type="date" value={publishDate} onChange={(e) => setPublishDate(e.target.value)} />
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Switch checked={isFeatured} onCheckedChange={setIsFeatured} />
                <Label>Featured post</Label>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Switch checked={isPublic} onCheckedChange={setIsPublic} />
                <Label>Public visibility</Label>
              </div>
              {isPublic ? (
                <Globe className="h-4 w-4 text-green-600" />
              ) : (
                <Lock className="h-4 w-4 text-neutral-400" />
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Switch checked={allowComments} onCheckedChange={setAllowComments} />
                <Label>Allow comments</Label>
              </div>
              <HelpCircle className="h-4 w-4 text-neutral-400" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Topic Keywords Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Hash className="h-5 w-5 text-blue-500" />
            Topic Keywords
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-neutral-500">
            Click on any keyword to insert it into your content:
          </p>
          
          <div className="flex flex-wrap gap-2">
            {keywords.map((keyword) => (
              <Badge 
                key={keyword}
                variant="outline"
                className="cursor-pointer hover:bg-blue-50"
                onClick={() => handleKeywordClick(keyword)}
              >
                {keyword}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* SEO Analysis Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-500" />
            SEO Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Overall Score</span>
              {getSeoScoreIcon(seoAnalysis.score)}
            </div>
            <span className={`text-lg font-bold ${getSeoScoreColor(seoAnalysis.score)}`}>
              {seoAnalysis.score}%
            </span>
          </div>

          {seoAnalysis.issues.length > 0 && (
            <div className="space-y-2">
              <Label className="flex items-center gap-1 text-red-600">
                <AlertCircle className="h-4 w-4" />
                Issues to fix
              </Label>
              <div className="space-y-1">
                {seoAnalysis.issues.map((issue, index) => (
                  <div key={index} className="flex items-start gap-2 text-sm">
                    <X className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                    <span>{issue}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {seoAnalysis.suggestions.length > 0 && (
            <div className="space-y-2">
              <Label className="flex items-center gap-1 text-yellow-600">
                <Lightbulb className="h-4 w-4" />
                Suggestions
              </Label>
              <div className="space-y-1">
                {seoAnalysis.suggestions.map((suggestion, index) => (
                  <div key={index} className="flex items-start gap-2 text-sm">
                    <Info className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <span>{suggestion}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {seoAnalysis.score >= 80 && (
            <div className="p-3 bg-green-50 rounded-lg text-green-800 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Great job! Your content is well optimized for SEO.</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Post Stats Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-500" />
            Post Stats
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label className="text-neutral-500">Word Count</Label>
            <p className="font-medium">{wordCount.toLocaleString()}</p>
          </div>
          <div className="space-y-1">
            <Label className="text-neutral-500">Character Count</Label>
            <p className="font-medium">{charCount.toLocaleString()}</p>
          </div>
          <div className="space-y-1">
            <Label className="text-neutral-500">Reading Time</Label>
            <p className="font-medium">{readTime} min</p>
          </div>
          <div className="space-y-1">
            <Label className="text-neutral-500">Images</Label>
            <p className="font-medium">
              {featuredImage ? 1 : 0}
              {galleryImages.length > 0 && ` + ${galleryImages.length}`}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <PenTool className="h-6 w-6 text-blue-500" />
                <h1 className="text-xl font-bold text-neutral-900">Blog Editor</h1>
              </div>
              <div className="hidden md:flex items-center gap-2 text-sm text-neutral-500">
                <div className="flex items-center gap-1">
                  <FileText className="h-4 w-4" />
                  <span>{wordCount.toLocaleString()} words</span>
                </div>
                <Separator orientation="vertical" className="h-4" />
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{readTime} min read</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleSaveDraft}
                disabled={isSubmitting}
                className="hidden sm:flex"
              >
                <Save className="h-4 w-4 mr-2" />
                {isSubmitting 
                  ? (isEditMode ? "Saving..." : "Saving Draft...") 
                  : (isEditMode ? "Save Edit" : "Save Draft")}
              </Button>

              <Button 
                size="sm" 
                className="bg-gold-300 text-black hover:bg-gold-600 hidden sm:flex"
                onClick={handlePublish}
                disabled={isSubmitting}
              >
                <Globe className="h-4 w-4 mr-2" />
                {isSubmitting 
                ? (isEditMode ? "Publishing..." : "Publishing Edit...") 
                : (isEditMode ? "Publish Edit" : "Publish")}
              </Button>

              {isMobile && (
                <Drawer>
                  <DrawerTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Menu className="h-4 w-4" />
                    </Button>
                  </DrawerTrigger>
                  <DrawerContent className="p-4">
                    <div className="flex flex-col gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleSaveDraft}
                        disabled={isSubmitting}
                      >
                        <Save className="h-4 w-4 mr-2" />
                        {isSubmitting 
                          ? (isEditMode ? "Saving..." : "Saving Draft...") 
                          : (isEditMode ? "Save Edit" : "Save Draft")}
                      </Button>
                      <Button 
                        size="sm" 
                        className="bg-gold-300 text-black hover:bg-gold-600"
                        onClick={handlePublish}
                        disabled={isSubmitting}
                      >
                        <Globe className="h-4 w-4 mr-2" />
                        {isSubmitting 
                        ? (isEditMode ? "Publishing..." : "Publishing Edit...") 
                        : (isEditMode ? "Publish Edit" : "Publish")}
                      </Button>
                      <Link href="/dashboard/blog">
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="w-full"
                        >
                          <ArrowLeft className="h-4 w-4 mr-2" />
                          Go Back
                        </Button>
                      </Link>
                    </div>
                  </DrawerContent>
                </Drawer>
              )}

              <Link href="/dashboard/blog" className="hover:underline hidden sm:block">
                <Button 
                  size="sm" 
                  variant="outline"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Go Back
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Editor - Scrollable Section */}
          <div className={cn(
            "lg:col-span-3 h-[calc(100vh-100px)] overflow-y-auto hidden-scrollbar",
            isMobileSidebarOpen ? "hidden" : "block"
          )}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Card className="overflow-hidden shadow-lg">
                <CardHeader className="pb-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-blue-500" />
                      <CardTitle>Create Your Story</CardTitle>
                    </div>
                    <div className="flex items-center gap-2">
                      {getSeoScoreIcon(seoAnalysis.score)}
                      <span className={`text-sm font-medium ${getSeoScoreColor(seoAnalysis.score)}`}>
                        SEO Score: {seoAnalysis.score}%
                      </span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setShowFormattingHelp(!showFormattingHelp)}
                        className="hidden sm:flex"
                      >
                        <HelpCircle className="h-4 w-4" />
                      </Button>
                      {isMobile && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setIsMobileSidebarOpen(true)}
                        >
                          <Settings className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-0">
                  {showFormattingHelp && (
                    <div className="mx-6 mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h4 className="font-semibold text-blue-900 mb-3">Markdown Formatting Guide</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="font-medium text-blue-800 mb-2">Headers:</p>
                          <div className="space-y-2">
                            <div>
                              <code className="block bg-white p-2 rounded"># Heading 1</code>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="mt-1 text-xs"
                                onClick={() => formatText("heading1")}
                              >
                                Apply H1
                              </Button>
                            </div>
                            <div>
                              <code className="block bg-white p-2 rounded">## Heading 2</code>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="mt-1 text-xs"
                                onClick={() => formatText("heading2")}
                              >
                                Apply H2
                              </Button>
                            </div>
                            <div>
                              <code className="block bg-white p-2 rounded">### Heading 3</code>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="mt-1 text-xs"
                                onClick={() => formatText("heading3")}
                              >
                                Apply H3
                              </Button>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <p className="font-medium text-blue-800 mb-2">Text Formatting:</p>
                          <div className="space-y-2">
                            <div>
                              <code className="block bg-white p-2 rounded">**Bold Text**</code>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="mt-1 text-xs"
                                onClick={() => formatText("bold")}
                              >
                                Apply Bold
                              </Button>
                            </div>
                            <div>
                              <code className="block bg-white p-2 rounded">*Italic Text*</code>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="mt-1 text-xs"
                                onClick={() => formatText("italic")}
                              >
                                Apply Italic
                              </Button>
                            </div>
                            <div>
                              <code className="block bg-white p-2 rounded">`Inline Code`</code>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="mt-1 text-xs"
                                onClick={() => formatText("code")}
                              >
                                Apply Code
                              </Button>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <p className="font-medium text-blue-800 mb-2">Lists & Quotes:</p>
                          <div className="space-y-2">
                            <div>
                              <code className="block bg-white p-2 rounded">- List Item</code>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="mt-1 text-xs"
                                onClick={() => formatText("unordered-list")}
                              >
                                Add Bullet
                              </Button>
                            </div>
                            <div>
                              <code className="block bg-white p-2 rounded">1. Ordered Item</code>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="mt-1 text-xs"
                                onClick={() => formatText("ordered-list")}
                              >
                                Add Number
                              </Button>
                            </div>
                            <div>
                              <code className="block bg-white p-2 rounded">&gt; Blockquote</code>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="mt-1 text-xs"
                                onClick={() => formatText("quote")}
                              >
                                Add Quote
                              </Button>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <p className="font-medium text-blue-800 mb-2">Links & Code Blocks:</p>
                          <div className="space-y-2">
                            <div>
                              <code className="block bg-white p-2 rounded">[Text](URL)</code>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="mt-1 text-xs"
                                onClick={() => formatText("link")}
                              >
                                Add Link
                              </Button>
                            </div>
                            <div>
                              <code className="block bg-white p-2 rounded">```\nCode Block\n```</code>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="mt-1 text-xs"
                                onClick={() => formatText("codeblock")}
                              >
                                Add Code Block
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <div className="border-b bg-neutral-50/50">
                      <div className="flex items-center justify-between px-6 py-3">
                        <TabsList className="bg-white">
                          <TabsTrigger value="write" className="flex items-center gap-2">
                            <PenTool className="h-4 w-4" />
                            Write
                          </TabsTrigger>
                          <TabsTrigger value="preview" className="flex items-center gap-2">
                            <Eye className="h-4 w-4" />
                            Preview
                          </TabsTrigger>
                        </TabsList>

                        {activeTab === "write" && (
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => formatText("bold")}
                              title="Bold (**text**)"
                              className="hidden sm:flex"
                            >
                              <Bold className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => formatText("italic")}
                              title="Italic (*text*)"
                              className="hidden sm:flex"
                            >
                              <Italic className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => formatText("heading1")}
                              title="Heading 1 (# text)"
                              className="hidden sm:flex"
                            >
                              <Heading1 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => formatText("heading2")}
                              title="Heading 2 (## text)"
                              className="hidden sm:flex"
                            >
                              <Heading2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => formatText("quote")}
                              title="Quote (> text)"
                              className="hidden sm:flex"
                            >
                              <Quote className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => formatText("code")} 
                              title="Code (`text`)"
                              className="hidden sm:flex"
                            >
                              <Code className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => formatText("link")}
                              title="Link ([text](url))"
                              className="hidden sm:flex"
                            >
                              <LinkIcon className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>

                    <TabsContent value="write" className="p-0 m-0">
                      <div className="p-6 space-y-6">
                        <div>
                          <Input
                            type="text"
                            placeholder="Enter your captivating title here..."
                            className="border-0 border-b-2 border-dashed border-neutral-200 rounded-none px-0 text-3xl font-bold focus-visible:ring-0 focus-visible:border-blue-500 placeholder:text-neutral-400"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                          />
                        </div>
                        
                        <div className="relative">
                          <Input
                            type="text"
                            placeholder="Add a subtitle (optional)"
                            className="border-0 border-b border-dashed border-neutral-200 rounded-none px-0 text-xl focus-visible:ring-0 focus-visible:border-blue-500 placeholder:text-neutral-400 pl-8"
                            value={subtitle}
                            onChange={(e) => setSubtitle(e.target.value)}
                          />
                          <div className="absolute right-0 top-0 flex items-center h-full">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="flex items-center gap-1 bg-black text-white"
                              onClick={generateSubtitle}
                              disabled={isGeneratingSubtitle}
                            >
                              {isGeneratingSubtitle ? (
                                <>
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                  <span className="hidden sm:inline">Generating...</span>
                                </>
                              ) : (
                                <>
                                  <Wand2 className="h-4 w-4" />
                                  <span className="hidden sm:inline">Generate subtitle with AI</span>
                                </>
                              )}
                            </Button>
                          </div>
                        </div>

                        <div>
                          <Textarea
                            ref={contentRef}
                            placeholder="Start writing your amazing content here..."
                            className="min-h-[600px] resize-y border-0 focus-visible:ring-0 p-0 text-lg leading-relaxed placeholder:text-neutral-400 font-mono"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                          />
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="preview" className="p-0 m-0">
                      <div className="p-6">
                        <div className="prose prose-lg max-w-none">
                          {title ? (
                            <h1 className="text-3xl font-bold mb-2 text-gray-900">{title}</h1>
                          ) : (
                            <div className="text-3xl font-bold text-neutral-300 mb-2">Your Title Here</div>
                          )}
                          
                          {subtitle && (
                            <h2 className="text-xl text-gray-700 mb-6">{subtitle}</h2>
                          )}

                          {featuredImage && (
                            <div className="relative w-full h-60 rounded-lg overflow-hidden my-6">
                              <Image
                                src={featuredImage}
                                alt="Featured"
                                fill
                                className="object-cover"
                              />
                            </div>
                          )}

                          {content ? (
                            <div
                              className="prose-content"
                              dangerouslySetInnerHTML={{
                                __html: parseMarkdown(content),
                              }}
                            />
                          ) : (
                            <div className="text-neutral-400">Your content will appear here...</div>
                          )}

                          {featuredVideo && (
                            <div className="w-full my-6">
                              <video controls className="w-full rounded-lg h-[300px]">
                                <source src={featuredVideo} type="video/mp4" />
                                Your browser does not support the video tag.
                              </video>
                            </div>
                          )}

                          {galleryImages.length > 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                              {galleryImages.map((img, index) => (
                                <div key={index} className="relative h-40 rounded-lg overflow-hidden">
                                  <Image
                                    src={img}
                                    alt={`Gallery image ${index + 1}`}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              {/* Excerpt Section */}
              <Card className="mt-6">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-blue-500" />
                      Post Excerpt
                    </CardTitle>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="flex items-center gap-1"
                      onClick={generateExcerpt}
                      disabled={isGeneratingExcerpt}
                    >
                      {isGeneratingExcerpt ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          <span className="hidden sm:inline">Generating...</span>
                        </>
                      ) : (
                        <>
                          <Bot className="h-4 w-4" />
                          <span className="hidden sm:inline">Generate with AI</span>
                        </>
                      )}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Write a compelling summary that will appear in search results and blog listings..."
                    className="resize-none h-24"
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                  />
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar - Fixed Position */}
          {!isMobile ? (
            <div className="lg:col-span-1 h-[calc(100vh-100px)] overflow-y-auto sticky top-28 hidden-scrollbar">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <SidebarContent />
              </motion.div>
            </div>
          ) : (
            <Drawer open={isMobileSidebarOpen} onOpenChange={setIsMobileSidebarOpen}>
              <DrawerContent className="h-[90vh] p-4">
                <div className="overflow-y-auto">
                  <SidebarContent />
                </div>
                <Button 
                  className="mt-4 w-full" 
                  onClick={() => setIsMobileSidebarOpen(false)}
                >
                  Close Settings
                </Button>
              </DrawerContent>
            </Drawer>
          )}
        </div>
      </div>
    </div>
  );
}