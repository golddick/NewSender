
"use client"

import { useCallback, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Mail,
  Plus,
  Search,
  MoreHorizontal,
  Eye,
  Edit,
  Copy,
  Trash2,
  Send,
  Users,
  TrendingUp,
  Bot,
  Zap,
  MousePointerClick,
} from "lucide-react"
import Link from "next/link"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"
import { useClerk } from "@clerk/nextjs"
import { getAllEmails } from "@/actions/email/getEmail"
import { EmailStatus } from "@prisma/client"


export function EmailsDashboard() {
  const [emailTitle, setEmailTitle] = useState("");
  const [emails, setEmails] = useState<any[]>([]);
  const [integrations, setIntegrations] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { user } = useClerk();

  const handleCreate = () => {
    if (emailTitle.trim().length === 0) {
      toast.error("Enter the email subject to continue!");
      return;
    }
    const formattedTitle = emailTitle.replace(/\s+/g, "-").replace(/&/g, "-");
    router.push(`/dashboard/new-email?subject=${formattedTitle}`);
  };

  const FindEmails = useCallback(async () => {
    if (!user?.id) return;
    try {
      const res = await getAllEmails();
    //   const res = await getEmails({ newsLetterOwnerId: user.id });
      setEmails(res && res.success && Array.isArray(res.emails) ? res.emails : []);

      console.log("Fetched emails:", res);
    } catch (error) {
      console.error("Failed to fetch emails:", error);
    }
  }, [user?.id]);


  useEffect(() => {
    if (user?.id) {
      FindEmails();
    }
  }, [user?.id, FindEmails]);

  // const deleteHandler = async (id: string) => {
  //   await deleteEmail({ emailId: id });
  //   FindEmails();
  // };

  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")

  const filteredEmails = emails.filter((email) => {
    const matchesSearch =
      email.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.campaign?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || email.status === statusFilter
    const matchesType = typeFilter === "all" || email.type === typeFilter

    return matchesSearch && matchesStatus && matchesType
  })

  const totalEmails = emails.length
  const sentEmails = emails.filter((e) => e.status === "SENT").length
  const totalRecipients = emails.reduce((sum, email) => sum + email.recipients, 0)
  // const avgOpenRate =
  //   emails.filter((e) => e.status === "SENT").reduce((sum, email) => sum + email.openRate, 0) /
  //     sentEmails || 0

  const avgOpenRate =
  emails
    .filter((e) => e.status === "SENT" && e.recipients > 0)
    .reduce((sum, email) => sum + (email.openRate / email.recipients) * 100, 0) /
    sentEmails || 0;

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "bg-green-100 text-green-800 border-green-200",
      sent: "bg-blue-100 text-blue-800 border-blue-200",
      scheduled: "bg-yellow-100 text-yellow-800 border-yellow-200",
      draft: "bg-gray-100 text-gray-800 border-gray-200",
      paused: "bg-red-100 text-red-800 border-red-200",
    }
    return variants[status as keyof typeof variants] || variants.draft
  }

  const getTypeBadge = (type: string) => {
    return type === "AUTOMATED"
      ? "bg-purple-100 text-purple-800 border-purple-200"
      : "bg-orange-100 text-orange-800 border-orange-200"
  }

  const getRateColor = (percentage: number) => {
  if (percentage >= 60) return "text-green-600";
  if (percentage >= 30) return "text-yellow-600";
  return "text-red-600";
};


  return (
    <div className="min-h-screen bg-white ">
      {/* Header */}

     <div className="border-b border-gray-200">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-black">Mail Management</h1>
              <p className="mt-2 text-gray-600">Create and Send mail to subscribers </p>
            </div>
           <Button onClick={() => setOpen(true)} className="bg-black hover:bg-white hover:text-black text-white font-semibold">
                <Plus className="w-4 h-4 mr-2" />
                Create New Email
              </Button>
          </div>
        </div>
      </div>


      <div className=" w-full p-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Emails</p>
                  <p className="text-2xl font-bold text-black">{totalEmails}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <Mail className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Sent Emails</p>
                  <p className="text-2xl font-bold text-black">{sentEmails}</p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <Send className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Recipients</p>
                  <p className="text-2xl font-bold text-black">{totalRecipients.toLocaleString()}</p>
                </div>
                <div className="bg-purple-100 p-3 rounded-full">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg. Open Rate</p>
                  <p className="text-2xl font-bold text-black">{avgOpenRate.toFixed(1)}%</p>
                </div>
                <div className="bg-yellow-100 p-3 rounded-full">
                  <TrendingUp className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6 border-none shadow-none">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search emails by subject, integration, or campaign..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-gray-300 focus:border-yellow-500 focus:ring-yellow-500"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-32 border-gray-300 focus:border-yellow-500 focus:ring-yellow-500">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="sent">Sent</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="paused">Paused</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-32 border-gray-300 focus:border-yellow-500 focus:ring-yellow-500">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="INSTANT">Instant</SelectItem>
                    <SelectItem value="AUTOMATED">Automated</SelectItem>
                    <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Emails List */}
        <Card>
          <CardHeader className="bg-black text-white">
            <CardTitle className="flex items-center">
              <Mail className="w-4 h-4 mr-2" />
             Mails ({filteredEmails.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-200">
              {filteredEmails.map((email) => (
                <div key={email.id} className="p-2 md:p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-black capitalize max-w-[150px] md:max-w-[200px] lg:max-w-[300px] truncate">{email.subject}</h3>
                        <Badge className={`text-xs capitalize ${getStatusBadge(email.status)} `}>
                          {email.status.charAt(0).toUpperCase() + email.status.slice(1)}
                        </Badge>
                        <Badge className={`text-xs capitalize hidden md:block ${getTypeBadge(email.type)}`}>
                          {email.type}
                        </Badge>
                      </div>

                      <div className="flex items-center space-x-6 text-sm text-gray-500">
                        {email.sentDate && <div>Sent: {email.sentDate}</div>}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 md:space-x-6">
                      {email.status !== EmailStatus.SENT && (
                        <div className="text-right">
                          <div className="grid grid-cols-3 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="text-gray-500 hidden md:block">Recipients</p>
                              <Users className=" size-4 md:hidden"/>
                              <p className="font-semibold text-black">{email.recipients.toLocaleString()}</p>
                            </div>
                           <div className=" ">
                              <p className="text-gray-500 hidden md:block">Open Rate</p>
                               <Eye className=" size-4 md:hidden"/>
                                {email.recipients > 0 ? (
                                  <p className={`font-semibold ${getRateColor((email.openRate / email.recipients) * 100)}`}>
                                    {((email.openRate / email.recipients) * 100).toFixed(1)}%
                                  </p>
                                ) : (
                                  <p className="text-gray-400">0%</p>
                                )}

                            </div>
                            <div className=" ">
                              <p className="text-gray-500  hidden md:block">Click Rate</p>
                               <MousePointerClick className=" size-4 md:hidden"/>
                                {email.recipients > 0 ? (
                                  <p className={`font-semibold ${getRateColor((email.clickRate / email.recipients) * 100)}`}>
                                    {((email.clickRate / email.recipients) * 100).toFixed(1)}%
                                  </p>
                                ) : (
                                  <p className="text-gray-400">0%</p>
                                )}

                            </div>
                          </div>
                        </div>
                      )}

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link 
                            // href={`/dashboard/auto-email/${email.id}`}
                            href={`/dashboard/new-email?subject=${email.subject}`}
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Email
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {filteredEmails.length === 0 && (
          <div className="text-center py-12">
            <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No emails found</h3>
            <p className="text-gray-500 mb-4">Try adjusting your search or filter criteria</p>
              <Button onClick={() => setOpen(true)} className="bg-white hover:bg-black hover:text-white text-black font-semibold">
                <Plus className="w-4 h-4 mr-2" />
                Create New Email
              </Button>
          </div>
        )}

         {/* Modal */}
              {open && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                  <div className="bg-white w-[90%] max-w-md rounded-lg p-6 shadow relative">
                    <button
                      className="absolute top-3 right-3 text-xl text-gray-500 hover:text-red-600"
                      onClick={() => setOpen(false)}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    <h5 className="text-xl font-semibold mb-4">Enter your Email Subject</h5>
                    <input
                      type="text"
                      className="border w-full h-10 px-3 rounded outline-none focus:ring"
                      value={emailTitle}
                      onChange={(e) => setEmailTitle(e.target.value)}
                      placeholder="e.g. Welcome to our newsletter"
                    />
                    <Button
                      color="primary"
                      className="mt-4 w-full rounded text-md font-semibold"
                      onClick={handleCreate}
                    >
                      Continue
                    </Button>
                  </div>
                </div>
              )}
      </div>
    </div>
  )
}
