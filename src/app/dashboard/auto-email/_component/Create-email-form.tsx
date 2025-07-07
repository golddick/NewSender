

// "use client"

// import { useEffect, useState } from "react"
// import { useFormState, useFormStatus } from 'react-dom'
// import { getIntegrations } from "@/actions/application-Integration/application"
// import { getCampaignsByIntegrationName } from "@/actions/campaign/get-campaign"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Switch } from "@/components/ui/switch"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { ArrowLeft, Save, Send, Eye, Users, Mail, Clock, Bot, Bolt, Loader2, Target, Globe } from "lucide-react"
// import Link from "next/link"
// import { createEmailTemplate } from "@/actions/email/addEmail"

// interface Integration {
//   id: string
//   name: string
//   logo?: string
// }

// interface Campaign {
//   id: string
//   name: string
//   integrationId: string
// }

// const emailTemplates = [
//   { id: "welcome", name: "Welcome Email", description: "Greet new subscribers" },
//   { id: "newsletter", name: "Newsletter", description: "Regular content updates" },
//   { id: "promotional", name: "Promotional", description: "Sales and offers" },
// ]

// const automationTriggers = [
//   "User signs up",
//   "User makes first purchase",
//   "User abandons cart",
// ]

// export function CreateEmailForm() {
//   const [emailType, setEmailType] = useState<"instant" | "automated">("instant")
//   const [integrations, setIntegrations] = useState<Integration[]>([])
//   const [selectedIntegration, setSelectedIntegration] = useState("")
//   const [campaigns, setCampaigns] = useState<Campaign[]>([])
//   const [selectedCampaign, setSelectedCampaign] = useState("")
//   const [isLoading, setIsLoading] = useState({
//     integrations: true,
//     campaigns: false
//   })

//   const [formData, setFormData] = useState({
//     subject: "",
//     content: "",
//     scheduleType: "immediate",
//     scheduleDate: "",
//     scheduleTime: "",
//     trackOpens: true,
//     trackClicks: true,
//     enableUnsubscribe: true,
//     triggerEvent: "",
//     delayAmount: "0",
//     delayUnit: "hours",
//     template: "",
//   })

//   const [state, formAction] = useFormState(createEmailTemplate, { success: false, error: "" })

//   // Fetch integrations on component mount
//   useEffect(() => {
//     const fetchIntegrations = async () => {
//       try {
//         const { data, error } = await getIntegrations()
//         if (!error && data) {
//           setIntegrations(data.map((int: any) => ({
//             id: int.id,
//             name: int.name,
//             logo: int.logo || "🌐"
//           })))
//         }
//       } catch (error) {
//         console.error("Failed to fetch integrations:", error)
//       } finally {
//         setIsLoading(prev => ({ ...prev, integrations: false }))
//       }
//     }

//     fetchIntegrations()
//   }, [])

//   // Fetch campaigns when integration is selected
//   useEffect(() => {
//     const fetchCampaigns = async () => {
//       if (!selectedIntegration) return

//       setIsLoading(prev => ({ ...prev, campaigns: true }))
//       setSelectedCampaign("")
      
//       try {
//         const integration = integrations.find(i => i.id === selectedIntegration)
//         if (!integration) return

//         const { data, error } = await getCampaignsByIntegrationName(integration.name)
//         if (!error && data?.campaigns) {
//           setCampaigns(data.campaigns.map((camp: any) => ({
//             id: camp.id,
//             name: camp.name,
//             integrationId: selectedIntegration
//           })))
//         }
//       } catch (error) {
//         console.error("Failed to fetch campaigns:", error)
//       } finally {
//         setIsLoading(prev => ({ ...prev, campaigns: false }))
//       }
//     }

//     fetchCampaigns()
//   }, [selectedIntegration, integrations])

//   const handleInputChange = (field: string, value: string | boolean) => {
//     setFormData(prev => ({ ...prev, [field]: value }))
//   }

//   // Remove handleSubmit, let the form's action handle submission

//   const selectedIntegrationData = integrations.find(i => i.id === selectedIntegration)

