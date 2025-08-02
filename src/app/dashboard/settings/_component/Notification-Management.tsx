// "use client"

// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Switch } from "@/components/ui/switch"
// import { Label } from "@/components/ui/label"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
// import {
//   Mail,
//   Search,
//   MoreHorizontal,
//   Eye,
//   Trash2,
//   Send,
//   TrendingUp,
//   Settings,
//   Bell,
//   Clock,
//   CheckCircle,
//   XCircle,
//   AlertCircle,
//   Calendar,
//   Users,
//   MousePointer,
//   Copy,
//   ExternalLink,
//   FileText,
//   Shield,
//   CreditCard,
//   Award,
//   Zap,
//   DollarSign,
//   Activity,
//   BookOpen,
//   Megaphone,
//   Target,
//   Filter,
// } from "lucide-react"
// import { useToast } from "@/hooks/use-toast"

// // Mock data for different notification types
// const mockNotifications = [
//   // Email Notifications
//   {
//     id: "1",
//     type: "EMAIL",
//     category: "WELCOME",
//     title: "Welcome to Our Platform - New User Onboarding",
//     content: `
//       <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
//         <div style="background: #000000; color: #ffffff; padding: 30px 20px; text-align: center;">
//           <h1 style="margin: 0; font-size: 28px; font-weight: bold;">Welcome to TheNews!</h1>
//           <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Your journey to better newsletters starts here</p>
//         </div>
//         <div style="padding: 40px 30px;">
//           <h2 style="color: #333333; margin-bottom: 20px; font-size: 24px;">Hello and Welcome!</h2>
//           <p style="color: #666666; line-height: 1.6; margin-bottom: 25px; font-size: 16px;">
//             We're thrilled to have you join our community! Your account has been successfully created, 
//             and you're now ready to explore all the amazing features we have to offer.
//           </p>
//           <div style="background: #f8f9fa; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #EAB308;">
//             <h3 style="color: #333333; margin-top: 0; font-size: 20px;">What's Next?</h3>
//             <ul style="color: #666666; line-height: 1.8; padding-left: 20px;">
//               <li>Complete your profile setup</li>
//               <li>Create your first newsletter campaign</li>
//               <li>Explore our template gallery</li>
//               <li>Connect your integrations</li>
//               <li>Join our community discussions</li>
//             </ul>
//           </div>
//           <div style="text-align: center; margin: 35px 0;">
//             <a href="#" style="background: #EAB308; color: #000000; padding: 15px 35px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; font-size: 16px;">
//               Get Started Now
//             </a>
//           </div>
//         </div>
//       </div>
//     `,
//     textContent: "Welcome to our platform! We're excited to have you join our community.",
//     status: "SENT",
//     priority: "MEDIUM",
//     userId: "user1",
//     recipient: "user@example.com",
//     emailsSent: 1250,
//     openCount: 857,
//     clickCount: 154,
//     recipients: 1250,
//     bounceCount: 25,
//     lastOpened: "2024-01-15T14:30:00Z",
//     lastClicked: "2024-01-15T15:45:00Z",
//     sentAt: "2024-01-15T10:00:00Z",
//     createdAt: "2024-01-15T09:00:00Z",
//     updatedAt: "2024-01-15T16:00:00Z",
//     read: true,
//     integration: {
//       name: "WordPress Blog",
//       logo: "🌐",
//     },
//   },
//   // Blog Post Approval Notification
//   {
//     id: "2",
//     type: "SYSTEM",
//     category: "BLOG_APPROVAL",
//     title: "🎉 Your Blog Post Has Been Approved!",
//     content:
//       "Your blog post 'Advanced Email Marketing Strategies for 2024' has been reviewed and approved by our editorial team. It will now be featured on TheNews main blog page.",
//     textContent:
//       "Your blog post 'Advanced Email Marketing Strategies for 2024' has been approved and will be featured on the main blog.",
//     status: "DELIVERED",
//     priority: "HIGH",
//     userId: "user1",
//     recipient: "blogger@example.com",
//     sentAt: "2024-01-16T09:30:00Z",
//     createdAt: "2024-01-16T09:30:00Z",
//     updatedAt: "2024-01-16T09:30:00Z",
//     read: false,
//     metadata: {
//       blogPostId: "post_123",
//       blogPostTitle: "Advanced Email Marketing Strategies for 2024",
//       approvedBy: "Editorial Team",
//       publishDate: "2024-01-17T08:00:00Z",
//       category: "Marketing",
//       estimatedViews: "5,000+",
//     },
//   },
//   // KYC Approval Notification
//   {
//     id: "3",
//     type: "SYSTEM",
//     category: "KYC_APPROVAL",
//     title: "✅ KYC Verification Completed Successfully",
//     content:
//       "Congratulations! Your KYC verification has been completed and approved. Your account limits have been increased and all premium features are now available.",
//     textContent: "Your KYC verification has been approved. Premium features are now available.",
//     status: "DELIVERED",
//     priority: "HIGH",
//     userId: "user2",
//     recipient: "verified@example.com",
//     sentAt: "2024-01-15T16:45:00Z",
//     createdAt: "2024-01-15T16:45:00Z",
//     updatedAt: "2024-01-15T16:45:00Z",
//     read: true,
//     metadata: {
//       verificationType: "Individual",
//       approvedBy: "Compliance Team",
//       newLimits: {
//         monthlyEmails: 100000,
//         subscribers: 50000,
//         integrations: "Unlimited",
//       },
//     },
//   },
//   // Payment Success Notification
//   {
//     id: "4",
//     type: "SYSTEM",
//     category: "PAYMENT_SUCCESS",
//     title: "💳 Payment Successful - Premium Plan Activated",
//     content:
//       "Your payment of $49.99 for the Premium Plan has been processed successfully. Your plan is now active and all premium features are available.",
//     textContent: "Payment successful. Premium Plan activated with all features available.",
//     status: "DELIVERED",
//     priority: "HIGH",
//     userId: "user1",
//     recipient: "premium@example.com",
//     sentAt: "2024-01-14T11:20:00Z",
//     createdAt: "2024-01-14T11:20:00Z",
//     updatedAt: "2024-01-14T11:20:00Z",
//     read: true,
//     metadata: {
//       amount: "$49.99",
//       plan: "Premium Plan",
//       billingCycle: "Monthly",
//       nextBilling: "2024-02-14T11:20:00Z",
//       transactionId: "txn_abc123",
//     },
//   },
//   // Campaign Performance Alert
//   {
//     id: "5",
//     type: "SYSTEM",
//     category: "CAMPAIGN_ALERT",
//     title: "📈 High Performance Alert: Your Campaign is Trending!",
//     content:
//       "Your newsletter campaign 'Weekly Tech Updates #47' is performing exceptionally well with a 68% open rate and 12% click rate - well above industry averages!",
//     textContent: "Your campaign is performing exceptionally well with high engagement rates.",
//     status: "DELIVERED",
//     priority: "MEDIUM",
//     userId: "user1",
//     recipient: "marketer@example.com",
//     sentAt: "2024-01-14T18:00:00Z",
//     createdAt: "2024-01-14T18:00:00Z",
//     updatedAt: "2024-01-14T18:00:00Z",
//     read: false,
//     metadata: {
//       campaignId: "camp_456",
//       campaignName: "Weekly Tech Updates #47",
//       openRate: "68%",
//       clickRate: "12%",
//       totalSent: 3420,
//       totalOpens: 2326,
//       totalClicks: 410,
//     },
//   },
//   // Security Alert
//   {
//     id: "6",
//     type: "SYSTEM",
//     category: "SECURITY_ALERT",
//     title: "🔒 Security Alert: New Login Detected",
//     content:
//       "We detected a new login to your account from a new device. If this wasn't you, please secure your account immediately.",
//     textContent: "New login detected from unknown device. Please verify if this was you.",
//     status: "DELIVERED",
//     priority: "HIGH",
//     userId: "user2",
//     recipient: "security@example.com",
//     sentAt: "2024-01-13T22:15:00Z",
//     createdAt: "2024-01-13T22:15:00Z",
//     updatedAt: "2024-01-13T22:15:00Z",
//     read: true,
//     metadata: {
//       loginTime: "2024-01-13T22:10:00Z",
//       ipAddress: "192.168.1.100",
//       location: "New York, NY",
//       device: "Chrome on Windows",
//       action: "Login Successful",
//     },
//   },
//   // Integration Success
//   {
//     id: "7",
//     type: "SYSTEM",
//     category: "INTEGRATION_SUCCESS",
//     title: "🔗 Integration Connected Successfully",
//     content:
//       "Your Shopify store has been successfully connected to TheNews. You can now sync your customer data and create targeted email campaigns.",
//     textContent: "Shopify integration connected successfully. Customer data sync is now available.",
//     status: "DELIVERED",
//     priority: "MEDIUM",
//     userId: "user1",
//     recipient: "ecommerce@example.com",
//     sentAt: "2024-01-12T14:30:00Z",
//     createdAt: "2024-01-12T14:30:00Z",
//     updatedAt: "2024-01-12T14:30:00Z",
//     read: true,
//     metadata: {
//       integrationType: "Shopify",
//       storeName: "My Awesome Store",
//       syncedCustomers: 1250,
//       syncedProducts: 89,
//       lastSync: "2024-01-12T14:25:00Z",
//     },
//   },
//   // Subscription Renewal Reminder
//   {
//     id: "8",
//     type: "SYSTEM",
//     category: "SUBSCRIPTION_REMINDER",
//     title: "⏰ Subscription Renewal Reminder",
//     content:
//       "Your Premium Plan subscription will renew in 3 days on January 17, 2024. The amount of $49.99 will be charged to your default payment method.",
//     textContent: "Premium Plan renewal in 3 days. $49.99 will be charged to your payment method.",
//     status: "DELIVERED",
//     priority: "MEDIUM",
//     userId: "user1",
//     recipient: "billing@example.com",
//     sentAt: "2024-01-14T10:00:00Z",
//     createdAt: "2024-01-14T10:00:00Z",
//     updatedAt: "2024-01-14T10:00:00Z",
//     read: false,
//     metadata: {
//       renewalDate: "2024-01-17T10:00:00Z",
//       amount: "$49.99",
//       plan: "Premium Plan",
//       paymentMethod: "•••• •••• •••• 1234",
//     },
//   },
//   // Email Newsletter
//   {
//     id: "9",
//     type: "EMAIL",
//     category: "NEWSLETTER",
//     title: "Weekly Newsletter - Tech Updates & Insights",
//     content: `
//       <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
//         <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; padding: 30px 20px; text-align: center;">
//           <h1 style="margin: 0; font-size: 28px; font-weight: bold;">Weekly Tech Insights</h1>
//           <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Issue #47 - January 14, 2024</p>
//         </div>
//         <div style="padding: 40px 30px;">
//           <h2 style="color: #333333; margin-bottom: 20px; font-size: 24px;">This Week in Technology</h2>
//           <p style="color: #666666; line-height: 1.6; margin-bottom: 25px; font-size: 16px;">
//             Here are the most important tech stories and insights from this week.
//           </p>
//         </div>
//       </div>
//     `,
//     textContent: "This week's top stories in technology and innovation.",
//     status: "SENT",
//     priority: "MEDIUM",
//     userId: "user1",
//     recipient: "newsletter@example.com",
//     emailsSent: 3420,
//     openCount: 1547,
//     clickCount: 298,
//     recipients: 3420,
//     bounceCount: 67,
//     lastOpened: "2024-01-14T16:20:00Z",
//     lastClicked: "2024-01-14T17:10:00Z",
//     sentAt: "2024-01-14T08:00:00Z",
//     createdAt: "2024-01-14T07:00:00Z",
//     updatedAt: "2024-01-14T18:00:00Z",
//     read: true,
//     integration: {
//       name: "E-commerce Store",
//       logo: "🛒",
//     },
//   },
//   // Achievement Notification
//   {
//     id: "10",
//     type: "SYSTEM",
//     category: "ACHIEVEMENT",
//     title: "🏆 Achievement Unlocked: Email Marketing Pro!",
//     content:
//       "Congratulations! You've reached 10,000 total email opens across all your campaigns. You've unlocked the 'Email Marketing Pro' badge and earned 500 bonus credits!",
//     textContent: "Achievement unlocked! You've reached 10,000 email opens and earned the Email Marketing Pro badge.",
//     status: "DELIVERED",
//     priority: "LOW",
//     userId: "user1",
//     recipient: "achiever@example.com",
//     sentAt: "2024-01-13T15:45:00Z",
//     createdAt: "2024-01-13T15:45:00Z",
//     updatedAt: "2024-01-13T15:45:00Z",
//     read: false,
//     metadata: {
//       achievement: "Email Marketing Pro",
//       milestone: "10,000 Email Opens",
//       reward: "500 Bonus Credits",
//       badgeIcon: "🏆",
//       nextMilestone: "25,000 Email Opens",
//     },
//   },
// ]

