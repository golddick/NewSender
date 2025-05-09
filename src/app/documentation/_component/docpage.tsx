"use client"

import { useState, useEffect } from "react"
import { QuickHeader } from "./quick-header"
import { QuickSidebar } from "./quick-sidebar"
import { QuickContent } from "./quick-content"

export function QuickDocumentation() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("introduction")

  // Close sidebar on larger screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(false)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <QuickHeader toggleSidebar={toggleSidebar} />
      <div className="flex flex-1 overflow-hidden">
        <QuickSidebar
          isOpen={isSidebarOpen}
          closeSidebar={() => setIsSidebarOpen(false)}
          activeSection={activeSection}
          setActiveSection={(section) => {
            setActiveSection(section)
            setIsSidebarOpen(false)
          }}
        />
        <QuickContent activeSection={activeSection} setActiveSection={setActiveSection} />
      </div>
    </div>
  )
}