//   if (isLoading.integrations) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <Loader2 className="w-8 h-8 animate-spin" />
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-white">
//       {/* Header */}
//       <div className="bg-black text-white p-6">
//         <div className="max-w-6xl mx-auto">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center">
//               <Link href="/dashboard/auto-email" className="mr-4">
//                 <Button variant="ghost" size="sm" className="text-white hover:bg-gray-800">
//                   <ArrowLeft className="w-4 h-4 mr-2" />
//                   Back to Emails
//                 </Button>
//               </Link>
//               <div>
//                 <h1 className="text-3xl font-bold">Create New Email</h1>
//                 <p className="text-gray-300 mt-2">Write and configure your email campaign</p>
//               </div>
//             </div>
//             <div className="flex items-center space-x-2">
//               <Badge variant="outline" className="bg-yellow-500 text-black border-yellow-500">
//                 {emailType === "instant" ? "Instant Email" : "Automated Email"}
//               </Badge>
//             </div>
//           </div>
//         </div>
//       </div>

//       <form action={formAction} className="max-w-6xl mx-auto p-6">
//         {/* Email Type Selection */}
//         <Card className="mb-6">
//           <CardHeader className="bg-black text-white">
//             <CardTitle className="flex items-center">
//               <Target className="w-5 h-5 mr-2" />
//               Email Type
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="p-6">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div
//                 className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${
//                   emailType === "instant" ? "border-yellow-500 bg-yellow-50" : "border-gray-200 hover:border-gray-300"
//                 }`}
//                 onClick={() => setEmailType("instant")}
//               >
//                 <div className="flex items-center mb-3">
//                   <div className="bg-orange-100 p-2 rounded-full mr-3">
//                     <Bolt className="w-5 h-5 text-orange-600" />
//                   </div>
//                   <h3 className="text-lg font-semibold text-black">Instant Email</h3>
//                 </div>
//           Send immediately or schedule for a specific time.
//       </div>

//               <div
//                 className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${
//                   emailType === "automated" ? "border-yellow-500 bg-yellow-50" : "border-gray-200 hover:border-gray-300"
//                 }`}
//                 onClick={() => setEmailType("automated")}
//               >
//                 <div className="flex items-center mb-3">
//                   <div className="bg-purple-100 p-2 rounded-full mr-3">
//                     <Bot className="w-5 h-5 text-purple-600" />
//                   </div>
//                   <h3 className="text-lg font-semibold text-black">Automated Email</h3>
//                 </div>
//                 <p className="text-gray-600 mb-4">
//                   Trigger automatically based on user actions or events.
//                 </p>
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           {/* Main Content */}
//           <div className="lg:col-span-2 space-y-6">
//             {/* Integration & Campaign */}
//             <Card>
//               <CardHeader className="bg-black text-white">
//                 <CardTitle className="flex items-center">
//                   <Globe className="w-5 h-5 mr-2" />
//                   Application Integration & Campaign
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="p-6 space-y-4">
//                 <div>
//                   <Label htmlFor="integration" className="text-black font-medium">
//                     Select Application *
//                   </Label>
//                   <Select 
//                     value={selectedIntegration} 
//                     onValueChange={setSelectedIntegration}
//                     disabled={isLoading.integrations}
//                   >
//                     <SelectTrigger className="mt-2">
//                       <SelectValue placeholder="Choose an application" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {integrations.map(integration => (
//                         <SelectItem key={integration.id} value={integration.id}>
//                           <div className="flex items-center">
//                             <span className="mr-2">{integration.logo}</span>
//                             {integration.name}
//                           </div>
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 <div>
//                   <Label htmlFor="campaign" className="text-black font-medium">
//                     Select Campaign *
//                   </Label>
//                   <Select 
//                     value={selectedCampaign} 
//                     onValueChange={setSelectedCampaign} 
//                     disabled={!selectedIntegration || isLoading.campaigns}
//                   >
//                     <SelectTrigger className="mt-2">
//                       <SelectValue placeholder={
//                         isLoading.campaigns ? "Loading campaigns..." :
//                         !selectedIntegration ? "Select an integration first" :
//                         "Choose a campaign"
//                       } />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {campaigns.map(campaign => (
//                         <SelectItem key={campaign.id} value={campaign.id}>
//                           {campaign.name}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Email Content */}
//             <Card>
//               <CardHeader className="bg-black text-white">
//                 <CardTitle className="flex items-center">
//                   <Mail className="w-5 h-5 mr-2" />
//                   Email Content
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="p-6">
//                 <Tabs defaultValue="content">
//                   <TabsList className="grid w-full grid-cols-2">
//                     <TabsTrigger value="content">Content</TabsTrigger>
//                     <TabsTrigger value="template">Template</TabsTrigger>
//                   </TabsList>

