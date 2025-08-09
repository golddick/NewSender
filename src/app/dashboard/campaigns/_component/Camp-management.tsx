// "use client"

// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Badge } from "@/components/ui/badge"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Progress } from "@/components/ui/progress"
// import { Search, Filter, Users, Mail, TrendingUp, Calendar, ExternalLink, Settings, Eye, BarChart3 } from "lucide-react"

// // Mock data
// const campaignStats = {
//   totalCampaigns: 12,
//   activeCampaigns: 8,
//   totalSubscribers: 2847,
//   totalEmails: 156,
//   emailsSent: 12450,
//   avgOpenRate: 24.5,
// }

// const campaigns = [
//   {
//     id: "1",
//     name: "Weekly Tech Newsletter",
//     description: "Weekly roundup of tech news and insights",
//     status: "Active",
//     type: "Newsletter",
//     integration: {
//       id: "1",
//       name: "TechCorp Blog",
//       logo: "🏢",
//       url: "techcorp.com",
//     },
//     subscribers: 1250,
//     emails: 24,
//     openRate: 28.5,
//     clickRate: 4.2,
//     createdAt: "2023-10-15",
//     lastEmailSent: "2023-12-01",
//     totalEmailsSent: 4800,
//   },
//   {
//     id: "2",
//     name: "Product Updates",
//     description: "Latest product features and announcements",
//     status: "Active",
//     type: "Product",
//     integration: {
//       id: "1",
//       name: "TechCorp Blog",
//       logo: "🏢",
//       url: "techcorp.com",
//     },
//     subscribers: 890,
//     emails: 18,
//     openRate: 32.1,
//     clickRate: 6.8,
//     createdAt: "2023-09-20",
//     lastEmailSent: "2023-11-28",
//     totalEmailsSent: 3200,
//   },
//   {
//     id: "3",
//     name: "Breaking News Alerts",
//     description: "Instant notifications for breaking news",
//     status: "Active",
//     type: "News",
//     integration: {
//       id: "2",
//       name: "NewsHub",
//       logo: "📰",
//       url: "newshub.io",
//     },
//     subscribers: 567,
//     emails: 45,
//     openRate: 18.9,
//     clickRate: 2.1,
//     createdAt: "2023-11-01",
//     lastEmailSent: "2023-12-02",
//     totalEmailsSent: 2850,
//   },
//   {
//     id: "4",
//     name: "Developer Tutorials",
//     description: "Step-by-step coding tutorials and guides",
//     status: "Paused",
//     type: "Educational",
//     integration: {
//       id: "4",
//       name: "DevInsights",
//       logo: "💻",
//       url: "devinsights.dev",
//     },
//     subscribers: 140,
//     emails: 12,
//     openRate: 45.2,
//     clickRate: 12.5,
//     createdAt: "2023-08-10",
//     lastEmailSent: "2023-10-15",
//     totalEmailsSent: 1600,
//   },
// ]

// export function CampaignsDashboard() {
//   const [searchTerm, setSearchTerm] = useState("")
//   const [statusFilter, setStatusFilter] = useState("all")
//   const [integrationFilter, setIntegrationFilter] = useState("all")
//   const [typeFilter, setTypeFilter] = useState("all")

//   const filteredCampaigns = campaigns.filter((campaign) => {
//     const matchesSearch =
//       campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       campaign.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       campaign.integration.name.toLowerCase().includes(searchTerm.toLowerCase())

//     const matchesStatus = statusFilter === "all" || campaign.status.toLowerCase() === statusFilter
//     const matchesIntegration = integrationFilter === "all" || campaign.integration.id === integrationFilter
//     const matchesType = typeFilter === "all" || campaign.type.toLowerCase() === typeFilter

//     return matchesSearch && matchesStatus && matchesIntegration && matchesType
//   })

//   const getStatusColor = (status: string) => {
//     switch (status.toLowerCase()) {
//       case "active":
//         return "bg-green-100 text-green-800"
//       case "paused":
//         return "bg-yellow-100 text-yellow-800"
//       case "draft":
//         return "bg-gray-100 text-gray-800"
//       case "archived":
//         return "bg-red-100 text-red-800"
//       default:
//         return "bg-gray-100 text-gray-800"
//     }
//   }

