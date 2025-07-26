

// // "use client";

// // import { useState, useEffect } from "react";
// // import { Button } from "@/components/ui/button";
// // import { Input } from "@/components/ui/input";
// // import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// // import { Badge } from "@/components/ui/badge";
// // import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// // import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
// // import { Search, Download, UserPlus, MoreVertical, Mail, Calendar, Trash2, Edit, Eye, Filter, User, UserCheck, UserCog, TrendingUp, UserMinus, BotIcon } from "lucide-react";
// // import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// // import { AddSubscriberDialog } from "./add-subscriber-dialog";
// // import { getSubscribers } from "@/actions/subscriber/get.subscribers";
// // import { getIntegrations } from "@/actions/application-Integration/application";
// // import { toast } from "sonner";
// // import { SubscriptionStatus } from "@prisma/client";
// // import Loader from "@/components/Loader";
// // import { formatString } from "@/lib/utils";
// // import ExportCSVBTN from "./exportCSVBTN";
// // import { ImportSubscriberModal } from "./ImportSubscriberModal";
// // import { useUser } from "@clerk/nextjs";

// // interface Subscriber {
// //   id: string;
// //   email: string;
// //   name: string | null;
// //   source: string;
// //   status: SubscriptionStatus;
// //   createdAt: Date;
// //   updatedAt: Date;
// //   campaign: {
// //     id: string;
// //     name: string;
// //     trigger: string;
// //   } | null;
// //   integration: {
// //     id: string;
// //     name: string;
// //     logo: string | null;
// //     url: string | null;
// //   };
// //   pageUrl: string | null;
// // }

// // interface Integration {
// //   id: string;
// //   name: string;
// //   logo: string | null;
// //   url: string | null;
// // }

// // const sources = ["website_form", "api_import", "manual_add", "social_media", "referral", "unknown"];

// // export function SubscribersDashboard() {
// //   const [searchTerm, setSearchTerm] = useState("");
// //   const [statusFilter, setStatusFilter] = useState("all");
// //   const [integrationFilter, setIntegrationFilter] = useState("all");
// //   const [sourceFilter, setSourceFilter] = useState("all");
// //   const [ownerId, setOwnerId] = useState();
// //   const [showAddDialog, setShowAddDialog] = useState(false);
// //   const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
// //   const [integrations, setIntegrations] = useState<Integration[]>([]);
// //   const [loading, setLoading] = useState(true);

// //   const [selectedIntegrationId, setSelectedIntegrationId] = useState<string | null>(null);
// //   const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);

// //    const { user } = useUser();

// //    if (!user) {
// //     return
// //    }
// //   // Fetch data on component mount
// //   useEffect(() => {
// //     const fetchData = async () => {
// //       try {
// //         setLoading(true);
// //         const [subscribersResult, integrationsResult] = await Promise.all([
// //           getSubscribers(),
// //           getIntegrations()
// //         ]);

// //         console.log(integrationsResult, 'int')
// //         console.log(subscribersResult, 'sub')

      
        
// //         if (subscribersResult.error) {
// //           throw new Error(subscribersResult.error);
// //         }

// //         if (integrationsResult.error) {
// //           throw new Error(integrationsResult.error);
// //         }

// //         setSubscribers(subscribersResult.subscribers || []);
// //         setIntegrations(integrationsResult.data || []);
// //       } catch (error) {
// //         console.error("Failed to fetch data:", error);
// //         toast.error("Failed to load subscribers data");
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchData();
// //   }, [])

// //   const filteredSubscribers = subscribers.filter((subscriber) => {
// //     const matchesSearch =
// //       subscriber.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //       subscriber.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //       subscriber.campaign?.name?.toLowerCase().includes(searchTerm.toLowerCase());

// //     const matchesStatus = statusFilter === "all" || subscriber.status.toLowerCase() === statusFilter.toLowerCase();
// //     const matchesIntegration = integrationFilter === "all" || subscriber.integration.id === integrationFilter;
// //     const matchesSource = sourceFilter === "all" || subscriber.source === sourceFilter;

// //     return matchesSearch && matchesStatus && matchesIntegration && matchesSource;
// //   });

// //   const totalSubscribers = subscribers.length;
// //   const totalIntegratedApp = integrations.length;
// //   const activeSubscribers = subscribers.filter((s) => s.status === SubscriptionStatus.Subscribed).length;
// //   const unsubscribedCount = subscribers.filter((s) => s.status === SubscriptionStatus.Unsubscribed).length;

// //   const getStatusColor = (status: SubscriptionStatus) => {
// //     switch (status) {
// //       case SubscriptionStatus.Subscribed:
// //         return "bg-green-100 text-green-800 border-green-200";
// //       case SubscriptionStatus.Unsubscribed:
// //         return "bg-red-100 text-red-800 border-red-200";
// //       default:
// //         return "bg-blue-100 text-blue-800 border-blue-200";
// //     }
// //   };

