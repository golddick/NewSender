




// "use client";

// import React, { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
// import { Card, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { UserPlus, AlertCircle } from "lucide-react";
// import toast from "react-hot-toast";
// import { addSubscriber } from "@/actions/subscriber/add.subscriber";
// import { SubscriptionStatus } from "@prisma/client";
// import { getCampaignsByIntegration } from "@/actions/campaign/get-campaign";

// interface Integration {
//   id: string;
//   name: string;
//  logo: string | null;
//   url?: string | null;
// }

// interface Campaign {
//   id: string;
//   name: string;
//   trigger: string;
//   integrationId: string;
// }

// interface AddSubscriberDialogProps {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
//   integrations?: Integration[] ;
//   preSelectedIntegration?: string;
// }

// const sources = [
//   { value: "website_form", label: "Website Form" },
//   { value: "manual_add", label: "Manual Add" },
//   { value: "api_import", label: "API Import" },
//   { value: "social_media", label: "Social Media" },
//   { value: "referral", label: "Referral" },
//   { value: "popup_form", label: "Popup Form" },
//   { value: "checkout_form", label: "Checkout Form" },
//   { value: "unknown", label: "Unknown" },
// ];

// const statuses = [
//   { value: SubscriptionStatus.Subscribed, label: "Subscribed", color: "bg-green-100 text-green-800" },
//   { value: SubscriptionStatus.Unsubscribed, label: "Unsubscribed", color: "bg-red-100 text-red-800" },
// ];

// export function AddSubscriberDialog({
//   open,
//   onOpenChange,
//   integrations ,
//   preSelectedIntegration,
// }: AddSubscriberDialogProps) {
//   const [formData, setFormData] = useState({
//     email: "",
//     name: "",
//     integrationId: preSelectedIntegration || "",
//     campaignId: "",
//     source: "manual_add",
//     status: SubscriptionStatus.Subscribed,
//     pageUrl: "",
//     formId: "",
//   });

//   const [campaigns, setCampaigns] = useState<Campaign[]>([]);
//   const [loadingCampaigns, setLoadingCampaigns] = useState(false);
//   const [errors, setErrors] = useState<{ [key: string]: string }>({});

//   // Fetch campaigns when integration changes
//   useEffect(() => {
//     const fetchCampaigns = async () => {
//       if (!formData.integrationId) {
//         setCampaigns([]);
//         return;
//       }

//       setLoadingCampaigns(true);
//       try {
//         const result = await getCampaignsByIntegration(formData.integrationId);

//         console.log("Fetched campaigns:", result);
//         if (result.data?.campaigns) {
//           setCampaigns(
//             result.data.campaigns.map((c: any) => ({
//               id: c.id,
//               name: c.name,
//               trigger: c.trigger,
//               integrationId: formData.integrationId,
//             }))
//           );
//         } else {
//           setCampaigns([]);
//           toast.error(result.error || "Failed to load campaigns");
//         }
//       } catch (error) {
//         console.error("Failed to fetch campaigns:", error);
//         toast.error("Failed to load campaigns");
//         setCampaigns([]);
//       } finally {
//         setLoadingCampaigns(false);
//       }
//     };

//     fetchCampaigns();
//   }, [formData.integrationId]);

//   const selectedIntegration = integrations.find((int) => int.id === formData.integrationId);
//   const availableCampaigns = campaigns.filter((campaign) => campaign.integrationId === formData.integrationId);

//   const validateForm = () => {
//     const newErrors: { [key: string]: string } = {};

//     if (!formData.email) {
//       newErrors.email = "Email is required";
//     } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
//       newErrors.email = "Please enter a valid email address";
//     }

//     if (!formData.integrationId) {
//       newErrors.integrationId = "Please select an integration";
//     }

//     if (!formData.campaignId) {
//       newErrors.campaignId = "Please select a campaign";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!validateForm()) {
//       return;
//     }

//     try {
//       const result = await addSubscriber({
//         email: formData.email,
//         name: formData.name,
//         integrationId: formData.integrationId,
//         campaignId: formData.campaignId,
//         source: formData.source,
//         status: formData.status,
//         pageUrl: formData.pageUrl,
//       });

//       if (!result.success) {
//         toast.error(result.error || "Failed to add subscriber");
//         return;
//       }

//       toast.success("Subscriber added successfully!");
      