//   const getTypeColor = (type: string) => {
//     switch (type.toLowerCase()) {
//       case "newsletter":
//         return "bg-blue-100 text-blue-800"
//       case "product":
//         return "bg-purple-100 text-purple-800"
//       case "news":
//         return "bg-orange-100 text-orange-800"
//       case "educational":
//         return "bg-indigo-100 text-indigo-800"
//       default:
//         return "bg-gray-100 text-gray-800"
//     }
//   }

//   return (
//     <div className="min-h-screen bg-black text-white">
//       <div className="container mx-auto px-4 py-8">
//         <div className="max-w-7xl mx-auto">
//           {/* Header */}
//           <div className="mb-8">
//             <h1 className="text-4xl font-bold mb-4">
//               Campaigns <span className="text-yellow-400">Dashboard</span>
//             </h1>
//             <p className="text-gray-400 text-lg">
//               Monitor and manage all your email campaigns across integrated applications
//             </p>
//           </div>

//           {/* Stats Overview */}
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
//             <Card className="bg-gray-900 border-gray-800">
//               <CardContent className="p-6">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-sm text-gray-400">Total Campaigns</p>
//                     <p className="text-2xl font-bold text-white">{campaignStats.totalCampaigns}</p>
//                     <p className="text-xs text-green-400">{campaignStats.activeCampaigns} active</p>
//                   </div>
//                   <BarChart3 className="h-8 w-8 text-yellow-400" />
//                 </div>
//               </CardContent>
//             </Card>

//             <Card className="bg-gray-900 border-gray-800">
//               <CardContent className="p-6">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-sm text-gray-400">Total Subscribers</p>
//                     <p className="text-2xl font-bold text-white">{campaignStats.totalSubscribers.toLocaleString()}</p>
//                     <p className="text-xs text-green-400">+12% this month</p>
//                   </div>
//                   <Users className="h-8 w-8 text-yellow-400" />
//                 </div>
//               </CardContent>
//             </Card>

//             <Card className="bg-gray-900 border-gray-800">
//               <CardContent className="p-6">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-sm text-gray-400">Total Emails</p>
//                     <p className="text-2xl font-bold text-white">{campaignStats.totalEmails}</p>
//                     <p className="text-xs text-blue-400">Templates created</p>
//                   </div>
//                   <Mail className="h-8 w-8 text-yellow-400" />
//                 </div>
//               </CardContent>
//             </Card>

//             <Card className="bg-gray-900 border-gray-800">
//               <CardContent className="p-6">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-sm text-gray-400">Emails Sent</p>
//                     <p className="text-2xl font-bold text-white">{campaignStats.emailsSent.toLocaleString()}</p>
//                     <p className="text-xs text-purple-400">All time</p>
//                   </div>
//                   <TrendingUp className="h-8 w-8 text-yellow-400" />
//                 </div>
//               </CardContent>
//             </Card>

//             <Card className="bg-gray-900 border-gray-800">
//               <CardContent className="p-6">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-sm text-gray-400">Avg Open Rate</p>
//                     <p className="text-2xl font-bold text-white">{campaignStats.avgOpenRate}%</p>
//                     <p className="text-xs text-green-400">+2.1% vs last month</p>
//                   </div>
//                   <Eye className="h-8 w-8 text-yellow-400" />
//                 </div>
//               </CardContent>
//             </Card>

//             <Card className="bg-gray-900 border-gray-800">
//               <CardContent className="p-6">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-sm text-gray-400">This Month</p>
//                     <p className="text-2xl font-bold text-white">847</p>
//                     <p className="text-xs text-yellow-400">New subscribers</p>
//                   </div>
//                   <Calendar className="h-8 w-8 text-yellow-400" />
//                 </div>
//               </CardContent>
//             </Card>
//           </div>

//           {/* Filters */}
//           <Card className="bg-gray-900 border-gray-800 mb-8">
//             <CardContent className="p-6">
//               <div className="flex flex-col lg:flex-row gap-4">
//                 <div className="flex-1">
//                   <div className="relative">
//                     <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
//                     <Input
//                       placeholder="Search campaigns, integrations, or descriptions..."
//                       value={searchTerm}
//                       onChange={(e) => setSearchTerm(e.target.value)}
//                       className="pl-10 bg-gray-800 border-gray-700 text-white"
//                     />
//                   </div>
//                 </div>

