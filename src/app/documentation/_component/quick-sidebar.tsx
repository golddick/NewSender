"use client"

import { useState } from "react"
import { ChevronDown, ChevronRight, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface QuickSidebarProps {
  isOpen: boolean
  closeSidebar: () => void
  activeSection: string
  setActiveSection: (section: string) => void
}

export function QuickSidebar({ isOpen, closeSidebar, activeSection, setActiveSection }: QuickSidebarProps) {
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({
    general: true,
    subscribers: true,
    newsletters: true,
  })

  const toggleCategory = (category: string) => {
    setOpenCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }))
  }

  const generalSections = [
    { id: "introduction", label: "Introduction" },
    { id: "authentication", label: "Authentication" },
    { id: "quickstart", label: "Quick Start" },
    { id: "rate-limits", label: "Rate Limits" },
    { id: "error-codes", label: "Error Codes" },
    { id: "best-practices", label: "Best Practices" },
  ]

  const subscribersEndpoints = [
    { id: "subscribers-get", label: "GET /subscribers" },
    { id: "subscribers-post", label: "POST /subscribers" },
    { id: "subscribers-delete", label: "DELETE /subscribers/:id" },
  ]

  const newslettersEndpoints = [
    { id: "newsletters-get", label: "GET /newsletters" },
    { id: "newsletters-post", label: "POST /newsletters" },
  ]

  const comingSoonEndpoints = [
    { id: "analytics", label: "Analytics API" },
    { id: "webhooks", label: "Webhooks" },
    { id: "templates", label: "Templates API" },
    { id: "sdk", label: "JavaScript/TypeScript SDK" },
  ]

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={closeSidebar} />}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-200 p-6 overflow-y-auto transition-transform duration-300 lg:fixed lg:translate-x-0 lg:w-64 lg:shrink-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between mb-8 lg:hidden">
          <h2 className="text-lg font-bold">Navigation</h2>
          <Button variant="ghost" size="icon" onClick={closeSidebar}>
            <X className="h-5 w-5" />
            <span className="sr-only">Close sidebar</span>
          </Button>
        </div>

        <nav className="space-y-6">
          {/* General Documentation */}
          <div>
            <button
              onClick={() => toggleCategory("general")}
              className="flex items-center justify-between w-full text-left text-sm font-medium text-gray-900 mb-2"
            >
              <h3>Documentation <span className=" text-gold-700 bg-gold-100 p-1 rounded-md text-xs">beta v0.5</span> </h3>
              {openCategories.general ? (
                <ChevronDown className="h-4 w-4 text-gray-500" />
              ) : (
                <ChevronRight className="h-4 w-4 text-gray-500" />
              )}
            </button>
            {openCategories.general && (
              <ul className="space-y-1 pl-2">
                {generalSections.map((section) => (
                  <li key={section.id}>
                    <button
                      onClick={() => setActiveSection(section.id)}
                      className={cn(
                        "w-full text-left px-3 py-2 rounded-md text-sm transition-colors",
                        activeSection === section.id
                          ? "bg-amber-50 text-amber-900 font-medium"
                          : "text-gray-700 hover:bg-gray-100",
                      )}
                    >
                      {section.label}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Subscribers API */}
          <div>
            <button
              onClick={() => toggleCategory("subscribers")}
              className="flex items-center justify-between w-full text-left text-sm font-medium text-gray-900 mb-2"
            >
              <span>Subscribers API</span>
              {openCategories.subscribers ? (
                <ChevronDown className="h-4 w-4 text-gray-500" />
              ) : (
                <ChevronRight className="h-4 w-4 text-gray-500" />
              )}
            </button>
            {openCategories.subscribers && (
              <ul className="space-y-1 pl-2">
                {subscribersEndpoints.map((endpoint) => (
                  <li key={endpoint.id}>
                    <button
                      onClick={() => setActiveSection(endpoint.id)}
                      className={cn(
                        "w-full text-left px-3 py-2 rounded-md text-sm transition-colors",
                        activeSection === endpoint.id
                          ? "bg-amber-50 text-amber-900 font-medium"
                          : "text-gray-700 hover:bg-gray-100",
                      )}
                    >
                      {endpoint.label}
                      <span className="ml-2 text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded">Live</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Newsletters API */}
          <div>
            <button
              onClick={() => toggleCategory("newsletters")}
              className="flex items-center justify-between w-full text-left text-sm font-medium text-gray-900 mb-2"
            >
              <span>Newsletters API</span>
              {openCategories.newsletters ? (
                <ChevronDown className="h-4 w-4 text-gray-500" />
              ) : (
                <ChevronRight className="h-4 w-4 text-gray-500" />
              )}
            </button>
            {openCategories.newsletters && (
              <ul className="space-y-1 pl-2">
                {newslettersEndpoints.map((endpoint) => (
                  <li key={endpoint.id}>
                    <button
                      onClick={() => setActiveSection(endpoint.id)}
                      className={cn(
                        "w-full text-left px-3 py-2 rounded-md text-sm transition-colors",
                        activeSection === endpoint.id
                          ? "bg-amber-50 text-amber-900 font-medium"
                          : "text-gray-700 hover:bg-gray-100",
                      )}
                    >
                      {endpoint.label}
                      <span className="ml-2 text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded">Live</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Coming Soon */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-3">Coming Soon</h3>
            <ul className="space-y-2">
              {comingSoonEndpoints.map((endpoint) => (
                <li key={endpoint.id}>
                  <span className="w-full block px-3 py-2 rounded-md text-sm text-gray-400 cursor-not-allowed">
                    {endpoint.label}
                    <span className="ml-2 text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">Soon</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </aside>
    </>
  )
}
