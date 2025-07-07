







// "use client"

// import React, { useState } from "react"
// import { Button } from "@/components/ui/button"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"
// import { toast } from "sonner"
// import { createCampaign } from "@/actions/campaign/add-campaign"
// import { Switch } from "@/components/ui/switch"
// import { CampaignStatus, CampaignTrigger } from "@prisma/client"

// interface AddCampaignDialogProps {
//   open: boolean
//   onOpenChange: (open: boolean) => void
//   integrationId?: string
//   appName: string
//   isIntegrationActive: boolean
// }

// interface CampaignFormData {
//   name: string
//   trigger: string
//   status: "active" | "inactive"
//   description: string
//   subject: string
//   isAutoTrigger: boolean
// }

// interface FormErrors {
//   name?: string[]
//   subject?: string[]
//   integrationId?: string[]
//   trigger?: string[]
//   [key: string]: string[] | undefined
// }

// // Triggers that should suggest enabling auto-trigger by default
// const AUTO_TRIGGER_TYPES = [
//   "new_User",
//   "newsletter_Subscriber",
//   "email_verification",
//   "unsubscribe",
//   "scheduled",
//   "notification"
// ]

// export function AddCampaignDialog({
//   open,
//   onOpenChange,
//   integrationId,
//   appName,
//   isIntegrationActive
// }: AddCampaignDialogProps) {
//   const [formData, setFormData] = useState<CampaignFormData>({
//     name: "",
//     description: "",
//     trigger: "",
//     subject: "",
//     status: "inactive",
//     isAutoTrigger: false
//   })

//   const [isSubmitting, setIsSubmitting] = useState(false)
//   const [formErrors, setFormErrors] = useState<FormErrors>({})
//   const [apiError, setApiError] = useState<string | null>(null)

//   const handleTriggerChange = (value: string) => {
//     const shouldAutoTrigger = AUTO_TRIGGER_TYPES.includes(value)
//     setFormData({
//       ...formData,
//       trigger: value,
//       isAutoTrigger: shouldAutoTrigger
//     })
//     // Clear trigger errors when changed
//     setFormErrors(prev => ({ ...prev, trigger: undefined }))
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
    
//     // Reset errors
//     setFormErrors({})
//     setApiError(null)

//     if (!isIntegrationActive) {
//       setApiError("APPLICATION MUST FIRST BE ACTIVE to create campaign")
//       return
//     }

//     if (!integrationId) {
//       setFormErrors({ integrationId: ["Integration ID is required"] })
//       return
//     }

//     setIsSubmitting(true)

//     try {
//       const form = new FormData()
//       form.append("name", formData.name)
//       form.append("description", formData.description)
//       form.append("trigger", formData.trigger)
//       form.append("subject", formData.subject)
//       form.append("status", formData.status)
//       form.append("integrationId", integrationId)
//       form.append("appName", appName)
//       form.append("enableAutoTrigger", formData.isAutoTrigger.toString())

//       const result = await createCampaign({}, form)

//       console.log("Campaign creation result:", result)
      
//       if (result?.errors) {
//         // Handle form validation errors
//         setFormErrors(result.errors)
//         if (result.message) {
//           setApiError(result.message)
//         }
//         return
//       }

//       if (result?.message) {
//         if (result.message.includes("Campaign created successfully")) {
//           toast.success(result.message)
//           setFormData({
//             name: "",
//             description: "",
//             trigger: "",
//             subject: "",
//             status: "inactive",
//             isAutoTrigger: false
//           })
//           onOpenChange(false)
//         } else {
//           // Handle API errors (like limit reached)
//           setApiError(result.message)
//           toast.error(result.message)
//         }
//       }
//     } catch (error) {
//       console.error("Failed to add campaign:", error)
//       setApiError(
//         error instanceof Error ? error.message : "Failed to create campaign"
//       )
//       toast.error("An unexpected error occurred")
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="sm:max-w-[600px] bg-white">
//         <DialogHeader className="bg-black text-white p-6 -m-6 mb-6 rounded-t-lg">
//           <DialogTitle className="text-xl font-bold">Create New Campaign</DialogTitle>
//           <DialogDescription className="text-gray-300">
//             Set up an automated email campaign for your integration
//           </DialogDescription>
//         </DialogHeader>

//         <form onSubmit={handleSubmit} className="space-y-6">
//           {!isIntegrationActive && (
//             <div className="bg-red-50 text-red-600 p-3 rounded-md border border-red-200">
//               <p className="font-medium">Warning:</p>
//               <p>You cannot create campaigns until the integration is active</p>
//             </div>
//           )}

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {/* Campaign Name */}
//             <div className="space-y-2">
//               <Label htmlFor="name">Campaign Name *</Label>
//               <Input
//                 id="name"
//                 placeholder="e.g., Welcome Email"
//                 value={formData.name}
//                 onChange={(e) => {
//                   setFormData({ ...formData, name: e.target.value })
//                   setFormErrors(prev => ({ ...prev, name: undefined }))
//                 }}
//                 required
//                 disabled={!isIntegrationActive}
//                 className={formErrors.name ? "border-red-500" : ""}
//               />
//               {/* {formErrors.name && (
//                 <p className="text-sm text-red-500">{formErrors.name.join(", ")}</p>
//               )} */}
//             </div>

