


"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Globe,
  Mail,
  Calendar,
  Settings,
  BarChart3,
  Users,
  Zap,
  ExternalLink,
  Edit,
  Trash2,
  Power,
  PowerOff,
  Copy,
  Download,
  RefreshCw,
  Check,
  Plus,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { toast } from "sonner"
import {  getIntegrationByName, updateIntegrationStatus } from "@/actions/application-Integration/application"
import Link from "next/link"
import { getCampaignsByIntegrationName } from "@/actions/campaign/get-campaign"
import Loader from "@/components/Loader"
import { IntegrationStatus } from "@prisma/client"
import { AddCampaignDialog } from "../campaigns/_component/add-campaign-dialog"

interface SingleIntegrationProps {
  appName: string
}

interface Integration {
  id: string
  name: string
  url: string
  logo?: string
  email?: string
  status: IntegrationStatus
  category: string
  description?: string
  apiKey?: string
  webhookUrl?: string
  campaigns?: number
  subscribers?: number
  emailsSent?: number
  openRate?: number
  clickRate?: number
  conversionRate?: number
  lastSync?: string
  dateAdded: string
  totalEmail?: number
}

interface Activity {
  action: string
  details: string
  time: string
  count: number
}

interface Campaign {
  id: number
  name: string
  type: string
  status: string
  sent: number
  openRate: number
  clickRate: number
}
 