// // Notification settings mock data
// const mockNotificationSettings = {
//   emailNotifications: true,
//   pushNotifications: false,
//   smsNotifications: false,
//   weeklyDigest: true,
//   instantAlerts: true,
//   marketingEmails: false,
//   securityAlerts: true,
//   productUpdates: true,
//   newsletterReminders: true,
//   campaignReports: true,
//   lowEngagementAlerts: false,
//   highEngagementAlerts: true,
//   bounceAlerts: true,
//   unsubscribeAlerts: false,
//   blogApprovalNotifications: true,
//   kycNotifications: true,
//   paymentNotifications: true,
//   integrationNotifications: true,
//   achievementNotifications: true,
// }

// export function NotificationEmailList() {
//   const [searchTerm, setSearchTerm] = useState("")
//   const [statusFilter, setStatusFilter] = useState("all")
//   const [typeFilter, setTypeFilter] = useState("all")
//   const [categoryFilter, setCategoryFilter] = useState("all")
//   const [priorityFilter, setPriorityFilter] = useState("all")
//   const [settings, setSettings] = useState(mockNotificationSettings)
//   const [selectedNotification, setSelectedNotification] = useState<any>(null)
//   const { toast } = useToast()

//   const filteredNotifications = mockNotifications.filter((notification) => {
//     const matchesSearch =
//       notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       notification.textContent?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       notification.recipient?.toLowerCase().includes(searchTerm.toLowerCase())
//     const matchesStatus = statusFilter === "all" || notification.status === statusFilter
//     const matchesType = typeFilter === "all" || notification.type === typeFilter
//     const matchesCategory = categoryFilter === "all" || notification.category === categoryFilter
//     const matchesPriority = priorityFilter === "all" || notification.priority === priorityFilter

//     return matchesSearch && matchesStatus && matchesType && matchesCategory && matchesPriority
//   })

//   const getStatusBadge = (status: string) => {
//     const variants = {
//       SENT: { class: "bg-green-100 text-green-800 border-green-200", icon: CheckCircle },
//       DELIVERED: { class: "bg-blue-100 text-blue-800 border-blue-200", icon: CheckCircle },
//       SCHEDULED: { class: "bg-yellow-100 text-yellow-800 border-yellow-200", icon: Clock },
//       DRAFT: { class: "bg-gray-100 text-gray-800 border-gray-200", icon: AlertCircle },
//       FAILED: { class: "bg-red-100 text-red-800 border-red-200", icon: XCircle },
//       PENDING: { class: "bg-blue-100 text-blue-800 border-blue-200", icon: Clock },
//     }
//     const variant = variants[status as keyof typeof variants] || variants.DELIVERED
//     const Icon = variant.icon
//     return (
//       <Badge className={`text-xs ${variant.class} flex items-center gap-1`}>
//         <Icon className="w-3 h-3" />
//         {status}
//       </Badge>
//     )
//   }

//   const getTypeBadge = (type: string) => {
//     const variants = {
//       EMAIL: "bg-blue-100 text-blue-800 border-blue-200",
//       SYSTEM: "bg-purple-100 text-purple-800 border-purple-200",
//       PUSH: "bg-green-100 text-green-800 border-green-200",
//       SMS: "bg-orange-100 text-orange-800 border-orange-200",
//     }
//     return variants[type as keyof typeof variants] || variants.SYSTEM
//   }

//   const getCategoryIcon = (category: string) => {
//     const icons = {
//       WELCOME: Mail,
//       NEWSLETTER: BookOpen,
//       PROMOTIONAL: Megaphone,
//       TRANSACTIONAL: CreditCard,
//       BLOG_APPROVAL: FileText,
//       KYC_APPROVAL: Shield,
//       PAYMENT_SUCCESS: DollarSign,
//       CAMPAIGN_ALERT: Target,
//       SECURITY_ALERT: AlertCircle,
//       INTEGRATION_SUCCESS: Zap,
//       SUBSCRIPTION_REMINDER: Clock,
//       ACHIEVEMENT: Award,
//     }
//     return icons[category as keyof typeof icons] || Bell
//   }

//   const getPriorityBadge = (priority: string) => {
//     const variants = {
//       HIGH: "bg-red-100 text-red-800 border-red-200",
//       MEDIUM: "bg-yellow-100 text-yellow-800 border-yellow-200",
//       LOW: "bg-gray-100 text-gray-800 border-gray-200",
//     }
//     return variants[priority as keyof typeof variants] || variants.MEDIUM
//   }

//   const handleSettingChange = (key: string, value: boolean) => {
//     setSettings((prev) => ({ ...prev, [key]: value }))
//     toast({
//       title: "Settings Updated",
//       description: `${key.replace(/([A-Z])/g, " $1").toLowerCase()} ${value ? "enabled" : "disabled"}`,
//     })
//   }

//   const handleDeleteNotification = (notificationId: string) => {
//     toast({
//       title: "Notification Deleted",
//       description: "The notification has been deleted successfully.",
//     })
//   }

