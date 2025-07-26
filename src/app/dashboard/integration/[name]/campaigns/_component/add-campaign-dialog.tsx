


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
  [CampaignTrigger.Subscriber]: "Newsletter Subscriber",
  [CampaignTrigger.unsubscribe]: "Unsubscribe Confirmation",
  [CampaignTrigger.notification]: "Notification",
  [CampaignTrigger.new_blog_post]: "New Blog Post",
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
    status: CampaignStatus.ACTIVE,
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
        status: CampaignStatus.INACTIVE,
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
      status: CampaignStatus.INACTIVE,
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
                <SelectItem value={CampaignStatus.ACTIVE}>Active</SelectItem>
                <SelectItem value={CampaignStatus.INACTIVE}>Inactive</SelectItem>
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