export function SingleIntegration({ appName }: SingleIntegrationProps) {
  const router = useRouter()
  const [integration, setIntegration] = useState<Integration | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
 const [copied, setCopied] = useState<string | null>(null)
   const [showAddDialog, setShowAddDialog] = useState(false)
  const [recentActivity] = useState<Activity[]>([
    { action: "Campaign sent", details: "Welcome Email to new subscribers", time: "2 hours ago", count: 45 },
    { action: "Webhook received", details: "New order notification", time: "4 hours ago", count: 12 },
    { action: "Sync completed", details: "Customer data synchronized", time: "6 hours ago", count: 234 },
    { action: "Campaign created", details: "Abandoned cart reminder", time: "1 day ago", count: 1 },
    { action: "API call", details: "Product catalog updated", time: "2 days ago", count: 89 },
  ])

  useEffect(() => {
    const fetchIntegration = async () => {
      try {
        setIsLoading(true)
        const result = await getIntegrationByName(appName)
        
        console.log("Integration data:", result)

        if (result?.error) {
          throw new Error(result.error)
        }

        if (!result.data) {
          throw new Error("Integration not found")
        }

        setIntegration({
          ...result.data,
          logo: result.data.logo ?? undefined,
          email: result.data.email ?? undefined,
          description: result.data.description ?? undefined,
          apiKey: result.data.apiKey ?? undefined,
          webhookUrl: result.data.webhookUrl ?? undefined,
          lastSync: result.data.lastSync ?? undefined,
          campaigns: result.data.campaigns ?? undefined,
          subscribers: result.data.subscribers ?? undefined,
          emailsSent: result.data.emailsSent ?? undefined,
          openRate: result.data.openRate ?? undefined,
          clickRate: result.data.clickRate ?? undefined,
          conversionRate: result.data.conversionRate ?? undefined,
          totalEmail: result.data.totalEmailCount
          
        })
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to load integration")
        router.push("/dashboard/integration")
      } finally {
        setIsLoading(false)
      }
    }

    console.log(integration , "Integration state before fetch")

    fetchIntegration()
  }, [appName, router])

  // fetch campaigns and recent activity
  useEffect(() => {
    const  fetchCampaigns = async () => {
      try {
        setIsLoading(true)
        const result = await getCampaignsByIntegrationName(appName)
        
        console.log("campaigns data:", result)

        if (result?.error) {
          throw new Error(result.error)
        }

        if (!result.data) {
          throw new Error("Integration not found")
        }

        setCampaigns(
          (result.data?.campaigns ?? []).map((c: any) => ({
            id: c.id,
            name: c.name,
            type: c.type ?? c.trigger ?? "Unknown",
            status: c.status,
            sent: c.sent ?? c.sentCount ?? 0,
            openRate: c.openRate ?? 0,
            clickRate: c.clickRate ?? 0,
          }))
        )
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to load integration")
        router.push("/dashboard/integration")
      } finally {
        setIsLoading(false)
      }
    }


    fetchCampaigns()
  }, [appName, router])

  const handleToggleStatus = async () => {
    if (!integration) return
    
    try {
      const newStatus = integration.status === "ACTIVE" ? "INACTIVE" : "ACTIVE"
      const result = await updateIntegrationStatus(integration.id, newStatus)
      
      if (result?.error) {
        throw new Error(result.error)
      }

      setIntegration(prev => prev ? { ...prev, status: newStatus } : null)
      toast.success(`Integration ${newStatus === "ACTIVE" ? "activated" : "deactivated"}`)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update status")
    }
  }


    const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(text)
    toast.success("Copied to clipboard")
    setTimeout(() => setCopied(null), 1500)
  }

  if (isLoading) {
    return (
      <Loader/>
    )
  }

  if (!integration) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Integration not found</h3>
          <Button onClick={() => router.push("/dashboard/integration")}>
            Back to Integrations
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Button 
              variant="outline" 
              size="sm" 
              className="border-gray-300 hover:bg-gray-50 bg-transparent"
              onClick={() => router.push("/dashboard/integration")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Integrations
            </Button>
          </div>

          <div className="bg-white text-black rounded-lg p-6 border border-gray-200 shadow-md">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-6">
                <Avatar className="h-20 w-20 border-2 border-yellow-500">
                  <AvatarImage src={integration.logo || "/2logo.jpg"} alt={integration.name}  className=" object-contain"/>
                  <AvatarFallback className="bg-gold-600 text-black text-xl font-bold">
                    {integration.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold">{integration.name}</h1>
                    <Badge
                      variant={integration.status === "ACTIVE" ? "default" : "secondary"}
                      className={integration.status === "ACTIVE" ? "bg-gold-600 text-black hover:bg-gold-400 capitalize" : ""}
                    >
                      {integration.status}
                    </Badge>
                  </div>
                  <p className="text-gray-500 mb-2">{integration.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleToggleStatus}
                  className="border-gold-600 text-gold-600 hover:bg-yellow-500 hover:text-black bg-transparent "
                >
                  {integration.status === "ACTIVE" ? (
                    <PowerOff className="h-4 w-4 mr-2" />
                  ) : (
                    <Power className="h-4 w-4 mr-2" />
                  )}
                  {integration.status === "ACTIVE" ? "Deactivate" : "Activate"}
                </Button>

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
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
              <Link href={`/dashboard/integration/${appName}/campaigns`}>
              <Zap className="h-4 w-4 text-gold-600" />
              </Link>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{integration.campaigns || 0}</div>
              <p className="text-xs text-gray-600">Active email campaigns</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Subscribers</CardTitle>
               <Link href={`/dashboard/integration/${appName}/subscribers`}>
               <Users className="h-4 w-4 text-gold-600" />
              </Link>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{(integration.subscribers || 0).toLocaleString()}</div>
              <p className="text-xs text-gray-600">Total subscribers</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Emails Sent</CardTitle>
              <Mail className="h-4 w-4 text-gold-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{(integration.emailsSent || 0).toLocaleString()}</div>
              <p className="text-xs text-gray-600">Number of sent mail</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Save Email</CardTitle>
              <BarChart3 className="h-4 w-4 text-gold-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{integration.totalEmail || 0}</div>
              <p className="text-xs text-gray-600">Number of save mail</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview" className="data-[state=active]:bg-gold-600 data-[state=active]:text-black">
              Overview
            </TabsTrigger>
            <TabsTrigger value="campaigns" className="data-[state=active]:bg-gold-600 data-[state=active]:text-black">
              Campaigns
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-gold-600 data-[state=active]:text-black">
              Analytics
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-gold-600 data-[state=active]:text-black">
              Settings
            </TabsTrigger>
            <TabsTrigger value="dev" className="data-[state=active]:bg-gold-600 data-[state=active]:text-black">
              Dev Tools
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Performance Metrics */}
              <Card>
                <CardHeader className="bg-black text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-yellow-500" />
                    Performance Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Open Rate</span>
                      <span className="text-sm font-bold">{integration.openRate || 0}%</span>
                    </div>
                    <Progress value={integration.openRate || 0} className="h-2" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Click Rate</span>
                      <span className="text-sm font-bold">{integration.clickRate || 0}%</span>
                    </div>
                    <Progress value={(integration.clickRate || 0) * 10} className="h-2" />
                  </div>
                  {/* <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Conversion Rate</span>
                      <span className="text-sm font-bold">{integration. || 0}%</span>
                    </div>
                    <Progress value={(integration.conversionRate || 0) * 20} className="h-2" />
                  </div> */}
                </CardContent>
              </Card>

              {/* Integration Details */}
              <Card>
                <CardHeader className="bg-black text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-yellow-500" />
                    Integration Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Category</label>
                      <p className="text-sm font-semibold">{integration.category}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Status</label>
                      <p className="text-sm font-semibold capitalize">{integration.status}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Last Sync</label>
                      <p className="text-sm font-semibold">{integration.lastSync || "Never"}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Added date</label>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-mono">{integration.dateAdded}</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Webhook URL</label>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-sm font-mono bg-gray-100 px-2 py-1 rounded flex-1">
                        {integration.webhookUrl || "Not configured"}
                      </p>
                      {integration.webhookUrl && (
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Copy className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Campaigns Tab */}
          <TabsContent value="campaigns" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Email Campaigns</h3>
                <Button onClick={() => router.push(`/dashboard/integration/${appName}/campaigns`)} className="bg-gold-600 text-black hover:bg-yellow-600">
                <Zap className="h-4 w-4 mr-2" />
                View All Campaigns
              </Button>
            </div>

            <Card>
              <CardHeader className="bg-black text-white rounded-t-lg">
                <CardTitle>Active Campaigns</CardTitle>
                <CardDescription className="text-gray-300">
                  Email campaigns running for this integration
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                  {campaigns.map((campaign) => (
                    <div key={campaign.id} className="p-6 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div>
                            <h4 className="font-semibold">{campaign.name}</h4>
                            <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                              <span>{campaign.type}</span>
                              <Badge
                                variant={campaign.status === "active" ? "default" : "secondary"}
                                className={campaign.status === "active" ? "bg-yellow-500 text-black" : ""}
                              >
                                {campaign.status}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-6 text-sm">
                          <div className="text-center">
                            <p className="font-semibold">{campaign.sent.toLocaleString()}</p>
                            <p className="text-gray-600">Sent</p>
                          </div>
                          <div className="text-center">
                            <p className="font-semibold">{campaign.openRate}%</p>
                            <p className="text-gray-600">Open Rate</p>
                          </div>
                          <div className="text-center">
                            <p className="font-semibold">{campaign.clickRate}%</p>
                            <p className="text-gray-600">Click Rate</p>
                          </div>
                          <Button variant="outline" size="sm" 
                          onClick={() => router.push(`/dashboard/integration/${appName}/campaigns/${campaign.id}`)}
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            View
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader className="bg-black text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-yellow-500" />
                  Analytics Dashboard
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="text-center py-12">
                  <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">Analytics Coming Soon</h3>
                  <p className="text-gray-500">Detailed analytics and reporting will be available here.</p>
                </div>
              </CardContent>
            </Card>  
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader className="bg-black text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-yellow-500" />
                  Integration Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-medium">Integration Name</label>
                      <p className="text-sm text-gray-600 mt-1">{integration.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Category</label>
                      <p className="text-sm text-gray-600 mt-1">{integration.category}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Website URL</label>
                      <p className="text-sm text-gray-600 mt-1">{integration.url}</p>
                    </div>
                    {integration.email && (
                      <div>
                        <label className="text-sm font-medium">Contact Email</label>
                        <p className="text-sm text-gray-600 mt-1">{integration.email}</p>
                      </div>
                    )}
                  </div>

                  <div className="border-t pt-6">
                    <h4 className="font-semibold mb-4">API Configuration</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">API Key</label>
                        <div className="flex items-center gap-2 mt-1">
                          <code className="bg-gray-100 px-3 py-2 rounded text-sm flex-1">
                            {integration.apiKey || "Not configured"}
                          </code>
                          {integration.apiKey && (
                            <Button variant="outline" size="sm">
                              <Copy className="h-4 w-4 mr-2" />
                              Copy
                            </Button>
                          )}
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Webhook URL</label>
                        <div className="flex items-center gap-2 mt-1">
                          <code className="bg-gray-100 px-3 py-2 rounded text-sm flex-1">
                            {integration.webhookUrl || "Not configured"}
                          </code>
                          {integration.webhookUrl && (
                            <Button variant="outline" size="sm">
                              <Copy className="h-4 w-4 mr-2" />
                              Copy
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <h4 className="font-semibold mb-4">Actions</h4>
                    <div className="flex gap-3">
                      <Button variant="outline">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Sync Now
                      </Button>
                      <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Export Data
                      </Button>
                      <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 bg-transparent">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Integration
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Dev Tab */}
          <TabsContent value="dev" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gold-600">
                  <Zap className="h-5 w-5" /> Integrated App ID
                </CardTitle>
                <CardDescription>
                  Copy and use these IDs to connect this integrated app in your apllication forms .
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Integration ID */}
                <div className="flex items-center justify-between bg-gray-100 p-3 rounded-md">
                  <span className="text-sm font-mono">{integration.id}</span>
                  <Button onClick={() => handleCopy(integration.id)} size="sm" variant="outline">
                    <Copy className="h-4 w-4 mr-1" />
                    {copied === integration.id ? <Check className="h-4 w-4 text-green-500" /> : "Copy"}
                  </Button>
                </div>

                {/* Campaign IDs */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-700">Campaign IDs</h4>
                  {campaigns.length === 0 && (
                    <p className="text-sm text-gray-500">No campaigns found.</p>
                  )}
                  {campaigns.map((campaign) => (
                    <div
                      key={campaign.id}
                      className="flex flex-col md:flex-row md:items-center md:justify-between bg-gray-100 p-3 rounded-md"
                    >
                      <div>
                        <p className="text-sm font-medium">{campaign.name}</p>
                        <p className="text-sm font-mono text-gray-600">{campaign.id}</p>
                      </div>
                      <Button
                        onClick={() => handleCopy(campaign.id.toString())}
                        size="sm"
                        variant="outline"
                        className="mt-2 md:mt-0"
                      >
                        <Copy className="h-4 w-4 mr-1" />
                        {copied === campaign.id.toString() ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          "Copy"
                        )}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
              </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Add Campaign Dialog */}
      <AddCampaignDialog open={showAddDialog} onOpenChange={setShowAddDialog} integrationId={integration?.id}  appName={integration.name} isIntegrationActive={integration?.status === "ACTIVE"} />
    </div>
  )
}




