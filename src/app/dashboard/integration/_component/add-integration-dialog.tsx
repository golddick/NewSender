"use client"

import type React from "react"

import { useState } from "react"
import { X, Upload, Globe, Mail, Tag, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { addIntegration } from "@/actions/application-Integration/application"
import toast from "react-hot-toast"
import Image from "next/image"

interface Integration {
  name: string
  url: string
  logo: string
  email: string
  status: "active" | "inactive" 
  category: string
  description: string
}

interface AddIntegrationDialogProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (integration: Integration) => void
}

const categories = [
  "E-commerce",
  "Content",
  "Email Marketing",
  "Communication",
  "Analytics",
  "Payment",
  "Social Media",
  "CRM",
  "Project Management",
  "Other",
]

export function AddIntegrationDialog({ isOpen, onClose, onAdd }: AddIntegrationDialogProps) {
  const [formData, setFormData] = useState<Integration>({
    name: "",
    url: "",
    logo: "",
    email: "",
    status: "inactive",
    category: "Other",
    description: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [logoFile, setLogoFile] = useState<File | null>(null)

  const handleInputChange = (field: keyof Integration, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setLogoFile(file)
      // In a real app, you'd upload this to a server and get back a URL
      const reader = new FileReader()
      reader.onload = (e) => {
        setFormData((prev) => ({ ...prev, logo: e.target?.result as string }))
      }
      reader.readAsDataURL(file)
    }
  }

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsSubmitting(true);

  try {
    // Prepare form data ensuring logo is always a string (URL or base64)
    const submissionData = {
      ...formData,
      logo: formData.logo // Always a string
    };

    // Call server action to add integration
    const result = await addIntegration(submissionData);

    console.log("Integration added:", result);
    toast.success("Integration added successfully!");
    
    // Reset form after successful submission
    setFormData({
      name: "",
      url: "",
      logo: "",
      email: "",
      status: "inactive",
      category: "Other",
      description: "",
    });
    setLogoFile(null);
    
    // Optional: call parent callback
    if (onAdd) {
      onAdd({
        ...result,
        logo: result.logo ?? "",
        email: result.email ?? "",
        description: result.description ?? "",
      });
    }
  } catch (error) {
    console.error("Failed to add integration:", error);
    toast.error(error instanceof Error ? error.message : "Failed to add integration");
  } finally {
    setIsSubmitting(false);
  }
};

  const isFormValid = formData.name && formData.url && formData.email && formData.category

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-black">Add New Integration</h2>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Logo Upload */}
          <div className="space-y-2">
            <Label htmlFor="logo" className="text-sm font-medium text-black">
              Logo
            </Label>
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden relative">
                <Image src={formData.logo || '/2logo.jpg'} alt="Logo preview" fill className="w-12 h-12 object-contain absolute" />
                {/* <Image src={formData.logo || "/2logo.jpg"} alt="Logo preview" fill className="w-12 h-12 object-cover absolute" /> */}
              </div>
              <div>
                <input type="file" id="logo" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById("logo")?.click()}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Logo
                </Button>
                <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 2MB</p>
              </div>
            </div>
          </div>

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-black">
              Application Name *
            </Label>
            <div className="relative">
              <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                id="name"
                type="text"
                placeholder="e.g., Shopify Store"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          {/* URL */}
          <div className="space-y-2">
            <Label htmlFor="url" className="text-sm font-medium text-black">
              Website URL *
            </Label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                id="url"
                type="url"
                placeholder="https://example.com"
                value={formData.url}
                onChange={(e) => handleInputChange("url", e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-black">
              Contact Email 
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category" className="text-sm font-medium text-black">
              Category *
            </Label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) => handleInputChange("category", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              required
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium text-black">
              Description
            </Label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
              <Textarea
                id="description"
                placeholder="Brief description of this integration..."
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                className="pl-10 min-h-[80px]"
              />
            </div>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status" className="text-sm font-medium text-black">
              Initial Status
            </Label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => handleInputChange("status", e.target.value as Integration["status"])}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className="flex-1 bg-gold-600 hover:bg-yellow-600 text-black font-medium"
            >
              {isSubmitting ? "Adding..." : "Add Integration"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
