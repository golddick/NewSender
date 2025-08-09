
// "use client";

// import React, { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import { Card, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { UserPlus, AlertCircle } from "lucide-react";
// import toast from "react-hot-toast";
// import { addSubscriber } from "@/actions/subscriber/add.subscriber";
// import { SubscriptionStatus } from "@prisma/client";
// import { getLogUserCampaigns } from "@/actions/campaign/get-campaign";

// interface Campaign {
//   id: string;
//   name: string;
//   description:string,
//   type: string,
//   emails: string[],
// }

// interface AddSubscriberDialogProps {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
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
//   {
//     value: SubscriptionStatus.Subscribed,
//     label: "Subscribed",
//     color: "bg-green-100 text-green-800",
//   },
//   {
//     value: SubscriptionStatus.Unsubscribed,
//     label: "Unsubscribed",
//     color: "bg-red-100 text-red-800",
//   },
// ];

// export function AddSubscriberDialog({
//   open,
//   onOpenChange,
//   onSuccess,
// }: AddSubscriberDialogProps) {
//   const [formData, setFormData] = useState({
//     email: "",
//     name: "",
//     integrationId: "none",
//     campaignId: "none",
//     source: "manual_add",
//     status: SubscriptionStatus.Subscribed,
//     pageUrl: "",
//   });

//   const [campaigns, setCampaigns] = useState<Campaign[]>([]);
//   const [loadingCampaigns, setLoadingCampaigns] = useState(false);
//   const [submitting, setSubmitting] = useState(false);
//   const [errors, setErrors] = useState<{ [key: string]: string }>({});

//   useEffect(() => {
//     const fetchCampaigns = async () => {
//       if (formData.integrationId === "none") {
//         setCampaigns([]);
//         return;
//       }

//       setLoadingCampaigns(true);
//       try {
//         const result = await getLogUserCampaigns();
//         setCampaigns(
//           result.data?.campaigns?.map((c: any) => ({
//             id: c.id,
//             name: c.name,
//             description: c.description,
//             type: c.type,
//             emails: c.emails,
//           })) || []
//         );
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
//     if (!validateForm()) return;

//     setSubmitting(true);
//     try {
//       const payload = {
//         email: formData.email,
//         name: formData.name || undefined,
//         source: formData.source,
//         status: formData.status,
//         pageUrl: formData.pageUrl || undefined,
//         integrationId:
//           formData.integrationId !== "none" ? formData.integrationId : undefined,
//         campaignId:
//           formData.campaignId !== "none" ? formData.campaignId : undefined,
//       };

//       const result = await addSubscriber(payload);
//       if (!result.success) throw new Error(result.error);

//       toast.success("Subscriber added successfully!");
//       setFormData({
//         email: "",
//         name: "",
//         integrationId: "none",
//         campaignId: "none",
//         source: "manual_add",
//         status: SubscriptionStatus.Subscribed,
//         pageUrl: "",
//       });
//       onOpenChange(false);
//       onSuccess?.();
//     } catch (error) {
//       toast.error(
//         error instanceof Error ? error.message : "Failed to add subscriber"
//       );
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleInputChange = (field: string, value: string) => {
//     setFormData((prev) => ({ ...prev, [field]: value }));
//     if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
//     if (field === "integrationId") {
//       setFormData((prev) => ({ ...prev, campaignId: "none" }));
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
//           {/* Email and Name */}
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
//                     className={`mt-1 ${
//                       errors.email ? "border-red-500" : ""
//                     }`}
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
//             </CardContent>
//           </Card>

//           {/* Status & Source */}
//           <Card>
//             <CardContent className="p-4 space-y-4">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <Label>Status *</Label>
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
//                   <Label>Source *</Label>
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
//                 <Label>Integration (Optional)</Label>
//                 <Select
//                   value={formData.integrationId}
//                   onValueChange={(value) =>
//                     handleInputChange("integrationId", value)
//                   }
//                 >
//                   <SelectTrigger className="mt-1">
//                     <SelectValue placeholder="Select an integration" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="none">None</SelectItem>
//                     {integrations.map((integration) => (
//                       <SelectItem key={integration.id} value={integration.id}>
//                         {integration.name}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>

//               {formData.integrationId !== "none" && (
//                 <div>
//                   <Label>Campaign (Optional)</Label>
//                   <Select
//                     value={formData.campaignId}
//                     onValueChange={(value) =>
//                       handleInputChange("campaignId", value)
//                     }
//                     disabled={loadingCampaigns}
//                   >
//                     <SelectTrigger className="mt-1">
//                       <SelectValue
//                         placeholder={
//                           loadingCampaigns
//                             ? "Loading campaigns..."
//                             : "Select a campaign"
//                         }
//                       />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="none">None</SelectItem>
//                       {campaigns.map((campaign) => (
//                         <SelectItem key={campaign.id} value={campaign.id}>
//                           {campaign.name}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>
//               )}
//             </CardContent>
//           </Card>

//           {/* Page URL */}
//           <Card>
//             <CardContent className="p-4">
//               <Label htmlFor="pageUrl">Page URL (Optional)</Label>
//               <Input
//                 id="pageUrl"
//                 value={formData.pageUrl}
//                 onChange={(e) =>
//                   handleInputChange("pageUrl", e.target.value)
//                 }
//                 placeholder="https://example.com"
//               />
//             </CardContent>
//           </Card>

//           {/* Actions */}
//           <DialogFooter>
//             <Button
//               type="button"
//               variant="outline"
//               onClick={() => onOpenChange(false)}
//               disabled={submitting}
//             >
//               Cancel
//             </Button>
//             <Button type="submit" disabled={submitting}>
//               {submitting ? "Adding..." : "Add Subscriber"}
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
import { getLogUserCampaigns } from "@/actions/campaign/get-campaign";

interface Email {
  id: string;
  title: string;
  status: string;
}

interface Campaign {
  id: string;
  name: string;
  description: string;
  type: string;
  emails: Email[]
}

interface AddSubscriberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
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
  onSuccess,
}: AddSubscriberDialogProps) {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
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
      setLoadingCampaigns(true);
      try {
        const result = await getLogUserCampaigns();
        if (Array.isArray(result)) {
          setCampaigns(result.map(campaign => ({
            id: campaign.id,
            name: campaign.name,
            description: campaign.description || "",
            type: campaign.type || "",
            emails: campaign.emails || []
          })));
        }
      } catch (error) {
        console.error("Failed to fetch campaigns:", error);
        toast.error("Failed to load campaigns");
      } finally {
        setLoadingCampaigns(false);
      }
    };

    if (open) {
      fetchCampaigns();
    }
  }, [open]);

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
        campaignId: formData.campaignId !== "none" ? formData.campaignId : undefined,
      };

      const result = await addSubscriber(payload);
      if (!result.success) throw new Error(result.error);

      toast.success("Subscriber added successfully!");
      setFormData({
        email: "",
        name: "",
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

          {/* Campaign */}
          <Card>
            <CardContent className="p-4 space-y-4">
              <div>
                <Label>Campaign (Optional)</Label>
                <Select
                  value={formData.campaignId}
                  onValueChange={(value) => handleInputChange("campaignId", value)}
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
            </CardContent>
          </Card>

          {/* Page URL */}
          <Card>
            <CardContent className="p-4">
              <Label htmlFor="pageUrl">Page URL (Optional)</Label>
              <Input
                id="pageUrl"
                value={formData.pageUrl}
                onChange={(e) => handleInputChange("pageUrl", e.target.value)}
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