//             {/* Trigger */}
//             <div className="space-y-2">
//               <Label htmlFor="trigger">Trigger Event *</Label>
//               <Select
//                 value={formData.trigger}
//                 onValueChange={handleTriggerChange}
//                 required
//                 disabled={!isIntegrationActive}
//               >
//                 <SelectTrigger className={formErrors.trigger ? "border-red-500" : ""}>
//                   <SelectValue placeholder="Select trigger" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value={CampaignTrigger.new_User}>New User</SelectItem>
//                   <SelectItem value={CampaignTrigger.newsletter_Subscriber}>New Newsletter Subscription</SelectItem>
//                   <SelectItem value={CampaignTrigger.email_verification}>Email Verification</SelectItem>
//                   <SelectItem value={CampaignTrigger.unsubscribe}>Newsletter Unsubscribe</SelectItem>
//                   <SelectItem value={CampaignTrigger.scheduled}>Scheduled</SelectItem>
//                   <SelectItem value={CampaignTrigger.notification}>Notification</SelectItem>
//                 </SelectContent>
//               </Select>
//               {formErrors.trigger && (
//                 <p className="text-sm text-red-500">{formErrors.trigger.join(", ")}</p>
//               )}
//             </div>
//           </div>

//           {/* Subject */}
//           <div className="space-y-2">
//             <Label htmlFor="subject">Email Subject *</Label>
//             <Input
//               id="subject"
//               placeholder="e.g., Welcome to our platform!"
//               value={formData.subject}
//               onChange={(e) => {
//                 setFormData({ ...formData, subject: e.target.value })
//                 setFormErrors(prev => ({ ...prev, subject: undefined }))
//               }}
//               required
//               disabled={!isIntegrationActive}
//               className={formErrors.subject ? "border-red-500" : ""}
//             />
//             {formErrors.subject && (
//               <p className="text-sm text-red-500">{formErrors.subject.join(", ")}</p>
//             )}
//           </div>

//           {/* Description */}
//           <div className="space-y-2">
//             <Label htmlFor="description">Description</Label>
//             <Textarea
//               id="description"
//               value={formData.description}
//               onChange={(e) => setFormData({ ...formData, description: e.target.value })}
//               placeholder="Describe when and why this email is sent..."
//               className="min-h-[80px]"
//               disabled={!isIntegrationActive}
//             />
//           </div>

//           {/* Status */}
//           <div className="space-y-2">
//             <Label htmlFor="status">Initial Status</Label>
//             <Select
//               value={formData.status}
//               onValueChange={(value) => setFormData({ ...formData, status: value as "active" | "inactive" })}
//               disabled={!isIntegrationActive}
//             >
//               <SelectTrigger>
//                 <SelectValue placeholder="Select status" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value={CampaignStatus.active}>Active</SelectItem>
//                 <SelectItem value={CampaignStatus.inactive}>Inactive</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>

//           {/* Auto Trigger Switch */}
//           <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
//             <div className="space-y-1">
//               <Label htmlFor="autoTrigger">Enable Auto Trigger</Label>
//               <span className="text-xs text-gray-500 ml-2">
//                 Automatically trigger this campaign when the event occurs
//               </span>
//             </div>
//             <Switch
//               id="autoTrigger"
//               checked={formData.isAutoTrigger}
//               onCheckedChange={(checked) => setFormData({ ...formData, isAutoTrigger: checked })}
//               disabled={!isIntegrationActive}
//             />
//           </div>

//           {/* API Error Display */}
//           {apiError && (
//             <div className="bg-red-50 text-red-600 p-3 rounded-md border border-red-200 flex gap-4 items-center">
//               <p className="font-medium">Error:</p>
//               <p>{apiError}</p>
//             </div>
//           )}

//           {/* Footer */}
//           <div className="flex flex-col sm:flex-row gap-3 pt-6 justify-end">
//             <Button
//               type="button"
//               variant="outline"
//               onClick={() => {
//                 onOpenChange(false)
//                 setFormErrors({})
//                 setApiError(null)
//               }}
//               className="text-black border-gray-300"
//             >
//               Cancel
//             </Button>
//             <Button
//               type="submit"
//               className="bg-gold-600 hover:bg-yellow-600 text-black font-semibold"
//               disabled={isSubmitting || !isIntegrationActive}
//             >
//               {isSubmitting ? "Creating..." : "Create Campaign"}
//             </Button>
//           </div>
//         </form>
//       </DialogContent>
//     </Dialog>
//   )
// }

















"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { createCampaign } from "@/actions/campaign/add-campaign"
import { CampaignStatus, CampaignTrigger } from "@prisma/client"
import { useRouter } from "next/navigation"

interface AddCampaignDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  integrationId?: string
  appName: string
  isIntegrationActive: boolean
}

interface CampaignFormData {
  name: string
  trigger: CampaignTrigger | ""
  status: CampaignStatus
  description: string
}

