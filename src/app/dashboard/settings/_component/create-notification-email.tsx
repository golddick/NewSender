// "use client"

// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Switch } from "@/components/ui/switch"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
// import {
//   ArrowLeft,
//   Save,
//   Send,
//   Eye,
//   Mail,
//   FileText,
//   Shield,
//   CreditCard,
//   Award,
//   Zap,
//   BookOpen,
//   Megaphone,
//   Target,
//   Clock,
//   AlertCircle,
//   Settings,
//   Copy,
//   ExternalLink,
//   Sparkles,
// } from "lucide-react"
// import Link from "next/link"
// import { useToast } from "@/hooks/use-toast"

// // Notification templates with default content
// const notificationTemplates = {
//   WELCOME: {
//     icon: Mail,
//     color: "bg-blue-100 text-blue-800",
//     title: "Welcome Email",
//     description: "Greet new users and guide them through onboarding",
//     defaultSubject: "Welcome to TheNews! 🎉",
//     defaultContent: {
//       title: "Welcome to TheNews!",
//       subtitle: "Your journey to better newsletters starts here",
//       mainHeading: "Hello and Welcome!",
//       mainContent: `We're thrilled to have you join our community! Your account has been successfully created, and you're now ready to explore all the amazing features we have to offer.`,
//       features: [
//         "Complete your profile setup",
//         "Create your first newsletter campaign",
//         "Explore our template gallery",
//         "Connect your integrations",
//         "Join our community discussions",
//       ],
//       ctaText: "Get Started Now",
//       ctaUrl: "#",
//     },
//   },
//   BLOG_APPROVAL: {
//     icon: FileText,
//     color: "bg-green-100 text-green-800",
//     title: "Blog Post Approval",
//     description: "Notify users when their blog posts are approved",
//     defaultSubject: "🎉 Your Blog Post Has Been Approved!",
//     defaultContent: {
//       title: "Blog Post Approved!",
//       subtitle: "Your content is now live on TheNews",
//       mainHeading: "Congratulations!",
//       mainContent: `Your blog post has been reviewed and approved by our editorial team. It will now be featured on TheNews main blog page and will be visible to our community.`,
//       details: {
//         "Post Title": "{{POST_TITLE}}",
//         "Approved By": "{{APPROVED_BY}}",
//         "Publish Date": "{{PUBLISH_DATE}}",
//         Category: "{{CATEGORY}}",
//         "Estimated Views": "{{ESTIMATED_VIEWS}}",
//       },
//       ctaText: "View Your Post",
//       ctaUrl: "#",
//     },
//   },
//   KYC_APPROVAL: {
//     icon: Shield,
//     color: "bg-purple-100 text-purple-800",
//     title: "KYC Verification",
//     description: "Notify users about KYC verification status",
//     defaultSubject: "✅ KYC Verification Completed Successfully",
//     defaultContent: {
//       title: "KYC Verification Complete",
//       subtitle: "Your account has been verified",
//       mainHeading: "Verification Successful!",
//       mainContent: `Congratulations! Your KYC verification has been completed and approved. Your account limits have been increased and all premium features are now available.`,
//       details: {
//         "Verification Type": "{{VERIFICATION_TYPE}}",
//         "Approved By": "{{APPROVED_BY}}",
//         "New Monthly Email Limit": "{{EMAIL_LIMIT}}",
//         "New Subscriber Limit": "{{SUBSCRIBER_LIMIT}}",
//         Integrations: "{{INTEGRATION_LIMIT}}",
//       },
//       ctaText: "Access Premium Features",
//       ctaUrl: "#",
//     },
//   },
//   PAYMENT_SUCCESS: {
//     icon: CreditCard,
//     color: "bg-green-100 text-green-800",
//     title: "Payment Confirmation",
//     description: "Confirm successful payments and plan activations",
//     defaultSubject: "💳 Payment Successful - Premium Plan Activated",
//     defaultContent: {
//       title: "Payment Successful!",
//       subtitle: "Your premium plan is now active",
//       mainHeading: "Thank You for Your Payment",
//       mainContent: `Your payment has been processed successfully. Your premium plan is now active and all premium features are available for immediate use.`,
//       details: {
//         "Amount Paid": "{{AMOUNT}}",
//         Plan: "{{PLAN_NAME}}",
//         "Billing Cycle": "{{BILLING_CYCLE}}",
//         "Next Billing Date": "{{NEXT_BILLING}}",
//         "Transaction ID": "{{TRANSACTION_ID}}",
//       },
//       ctaText: "Access Premium Features",
//       ctaUrl: "#",
//     },
//   },
//   CAMPAIGN_ALERT: {
//     icon: Target,
//     color: "bg-yellow-100 text-yellow-800",
//     title: "Campaign Performance Alert",
//     description: "Notify about high or low performing campaigns",
//     defaultSubject: "📈 Campaign Performance Alert",
//     defaultContent: {
//       title: "Campaign Performance Update",
//       subtitle: "Your campaign metrics are ready",
//       mainHeading: "Performance Alert",
//       mainContent: `Your email campaign is showing significant performance metrics that require your attention. Here are the latest statistics and insights.`,
//       details: {
//         "Campaign Name": "{{CAMPAIGN_NAME}}",
//         "Open Rate": "{{OPEN_RATE}}",
//         "Click Rate": "{{CLICK_RATE}}",
//         "Total Sent": "{{TOTAL_SENT}}",
//         "Total Opens": "{{TOTAL_OPENS}}",
//         "Total Clicks": "{{TOTAL_CLICKS}}",
//       },
//       ctaText: "View Campaign Details",
//       ctaUrl: "#",
//     },
//   },
//   SECURITY_ALERT: {
//     icon: AlertCircle,
//     color: "bg-red-100 text-red-800",
//     title: "Security Alert",
//     description: "Important security notifications and alerts",
//     defaultSubject: "🔒 Security Alert: Account Activity Detected",
//     defaultContent: {
//       title: "Security Alert",
//       subtitle: "Important account activity detected",
//       mainHeading: "Account Security Notice",
//       mainContent: `We detected important activity on your account that requires your attention. Please review the details below and take appropriate action if necessary.`,
//       details: {
//         "Activity Type": "{{ACTIVITY_TYPE}}",
//         "Date & Time": "{{ACTIVITY_TIME}}",
//         "IP Address": "{{IP_ADDRESS}}",
//         Location: "{{LOCATION}}",
//         Device: "{{DEVICE}}",
//       },
//       ctaText: "Secure My Account",
//       ctaUrl: "#",
//     },
//   },
//   INTEGRATION_SUCCESS: {
//     icon: Zap,
//     color: "bg-blue-100 text-blue-800",
//     title: "Integration Connected",
//     description: "Confirm successful integration connections",
//     defaultSubject: "🔗 Integration Connected Successfully",
//     defaultContent: {
//       title: "Integration Successful!",
//       subtitle: "Your integration is now active",
//       mainHeading: "Connection Established",
//       mainContent: `Your integration has been successfully connected to TheNews. You can now sync your data and create targeted campaigns with your connected service.`,
//       details: {
//         "Integration Type": "{{INTEGRATION_TYPE}}",
//         "Connected Service": "{{SERVICE_NAME}}",
//         "Synced Records": "{{SYNCED_RECORDS}}",
//         "Last Sync": "{{LAST_SYNC}}",
//         Status: "{{STATUS}}",
//       },
//       ctaText: "Manage Integration",
//       ctaUrl: "#",
//     },
//   },
//   SUBSCRIPTION_REMINDER: {
//     icon: Clock,
//     color: "bg-orange-100 text-orange-800",
//     title: "Subscription Reminder",
//     description: "Remind users about upcoming renewals or expirations",
//     defaultSubject: "⏰ Subscription Renewal Reminder",
//     defaultContent: {
//       title: "Subscription Reminder",
//       subtitle: "Your subscription needs attention",
//       mainHeading: "Renewal Notice",
//       mainContent: `Your subscription will renew soon. Please review your plan details and ensure your payment method is up to date to avoid any service interruption.`,
//       details: {
//         Plan: "{{PLAN_NAME}}",
//         "Renewal Date": "{{RENEWAL_DATE}}",
//         Amount: "{{AMOUNT}}",
//         "Payment Method": "{{PAYMENT_METHOD}}",
//         Status: "{{STATUS}}",
//       },
//       ctaText: "Manage Subscription",
//       ctaUrl: "#",
//     },
//   },
//   ACHIEVEMENT: {
//     icon: Award,
//     color: "bg-yellow-100 text-yellow-800",
//     title: "Achievement Unlocked",
//     description: "Celebrate user milestones and achievements",
//     defaultSubject: "🏆 Achievement Unlocked!",
//     defaultContent: {
//       title: "Achievement Unlocked!",
//       subtitle: "You've reached a new milestone",
//       mainHeading: "Congratulations!",
//       mainContent: `You've achieved a significant milestone in your journey with TheNews. Your dedication and engagement have earned you a special recognition and rewards.`,
//       details: {
//         Achievement: "{{ACHIEVEMENT_NAME}}",
//         Milestone: "{{MILESTONE}}",
//         Reward: "{{REWARD}}",
//         Badge: "{{BADGE_ICON}}",
//         "Next Milestone": "{{NEXT_MILESTONE}}",
//       },
//       ctaText: "View Achievement",
//       ctaUrl: "#",
//     },
//   },
//   NEWSLETTER: {
//     icon: BookOpen,
//     color: "bg-indigo-100 text-indigo-800",
//     title: "Newsletter Template",
//     description: "Regular newsletter content template",
//     defaultSubject: "📰 Weekly Newsletter - {{DATE}}",
//     defaultContent: {
//       title: "Weekly Newsletter",
//       subtitle: "Your weekly dose of insights",
//       mainHeading: "This Week's Highlights",
//       mainContent: `Here are the most important updates, insights, and stories from this week that you should know about.`,
//       features: [
//         "Industry news and updates",
//         "Product announcements",
//         "Community highlights",
//         "Tips and best practices",
//         "Upcoming events",
//       ],
//       ctaText: "Read Full Newsletter",
//       ctaUrl: "#",
//     },
//   },
//   PROMOTIONAL: {
//     icon: Megaphone,
//     color: "bg-pink-100 text-pink-800",
//     title: "Promotional Email",
//     description: "Marketing and promotional content template",
//     defaultSubject: "🎉 Special Offer - Limited Time Only!",
//     defaultContent: {
//       title: "Special Promotion!",
//       subtitle: "Limited time offer just for you",
//       mainHeading: "Don't Miss Out!",
//       mainContent: `We have an exclusive offer that's too good to pass up. Take advantage of this limited-time promotion and unlock amazing value.`,
//       details: {
//         Offer: "{{OFFER_DETAILS}}",
//         Discount: "{{DISCOUNT_AMOUNT}}",
//         "Valid Until": "{{EXPIRY_DATE}}",
//         "Promo Code": "{{PROMO_CODE}}",
//         Terms: "{{TERMS_CONDITIONS}}",
//       },
//       ctaText: "Claim Offer Now",
//       ctaUrl: "#",
//     },
//   },
// }

