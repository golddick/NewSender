"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  Mail,
  Search,
  MoreHorizontal,
  Eye,
  Trash2,
  Send,
  TrendingUp,
  Settings,
  Bell,
  Clock,
  CheckCircle,
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
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Mock data for different notification types
const mockNotifications = [
  // Email Notifications
  {
    id: "1",
    type: "EMAIL",
    category: "WELCOME",
    title: "Welcome to Our Platform - New User Onboarding",
    content: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
        <div style="background: #000000; color: #ffffff; padding: 30px 20px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px; font-weight: bold;">Welcome to TheNews!</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Your journey to better newsletters starts here</p>
        </div>
        <div style="padding: 40px 30px;">
          <h2 style="color: #333333; margin-bottom: 20px; font-size: 24px;">Hello and Welcome!</h2>
          <p style="color: #666666; line-height: 1.6; margin-bottom: 25px; font-size: 16px;">
            We're thrilled to have you join our community! Your account has been successfully created, 
            and you're now ready to explore all the amazing features we have to offer.
          </p>
          <div style="background: #f8f9fa; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #EAB308;">
            <h3 style="color: #333333; margin-top: 0; font-size: 20px;">What's Next?</h3>
            <ul style="color: #666666; line-height: 1.8; padding-left: 20px;">
              <li>Complete your profile setup</li>
              <li>Create your first newsletter campaign</li>
              <li>Explore our template gallery</li>
              <li>Connect your integrations</li>
              <li>Join our community discussions</li>
            </ul>
          </div>
          <div style="text-align: center; margin: 35px 0;">
            <a href="#" style="background: #EAB308; color: #000000; padding: 15px 35px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; font-size: 16px;">
              Get Started Now
            </a>
          </div>
        </div>
      </div>
    `,
    textContent: "Welcome to our platform! We're excited to have you join our community.",
    status: "SENT",
    priority: "MEDIUM",
    userId: "user1",
    recipient: "user@example.com",
    emailsSent: 1250,
    openCount: 857,
    clickCount: 154,
    recipients: 1250,
    bounceCount: 25,
    lastOpened: "2024-01-15T14:30:00Z",
    lastClicked: "2024-01-15T15:45:00Z",
    sentAt: "2024-01-15T10:00:00Z",
    createdAt: "2024-01-15T09:00:00Z",
    updatedAt: "2024-01-15T16:00:00Z",
    read: true,
    integration: {
      name: "WordPress Blog",
      logo: "🌐",
    },
  },
  // Blog Post Approval Notification
  {
    id: "2",
    type: "SYSTEM",
    category: "BLOG_APPROVAL",
    title: "🎉 Your Blog Post Has Been Approved!",
    content:
      "Your blog post 'Advanced Email Marketing Strategies for 2024' has been reviewed and approved by our editorial team. It will now be featured on TheNews main blog page.",
    textContent:
      "Your blog post 'Advanced Email Marketing Strategies for 2024' has been approved and will be featured on the main blog.",
    status: "DELIVERED",
    priority: "HIGH",
    userId: "user1",
    recipient: "blogger@example.com",
    sentAt: "2024-01-16T09:30:00Z",
    createdAt: "2024-01-16T09:30:00Z",
    updatedAt: "2024-01-16T09:30:00Z",
    read: false,
    metadata: {
      blogPostId: "post_123",
      blogPostTitle: "Advanced Email Marketing Strategies for 2024",
      approvedBy: "Editorial Team",
      publishDate: "2024-01-17T08:00:00Z",
      category: "Marketing",
      estimatedViews: "5,000+",
    },
  },
  // KYC Approval Notification
  {
    id: "3",
    type: "SYSTEM",
    category: "KYC_APPROVAL",
    title: "✅ KYC Verification Completed Successfully",
    content:
      "Congratulations! Your KYC verification has been completed and approved. Your account limits have been increased and all premium features are now available.",
    textContent: "Your KYC verification has been approved. Premium features are now available.",
    status: "DELIVERED",
    priority: "HIGH",
    userId: "user2",
    recipient: "verified@example.com",
    sentAt: "2024-01-15T16:45:00Z",
    createdAt: "2024-01-15T16:45:00Z",
    updatedAt: "2024-01-15T16:45:00Z",
    read: true,
    metadata: {
      verificationType: "Individual",
      approvedBy: "Compliance Team",
      newLimits: {
        monthlyEmails: 100000,
        subscribers: 50000,
        integrations: "Unlimited",
      },
    },
  },
  // Payment Success Notification
  {
    id: "4",
    type: "SYSTEM",
    category: "PAYMENT_SUCCESS",
    title: "💳 Payment Successful - Premium Plan Activated",
    content:
      "Your payment of $49.99 for the Premium Plan has been processed successfully. Your plan is now active and all premium features are available.",
    textContent: "Payment successful. Premium Plan activated with all features available.",
    status: "DELIVERED",
    priority: "HIGH",
    userId: "user1",
    recipient: "premium@example.com",
    sentAt: "2024-01-14T11:20:00Z",
    createdAt: "2024-01-14T11:20:00Z",
    updatedAt: "2024-01-14T11:20:00Z",
    read: true,
    metadata: {
      amount: "$49.99",
      plan: "Premium Plan",
      billingCycle: "Monthly",
      nextBilling: "2024-02-14T11:20:00Z",
      transactionId: "txn_abc123",
    },
  },
  // Campaign Performance Alert
  {
    id: "5",
    type: "SYSTEM",
    category: "CAMPAIGN_ALERT",
    title: "📈 High Performance Alert: Your Campaign is Trending!",
    content:
      "Your newsletter campaign 'Weekly Tech Updates #47' is performing exceptionally well with a 68% open rate and 12% click rate - well above industry averages!",
    textContent: "Your campaign is performing exceptionally well with high engagement rates.",
    status: "DELIVERED",
    priority: "MEDIUM",
    userId: "user1",
    recipient: "marketer@example.com",
    sentAt: "2024-01-14T18:00:00Z",
    createdAt: "2024-01-14T18:00:00Z",
    updatedAt: "2024-01-14T18:00:00Z",
    read: false,
    metadata: {
      campaignId: "camp_456",
      campaignName: "Weekly Tech Updates #47",
      openRate: "68%",
      clickRate: "12%",
      totalSent: 3420,
      totalOpens: 2326,
      totalClicks: 410,
    },
  },
  // Security Alert
  {
    id: "6",
    type: "SYSTEM",
    category: "SECURITY_ALERT",
    title: "🔒 Security Alert: New Login Detected",
    content:
      "We detected a new login to your account from a new device. If this wasn't you, please secure your account immediately.",
    textContent: "New login detected from unknown device. Please verify if this was you.",
    status: "DELIVERED",
    priority: "HIGH",
    userId: "user2",
    recipient: "security@example.com",
    sentAt: "2024-01-13T22:15:00Z",
    createdAt: "2024-01-13T22:15:00Z",
    updatedAt: "2024-01-13T22:15:00Z",
    read: true,
    metadata: {
      loginTime: "2024-01-13T22:10:00Z",
      ipAddress: "192.168.1.100",
      location: "New York, NY",
      device: "Chrome on Windows",
      action: "Login Successful",
    },
  },
  // Integration Success
  {
    id: "7",
    type: "SYSTEM",
    category: "INTEGRATION_SUCCESS",
    title: "🔗 Integration Connected Successfully",
    content:
      "Your Shopify store has been successfully connected to TheNews. You can now sync your customer data and create targeted email campaigns.",
    textContent: "Shopify integration connected successfully. Customer data sync is now available.",
    status: "DELIVERED",
    priority: "MEDIUM",
    userId: "user1",
    recipient: "ecommerce@example.com",
    sentAt: "2024-01-12T14:30:00Z",
    createdAt: "2024-01-12T14:30:00Z",
    updatedAt: "2024-01-12T14:30:00Z",
    read: true,
    metadata: {
      integrationType: "Shopify",
      storeName: "My Awesome Store",
      syncedCustomers: 1250,
      syncedProducts: 89,
      lastSync: "2024-01-12T14:25:00Z",
    },
  },
  // Subscription Renewal Reminder
  {
    id: "8",
    type: "SYSTEM",
    category: "SUBSCRIPTION_REMINDER",
    title: "⏰ Subscription Renewal Reminder",
    content:
      "Your Premium Plan subscription will renew in 3 days on January 17, 2024. The amount of $49.99 will be charged to your default payment method.",
    textContent: "Premium Plan renewal in 3 days. $49.99 will be charged to your payment method.",
    status: "DELIVERED",
    priority: "MEDIUM",
    userId: "user1",
    recipient: "billing@example.com",
    sentAt: "2024-01-14T10:00:00Z",
    createdAt: "2024-01-14T10:00:00Z",
    updatedAt: "2024-01-14T10:00:00Z",
    read: false,
    metadata: {
      renewalDate: "2024-01-17T10:00:00Z",
      amount: "$49.99",
      plan: "Premium Plan",
      paymentMethod: "•••• •••• •••• 1234",
    },
  },
  // Email Newsletter
  {
    id: "9",
    type: "EMAIL",
    category: "NEWSLETTER",
    title: "Weekly Newsletter - Tech Updates & Insights",
    content: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; padding: 30px 20px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px; font-weight: bold;">Weekly Tech Insights</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Issue #47 - January 14, 2024</p>
        </div>
        <div style="padding: 40px 30px;">
          <h2 style="color: #333333; margin-bottom: 20px; font-size: 24px;">This Week in Technology</h2>
          <p style="color: #666666; line-height: 1.6; margin-bottom: 25px; font-size: 16px;">
            Here are the most important tech stories and insights from this week.
          </p>
        </div>
      </div>
    `,
    textContent: "This week's top stories in technology and innovation.",
    status: "SENT",
    priority: "MEDIUM",
    userId: "user1",
    recipient: "newsletter@example.com",
    emailsSent: 3420,
    openCount: 1547,
    clickCount: 298,
    recipients: 3420,
    bounceCount: 67,
    lastOpened: "2024-01-14T16:20:00Z",
    lastClicked: "2024-01-14T17:10:00Z",
    sentAt: "2024-01-14T08:00:00Z",
    createdAt: "2024-01-14T07:00:00Z",
    updatedAt: "2024-01-14T18:00:00Z",
    read: true,
    integration: {
      name: "E-commerce Store",
      logo: "🛒",
    },
  },
  // Achievement Notification
  {
    id: "10",
    type: "SYSTEM",
    category: "ACHIEVEMENT",
    title: "🏆 Achievement Unlocked: Email Marketing Pro!",
    content:
      "Congratulations! You've reached 10,000 total email opens across all your campaigns. You've unlocked the 'Email Marketing Pro' badge and earned 500 bonus credits!",
    textContent: "Achievement unlocked! You've reached 10,000 email opens and earned the Email Marketing Pro badge.",
    status: "DELIVERED",
    priority: "LOW",
    userId: "user1",
    recipient: "achiever@example.com",
    sentAt: "2024-01-13T15:45:00Z",
    createdAt: "2024-01-13T15:45:00Z",
    updatedAt: "2024-01-13T15:45:00Z",
    read: false,
    metadata: {
      achievement: "Email Marketing Pro",
      milestone: "10,000 Email Opens",
      reward: "500 Bonus Credits",
      badgeIcon: "🏆",
      nextMilestone: "25,000 Email Opens",
    },
  },
]