// //   const getSourceBadge = (source: string) => {
// //     const sourceLabels: Record<string, string> = {
// //       website_form: "Website Form",
// //       api_import: "API Import",
// //       manual_add: "Manual Add",
// //       social_media: "Social Media",
// //       referral: "Referral",
// //       unknown: "Unknown",
// //     };
// //     return sourceLabels[source] || source;
// //   };

// //   const formatDate = (date: Date) => {
// //     return new Date(date).toLocaleDateString("en-US", {
// //       year: "numeric",
// //       month: "short",
// //       day: "numeric",
// //     });
// //   };

// //   if (loading) {
// //     return <Loader />;
// //   }

// //   if (!integrations.length) {
// //     return (
// //       <div className="min-h-screen bg-white flex items-center justify-center p-4">
// //         <div className="text-gray-500 text-center">
// //           No integrations found. Please add an integration first.
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="min-h-screen bg-white">
// //       {/* Header */}
// //       <div className="border-b border-gray-200">
// //         <div className="mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
// //           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
// //             <div>
// //               <h1 className="text-2xl sm:text-3xl font-bold text-black">All Subscribers</h1>
// //               <p className="mt-1 sm:mt-2 text-sm sm:text-base text-gray-600">
// //                 Manage subscribers across all integrated applications and campaigns
// //               </p>
// //             </div>
// //             <Button
// //               onClick={() => setShowAddDialog(true)}
// //               className="bg-black hover:bg-white hover:text-black text-white font-medium w-full sm:w-auto"
// //               size="sm"
// //             >
// //               <UserPlus className="h-4 w-4 mr-2" />
// //               Add Subscriber
// //             </Button>
// //           </div>
// //         </div>
// //       </div>

// //       <div className="p-4 sm:p-6 space-y-4">
// //         {/* Statistics Cards */}
// //         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
// //           <Card className="h-full">
// //             <CardContent className="p-2 sm:p-6">
// //               <div className="flex items-center justify-between">
// //                 <div>
// //                   <p className="text-xs sm:text-sm font-medium text-gray-600">Total Subscribers</p>
// //                   <p className="text-xl sm:text-2xl font-bold text-black">{totalSubscribers}</p>
// //                 </div>
// //                 <div className="bg-blue-100 p-1 sm:p-3 rounded-full">
// //                   <User className="w-4 h-4 sm:w-6 sm:h-6 text-blue-600" />
// //                 </div>
// //               </div>
// //             </CardContent>
// //           </Card>

// //           <Card className="h-full">
// //             <CardContent className="p-2 sm:p-6">
// //               <div className="flex items-center justify-between">
// //                 <div>
// //                   <p className="text-xs sm:text-sm font-medium text-gray-600">Active Subscribers</p>
// //                   <p className="text-xl sm:text-2xl font-bold text-black">{activeSubscribers}</p>
// //                 </div>
// //                 <div className="bg-green-100 p-1 sm:p-3 rounded-full">
// //                   <UserCheck className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
// //                 </div>
// //               </div>
// //             </CardContent>
// //           </Card>

// //              <Card className="h-full">
// //             <CardContent className="p-2 sm:p-6">
// //               <div className="flex items-center justify-between">
// //                 <div>
// //                   <p className="text-xs sm:text-sm font-medium text-gray-600">Unsubscribed</p>
// //                   <p className="text-xl sm:text-2xl font-bold text-black">{unsubscribedCount}</p>
// //                 </div>
// //                 <div className="bg-yellow-100 p-1 sm:p-3 rounded-full">
// //                   <UserMinus className="w-4 h-4 sm:w-5 sm:h-5 text-gold-600" />
// //                 </div>
// //               </div>
// //             </CardContent>
// //           </Card>

// //           <Card className="h-full">
// //             <CardContent className="p-2 sm:p-6">
// //               <div className="flex items-center justify-between">
// //                 <div>
// //                   <p className="text-xs sm:text-sm font-medium text-gray-600">Integrated Apps</p>
// //                   <p className="text-xl sm:text-2xl font-bold text-black">{totalIntegratedApp}</p>
// //                 </div>
// //                 <div className="bg-purple-100 p-1 sm:p-3 rounded-full">
// //                   <BotIcon className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
// //                 </div>
// //               </div>
// //             </CardContent>
// //           </Card>

      
// //         </div>

// //         {/* Filters and Search */}
// //         <Card>
// //           <CardContent className="p-4">
// //             <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
// //               <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
// //                 <div className="lg:col-span-2">
// //                   <div className="relative">
// //                     <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
// //                     <Input
// //                       placeholder="Search by name, email, or campaign..."
// //                       value={searchTerm}
// //                       onChange={(e) => setSearchTerm(e.target.value)}
// //                       className="pl-10 border-gray-300 focus:border-gold-600 focus:ring-gold-600 text-sm sm:text-base"
// //                     />
// //                   </div>
// //                 </div>