//                 <div className="flex gap-4">
//                   <Select value={statusFilter} onValueChange={setStatusFilter}>
//                     <SelectTrigger className="w-32 bg-gray-800 border-gray-700">
//                       <SelectValue placeholder="Status" />
//                     </SelectTrigger>
//                     <SelectContent className="bg-gray-800 border-gray-700">
//                       <SelectItem value="all">All Status</SelectItem>
//                       <SelectItem value="active">Active</SelectItem>
//                       <SelectItem value="paused">Paused</SelectItem>
//                       <SelectItem value="draft">Draft</SelectItem>
//                       <SelectItem value="archived">Archived</SelectItem>
//                     </SelectContent>
//                   </Select>

//                   <Select value={typeFilter} onValueChange={setTypeFilter}>
//                     <SelectTrigger className="w-32 bg-gray-800 border-gray-700">
//                       <SelectValue placeholder="Type" />
//                     </SelectTrigger>
//                     <SelectContent className="bg-gray-800 border-gray-700">
//                       <SelectItem value="all">All Types</SelectItem>
//                       <SelectItem value="newsletter">Newsletter</SelectItem>
//                       <SelectItem value="product">Product</SelectItem>
//                       <SelectItem value="news">News</SelectItem>
//                       <SelectItem value="educational">Educational</SelectItem>
//                     </SelectContent>
//                   </Select>

//                   <Button variant="outline" className="border-gray-700 hover:bg-gray-800 bg-transparent">
//                     <Filter className="h-4 w-4 mr-2" />
//                     More Filters
//                   </Button>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           {/* Campaigns Grid */}
//           <div className="grid gap-6">
//             {filteredCampaigns.map((campaign) => (
//               <Card key={campaign.id} className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-colors">
//                 <CardContent className="p-6">
//                   <div className="flex flex-col lg:flex-row gap-6">
//                     {/* Campaign Info */}
//                     <div className="flex-1">
//                       <div className="flex items-start justify-between mb-4">
//                         <div className="flex-1">
//                           <div className="flex items-center gap-3 mb-2">
//                             <h3 className="text-xl font-semibold text-white">{campaign.name}</h3>
//                             <Badge className={getStatusColor(campaign.status)}>{campaign.status}</Badge>
//                             <Badge className={getTypeColor(campaign.type)}>{campaign.type}</Badge>
//                           </div>
//                           <p className="text-gray-400 mb-3">{campaign.description}</p>

//                           {/* Integration Info */}
//                           <div className="flex items-center gap-2 mb-4">
//                             <span className="text-lg">{campaign.integration.logo}</span>
//                             <span className="text-white font-medium">{campaign.integration.name}</span>
//                             <a
//                               href={`https://${campaign.integration.url}`}
//                               target="_blank"
//                               rel="noopener noreferrer"
//                               className="text-yellow-400 hover:text-yellow-300 flex items-center gap-1 text-sm"
//                             >
//                               {campaign.integration.url}
//                               <ExternalLink className="h-3 w-3" />
//                             </a>
//                           </div>
//                         </div>
//                       </div>

//                       {/* Metrics */}
//                       <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
//                         <div className="bg-gray-800 p-3 rounded-lg">
//                           <div className="flex items-center gap-2 mb-1">
//                             <Users className="h-4 w-4 text-yellow-400" />
//                             <span className="text-sm text-gray-400">Subscribers</span>
//                           </div>
//                           <p className="text-lg font-semibold text-white">{campaign.subscribers.toLocaleString()}</p>
//                         </div>

//                         <div className="bg-gray-800 p-3 rounded-lg">
//                           <div className="flex items-center gap-2 mb-1">
//                             <Mail className="h-4 w-4 text-yellow-400" />
//                             <span className="text-sm text-gray-400">Emails</span>
//                           </div>
//                           <p className="text-lg font-semibold text-white">{campaign.emails}</p>
//                         </div>

//                         <div className="bg-gray-800 p-3 rounded-lg">
//                           <div className="flex items-center gap-2 mb-1">
//                             <TrendingUp className="h-4 w-4 text-yellow-400" />
//                             <span className="text-sm text-gray-400">Total Sent</span>
//                           </div>
//                           <p className="text-lg font-semibold text-white">
//                             {campaign.totalEmailsSent.toLocaleString()}
//                           </p>
//                         </div>

