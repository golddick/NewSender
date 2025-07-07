// "use client"

// import type React from "react"

// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { UserPlus, Mail, Globe, Calendar, AlertCircle } from "lucide-react"
// import toast from "react-hot-toast"
// import { addSubscriber } from "@/actions/subscriber/add.subscriber"
// import { SubscriptionStatus } from "@prisma/client"

// interface Integration {
//   id: string
//   name: string
//   logo: string
//   url?: string
// }

// interface AddSubscriberDialogProps {
//   open: boolean
//   onOpenChange: (open: boolean) => void
//   integrations: Integration[]
//   preSelectedIntegration?: string
// }

// // Mock campaigns data
// const mockCampaigns = [
//   { id: "camp_welcome_001", name: "Welcome Series", type: "automated", integrationId: "int_shopify_77" },
//   { id: "camp_newsletter_002", name: "Weekly Newsletter", type: "recurring", integrationId: "int_wordpress_78" },
//   { id: "camp_promo_003", name: "Product Promotions", type: "promotional", integrationId: "int_shopify_77" },
//   { id: "camp_vip_004", name: "VIP Members", type: "exclusive", integrationId: "int_woocommerce_80" },
//   { id: "camp_abandon_005", name: "Cart Abandonment", type: "automated", integrationId: "int_shopify_77" },
// ]

// const sources = [
//   { value: "website_form", label: "Website Form" },
//   { value: "manual_add", label: "Manual Add" },
//   { value: "api_import", label: "API Import" },
//   { value: "social_media", label: "Social Media" },
//   { value: "referral", label: "Referral" },
//   { value: "popup_form", label: "Popup Form" },
//   { value: "checkout_form", label: "Checkout Form" },
//   { value: "unknown", label: "Unknown" },
// ]

// const statuses = [
//   { value: SubscriptionStatus.Subscribed, label: "Subscribed", color: "bg-green-100 text-green-800" },
//   { value: SubscriptionStatus.Unsubscribed, label: "Unsubscribed", color: "bg-red-100 text-red-800" },
// ]

// export function AddSubscriberDialog({
//   open,
//   onOpenChange,
//   integrations,
//   preSelectedIntegration,
// }: AddSubscriberDialogProps) {
//   const [formData, setFormData] = useState({
//     email: "",
//     name: "",
//     integrationId: preSelectedIntegration || "",
//     campaignId: "",
//     source: "manual_add",
//     status: SubscriptionStatus,
//     pageUrl: "",
//     formId: "",
//     newsLetterOwnerId: "owner123", // This would come from auth context
//   })

//   const [errors, setErrors] = useState<{ [key: string]: string }>({})

//   const selectedIntegration = integrations.find((int) => int.id === formData.integrationId)
//   const availableCampaigns = mockCampaigns.filter((campaign) => campaign.integrationId === formData.integrationId)

//   const validateForm = () => {
//     const newErrors: { [key: string]: string } = {}

//     if (!formData.email) {
//       newErrors.email = "Email is required"
//     } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
//       newErrors.email = "Please enter a valid email address"
//     }

//     if (!formData.integrationId) {
//       newErrors.integrationId = "Please select an integration"
//     }

//     if (!formData.campaignId) {
//       newErrors.campaignId = "Please select a campaign"
//     }

//     // if (formData.pageUrl && !/^https?:\/\/.+/.test(formData.pageUrl)) {
//     //   newErrors.pageUrl = "Please enter a valid URL (starting with http:// or https://)"
//     // }

//     setErrors(newErrors)
//     return Object.keys(newErrors).length === 0
//   }

// //   const handleSubmit = (e: React.FormEvent) => {
// //     e.preventDefault()

// //     if (!validateForm()) {
// //       return
// //     }

// //     // Here you would typically make an API call to create the subscriber
// //     console.log("Creating subscriber:", formData)

// //     // Reset form and close dialog
// //     setFormData({
// //       email: "",
// //       name: "",
// //       integrationId: preSelectedIntegration || "",
// //       campaignId: "",
// //       source: "manual_add",
// //       status: "Subscribed",
// //       pageUrl: "",
// //       formId: "",
// //       newsLetterOwnerId: "owner123",
// //     })
// //     setErrors({})
// //     onOpenChange(false)
// //   }


// // Update the handleSubmit function in your AddSubscriberDialog component
// const handleSubmit = async (e: React.FormEvent) => {
//   e.preventDefault()

