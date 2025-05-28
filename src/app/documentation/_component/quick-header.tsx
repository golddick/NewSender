"use client"

import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface QuickHeaderProps {
  toggleSidebar: () => void
}

export function QuickHeader({ toggleSidebar }: QuickHeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={toggleSidebar}>
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle menu</span>
          </Button>
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-black">TheNews</span>
            <span className="rounded-md bg-gold-100 px-2 py-1 text-xs font-medium text-gold-700">API Docs</span>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <Button className="bg-gold-700 hover:bg-gold-300 text-white" asChild>
            <Link href="/sign-up">Get API Key</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