//                         <div className="bg-gray-800 p-3 rounded-lg">
//                           <div className="flex items-center gap-2 mb-1">
//                             <Eye className="h-4 w-4 text-yellow-400" />
//                             <span className="text-sm text-gray-400">Open Rate</span>
//                           </div>
//                           <p className="text-lg font-semibold text-white">{campaign.openRate}%</p>
//                         </div>
//                       </div>

//                       {/* Performance Bars */}
//                       <div className="space-y-3 mb-4">
//                         <div>
//                           <div className="flex justify-between text-sm mb-1">
//                             <span className="text-gray-400">Open Rate</span>
//                             <span className="text-white">{campaign.openRate}%</span>
//                           </div>
//                           <Progress value={campaign.openRate} className="h-2 bg-gray-800" />
//                         </div>
//                         <div>
//                           <div className="flex justify-between text-sm mb-1">
//                             <span className="text-gray-400">Click Rate</span>
//                             <span className="text-white">{campaign.clickRate}%</span>
//                           </div>
//                           <Progress value={campaign.clickRate} className="h-2 bg-gray-800" />
//                         </div>
//                       </div>

//                       {/* Timeline */}
//                       <div className="flex flex-col sm:flex-row gap-4 text-sm text-gray-400">
//                         <div className="flex items-center gap-2">
//                           <Calendar className="h-4 w-4" />
//                           <span>Created: {new Date(campaign.createdAt).toLocaleDateString()}</span>
//                         </div>
//                         <div className="flex items-center gap-2">
//                           <Mail className="h-4 w-4" />
//                           <span>Last email: {new Date(campaign.lastEmailSent).toLocaleDateString()}</span>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Actions */}
//                     <div className="flex lg:flex-col gap-2">
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         className="border-gray-700 hover:bg-gray-800 bg-transparent flex-1 lg:flex-none"
//                       >
//                         <Eye className="h-4 w-4 mr-2" />
//                         View Details
//                       </Button>
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         className="border-gray-700 hover:bg-gray-800 bg-transparent flex-1 lg:flex-none"
//                       >
//                         <Users className="h-4 w-4 mr-2" />
//                         Manage Subscribers
//                       </Button>
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         className="border-gray-700 hover:bg-gray-800 bg-transparent flex-1 lg:flex-none"
//                       >
//                         <Settings className="h-4 w-4 mr-2" />
//                         Settings
//                       </Button>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>

//           {filteredCampaigns.length === 0 && (
//             <Card className="bg-gray-900 border-gray-800">
//               <CardContent className="p-12 text-center">
//                 <div className="text-gray-500">
//                   <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
//                   <p className="text-lg font-medium mb-2">No campaigns found</p>
//                   <p className="text-sm">Try adjusting your search or filter criteria</p>
//                 </div>
//               </CardContent>
//             </Card>
//           )}
//         </div>
//       </div>
//     </div>
//   )
// }











"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Search, Filter, Users, Mail, TrendingUp, Calendar, ExternalLink, Settings, Eye, BarChart3, Plus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import AddCamp from "./add-camp"
import StatsCard from "./StatsCard"
import CampaignsCard from "./CampaignsCard"
import { getLogUserCampaigns } from "@/actions/campaign/get-campaign"
import { Campaign, CampaignStatus } from "@prisma/client"

interface CampaignStats {
  activeCampaigns: number;
  totalSubscribers: number;
  totalEmails: number;
  emailsSent: number;
  avgOpenRate: number;
}