//   const handleMarkAsRead = (notificationId: string) => {
//     toast({
//       title: "Marked as Read",
//       description: "The notification has been marked as read.",
//     })
//   }

//   const handleCopyContent = (content: string) => {
//     navigator.clipboard.writeText(content)
//     toast({
//       title: "Content Copied",
//       description: "Notification content has been copied to clipboard.",
//     })
//   }

//   const calculateEngagementRate = (notification: any) => {
//     if (!notification.emailsSent || notification.emailsSent === 0) return 0
//     return (((notification.openCount + notification.clickCount) / notification.emailsSent) * 100).toFixed(1)
//   }

//   const calculateOpenRate = (notification: any) => {
//     if (!notification.emailsSent || notification.emailsSent === 0) return 0
//     return ((notification.openCount / notification.emailsSent) * 100).toFixed(1)
//   }

//   const unreadCount = mockNotifications.filter((n) => !n.read).length
//   const totalNotifications = mockNotifications.length
//   const emailNotifications = mockNotifications.filter((n) => n.type === "EMAIL").length
//   const systemNotifications = mockNotifications.filter((n) => n.type === "SYSTEM").length

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <div className="bg-black text-white p-6">
//         <div className="max-w-7xl mx-auto">
//           <div className="flex items-center justify-between">
//             <div>
//               <h1 className="text-3xl font-bold flex items-center">
//                 <Bell className="w-8 h-8 mr-3" />
//                 Notifications Center
//                 {unreadCount > 0 && <Badge className="ml-3 bg-red-500 text-white">{unreadCount} unread</Badge>}
//               </h1>
//               <p className="text-gray-300 mt-2">Manage all your notifications and email communications</p>
//             </div>
//             <div className="flex items-center space-x-3">
//               <Button variant="outline" className="border-gray-600 text-white hover:bg-gray-800 bg-transparent">
//                 <Filter className="w-4 h-4 mr-2" />
//                 Mark All Read
//               </Button>
//               <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">
//                 <Settings className="w-4 h-4 mr-2" />
//                 Settings
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto p-6">
//         <Tabs defaultValue="notifications" className="w-full">
//           <TabsList className="grid w-full grid-cols-2 mb-6">
//             <TabsTrigger value="notifications" className="flex items-center">
//               <Bell className="w-4 h-4 mr-2" />
//               All Notifications ({totalNotifications})
//             </TabsTrigger>
//             <TabsTrigger value="settings" className="flex items-center">
//               <Settings className="w-4 h-4 mr-2" />
//               Notification Settings
//             </TabsTrigger>
//           </TabsList>

//           {/* Notifications Tab */}
//           <TabsContent value="notifications" className="space-y-6">
//             {/* Statistics Cards */}
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//               <Card className="border-0 shadow-lg">
//                 <CardContent className="p-6">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <p className="text-sm font-medium text-gray-600">Total Notifications</p>
//                       <p className="text-3xl font-bold text-black">{totalNotifications}</p>
//                     </div>
//                     <div className="bg-blue-100 p-3 rounded-full">
//                       <Bell className="w-6 h-6 text-blue-600" />
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>

//               <Card className="border-0 shadow-lg">
//                 <CardContent className="p-6">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <p className="text-sm font-medium text-gray-600">Unread</p>
//                       <p className="text-3xl font-bold text-red-600">{unreadCount}</p>
//                     </div>
//                     <div className="bg-red-100 p-3 rounded-full">
//                       <AlertCircle className="w-6 h-6 text-red-600" />
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>

//               <Card className="border-0 shadow-lg">
//                 <CardContent className="p-6">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <p className="text-sm font-medium text-gray-600">Email Notifications</p>
//                       <p className="text-3xl font-bold text-black">{emailNotifications}</p>
//                     </div>
//                     <div className="bg-green-100 p-3 rounded-full">
//                       <Mail className="w-6 h-6 text-green-600" />
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>

//               <Card className="border-0 shadow-lg">
//                 <CardContent className="p-6">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <p className="text-sm font-medium text-gray-600">System Alerts</p>
//                       <p className="text-3xl font-bold text-black">{systemNotifications}</p>
//                     </div>
//                     <div className="bg-purple-100 p-3 rounded-full">
//                       <Activity className="w-6 h-6 text-purple-600" />
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>

//             {/* Filters */}
//             <Card className="border-0 shadow-lg">
//               <CardContent className="p-6">
//                 <div className="flex flex-col md:flex-row gap-4">
//                   <div className="flex-1">
//                     <div className="relative">
//                       <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//                       <Input
//                         placeholder="Search notifications..."
//                         value={searchTerm}
//                         onChange={(e) => setSearchTerm(e.target.value)}
//                         className="pl-10 border-gray-300 focus:border-yellow-500 focus:ring-yellow-500"
//                       />
//                     </div>
//                   </div>

//                   <div className="flex gap-3 flex-wrap">
//                     <Select value={typeFilter} onValueChange={setTypeFilter}>
//                       <SelectTrigger className="w-32 border-gray-300 focus:border-yellow-500 focus:ring-yellow-500">
//                         <SelectValue placeholder="Type" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="all">All Types</SelectItem>
//                         <SelectItem value="EMAIL">Email</SelectItem>
//                         <SelectItem value="SYSTEM">System</SelectItem>
//                         <SelectItem value="PUSH">Push</SelectItem>
//                         <SelectItem value="SMS">SMS</SelectItem>
//                       </SelectContent>
//                     </Select>

//                     <Select value={categoryFilter} onValueChange={setCategoryFilter}>
//                       <SelectTrigger className="w-40 border-gray-300 focus:border-yellow-500 focus:ring-yellow-500">
//                         <SelectValue placeholder="Category" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="all">All Categories</SelectItem>
//                         <SelectItem value="WELCOME">Welcome</SelectItem>
//                         <SelectItem value="NEWSLETTER">Newsletter</SelectItem>
//                         <SelectItem value="BLOG_APPROVAL">Blog Approval</SelectItem>
//                         <SelectItem value="KYC_APPROVAL">KYC Approval</SelectItem>
//                         <SelectItem value="PAYMENT_SUCCESS">Payment</SelectItem>
//                         <SelectItem value="CAMPAIGN_ALERT">Campaign Alert</SelectItem>
//                         <SelectItem value="SECURITY_ALERT">Security</SelectItem>
//                         <SelectItem value="ACHIEVEMENT">Achievement</SelectItem>
//                       </SelectContent>
//                     </Select>

//                     <Select value={priorityFilter} onValueChange={setPriorityFilter}>
//                       <SelectTrigger className="w-32 border-gray-300 focus:border-yellow-500 focus:ring-yellow-500">
//                         <SelectValue placeholder="Priority" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="all">All Priority</SelectItem>
//                         <SelectItem value="HIGH">High</SelectItem>
//                         <SelectItem value="MEDIUM">Medium</SelectItem>
//                         <SelectItem value="LOW">Low</SelectItem>
//                       </SelectContent>
//                     </Select>

//                     <Select value={statusFilter} onValueChange={setStatusFilter}>
//                       <SelectTrigger className="w-32 border-gray-300 focus:border-yellow-500 focus:ring-yellow-500">
//                         <SelectValue placeholder="Status" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="all">All Status</SelectItem>
//                         <SelectItem value="SENT">Sent</SelectItem>
//                         <SelectItem value="DELIVERED">Delivered</SelectItem>
//                         <SelectItem value="SCHEDULED">Scheduled</SelectItem>
//                         <SelectItem value="FAILED">Failed</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Notifications List */}
//             <div className="grid grid-cols-1 gap-4">
//               {filteredNotifications.map((notification) => {
//                 const CategoryIcon = getCategoryIcon(notification.category)
//                 return (
//                   <Card
//                     key={notification.id}
//                     className={`border-0 shadow-lg hover:shadow-xl transition-all duration-300 ${
//                       !notification.read ? "border-l-4 border-l-yellow-500 bg-yellow-50" : ""
//                     }`}
//                   >
//                     <CardContent className="p-0">
//                       <div className="p-6">
//                         <div className="flex items-start justify-between">
//                           <div className="flex items-start space-x-4 flex-1">
//                             <div
//                               className={`p-3 rounded-full ${
//                                 notification.type === "EMAIL" ? "bg-blue-100" : "bg-purple-100"
//                               }`}
//                             >
//                               <CategoryIcon
//                                 className={`w-6 h-6 ${
//                                   notification.type === "EMAIL" ? "text-blue-600" : "text-purple-600"
//                                 }`}
//                               />
//                             </div>

//                             <div className="flex-1">
//                               <div className="flex items-center space-x-3 mb-2">
//                                 <h3
//                                   className={`text-lg font-bold ${!notification.read ? "text-black" : "text-gray-800"}`}
//                                 >
//                                   {notification.title}
//                                 </h3>
//                                 {!notification.read && <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>}
//                               </div>