// //                 <Select value={statusFilter} onValueChange={setStatusFilter}>
// //                   <SelectTrigger className="border-gray-300 focus:border-gold-600 focus:ring-gold-600 text-sm sm:text-base">
// //                     <SelectValue placeholder="Status" />
// //                   </SelectTrigger>
// //                   <SelectContent>
// //                     <SelectItem value="all">All Status</SelectItem>
// //                     <SelectItem value={SubscriptionStatus.Subscribed}>Subscribed</SelectItem>
// //                     <SelectItem value={SubscriptionStatus.Unsubscribed}>Unsubscribed</SelectItem>
// //                   </SelectContent>
// //                 </Select>

// //                 <Select value={integrationFilter} onValueChange={setIntegrationFilter}>
// //                   <SelectTrigger className="border-gray-300 focus:border-gold-600 focus:ring-gold-600 text-sm sm:text-base">
// //                     <SelectValue placeholder="Integration" />
// //                   </SelectTrigger>
// //                   <SelectContent>
// //                     <SelectItem value="all">All Integrations</SelectItem>
// //                     {integrations.map((integration) => (
// //                       <SelectItem key={integration.id} value={integration.id}>
// //                         {integration.logo} {integration.name}
// //                       </SelectItem>
// //                     ))}
// //                   </SelectContent>
// //                 </Select>
// //               </div>

// //             <ImportSubscriberModal 
// //               newsletterOwnerId={user?.id}
// //               integrations={integrations.map(i => ({
// //                 ...i,
// //                 campaigns: subscribers
// //                   .filter(s => s.integration.id === i.id && s.campaign)
// //                   .map(s => s.campaign!)
// //                   .filter((v, i, a) => a.findIndex(t => t.id === v.id) === i) // Unique campaigns
// //               }))}
// //               onImportComplete={() => {
// //                 // Refresh the subscriber list after import
// //                 const fetchData = async () => {
// //                   try {
// //                     setLoading(true);
// //                     const subscribersResult = await getSubscribers();
// //                     if (subscribersResult.error) throw subscribersResult.error;
// //                     setSubscribers(subscribersResult.subscribers || []);
// //                   } catch (error) {
// //                     console.error("Failed to fetch data:", error);
// //                     toast.error("Failed to refresh subscribers data");
// //                   } finally {
// //                     setLoading(false);
// //                   }
// //                 };
// //                 fetchData();
// //               }}
// //             />

// //             {/* <ImportSubscriberModal
// //             integrations={integrations}
// //             newsletterOwnerId={}
// //             /> */}
// //             </div>
// //           </CardContent>
// //         </Card>

