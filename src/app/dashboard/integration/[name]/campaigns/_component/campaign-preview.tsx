"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Edit,
  Trash2,
  Send,
  Eye,
  MousePointer,
  TrendingUp,
  Target,
  Clock,
  Mail,
  Settings,
  BarChart3,
  Download,
  Copy,
  Play,
  Pause,
  Plus,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { getCampaignById, updateCampaignStatus } from "@/actions/campaign/get-campaign"
import toast from "react-hot-toast"
import Loader from "@/components/Loader"
import { CampaignStatus } from "@prisma/client"


import EmailEditor, {
  EditorRef,
  EmailEditorProps,
} from "react-email-editor";
import { DefaultJsonData } from "@/assets/mails/default";

interface Campaign {
  id: string
  name: string
  description: string
  trigger: string
  status: CampaignStatus
  sentCount: number
  openRate: number
  clickRate: number
  lastSent: string
  createdAt: string
  template: string
  deliveryRate: number
  bounceRate: number
  unsubscribeRate: number
  avgTimeToOpen: string
  emailID: string
  emailSubject: string
  emailContent: any
  textContent: string
  totalSubscribers: number
  subscriberRate: number
  emailSettings: {
    trackOpens: boolean
    trackClicks: boolean
    enableUnsubscribe: boolean
    emailType: string
    totalEmails: number
  }
  integration?: {
    id: string
    email?: string
  }
}

interface CampaignPreviewProps {
  appName: string
  campaignId: string
}

