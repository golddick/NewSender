"use client"

import { useEffect, useState } from "react"
import { Plus, Search, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { IntegrationCard } from "./integrationCard"
import { AddIntegrationDialog } from "./add-integration-dialog"
import { deleteIntegration, getIntegrations, updateIntegrationStatus } from "@/actions/application-Integration/application"
import toast from "react-hot-toast"
import { IntegrationStatus } from "@prisma/client"
import { DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu"

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


export function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<Integration[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false) 
  const [isLoading, setIsLoading] = useState(true)
  const categories = [
  "all",
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

    // Fetch integrations on component mount
  useEffect(() => {
    const fetchIntegrations = async () => {
      try {
        setIsLoading(true)
        const result = await getIntegrations()

        console.log("Fetched Integrations:", result)
        if (result?.error) {
          throw new Error(result.error)
        }
        setIntegrations(
          (result.data || []).map((item: any) => ({
            id: item.id,
            name: item.name,
            url: item.url,
            logo: item.logo ?? "",
            email: item.email ?? "",
            status: item.status === "ACTIVE" ? "ACTIVE" : "INACTIVE",
            category: item.category,
            description: item.description ?? "",
            dateAdded: item.dateAdded,
          }))
        )
      } catch (error) {
        console.error("Failed to fetch integrations:", error)
        toast.error("Failed to load integrations")
      } finally {
        setIsLoading(false)
      }
    }

    fetchIntegrations()
  }, [])

  const filteredIntegrations = integrations.filter((integration) => {
    const matchesSearch =
      integration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      integration.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
      integration.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || integration.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleAddIntegration = (newIntegration: Omit<Integration, "id" | "dateAdded">) => {
    const integration: Integration = {
      ...newIntegration,
      id: Date.now().toString(),
      dateAdded: new Date(),
    }
    setIntegrations([integration, ...integrations])
    setIsAddDialogOpen(false)
  }


const handleDeleteIntegration = async (id: string) => {
  try {
    // Optimistically update the UI
    setIntegrations(prev => prev.filter(integration => integration.id !== id))
    
    // Delete from database
    const result = await deleteIntegration(id)
    
    if (result?.error) {
      throw new Error(result.error)
    }

    toast.success("Integration deleted successfully!")
  } catch (error) {
    // Revert UI if deletion fails
    const refreshResult = await getIntegrations()
    if (refreshResult?.data) {
      setIntegrations(
              refreshResult.data.map((item: any) => ({
                id: item.id,
                name: item.name,
                url: item.url,
                logo: item.logo ?? "",
                email: item.email ?? "",
                status: (item.status === "" ? "ACTIVE" : "INACTIVE") as IntegrationStatus,
                category: item.category,
                description: item.description ?? "",
                dateAdded: item.createdAt ? item.createdAt.split("T")[0] : "",
              }))
            )
    }
    toast.error(error instanceof Error ? error.message : "Failed to delete integration")
  }
}


const handleUpdateStatus = async (id: string, status:IntegrationStatus) => {
    try {
      // Optimistic update
      setIntegrations(prev => 
        prev.map(integration => 
          integration.id === id ? { ...integration, status } : integration
        )
      )

      // Database update
      const result = await updateIntegrationStatus(id, status)
      if (result?.error) throw new Error(result.error)

      toast.success("Status updated successfully!")
    } catch (error) {
      // Revert on error
      setIntegrations(prev => 
        prev.map(integration => 
          integration.id === id ? { 
            ...integration, 
            status: integration.status === "ACTIVE" ? "INACTIVE" : "ACTIVE" 
          } : integration
        )
      )
      toast.error(error instanceof Error ? error.message : "Update failed")
    }
  }

  console.log("Integrations:", integrations)

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-black">Application Integrations</h1>
              <p className="mt-2 text-gray-600">Manage and connect mulltiple application to TheNews</p>
            </div>
            <Button
              onClick={() => setIsAddDialogOpen(true)}
              className="bg-gold-600 hover:bg-yellow-600 text-black font-medium"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Integration
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Total Application</p>
                <p className="text-2xl font-bold text-black">{integrations.length}</p>
              </div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Active Application</p>
                <p className="text-2xl font-bold text-green-600">
                  {integrations.filter((i) => i.status === "ACTIVE").length}
                </p>
              </div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Inactive Application</p>
                <p className="text-2xl font-bold text-red-600">
                  {integrations.filter((i) => i.status === "INACTIVE").length}
                </p>
              </div>
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search integrations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category === "all" ? "All Categories" : category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Integrations Grid */}
      <div className="w-full px-4 sm:px-6 lg:px-8 pb-12">
        {filteredIntegrations.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Plus className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-black mb-2">No Application found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || selectedCategory !== "all"
                ? "Try adjusting your search or filter criteria."
                : "Get started by adding your first application."}
            </p>
            <Button
              onClick={() => setIsAddDialogOpen(true)}
              className="bg-gold-600 hover:bg-yellow-600 text-black font-medium"
            >
              Add Application
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredIntegrations.map((integration) => (
              <IntegrationCard
                key={integration.id}
                integration={integration}
                onDelete={handleDeleteIntegration}
                onUpdateStatus={handleUpdateStatus}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add Integration Dialog */}
      <AddIntegrationDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onAdd={handleAddIntegration}
      />
    </div>
  )
}