// //         {/* Subscribers List */}
// //         <Card>
// //           <CardHeader className="bg-black text-white p-3 sm:p-6">
// //             <CardTitle className="text-sm sm:text-lg">Subscribers ({filteredSubscribers.length})</CardTitle>
// //           </CardHeader>
// //           <CardContent className="p-0">
// //             <div className="overflow-x-auto">
// //               <table className="w-full">
// //                 <thead className="bg-gray-50 border-b">
// //                   <tr>
// //                     <th className="text-left p-3 sm:p-4 font-medium text-gray-900 text-xs sm:text-sm">Subscriber</th>
// //                     <th className="text-left p-3 sm:p-4 font-medium text-gray-900 text-xs sm:text-sm hidden sm:table-cell">Integration</th>
// //                     <th className="text-left p-3 sm:p-4 font-medium text-gray-900 text-xs sm:text-sm hidden lg:table-cell">Campaign</th>
// //                     <th className="text-left p-3 sm:p-4 font-medium text-gray-900 text-xs sm:text-sm">Status</th>
// //                     <th className="text-left p-3 sm:p-4 font-medium text-gray-900 text-xs sm:text-sm hidden md:table-cell">Source</th>
// //                     <th className="text-left p-3 sm:p-4 font-medium text-gray-900 text-xs sm:text-sm hidden xl:table-cell">Subscribed</th>
// //                     <th className="text-left p-3 sm:p-4 font-medium text-gray-900 text-xs sm:text-sm hidden xl:table-cell truncate text-nowrap lg:max-w-[100px]">Last Activity</th>
// //                     <th className="text-left p-3 sm:p-4 font-medium text-gray-900 text-xs sm:text-sm">Actions</th>
// //                   </tr>
// //                 </thead>
// //                 <tbody>
// //                   {filteredSubscribers.length > 0 ? (
// //                     filteredSubscribers.map((subscriber) => (
// //                       <tr key={subscriber.id} className="border-b hover:bg-gray-50">
// //                         <td className="p-3 sm:p-4">
// //                           <div className="flex items-center gap-2 sm:gap-3">
// //                             <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
// //                               <AvatarFallback className="bg-yellow-100 text-yellow-800 text-xs sm:text-sm">
// //                                 {subscriber.name
// //                                   ? subscriber.name
// //                                       .split(" ")
// //                                       .map((n) => n[0])
// //                                       .join("")
// //                                       .toUpperCase()
// //                                   : subscriber.email[0].toUpperCase()}
// //                               </AvatarFallback>
// //                             </Avatar>
// //                             <div>
// //                               <div className="font-medium text-gray-900 text-xs sm:text-sm">
// //                                 {subscriber.name || "No Name"}
// //                               </div>
// //                               <div className="text-gray-500 text-xs">{subscriber.email}</div>
// //                             </div>
// //                           </div>
// //                         </td>
// //                         <td className="p-3 sm:p-4 hidden sm:table-cell">
// //                           <div className="flex items-center gap-2">
// //                             <span className="text-sm sm:text-lg">{subscriber.integration.logo || "🌐"}</span>
// //                             <div>
// //                               <div className="text-gray-900 text-xs sm:text-sm font-medium">
// //                                 {subscriber.integration.name}
// //                               </div>
// //                               {subscriber.integration.url && (
// //                                 <div className="text-gray-500 text-xxs sm:text-xs truncate max-w-[120px] sm:max-w-[160px]">
// //                                   {subscriber.integration.url}
// //                                 </div>
// //                               )}
// //                             </div>
// //                           </div>
// //                         </td>
// //                         <td className="p-3 sm:p-4 hidden lg:table-cell">
// //                           <div>
// //                             {/* <div className="text-gray-900 text-xs sm:text-sm font-medium">
// //                               {subscriber.campaign?.name || 'GENERAL'}
// //                             </div> */}
// //                             <Badge variant="outline" className="text-xxs sm:text-xs mt-1  truncate text-nowrap lg:max-w-[150px]">
// //                               {formatString(subscriber.campaign?.trigger ?? 'GENERAL')}
// //                             </Badge>
// //                           </div>
// //                         </td>
// //                         <td className="p-3 sm:p-4">
// //                           <Badge className={`text-xxs sm:text-xs ${getStatusColor(subscriber.status)}`}>
// //                             {subscriber.status}
// //                           </Badge>
// //                         </td>
// //                         <td className="p-3 sm:p-4 hidden md:table-cell">
// //                           <Badge variant="outline" className="text-xxs sm:text-xs truncate text-nowrap lg:max-w-[150px]">
// //                             {getSourceBadge(subscriber.source)}
// //                           </Badge>
// //                           {/* {subscriber.pageUrl && (
// //                             <div className="text-gray-500 text-xxs sm:text-xs mt-1 truncate max-w-[100px] sm:max-w-[160px]">
// //                               {subscriber.pageUrl}
// //                             </div>
// //                           )} */}
// //                         </td>
// //                         <td className="p-3 sm:p-4 hidden xl:table-cell">
// //                           <div className="text-gray-900 text-xs sm:text-sm">
// //                             {formatDate(subscriber.createdAt)}
// //                           </div>
// //                         </td>
// //                         <td className="p-3 sm:p-4 hidden xl:table-cell">
// //                           <div className="text-gray-900 text-xs sm:text-sm">
// //                           {formatDate(subscriber.updatedAt)}
// //                           </div>
// //                         </td>
// //                         <td className="p-3 sm:p-4">
// //                           <DropdownMenu>
// //                             <DropdownMenuTrigger asChild>
// //                               <Button variant="ghost" size="icon" className="h-8 w-8">
// //                                 <MoreVertical className="h-3 w-3 sm:h-4 sm:w-4" />
// //                               </Button>
// //                             </DropdownMenuTrigger>
// //                             <DropdownMenuContent align="end" className="text-xs sm:text-sm">
// //                               <DropdownMenuItem>
// //                                 <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
// //                                 View Details
// //                               </DropdownMenuItem>
// //                               <DropdownMenuItem>
// //                                 <Mail className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
// //                                 Send Email
// //                               </DropdownMenuItem>
// //                               <DropdownMenuItem className="text-red-600">
// //                                 <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
// //                                 Remove
// //                               </DropdownMenuItem>
// //                             </DropdownMenuContent>
// //                           </DropdownMenu>
// //                         </td>
// //                       </tr>
// //                     ))
// //                   ) : (
// //                     <tr>
// //                       <td colSpan={7} className="p-6 text-center text-gray-500 text-sm sm:text-base">
// //                         No subscribers found matching your criteria
// //                       </td>
// //                     </tr>
// //                   )}
// //                 </tbody>
// //               </table>
// //             </div>
// //           </CardContent>
// //         </Card>
// //       </div>

// //       <AddSubscriberDialog 
// //         open={showAddDialog} 
// //         onOpenChange={setShowAddDialog} 
// //         integrations={integrations} 
// //       />
// //     </div>
// //   );
// // }













// "use client";

