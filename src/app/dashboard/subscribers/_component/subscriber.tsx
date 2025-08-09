"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import {
  Search, UserPlus, MoreVertical, Mail, Trash2, Eye, User, UserCheck, UserMinus, BotIcon
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AddSubscriberDialog } from "./add-subscriber-dialog";
import { toast } from "sonner";
import { SubscriptionStatus } from "@prisma/client";
import Loader from "@/components/Loader";
import { useUser } from "@clerk/nextjs";
import { useSubscribers } from "@/actions/subscriber/use.subscriber";
import { formatString } from "@/lib/utils";
import { ImportSubscriberModal } from "./ImportSubscriberModal";


export function SubscribersDashboard() {
  const { user } = useUser();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [integrationFilter, setIntegrationFilter] = useState("all");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [integrationsLoading, setIntegrationsLoading] = useState(true);

  const {
    subscribers,
    loading: subscribersLoading,
    error: subscribersError,
    refetch: refetchSubscribers
  } = useSubscribers();


  const filteredSubscribers = subscribers.filter((subscriber) => {
    const matchesSearch =
      subscriber.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subscriber.email.toLowerCase().includes(searchTerm.toLowerCase()) ;

    const matchesStatus = statusFilter === "all" || subscriber.status.toLowerCase() === statusFilter.toLowerCase();
    const macthesEmail = subscriber.email.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch && matchesStatus && macthesEmail;
  });

  const totalSubscribers = subscribers.length;
  const activeSubscribers = subscribers.filter((s) => s.status === SubscriptionStatus.Subscribed).length;
  const unsubscribedCount = subscribers.filter((s) => s.status === SubscriptionStatus.Unsubscribed).length;

  const getStatusColor = (status: SubscriptionStatus) => {
    switch (status) {
      case SubscriptionStatus.Subscribed:
        return "bg-green-100 text-green-800 border-green-200";
      case SubscriptionStatus.Unsubscribed:
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  const getSourceBadge = (source: string) => {
    const sourceLabels: Record<string, string> = {
      website_form: "Website Form",
      api_import: "API Import",
      manual_add: "Manual Add",
      social_media: "Social Media",
      referral: "Referral",
      unknown: "Unknown",
    };
    return sourceLabels[source] || source;
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (subscribersLoading || integrationsLoading) return <Loader />;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-black">All Subscribers</h1>
            <p className="mt-1 sm:mt-2 text-sm sm:text-base text-gray-600">
              Manage subscribers across all campaigns and integrations
            </p>
          </div>
          <Button
            onClick={() => setShowAddDialog(true)}
            className="bg-black hover:bg-white hover:text-black text-white font-medium w-full sm:w-auto"
            size="sm"
          >
            <UserPlus className="h-4 w-4 mr-2" /> Add Subscriber
          </Button>
        </div>
      </div>

      <div className="p-4 sm:p-6 space-y-4">
        {/* Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <Card>
            <CardContent className="p-2 sm:p-6 flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Total Subscribers</p>
                <p className="text-xl sm:text-2xl font-bold text-black">{totalSubscribers}</p>
              </div>
              <div className="bg-blue-100 p-2 rounded-full"><User className="w-5 h-5 text-blue-600" /></div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-2 sm:p-6 flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Active</p>
                <p className="text-xl sm:text-2xl font-bold text-black">{activeSubscribers}</p>
              </div>
              <div className="bg-green-100 p-2 rounded-full"><UserCheck className="w-5 h-5 text-green-600" /></div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-2 sm:p-6 flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Unsubscribed</p>
                <p className="text-xl sm:text-2xl font-bold text-black">{unsubscribedCount}</p>
              </div>
              <div className="bg-yellow-100 p-2 rounded-full"><UserMinus className="w-5 h-5 text-yellow-600" /></div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by name, email, or campaign..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value={SubscriptionStatus.Subscribed}>Subscribed</SelectItem>
                  <SelectItem value={SubscriptionStatus.Unsubscribed}>Unsubscribed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <ImportSubscriberModal newsletterOwnerId={user?.id} onImportComplete={refetchSubscribers} />
          </CardContent>
        </Card>

        {/* Subscribers List */}
        {filteredSubscribers.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500">No subscribers yet.</p>
            <Button onClick={() => setShowAddDialog(true)} className="mt-4 bg-black text-white hover:bg-white hover:text-black">
              <UserPlus className="h-4 w-4 mr-2" /> Add First Subscriber
            </Button>
          </div>
        ) : (
          <Card>
            <CardHeader className="bg-black text-white p-3 sm:p-6">
              <CardTitle>Subscribers ({filteredSubscribers.length})</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left p-3 font-medium text-gray-900 text-sm">Subscriber</th>
                      <th className="text-left p-3 font-medium text-gray-900 text-sm hidden md:table-cell">Source</th>
                      <th className="text-left p-3 font-medium text-gray-900 text-sm hidden xl:table-cell">Subscribed</th>
                      <th className="text-left p-3 font-medium text-gray-900 text-sm">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSubscribers.map((subscriber) => (
                      <tr key={subscriber.id} className="border-b hover:bg-gray-50">
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-yellow-100 text-yellow-800 text-xs">
                                {subscriber.name ? subscriber.name[0].toUpperCase() : subscriber.email[0].toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium text-gray-900 text-xs">{subscriber.name || "No Name"}</div>
                              <div className="text-gray-500 text-xs">{subscriber.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-3 hidden xl:table-cell">
                          <div className="text-gray-900 text-xs">{formatDate(subscriber.createdAt)}</div>
                        </td>
                        <td className="p-3">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical className="h-4 w-4" /></Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="text-xs">
                              <DropdownMenuItem><Eye className="h-4 w-4 mr-2" />View Details</DropdownMenuItem>
                              <DropdownMenuItem><Mail className="h-4 w-4 mr-2" />Send Email</DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600"><Trash2 className="h-4 w-4 mr-2" />Remove</DropdownMenuItem>
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
        )}
      </div>

      <AddSubscriberDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
      />
    </div>
  );
}