interface FormErrors {
  name?: string[]
  trigger?: string[]
  [key: string]: string[] | undefined
}

const TRIGGER_NAME_MAP: Record<CampaignTrigger, string> = {
  [CampaignTrigger.new_user]: "Platform New User",
  [CampaignTrigger.Subscriber]: "New Subscriber",
  [CampaignTrigger.unsubscribe]: "Unsubscribe Confirmation",
  [CampaignTrigger.notification]: "Notification"
}

const AUTO_TRIGGER_TYPES: CampaignTrigger[] = [
  CampaignTrigger.new_user,
  CampaignTrigger.Subscriber,
  CampaignTrigger.unsubscribe,
  CampaignTrigger.notification
]

export function AddCampaignDialog({
  open,
  onOpenChange,
  integrationId,
  appName,
  isIntegrationActive
}: AddCampaignDialogProps) {
  const [formData, setFormData] = useState<CampaignFormData>({
    name: "",
    description: "",
    trigger: "",
    status: CampaignStatus.inactive,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formErrors, setFormErrors] = useState<FormErrors>({})
  const router = useRouter()
  const handleTriggerChange = (value: CampaignTrigger) => {
    const shouldAutoTrigger = AUTO_TRIGGER_TYPES.includes(value)
    const campaignName = TRIGGER_NAME_MAP[value] || ""
    
    setFormData(prev => ({
      ...prev,
      trigger: value,
      isAutoTrigger: shouldAutoTrigger,
      name: campaignName,
    }))
    
    setFormErrors(prev => ({ ...prev, trigger: undefined }))
  }

  const validateForm = (): boolean => {
    const errors: FormErrors = {}
    
    if (!formData.name.trim()) {
      errors.name = ["Campaign name is required"]
    }
    
    if (!formData.trigger) {
      errors.trigger = ["Trigger event is required"]
    }
    
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    if (!isIntegrationActive) {
      toast.error("Application must be active to create campaign")
      return
    }

    setIsSubmitting(true)

    try {

      if (!integrationId) {
        return
      }

      const form = new FormData()
      form.append("name", formData.name)
      form.append("description", formData.description)
      form.append("trigger", formData.trigger as string)
      form.append("status", formData.status)
      form.append("integrationId", integrationId)
      form.append("appName", appName)

      const result = await createCampaign({}, form)

      if (result?.errors) {
        // Show first error message if available
        const firstError = Object.values(result.errors)[0]?.[0]
        if (firstError) {
          toast.error(firstError)
        } else if (result.message) {
          toast.error(result.message)
        }
        setFormErrors(result.errors)
        return
      }

      if (result?.message) {
        toast.success(result.message)
      } else {
        toast.success("Campaign created successfully")
        
      }
      router.refresh()
      setFormData({
        name: "",
        description: "",
        trigger: "",
        status: CampaignStatus.inactive,
      })
      onOpenChange(false)
    } catch (error) {
      console.error("Failed to create campaign:", error)
      toast.error("An unexpected error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      trigger: "",
      status: CampaignStatus.inactive,
    })
    setFormErrors({})
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-white">
        <DialogHeader className="bg-black text-white p-6 -m-6 mb-6 rounded-t-lg">
          <DialogTitle className="text-xl font-bold">Create New Campaign</DialogTitle>
          <DialogDescription className="text-gray-300">
            Set up an automated email campaign for your integration
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isIntegrationActive && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md border border-red-200">
              <p className="font-medium">Warning:</p>
              <p>You cannot create campaigns until the integration is active</p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="trigger">Trigger Event *</Label>
            <Select
              value={formData.trigger}
              onValueChange={handleTriggerChange}
              required
              disabled={!isIntegrationActive}
            >
              <SelectTrigger className={formErrors.trigger ? "border-red-500" : ""}>
                <SelectValue placeholder="Select trigger" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(CampaignTrigger).map(trigger => (
                  <SelectItem key={trigger} value={trigger}>
                    {trigger.replace(/_/g, ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formErrors.trigger && (
              <p className="text-sm text-red-500">{formErrors.trigger[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Campaign Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, name: e.target.value }))
                setFormErrors(prev => ({ ...prev, name: undefined }))
              }}
              required
              disabled={!isIntegrationActive}
              className={formErrors.name ? "border-red-500" : ""}
            />
            {formErrors.name && (
              <p className="text-sm text-red-500">{formErrors.name[0]}</p>
            )}
          </div>


          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => 
                setFormData(prev => ({ ...prev, description: e.target.value }))
              }
              disabled={!isIntegrationActive}
              className="min-h-[80px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Initial Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => 
                setFormData(prev => ({ ...prev, status: value as CampaignStatus }))
              }
              disabled={!isIntegrationActive}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={CampaignStatus.active}>Active</SelectItem>
                <SelectItem value={CampaignStatus.inactive}>Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-6 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={resetForm}
              className="text-black border-gray-300"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gold-400 hover:bg-gold-600 text-black font-semibold"
              disabled={isSubmitting || !isIntegrationActive}
            >
              {isSubmitting ? "Creating..." : "Create Campaign"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}