// type NotificationTemplateKey = keyof typeof notificationTemplates;

// interface FormDataState {
//   title: string;
//   subject: string;
//   priority: string;
//   type: string;
//   category: NotificationTemplateKey | string; // or just string if you prefer
//   content: {
//     title: string;
//     subtitle: string;
//     mainHeading: string;
//     mainContent: string;
//     features: string[];
//     details: Record<string, string>;
//     ctaText: string;
//     ctaUrl: string;
//   };
//   settings: {
//     trackOpens: boolean;
//     trackClicks: boolean;
//     enableUnsubscribe: boolean;
//     sendImmediately: boolean;
//     scheduleDate: string;
//     scheduleTime: string;
//   };
//   recipients: {
//     type: string;
//     specificUsers: string;
//     conditions: string[];
//   };
// }



// export function CreateNotificationEmail() {
//   const [selectedTemplate, setSelectedTemplate] = useState<string>("")
//   const [formData, setFormData] = useState<FormDataState>({
//     title: "",
//     subject: "",
//     priority: "MEDIUM",
//     type: "SYSTEM",
//     category: "",
//     content: {
//       title: "",
//       subtitle: "",
//       mainHeading: "",
//       mainContent: "",
//       features: [] as string[],
//       details: {} as Record<string, string>,
//       ctaText: "",
//       ctaUrl: "",
//     },
//     settings: {
//       trackOpens: true,
//       trackClicks: true,
//       enableUnsubscribe: true,
//       sendImmediately: true,
//       scheduleDate: "",
//       scheduleTime: "",
//     },
//     recipients: {
//       type: "ALL_USERS",
//       specificUsers: "",
//       conditions: [] as string[],
//     },
//   })
//   const [previewHtml, setPreviewHtml] = useState("")
//   const { toast } = useToast()