// import { useEffect, useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
// import { Search, Download, UserPlus, MoreVertical, Mail, Calendar, Trash2, Edit, Eye, Filter, User, UserCheck, UserCog, TrendingUp, UserMinus, BotIcon } from "lucide-react";
// import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// import { AddSubscriberDialog } from "./add-subscriber-dialog";
// import { getIntegrations } from "@/actions/application-Integration/application";
// import { toast } from "sonner";
// import { SubscriptionStatus } from "@prisma/client";
// import Loader from "@/components/Loader";
// import { formatString } from "@/lib/utils";
// import ExportCSVBTN from "./exportCSVBTN";
// import { ImportSubscriberModal } from "./ImportSubscriberModal";
// import { useUser } from "@clerk/nextjs";
// import { useSubscribers } from "@/actions/subscriber/use.subscriber";

// interface Subscriber {
//   id: string;
//   email: string;
//   name: string | null;
//   source: string;
//   status: SubscriptionStatus;
//   createdAt: Date;
//   updatedAt: Date;
//   campaign: {
//     id: string;
//     name: string;
//     trigger: string;
//   } | null;
//   integration: {
//     id: string;
//     name: string;
//     logo: string | null;
//     url: string | null;
//   } | null;
//   pageUrl: string | null;
// }

// interface Integration {
//   id: string;
//   name: string;
//   logo: string | null;
//   url: string | null;
// }

// const sources = ["website_form", "api_import", "manual_add", "social_media", "referral", "unknown"];

// export function SubscribersDashboard() {
//   const { user } = useUser();
//   const [searchTerm, setSearchTerm] = useState("");
//   const [statusFilter, setStatusFilter] = useState("all");
//   const [integrationFilter, setIntegrationFilter] = useState("all");
//   const [sourceFilter, setSourceFilter] = useState("all");
//   const [showAddDialog, setShowAddDialog] = useState(false);
//   const [integrations, setIntegrations] = useState<Integration[]>([]);
//   const [integrationsLoading, setIntegrationsLoading] = useState(true);

//   // Use the useSubscribers hook
//   const { 
//     subscribers, 
//     loading: subscribersLoading, 
//     error: subscribersError, 
//     refetch: refetchSubscribers 
//   } = useSubscribers();


//   // Fetch integrations on component mount
//   useEffect(() => {
//     const fetchIntegrations = async () => {
//       try {
//         setIntegrationsLoading(true);
//         const integrationsResult = await getIntegrations();

//         console.log(integrationsResult, 'int result')
        
//         if (integrationsResult.error) {
//           throw new Error(integrationsResult.error);
//         }

//         setIntegrations(integrationsResult.data || []);
//       } catch (error) {
//         console.error("Failed to fetch integrations:", error);
//         toast.error("Failed to load integrations data");
//       } finally {
//         setIntegrationsLoading(false);
//       }
//     };

//     fetchIntegrations();
//   }, []);

//   console.log(subscribers, 'subb')

//   const filteredSubscribers = subscribers.filter((subscriber) => {
//     const matchesSearch =
//       subscriber.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       subscriber.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       subscriber.campaign?.name?.toLowerCase().includes(searchTerm.toLowerCase());

//     const matchesStatus = statusFilter === "all" || subscriber.status.toLowerCase() === statusFilter.toLowerCase();
//     const matchesIntegration = integrationFilter === "all" || subscriber.integration.id === integrationFilter;
//     const matchesSource = sourceFilter === "all" || subscriber.source === sourceFilter;

//     return matchesSearch && matchesStatus && matchesIntegration && matchesSource;
//   });

//   const totalSubscribers = subscribers.length;
//   const totalIntegratedApp = integrations.length;
//   const activeSubscribers = subscribers.filter((s) => s.status === SubscriptionStatus.Subscribed).length;
//   const unsubscribedCount = subscribers.filter((s) => s.status === SubscriptionStatus.Unsubscribed).length;

//   const getStatusColor = (status: SubscriptionStatus) => {
//     switch (status) {
//       case SubscriptionStatus.Subscribed:
//         return "bg-green-100 text-green-800 border-green-200";
//       case SubscriptionStatus.Unsubscribed:
//         return "bg-red-100 text-red-800 border-red-200";
//       default:
//         return "bg-blue-100 text-blue-800 border-blue-200";
//     }
//   };

//   const getSourceBadge = (source: string) => {
//     const sourceLabels: Record<string, string> = {
//       website_form: "Website Form",
//       api_import: "API Import",
//       manual_add: "Manual Add",
//       social_media: "Social Media",
//       referral: "Referral",
//       unknown: "Unknown",
//     };
//     return sourceLabels[source] || source;
//   };

//   const formatDate = (date: Date) => {
//     return new Date(date).toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//     });
//   };

//   console.log(integrations, 'inttt ttt')

//   if (subscribersLoading || integrationsLoading) {
//     return <Loader />;
//   }

