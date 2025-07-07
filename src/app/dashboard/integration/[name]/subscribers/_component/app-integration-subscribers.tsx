"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Search,
  Download,
  UserPlus,
  MoreVertical,
  Mail,
  Calendar,
  Globe,
  Trash2,
  Edit,
  Eye,
  ArrowLeft,
  Settings,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { IntegrationStatus } from "@prisma/client"

interface IntegrationSubscribersProps {
  appName: string
}

interface Integration {
  id: string
  name: string
  logo: string
  url: string
 status?: IntegrationStatus
}

// Mock integration data
// const mockIntegration = {
//   id: 77,
//   name: "Shopify Store",
//   logo: "/placeholder.svg?height=40&width=40",
//   url: "https://mystore.shopify.com",
//   status: "active",
// }

// Mock subscribers for this integration
const mockSubscribers = [
  {
    id: 1,
    name: "John Smith",
    email: "john.smith@example.com",
    status: "active",
    subscriptionDate: "2024-01-15",
    lastActivity: "2024-01-20",
    location: "New York, US",
    tags: ["premium", "newsletter"],
    openRate: 85,
    clickRate: 12,
    totalEmails: 45,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 2,
    name: "Mike Davis",
    email: "mike.davis@example.com",
    status: "inactive",
    subscriptionDate: "2023-12-20",
    lastActivity: "2024-01-05",
    location: "Toronto, CA",
    tags: ["customer"],
    openRate: 45,
    clickRate: 3,
    totalEmails: 32,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 3,
    name: "Lisa Anderson",
    email: "lisa.anderson@example.com",
    status: "unsubscribed",
    subscriptionDate: "2023-11-15",
    lastActivity: "2024-01-18",
    location: "Berlin, DE",
    tags: ["former-customer"],
    openRate: 65,
    clickRate: 8,
    totalEmails: 28,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 4,
    name: "Emma Wilson",
    email: "emma.w@example.com",
    status: "active",
    subscriptionDate: "2024-01-12",
    lastActivity: "2024-01-21",
    location: "London, UK",
    tags: ["vip", "newsletter"],
    openRate: 92,
    clickRate: 18,
    totalEmails: 38,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 5,
    name: "Alex Chen",
    email: "alex.chen@example.com",
    status: "pending",
    subscriptionDate: "2024-01-22",
    lastActivity: "2024-01-22",
    location: "Singapore, SG",
    tags: ["new"],
    openRate: 0,
    clickRate: 0,
    totalEmails: 0,
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

export function IntegrationSubscribers({ appName }: IntegrationSubscribersProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [integrationInfo, setIntegrationInfo] = useState<Integration | null>(null)
  const filteredSubscribers = mockSubscribers.filter((subscriber) => {
    const matchesSearch =
      subscriber.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subscriber.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || subscriber.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const totalSubscribers = mockSubscribers.length
  const activeSubscribers = mockSubscribers.filter((s) => s.status === "active").length
  const pendingSubscribers = mockSubscribers.filter((s) => s.status === "pending").length
  const avgOpenRate = Math.round(mockSubscribers.reduce((acc, s) => acc + s.openRate, 0) / totalSubscribers)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200"
      case "inactive":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "pending":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "unsubscribed":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }


    const mockIntegration: Integration = {
    id: integrationInfo?.id ?? "",
    name: appName,
    logo: integrationInfo?.logo || "/2logo.jpg",
    url: integrationInfo?.url ?? "",
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-black text-white p-6">
        <div className="w-full">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/dashboard/integration" className="text-gold-600 hover:text-yellow-300">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <Avatar className="h-12 w-12 object-contain">
              <AvatarImage src={mockIntegration.logo || "/placeholder.svg"} />
              <AvatarFallback>{mockIntegration.name.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold">{mockIntegration.name} Subscribers</h1>
              <p className="text-gray-300">{mockIntegration.url}</p>
            </div>
          </div>
          <div className="flex gap-4">
            <Link href={`/dashboard/integration/${appName}`}>
              <Button
                variant="outline"
                className="border-gold-600 text-gold-600 hover:bg-yellow-400 hover:text-black bg-transparent"
              >
                <Settings className="h-4 w-4 mr-2" />
                Integration Settings
              </Button>
            </Link>
            <Link href={`/dashboard/integration/${appName}/campaigns`}>
              <Button
                variant="outline"
                className="border-gold-600 text-gold-600 hover:bg-yellow-400 hover:text-black bg-transparent"
              >
                <Mail className="h-4 w-4 mr-2" />
                View Campaigns
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="bg-black text-white">
              <CardTitle className="text-lg flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-yellow-400" />
                Total Subscribers
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-black">{totalSubscribers}</div>
              <p className="text-gray-600 text-sm">For this integration</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="bg-black text-white">
              <CardTitle className="text-lg flex items-center gap-2">
                <Mail className="h-5 w-5 text-yellow-400" />
                Active Subscribers
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-green-600">{activeSubscribers}</div>
              <p className="text-gray-600 text-sm">Currently subscribed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="bg-black text-white">
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5 text-yellow-400" />
                Pending
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-blue-600">{pendingSubscribers}</div>
              <p className="text-gray-600 text-sm">Awaiting confirmation</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="bg-black text-white">
              <CardTitle className="text-lg flex items-center gap-2">
                <Eye className="h-5 w-5 text-yellow-400" />
                Avg Open Rate
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-yellow-600">{avgOpenRate}%</div>
              <p className="text-gray-600 text-sm">For this integration</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardHeader className="bg-black text-white">
            <CardTitle className="text-lg">Filter Subscribers</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-gray-300 focus:border-yellow-400 focus:ring-yellow-400"
                  />
                </div>
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48 border-gray-300 focus:border-yellow-400 focus:ring-yellow-400">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="unsubscribed">Unsubscribed</SelectItem>
                </SelectContent>
              </Select>

              <Button className="bg-yellow-400 hover:bg-yellow-500 text-black">
                <UserPlus className="h-4 w-4 mr-2" />
                Add Subscriber
              </Button>

              <Button variant="outline" className="border-yellow-400 text-yellow-600 hover:bg-yellow-50 bg-transparent">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Subscribers List */}
        <Card>
          <CardHeader className="bg-black text-white">
            <CardTitle className="text-lg">Subscribers ({filteredSubscribers.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left p-4 font-medium text-gray-900">Subscriber</th>
                    <th className="text-left p-4 font-medium text-gray-900">Status</th>
                    <th className="text-left p-4 font-medium text-gray-900">Performance</th>
                    <th className="text-left p-4 font-medium text-gray-900">Location</th>
                    <th className="text-left p-4 font-medium text-gray-900">Activity</th>
                    <th className="text-left p-4 font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSubscribers.map((subscriber) => (
                    <tr key={subscriber.id} className="border-b hover:bg-gray-50">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={subscriber.avatar || "/placeholder.svg"} />
                            <AvatarFallback>
                              {subscriber.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium text-gray-900">{subscriber.name}</div>
                            <div className="text-sm text-gray-500">{subscriber.email}</div>
                            <div className="flex gap-1 mt-1">
                              {subscriber.tags.map((tag) => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge className={getStatusColor(subscriber.status)}>{subscriber.status}</Badge>
                      </td>
                      <td className="p-4">
                        <div className="text-sm">
                          <div className="text-gray-900">
                            Open: <span className="font-medium text-yellow-600">{subscriber.openRate}%</span>
                          </div>
                          <div className="text-gray-900">
                            Click: <span className="font-medium text-yellow-600">{subscriber.clickRate}%</span>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">{subscriber.totalEmails} emails received</div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Globe className="h-3 w-3" />
                          {subscriber.location}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm">
                          <div className="text-gray-900">Joined: {subscriber.subscriptionDate}</div>
                          <div className="text-xs text-gray-500">Last: {subscriber.lastActivity}</div>
                        </div>
                      </td>
                      <td className="p-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" />
                              View Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Mail className="h-4 w-4 mr-2" />
                              Send Email
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Remove
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