//                               <div className="flex items-center space-x-2 mb-3">
//                                 {getStatusBadge(notification.status)}
//                                 <Badge className={`text-xs ${getTypeBadge(notification.type)}`}>
//                                   {notification.type}
//                                 </Badge>
//                                 <Badge className={`text-xs ${getPriorityBadge(notification.priority)}`}>
//                                   {notification.priority}
//                                 </Badge>
//                               </div>

//                               <p className="text-gray-600 mb-4 text-sm leading-relaxed">{notification.textContent}</p>

//                               <div className="flex items-center space-x-6 text-sm text-gray-500 mb-4">
//                                 <div className="flex items-center space-x-1">
//                                   <Calendar className="w-4 h-4" />
//                                   <span>{new Date(notification.sentAt).toLocaleString()}</span>
//                                 </div>
//                                 <div className="flex items-center space-x-1">
//                                   <Mail className="w-4 h-4" />
//                                   <span>{notification.recipient}</span>
//                                 </div>
//                                 {notification.integration && (
//                                   <div className="flex items-center space-x-2">
//                                     <span className="text-lg">{notification.integration.logo}</span>
//                                     <span className="font-medium">{notification.integration.name}</span>
//                                   </div>
//                                 )}
//                               </div>

//                               {/* Email Performance Metrics */}
//                               {notification.type === "EMAIL" && notification.emailsSent && (
//                                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
//                                   <div className="text-center">
//                                     <div className="flex items-center justify-center mb-1">
//                                       <Users className="w-4 h-4 text-gray-500 mr-1" />
//                                     </div>
//                                     <p className="text-lg font-bold text-black">
//                                       {notification.recipients?.toLocaleString()}
//                                     </p>
//                                     <p className="text-xs text-gray-500">Recipients</p>
//                                   </div>
//                                   <div className="text-center">
//                                     <div className="flex items-center justify-center mb-1">
//                                       <Eye className="w-4 h-4 text-blue-500 mr-1" />
//                                     </div>
//                                     <p className="text-lg font-bold text-blue-600">
//                                       {notification.openCount?.toLocaleString()}
//                                     </p>
//                                     <p className="text-xs text-gray-500">{calculateOpenRate(notification)}% Opens</p>
//                                   </div>
//                                   <div className="text-center">
//                                     <div className="flex items-center justify-center mb-1">
//                                       <MousePointer className="w-4 h-4 text-purple-500 mr-1" />
//                                     </div>
//                                     <p className="text-lg font-bold text-purple-600">
//                                       {notification.clickCount?.toLocaleString()}
//                                     </p>
//                                     <p className="text-xs text-gray-500">Clicks</p>
//                                   </div>
//                                   <div className="text-center">
//                                     <div className="flex items-center justify-center mb-1">
//                                       <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
//                                     </div>
//                                     <p className="text-lg font-bold text-green-600">
//                                       {calculateEngagementRate(notification)}%
//                                     </p>
//                                     <p className="text-xs text-gray-500">Engagement</p>
//                                   </div>
//                                 </div>
//                               )}

//                               {/* System Notification Metadata */}
//                               {notification.type === "SYSTEM" && notification.metadata && (
//                                 <div className="p-4 bg-gray-50 rounded-lg">
//                                   <h4 className="font-semibold text-sm text-gray-700 mb-2">Additional Details:</h4>
//                                   <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
//                                     {Object.entries(notification.metadata).map(([key, value]) => (
//                                       <div key={key} className="flex justify-between">
//                                         <span className="text-gray-600 capitalize">
//                                           {key.replace(/([A-Z])/g, " $1").toLowerCase()}:
//                                         </span>
//                                         <span className="font-medium text-gray-800">
//                                           {typeof value === "object" ? JSON.stringify(value) : String(value)}
//                                         </span>
//                                       </div>
//                                     ))}
//                                   </div>
//                                 </div>
//                               )}
//                             </div>
//                           </div>

//                           <div className="flex items-center space-x-2 ml-4">
//                             {notification.type === "EMAIL" && (
//                               <Dialog>
//                                 <DialogTrigger asChild>
//                                   <Button
//                                     variant="outline"
//                                     size="sm"
//                                     className="border-gray-300 hover:bg-gray-50 bg-transparent"
//                                     onClick={() => setSelectedNotification(notification)}
//                                   >
//                                     <Eye className="w-4 h-4 mr-2" />
//                                     View Content
//                                   </Button>
//                                 </DialogTrigger>
//                                 <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
//                                   <DialogHeader>
//                                     <DialogTitle className="flex items-center justify-between">
//                                       <span>{selectedNotification?.title}</span>
//                                       <div className="flex items-center space-x-2">
//                                         <Button
//                                           variant="outline"
//                                           size="sm"
//                                           onClick={() => handleCopyContent(selectedNotification?.content || "")}
//                                         >
//                                           <Copy className="w-4 h-4 mr-2" />
//                                           Copy HTML
//                                         </Button>
//                                         <Button
//                                           variant="outline"
//                                           size="sm"
//                                           onClick={() =>
//                                             window.open(
//                                               "data:text/html," +
//                                                 encodeURIComponent(selectedNotification?.content || ""),
//                                               "_blank",
//                                             )
//                                           }
//                                         >
//                                           <ExternalLink className="w-4 h-4 mr-2" />
//                                           Open in New Tab
//                                         </Button>
//                                       </div>
//                                     </DialogTitle>
//                                   </DialogHeader>
//                                   <div className="mt-4">
//                                     <div className="bg-gray-50 p-4 rounded-lg mb-6">
//                                       <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
//                                         <div>
//                                           <p className="text-gray-500">Status</p>
//                                           <div className="mt-1">
//                                             {getStatusBadge(selectedNotification?.status || "")}
//                                           </div>
//                                         </div>
//                                         <div>
//                                           <p className="text-gray-500">Type</p>
//                                           <Badge
//                                             className={`text-xs mt-1 ${getTypeBadge(selectedNotification?.type || "")}`}
//                                           >
//                                             {selectedNotification?.type}
//                                           </Badge>
//                                         </div>
//                                         <div>
//                                           <p className="text-gray-500">Recipient</p>
//                                           <p className="font-medium mt-1">{selectedNotification?.recipient}</p>
//                                         </div>
//                                         <div>
//                                           <p className="text-gray-500">Sent</p>
//                                           <p className="font-medium mt-1">
//                                             {selectedNotification?.sentAt
//                                               ? new Date(selectedNotification.sentAt).toLocaleDateString()
//                                               : "N/A"}
//                                           </p>
//                                         </div>
//                                       </div>
//                                     </div>

//                                     <div className="border border-gray-200 rounded-lg overflow-hidden">
//                                       <div className="bg-gray-100 p-3 border-b border-gray-200">
//                                         <div className="flex items-center justify-between text-sm">
//                                           <div>
//                                             <p className="font-medium">Subject: {selectedNotification?.title}</p>
//                                             <p className="text-gray-600">
//                                               From: TheNews Team &lt;hello@thenews.com&gt;
//                                             </p>
//                                           </div>
//                                           <div className="text-gray-500">
//                                             {selectedNotification?.sentAt
//                                               ? new Date(selectedNotification.sentAt).toLocaleString()
//                                               : "Not sent"}
//                                           </div>
//                                         </div>
//                                       </div>
//                                       <div
//                                         className="bg-white"
//                                         dangerouslySetInnerHTML={{ __html: selectedNotification?.content || "" }}
//                                       />
//                                     </div>
//                                   </div>
//                                 </DialogContent>
//                               </Dialog>
//                             )}

//                             {!notification.read && (
//                               <Button
//                                 variant="outline"
//                                 size="sm"
//                                 onClick={() => handleMarkAsRead(notification.id)}
//                                 className="border-gray-300 hover:bg-gray-50"
//                               >
//                                 <CheckCircle className="w-4 h-4 mr-2" />
//                                 Mark Read
//                               </Button>
//                             )}

//                             <DropdownMenu>
//                               <DropdownMenuTrigger asChild>
//                                 <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
//                                   <MoreHorizontal className="h-4 w-4" />
//                                 </Button>
//                               </DropdownMenuTrigger>
//                               <DropdownMenuContent align="end">
//                                 {notification.type === "EMAIL" && (
//                                   <DropdownMenuItem onClick={() => setSelectedNotification(notification)}>
//                                     <Eye className="w-4 h-4 mr-2" />
//                                     View Content
//                                   </DropdownMenuItem>
//                                 )}
//                                 <DropdownMenuItem
//                                   onClick={() => handleCopyContent(notification.content || notification.textContent)}
//                                 >
//                                   <Copy className="w-4 h-4 mr-2" />
//                                   Copy Content
//                                 </DropdownMenuItem>
//                                 {!notification.read && (
//                                   <DropdownMenuItem onClick={() => handleMarkAsRead(notification.id)}>
//                                     <CheckCircle className="w-4 h-4 mr-2" />
//                                     Mark as Read
//                                   </DropdownMenuItem>
//                                 )}
//                                 <DropdownMenuItem
//                                   className="text-red-600"
//                                   onClick={() => handleDeleteNotification(notification.id)}
//                                 >
//                                   <Trash2 className="w-4 h-4 mr-2" />
//                                   Delete
//                                 </DropdownMenuItem>
//                               </DropdownMenuContent>
//                             </DropdownMenu>
//                           </div>
//                         </div>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 )
//               })}
//             </div>