// const handleTemplateSelect = (templateKey: NotificationTemplateKey) => {
//   const template = notificationTemplates[templateKey];
//   if (template) {
//     setSelectedTemplate(templateKey);
//     setFormData((prev) => ({
//       ...prev,
//       title: template.title,
//       subject: template.defaultSubject,
//       category: templateKey, // Now this matches the expected type
//       type: templateKey === "NEWSLETTER" || templateKey === "PROMOTIONAL" ? "EMAIL" : "SYSTEM",
//       content: { ...template.defaultContent },
//     }));
//     generatePreviewHtml(template.defaultContent, template.title);
//   }
// };

//   const generatePreviewHtml = (content: any, templateTitle: string) => {
//     const html = `
    //   <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
    //     <div style="background: #000000; color: #ffffff; padding: 30px 20px; text-align: center;">
    //       <h1 style="margin: 0; font-size: 28px; font-weight: bold;">${content.title}</h1>
    //       <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">${content.subtitle}</p>
    //     </div>
    //     <div style="padding: 40px 30px;">
    //       <h2 style="color: #333333; margin-bottom: 20px; font-size: 24px;">${content.mainHeading}</h2>
    //       <p style="color: #666666; line-height: 1.6; margin-bottom: 25px; font-size: 16px;">
    //         ${content.mainContent}
    //       </p>
          
    //       ${
    //         content.features && content.features.length > 0
    //           ? `
    //         <div style="background: #f8f9fa; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #EAB308;">
    //           <h3 style="color: #333333; margin-top: 0; font-size: 20px;">Key Features:</h3>
    //           <ul style="color: #666666; line-height: 1.8; padding-left: 20px;">
    //             ${content.features.map((feature: string) => `<li>${feature}</li>`).join("")}
    //           </ul>
    //         </div>
    //       `
    //           : ""
    //       }

    //       ${
    //         content.details && Object.keys(content.details).length > 0
    //           ? `
    //         <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 25px 0;">
    //           <h4 style="color: #333333; margin-top: 0; font-size: 16px;">Details:</h4>
    //           <div style="color: #666666; line-height: 1.6;">
    //             ${Object.entries(content.details)
    //               .map(([key, value]) => `<p><strong>${key}:</strong> ${value}</p>`)
    //               .join("")}
    //           </div>
    //         </div>
    //       `
    //           : ""
    //       }

    //       ${
    //         content.ctaText
    //           ? `
    //         <div style="text-align: center; margin: 35px 0;">
    //           <a href="${content.ctaUrl}" style="background: #EAB308; color: #000000; padding: 15px 35px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; font-size: 16px;">
    //             ${content.ctaText}
    //           </a>
    //         </div>
    //       `
    //           : ""
    //       }

    //       <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eeeeee;">
    //         <p style="color: #999999; font-size: 14px; margin: 0;">
    //           Best regards,<br>
    //           <strong>The TheNews Team</strong>
    //         </p>
    //       </div>
    //     </div>
    //     <div style="background: #f8f9fa; padding: 25px; text-align: center; color: #666666; font-size: 14px;">
    //       <p style="margin: 0 0 10px 0;">© 2024 TheNews. All rights reserved.</p>
    //       <p style="margin: 0;">
    //         <a href="#" style="color: #666666; text-decoration: none;">Unsubscribe</a> | 
    //         <a href="#" style="color: #666666; text-decoration: none;">Update Preferences</a>
    //       </p>
    //     </div>
    //   </div>
//     `
//     setPreviewHtml(html)
//   }

//   const handleContentChange = (field: string, value: any) => {
//     setFormData((prev) => ({
//       ...prev,
//       content: {
//         ...prev.content,
//         [field]: value,
//       },
//     }))
//     generatePreviewHtml({ ...formData.content, [field]: value }, formData.title)
//   }

//   const handleAddFeature = () => {
//     const newFeature = "New feature item"
//     setFormData((prev) => ({
//       ...prev,
//       content: {
//         ...prev.content,
//         features: [...prev.content.features, newFeature],
//       },
//     }))
//   }

//   const handleRemoveFeature = (index: number) => {
//     setFormData((prev) => ({
//       ...prev,
//       content: {
//         ...prev.content,
//         features: prev.content.features.filter((_, i) => i !== index),
//       },
//     }))
//   }

//   const handleFeatureChange = (index: number, value: string) => {
//     setFormData((prev) => ({
//       ...prev,
//       content: {
//         ...prev.content,
//         features: prev.content.features.map((feature, i) => (i === index ? value : feature)),
//       },
//     }))
//   }

//   const handleAddDetail = () => {
//     const key = `Detail ${Object.keys(formData.content.details).length + 1}`
//     setFormData((prev) => ({
//       ...prev,
//       content: {
//         ...prev.content,
//         details: {
//           ...prev.content.details,
//           [key]: "Detail value",
//         },
//       },
//     }))
//   }

//   const handleRemoveDetail = (key: string) => {
//     setFormData((prev) => ({
//       ...prev,
//       content: {
//         ...prev.content,
//         details: Object.fromEntries(Object.entries(prev.content.details).filter(([k]) => k !== key)),
//       },
//     }))
//   }

//   const handleDetailChange = (oldKey: string, newKey: string, value: string) => {
//     setFormData((prev) => {
//       const newDetails = { ...prev.content.details }
//       delete newDetails[oldKey]
//       newDetails[newKey] = value
//       return {
//         ...prev,
//         content: {
//           ...prev.content,
//           details: newDetails,
//         },
//       }
//     })
//   }

//   const handleSave = () => {
//     toast({
//       title: "Notification Template Saved",
//       description: "Your notification email template has been saved successfully.",
//     })
//   }

//   const handleSend = () => {
//     toast({
//       title: "Notification Sent",
//       description: "Your notification email has been sent to the selected recipients.",
//     })
//   }