//   if (!validateForm()) {
//     return
//   }

//   try {
//     const result = await addSubscriber({
//       email: formData.email,
//       name: formData.name,
//       integrationId: formData.integrationId,
//       campaignId: formData.campaignId,
//       source: formData.source,
//       status: formData.status.Subscribed,
//       pageUrl: formData.pageUrl,
//       formId: formData.formId,
//     })

//     console.log(result, 'Subscriber added successfully')

//     if (!result.success) {
//       toast.error(result.error || 'Failed to add subscriber')
//       return
//     }

//     toast.success('Subscriber added successfully!')
    
//     // Reset form and close dialog
//     setFormData({
//       email: "",
//       name: "",
//       integrationId: preSelectedIntegration || "",
//       campaignId: "",
//       source: "manual_add",
//       status: SubscriptionStatus,
//       pageUrl: "",
//       formId: "",
//       newsLetterOwnerId: "owner123",
//     })
//     setErrors({})
//     onOpenChange(false)
//   } catch (error) {
//     console.error('Submission error:', error)
//     toast.error('Failed to add subscriber')
//   }
// }

//   const handleInputChange = (field: string, value: string) => {
//     setFormData((prev) => ({ ...prev, [field]: value }))

//     // Clear error when user starts typing
//     if (errors[field]) {
//       setErrors((prev) => ({ ...prev, [field]: "" }))
//     }

//     // Reset campaign when integration changes
//     if (field === "integrationId") {
//       setFormData((prev) => ({ ...prev, campaignId: "" }))
//     }
//   }

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
//         <DialogHeader>
//           <DialogTitle className="text-2xl font-bold flex items-center gap-2">
//             <UserPlus className="h-6 w-6 text-yellow-600" />
//             Add New Subscriber
//           </DialogTitle>
//         </DialogHeader>

//         <form onSubmit={handleSubmit} className="space-y-6">
//           {/* Basic Information */}
//           <Card>
//             {/* <CardHeader className="bg-black text-white">
//               <CardTitle className="text-lg flex items-center gap-2">
//                 <Mail className="h-5 w-5 text-yellow-400" />
//                 Basic Information
//               </CardTitle>
//             </CardHeader> */}
//             <CardContent className="p-4 space-y-4">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <Label htmlFor="email" className="text-sm font-medium">
//                     Email Address *
//                   </Label>
//                   <Input
//                     id="email"
//                     type="email"
//                     value={formData.email}
//                     onChange={(e) => handleInputChange("email", e.target.value)}
//                     placeholder="subscriber@example.com"
//                     className={`mt-1 ${errors.email ? "border-red-500" : "border-gray-300"} focus:border-yellow-400 focus:ring-yellow-400`}
//                   />
//                   {errors.email && (
//                     <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
//                       <AlertCircle className="h-3 w-3" />
//                       {errors.email}
//                     </p>
//                   )}
//                 </div>