//   if (!integrations.length) {
//     return (
//       <div className="min-h-screen bg-white flex items-center justify-center p-4">
//         <div className="text-gray-500 text-center">
//           No integrations found. Please add an integration first.
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-white">
//       {/* Header */}
//       <div className="border-b border-gray-200">
//         <div className="mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
//           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//             <div>
//               <h1 className="text-2xl sm:text-3xl font-bold text-black">All Subscribers</h1>
//               <p className="mt-1 sm:mt-2 text-sm sm:text-base text-gray-600">
//                 Manage subscribers across all integrated applications and campaigns
//               </p>
//             </div>
//             <Button
//               onClick={() => setShowAddDialog(true)}
//               className="bg-black hover:bg-white hover:text-black text-white font-medium w-full sm:w-auto"
//               size="sm"
//             >
//               <UserPlus className="h-4 w-4 mr-2" />
//               Add Subscriber
//             </Button>
//           </div>
//         </div>
//       </div>

//       <div className="p-4 sm:p-6 space-y-4">
//         {/* Statistics Cards */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
//           <Card className="h-full">
//             <CardContent className="p-2 sm:p-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-xs sm:text-sm font-medium text-gray-600">Total Subscribers</p>
//                   <p className="text-xl sm:text-2xl font-bold text-black">{totalSubscribers}</p>
//                 </div>
//                 <div className="bg-blue-100 p-1 sm:p-3 rounded-full">
//                   <User className="w-4 h-4 sm:w-6 sm:h-6 text-blue-600" />
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           <Card className="h-full">
//             <CardContent className="p-2 sm:p-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-xs sm:text-sm font-medium text-gray-600">Active Subscribers</p>
//                   <p className="text-xl sm:text-2xl font-bold text-black">{activeSubscribers}</p>
//                 </div>
//                 <div className="bg-green-100 p-1 sm:p-3 rounded-full">
//                   <UserCheck className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           <Card className="h-full">
//             <CardContent className="p-2 sm:p-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-xs sm:text-sm font-medium text-gray-600">Unsubscribed</p>
//                   <p className="text-xl sm:text-2xl font-bold text-black">{unsubscribedCount}</p>
//                 </div>
//                 <div className="bg-yellow-100 p-1 sm:p-3 rounded-full">
//                   <UserMinus className="w-4 h-4 sm:w-5 sm:h-5 text-gold-600" />
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           <Card className="h-full">
//             <CardContent className="p-2 sm:p-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-xs sm:text-sm font-medium text-gray-600">Integrated Apps</p>
//                   <p className="text-xl sm:text-2xl font-bold text-black">{totalIntegratedApp}</p>
//                 </div>
//                 <div className="bg-purple-100 p-1 sm:p-3 rounded-full">
//                   <BotIcon className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Filters and Search */}
//         <Card>
//           <CardContent className="p-4">
//             <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
//               <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
//                 <div className="lg:col-span-2">
//                   <div className="relative">
//                     <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
//                     <Input
//                       placeholder="Search by name, email, or campaign..."
//                       value={searchTerm}
//                       onChange={(e) => setSearchTerm(e.target.value)}
//                       className="pl-10 border-gray-300 focus:border-gold-600 focus:ring-gold-600 text-sm sm:text-base"
//                     />
//                   </div>
//                 </div>

//                 <Select value={statusFilter} onValueChange={setStatusFilter}>
//                   <SelectTrigger className="border-gray-300 focus:border-gold-600 focus:ring-gold-600 text-sm sm:text-base">
//                     <SelectValue placeholder="Status" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="all">All Status</SelectItem>
//                     <SelectItem value={SubscriptionStatus.Subscribed}>Subscribed</SelectItem>
//                     <SelectItem value={SubscriptionStatus.Unsubscribed}>Unsubscribed</SelectItem>
//                   </SelectContent>
//                 </Select>

//                 <Select value={integrationFilter} onValueChange={setIntegrationFilter}>
//                   <SelectTrigger className="border-gray-300 focus:border-gold-600 focus:ring-gold-600 text-sm sm:text-base">
//                     <SelectValue placeholder="Integration" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="all">All Integrations</SelectItem>
//                     {integrations.map((integration) => (
//                       <SelectItem key={integration.id} value={integration.id}>
//                         {integration.logo} {integration.name}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>

//               <ImportSubscriberModal 
//                 newsletterOwnerId={user?.id}
//                 integrations={integrations}
//                 onImportComplete={refetchSubscribers}
//               />
//             </div>
//           </CardContent>
//         </Card>