//                   <TabsContent value="content" className="space-y-4 mt-4">
//                     <div>
//                       <Label htmlFor="subject" className="text-black font-medium">
//                         Email Subject *
//                       </Label>
//                       <Input
//                         id="subject"
//                         name="subject"
//                         value={formData.subject}
//                         onChange={(e) => handleInputChange("subject", e.target.value)}
//                         placeholder="Enter email subject line"
//                         className="mt-2"
//                         required
//                       />
//                     </div>

//                     <div>
//                       <Label htmlFor="content" className="text-black font-medium">
//                         Email Content *
//                       </Label>
//                       <Textarea
//                         id="content"
//                         name="content"
//                         value={formData.content}
//                         onChange={(e) => handleInputChange("content", e.target.value)}
//                         placeholder="Write your email content here..."
//                         rows={12}
//                         className="mt-2"
//                         required
//                       />
//                     </div>
//                   </TabsContent>

//                   <TabsContent value="template" className="space-y-4 mt-4">
//                     <div>
//                       <Label className="text-black font-medium">Choose Template</Label>
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
//                         {emailTemplates.map(template => (
//                           <div
//                             key={template.id}
//                             className={`p-4 border rounded-lg cursor-pointer transition-all ${
//                               formData.template === template.id
//                                 ? "border-yellow-500 bg-yellow-50"
//                                 : "border-gray-200 hover:border-gray-300"
//                             }`}
//                             onClick={() => handleInputChange("template", template.id)}
//                           >
//                             <h4 className="font-medium text-black">{template.name}</h4>
//                             <p className="text-sm text-gray-600 mt-1">{template.description}</p>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   </TabsContent>
//                 </Tabs>
//               </CardContent>
//             </Card>

//             {/* Automation Settings (only for automated emails) */}
//             {emailType === "automated" && (
//               <Card>
//                 <CardHeader className="bg-black text-white">
//                   <CardTitle className="flex items-center">
//                     <Bot className="w-5 h-5 mr-2" />
//                     Automation Settings
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent className="p-6 space-y-4">
//                   <div>
//                     <Label htmlFor="trigger" className="text-black font-medium">
//                       Trigger Event *
//                     </Label>
//                     <Select
//                       value={formData.triggerEvent}
//                       onValueChange={(value) => handleInputChange("triggerEvent", value)}
//                     >
//                       <SelectTrigger>
//                         <SelectValue placeholder="Select trigger event" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {automationTriggers.map(trigger => (
//                           <SelectItem key={trigger} value={trigger}>
//                             {trigger}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </div>

//                   <div className="grid grid-cols-2 gap-4">
//                     <div>
//                       <Label htmlFor="delayAmount" className="text-black font-medium">
//                         Delay Amount
//                       </Label>
//                       <Input
//                         id="delayAmount"
//                         type="number"
//                         value={formData.delayAmount}
//                         onChange={(e) => handleInputChange("delayAmount", e.target.value)}
//                         placeholder="0"
//                       />
//                     </div>
//                     <div>
//                       <Label htmlFor="delayUnit" className="text-black font-medium">
//                         Delay Unit
//                       </Label>
//                       <Select
//                         value={formData.delayUnit}
//                         onValueChange={(value) => handleInputChange("delayUnit", value)}
//                       >
//                         <SelectTrigger>
//                           <SelectValue />
//                         </SelectTrigger>
//                         <SelectContent>
//                           <SelectItem value="minutes">Minutes</SelectItem>
//                           <SelectItem value="hours">Hours</SelectItem>
//                           <SelectItem value="days">Days</SelectItem>
//                         </SelectContent>
//                       </Select>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             )}
//           </div>

//           {/* Sidebar */}
//           <div className="space-y-6">
//             {/* Schedule Settings (only for instant emails) */}
//             {emailType === "instant" && (
//               <Card>
//                 <CardHeader className="bg-black text-white">
//                   <CardTitle className="flex items-center">
//                     <Clock className="w-5 h-5 mr-2" />
//                     Schedule
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent className="p-4 space-y-4">
//                   <div>
//                     <Label className="text-black font-medium text-sm">Send Options</Label>
//                     <Select
//                       value={formData.scheduleType}
//                       onValueChange={(value) => handleInputChange("scheduleType", value)}
//                     >
//                       <SelectTrigger>
//                         <SelectValue />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="immediate">Send Immediately</SelectItem>
//                         <SelectItem value="scheduled">Schedule for Later</SelectItem>
//                         <SelectItem value="draft">Save as Draft</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>