//                 <div>
//                   <Label htmlFor="name" className="text-sm font-medium">
//                     Full Name (Optional)
//                   </Label>
//                   <Input
//                     id="name"
//                     value={formData.name}
//                     onChange={(e) => handleInputChange("name", e.target.value)}
//                     placeholder="John Smith"
//                     className="mt-1 border-gray-300 focus:border-yellow-400 focus:ring-yellow-400"
//                   />
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <Label htmlFor="status" className="text-sm font-medium">
//                     Status *
//                   </Label>
//                   <Select value={formData.status.Subscribed} onValueChange={(value) => handleInputChange("status", value)}>
//                     <SelectTrigger className="mt-1 border-gray-300 focus:border-yellow-400 focus:ring-yellow-400">
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {statuses.map((status) => (
//                         <SelectItem key={status.value} value={SubscriptionStatus[status.value]}>
//                           <div className="flex items-center gap-2">
//                             <Badge className={status.color}>{status.label}</Badge>
//                           </div>
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 <div>
//                   <Label htmlFor="source" className="text-sm font-medium">
//                     Source *
//                   </Label>
//                   <Select value={formData.source} onValueChange={(value) => handleInputChange("source", value)}>
//                     <SelectTrigger className="mt-1 border-gray-300 focus:border-yellow-400 focus:ring-yellow-400">
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {sources.map((source) => (
//                         <SelectItem key={source.value} value={source.value}>
//                           {source.label}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           {/* Integration & Campaign */}
//           <Card>
//             {/* <CardHeader className="bg-black text-white">
//               <CardTitle className="text-lg flex items-center gap-2">
//                 <Globe className="h-5 w-5 text-yellow-400" />
//                 Integration & Campaign
//               </CardTitle>
//             </CardHeader> */}
//             <CardContent className="p-4 space-y-4">
//               <div>
//                 <Label htmlFor="integration" className="text-sm font-medium">
//                   Integration *
//                 </Label>
//                 <Select
//                   value={formData.integrationId}
//                   onValueChange={(value) => handleInputChange("integrationId", value)}
//                 >
//                   <SelectTrigger
//                     className={`mt-1 ${errors.integrationId ? "border-red-500" : "border-gray-300"} focus:border-yellow-400 focus:ring-yellow-400`}
//                   >
//                     <SelectValue placeholder="Select an integration" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {integrations.map((integration) => (
//                       <SelectItem key={integration.id} value={integration.id}>
//                         <div className="flex items-center gap-2">
//                           <span className="text-lg">{integration.logo}</span>
//                           <div>
//                             <div className="font-medium">{integration.name}</div>
//                             {integration.url && <div className="text-xs text-gray-500">{integration.url}</div>}
//                           </div>
//                         </div>
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//                 {errors.integrationId && (
//                   <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
//                     <AlertCircle className="h-3 w-3" />
//                     {errors.integrationId}
//                   </p>
//                 )}
//               </div>

//               {selectedIntegration && (
//                 <div className="p-3 bg-gray-50 rounded-lg">
//                   <div className="flex items-center gap-2 text-sm">
//                     <span className="text-lg">{selectedIntegration.logo}</span>
//                     <div>
//                       <div className="font-medium">{selectedIntegration.name}</div>
//                       {selectedIntegration.url && <div className="text-gray-500">{selectedIntegration.url}</div>}
//                     </div>
//                   </div>
//                 </div>
//               )}

//               <div>
//                 <Label htmlFor="campaign" className="text-sm font-medium">
//                   Campaign *
//                 </Label>
//                 <Select
//                   value={formData.campaignId}
//                   onValueChange={(value) => handleInputChange("campaignId", value)}
//                   disabled={!formData.integrationId}
//                 >
//                   <SelectTrigger
//                     className={`mt-1 ${errors.campaignId ? "border-red-500" : "border-gray-300"} focus:border-yellow-400 focus:ring-yellow-400`}
//                   >
//                     <SelectValue
//                       placeholder={formData.integrationId ? "Select a campaign" : "Select integration first"}
//                     />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {availableCampaigns.map((campaign) => (
//                       <SelectItem key={campaign.id} value={campaign.id}>
//                         <div className="flex items-center gap-2">
//                           <div>
//                             <div className="font-medium">{campaign.name}</div>
//                             <Badge variant="outline" className="text-xs">
//                               {campaign.type}
//                             </Badge>
//                           </div>
//                         </div>
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//                 {errors.campaignId && (
//                   <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
//                     <AlertCircle className="h-3 w-3" />
//                     {errors.campaignId}
//                   </p>
//                 )}
//               </div>
//             </CardContent>
//           </Card>

//           {/* Additional Information */}
//           <Card>
//             {/* <CardHeader className="bg-black text-white">
//               <CardTitle className="text-lg flex items-center gap-2">
//                 <Calendar className="h-5 w-5 text-yellow-400" />
//                 Additional Information
//               </CardTitle>
//             </CardHeader> */}
//             <CardContent className="p-4 space-y-4">
//               <div>
//                 <Label htmlFor="pageUrl" className="text-sm font-medium">
//                   Page URL (Optional)
//                 </Label>
//                 <Input
//                   id="pageUrl"
//                   type="url"
//                   value={formData.pageUrl}
//                   onChange={(e) => handleInputChange("pageUrl", e.target.value)}
//                   placeholder="https://example.com/signup"
//                   className={`mt-1 ${errors.pageUrl ? "border-red-500" : "border-gray-300"} focus:border-yellow-400 focus:ring-yellow-400`}
//                 />
//                 {errors.pageUrl && (
//                   <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
//                     <AlertCircle className="h-3 w-3" />
//                     {errors.pageUrl}
//                   </p>
//                 )}
//                 <p className="text-xs text-gray-500 mt-1">The page where the subscriber signed up</p>
//               </div>

//               <div>
//                 <Label htmlFor="formId" className="text-sm font-medium">
//                   Form ID (Optional)
//                 </Label>
//                 <Input
//                   id="formId"
//                   value={formData.formId}
//                   onChange={(e) => handleInputChange("formId", e.target.value)}
//                   placeholder="form_newsletter_signup"
//                   className="mt-1 border-gray-300 focus:border-yellow-400 focus:ring-yellow-400"
//                 />
//                 <p className="text-xs text-gray-500 mt-1">The specific form used for subscription</p>
//               </div>
//             </CardContent>
//           </Card>

//           <DialogFooter className="flex gap-2">
//             <Button
//               type="button"
//               variant="outline"
//               onClick={() => onOpenChange(false)}
//               className="border-gray-300 text-gray-700 hover:bg-gray-50"
//             >
//               Cancel
//             </Button>
//             <Button type="submit" className="bg-yellow-400 hover:bg-yellow-500 text-black font-medium">
//               <UserPlus className="h-4 w-4 mr-2" />
//               Add Subscriber
//             </Button>
//           </DialogFooter>
//         </form>
//       </DialogContent>
//     </Dialog>
//   )
// }











"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserPlus, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import { addSubscriber } from "@/actions/subscriber/add.subscriber";
import { SubscriptionStatus } from "@prisma/client";
import { getCampaignsByIntegration } from "@/actions/campaign/get-campaign";

interface Integration {
  id: string;
  name: string;
 logo: string | null;
  url?: string | null;
}

interface Campaign {
  id: string;
  name: string;
  trigger: string;
  integrationId: string;
}

interface AddSubscriberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  integrations: Integration[] ;
  preSelectedIntegration?: string;
}

const sources = [
  { value: "website_form", label: "Website Form" },
  { value: "manual_add", label: "Manual Add" },
  { value: "api_import", label: "API Import" },
  { value: "social_media", label: "Social Media" },
  { value: "referral", label: "Referral" },
  { value: "popup_form", label: "Popup Form" },
  { value: "checkout_form", label: "Checkout Form" },
  { value: "unknown", label: "Unknown" },
];

const statuses = [
  { value: SubscriptionStatus.Subscribed, label: "Subscribed", color: "bg-green-100 text-green-800" },
  { value: SubscriptionStatus.Unsubscribed, label: "Unsubscribed", color: "bg-red-100 text-red-800" },
];

export function AddSubscriberDialog({
  open,
  onOpenChange,
  integrations ,
  preSelectedIntegration,
}: AddSubscriberDialogProps) {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    integrationId: preSelectedIntegration || "",
    campaignId: "",
    source: "manual_add",
    status: SubscriptionStatus.Subscribed,
    pageUrl: "",
    formId: "",
  });

  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loadingCampaigns, setLoadingCampaigns] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Fetch campaigns when integration changes
  useEffect(() => {
    const fetchCampaigns = async () => {
      if (!formData.integrationId) {
        setCampaigns([]);
        return;
      }

      setLoadingCampaigns(true);
      try {
        const result = await getCampaignsByIntegration(formData.integrationId);

        console.log("Fetched campaigns:", result);
        if (result.data?.campaigns) {
          setCampaigns(
            result.data.campaigns.map((c: any) => ({
              id: c.id,
              name: c.name,
              trigger: c.trigger,
              integrationId: formData.integrationId,
            }))
          );
        } else {
          setCampaigns([]);
          toast.error(result.error || "Failed to load campaigns");
        }
      } catch (error) {
        console.error("Failed to fetch campaigns:", error);
        toast.error("Failed to load campaigns");
        setCampaigns([]);
      } finally {
        setLoadingCampaigns(false);
      }
    };

    fetchCampaigns();
  }, [formData.integrationId]);

  const selectedIntegration = integrations.find((int) => int.id === formData.integrationId);
  const availableCampaigns = campaigns.filter((campaign) => campaign.integrationId === formData.integrationId);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.integrationId) {
      newErrors.integrationId = "Please select an integration";
    }

    if (!formData.campaignId) {
      newErrors.campaignId = "Please select a campaign";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const result = await addSubscriber({
        email: formData.email,
        name: formData.name,
        integrationId: formData.integrationId,
        campaignId: formData.campaignId,
        source: formData.source,
        status: formData.status,
        pageUrl: formData.pageUrl,
      });

      if (!result.success) {
        toast.error(result.error || "Failed to add subscriber");
        return;
      }

      toast.success("Subscriber added successfully!");
      
      // Reset form and close dialog
      setFormData({
        email: "",
        name: "",
        integrationId: preSelectedIntegration || "",
        campaignId: "",
        source: "manual_add",
        status: SubscriptionStatus.Subscribed,
        pageUrl: "",
        formId: "",
      });
      setErrors({});
      onOpenChange(false);
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Failed to add subscriber");
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }

    // Reset campaign when integration changes
    if (field === "integrationId") {
      setFormData((prev) => ({ ...prev, campaignId: "" }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <UserPlus className="h-6 w-6 text-yellow-600" />
            Add New Subscriber
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="subscriber@example.com"
                    className={`mt-1 ${errors.email ? "border-red-500" : ""}`}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="name">Full Name (Optional)</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="John Smith"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="status">Status *</Label>
                  <Select 
                    value={formData.status} 
                    onValueChange={(value) => handleInputChange("status", value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statuses.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          <Badge className={status.color}>{status.label}</Badge>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="source">Source *</Label>
                  <Select 
                    value={formData.source} 
                    onValueChange={(value) => handleInputChange("source", value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {sources.map((source) => (
                        <SelectItem key={source.value} value={source.value}>
                          {source.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Integration & Campaign */}
          <Card>
            <CardContent className="p-4 space-y-4">
              <div>
                <Label htmlFor="integration">Integration *</Label>
                <Select
                  value={formData.integrationId}
                  onValueChange={(value) => handleInputChange("integrationId", value)}
                >
                  <SelectTrigger className={`mt-1 ${errors.integrationId ? "border-red-500" : ""}`}>
                    <SelectValue placeholder="Select an integration" />
                  </SelectTrigger>
                  <SelectContent>
                    {integrations.map((integration) => (
                      <SelectItem key={integration.id} value={integration.id}>
                        <div className="flex items-center gap-2">
                          <span>{integration.logo}</span>
                          <div>
                            <div>{integration.name}</div>
                            {integration.url && <div className="text-xs text-muted-foreground">{integration.url}</div>}
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.integrationId && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.integrationId}
                  </p>
                )}
              </div>

              {selectedIntegration && (
                <div className="p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-2 text-sm">
                    <span>{selectedIntegration.logo}</span>
                    <div>
                      <div className="font-medium">{selectedIntegration.name}</div>
                      {selectedIntegration.url && <div className="text-muted-foreground">{selectedIntegration.url}</div>}
                    </div>
                  </div>
                </div>
              )}

              <div>
                <Label htmlFor="campaign">Campaign *</Label>
                <Select
                  value={formData.campaignId}
                  onValueChange={(value) => handleInputChange("campaignId", value)}
                  disabled={!formData.integrationId || loadingCampaigns}
                >
                  <SelectTrigger className={`mt-1 ${errors.campaignId ? "border-red-500" : ""}`}>
                    <SelectValue
                      placeholder={
                        loadingCampaigns 
                          ? "Loading campaigns..." 
                          : formData.integrationId 
                            ? "Select a campaign" 
                            : "Select integration first"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {availableCampaigns.map((campaign) => (
                      <SelectItem key={campaign.id} value={campaign.id}>
                        <div className="flex items-center gap-2">
                          <div>
                            <div>{campaign.name}</div>
                            <Badge variant="outline" className="text-xs">
                              {campaign.trigger}
                            </Badge>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.campaignId && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.campaignId}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card>
            <CardContent className="p-4 space-y-4">
              <div>
                <Label htmlFor="pageUrl">Page URL (Optional)</Label>
                <Input
                  id="pageUrl"
                  type="url"
                  value={formData.pageUrl}
                  onChange={(e) => handleInputChange("pageUrl", e.target.value)}
                  placeholder="https://example.com/signup"
                />
                <p className="text-xs text-muted-foreground mt-1">The page where the subscriber signed up</p>
              </div>

              <div>
                <Label htmlFor="formId">Form ID (Optional)</Label>
                <Input
                  id="formId"
                  value={formData.formId}
                  onChange={(e) => handleInputChange("formId", e.target.value)}
                  placeholder="form_newsletter_signup"
                />
                <p className="text-xs text-muted-foreground mt-1">The specific form used for subscription</p>
              </div>
            </CardContent>
          </Card>

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              <UserPlus className="h-4 w-4 mr-2" />
              Add Subscriber
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}