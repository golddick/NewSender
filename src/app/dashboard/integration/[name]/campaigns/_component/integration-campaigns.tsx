"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Plus, Mail, Eye, Edit, Trash2, Send, TrendingUp, MousePointer, Clock, Target } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AddCampaignDialog } from "./add-campaign-dialog"
import Image from "next/image"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"
import { getCampaignsByIntegrationName } from "@/actions/campaign/get-campaign"
import { Campaign, CampaignTrigger, IntegrationStatus } from "@prisma/client"
import { formatString } from "@/lib/utils"

// interface Campaign {
//   id: string
//   name: string
//   description: string
//   trigger: string
//   subject: string
//   status: "active" | "inactive"
//   sentCount: number
//   openRate: number
//   clickRate: number
//   lastSent: string
//   createdAt: string
//   template: string
//   deliveryRate: number
//   bounceRate: number
//   unsubscribeRate: number
//   subscribeRate: number
//   totalSubscribers: number
//   avgTimeToOpen: string

// }

interface Integration {
  id: string
  name: string
  logo: string
  url: string
 status?: IntegrationStatus
}

interface IntegrationCampaignsProps {
  appName: string
}

export function IntegrationCampaigns({ appName }: IntegrationCampaignsProps) {

  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterTrigger, setFilterTrigger] = useState("all")
  const [integrationInfo, setIntegrationInfo] = useState<Integration | null>(null)
  const [showAddDialog, setShowAddDialog] = useState(false)
   const router = useRouter()



 useEffect(() => {
  const fetchIntegration = async () => {
    try {
      setLoading(true);
      const result = await getCampaignsByIntegrationName(appName);

      if (result?.error) throw new Error(result.error);
      if (!result.data) throw new Error("Integration not found");

      setCampaigns(
        result.data.campaigns.map((c: any) => ({
          id: c.id,
          name: c.name,
          userId: c.userId ?? "",
          description: c.description ?? "",
          trigger: c.trigger,
          status: c.status,
          integrationId: c.integrationId ?? "",
          createdAt: c.createdAt ? new Date(c.createdAt) : new Date(),
          updatedAt: c.updatedAt ? new Date(c.updatedAt) : new Date(),
          subject: c.subject ?? "",
          template: c.template ?? "",
          emailsSent: c.emailsSent ?? c.sentCount ?? 0,
          openRate: c.openRate ?? 0,
          clickRate: c.clickRate ?? 0,
          deliveryRate: c.deliveryRate ?? 0,
          bounceRate: c.bounceRate ?? 0,
          unsubscribeRate: c.unsubscribeRate ?? 0,
          avgTimeToOpen: c.avgTimeToOpen ?? "N/A",
          subscribeRate: c.subscribeRate ?? 0,
          totalSubscribers: c.totalSubscribers ?? 0,
          lastSentAt: c.lastSentAt ? new Date(c.lastSentAt) : (c.lastSent ? new Date(c.lastSent) : null),
          recipients: c.recipients ?? []
        }))
      );
      console.log("Fetched campaigns:", result.data.campaigns, "Integration info:", result.data.integration);
      setIntegrationInfo({
        ...result.data.integration,
        logo: result.data.integration.logo ?? "/2logo.jpg"
      }); // Optional if needed for display
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to load integration");
    } finally {
      setLoading(false);
    }
  };

  fetchIntegration();
}, [appName]);

 
 
  const integration: Integration = {
    id: integrationInfo?.id ?? "",
    name: appName,
    logo: integrationInfo?.logo || "/2logo.jpg",
    url: integrationInfo?.url ?? "",
  }


  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesSearch =
      campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (campaign.description ?? "").toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || campaign.status === filterStatus
    const matchesTrigger = filterTrigger === "all" || campaign.trigger === filterTrigger
    return matchesSearch && matchesStatus && matchesTrigger
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-50 text-green-700 border-green-200"
      case "inactive":
        return "bg-red-50 text-red-700 border-red-200"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  const getTriggerLabel = (trigger: CampaignTrigger) => {
    switch (trigger) {
      case 'Subscriber':
        return "New Subscription"
      case "unsubscribe":
        return "Unsubscribe"
      case 'new_user':
        return "New Platfrom User"
      case 'notification':
        return "Notification"
      default:
        return trigger
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "Never"
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getPerformanceColor = (rate: number, type: "open" | "click" | "delivery") => {
    if (type === "open") {
      if (rate >= 80) return "text-green-600"
      if (rate >= 60) return "text-yellow-600"
      return "text-red-600"
    }
    if (type === "click") {
      if (rate >= 15) return "text-green-600"
      if (rate >= 5) return "text-yellow-600"
      return "text-red-600"
    }
    if (type === "delivery") {
      if (rate >= 98) return "text-green-600"
      if (rate >= 95) return "text-yellow-600"
      return "text-red-600"
    }
    return "text-black"
  }

  const totalSent = campaigns.reduce((sum, campaign) => sum + campaign.emailsSent, 0)
  const avgOpenRate =
    campaigns.length > 0 ? campaigns.reduce((sum, campaign) => sum + (campaign.openRate ?? 0), 0) / campaigns.length : 0
  const activeCampaigns = campaigns.filter((c) => c.status === "active").length
  const avgClickRate =
    campaigns.length > 0 ? campaigns.reduce((sum, campaign) => sum + (campaign.clickRate ?? 0), 0) / campaigns.length : 0

  const totalSubscribers = campaigns.reduce(
    (sum, campaign) =>
      sum +
      (typeof (campaign as any).totalSubscribers === "number" ? (campaign as any).totalSubscribers : 0),
    0
  )

  return (
    <div className="min-h-screen bg-white">
      <div className="w-full py-8 px-4 md:px-6">
        {/* Header */}
        <div className="mb-8">
          <Link
            href={`/dashboard/integration/${integration.name}`}
            className="inline-flex items-center text-sm text-gray-600 hover:text-yellow-600 mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Integrations
          </Link>

          <div className="bg-white text-black rounded-lg p-6 mb-8 border border-gray-200 shadow-sm">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center overflow-hidden relative">
                  <Image
                    fill
                    src={integration.logo || "/2logo.jpg"}
                    alt={integration.name}
                    className="w-12 h-12 object-contain absolute"
                  />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-black">{integration.name}</h1>
                  <p className="text-sm text-black mt-1">{integration.url}</p>
                </div>
              </div>
              <Button
                onClick={() => setShowAddDialog(true)}
                className="mt-4 md:mt-0 bg-gold-600 hover:bg-yellow-600 text-black font-semibold"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Campaign
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-2 border-gray-100 hover:border-yellow-200 transition-colors">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <Target className="h-4 w-4 mr-2 text-yellow-600" />
                Total Campaigns
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-black">{campaigns.length}</div>
              <p className="text-sm text-gray-500 mt-1">All email campaigns</p>
            </CardContent>
          </Card>
          <Card className="border-2 border-gray-100 hover:border-yellow-200 transition-colors">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <TrendingUp className="h-4 w-4 mr-2 text-green-600" />
                Active Campaigns
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{activeCampaigns}</div>
              <p className="text-sm text-gray-500 mt-1">Currently running</p>
            </CardContent>
          </Card>
          <Card className="border-2 border-gray-100 hover:border-yellow-200 transition-colors">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <Send className="h-4 w-4 mr-2 text-blue-600" />
                Total Emails Sent
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-black">{totalSent.toLocaleString()}</div>
              <p className="text-sm text-gray-500 mt-1">Across all campaigns</p>
            </CardContent>
          </Card>
        <Card className="border-2 border-gray-100 hover:border-yellow-200 transition-colors">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
            <Eye className="h-4 w-4 mr-2 text-yellow-600" />
            Total Subscribers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-yellow-600">
            {totalSubscribers.toLocaleString()}
          </div>
          <p className="text-sm text-gray-500 mt-1">All campaign subscribers </p>
        </CardContent>
      </Card>
        </div>

        {/* Filters */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search campaigns by name, subject, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-gray-300 focus:border-gold-060 focus:ring-yellow-500 bg-white"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-48 border-gray-300 focus:border-gold-600 focus:ring-yellow-500 bg-white">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterTrigger} onValueChange={setFilterTrigger}>
              <SelectTrigger className="w-full md:w-48 border-gray-300 focus:border-yellow-500 focus:ring-yellow-500 bg-white">
                <SelectValue placeholder="Filter by trigger" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Triggers</SelectItem>
                <SelectItem value={CampaignTrigger.Subscriber}>New Subscription</SelectItem>
                <SelectItem value={CampaignTrigger.unsubscribe}>Unsubscribe</SelectItem>
                <SelectItem value={CampaignTrigger.new_user}>New Platfrom User</SelectItem>
                <SelectItem value={CampaignTrigger.notification}>Account Activation</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Campaigns List */}
        <div className="space-y-6">
          {filteredCampaigns.length === 0 ? (
            <Card className="border-2 border-dashed border-gray-300 bg-gray-50">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Mail className="h-16 w-16 text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No campaigns found</h3>
                <p className="text-gray-500 text-center mb-6 max-w-md">
                  {searchTerm || filterStatus !== "all" || filterTrigger !== "all"
                    ? "Try adjusting your search criteria or filters to find campaigns"
                    : "Create your first email campaign to start engaging with your users automatically"}
                </p>
                {!searchTerm && filterStatus === "all" && filterTrigger === "all" && (
                  <Button
                    onClick={() => setShowAddDialog(true)}
                    className="bg-gold-600 hover:bg-yellow-600 text-black font-semibold"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Campaign
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            filteredCampaigns.map((campaign) => (
              <Card
                key={campaign.id}
                className="border-2 border-gray-100 hover:border-yellow-200 hover:shadow-lg transition-all duration-200"
              >
                <CardContent className="p-0">
                  {/* Campaign Header */}
                  <div className="bg-black text-white p-4 rounded-t-lg">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <h3 className="text-xl font-bold text-white">{campaign.name}</h3>
                          <Badge className={`${getStatusColor(campaign.status)} text-xs font-medium`}>
                            {campaign.status.toUpperCase()}
                          </Badge>
                          <Badge className="bg-gold-600 text-black text-xs font-medium">
                            {formatString(campaign.trigger)}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                           onClick={() => router.push(`/dashboard/integration/${integration.name}/campaigns/${campaign.id}`)}
                          className="border-gold-600 text-gold-500 hover:bg-yellow-500 hover:text-black bg-transparent"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        {/* <Button
                          variant="outline"
                          size="sm"
                          className="border-white text-white hover:bg-white hover:text-black bg-transparent"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button> */}
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-red-400 text-red-400 hover:bg-red-400 hover:text-white bg-transparent"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Campaign Metrics */}
                  <div className="p-4 bg-white">

                    {/* Additional Info */}
                    <div className=" pt-6 border-t border-gray-200">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-2 md:space-y-0">
                        <div className="flex items-center space-x-6 text-sm text-gray-600">
                          <span>
                            <strong>Created:</strong> {formatDate(typeof campaign.createdAt === "string" ? campaign.createdAt : campaign.createdAt?.toISOString?.() ?? "")}
                          </span>
                          <span>
                            <strong>subscribe Rate:</strong> {(campaign as any).subscribeRate ?? 0}%
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm text-gray-600">Campaign is {campaign.status}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Add Campaign Dialog */}
        <AddCampaignDialog open={showAddDialog} onOpenChange={setShowAddDialog} integrationId={integrationInfo?.id}  appName={integration.name} isIntegrationActive={integrationInfo?.status === 'active'} />
      </div>
    </div>
  )
}