export function CampaignPreview({ appName, campaignId }: CampaignPreviewProps) {
  const [ subjectTitle, setSubjectTitle] = useState('' );
  const [activeTab, setActiveTab] = useState("overview")
  const [loading, setLoading] = useState(true)
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const [campaign, setCampaign] = useState<Campaign | null>(null)
  // const [emailTitle, setEmailTitle] = useState("");
  const [open, setOpen] = useState(false);
  const router = useRouter()
  const emailEditorRef = useRef<EditorRef>(null);
  const [jsonData, setJsonData] = useState<any>(DefaultJsonData);

  useEffect(() => {
    const fetchCampaignData = async () => {
      try {
        setLoading(true)
        const result = await getCampaignById(campaignId)

        console.log(result, `Fetched campaign data for ID: ${campaignId}`)
        
        if (result.error) {
          throw new Error(result.error)
        }

        if (!result.data) {
          throw new Error("Campaign not found")
        }

        // if (result.data.emailContent) {
        //   setSubjectTitle(result.data.subject || result.data.emailSubject || "No Subject")
        //    setJsonData(result.data.emailContent);
        // }

        if (result.data.emailContent) {
          setSubjectTitle( result.data.emailSubject || "No Subject");

          try {
            const content = typeof result.data.emailContent === 'string'
              ? JSON.parse(result.data.emailContent)
              : result.data.emailContent;

            if (typeof content === 'object' && content !== null) {
              setJsonData(content);
            } else {
              console.warn("Invalid email content format");
            }
          } catch (err) {
            console.error("Failed to parse email content:", err);
          }
        }

        
        // if (result.data.emailContent) {
         
        // } else {
        //   setJsonData(DefaultJsonData);
        // }

        console.log(jsonData, 'jsonData')

        setCampaign({
          ...result.data,
          lastSent: result.data.lastSent ?? "",
          emailID: result.data.emailID ?? "",
          emailSettings: {
            ...result.data.emailSettings,
            totalEmails: result.data.totalEmails,
            
          },
        })
        const emailContent = campaign?.emailContent;
        console.log(emailContent, 'emailContent')
        console.log(campaign, 'campaign')
      

      } catch (error) {
        console.log(error, `Error fetching campaign data for ID: ${campaignId}`)
        toast.error(error instanceof Error ? error.message : "Failed to load campaign")
        router.push(`/dashboard/integration/${appName}/campaigns`)
      } finally {
        setLoading(false)
      }
    }

    fetchCampaignData()
  }, [campaignId, appName,campaign, router, jsonData, subjectTitle]);

  const handleStatusChange = async (newStatus:CampaignStatus) => {
    if (!campaign) return
    
    try {
      setUpdatingStatus(true)
      const result = await updateCampaignStatus(campaign.id, newStatus)
      
      if (result.error) {
        throw new Error(result.error)
      }

      toast.success(`Campaign status updated to ${newStatus}`)
      setCampaign(prev => prev ? { ...prev, status: newStatus } : null)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update campaign status")
    } finally {
      setUpdatingStatus(false)
    }
  }

    const handleCreate = () => {
    if (subjectTitle.trim().length === 0) {
      toast.error("Enter the email subject to continue!");
      return;
    }
    const formattedTitle = subjectTitle.replace(/\s+/g, "-").replace(/&/g, "-");
    router.push(`/dashboard/new-email?subject=${formattedTitle}`);
  };

   const onReady: EmailEditorProps["onReady"] = () => {
      emailEditorRef.current?.editor?.loadDesign(jsonData);
    };

  console.log(campaign, `Campaign data for app: ${appName}, campaignId: ${campaignId} `)

  if (loading || !campaign) {
    return <Loader />
  }



  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-50 text-green-700 border-green-200"
      case "INACTIVE":
        return "bg-red-50 text-red-700 border-red-200"
      case "DRAFT":
        return "bg-yellow-50 text-yellow-700 border-yellow-200"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  const getTriggerLabel = (trigger: string) => {
    switch (trigger) {
      case "subscription":
        return "New Subscription"
      case "email_verification":
        return "Email Verification"
      case "password_reset":
        return "Password Reset"
      case "unsubscribe":
        return "Unsubscribe"
      case "scheduled":
        return "Scheduled"
      case "account_activation":
        return "Account Activation"
        case "new_blog_post":
          return "New Blog Post"
        
      default:
        return trigger
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "Never"
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
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

  return (
    <div className="min-h-screen bg-white">
      <div className="w-full py-8 px-4 md:px-6">
        {/* Header */}
        <div className="mb-8">
          <Link
            href={`/dashboard/integration/${appName}/campaigns`}
            className="inline-flex items-center text-sm text-gray-600 hover:text-yellow-600 mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Campaigns
          </Link>

          {/* Campaign Header */}
      
             <div className=" bg-white text-black rounded-lg p-4 mb-2 shadow-md border border-gray-200">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <h1 className="text-3xl font-bold text-black">{campaign.name}</h1>
                  <Badge className={`${getStatusColor(campaign.status)} text-sm font-medium`}>
                    {campaign.status.toUpperCase()}
                  </Badge>
                </div>
                <p className="text-gray-500 mb-2 text-sm">{campaign.description}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-400">
                  <span>
                    <strong className="text-gold-600">Application:</strong> {appName}
                  </span>
                
                  <span>
                    <strong className="text-gold-600">Created:</strong> {formatDate(campaign.createdAt)}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                {campaign.status === "ACTIVE" ? (
                  <Button
                    variant="outline"
                    className=" bg-black text-white hover:bg-white hover:text-black "
                    onClick={() => handleStatusChange("INACTIVE")}
                    disabled={updatingStatus}
                  >
                    <Pause className="h-4 w-4 mr-2" />
                    {updatingStatus ? "Pausing..." : "Pause "}
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    className="bg-gold-300 text-black hover:bg-black hover:text-white "
                    onClick={() => handleStatusChange("ACTIVE")}
                    disabled={updatingStatus}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    {updatingStatus ? "Activating..." : "Activate "}
                  </Button>
                )}
                <Button
                  variant="outline"
                  className="bg-black text-white hover:bg-white hover:text-black "
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </div>
            </div>
          </div>
        </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6 container mx-auto mb-4">
          <TabsList className="grid w-full grid-cols-4 bg-gray-100">
            <TabsTrigger value="overview" className="data-[state=active]:bg-gold-600 data-[state=active]:text-black">
              <BarChart3 className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="preview" className="data-[state=active]:bg-gold-600 data-[state=active]:text-black">
              <Eye className="h-4 w-4 mr-2" />
              Email Preview
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-gold-600 data-[state=active]:text-black">
              <TrendingUp className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-gold-600 data-[state=active]:text-black">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-2 border-gray-100 hover:border-yellow-200 transition-colors">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                    <Send className="h-4 w-4 mr-2 text-blue-600" />
                    Total Sent
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-black">{campaign.sentCount.toLocaleString()}</div>
                  <p className="text-sm text-gray-500 mt-1">Emails delivered</p>
                </CardContent>
              </Card>

              <Card className="border-2 border-gray-100 hover:border-yellow-200 transition-colors">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                    <MousePointer className="h-4 w-4 mr-2 text-yellow-600" />
                    Total Email
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-3xl font-bold ${getPerformanceColor(campaign.clickRate, "click")}`}>
                   {campaign.emailSettings.totalEmails} 
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                       Total emails saved 
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-gray-100 hover:border-yellow-200 transition-colors">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                    <TrendingUp className="h-4 w-4 mr-2 text-purple-600" />
                    Total Subscribers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-3xl font-bold ${getPerformanceColor(campaign.deliveryRate, "delivery")}`}>
                    {campaign.totalSubscribers}
                  </div>
                  <p className="text-sm text-gray-500 mt-1"> Subscribers under campaign </p>
                </CardContent>
              </Card>

               <Card className="border-2 border-gray-100 hover:border-yellow-200 transition-colors">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                    <Eye className="h-4 w-4 mr-2 text-green-600" />
                    Open Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-3xl font-bold ${getPerformanceColor(campaign.openRate, "open")}`}>
                    {campaign.openRate}%
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {Math.round((campaign.sentCount * campaign.openRate) / 100).toLocaleString()} opens
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Performance Breakdown */}
            <Card className="border-2 border-gray-100">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-black">Performance Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">Delivery Rate</span>
                      <span className="text-sm font-bold text-black">{campaign.deliveryRate}%</span>
                    </div>
                    <Progress value={campaign.deliveryRate} className="h-2" />
                  </div> */}

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">Open Rate</span>
                      <span className="text-sm font-bold text-black">{campaign.openRate}%</span>
                    </div>
                    <Progress value={campaign.openRate} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">Click Rate</span>
                      <span className="text-sm font-bold text-black">{campaign.clickRate}%</span>
                    </div>
                    <Progress value={campaign.clickRate} className="h-2" />
                  </div>

                  {/* <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">Bounce Rate</span>
                      <span className="text-sm font-bold text-red-600">{campaign.bounceRate}%</span>
                    </div>
                    <Progress value={campaign.bounceRate} className="h-2" />
                  </div> */}

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">Unsubscribe Rate</span>
                      <span className="text-sm font-bold text-red-600">{campaign.unsubscribeRate}%</span>
                    </div>
                    <Progress value={campaign.unsubscribeRate} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">Subscriber Rate</span>
                      <span className="text-sm font-bold text-red-600">{campaign.subscriberRate}%</span>
                    </div>
                    <Progress value={campaign.subscriberRate} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Additional Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-2 border-gray-100">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-black flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-gray-600" />
                    Timing Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Last Sent:</span>
                    <span className="font-medium text-black">{formatDate(campaign.lastSent)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Avg. Time to Open:</span>
                    <span className="font-medium text-black">{campaign.avgTimeToOpen}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Created:</span>
                    <span className="font-medium text-black">{formatDate(campaign.createdAt)}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-gray-100">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-black flex items-center">
                    <Target className="h-5 w-5 mr-2 text-gray-600" />
                    Engagement
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Opens:</span>
                    <span className="font-medium text-black">
                      {Math.round((campaign.sentCount * campaign.openRate) / 100).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Clicks:</span>
                    <span className="font-medium text-black">
                      {Math.round((campaign.sentCount * campaign.clickRate) / 100).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Unsubscribes:</span>
                    <span className="font-medium text-red-600">
                      {Math.round((campaign.sentCount * campaign.unsubscribeRate) / 100).toLocaleString()}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-gray-100">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-black flex items-center">
                    <Mail className="h-5 w-5 mr-2 text-gray-600" />
                    Campaign Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Status:</span>
                    <Badge className={`${getStatusColor(campaign.status)} text-xs font-medium`}>
                      {campaign.status.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Trigger:</span>
                    <span className="font-medium text-black">{getTriggerLabel(campaign.trigger)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Template:</span>
                    <span className="font-medium text-black">{campaign.template}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Email Preview Tab */}
          <TabsContent value="preview" className="space-y-6">
             {
                 campaign.emailContent ? (
                     <div className="grid grid-cols-1  gap-6">
              {/* Email Preview */}
              <div className="lg:col-span-2">
                <Card className="border-2 border-gray-100">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg font-bold text-black">Email Preview</CardTitle>
                      <div className="flex space-x-2">
                           <Link 
                           href={`/dashboard/new-email?subject=${campaign.emailSubject}`}
                           >
                            <Button variant="outline" size="sm" className="border-gray-300 bg-transparent">
                              <Eye className="w-4 h-4 mr-2" />
                              View 
                            </Button>
                            </Link>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="border border-gray-200 rounded-lg overflow-hidden p-6">
                      {/* Email Header Simulation */}

                         <div className="mb-2 flex items-center gap-4 w-full">
                        <label className="block text-sm font-medium text-black text-nowrap ">Email Subject :</label>
                        <input
                        type="text"
                        value={subjectTitle}
                        disabled
                        className="w-full border rounded px-4 py-2 text-sm"
                        placeholder="Enter subject here"
                        />
                    </div>

                        <EmailEditor minHeight="50vh" ref={emailEditorRef} onReady={onReady} />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
                ): (
                   <div className="text-center py-12">
                               <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                               <h3 className="text-lg font-medium text-gray-900 mb-2">No emails found</h3>
                               <p className="text-gray-500 mb-4">Try adjusting your search or filter criteria</p>
                               <Button onClick={() => setOpen(true)} className="bg-gold-600 hover:bg-yellow-600 text-black font-semibold">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Create New Email
                                </Button>
                             </div>
                )
             }
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-2 border-gray-100">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-black">Performance Over Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">Analytics chart would go here</p>
                      <p className="text-sm text-gray-400">Showing opens, clicks, and engagement over time</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-gray-100">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-black">Geographic Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <Target className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">Geographic map would go here</p>
                      <p className="text-sm text-gray-400">Showing opens and clicks by location</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="border-2 border-gray-100">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-black">Detailed Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-black">{campaign.sentCount.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Total Recipients</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {Math.round((campaign.sentCount * campaign.deliveryRate) / 100).toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">Successfully Delivered</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">
                      {Math.round((campaign.sentCount * campaign.bounceRate) / 100).toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">Bounced</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">
                      {Math.round((campaign.sentCount * campaign.unsubscribeRate) / 100).toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">Unsubscribed</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-2 border-gray-100">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-black">Campaign Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Campaign Status</span>
                    <div className="flex items-center space-x-2">
                      <Badge className={`${getStatusColor(campaign.status)} text-xs font-medium`}>
                        {campaign.status.toUpperCase()}
                      </Badge>
                      {campaign.status === "ACTIVE" ? (
                        <Button size="sm" variant="outline" className="border-red-300 text-red-600 bg-transparent">
                          <Pause className="h-4 w-4 mr-1" />
                          Pause
                        </Button>
                      ) : (
                        <Button size="sm" variant="outline" className="border-green-300 text-green-600 bg-transparent">
                          <Play className="h-4 w-4 mr-1" />
                          Activate
                        </Button>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Trigger Event</span>
                    <span className="font-medium text-black">{getTriggerLabel(campaign.trigger)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Template</span>
                    <span className="font-medium text-black">{campaign.template}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-gray-100">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-black">Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-black">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Campaign
                  </Button>
                  <Button variant="outline" className="w-full border-gray-300 bg-transparent">
                    <Copy className="h-4 w-4 mr-2" />
                    Duplicate Campaign
                  </Button>
                  <Button variant="outline" className="w-full border-gray-300 bg-transparent">
                    <Download className="h-4 w-4 mr-2" />
                    Export Data
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-red-300 text-red-600 hover:bg-red-50 bg-transparent"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Campaign
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>


          {/* Modal */}
                      {open && (
                        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                          <div className="bg-white w-[90%] max-w-md rounded-lg p-6 shadow relative">
                            <button
                              className="absolute top-3 right-3 text-xl text-gray-500 hover:text-red-600"
                              onClick={() => setOpen(false)}
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                            <h5 className="text-xl font-semibold mb-4">Enter your Email Subject</h5>
                            <input
                              type="text"
                              className="border w-full h-10 px-3 rounded outline-none focus:ring"
                              value={subjectTitle}
                              onChange={(e) => setSubjectTitle(e.target.value)}
                              placeholder="e.g. Welcome to our newsletter"
                            />
                            <Button
                              color="primary"
                              className="mt-4 w-full rounded text-md font-semibold"
                              onClick={handleCreate}
                            >
                              Continue
                            </Button>
                          </div>
                        </div>
                      )}
      </div>
  )
}