//       // Reset form and close dialog
//       setFormData({
//         email: "",
//         name: "",
//         integrationId: preSelectedIntegration || "",
//         campaignId: "",
//         source: "manual_add",
//         status: SubscriptionStatus.Subscribed,
//         pageUrl: "",
//         formId: "",
//       });
//       setErrors({});
//       onOpenChange(false);
//     } catch (error) {
//       console.error("Submission error:", error);
//       toast.error("Failed to add subscriber");
//     }
//   };

//   const handleInputChange = (field: string, value: string) => {
//     setFormData((prev) => ({ ...prev, [field]: value }));

//     // Clear error when user starts typing
//     if (errors[field]) {
//       setErrors((prev) => ({ ...prev, [field]: "" }));
//     }

//     // Reset campaign when integration changes
//     if (field === "integrationId") {
//       setFormData((prev) => ({ ...prev, campaignId: "" }));
//     }
//   };

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
//             <CardContent className="p-4 space-y-4">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <Label htmlFor="email">Email Address *</Label>
//                   <Input
//                     id="email"
//                     type="email"
//                     value={formData.email}
//                     onChange={(e) => handleInputChange("email", e.target.value)}
//                     placeholder="subscriber@example.com"
//                     className={`mt-1 ${errors.email ? "border-red-500" : ""}`}
//                   />
//                   {errors.email && (
//                     <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
//                       <AlertCircle className="h-3 w-3" />
//                       {errors.email}
//                     </p>
//                   )}
//                 </div>