//        {/* Subscribers List */}
//         <Card>
//           <CardHeader className="bg-black text-white p-3 sm:p-6">
//             <CardTitle className="text-sm sm:text-lg">Subscribers ({filteredSubscribers.length})</CardTitle>
//           </CardHeader>
//           <CardContent className="p-0">
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead className="bg-gray-50 border-b">
//                   <tr>
//                     <th className="text-left p-3 sm:p-4 font-medium text-gray-900 text-xs sm:text-sm">Subscriber</th>
//                     <th className="text-left p-3 sm:p-4 font-medium text-gray-900 text-xs sm:text-sm hidden sm:table-cell">Integration</th>
//                     <th className="text-left p-3 sm:p-4 font-medium text-gray-900 text-xs sm:text-sm hidden lg:table-cell">Campaign</th>
//                     <th className="text-left p-3 sm:p-4 font-medium text-gray-900 text-xs sm:text-sm">Status</th>
//                     <th className="text-left p-3 sm:p-4 font-medium text-gray-900 text-xs sm:text-sm hidden md:table-cell">Source</th>
//                     <th className="text-left p-3 sm:p-4 font-medium text-gray-900 text-xs sm:text-sm hidden xl:table-cell">Subscribed</th>
//                     <th className="text-left p-3 sm:p-4 font-medium text-gray-900 text-xs sm:text-sm hidden xl:table-cell truncate text-nowrap lg:max-w-[100px]">Last Activity</th>
//                     <th className="text-left p-3 sm:p-4 font-medium text-gray-900 text-xs sm:text-sm">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filteredSubscribers.length > 0 ? (
//                     filteredSubscribers.map((subscriber) => (
//                       <tr key={subscriber.id} className="border-b hover:bg-gray-50">
//                         <td className="p-3 sm:p-4">
//                           <div className="flex items-center gap-2 sm:gap-3">
//                             <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
//                               <AvatarFallback className="bg-yellow-100 text-yellow-800 text-xs sm:text-sm">
//                                 {subscriber.name
//                                   ? subscriber.name
//                                       .split(" ")
//                                       .map((n) => n[0])
//                                       .join("")
//                                       .toUpperCase()
//                                   : subscriber.email[0].toUpperCase()}
//                               </AvatarFallback>
//                             </Avatar>
//                             <div>
//                               <div className="font-medium text-gray-900 text-xs sm:text-sm">
//                                 {subscriber.name || "No Name"}
//                               </div>
//                               <div className="text-gray-500 text-xs">{subscriber.email}</div>
//                             </div>
//                           </div>
//                         </td>
//                         <td className="p-3 sm:p-4 hidden sm:table-cell">
//                           <div className="flex items-center gap-2">
//                             <span className="text-sm sm:text-lg">{subscriber.integration.logo || "🌐"}</span>
//                             <div>
//                               <div className="text-gray-900 text-xs sm:text-sm font-medium">
//                                 {subscriber.integration.name}
//                               </div>
//                               {subscriber.integration.url && (
//                                 <div className="text-gray-500 text-xxs sm:text-xs truncate max-w-[120px] sm:max-w-[160px]">
//                                   {subscriber.integration.url}
//                                 </div>
//                               )}
//                             </div>
//                           </div>
//                         </td>
//                         <td className="p-3 sm:p-4 hidden lg:table-cell">
//                           <div>
//                             {/* <div className="text-gray-900 text-xs sm:text-sm font-medium">
//                               {subscriber.campaign?.name || 'GENERAL'}
//                             </div> */}
//                             <Badge variant="outline" className="text-xxs sm:text-xs mt-1  truncate text-nowrap lg:max-w-[150px]">
//                               {formatString(subscriber.campaign?.trigger ?? 'GENERAL')}
//                             </Badge>
//                           </div>
//                         </td>
//                         <td className="p-3 sm:p-4">
//                           <Badge className={`text-xxs sm:text-xs ${getStatusColor(subscriber.status)}`}>
//                             {subscriber.status}
//                           </Badge>
//                         </td>
//                         <td className="p-3 sm:p-4 hidden md:table-cell">
//                           <Badge variant="outline" className="text-xxs sm:text-xs truncate text-nowrap lg:max-w-[150px]">
//                             {getSourceBadge(subscriber.source)}
//                           </Badge>
//                           {/* {subscriber.pageUrl && (
//                             <div className="text-gray-500 text-xxs sm:text-xs mt-1 truncate max-w-[100px] sm:max-w-[160px]">
//                               {subscriber.pageUrl}
//                             </div>
//                           )} */}
//                         </td>
//                         <td className="p-3 sm:p-4 hidden xl:table-cell">
//                           <div className="text-gray-900 text-xs sm:text-sm">
//                             {formatDate(subscriber.createdAt)}
//                           </div>
//                         </td>
//                         <td className="p-3 sm:p-4 hidden xl:table-cell">
//                           <div className="text-gray-900 text-xs sm:text-sm">
//                           {formatDate(subscriber.updatedAt)}
//                           </div>
//                         </td>
//                         <td className="p-3 sm:p-4">
//                           <DropdownMenu>
//                             <DropdownMenuTrigger asChild>
//                               <Button variant="ghost" size="icon" className="h-8 w-8">
//                                 <MoreVertical className="h-3 w-3 sm:h-4 sm:w-4" />
//                               </Button>
//                             </DropdownMenuTrigger>
//                             <DropdownMenuContent align="end" className="text-xs sm:text-sm">
//                               <DropdownMenuItem>
//                                 <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
//                                 View Details
//                               </DropdownMenuItem>
//                               <DropdownMenuItem>
//                                 <Mail className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
//                                 Send Email
//                               </DropdownMenuItem>
//                               <DropdownMenuItem className="text-red-600">
//                                 <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
//                                 Remove
//                               </DropdownMenuItem>
//                             </DropdownMenuContent>
//                           </DropdownMenu>
//                         </td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td colSpan={7} className="p-6 text-center text-gray-500 text-sm sm:text-base">
//                         No subscribers found matching your criteria
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       <AddSubscriberDialog 
//         open={showAddDialog} 
//         onOpenChange={setShowAddDialog} 
//         integrations={integrations} 
//       />
//     </div>
//   );
// }




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
import { getIntegrations } from "@/actions/application-Integration/application";
import { toast } from "sonner";
import { SubscriptionStatus } from "@prisma/client";
import Loader from "@/components/Loader";
import { useUser } from "@clerk/nextjs";
import { useSubscribers } from "@/actions/subscriber/use.subscriber";
import { formatString } from "@/lib/utils";
import { ImportSubscriberModal } from "./ImportSubscriberModal";