export function CampaignsDashboard() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [integrationFilter, setIntegrationFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [isAddCampaignOpen, setIsAddCampaignOpen] = useState(false)
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [campaignStats, setCampaignStats] = useState<CampaignStats>({
    activeCampaigns: 0,
    totalSubscribers: 0,
    totalEmails: 0,
    emailsSent: 0,
    avgOpenRate: 0
  })

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const data = await getLogUserCampaigns()
        setCampaigns(data)
        
        // Calculate stats
        const stats = {
          activeCampaigns: data.filter(c => c.status === CampaignStatus.ACTIVE).length,
          totalSubscribers: data.reduce((sum, c) => sum + (c.recipients || 0), 0),
          totalEmails: data.reduce((sum, c) => sum + (c.emails?.length || 0), 0),
          emailsSent: data.reduce((sum, c) => sum + (c.emailsSent || 0), 0),
          avgOpenRate: calculateAverageOpenRate(data)
        }
        setCampaignStats(stats)
      } catch (error) {
        console.error("Failed to fetch campaigns:", error)
      }
    }

    fetchCampaigns()
  }, [])

  const calculateAverageOpenRate = (campaigns: Campaign[]): number => {
    const campaignsWithOpenRate = campaigns.filter(c => c.openRate !== null && c.openRate !== undefined)
    if (campaignsWithOpenRate.length === 0) return 0
    
    const total = campaignsWithOpenRate.reduce((sum, c) => sum + (c.openRate || 0), 0)
    return parseFloat((total / campaignsWithOpenRate.length).toFixed(2))
  }

  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesSearch =
      campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.description?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || campaign.status === statusFilter
    const matchesType = typeFilter === "all" || (campaign.type && campaign.type.toLowerCase() === typeFilter)

    return matchesSearch && matchesStatus && matchesType
  })

  const getStatusColor = (status: CampaignStatus) => {
    switch (status) {
      case CampaignStatus.ACTIVE:
        return "bg-green-100 text-green-800"
      case CampaignStatus.INACTIVE:
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeColor = (type?: string) => {
    if (!type) return "bg-gray-100 text-gray-800"
    
    switch (type.toLowerCase()) {
      case "newsletter":
        return "bg-blue-100 text-blue-800"
      case "product":
        return "bg-purple-100 text-purple-800"
      case "news":
        return "bg-orange-100 text-orange-800"
      case "educational":
        return "bg-indigo-100 text-indigo-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="w-full px-4 py-8">
        <div className=" w-full">
          {/* Header */}
          <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 w-full">
            <div>
              <h1 className="text-2xl font-bold">
                Campaigns <span className="text-black">Dashboard</span>
              </h1>
              <p className="text-gray-400 text-base sm:text-sms">
                Monitor and manage all your email campaigns across integrated applications
              </p>
            </div>
            
            <AddCamp AddCampaignOpen={isAddCampaignOpen} />

          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
            <StatsCard 
              Title='Total Campaigns'
              Stats={{
                total: campaigns.length, 
                active: campaignStats.activeCampaigns
              }} 
            />
            <StatsCard 
              Title="Total Subscribers"
              Stats={{
                total: campaignStats.totalSubscribers, 
                subText: "+12% this month"
              }} 
            />
            <StatsCard 
              Title="Total Emails"
              Stats={{
                total: campaignStats.totalEmails, 
                subText: "Emails Created"
              }} 
            />
            <StatsCard 
              Title="Total Emails Sent"
              Stats={{
                total: campaignStats.emailsSent, 
                subText: "Emails Sent"
              }} 
            />
            <StatsCard 
              Title="Average Open Rate"
              Stats={{
                total: campaignStats.avgOpenRate, 
                subText: "% Opened"
              }} 
            />
          </div>

          {/* Filters */}
          <Card className="bg-white text-black border-none mb-8">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative border-gray-200 active:border-gray-200">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search campaigns..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-transparent border-gray-200 text-black"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 sm:gap-4">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-32 bg-transparent border-gray-200">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="ACTIVE">Active</SelectItem>
                      <SelectItem value="INACTIVE">Inactive</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-full sm:w-32 bg-transparent border-gray-200">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="newsletter">Newsletter</SelectItem>
                      <SelectItem value="product">Product</SelectItem>
                      <SelectItem value="news">News</SelectItem>
                      <SelectItem value="educational">Educational</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Campaigns Grid */}
          <div className="grid grid-cols-2 gap-4 sm:gap-6">
            {filteredCampaigns.map((campaign) => (
              <CampaignsCard
                key={campaign.id}
                campaign={campaign}
                getStatusColor={getStatusColor}
                getTypeColor={getTypeColor}
              />
            ))}
          </div>

          {filteredCampaigns.length === 0 && (
            <Card className="bg-white border">
              <CardContent className="p-8 sm:p-12 text-center">
                <div className="text-gray-500">
                  <BarChart3 className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-3 sm:mb-4 opacity-50" />
                  <p className="text-base sm:text-lg font-medium mb-1 sm:mb-2">No campaigns found</p>
                  <p className="text-xs sm:text-sm">Try adjusting your search or filter criteria</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}