// Notification settings mock data
const mockNotificationSettings = {
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
  achievementNotifications: true,
}

export function NotificationEmailList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [settings, setSettings] = useState(mockNotificationSettings)
  const [selectedNotification, setSelectedNotification] = useState<any>(null)
  const { toast } = useToast()

  const filteredNotifications = mockNotifications.filter((notification) => {
    const matchesSearch =
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.textContent?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.recipient?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || notification.status === statusFilter
    const matchesType = typeFilter === "all" || notification.type === typeFilter
    const matchesCategory = categoryFilter === "all" || notification.category === categoryFilter
    const matchesPriority = priorityFilter === "all" || notification.priority === priorityFilter

    return matchesSearch && matchesStatus && matchesType && matchesCategory && matchesPriority
  })

  const getStatusBadge = (status: string) => {
    const variants = {
      SENT: { class: "bg-green-100 text-green-800 border-green-200", icon: CheckCircle },
      DELIVERED: { class: "bg-blue-100 text-blue-800 border-blue-200", icon: CheckCircle },
      SCHEDULED: { class: "bg-yellow-100 text-yellow-800 border-yellow-200", icon: Clock },
      DRAFT: { class: "bg-gray-100 text-gray-800 border-gray-200", icon: AlertCircle },
      FAILED: { class: "bg-red-100 text-red-800 border-red-200", icon: XCircle },
      PENDING: { class: "bg-blue-100 text-blue-800 border-blue-200", icon: Clock },
    }
    const variant = variants[status as keyof typeof variants] || variants.DELIVERED
    const Icon = variant.icon
    return (
      <Badge className={`text-xs ${variant.class} flex items-center gap-1`}>
        <Icon className="w-3 h-3" />
        {status}
      </Badge>
    )
  }

  const getTypeBadge = (type: string) => {
    const variants = {
      EMAIL: "bg-blue-100 text-blue-800 border-blue-200",
      SYSTEM: "bg-purple-100 text-purple-800 border-purple-200",
      PUSH: "bg-green-100 text-green-800 border-green-200",
      SMS: "bg-orange-100 text-orange-800 border-orange-200",
    }
    return variants[type as keyof typeof variants] || variants.SYSTEM
  }

  const getCategoryIcon = (category: string) => {
    const icons = {
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
      ACHIEVEMENT: Award,
    }
    return icons[category as keyof typeof icons] || Bell
  }

  const getPriorityBadge = (priority: string) => {
    const variants = {
      HIGH: "bg-red-100 text-red-800 border-red-200",
      MEDIUM: "bg-yellow-100 text-yellow-800 border-yellow-200",
      LOW: "bg-gray-100 text-gray-800 border-gray-200",
    }
    return variants[priority as keyof typeof variants] || variants.MEDIUM
  }

  const handleSettingChange = (key: string, value: boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
    toast({
      title: "Settings Updated",
      description: `${key.replace(/([A-Z])/g, " $1").toLowerCase()} ${value ? "enabled" : "disabled"}`,
    })
  }

  const handleDeleteNotification = (notificationId: string) => {
    toast({
      title: "Notification Deleted",
      description: "The notification has been deleted successfully.",
    })
  }

  const handleMarkAsRead = (notificationId: string) => {
    toast({
      title: "Marked as Read",
      description: "The notification has been marked as read.",
    })
  }

  const handleCopyContent = (content: string) => {
    navigator.clipboard.writeText(content)
    toast({
      title: "Content Copied",
      description: "Notification content has been copied to clipboard.",
    })
  }

  const calculateEngagementRate = (notification: any) => {
    if (!notification.emailsSent || notification.emailsSent === 0) return 0
    return (((notification.openCount + notification.clickCount) / notification.emailsSent) * 100).toFixed(1)
  }

  const calculateOpenRate = (notification: any) => {
    if (!notification.emailsSent || notification.emailsSent === 0) return 0
    return ((notification.openCount / notification.emailsSent) * 100).toFixed(1)
  }

  const unreadCount = mockNotifications.filter((n) => !n.read).length
  const totalNotifications = mockNotifications.length
  const emailNotifications = mockNotifications.filter((n) => n.type === "EMAIL").length
  const systemNotifications = mockNotifications.filter((n) => n.type === "SYSTEM").length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-black text-white p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center">
                <Bell className="w-8 h-8 mr-3" />
                Notifications Center
                {unreadCount > 0 && <Badge className="ml-3 bg-red-500 text-white">{unreadCount} unread</Badge>}
              </h1>
              <p className="text-gray-300 mt-2">Manage all your notifications and email communications</p>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" className="border-gray-600 text-white hover:bg-gray-800 bg-transparent">
                <Filter className="w-4 h-4 mr-2" />
                Mark All Read
              </Button>
              <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <Tabs defaultValue="notifications" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="notifications" className="flex items-center">
              <Bell className="w-4 h-4 mr-2" />
              All Notifications ({totalNotifications})
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center">
              <Settings className="w-4 h-4 mr-2" />
              Notification Settings
            </TabsTrigger>
          </TabsList>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Notifications</p>
                      <p className="text-3xl font-bold text-black">{totalNotifications}</p>
                    </div>
                    <div className="bg-blue-100 p-3 rounded-full">
                      <Bell className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Unread</p>
                      <p className="text-3xl font-bold text-red-600">{unreadCount}</p>
                    </div>
                    <div className="bg-red-100 p-3 rounded-full">
                      <AlertCircle className="w-6 h-6 text-red-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Email Notifications</p>
                      <p className="text-3xl font-bold text-black">{emailNotifications}</p>
                    </div>
                    <div className="bg-green-100 p-3 rounded-full">
                      <Mail className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">System Alerts</p>
                      <p className="text-3xl font-bold text-black">{systemNotifications}</p>
                    </div>
                    <div className="bg-purple-100 p-3 rounded-full">
                      <Activity className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Search notifications..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 border-gray-300 focus:border-yellow-500 focus:ring-yellow-500"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 flex-wrap">
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                      <SelectTrigger className="w-32 border-gray-300 focus:border-yellow-500 focus:ring-yellow-500">
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="EMAIL">Email</SelectItem>
                        <SelectItem value="SYSTEM">System</SelectItem>
                        <SelectItem value="PUSH">Push</SelectItem>
                        <SelectItem value="SMS">SMS</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger className="w-40 border-gray-300 focus:border-yellow-500 focus:ring-yellow-500">
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="WELCOME">Welcome</SelectItem>
                        <SelectItem value="NEWSLETTER">Newsletter</SelectItem>
                        <SelectItem value="BLOG_APPROVAL">Blog Approval</SelectItem>
                        <SelectItem value="KYC_APPROVAL">KYC Approval</SelectItem>
                        <SelectItem value="PAYMENT_SUCCESS">Payment</SelectItem>
                        <SelectItem value="CAMPAIGN_ALERT">Campaign Alert</SelectItem>
                        <SelectItem value="SECURITY_ALERT">Security</SelectItem>
                        <SelectItem value="ACHIEVEMENT">Achievement</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                      <SelectTrigger className="w-32 border-gray-300 focus:border-yellow-500 focus:ring-yellow-500">
                        <SelectValue placeholder="Priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Priority</SelectItem>
                        <SelectItem value="HIGH">High</SelectItem>
                        <SelectItem value="MEDIUM">Medium</SelectItem>
                        <SelectItem value="LOW">Low</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-32 border-gray-300 focus:border-yellow-500 focus:ring-yellow-500">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="SENT">Sent</SelectItem>
                        <SelectItem value="DELIVERED">Delivered</SelectItem>
                        <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                        <SelectItem value="FAILED">Failed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notifications List */}
            <div className="grid grid-cols-1 gap-4">
              {filteredNotifications.map((notification) => {
                const CategoryIcon = getCategoryIcon(notification.category)
                return (
                  <Card
                    key={notification.id}
                    className={`border-0 shadow-lg hover:shadow-xl transition-all duration-300 ${
                      !notification.read ? "border-l-4 border-l-yellow-500 bg-yellow-50" : ""
                    }`}
                  >
                    <CardContent className="p-0">
                      <div className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4 flex-1">
                            <div
                              className={`p-3 rounded-full ${
                                notification.type === "EMAIL" ? "bg-blue-100" : "bg-purple-100"
                              }`}
                            >
                              <CategoryIcon
                                className={`w-6 h-6 ${
                                  notification.type === "EMAIL" ? "text-blue-600" : "text-purple-600"
                                }`}
                              />
                            </div>

                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <h3
                                  className={`text-lg font-bold ${!notification.read ? "text-black" : "text-gray-800"}`}
                                >
                                  {notification.title}
                                </h3>
                                {!notification.read && <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>}
                              </div>

                              <div className="flex items-center space-x-2 mb-3">
                                {getStatusBadge(notification.status)}
                                <Badge className={`text-xs ${getTypeBadge(notification.type)}`}>
                                  {notification.type}
                                </Badge>
                                <Badge className={`text-xs ${getPriorityBadge(notification.priority)}`}>
                                  {notification.priority}
                                </Badge>
                              </div>

                              <p className="text-gray-600 mb-4 text-sm leading-relaxed">{notification.textContent}</p>

                              <div className="flex items-center space-x-6 text-sm text-gray-500 mb-4">
                                <div className="flex items-center space-x-1">
                                  <Calendar className="w-4 h-4" />
                                  <span>{new Date(notification.sentAt).toLocaleString()}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Mail className="w-4 h-4" />
                                  <span>{notification.recipient}</span>
                                </div>
                                {notification.integration && (
                                  <div className="flex items-center space-x-2">
                                    <span className="text-lg">{notification.integration.logo}</span>
                                    <span className="font-medium">{notification.integration.name}</span>
                                  </div>
                                )}
                              </div>

                              {/* Email Performance Metrics */}
                              {notification.type === "EMAIL" && notification.emailsSent && (
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                                  <div className="text-center">
                                    <div className="flex items-center justify-center mb-1">
                                      <Users className="w-4 h-4 text-gray-500 mr-1" />
                                    </div>
                                    <p className="text-lg font-bold text-black">
                                      {notification.recipients?.toLocaleString()}
                                    </p>
                                    <p className="text-xs text-gray-500">Recipients</p>
                                  </div>
                                  <div className="text-center">
                                    <div className="flex items-center justify-center mb-1">
                                      <Eye className="w-4 h-4 text-blue-500 mr-1" />
                                    </div>
                                    <p className="text-lg font-bold text-blue-600">
                                      {notification.openCount?.toLocaleString()}
                                    </p>
                                    <p className="text-xs text-gray-500">{calculateOpenRate(notification)}% Opens</p>
                                  </div>
                                  <div className="text-center">
                                    <div className="flex items-center justify-center mb-1">
                                      <MousePointer className="w-4 h-4 text-purple-500 mr-1" />
                                    </div>
                                    <p className="text-lg font-bold text-purple-600">
                                      {notification.clickCount?.toLocaleString()}
                                    </p>
                                    <p className="text-xs text-gray-500">Clicks</p>
                                  </div>
                                  <div className="text-center">
                                    <div className="flex items-center justify-center mb-1">
                                      <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                                    </div>
                                    <p className="text-lg font-bold text-green-600">
                                      {calculateEngagementRate(notification)}%
                                    </p>
                                    <p className="text-xs text-gray-500">Engagement</p>
                                  </div>
                                </div>
                              )}

                              {/* System Notification Metadata */}
                              {notification.type === "SYSTEM" && notification.metadata && (
                                <div className="p-4 bg-gray-50 rounded-lg">
                                  <h4 className="font-semibold text-sm text-gray-700 mb-2">Additional Details:</h4>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                                    {Object.entries(notification.metadata).map(([key, value]) => (
                                      <div key={key} className="flex justify-between">
                                        <span className="text-gray-600 capitalize">
                                          {key.replace(/([A-Z])/g, " $1").toLowerCase()}:
                                        </span>
                                        <span className="font-medium text-gray-800">
                                          {typeof value === "object" ? JSON.stringify(value) : String(value)}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center space-x-2 ml-4">
                            {notification.type === "EMAIL" && (
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-gray-300 hover:bg-gray-50 bg-transparent"
                                    onClick={() => setSelectedNotification(notification)}
                                  >
                                    <Eye className="w-4 h-4 mr-2" />
                                    View Content
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                                  <DialogHeader>
                                    <DialogTitle className="flex items-center justify-between">
                                      <span>{selectedNotification?.title}</span>
                                      <div className="flex items-center space-x-2">
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => handleCopyContent(selectedNotification?.content || "")}
                                        >
                                          <Copy className="w-4 h-4 mr-2" />
                                          Copy HTML
                                        </Button>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() =>
                                            window.open(
                                              "data:text/html," +
                                                encodeURIComponent(selectedNotification?.content || ""),
                                              "_blank",
                                            )
                                          }
                                        >
                                          <ExternalLink className="w-4 h-4 mr-2" />
                                          Open in New Tab
                                        </Button>
                                      </div>
                                    </DialogTitle>
                                  </DialogHeader>
                                  <div className="mt-4">
                                    <div className="bg-gray-50 p-4 rounded-lg mb-6">
                                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                        <div>
                                          <p className="text-gray-500">Status</p>
                                          <div className="mt-1">
                                            {getStatusBadge(selectedNotification?.status || "")}
                                          </div>
                                        </div>
                                        <div>
                                          <p className="text-gray-500">Type</p>
                                          <Badge
                                            className={`text-xs mt-1 ${getTypeBadge(selectedNotification?.type || "")}`}
                                          >
                                            {selectedNotification?.type}
                                          </Badge>
                                        </div>
                                        <div>
                                          <p className="text-gray-500">Recipient</p>
                                          <p className="font-medium mt-1">{selectedNotification?.recipient}</p>
                                        </div>
                                        <div>
                                          <p className="text-gray-500">Sent</p>
                                          <p className="font-medium mt-1">
                                            {selectedNotification?.sentAt
                                              ? new Date(selectedNotification.sentAt).toLocaleDateString()
                                              : "N/A"}
                                          </p>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                                      <div className="bg-gray-100 p-3 border-b border-gray-200">
                                        <div className="flex items-center justify-between text-sm">
                                          <div>
                                            <p className="font-medium">Subject: {selectedNotification?.title}</p>
                                            <p className="text-gray-600">
                                              From: TheNews Team &lt;hello@thenews.com&gt;
                                            </p>
                                          </div>
                                          <div className="text-gray-500">
                                            {selectedNotification?.sentAt
                                              ? new Date(selectedNotification.sentAt).toLocaleString()
                                              : "Not sent"}
                                          </div>
                                        </div>
                                      </div>
                                      <div
                                        className="bg-white"
                                        dangerouslySetInnerHTML={{ __html: selectedNotification?.content || "" }}
                                      />
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            )}

                            {!notification.read && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleMarkAsRead(notification.id)}
                                className="border-gray-300 hover:bg-gray-50"
                              >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Mark Read
                              </Button>
                            )}

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                {notification.type === "EMAIL" && (
                                  <DropdownMenuItem onClick={() => setSelectedNotification(notification)}>
                                    <Eye className="w-4 h-4 mr-2" />
                                    View Content
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem
                                  onClick={() => handleCopyContent(notification.content || notification.textContent)}
                                >
                                  <Copy className="w-4 h-4 mr-2" />
                                  Copy Content
                                </DropdownMenuItem>
                                {!notification.read && (
                                  <DropdownMenuItem onClick={() => handleMarkAsRead(notification.id)}>
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Mark as Read
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem
                                  className="text-red-600"
                                  onClick={() => handleDeleteNotification(notification.id)}
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {filteredNotifications.length === 0 && (
              <Card className="border-0 shadow-lg">
                <CardContent className="text-center py-12">
                  <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-900 mb-2">No notifications found</h3>
                  <p className="text-gray-500 mb-6">Try adjusting your search or filter criteria</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* General Notifications */}
              <Card className="border-0 shadow-lg">
                <CardHeader className="bg-black text-white">
                  <CardTitle className="flex items-center">
                    <Bell className="w-5 h-5 mr-2" />
                    General Notifications
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="email-notifications" className="text-sm font-medium">
                        Email Notifications
                      </Label>
                      <p className="text-xs text-gray-500 mt-1">Receive notifications via email</p>
                    </div>
                    <Switch
                      id="email-notifications"
                      checked={settings.emailNotifications}
                      onCheckedChange={(value) => handleSettingChange("emailNotifications", value)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="push-notifications" className="text-sm font-medium">
                        Push Notifications
                      </Label>
                      <p className="text-xs text-gray-500 mt-1">Receive browser push notifications</p>
                    </div>
                    <Switch
                      id="push-notifications"
                      checked={settings.pushNotifications}
                      onCheckedChange={(value) => handleSettingChange("pushNotifications", value)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="weekly-digest" className="text-sm font-medium">
                        Weekly Digest
                      </Label>
                      <p className="text-xs text-gray-500 mt-1">Weekly summary of your activity</p>
                    </div>
                    <Switch
                      id="weekly-digest"
                      checked={settings.weeklyDigest}
                      onCheckedChange={(value) => handleSettingChange("weeklyDigest", value)}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* System Notifications */}
              <Card className="border-0 shadow-lg">
                <CardHeader className="bg-black text-white">
                  <CardTitle className="flex items-center">
                    <Activity className="w-5 h-5 mr-2" />
                    System Notifications
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="blog-approval-notifications" className="text-sm font-medium">
                        Blog Approval Notifications
                      </Label>
                      <p className="text-xs text-gray-500 mt-1">Get notified when blog posts are approved</p>
                    </div>
                    <Switch
                      id="blog-approval-notifications"
                      checked={settings.blogApprovalNotifications}
                      onCheckedChange={(value) => handleSettingChange("blogApprovalNotifications", value)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="kyc-notifications" className="text-sm font-medium">
                        KYC Notifications
                      </Label>
                      <p className="text-xs text-gray-500 mt-1">Notifications about KYC verification status</p>
                    </div>
                    <Switch
                      id="kyc-notifications"
                      checked={settings.kycNotifications}
                      onCheckedChange={(value) => handleSettingChange("kycNotifications", value)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="payment-notifications" className="text-sm font-medium">
                        Payment Notifications
                      </Label>
                      <p className="text-xs text-gray-500 mt-1">Notifications about payments and billing</p>
                    </div>
                    <Switch
                      id="payment-notifications"
                      checked={settings.paymentNotifications}
                      onCheckedChange={(value) => handleSettingChange("paymentNotifications", value)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="integration-notifications" className="text-sm font-medium">
                        Integration Notifications
                      </Label>
                      <p className="text-xs text-gray-500 mt-1">Notifications about integration status</p>
                    </div>
                    <Switch
                      id="integration-notifications"
                      checked={settings.integrationNotifications}
                      onCheckedChange={(value) => handleSettingChange("integrationNotifications", value)}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Campaign & Email Notifications */}
              <Card className="border-0 shadow-lg">
                <CardHeader className="bg-black text-white">
                  <CardTitle className="flex items-center">
                    <Send className="w-5 h-5 mr-2" />
                    Campaign & Email Notifications
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="campaign-reports" className="text-sm font-medium">
                        Campaign Reports
                      </Label>
                      <p className="text-xs text-gray-500 mt-1">Receive detailed campaign performance reports</p>
                    </div>
                    <Switch
                      id="campaign-reports"
                      checked={settings.campaignReports}
                      onCheckedChange={(value) => handleSettingChange("campaignReports", value)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="high-engagement-alerts" className="text-sm font-medium">
                        High Engagement Alerts
                      </Label>
                      <p className="text-xs text-gray-500 mt-1">Notifications for high-performing emails</p>
                    </div>
                    <Switch
                      id="high-engagement-alerts"
                      checked={settings.highEngagementAlerts}
                      onCheckedChange={(value) => handleSettingChange("highEngagementAlerts", value)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="bounce-alerts" className="text-sm font-medium">
                        Bounce Alerts
                      </Label>
                      <p className="text-xs text-gray-500 mt-1">Notifications when emails bounce</p>
                    </div>
                    <Switch
                      id="bounce-alerts"
                      checked={settings.bounceAlerts}
                      onCheckedChange={(value) => handleSettingChange("bounceAlerts", value)}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Security & Achievement Notifications */}
              <Card className="border-0 shadow-lg">
                <CardHeader className="bg-black text-white">
                  <CardTitle className="flex items-center">
                    <Shield className="w-5 h-5 mr-2" />
                    Security & Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="security-alerts" className="text-sm font-medium">
                        Security Alerts
                      </Label>
                      <p className="text-xs text-gray-500 mt-1">Notifications about security events</p>
                    </div>
                    <Switch
                      id="security-alerts"
                      checked={settings.securityAlerts}
                      onCheckedChange={(value) => handleSettingChange("securityAlerts", value)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="achievement-notifications" className="text-sm font-medium">
                        Achievement Notifications
                      </Label>
                      <p className="text-xs text-gray-500 mt-1">Notifications for milestones and achievements</p>
                    </div>
                    <Switch
                      id="achievement-notifications"
                      checked={settings.achievementNotifications}
                      onCheckedChange={(value) => handleSettingChange("achievementNotifications", value)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="product-updates" className="text-sm font-medium">
                        Product Updates
                      </Label>
                      <p className="text-xs text-gray-500 mt-1">Notifications about new features and updates</p>
                    </div>
                    <Switch
                      id="product-updates"
                      checked={settings.productUpdates}
                      onCheckedChange={(value) => handleSettingChange("productUpdates", value)}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Save Settings Button */}
            <div className="flex justify-end">
              <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">
                <Settings className="w-4 h-4 mr-2" />
                Save All Settings
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