interface Subscriber {
  id: string;
  email: string;
  name: string | null;
  source: string;
  status: SubscriptionStatus;
  createdAt: Date;
  updatedAt: Date;
  campaign: {
    id: string;
    name: string;
    trigger: string;
  } | null;
  integration: {
    id: string;
    name: string;
    logo: string | null;
    url: string | null;
  } | null;
}

interface Integration {
  id: string;
  name: string;
  logo: string | null;
  url: string | null;
}

export function SubscribersDashboard() {
  const { user } = useUser();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [integrationFilter, setIntegrationFilter] = useState("all");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [integrationsLoading, setIntegrationsLoading] = useState(true);

  const {
    subscribers,
    loading: subscribersLoading,
    error: subscribersError,
    refetch: refetchSubscribers
  } = useSubscribers();

  // Fetch integrations
  useEffect(() => {
    const fetchIntegrations = async () => {
      try {
        setIntegrationsLoading(true);
        const integrationsResult = await getIntegrations();
        if (integrationsResult.error) throw new Error(integrationsResult.error);
        setIntegrations(integrationsResult.data || []);
      } catch (error) {
        console.error("Failed to fetch integrations:", error);
        toast.error("Failed to load integrations data");
      } finally {
        setIntegrationsLoading(false);
      }
    };
    fetchIntegrations();
  }, []);

  const filteredSubscribers = subscribers.filter((subscriber) => {
    const matchesSearch =
      subscriber.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subscriber.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subscriber.campaign?.name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || subscriber.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesIntegration =
      integrationFilter === "all" ||
      (subscriber.integration && subscriber.integration.id === integrationFilter);

    return matchesSearch && matchesStatus && matchesIntegration;
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
          <Card>
            <CardContent className="p-2 sm:p-6 flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Integrated Apps</p>
                <p className="text-xl sm:text-2xl font-bold text-black">{integrations.length}</p>
              </div>
              <div className="bg-purple-100 p-2 rounded-full"><BotIcon className="w-5 h-5 text-purple-600" /></div>
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
              <Select value={integrationFilter} onValueChange={setIntegrationFilter}>
                <SelectTrigger><SelectValue placeholder="Integration" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Integrations</SelectItem>
                  {integrations.map((integration) => (
                    <SelectItem key={integration.id} value={integration.id}>{integration.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <ImportSubscriberModal newsletterOwnerId={user?.id} integrations={integrations} onImportComplete={refetchSubscribers} />
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
                      <th className="text-left p-3 font-medium text-gray-900 text-sm hidden sm:table-cell">Integration</th>
                      <th className="text-left p-3 font-medium text-gray-900 text-sm hidden lg:table-cell">Campaign</th>
                      <th className="text-left p-3 font-medium text-gray-900 text-sm">Status</th>
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
                        <td className="p-3 hidden sm:table-cell">
                          {subscriber.integration ? (
                            <div className="flex items-center gap-2">
                              <span className="text-sm">{subscriber.integration.logo || "🌐"}</span>
                              <div className="text-gray-900 text-xs">{subscriber.integration.name}</div>
                            </div>
                          ) : (
                            <span className="text-gray-400 text-xs">No Integration</span>
                          )}
                        </td>
                        <td className="p-3 hidden lg:table-cell">
                          <Badge variant="outline" className="text-xxs">{formatString(subscriber.campaign?.trigger ?? "GENERAL")}</Badge>
                        </td>
                        <td className="p-3">
                          <Badge className={`text-xxs ${getStatusColor(subscriber.status)}`}>{subscriber.status}</Badge>
                        </td>
                        <td className="p-3 hidden md:table-cell">
                          <Badge variant="outline" className="text-xxs">{getSourceBadge(subscriber.source)}</Badge>
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
        integrations={integrations}
      />
    </div>
  );
}
