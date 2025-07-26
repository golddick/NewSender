"use client"

import { useState } from "react"
import { MoreVertical, ExternalLink, Mail, Calendar, Trash2, Power, PowerOff, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Image from "next/image"
import Link from "next/link"
import { IntegrationStatus } from "@prisma/client"

interface Integration {
  id: string
  name: string
  url: string
  logo: string
  email: string
  status: IntegrationStatus
  category: string
  description: string
  dateAdded: Date
}

interface IntegrationCardProps {
  integration: Integration
  onDelete: (id: string) => void
  onUpdateStatus: (id: string, status: IntegrationStatus) => void
}

export function IntegrationCard({ integration, onDelete, onUpdateStatus }: IntegrationCardProps) {
  const [isLoading, setIsLoading] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800 border-green-200"
      case "INACTIVE":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const handleStatusToggle = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const newStatus = integration.status === "ACTIVE" ? "INACTIVE" : "ACTIVE"
    onUpdateStatus(integration.id, newStatus)
    setIsLoading(false)
  }

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${integration.name}?`)) {
      onDelete(integration.id)
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden relative">
            <Image src={integration.logo || "/2logo.jpg" } fill  alt={integration.name} className=" object-contain absolute " />
          </div>
          <div className="flex  items-center space-x-2">
            <h3 className="font-semibold text-black">{integration.name}</h3>
            <span
              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(integration.status)}`}
            >
              {integration.status}
            </span>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem >
             <Link href={`/dashboard/integration/${integration.name}`}  className="flex items-center justify-between gap-2">
            <Eye className="mr-2 h-4 w-4" />
                View Details
            </Link>

            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => window.open(integration.url, "_blank")}>
              <ExternalLink className="mr-2 h-4 w-4" />
                Visit Website
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleStatusToggle} disabled={isLoading}>
              {integration.status === "ACTIVE" ? (
                <>
                  <PowerOff className="mr-2 h-4 w-4" />
                  Deactivate
                </>
              ) : (
                <>
                  <Power className="mr-2 h-4 w-4" />
                  Activate
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleDelete} className="text-red-600">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Description */}
      {
        integration.description && 
        <p className="text-sm text-gray-600 mb-2">{integration.description}</p>
      }

      {/* Details */}
      <div className="space-y-2">
        <div className="flex items-center text-sm text-gray-600">
          <ExternalLink className="w-4 h-4 mr-2" />
          <a
            href={integration.url}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gold-600 truncate"
          >
            {integration.url}
          </a>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Mail className="w-4 h-4 mr-2" />
          <span className="truncate">{integration.email}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="w-4 h-4 mr-2" />
          <span>Added {new Date(integration.dateAdded).toLocaleString()}</span>
        </div>
      </div>

      {/* Category */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
          {integration.category}
        </span>
      </div>
    </div>
  )
}