//             {filteredNotifications.length === 0 && (
//               <Card className="border-0 shadow-lg">
//                 <CardContent className="text-center py-12">
//                   <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
//                   <h3 className="text-xl font-medium text-gray-900 mb-2">No notifications found</h3>
//                   <p className="text-gray-500 mb-6">Try adjusting your search or filter criteria</p>
//                 </CardContent>
//               </Card>
//             )}
//           </TabsContent>

//           {/* Settings Tab */}
//           <TabsContent value="settings" className="space-y-6">
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//               {/* General Notifications */}
//               <Card className="border-0 shadow-lg">
//                 <CardHeader className="bg-black text-white">
//                   <CardTitle className="flex items-center">
//                     <Bell className="w-5 h-5 mr-2" />
//                     General Notifications
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent className="p-6 space-y-6">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <Label htmlFor="email-notifications" className="text-sm font-medium">
//                         Email Notifications
//                       </Label>
//                       <p className="text-xs text-gray-500 mt-1">Receive notifications via email</p>
//                     </div>
//                     <Switch
//                       id="email-notifications"
//                       checked={settings.emailNotifications}
//                       onCheckedChange={(value) => handleSettingChange("emailNotifications", value)}
//                     />
//                   </div>

//                   <div className="flex items-center justify-between">
//                     <div>
//                       <Label htmlFor="push-notifications" className="text-sm font-medium">
//                         Push Notifications
//                       </Label>
//                       <p className="text-xs text-gray-500 mt-1">Receive browser push notifications</p>
//                     </div>
//                     <Switch
//                       id="push-notifications"
//                       checked={settings.pushNotifications}
//                       onCheckedChange={(value) => handleSettingChange("pushNotifications", value)}
//                     />
//                   </div>

//                   <div className="flex items-center justify-between">
//                     <div>
//                       <Label htmlFor="weekly-digest" className="text-sm font-medium">
//                         Weekly Digest
//                       </Label>
//                       <p className="text-xs text-gray-500 mt-1">Weekly summary of your activity</p>
//                     </div>
//                     <Switch
//                       id="weekly-digest"
//                       checked={settings.weeklyDigest}
//                       onCheckedChange={(value) => handleSettingChange("weeklyDigest", value)}
//                     />
//                   </div>
//                 </CardContent>
//               </Card>

//               {/* System Notifications */}
//               <Card className="border-0 shadow-lg">
//                 <CardHeader className="bg-black text-white">
//                   <CardTitle className="flex items-center">
//                     <Activity className="w-5 h-5 mr-2" />
//                     System Notifications
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent className="p-6 space-y-6">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <Label htmlFor="blog-approval-notifications" className="text-sm font-medium">
//                         Blog Approval Notifications
//                       </Label>
//                       <p className="text-xs text-gray-500 mt-1">Get notified when blog posts are approved</p>
//                     </div>
//                     <Switch
//                       id="blog-approval-notifications"
//                       checked={settings.blogApprovalNotifications}
//                       onCheckedChange={(value) => handleSettingChange("blogApprovalNotifications", value)}
//                     />
//                   </div>

//                   <div className="flex items-center justify-between">
//                     <div>
//                       <Label htmlFor="kyc-notifications" className="text-sm font-medium">
//                         KYC Notifications
//                       </Label>
//                       <p className="text-xs text-gray-500 mt-1">Notifications about KYC verification status</p>
//                     </div>
//                     <Switch
//                       id="kyc-notifications"
//                       checked={settings.kycNotifications}
//                       onCheckedChange={(value) => handleSettingChange("kycNotifications", value)}
//                     />
//                   </div>

//                   <div className="flex items-center justify-between">
//                     <div>
//                       <Label htmlFor="payment-notifications" className="text-sm font-medium">
//                         Payment Notifications
//                       </Label>
//                       <p className="text-xs text-gray-500 mt-1">Notifications about payments and billing</p>
//                     </div>
//                     <Switch
//                       id="payment-notifications"
//                       checked={settings.paymentNotifications}
//                       onCheckedChange={(value) => handleSettingChange("paymentNotifications", value)}
//                     />
//                   </div>

//                   <div className="flex items-center justify-between">
//                     <div>
//                       <Label htmlFor="integration-notifications" className="text-sm font-medium">
//                         Integration Notifications
//                       </Label>
//                       <p className="text-xs text-gray-500 mt-1">Notifications about integration status</p>
//                     </div>
//                     <Switch
//                       id="integration-notifications"
//                       checked={settings.integrationNotifications}
//                       onCheckedChange={(value) => handleSettingChange("integrationNotifications", value)}
//                     />
//                   </div>
//                 </CardContent>
//               </Card>

//               {/* Campaign & Email Notifications */}
//               <Card className="border-0 shadow-lg">
//                 <CardHeader className="bg-black text-white">
//                   <CardTitle className="flex items-center">
//                     <Send className="w-5 h-5 mr-2" />
//                     Campaign & Email Notifications
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent className="p-6 space-y-6">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <Label htmlFor="campaign-reports" className="text-sm font-medium">
//                         Campaign Reports
//                       </Label>
//                       <p className="text-xs text-gray-500 mt-1">Receive detailed campaign performance reports</p>
//                     </div>
//                     <Switch
//                       id="campaign-reports"
//                       checked={settings.campaignReports}
//                       onCheckedChange={(value) => handleSettingChange("campaignReports", value)}
//                     />
//                   </div>

//                   <div className="flex items-center justify-between">
//                     <div>
//                       <Label htmlFor="high-engagement-alerts" className="text-sm font-medium">
//                         High Engagement Alerts
//                       </Label>
//                       <p className="text-xs text-gray-500 mt-1">Notifications for high-performing emails</p>
//                     </div>
//                     <Switch
//                       id="high-engagement-alerts"
//                       checked={settings.highEngagementAlerts}
//                       onCheckedChange={(value) => handleSettingChange("highEngagementAlerts", value)}
//                     />
//                   </div>

//                   <div className="flex items-center justify-between">
//                     <div>
//                       <Label htmlFor="bounce-alerts" className="text-sm font-medium">
//                         Bounce Alerts
//                       </Label>
//                       <p className="text-xs text-gray-500 mt-1">Notifications when emails bounce</p>
//                     </div>
//                     <Switch
//                       id="bounce-alerts"
//                       checked={settings.bounceAlerts}
//                       onCheckedChange={(value) => handleSettingChange("bounceAlerts", value)}
//                     />
//                   </div>
//                 </CardContent>
//               </Card>

//               {/* Security & Achievement Notifications */}
//               <Card className="border-0 shadow-lg">
//                 <CardHeader className="bg-black text-white">
//                   <CardTitle className="flex items-center">
//                     <Shield className="w-5 h-5 mr-2" />
//                     Security & Achievements
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent className="p-6 space-y-6">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <Label htmlFor="security-alerts" className="text-sm font-medium">
//                         Security Alerts
//                       </Label>
//                       <p className="text-xs text-gray-500 mt-1">Notifications about security events</p>
//                     </div>
//                     <Switch
//                       id="security-alerts"
//                       checked={settings.securityAlerts}
//                       onCheckedChange={(value) => handleSettingChange("securityAlerts", value)}
//                     />
//                   </div>

//                   <div className="flex items-center justify-between">
//                     <div>
//                       <Label htmlFor="achievement-notifications" className="text-sm font-medium">
//                         Achievement Notifications
//                       </Label>
//                       <p className="text-xs text-gray-500 mt-1">Notifications for milestones and achievements</p>
//                     </div>
//                     <Switch
//                       id="achievement-notifications"
//                       checked={settings.achievementNotifications}
//                       onCheckedChange={(value) => handleSettingChange("achievementNotifications", value)}
//                     />
//                   </div>

//                   <div className="flex items-center justify-between">
//                     <div>
//                       <Label htmlFor="product-updates" className="text-sm font-medium">
//                         Product Updates
//                       </Label>
//                       <p className="text-xs text-gray-500 mt-1">Notifications about new features and updates</p>
//                     </div>
//                     <Switch
//                       id="product-updates"
//                       checked={settings.productUpdates}
//                       onCheckedChange={(value) => handleSettingChange("productUpdates", value)}
//                     />
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>

//             {/* Save Settings Button */}
//             <div className="flex justify-end">
//               <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">
//                 <Settings className="w-4 h-4 mr-2" />
//                 Save All Settings
//               </Button>
//             </div>
//           </TabsContent>
//         </Tabs>
//       </div>
//     </div>
//   )
// }