//   const handleCopyHtml = () => {
//     navigator.clipboard.writeText(previewHtml)
//     toast({
//       title: "HTML Copied",
//       description: "The email HTML has been copied to your clipboard.",
//     })
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <div className="bg-black text-white p-6">
//         <div className="max-w-7xl mx-auto">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center">
//               <Link href="/notifications" className="mr-4">
//                 <Button variant="ghost" size="sm" className="text-white hover:bg-gray-800">
//                   <ArrowLeft className="w-4 h-4 mr-2" />
//                   Back to Notifications
//                 </Button>
//               </Link>
//               <div>
//                 <h1 className="text-3xl font-bold flex items-center">
//                   <Sparkles className="w-8 h-8 mr-3" />
//                   Create Notification Email
//                 </h1>
//                 <p className="text-gray-300 mt-2">Design and send notification emails with pre-built templates</p>
//               </div>
//             </div>
//             <div className="flex items-center space-x-2">
//               <Badge variant="outline" className="bg-yellow-500 text-black border-yellow-500">
//                 {formData.type} Notification
//               </Badge>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto p-6">
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           {/* Main Content */}
//           <div className="lg:col-span-2 space-y-6">
//             {/* Template Selection */}
//             <Card className="border-0 shadow-lg">
//               <CardHeader className="bg-black text-white">
//                 <CardTitle className="flex items-center">
//                   <Mail className="w-5 h-5 mr-2" />
//                   Choose Template
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="p-6">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   {Object.entries(notificationTemplates).map(([key, template]) => {
//                     const Icon = template.icon
//                     return (
//                       <div
//                         key={key}
//                         className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
//                           selectedTemplate === key
//                             ? "border-yellow-500 bg-yellow-50"
//                             : "border-gray-200 hover:border-gray-300"
//                         }`}
//                         onClick={() => handleTemplateSelect(key)}
//                       >
//                         <div className="flex items-center mb-3">
//                           <div className={`p-2 rounded-full mr-3 ${template.color}`}>
//                             <Icon className="w-5 h-5" />
//                           </div>
//                           <h3 className="text-lg font-semibold text-black">{template.title}</h3>
//                         </div>
//                         <p className="text-gray-600 text-sm">{template.description}</p>
//                       </div>
//                     )
//                   })}
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Content Editor */}
//             {selectedTemplate && (
//               <Card className="border-0 shadow-lg">
//                 <CardHeader className="bg-black text-white">
//                   <CardTitle className="flex items-center">
//                     <FileText className="w-5 h-5 mr-2" />
//                     Email Content
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent className="p-6">
//                   <Tabs defaultValue="basic" className="w-full">
//                     <TabsList className="grid w-full grid-cols-3">
//                       <TabsTrigger value="basic">Basic Info</TabsTrigger>
//                       <TabsTrigger value="content">Content</TabsTrigger>
//                       <TabsTrigger value="advanced">Advanced</TabsTrigger>
//                     </TabsList>

//                     <TabsContent value="basic" className="space-y-4 mt-4">
//                       <div>
//                         <Label htmlFor="title" className="text-black font-medium">
//                           Notification Title *
//                         </Label>
//                         <Input
//                           id="title"
//                           value={formData.title}
//                           onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
//                           placeholder="Enter notification title"
//                           className="mt-2 border-gray-300 focus:border-yellow-500 focus:ring-yellow-500"
//                         />
//                       </div>

//                       <div>
//                         <Label htmlFor="subject" className="text-black font-medium">
//                           Email Subject *
//                         </Label>
//                         <Input
//                           id="subject"
//                           value={formData.subject}
//                           onChange={(e) => setFormData((prev) => ({ ...prev, subject: e.target.value }))}
//                           placeholder="Enter email subject line"
//                           className="mt-2 border-gray-300 focus:border-yellow-500 focus:ring-yellow-500"
//                         />
//                       </div>

//                       <div className="grid grid-cols-2 gap-4">
//                         <div>
//                           <Label htmlFor="priority" className="text-black font-medium">
//                             Priority
//                           </Label>
//                           <Select
//                             value={formData.priority}
//                             onValueChange={(value) => setFormData((prev) => ({ ...prev, priority: value }))}
//                           >
//                             <SelectTrigger className="mt-2 border-gray-300 focus:border-yellow-500 focus:ring-yellow-500">
//                               <SelectValue />
//                             </SelectTrigger>
//                             <SelectContent>
//                               <SelectItem value="HIGH">High Priority</SelectItem>
//                               <SelectItem value="MEDIUM">Medium Priority</SelectItem>
//                               <SelectItem value="LOW">Low Priority</SelectItem>
//                             </SelectContent>
//                           </Select>
//                         </div>

//                         <div>
//                           <Label htmlFor="type" className="text-black font-medium">
//                             Notification Type
//                           </Label>
//                           <Select
//                             value={formData.type}
//                             onValueChange={(value) => setFormData((prev) => ({ ...prev, type: value }))}
//                           >
//                             <SelectTrigger className="mt-2 border-gray-300 focus:border-yellow-500 focus:ring-yellow-500">
//                               <SelectValue />
//                             </SelectTrigger>
//                             <SelectContent>
//                               <SelectItem value="EMAIL">Email Notification</SelectItem>
//                               <SelectItem value="SYSTEM">System Notification</SelectItem>
//                               <SelectItem value="PUSH">Push Notification</SelectItem>
//                             </SelectContent>
//                           </Select>
//                         </div>
//                       </div>
//                     </TabsContent>

//                     <TabsContent value="content" className="space-y-4 mt-4">
//                       <div>
//                         <Label htmlFor="email-title" className="text-black font-medium">
//                           Email Title
//                         </Label>
//                         <Input
//                           id="email-title"
//                           value={formData.content.title}
//                           onChange={(e) => handleContentChange("title", e.target.value)}
//                           placeholder="Main email title"
//                           className="mt-2 border-gray-300 focus:border-yellow-500 focus:ring-yellow-500"
//                         />
//                       </div>

//                       <div>
//                         <Label htmlFor="subtitle" className="text-black font-medium">
//                           Subtitle
//                         </Label>
//                         <Input
//                           id="subtitle"
//                           value={formData.content.subtitle}
//                           onChange={(e) => handleContentChange("subtitle", e.target.value)}
//                           placeholder="Email subtitle"
//                           className="mt-2 border-gray-300 focus:border-yellow-500 focus:ring-yellow-500"
//                         />
//                       </div>

//                       <div>
//                         <Label htmlFor="main-heading" className="text-black font-medium">
//                           Main Heading
//                         </Label>
//                         <Input
//                           id="main-heading"
//                           value={formData.content.mainHeading}
//                           onChange={(e) => handleContentChange("mainHeading", e.target.value)}
//                           placeholder="Main content heading"
//                           className="mt-2 border-gray-300 focus:border-yellow-500 focus:ring-yellow-500"
//                         />
//                       </div>

//                       <div>
//                         <Label htmlFor="main-content" className="text-black font-medium">
//                           Main Content
//                         </Label>
//                         <Textarea
//                           id="main-content"
//                           value={formData.content.mainContent}
//                           onChange={(e) => handleContentChange("mainContent", e.target.value)}
//                           placeholder="Main email content"
//                           rows={4}
//                           className="mt-2 border-gray-300 focus:border-yellow-500 focus:ring-yellow-500"
//                         />
//                       </div>

//                       {/* Features List */}
//                       <div>
//                         <div className="flex items-center justify-between mb-2">
//                           <Label className="text-black font-medium">Features/Points</Label>
//                           <Button
//                             type="button"
//                             variant="outline"
//                             size="sm"
//                             onClick={handleAddFeature}
//                             className="border-gray-300 hover:bg-gray-50 bg-transparent"
//                           >
//                             Add Feature
//                           </Button>
//                         </div>
//                         <div className="space-y-2">
//                           {formData.content.features.map((feature, index) => (
//                             <div key={index} className="flex items-center space-x-2">
//                               <Input
//                                 value={feature}
//                                 onChange={(e) => handleFeatureChange(index, e.target.value)}
//                                 placeholder="Feature description"
//                                 className="border-gray-300 focus:border-yellow-500 focus:ring-yellow-500"
//                               />
//                               <Button
//                                 type="button"
//                                 variant="outline"
//                                 size="sm"
//                                 onClick={() => handleRemoveFeature(index)}
//                                 className="border-red-300 text-red-600 hover:bg-red-50"
//                               >
//                                 Remove
//                               </Button>
//                             </div>
//                           ))}
//                         </div>
//                       </div>

//                       {/* Details */}
//                       <div>
//                         <div className="flex items-center justify-between mb-2">
//                           <Label className="text-black font-medium">Details/Metadata</Label>
//                           <Button
//                             type="button"
//                             variant="outline"
//                             size="sm"
//                             onClick={handleAddDetail}
//                             className="border-gray-300 hover:bg-gray-50 bg-transparent"
//                           >
//                             Add Detail
//                           </Button>
//                         </div>
//                         <div className="space-y-2">
//                           {Object.entries(formData.content.details).map(([key, value]) => (
//                             <div key={key} className="grid grid-cols-2 gap-2">
//                               <Input
//                                 value={key}
//                                 onChange={(e) => handleDetailChange(key, e.target.value, value)}
//                                 placeholder="Detail key"
//                                 className="border-gray-300 focus:border-yellow-500 focus:ring-yellow-500"
//                               />
//                               <div className="flex items-center space-x-2">
//                                 <Input
//                                   value={value}
//                                   onChange={(e) => handleDetailChange(key, key, e.target.value)}
//                                   placeholder="Detail value"
//                                   className="border-gray-300 focus:border-yellow-500 focus:ring-yellow-500"
//                                 />
//                                 <Button
//                                   type="button"
//                                   variant="outline"
//                                   size="sm"
//                                   onClick={() => handleRemoveDetail(key)}
//                                   className="border-red-300 text-red-600 hover:bg-red-50"
//                                 >
//                                   Remove
//                                 </Button>
//                               </div>
//                             </div>
//                           ))}
//                         </div>
//                       </div>

//                       <div className="grid grid-cols-2 gap-4">
//                         <div>
//                           <Label htmlFor="cta-text" className="text-black font-medium">
//                             Call-to-Action Text
//                           </Label>
//                           <Input
//                             id="cta-text"
//                             value={formData.content.ctaText}
//                             onChange={(e) => handleContentChange("ctaText", e.target.value)}
//                             placeholder="Button text"
//                             className="mt-2 border-gray-300 focus:border-yellow-500 focus:ring-yellow-500"
//                           />
//                         </div>

//                         <div>
//                           <Label htmlFor="cta-url" className="text-black font-medium">
//                             Call-to-Action URL
//                           </Label>
//                           <Input
//                             id="cta-url"
//                             value={formData.content.ctaUrl}
//                             onChange={(e) => handleContentChange("ctaUrl", e.target.value)}
//                             placeholder="Button URL"
//                             className="mt-2 border-gray-300 focus:border-yellow-500 focus:ring-yellow-500"
//                           />
//                         </div>
//                       </div>
//                     </TabsContent>

//                     <TabsContent value="advanced" className="space-y-4 mt-4">
//                       <div>
//                         <Label className="text-black font-medium">Email Settings</Label>
//                         <div className="space-y-4 mt-2">
//                           <div className="flex items-center justify-between">
//                             <div>
//                               <Label className="text-sm font-medium">Track Opens</Label>
//                               <p className="text-xs text-gray-600">Monitor email opens</p>
//                             </div>
//                             <Switch
//                               checked={formData.settings.trackOpens}
//                               onCheckedChange={(checked) =>
//                                 setFormData((prev) => ({
//                                   ...prev,
//                                   settings: { ...prev.settings, trackOpens: checked },
//                                 }))
//                               }
//                             />
//                           </div>

//                           <div className="flex items-center justify-between">
//                             <div>
//                               <Label className="text-sm font-medium">Track Clicks</Label>
//                               <p className="text-xs text-gray-600">Monitor link clicks</p>
//                             </div>
//                             <Switch
//                               checked={formData.settings.trackClicks}
//                               onCheckedChange={(checked) =>
//                                 setFormData((prev) => ({
//                                   ...prev,
//                                   settings: { ...prev.settings, trackClicks: checked },
//                                 }))
//                               }
//                             />
//                           </div>

//                           <div className="flex items-center justify-between">
//                             <div>
//                               <Label className="text-sm font-medium">Include Unsubscribe Link</Label>
//                               <p className="text-xs text-gray-600">Add unsubscribe option</p>
//                             </div>
//                             <Switch
//                               checked={formData.settings.enableUnsubscribe}
//                               onCheckedChange={(checked) =>
//                                 setFormData((prev) => ({
//                                   ...prev,
//                                   settings: { ...prev.settings, enableUnsubscribe: checked },
//                                 }))
//                               }
//                             />
//                           </div>
//                         </div>
//                       </div>

//                       <div>
//                         <Label className="text-black font-medium">Recipients</Label>
//                         <Select
//                           value={formData.recipients.type}
//                           onValueChange={(value) =>
//                             setFormData((prev) => ({
//                               ...prev,
//                               recipients: { ...prev.recipients, type: value },
//                             }))
//                           }
//                         >
//                           <SelectTrigger className="mt-2 border-gray-300 focus:border-yellow-500 focus:ring-yellow-500">
//                             <SelectValue />
//                           </SelectTrigger>
//                           <SelectContent>
//                             <SelectItem value="ALL_USERS">All Users</SelectItem>
//                             <SelectItem value="ACTIVE_USERS">Active Users Only</SelectItem>
//                             <SelectItem value="PREMIUM_USERS">Premium Users Only</SelectItem>
//                             <SelectItem value="SPECIFIC_USERS">Specific Users</SelectItem>
//                           </SelectContent>
//                         </Select>
//                       </div>

//                       {formData.recipients.type === "SPECIFIC_USERS" && (
//                         <div>
//                           <Label htmlFor="specific-users" className="text-black font-medium">
//                             Specific User Emails
//                           </Label>
//                           <Textarea
//                             id="specific-users"
//                             value={formData.recipients.specificUsers}
//                             onChange={(e) =>
//                               setFormData((prev) => ({
//                                 ...prev,
//                                 recipients: { ...prev.recipients, specificUsers: e.target.value },
//                               }))
//                             }
//                             placeholder="Enter email addresses separated by commas"
//                             rows={3}
//                             className="mt-2 border-gray-300 focus:border-yellow-500 focus:ring-yellow-500"
//                           />
//                         </div>
//                       )}
//                     </TabsContent>
//                   </Tabs>
//                 </CardContent>
//               </Card>
//             )}
//           </div>

//           {/* Sidebar */}
//           <div className="space-y-6">
//             {/* Preview */}
//             <Card className="border-0 shadow-lg">
//               <CardHeader className="bg-black text-white">
//                 <CardTitle className="flex items-center">
//                   <Eye className="w-5 h-5 mr-2" />
//                   Email Preview
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="p-4">
//                 <div className="space-y-3">
//                   <Dialog>
//                     <DialogTrigger asChild>
//                       <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">
//                         <Eye className="w-4 h-4 mr-2" />
//                         Preview Email
//                       </Button>
//                     </DialogTrigger>
//                     <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
//                       <DialogHeader>
//                         <DialogTitle className="flex items-center justify-between">
//                           <span>Email Preview</span>
//                           <div className="flex items-center space-x-2">
//                             <Button variant="outline" size="sm" onClick={handleCopyHtml}>
//                               <Copy className="w-4 h-4 mr-2" />
//                               Copy HTML
//                             </Button>
//                             <Button
//                               variant="outline"
//                               size="sm"
//                               onClick={() => window.open("data:text/html," + encodeURIComponent(previewHtml), "_blank")}
//                             >
//                               <ExternalLink className="w-4 h-4 mr-2" />
//                               Open in New Tab
//                             </Button>
//                           </div>
//                         </DialogTitle>
//                       </DialogHeader>
//                       <div className="mt-4">
//                         <div className="bg-gray-50 p-4 rounded-lg mb-6">
//                           <div className="grid grid-cols-2 gap-4 text-sm">
//                             <div>
//                               <p className="text-gray-500">Subject</p>
//                               <p className="font-medium">{formData.subject}</p>
//                             </div>
//                             <div>
//                               <p className="text-gray-500">Type</p>
//                               <Badge className="text-xs">{formData.type}</Badge>
//                             </div>
//                           </div>
//                         </div>
//                         <div className="border border-gray-200 rounded-lg overflow-hidden">
//                           <div className="bg-gray-100 p-3 border-b border-gray-200">
//                             <div className="flex items-center justify-between text-sm">
//                               <div>
//                                 <p className="font-medium">Subject: {formData.subject}</p>
//                                 <p className="text-gray-600">From: TheNews Team &lt;hello@thenews.com&gt;</p>
//                               </div>
//                               <div className="text-gray-500">{new Date().toLocaleString()}</div>
//                             </div>
//                           </div>
//                           <div className="bg-white" dangerouslySetInnerHTML={{ __html: previewHtml }} />
//                         </div>
//                       </div>
//                     </DialogContent>
//                   </Dialog>

//                   <Button
//                     variant="outline"
//                     className="w-full border-gray-300 hover:bg-gray-50 bg-transparent"
//                     onClick={handleCopyHtml}
//                   >
//                     <Copy className="w-4 h-4 mr-2" />
//                     Copy HTML
//                   </Button>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Template Info */}
//             {selectedTemplate && (
//               <Card className="border-0 shadow-lg">
//                 <CardHeader className="bg-black text-white">
//                   <CardTitle className="text-sm">Selected Template</CardTitle>
//                 </CardHeader>
//                 <CardContent className="p-4">
//                   <div className="flex items-center space-x-3">
//                     <div
//                       className={`p-2 rounded-full ${
//                         notificationTemplates[selectedTemplate as keyof typeof notificationTemplates].color
//                       }`}
//                     >
//                       {(() => {
//                         const Icon = notificationTemplates[selectedTemplate as keyof typeof notificationTemplates].icon
//                         return <Icon className="w-5 h-5" />
//                       })()}
//                     </div>
//                     <div>
//                       <h4 className="font-medium text-black text-sm">
//                         {notificationTemplates[selectedTemplate as keyof typeof notificationTemplates].title}
//                       </h4>
//                       <p className="text-xs text-gray-600">
//                         {notificationTemplates[selectedTemplate as keyof typeof notificationTemplates].description}
//                       </p>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             )}

//             {/* Settings Summary */}
//             <Card className="border-0 shadow-lg">
//               <CardHeader className="bg-black text-white">
//                 <CardTitle className="flex items-center text-sm">
//                   <Settings className="w-4 h-4 mr-2" />
//                   Settings Summary
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="p-4 space-y-3">
//                 <div className="flex justify-between text-sm">
//                   <span className="text-gray-600">Priority:</span>
//                   <Badge
//                     className={`text-xs ${
//                       formData.priority === "HIGH"
//                         ? "bg-red-100 text-red-800"
//                         : formData.priority === "MEDIUM"
//                           ? "bg-yellow-100 text-yellow-800"
//                           : "bg-gray-100 text-gray-800"
//                     }`}
//                   >
//                     {formData.priority}
//                   </Badge>
//                 </div>
//                 <div className="flex justify-between text-sm">
//                   <span className="text-gray-600">Type:</span>
//                   <span className="font-medium">{formData.type}</span>
//                 </div>
//                 <div className="flex justify-between text-sm">
//                   <span className="text-gray-600">Recipients:</span>
//                   <span className="font-medium">{formData.recipients.type.replace("_", " ")}</span>
//                 </div>
//                 <div className="flex justify-between text-sm">
//                   <span className="text-gray-600">Track Opens:</span>
//                   <span className="font-medium">{formData.settings.trackOpens ? "Yes" : "No"}</span>
//                 </div>
//                 <div className="flex justify-between text-sm">
//                   <span className="text-gray-600">Track Clicks:</span>
//                   <span className="font-medium">{formData.settings.trackClicks ? "Yes" : "No"}</span>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         </div>

//         {/* Action Buttons */}
//         <div className="flex justify-between items-center pt-6 border-t border-gray-200 mt-8">
//           <div className="flex space-x-3">
//             <Button variant="outline" className="border-gray-300 hover:bg-gray-50 bg-transparent">
//               <Save className="w-4 h-4 mr-2" />
//               Save as Template
//             </Button>
//             <Button variant="outline" className="border-gray-300 hover:bg-gray-50 bg-transparent" onClick={handleSave}>
//               <Save className="w-4 h-4 mr-2" />
//               Save Draft
//             </Button>
//           </div>

//           <div className="flex space-x-3">
//             <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold" onClick={handleSend}>
//               <Send className="w-4 h-4 mr-2" />
//               Send Notification
//             </Button>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }
















"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@clerk/nextjs";
import {  NewsletterOwnerNotificationCategory, NotificationPriority, NotificationType } from "@prisma/client";
import { notificationTemplates } from "@/shared/libs/templates/newsletter-owner-notification-templates";
import { createNotification } from "@/actions/notification/notifications";
import { generateEmailHtml } from "@/shared/libs/email-templates/Notification-Email-Template";
import Link from "next/link";
import { ArrowLeft, ImageIcon, Loader2, Sparkles, X } from "lucide-react";
import Image from "next/image";
import { UploadButton } from "@/shared/utils/uploadthing";
import { useRouter } from "next/navigation";

interface EmailContent {
  title: string;
  subtitle?: string;
  body: string;
  cta: string;
  ctaUrl?: string;
  featuredImage?: string;
  features?: string[];
  details?:  Record<string, string>;
}

interface FormData {
  type: NotificationType;
  category: NewsletterOwnerNotificationCategory;
  title: string;
  subtitle: string;
  content: EmailContent;
  textContent: string;
  priority: NotificationPriority;
}

export default function CreateNotificationEmail() {
  const { user } = useUser();
  const userId = user?.id;
  const { toast } = useToast();
  const router = useRouter();
  const [featuredImage, setFeaturedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<NewsletterOwnerNotificationCategory | null>(null);
  const [previewHtml, setPreviewHtml] = useState("");
  const [formData, setFormData] = useState<FormData>({
    type: "EMAIL",
    category: "WELCOME",
    title: "",
    subtitle: "",
    content: {
      title: "",
      body: "",
      cta:  "",
      featuredImage:  "",
      details:  {},
    },
    textContent: "",
    priority: "MEDIUM",
  });

  const handleTemplateSelect = (category: NewsletterOwnerNotificationCategory) => {
    const template = notificationTemplates[category];
    if (template) {
      setSelectedTemplate(category);
      const updatedContent: EmailContent = {
        title: template.defaultContent.title || "",
        body: template.defaultContent.body || "",
        cta: template.defaultContent.cta || "",
        featuredImage: template.defaultContent.featuredImage || "",
        details: template.defaultContent.details || {},
        ...(template.defaultContent.cta && { ctaText: template.defaultContent.cta }),
        ...(template.defaultContent.details && { ctaText: template.defaultContent.details }),
        ...(template.defaultContent.ctaUrl && { ctaUrl: template.defaultContent.ctaUrl }),
        ...(template.defaultContent.features && { features: [...template.defaultContent.features] })
        
      };

      setFeaturedImage(template.defaultContent.featuredImage || null);

      
      setFormData(prev => ({
        ...prev,
        category,
        title: template.title,
        type: category === "NEWSLETTER" ? "EMAIL" : "SYSTEM",
        content: updatedContent,
      }));
      
      setPreviewHtml(generateEmailHtml(updatedContent));
    }
  };


const handleContentChange = (
  field: keyof EmailContent,
  value: string | string[] | Record<string, string>
) => {
  const updatedContent = { 
    ...formData.content, 
    [field]: value 
  };

  setFormData(prev => ({ 
    ...prev, 
    content: updatedContent 
  }));

  setPreviewHtml(generateEmailHtml(updatedContent));
};


  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = formData.content.features ? [...formData.content.features] : [];
    newFeatures[index] = value;
    handleContentChange("features", newFeatures);
  };


    const handleRemoveFeature = (index: number) => {
    const currentFeatures = formData.content.features || [];
    const newFeatures = currentFeatures.filter((_, i) => i !== index);
    handleContentChange("features", newFeatures);
    };

  const handleAddFeature = () => {
    const newFeatures = formData.content.features ? [...formData.content.features, ""] : [""];
    handleContentChange("features", newFeatures);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (!userId) {
      toast({ title: "Error", description: "You must be logged in", variant: "destructive" });
      return;
    }

    const result = await createNotification({
      ...formData,
      userId,
      htmlContent: previewHtml,
    });

    if (result.success) {
      toast({ title: "Success", description: "Notification created successfully" });
    router.push(`/dashboard/settings?tab=Notification`)
      resetTemplateSelection();
      setLoading(false);
    } else {
      toast({ title: "Error", description: result.error || "Failed to create notification", variant: "destructive" });
    }
  };

  const resetTemplateSelection = () => {
    setSelectedTemplate(null);
    setPreviewHtml("");
    setFormData({
      type: "EMAIL",
      category: "WELCOME",
      title: "",
      subtitle: "",
      content: {
        title: "",
        body: "",
        cta: "",
      },
      textContent: "",
      priority: "MEDIUM",
    });
  };

  return (
    <div className="min-h-screen bg-white ">
         <div className="w-full container mx-auto  rounded-lg shadow-lg mt-20 border flex flex-col ">

         

            <div className="p-6 space-y-10">
                  {/* Header */}
            <div className="bg-transparent text-black  ">
                <div className=" w-full">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                    <Link href="/dashboard/settings?tab=Notification" className="mr-4">
                        <Button variant="ghost" size="sm" className="text-black hover:bg-gold-600">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Notifications
                        </Button>
                    </Link>
                    <div>
                        <h1 className=" text-[15px] md:text-2xl font-bold flex items-center truncate  sm:max-w-[200px] md:max-w-full capitalize ">
                        <Sparkles className="w-4 h-4 mr-3" />
                        Create notification emails with pre-built templates
                        </h1>
                    </div>
                    </div>
                    <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="bg-gold-600 hover:bg-black hover:text-white text-black font-semibold text-xs sm:text-sm h-8 sm:h-9 md:h-10">
                        {formData.type} Notification
                    </Badge>
                    </div>
                </div>
                </div>
            </div>
            {/* Content */}
            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Template Selector */}
                {!selectedTemplate && (
                <Card className="lg:col-span-3 border-none shadow-none">
                    <CardHeader>
                    <CardTitle>Select Notification Type</CardTitle>
                    <CardDescription>Choose a template to start creating your notification</CardDescription>
                    </CardHeader>
                    <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Object.entries(notificationTemplates).map(([key, template]) => (
                        <Card
                            key={key}
                            className={`cursor-pointer hover:border-gold-600 transition-colors ${
                            selectedTemplate === key ? "border-gold-600" : ""
                            }`}
                            onClick={() => handleTemplateSelect(key as NewsletterOwnerNotificationCategory)}
                        >
                            <CardHeader>
                            <div className="flex items-center gap-2">
                                <template.icon className="w-5 h-5" />
                                <CardTitle className="text-lg">{template.title}</CardTitle>
                            </div>
                            </CardHeader>
                            <CardContent>
                            <CardDescription>{template.description}</CardDescription>
                            </CardContent>
                        </Card>
                        ))}
                    </div>
                    </CardContent>
                </Card>
                )}

                {/* Content Editor */}
                {selectedTemplate && (
                <>
                    <Card className="lg:col-span-2">
                    <CardHeader>
                        <div className="flex justify-between items-center">
                        <CardTitle>Edit Content</CardTitle>
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={resetTemplateSelection}
                            className="text-sm"
                        >
                            Change Template
                        </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                        <Label>Title</Label>
                        <Input
                            value={formData.content.title}
                            onChange={(e) => handleContentChange("title", e.target.value)}
                        />
                        </div>
                        <div>
                        <Label>Sub-Title</Label>
                        <Input
                            value={formData.content.subtitle}
                            onChange={(e) => handleContentChange("subtitle", e.target.value)}
                        />
                        </div>

                        <div>
                        <Label>Body Content</Label>
                        <Textarea
                            value={formData.content.body}
                            onChange={(e) => handleContentChange("body", e.target.value)}
                            rows={4}
                        />
                        </div>

                    
                        <div className=" flex flex-col gap-2">
                            <Label>Features</Label>
                            {formData.content.features?.map((feature, index) => (
                            <div key={index} className="flex gap-2 mb-2">
                                <Input
                                value={feature}
                                onChange={(e) => handleFeatureChange(index, e.target.value)}
                                />
                                <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={() => handleRemoveFeature(index)}
                                >
                                Remove
                                </Button>
                            </div>
                            ))}
                            <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={handleAddFeature}
                            className="mt-2 bg-black text-white"
                            >
                            Add Feature
                            </Button>
                        </div>

                        {/* Details Section */}
                            <div className="flex flex-col gap-2 mt-4">
                            <Label>Details</Label>
                            {Object.entries(formData.content.details || {}).map(([key, value], index) => (
                                <div key={index} className="flex gap-2 mb-2">
                                <Input
                                    placeholder="Key"
                                    value={key}
                                    onChange={(e) => {
                                    const newDetails = { ...formData.content.details }
                                    const val = newDetails[key]
                                    delete newDetails[key]
                                    newDetails[e.target.value] = val
                                    handleContentChange("details", newDetails)
                                    }}
                                />
                                <Input
                                    placeholder="Value"
                                    value={value}
                                    onChange={(e) => {
                                    const newDetails = { ...formData.content.details }
                                    newDetails[key] = e.target.value
                                    handleContentChange("details", newDetails)
                                    }}
                                />
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => {
                                    const newDetails = { ...formData.content.details }
                                    delete newDetails[key]
                                    handleContentChange("details", newDetails)
                                    }}
                                >
                                    Remove
                                </Button>
                                </div>
                            ))}
                            <Button
                                type="button"
                                variant="secondary"
                                size="sm"
                                onClick={() => {
                                const newDetails = { ...formData.content.details }
                                newDetails[`Key-${Object.keys(newDetails).length + 1}`] = ""
                                handleContentChange("details", newDetails)
                                }}
                                className="mt-2 bg-black text-white hover:text-black"
                            >
                                Add Detail
                            </Button>
                            </div>

                        

                        {(formData.content.cta !== undefined || 
                        formData.content.ctaUrl !== undefined ||
                        notificationTemplates[formData.category].defaultContent.cta) && (
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                            <Label>Call-to-Action Text</Label>
                            <Input
                                value={formData.content.cta || ""}
                                onChange={(e) => handleContentChange("cta", e.target.value)}
                            />
                            </div>
                            <div>
                            <Label>Call-to-Action URL</Label>
                            <Input
                                value={formData.content.ctaUrl || ""}
                                onChange={(e) => handleContentChange("ctaUrl", e.target.value)}
                            />
                            </div>
                        </div>
                        )}
                    </CardContent>
                    </Card>

                    {/* Preview Panel */}
                    <div className="space-y-6">
                    <Card>
                        <CardHeader>
                        <CardTitle>Settings</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                        <div>
                            <Label>Notification Type</Label>
                            <Select
                            value={formData.type}
                            onValueChange={(v) => setFormData(prev => ({ ...prev, type: v as NotificationType }))}
                            >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="EMAIL">Email</SelectItem>
                                <SelectItem value="SYSTEM">System</SelectItem>
                            </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label>Priority</Label>
                            <Select
                            value={formData.priority}
                            onValueChange={(v) => setFormData(prev => ({ ...prev, priority: v as NotificationPriority }))}
                            >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="HIGH">High</SelectItem>
                                <SelectItem value="MEDIUM">Medium</SelectItem>
                                <SelectItem value="LOW">Low</SelectItem>
                            </SelectContent>
                            </Select>
                        </div>
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
                                onClick={() => {
                                    setFeaturedImage(null);
                                    handleContentChange("featuredImage", ""); 
                                }}>
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
                                        const imageUrl = res[0].url;
                                        setFeaturedImage(imageUrl);
                                        handleContentChange("featuredImage", imageUrl); 
                                        setIsUploading(false);
                                        toast({
                                            title: "Image uploaded",
                                            description: "Featured image has been uploaded successfully.",
                                        });
                                        }
                                    }}
                                    onUploadError={(error: Error) => {
                                        setIsUploading(false);
                                        toast({
                                        title: "Upload error",
                                        description: error.message,
                                        variant: "destructive",
                                        });
                                    }}
                                    onUploadBegin={() => {
                                        setIsUploading(true);
                                    }}
                                    />
                                )}
                            </div>
                            )}
                        </div>

                        <Button type="submit" className="w-full bg-yellow-500 text-black hover:bg-yellow-600">
                            {
                                loading? (
                                    <div className="flex items-center gap-2">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Saving...
                                    </div>
                                ) : (
                                    "Create Notification"
                                )}
                            
                        </Button>
                        </CardContent>
                    </Card>

                    
                    </div>
                </>
                )}
            </form>
            {/* Preview Panel */}
            {
                previewHtml && (
                        <Card>
                        <CardHeader>
                        <CardTitle>Preview</CardTitle>
                        </CardHeader>
                        <CardContent>
                        <div className="border p-4 rounded bg-white">
                            {previewHtml ? (
                            <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
                            ) : (
                            <p className="text-gray-500 text-center py-8">Select a template to see preview</p>
                            )}
                        </div>
                        </CardContent>
                    </Card>
                )
            }
            
            </div>
         </div>
    </div>

 
  );
}