//                   {formData.scheduleType === "scheduled" && (
//                     <>
//                       <div>
//                         <Label htmlFor="scheduleDate" className="text-black font-medium text-sm">
//                           Date
//                         </Label>
//                         <Input
//                           id="scheduleDate"
//                           type="date"
//                           value={formData.scheduleDate}
//                           onChange={(e) => handleInputChange("scheduleDate", e.target.value)}
//                         />
//                       </div>

//                       <div>
//                         <Label htmlFor="scheduleTime" className="text-black font-medium text-sm">
//                           Time
//                         </Label>
//                         <Input
//                           id="scheduleTime"
//                           type="time"
//                           value={formData.scheduleTime}
//                           onChange={(e) => handleInputChange("scheduleTime", e.target.value)}
//                         />
//                       </div>
//                     </>
//                   )}
//                 </CardContent>
//               </Card>
//             )}

//             {/* Tracking Settings */}
//             <Card>
//               <CardHeader className="bg-black text-white">
//                 <CardTitle className="flex items-center">
//                   <Users className="w-5 h-5 mr-2" />
//                   Tracking
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="p-4 space-y-4">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <Label className="text-black font-medium text-sm">Track Opens</Label>
//                     <p className="text-xs text-gray-600">Monitor email opens</p>
//                   </div>
//                   <Switch
//                     checked={formData.trackOpens}
//                     onCheckedChange={(checked) => handleInputChange("trackOpens", checked)}
//                   />
//                 </div>

//                 <div className="flex items-center justify-between">
//                   <div>
//                     <Label className="text-black font-medium text-sm">Track Clicks</Label>
//                     <p className="text-xs text-gray-600">Monitor link clicks</p>
//                   </div>
//                   <Switch
//                     checked={formData.trackClicks}
//                     onCheckedChange={(checked) => handleInputChange("trackClicks", checked)}
//                   />
//                 </div>

//                 <div className="flex items-center justify-between">
//                   <div>
//                     <Label className="text-black font-medium text-sm">Unsubscribe Link</Label>
//                     <p className="text-xs text-gray-600">Include unsubscribe</p>
//                   </div>
//                   <Switch
//                     checked={formData.enableUnsubscribe}
//                     onCheckedChange={(checked) => handleInputChange("enableUnsubscribe", checked)}
//                   />
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Integration Preview */}
//             {selectedIntegrationData && (
//               <Card>
//                 <CardHeader className="bg-black text-white">
//                   <CardTitle className="text-sm">Selected Integration</CardTitle>
//                 </CardHeader>
//                 <CardContent className="p-4">
//                   <div className="flex items-center space-x-3">
//                     <div className="text-2xl">{selectedIntegrationData.logo}</div>
//                     <div>
//                       <h4 className="font-medium text-black text-sm">{selectedIntegrationData.name}</h4>
//                       {selectedCampaign && (
//                         <p className="text-xs text-gray-600">
//                           {campaigns.find(c => c.id === selectedCampaign)?.name}
//                         </p>
//                       )}
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             )}
//           </div>
//         </div>

//         {/* Action Buttons */}
//         <div className="flex justify-between items-center pt-6 border-t border-gray-200 mt-8">
//           <div className="flex space-x-3">
//             <Button variant="outline" className="border-gray-300 hover:bg-gray-50 bg-transparent">
//               <Eye className="w-4 h-4 mr-2" />
//               Preview
//             </Button>
//           </div>

//           <div className="flex space-x-3">
//             <SubmitButton />
//           </div>
//         </div>

//         {/* Status Messages */}
//         {state?.success && (
//           <div className="p-4 bg-green-100 text-green-800 rounded-lg mt-4">
//             Email template created successfully!
//           </div>
//         )}
//         {state?.error && (
//           <div className="p-4 bg-red-100 text-red-800 rounded-lg mt-4">
//             Error: {state.error}
//           </div>
//         )}
//       </form>
//     </div>
//   )
// }

// function SubmitButton() {
//   const { pending } = useFormStatus()
  
//   return (
//     <Button 
//       type="submit" 
//       disabled={pending}
//       className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
//     >
//       {pending ? (
//         <>
//           <Loader2 className="w-4 h-4 mr-2 animate-spin" />
//           Creating...
//         </>
//       ) : (
//         <>
//           <Save className="w-4 h-4 mr-2" />
//           Create Template
//         </>
//       )}
//     </Button>
//   )
// }