//                 <div>
//                   <Label htmlFor="name">Full Name (Optional)</Label>
//                   <Input
//                     id="name"
//                     value={formData.name}
//                     onChange={(e) => handleInputChange("name", e.target.value)}
//                     placeholder="John Smith"
//                   />
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <Label htmlFor="status">Status *</Label>
//                   <Select 
//                     value={formData.status} 
//                     onValueChange={(value) => handleInputChange("status", value)}
//                   >
//                     <SelectTrigger className="mt-1">
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {statuses.map((status) => (
//                         <SelectItem key={status.value} value={status.value}>
//                           <Badge className={status.color}>{status.label}</Badge>
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 <div>
//                   <Label htmlFor="source">Source *</Label>
//                   <Select 
//                     value={formData.source} 
//                     onValueChange={(value) => handleInputChange("source", value)}
//                   >
//                     <SelectTrigger className="mt-1">
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
//             <CardContent className="p-4 space-y-4">
//               <div>
//                 <Label htmlFor="integration">Integration *</Label>
//                 <Select
//                   value={formData.integrationId}
//                   onValueChange={(value) => handleInputChange("integrationId", value)}
//                 >
//                   <SelectTrigger className={`mt-1 ${errors.integrationId ? "border-red-500" : ""}`}>
//                     <SelectValue placeholder="Select an integration" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {integrations.map((integration) => (
//                       <SelectItem key={integration.id} value={integration.id}>
//                         <div className="flex items-center gap-2">
//                           <span>{integration.logo}</span>
//                           <div>
//                             <div>{integration.name}</div>
//                             {integration.url && <div className="text-xs text-muted-foreground">{integration.url}</div>}
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
//                 <div className="p-3 bg-muted rounded-lg">
//                   <div className="flex items-center gap-2 text-sm">
//                     <span>{selectedIntegration.logo}</span>
//                     <div>
//                       <div className="font-medium">{selectedIntegration.name}</div>
//                       {selectedIntegration.url && <div className="text-muted-foreground">{selectedIntegration.url}</div>}
//                     </div>
//                   </div>
//                 </div>
//               )}

//               <div>
//                 <Label htmlFor="campaign">Campaign *</Label>
//                 <Select
//                   value={formData.campaignId}
//                   onValueChange={(value) => handleInputChange("campaignId", value)}
//                   disabled={!formData.integrationId || loadingCampaigns}
//                 >
//                   <SelectTrigger className={`mt-1 ${errors.campaignId ? "border-red-500" : ""}`}>
//                     <SelectValue
//                       placeholder={
//                         loadingCampaigns 
//                           ? "Loading campaigns..." 
//                           : formData.integrationId 
//                             ? "Select a campaign" 
//                             : "Select integration first"
//                       }
//                     />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {availableCampaigns.map((campaign) => (
//                       <SelectItem key={campaign.id} value={campaign.id}>
//                         <div className="flex items-center gap-2">
//                           <div>
//                             <div>{campaign.name}</div>
//                             <Badge variant="outline" className="text-xs">
//                               {campaign.trigger}
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
//             <CardContent className="p-4 space-y-4">
//               <div>
//                 <Label htmlFor="pageUrl">Page URL (Optional)</Label>
//                 <Input
//                   id="pageUrl"
//                   type="url"
//                   value={formData.pageUrl}
//                   onChange={(e) => handleInputChange("pageUrl", e.target.value)}
//                   placeholder="https://example.com/signup"
//                 />
//                 <p className="text-xs text-muted-foreground mt-1">The page where the subscriber signed up</p>
//               </div>

//               <div>
//                 <Label htmlFor="formId">Form ID (Optional)</Label>
//                 <Input
//                   id="formId"
//                   value={formData.formId}
//                   onChange={(e) => handleInputChange("formId", e.target.value)}
//                   placeholder="form_newsletter_signup"
//                 />
//                 <p className="text-xs text-muted-foreground mt-1">The specific form used for subscription</p>
//               </div>
//             </CardContent>
//           </Card>

//           <DialogFooter>
//             <Button variant="outline" onClick={() => onOpenChange(false)}>
//               Cancel
//             </Button>
//             <Button type="submit">
//               <UserPlus className="h-4 w-4 mr-2" />
//               Add Subscriber
//             </Button>
//           </DialogFooter>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// }



"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
  integrations?: Integration[];
  onSuccess?: () => void;
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
  {
    value: SubscriptionStatus.Subscribed,
    label: "Subscribed",
    color: "bg-green-100 text-green-800",
  },
  {
    value: SubscriptionStatus.Unsubscribed,
    label: "Unsubscribed",
    color: "bg-red-100 text-red-800",
  },
];

export function AddSubscriberDialog({
  open,
  onOpenChange,
  integrations = [],
  onSuccess,
}: AddSubscriberDialogProps) {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    integrationId: "none",
    campaignId: "none",
    source: "manual_add",
    status: SubscriptionStatus.Subscribed,
    pageUrl: "",
  });

  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loadingCampaigns, setLoadingCampaigns] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchCampaigns = async () => {
      if (formData.integrationId === "none") {
        setCampaigns([]);
        return;
      }

      setLoadingCampaigns(true);
      try {
        const result = await getCampaignsByIntegration(formData.integrationId);
        setCampaigns(
          result.data?.campaigns?.map((c: any) => ({
            id: c.id,
            name: c.name,
            trigger: c.trigger,
            integrationId: formData.integrationId,
          })) || []
        );
      } catch (error) {
        console.error("Failed to fetch campaigns:", error);
        setCampaigns([]);
      } finally {
        setLoadingCampaigns(false);
      }
    };

    fetchCampaigns();
  }, [formData.integrationId]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const payload = {
        email: formData.email,
        name: formData.name || undefined,
        source: formData.source,
        status: formData.status,
        pageUrl: formData.pageUrl || undefined,
        integrationId:
          formData.integrationId !== "none" ? formData.integrationId : undefined,
        campaignId:
          formData.campaignId !== "none" ? formData.campaignId : undefined,
      };

      const result = await addSubscriber(payload);
      if (!result.success) throw new Error(result.error);

      toast.success("Subscriber added successfully!");
      setFormData({
        email: "",
        name: "",
        integrationId: "none",
        campaignId: "none",
        source: "manual_add",
        status: SubscriptionStatus.Subscribed,
        pageUrl: "",
      });
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to add subscriber"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
    if (field === "integrationId") {
      setFormData((prev) => ({ ...prev, campaignId: "none" }));
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
          {/* Email and Name */}
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
                    className={`mt-1 ${
                      errors.email ? "border-red-500" : ""
                    }`}
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
            </CardContent>
          </Card>

          {/* Status & Source */}
          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Status *</Label>
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
                  <Label>Source *</Label>
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
                <Label>Integration (Optional)</Label>
                <Select
                  value={formData.integrationId}
                  onValueChange={(value) =>
                    handleInputChange("integrationId", value)
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select an integration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {integrations.map((integration) => (
                      <SelectItem key={integration.id} value={integration.id}>
                        {integration.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {formData.integrationId !== "none" && (
                <div>
                  <Label>Campaign (Optional)</Label>
                  <Select
                    value={formData.campaignId}
                    onValueChange={(value) =>
                      handleInputChange("campaignId", value)
                    }
                    disabled={loadingCampaigns}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue
                        placeholder={
                          loadingCampaigns
                            ? "Loading campaigns..."
                            : "Select a campaign"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {campaigns.map((campaign) => (
                        <SelectItem key={campaign.id} value={campaign.id}>
                          {campaign.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Page URL */}
          <Card>
            <CardContent className="p-4">
              <Label htmlFor="pageUrl">Page URL (Optional)</Label>
              <Input
                id="pageUrl"
                value={formData.pageUrl}
                onChange={(e) =>
                  handleInputChange("pageUrl", e.target.value)
                }
                placeholder="https://example.com"
              />
            </CardContent>
          </Card>

          {/* Actions */}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Adding..." : "Add Subscriber"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}


// "use client";

// import React, { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
// import { Card, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { UserPlus, AlertCircle } from "lucide-react";
// import toast from "react-hot-toast";
// import { addSubscriber } from "@/actions/subscriber/add.subscriber";
// import { SubscriptionStatus } from "@prisma/client";
// import { getCampaignsByIntegration } from "@/actions/campaign/get-campaign";

// interface Integration {
//   id: string;
//   name: string;
//   logo: string | null;
//   url?: string | null;
// }

// interface Campaign {
//   id: string;
//   name: string;
//   trigger: string;
//   integrationId: string;
// }

// interface AddSubscriberDialogProps {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
//   integrations?: Integration[];
//   onSuccess?: () => void;
// }

// const sources = [
//   { value: "website_form", label: "Website Form" },
//   { value: "manual_add", label: "Manual Add" },
//   { value: "api_import", label: "API Import" },
//   { value: "social_media", label: "Social Media" },
//   { value: "referral", label: "Referral" },
//   { value: "popup_form", label: "Popup Form" },
//   { value: "checkout_form", label: "Checkout Form" },
//   { value: "unknown", label: "Unknown" },
// ];

// const statuses = [
//   { value: SubscriptionStatus.Subscribed, label: "Subscribed", color: "bg-green-100 text-green-800" },
//   { value: SubscriptionStatus.Unsubscribed, label: "Unsubscribed", color: "bg-red-100 text-red-800" },
// ];

// export function AddSubscriberDialog({
//   open,
//   onOpenChange,
//   integrations = [],
//   onSuccess,
// }: AddSubscriberDialogProps) {
//   const [formData, setFormData] = useState({
//     email: "",
//     name: "",
//     integrationId: "",
//     campaignId: "",
//     source: "manual_add",
//     status: SubscriptionStatus.Subscribed,
//     pageUrl: "",
//     formId: "",
//   });

//   const [campaigns, setCampaigns] = useState<Campaign[]>([]);
//   const [loadingCampaigns, setLoadingCampaigns] = useState(false);
//   const [submitting, setSubmitting] = useState(false);
//   const [errors, setErrors] = useState<{ [key: string]: string }>({});

//   useEffect(() => {
//     const fetchCampaigns = async () => {
//       if (!formData.integrationId) {
//         setCampaigns([]);
//         return;
//       }

//       setLoadingCampaigns(true);
//       try {
//         const result = await getCampaignsByIntegration(formData.integrationId);

//         if (result.data?.campaigns) {
//           setCampaigns(
//             result.data.campaigns.map((c: any) => ({
//               id: c.id,
//               name: c.name,
//               trigger: c.trigger,
//               integrationId: formData.integrationId,
//             }))
//           );
//         } else {
//           setCampaigns([]);
//         }
//       } catch (error) {
//         console.error("Failed to fetch campaigns:", error);
//         setCampaigns([]);
//       } finally {
//         setLoadingCampaigns(false);
//       }
//     };

//     fetchCampaigns();
//   }, [formData.integrationId]);

//   const validateForm = () => {
//     const newErrors: { [key: string]: string } = {};

//     if (!formData.email) {
//       newErrors.email = "Email is required";
//     } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
//       newErrors.email = "Please enter a valid email address";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!validateForm()) {
//       return;
//     }

//     setSubmitting(true);
//     try {
//       const payload = {
//         email: formData.email,
//         name: formData.name,
//         source: formData.source,
//         status: formData.status,
//         pageUrl: formData.pageUrl,
//         ...(formData.integrationId && { integrationId: formData.integrationId }),
//         ...(formData.campaignId && { campaignId: formData.campaignId }),
//       };

//       const result = await addSubscriber(payload);

//       if (!result.success) {
//         toast.error(result.error || "Failed to add subscriber");
//         return;
//       }

//       toast.success("Subscriber added successfully!");
      
//       setFormData({
//         email: "",
//         name: "",
//         integrationId: "",
//         campaignId: "",
//         source: "manual_add",
//         status: SubscriptionStatus.Subscribed,
//         pageUrl: "",
//         formId: "",
//       });
//       setErrors({});
//       onOpenChange(false);
//       onSuccess?.();
//     } catch (error) {
//       console.error("Submission error:", error);
//       toast.error("Failed to add subscriber");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleInputChange = (field: string, value: string) => {
//     setFormData((prev) => ({ ...prev, [field]: value }));

//     if (errors[field]) {
//       setErrors((prev) => ({ ...prev, [field]: "" }));
//     }

//     if (field === "integrationId") {
//       setFormData((prev) => ({ ...prev, campaignId: "" }));
//     }
//   };

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
//           <Card>
//             <CardContent className="p-4 space-y-4">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <Label htmlFor="email">Email Address *</Label>
//                   <Input
//                     id="email"
//                     type="email"
//                     value={formData.email}
//                     onChange={(e) => handleInputChange("email", e.target.value)}
//                     placeholder="subscriber@example.com"
//                     className={`mt-1 ${errors.email ? "border-red-500" : ""}`}
//                   />
//                   {errors.email && (
//                     <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
//                       <AlertCircle className="h-3 w-3" />
//                       {errors.email}
//                     </p>
//                   )}
//                 </div>

//                 <div>
//                   <Label htmlFor="name">Full Name (Optional)</Label>
//                   <Input
//                     id="name"
//                     value={formData.name}
//                     onChange={(e) => handleInputChange("name", e.target.value)}
//                     placeholder="John Smith"
//                   />
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <Label htmlFor="status">Status *</Label>
//                   <Select 
//                     value={formData.status} 
//                     onValueChange={(value) => handleInputChange("status", value)}
//                   >
//                     <SelectTrigger className="mt-1">
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {statuses.map((status) => (
//                         <SelectItem key={status.value} value={status.value}>
//                           <Badge className={status.color}>{status.label}</Badge>
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 <div>
//                   <Label htmlFor="source">Source *</Label>
//                   <Select 
//                     value={formData.source} 
//                     onValueChange={(value) => handleInputChange("source", value)}
//                   >
//                     <SelectTrigger className="mt-1">
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

//           <Card>
//             <CardContent className="p-4 space-y-4">
//               <div>
//                 <Label htmlFor="integration">Integration (Optional)</Label>
//                 <Select
//                   value={formData.integrationId}
//                   onValueChange={(value) => handleInputChange("integrationId", value)}
//                 >
//                   <SelectTrigger className="mt-1">
//                     <SelectValue placeholder="Select an integration (optional)" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="">None</SelectItem>
//                     {integrations.map((integration) => (
//                       <SelectItem key={integration.id} value={integration.id}>
//                         <div className="flex items-center gap-2">
//                           <span>{integration.logo}</span>
//                           <div>
//                             <div>{integration.name}</div>
//                             {integration.url && <div className="text-xs text-muted-foreground">{integration.url}</div>}
//                           </div>
//                         </div>
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>

//               {formData.integrationId && (
//                 <div>
//                   <Label htmlFor="campaign">Campaign (Optional)</Label>
//                   <Select
//                     value={formData.campaignId}
//                     onValueChange={(value) => handleInputChange("campaignId", value)}
//                     disabled={loadingCampaigns}
//                   >
//                     <SelectTrigger className="mt-1">
//                       <SelectValue
//                         placeholder={
//                           loadingCampaigns 
//                             ? "Loading campaigns..." 
//                             : "Select a campaign (optional)"
//                         }
//                       />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="">None</SelectItem>
//                       {campaigns.map((campaign) => (
//                         <SelectItem key={campaign.id} value={campaign.id}>
//                           <div className="flex items-center gap-2">
//                             <div>
//                               <div>{campaign.name}</div>
//                               <Badge variant="outline" className="text-xs">
//                                 {campaign.trigger}
//                               </Badge>
//                             </div>
//                           </div>
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>
//               )}
//             </CardContent>
//           </Card>

//           <Card>
//             <CardContent className="p-4 space-y-4">
//               <div>
//                 <Label htmlFor="pageUrl">Page URL (Optional)</Label>
//                 <Input
//                   id="pageUrl"
//                   type="url"
//                   value={formData.pageUrl}
//                   onChange={(e) => handleInputChange("pageUrl", e.target.value)}
//                   placeholder="https://example.com/signup"
//                 />
//               </div>
//             </CardContent>
//           </Card>

//           <DialogFooter>
//             <Button variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
//               Cancel
//             </Button>
//             <Button type="submit" disabled={submitting}>
//               {submitting ? (
//                 <span className="flex items-center gap-2">
//                   <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
//                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                   </svg>
//                   Adding...
//                 </span>
//               ) : (
//                 <span className="flex items-center gap-2">
//                   <UserPlus className="h-4 w-4" />
//                   Add Subscriber
//                 </span>
//               )}
//             </Button>
//           </DialogFooter>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// }