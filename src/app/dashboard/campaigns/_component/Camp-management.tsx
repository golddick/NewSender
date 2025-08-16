


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
      case "launch":
        return "bg-purple-100 text-purple-800"
      case "news":
        return "bg-orange-100 text-orange-800"
      case "new":
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
          <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4 mb-8">
            <StatsCard 
              Title='Total Campaigns'
              Stats={{
                total: campaigns.length, 
                active: campaignStats.activeCampaigns
              }} 
            />
            {/* <StatsCard 
              Title="Total Subscribers"
              Stats={{
                total: campaignStats.totalSubscribers, 
                subText: "+12% this month"
              }} 
            /> */}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
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