"use client"

import { useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Mail,
  Search,
  MoreHorizontal,
  Eye,
  Trash2,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  Calendar,
  Users,
  MousePointer,
  Copy,
  ExternalLink,
  FileText,
  Shield,
  CreditCard,
  Award,
  Zap,
  DollarSign,
  Activity,
  BookOpen,
  Megaphone,
  Target,
  Filter,
  Settings,
  Send,
  TrendingUp,
  Bell,
  LucideIcon
} from "lucide-react"
import { useNotifications } from "@/hooks/useNotifications"
import {  NotificationStatus, NotificationType, NotificationPriority, NewsletterOwnerNotification } from "@prisma/client"
import Loader from "@/components/Loader"
import { useUser } from "@clerk/nextjs"
import Link from "next/link"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"

interface NotificationSettings {
  emailNotifications: boolean
  pushNotifications: boolean
  smsNotifications: boolean
  weeklyDigest: boolean
  instantAlerts: boolean
  marketingEmails: boolean
  securityAlerts: boolean
  productUpdates: boolean
  newsletterReminders: boolean
  campaignReports: boolean
  lowEngagementAlerts: boolean
  highEngagementAlerts: boolean
  bounceAlerts: boolean
  unsubscribeAlerts: boolean
  blogApprovalNotifications: boolean
  kycNotifications: boolean
  paymentNotifications: boolean
  integrationNotifications: boolean
  achievementNotifications: boolean
}

interface NotificationContent {
  title?: string;
  body?: string;
  ctaText?: string;
  ctaUrl?: string;
  features?: string[];
  // Add any other fields you expect in your notification content
}

export function NotificationCenter() {
 const { user } = useUser()
  const userId = user?.id
  const router = useRouter()

  const {
    notifications,
    loading,
    error,
    unreadCount,
    refreshNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    pagination
  } = useNotifications(userId || "")

  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<NewsletterOwnerNotification['status'] | "all">("all")
  const [typeFilter, setTypeFilter] = useState<NewsletterOwnerNotification['type'] | "all">("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState<NewsletterOwnerNotification['priority'] | "all">("all")
  const [selectedNotification, setSelectedNotification] = useState<NewsletterOwnerNotification | null>(null)
  const [settings, setSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    pushNotifications: false,
    smsNotifications: false,
    weeklyDigest: true,
    instantAlerts: true,
    marketingEmails: false,
    securityAlerts: true,
    productUpdates: true,
    newsletterReminders: true,
    campaignReports: true,
    lowEngagementAlerts: false,
    highEngagementAlerts: true,
    bounceAlerts: true,
    unsubscribeAlerts: false,
    blogApprovalNotifications: true,
    kycNotifications: true,
    paymentNotifications: true,
    integrationNotifications: true,
    achievementNotifications: true
  })

//    if (!userId) {
//     useEffect(() => {
//       toast.error("You are not logged in. Please log in to access this feature.")
//       router.push('/sign-in')
//     }, [userId ,router])
//     return null
//   }

console.log(userId, 'user id not man ')
  

  const filteredNotifications = notifications.filter((notification) => {
    const matchesSearch =
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.textContent?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.recipient
    const matchesStatus = statusFilter === "all" || notification.status === statusFilter
    const matchesType = typeFilter === "all" || notification.type === typeFilter
    const matchesCategory = categoryFilter === "all" || notification.category === categoryFilter
    const matchesPriority = priorityFilter === "all" || notification.priority === priorityFilter

    return matchesSearch && matchesStatus && matchesType && matchesCategory && matchesPriority
  })

  const getStatusBadge = (status: NotificationStatus) => {
    const variants = {
      SENT: { class: "bg-green-100 text-green-800 border-green-200", icon: CheckCircle },
      SENDING: { class: "bg-green-100 text-green-800 border-green-200", icon: CheckCircle },
      DELIVERED: { class: "bg-blue-100 text-blue-800 border-blue-200", icon: CheckCircle },
      FAILED: { class: "bg-red-100 text-red-800 border-red-200", icon: XCircle },
      PENDING: { class: "bg-blue-100 text-blue-800 border-blue-200", icon: Clock },
      DRAFT: { class: "bg-gray-100 text-gray-800 border-gray-200", icon: FileText } 
    } satisfies Record<NotificationStatus, { class: string; icon: LucideIcon }>
    
    const variant = variants[status as keyof typeof variants] || variants.SENT
    const Icon = variant.icon
    
    return (
      <Badge className={`text-xs ${variant.class} flex items-center gap-1`}>
        <Icon className="w-3 h-3" />
        {status}
      </Badge>
    )
  }

  const getTypeBadge = (type: NotificationType) => {
    const variants = {
      EMAIL: "bg-blue-100 text-blue-800 border-blue-200",
      SYSTEM: "bg-purple-100 text-purple-800 border-purple-200",
      PUSH: "bg-green-100 text-green-800 border-green-200",
      SMS: "bg-orange-100 text-orange-800 border-orange-200"
    }
    return variants[type]
  }

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, React.ComponentType<{ className?: string }>> = {
      WELCOME: Mail,
      NEWSLETTER: BookOpen,
      PROMOTIONAL: Megaphone,
      TRANSACTIONAL: CreditCard,
      BLOG_APPROVAL: FileText,
      KYC_APPROVAL: Shield,
      PAYMENT_SUCCESS: DollarSign,
      CAMPAIGN_ALERT: Target,
      SECURITY_ALERT: AlertCircle,
      INTEGRATION_SUCCESS: Zap,
      SUBSCRIPTION_REMINDER: Clock,
      ACHIEVEMENT: Award
    }
    return icons[category] || Bell
  }

  const getPriorityBadge = (priority: NotificationPriority) => {
    const variants = {
      HIGH: "bg-red-100 text-red-800 border-red-200",
      MEDIUM: "bg-yellow-100 text-yellow-800 border-yellow-200",
      LOW: "bg-gray-100 text-gray-800 border-gray-200"
    }
    return variants[priority]
  }

  const handleSettingChange = (key: keyof NotificationSettings, value: boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
    toast.success(`Settings updated: ${key.replace(/([A-Z])/g, " $1").toLowerCase()} ${value? "enabled" : "disabled"}`)
  }

  const handleDelete = async (notificationId: string) => {
    try {
      await deleteNotification(notificationId)
        toast.success("Notification deleted successfully")
    } catch (error) {
    toast.error("Failed to delete notification")
    }
  }

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markAsRead(notificationId)
      toast.success("Notification marked as read successfully")
    } catch (error) {
      toast.error("Failed to mark notification as read")
    }
  }

  const handleCopyContent = (content: string | null) => {
    if (!content) {
      toast.error("Failed to copy content")
      return
    }
    
    navigator.clipboard.writeText(content)
   
    toast.success('Notification content has been copied to clipboard')
  }

  const calculateEngagementRate = (notification: NewsletterOwnerNotification) => {
    if (!notification.emailsSent || notification.emailsSent === 0) return "0"
    const openCount = notification.openCount || 0
    const clickCount = notification.clickCount || 0
    return (((openCount + clickCount) / notification.emailsSent) * 100).toFixed(1)
  }

  const calculateOpenRate = (notification: NewsletterOwnerNotification) => {
    if (!notification.emailsSent || notification.emailsSent === 0) return "0"
    return (((notification.openCount || 0) / notification.emailsSent) * 100).toFixed(1)
  }

  if (loading) {
    return <Loader />
  }


  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">Error loading notifications</h3>
          <p className="text-gray-500 mt-2">{error}</p>
          <Button className="mt-4" onClick={refreshNotifications}>
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white w-full container mx-auto  rounded-lg shadow-lg">
      {/* Header */}
      <div className="bg-transparent text-black p-4 md:p-6">
        <div className="w-full">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold flex items-center">
                <Bell className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                Notifications Center
                {unreadCount > 0 && (
                  <Badge className="ml-2 sm:ml-3 bg-red-500 text-white text-xs sm:text-sm">
                    {unreadCount} unread
                  </Badge>
                )}
              </h1>
              {/* <p className="text-gray-300 mt-1 text-xs sm:text-sm md:text-base">
                Manage all your notifications and email communications
              </p> */}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="border-gray-600 text-black hover:bg-white bg-transparent text-xs sm:text-sm h-8 sm:h-9 md:h-10"
                onClick={() => markAllAsRead()}
              >
                <Filter className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                Mark All Read
              </Button>
              <Link href={'/dashboard/settings/notification'}>
                <Button className="bg-gold-600 hover:bg-black hover:text-white text-black font-semibold text-xs sm:text-sm h-8 sm:h-9 md:h-10">
                  <Settings className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  Create Notification Mail
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-3 sm:p-4 md:p-6">
        <Tabs defaultValue="notifications" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-3 sm:mb-4 md:mb-6 h-10 sm:h-11 md:h-12">
            <TabsTrigger value="notifications" className="flex items-center text-xs sm:text-sm">
              <Bell className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              <span className="truncate">All Notifications ({notifications.length})</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center text-xs sm:text-sm">
              <Settings className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              <span className="truncate">Notification Settings</span>
            </TabsTrigger>
          </TabsList>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-3 sm:space-y-4 md:space-y-6">
            {/* Statistics Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
              <StatCard
                title="Total"
                value={notifications.length}
                icon={<Bell className="text-blue-600 w-4 h-4 sm:w-5 sm:h-5" />}
                className="bg-blue-100"
              />
              <StatCard
                title="Unread"
                value={unreadCount}
                icon={<AlertCircle className="text-red-600 w-4 h-4 sm:w-5 sm:h-5" />}
                className="bg-red-100"
              />
              <StatCard
                title="Emails"
                value={notifications.filter(n => n.type === "EMAIL").length}
                icon={<Mail className="text-green-600 w-4 h-4 sm:w-5 sm:h-5" />}
                className="bg-green-100"
              />
              <StatCard
                title="System"
                value={notifications.filter(n => n.type === "SYSTEM").length}
                icon={<Activity className="text-purple-600 w-4 h-4 sm:w-5 sm:h-5" />}
                className="bg-purple-100"
              />
            </div>

            {/* Filters */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-3 sm:p-4 md:p-6">
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3 sm:w-4 sm:h-4" />
                      <Input
                        placeholder="Search notifications..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8 text-xs sm:text-sm h-8 sm:h-9 md:h-10"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:flex gap-2">
                    <Select value={typeFilter} onValueChange={(value: NotificationType | "all") => setTypeFilter(value)}>
                      <SelectTrigger className="text-xs sm:text-sm h-8 sm:h-9 md:h-10">
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all" className="text-xs sm:text-sm">All Types</SelectItem>
                        <SelectItem value="EMAIL" className="text-xs sm:text-sm">Email</SelectItem>
                        <SelectItem value="SYSTEM" className="text-xs sm:text-sm">System</SelectItem>
                        <SelectItem value="PUSH" className="text-xs sm:text-sm">Push</SelectItem>
                        <SelectItem value="SMS" className="text-xs sm:text-sm">SMS</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={statusFilter} onValueChange={(value: NotificationStatus | "all") => setStatusFilter(value)}>
                      <SelectTrigger className="text-xs sm:text-sm h-8 sm:h-9 md:h-10">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all" className="text-xs sm:text-sm">All Status</SelectItem>
                        <SelectItem value="SENT" className="text-xs sm:text-sm">Sent</SelectItem>
                        <SelectItem value="DELIVERED" className="text-xs sm:text-sm">Delivered</SelectItem>
                        <SelectItem value="SCHEDULED" className="text-xs sm:text-sm">Scheduled</SelectItem>
                        <SelectItem value="FAILED" className="text-xs sm:text-sm">Failed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notifications List */}
            <div className="grid grid-cols-1 gap-2 sm:gap-3 md:gap-4">
              {filteredNotifications.map((notification) => {
                const CategoryIcon = getCategoryIcon(notification.category)
                return (
                  <Card
                    key={notification.id}
                    className={`border-0 shadow-lg hover:shadow-xl transition-all duration-300 ${
                      !notification.read ? "border-l-4 border-l-gold-600 bg-yellow-50" : ""
                    }`}
                  >
                    <CardContent className="p-3 sm:p-4 md:p-6">
                      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                        <div
                          className={`p-2 sm:p-3 rounded-full flex-shrink-0 ${
                            notification.type === "EMAIL" ? "bg-blue-100" : "bg-purple-100"
                          }`}
                        >
                          <CategoryIcon
                            className={`w-4 h-4 sm:w-5 sm:h-5 ${
                              notification.type === "EMAIL" ? "text-blue-600" : "text-purple-600"
                            }`}
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <h3
                              className={`text-sm sm:text-base font-medium truncate ${
                                !notification.read ? "text-black" : "text-gray-800"
                              }`}
                            >
                              {notification.title}
                            </h3>
                            <div className="flex gap-1 sm:gap-2 flex-wrap">
                              {getStatusBadge(notification.status)}
                              <Badge className={`text-xs ${getTypeBadge(notification.type)}`}>
                                {notification.type}
                              </Badge>
                              <Badge className={`text-xs ${getPriorityBadge(notification.priority)}`}>
                                {notification.priority}
                              </Badge>
                            </div>
                          </div>

                          <p className="text-xs sm:text-sm text-gray-600 mt-2 line-clamp-2">
                            {typeof notification.content === 'string' 
                                ? notification.content 
                                : (notification.content as NotificationContent)?.title || 
                                (notification.content as NotificationContent)?.body || 
                                notification.textContent || 
                                'No content available'}
                            </p>

                          <div className="mt-2 sm:mt-3 flex flex-wrap items-center gap-1 sm:gap-2 text-xs text-gray-500">
                            {notification.sentAt && (
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                <span>{new Date(notification.sentAt).toLocaleString()}</span>
                              </div>
                            )}
                            
                            {notification.recipient > 0 && (
                              <div className="flex items-center gap-1">
                                <Mail className="w-3 h-3" />
                                <span className="truncate max-w-[120px] sm:max-w-[180px] md:max-w-none">
                                  {notification.recipient}
                                </span>
                              </div>
                            )}
                          </div>

                          {notification.type === "EMAIL" && notification.emailsSent && (
                            <div className="mt-2 sm:mt-3 grid grid-cols-2 sm:grid-cols-4 gap-1 sm:gap-2 text-xs">
                              <MetricItem
                                icon={<Users className="text-gray-500 w-3 h-3" />}
                                value={notification.recipients?.toLocaleString() || "0"}
                                label="Recipients"
                              />
                              <MetricItem
                                icon={<Eye className="text-blue-500 w-3 h-3" />}
                                value={`${calculateOpenRate(notification)}%`}
                                label="Opens"
                              />
                              <MetricItem
                                icon={<MousePointer className="text-purple-500 w-3 h-3" />}
                                value={notification.clickCount?.toLocaleString() || "0"}
                                label="Clicks"
                              />
                              <MetricItem
                                icon={<TrendingUp className="text-green-500 w-3 h-3" />}
                                value={`${calculateEngagementRate(notification)}%`}
                                label="Engagement"
                              />
                            </div>
                          )}

                          {notification.type === "SYSTEM" && notification.metadata && (
                            <div className="mt-2 sm:mt-3 p-2 sm:p-3 bg-gray-50 rounded-lg text-xs">
                              <h4 className="font-semibold text-gray-700 mb-1 sm:mb-2">Additional Details:</h4>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-2">
                                {Object.entries(notification.metadata).map(([key, value]) => (
                                  <div key={key} className="flex justify-between">
                                    <span className="text-gray-600 capitalize">
                                      {key.replace(/([A-Z])/g, " $1").toLowerCase()}:
                                    </span>
                                    <span className="font-medium text-gray-800 truncate max-w-[100px] sm:max-w-[150px]">
                                      {typeof value === "object" ? JSON.stringify(value) : String(value)}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="flex gap-1 sm:gap-2 self-end sm:self-center">
                          {notification.type === "EMAIL" && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-xs h-7 sm:h-8"
                              onClick={() => setSelectedNotification(notification)}
                              disabled={!notification.htmlContent}
                            >
                              <Eye className="w-3 h-3 mr-1" />
                              <span className="sr-only sm:not-sr-only">View</span>
                            </Button>
                          )}

                          {!notification.read || notification.type === 'EMAIL' && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-xs h-7 sm:h-8"
                              onClick={() => handleMarkAsRead(notification.id)}
                            >
                              <CheckCircle className="w-3 h-3 mr-1" />
                              <span className="sr-only sm:not-sr-only">Mark Read</span>
                            </Button>
                          )}

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-7 sm:h-8 w-7 sm:w-8 p-0">
                                <MoreHorizontal className="h-3 w-3 sm:h-4 sm:w-4" />
                                <span className="sr-only">More options</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="text-xs min-w-[150px]">
                              {notification.type === "EMAIL" && (
                                <DropdownMenuItem 
                                  onClick={() => setSelectedNotification(notification)}
                                  disabled={!notification.htmlContent}
                                >
                                  <Eye className="w-3 h-3 mr-2" />
                                  View Content
                                </DropdownMenuItem>
                              )}
                              {!notification.read || notification.type === 'EMAIL' && (
                                <DropdownMenuItem onClick={() => handleMarkAsRead(notification.id)}>
                                  <CheckCircle className="w-3 h-3 mr-2" />
                                  Mark as Read
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => handleDelete(notification.id)}
                              >
                                <Trash2 className="w-3 h-3 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}

              {filteredNotifications.length === 0 && (
                <Card className="border-0 shadow-lg">
                  <CardContent className="py-8 text-center">
                    <Bell className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                    <h3 className="text-lg font-medium text-gray-900">No notifications found</h3>
                    <p className="text-gray-500 mt-1">Try adjusting your search or filter criteria</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-3 sm:space-y-4 md:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
              {/* General Notifications */}
              <Card className="border-0 shadow-lg">
                <CardHeader className="bg-black text-white p-3 sm:p-4 md:p-6">
                  <CardTitle className="flex items-center text-sm sm:text-base">
                    <Bell className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    General Notifications
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4">
                  <NotificationSettingSwitch
                    id="email-notifications"
                    label="Email Notifications"
                    description="Receive notifications via email"
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => handleSettingChange("emailNotifications", checked)}
                  />
                  <NotificationSettingSwitch
                    id="push-notifications"
                    label="Push Notifications"
                    description="Receive browser push notifications"
                    checked={settings.pushNotifications}
                    onCheckedChange={(checked) => handleSettingChange("pushNotifications", checked)}
                  />
                  <NotificationSettingSwitch
                    id="weekly-digest"
                    label="Weekly Digest"
                    description="Weekly summary of your activity"
                    checked={settings.weeklyDigest}
                    onCheckedChange={(checked) => handleSettingChange("weeklyDigest", checked)}
                  />
                </CardContent>
              </Card>

              {/* System Notifications */}
              <Card className="border-0 shadow-lg">
                <CardHeader className="bg-black text-white p-3 sm:p-4 md:p-6">
                  <CardTitle className="flex items-center text-sm sm:text-base">
                    <Activity className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    System Notifications
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4">
                  <NotificationSettingSwitch
                    id="blog-approval-notifications"
                    label="Blog Approval"
                    description="Get notified when blog posts are approved"
                    checked={settings.blogApprovalNotifications}
                    onCheckedChange={(checked) => handleSettingChange("blogApprovalNotifications", checked)}
                  />
                  <NotificationSettingSwitch
                    id="kyc-notifications"
                    label="KYC Notifications"
                    description="Notifications about KYC verification status"
                    checked={settings.kycNotifications}
                    onCheckedChange={(checked) => handleSettingChange("kycNotifications", checked)}
                  />
                  <NotificationSettingSwitch
                    id="payment-notifications"
                    label="Payment Notifications"
                    description="Notifications about payments and billing"
                    checked={settings.paymentNotifications}
                    onCheckedChange={(checked) => handleSettingChange("paymentNotifications", checked)}
                  />
                </CardContent>
              </Card>

              {/* Campaign Notifications */}
              <Card className="border-0 shadow-lg">
                <CardHeader className="bg-black text-white p-3 sm:p-4 md:p-6">
                  <CardTitle className="flex items-center text-sm sm:text-base">
                    <Send className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    Campaign Notifications
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4">
                  <NotificationSettingSwitch
                    id="campaign-reports"
                    label="Campaign Reports"
                    description="Receive detailed campaign performance reports"
                    checked={settings.campaignReports}
                    onCheckedChange={(checked) => handleSettingChange("campaignReports", checked)}
                  />
                  <NotificationSettingSwitch
                    id="high-engagement-alerts"
                    label="High Engagement Alerts"
                    description="Notifications for high-performing emails"
                    checked={settings.highEngagementAlerts}
                    onCheckedChange={(checked) => handleSettingChange("highEngagementAlerts", checked)}
                  />
                  <NotificationSettingSwitch
                    id="bounce-alerts"
                    label="Bounce Alerts"
                    description="Notifications when emails bounce"
                    checked={settings.bounceAlerts}
                    onCheckedChange={(checked) => handleSettingChange("bounceAlerts", checked)}
                  />
                </CardContent>
              </Card>

              {/* Security Notifications */}
              <Card className="border-0 shadow-lg">
                <CardHeader className="bg-black text-white p-3 sm:p-4 md:p-6">
                  <CardTitle className="flex items-center text-sm sm:text-base">
                    <Shield className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    Security Notifications
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4">
                  <NotificationSettingSwitch
                    id="security-alerts"
                    label="Security Alerts"
                    description="Notifications about security events"
                    checked={settings.securityAlerts}
                    onCheckedChange={(checked) => handleSettingChange("securityAlerts", checked)}
                  />
                  <NotificationSettingSwitch
                    id="achievement-notifications"
                    label="Achievement Notifications"
                    description="Notifications for milestones and achievements"
                    checked={settings.achievementNotifications}
                    onCheckedChange={(checked) => handleSettingChange("achievementNotifications", checked)}
                  />
                  <NotificationSettingSwitch
                    id="product-updates"
                    label="Product Updates"
                    description="Notifications about new features and updates"
                    checked={settings.productUpdates}
                    onCheckedChange={(checked) => handleSettingChange("productUpdates", checked)}
                  />
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-end">
              <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold text-xs sm:text-sm h-8 sm:h-9 md:h-10">
                <Settings className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                Save All Settings
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Notification Detail Dialog */}
      {selectedNotification && (
        <Dialog open={!!selectedNotification} onOpenChange={() => setSelectedNotification(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <span className="text-sm sm:text-base md:text-lg">{selectedNotification.title}</span>
                <div className="flex gap-1 sm:gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs sm:text-sm h-7 sm:h-8 md:h-9"
                    onClick={() => handleCopyContent(selectedNotification.htmlContent || null)}
                    disabled={!selectedNotification.htmlContent}
                  >
                    <Copy className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    Copy HTML
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs sm:text-sm h-7 sm:h-8 md:h-9"
                    onClick={() => {
                      if (!selectedNotification.htmlContent) {
                        toast.error('There is no HTML content to open.')
                        return
                      }
                      window.open(
                        `data:text/html,${encodeURIComponent(selectedNotification.htmlContent)}`,
                        "_blank"
                      )
                    }}
                    disabled={!selectedNotification.htmlContent}
                  >
                    <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    Open in New Tab
                  </Button>
                </div>
              </DialogTitle>
            </DialogHeader>
            <div className="mt-3 sm:mt-4">
              <div className="bg-gray-50 p-3 sm:p-4 rounded-lg mb-4 sm:mb-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 text-xs sm:text-sm">
                  <div>
                    <p className="text-gray-500">Status</p>
                    <div className="mt-1">{getStatusBadge(selectedNotification.status)}</div>
                  </div>
                  <div>
                    <p className="text-gray-500">Type</p>
                    <Badge className={`text-xs mt-1 ${getTypeBadge(selectedNotification.type)}`}>
                      {selectedNotification.type}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-gray-500">Recipient</p>
                    <p className="font-medium mt-1 truncate">{selectedNotification.recipient || 0}</p>
                  </div>
                  {selectedNotification.sentAt && (
                    <div>
                      <p className="text-gray-500">Sent</p>
                      <p className="font-medium mt-1">
                        {new Date(selectedNotification.sentAt).toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-100 p-2 sm:p-3 border-b border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2 text-xs sm:text-sm">
                    <div>
                      <p className="font-medium">Subject: {selectedNotification.title}</p>
                      <p className="text-gray-600">
                        From: TheNews Team &lt;hello@thenews.com&gt;
                      </p>
                    </div>
                    {selectedNotification.sentAt && (
                      <div className="text-gray-500">
                        {new Date(selectedNotification.sentAt).toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>
                {selectedNotification.htmlContent ? (
                  <div
                    className="bg-white p-6 rounded-md shadow-md"
                    dangerouslySetInnerHTML={{ __html: selectedNotification.htmlContent }}
                  />
                ) : (
                  <div className="bg-white p-4 text-center text-gray-500">
                    No HTML content available for this notification
                  </div>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

interface StatCardProps {
  title: string
  value: number
  icon: React.ReactNode
  className?: string
}

function StatCard({ title, value, icon, className }: StatCardProps) {
  return (
    <Card className="border-0 shadow-lg">
      <CardContent className="p-2 sm:p-3 md:p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs sm:text-sm font-medium text-gray-600">{title}</p>
            <p className="text-lg sm:text-xl md:text-2xl font-bold">{value}</p>
          </div>
          <div className={`p-2 rounded-full ${className}`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface MetricItemProps {
  icon: React.ReactNode
  value: string
  label: string
}

function MetricItem({ icon, value, label }: MetricItemProps) {
  return (
    <div className="bg-gray-50 p-1 sm:p-2 rounded text-center">
      <div className="flex items-center justify-center gap-1">
        {icon}
        <span className="font-medium text-xs sm:text-sm">{value}</span>
      </div>
      <span className="text-gray-500 text-[10px] sm:text-xs">{label}</span>
    </div>
  )
}

interface NotificationSettingSwitchProps {
  id: string
  label: string
  description: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}

function NotificationSettingSwitch({
  id,
  label,
  description,
  checked,
  onCheckedChange
}: NotificationSettingSwitchProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="space-y-1">
        <Label htmlFor={id} className="text-xs sm:text-sm">
          {label}
        </Label>
        <p className="text-[10px] sm:text-xs text-gray-500">{description}</p>
      </div>
      <Switch
        id={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
        className="h-4 w-7 sm:h-5 sm:w-9"
      />
    </div>
  )
}