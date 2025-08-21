// "use client"

// import { useState } from "react"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Badge } from "@/components/ui/badge"
// import { Progress } from "@/components/ui/progress"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { Search, Eye, CheckCircle, XCircle, Clock, Users, FileText } from "lucide-react"
// import Link from "next/link"
// import KYCCard from "./Card"

// interface KycApplication {
//   id: string
//   fullName: string
//   email: string
//   status: "pending" | "under_review" | "approved" | "rejected"
//   priority: "high" | "normal" | "low"
//   completionScore: number
//   submittedAt: string
//   reviewedAt?: string
//   documentCount: number
// }

// const mockKycData: KycApplication[] = [
//   {
//     id: "kyc_001",
//     fullName: "John Smith",
//     email: "john.smith@email.com",
//     status: "pending",
//     priority: "high",
//     completionScore: 95,
//     submittedAt: "2024-01-21T10:30:00Z",
//     documentCount: 4,
//   },
//   {
//     id: "kyc_002",
//     fullName: "Sarah Johnson",
//     email: "sarah.j@email.com",
//     status: "under_review",
//     priority: "normal",
//     completionScore: 88,
//     submittedAt: "2024-01-20T14:15:00Z",
//     documentCount: 3,
//   },
//   {
//     id: "kyc_003",
//     fullName: "Michael Brown",
//     email: "m.brown@email.com",
//     status: "approved",
//     priority: "normal",
//     completionScore: 100,
//     submittedAt: "2024-01-19T09:45:00Z",
//     reviewedAt: "2024-01-20T11:30:00Z",
//     documentCount: 5,
//   },
//   {
//     id: "kyc_004",
//     fullName: "Emily Davis",
//     email: "emily.davis@email.com",
//     status: "rejected",
//     priority: "low",
//     completionScore: 65,
//     submittedAt: "2024-01-18T16:20:00Z",
//     reviewedAt: "2024-01-19T13:45:00Z",
//     documentCount: 2,
//   },
//   {
//     id: "kyc_005",
//     fullName: "David Wilson",
//     email: "d.wilson@email.com",
//     status: "under_review",
//     priority: "high",
//     completionScore: 92,
//     submittedAt: "2024-01-17T11:10:00Z",
//     documentCount: 4,
//   },
// ]

// export function KycDashboard() {
//   const [searchTerm, setSearchTerm] = useState("")
//   const [statusFilter, setStatusFilter] = useState<string>("all")
//   const [priorityFilter, setPriorityFilter] = useState<string>("all")

//   const filteredData = mockKycData.filter((application) => {
//     const matchesSearch =
//       application.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       application.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       application.id.toLowerCase().includes(searchTerm.toLowerCase())

//     const matchesStatus = statusFilter === "all" || application.status === statusFilter
//     const matchesPriority = priorityFilter === "all" || application.priority === priorityFilter

//     return matchesSearch && matchesStatus && matchesPriority
//   })

//   const getStatusBadge = (status: string) => {
//     const statusConfig = {
//       pending: { label: "Pending", variant: "secondary" as const, icon: Clock },
//       under_review: { label: "Under Review", variant: "default" as const, icon: Eye },
//       approved: { label: "Approved", variant: "default" as const, icon: CheckCircle },
//       rejected: { label: "destructive" as const, variant: "destructive" as const, icon: XCircle },
//     }

//     const config = statusConfig[status as keyof typeof statusConfig]
//     const Icon = config.icon

//     return (
//       <Badge variant={config.variant} className="flex items-center gap-1">
//         <Icon className="w-3 h-3" />
//         {config.label}
//       </Badge>
//     )
//   }

//   const getPriorityBadge = (priority: string) => {
//     const priorityConfig = {
//       high: { label: "High", className: "bg-red-100 text-red-800 border-red-200" },
//       normal: { label: "Normal", className: "bg-blue-100 text-blue-800 border-blue-200" },
//       low: { label: "Low", className: "bg-gray-100 text-gray-800 border-gray-200" },
//     }

//     const config = priorityConfig[priority as keyof typeof priorityConfig]

//     return (
//       <Badge variant="outline" className={config.className}>
//         {config.label}
//       </Badge>
//     )
//   }

//   const stats = {
//     total: mockKycData.length,
//     pending: mockKycData.filter((app) => app.status === "pending").length,
//     underReview: mockKycData.filter((app) => app.status === "under_review").length,
//     approved: mockKycData.filter((app) => app.status === "approved").length,
//     rejected: mockKycData.filter((app) => app.status === "rejected").length,
//   }

//   return (
//     <div className="space-y-8">
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-3xl font-bold">KYC Management</h1>
//           <p className="text-muted-foreground">Review and manage user verification applications</p>
//         </div>
//       </div>

//       {/* Statistics Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-5 gap-4">

//         <KYCCard 
//           title="Total Applications"
//           count={stats.total}
//           Icon={Users}
//         />
//         <KYCCard 
//           title="Pending Applications"
//           count={stats.pending}
//           Icon={Clock}
//         />
//         <KYCCard 
//           title="Under Review "
//           count={stats.underReview}
//           Icon={Eye}
//         />
//         <KYCCard 
//           title="Approved "
//           count={stats.approved}
//           Icon={CheckCircle}
//         />
//         <KYCCard 
//           title="Rejected "
//           count={stats.rejected}
//           Icon={XCircle}
//         />

     
//       </div>

//       {/* Filters */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Filter Applications</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="flex flex-col md:flex-row gap-4">
//             <div className="relative flex-1">
//               <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//               <Input
//                 placeholder="Search by name, email, or ID..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="pl-10"
//               />
//             </div>

//             <Select value={statusFilter} onValueChange={setStatusFilter}>
//               <SelectTrigger className="w-full md:w-[200px]">
//                 <SelectValue placeholder="Filter by status" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">All Statuses</SelectItem>
//                 <SelectItem value="pending">Pending</SelectItem>
//                 <SelectItem value="under_review">Under Review</SelectItem>
//                 <SelectItem value="approved">Approved</SelectItem>
//                 <SelectItem value="rejected">Rejected</SelectItem>
//               </SelectContent>
//             </Select>

//             <Select value={priorityFilter} onValueChange={setPriorityFilter}>
//               <SelectTrigger className="w-full md:w-[200px]">
//                 <SelectValue placeholder="Filter by priority" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">All Priorities</SelectItem>
//                 <SelectItem value="high">High Priority</SelectItem>
//                 <SelectItem value="normal">Normal Priority</SelectItem>
//                 <SelectItem value="low">Low Priority</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Applications Table */}
//       <Card>
//         <CardHeader>
//           <CardTitle>KYC Applications</CardTitle>
//           <CardDescription>
//             Showing {filteredData.length} of {mockKycData.length} applications
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>Application ID</TableHead>
//                 <TableHead>Full Name</TableHead>
//                 <TableHead>Email</TableHead>
//                 <TableHead>Status</TableHead>
//                 <TableHead>Priority</TableHead>
//                 <TableHead>Completion</TableHead>
//                 <TableHead>Documents</TableHead>
//                 <TableHead>Submitted</TableHead>
//                 <TableHead>Actions</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {filteredData.map((application) => (
//                 <TableRow key={application.id}>
//                   <TableCell className="font-mono text-sm">{application.id}</TableCell>
//                   <TableCell className="font-medium">{application.fullName}</TableCell>
//                   <TableCell>{application.email}</TableCell>
//                   <TableCell>{getStatusBadge(application.status)}</TableCell>
//                   <TableCell>{getPriorityBadge(application.priority)}</TableCell>
//                   <TableCell>
//                     <div className="flex items-center space-x-2">
//                       <Progress value={application.completionScore} className="w-16" />
//                       <span className="text-sm text-muted-foreground">{application.completionScore}%</span>
//                     </div>
//                   </TableCell>
//                   <TableCell>
//                     <div className="flex items-center space-x-1">
//                       <FileText className="w-4 h-4 text-muted-foreground" />
//                       <span>{application.documentCount}</span>
//                     </div>
//                   </TableCell>
//                   <TableCell>{new Date(application.submittedAt).toLocaleDateString()}</TableCell>
//                   <TableCell>
//                     <Link href={`/xontrol/kyc/${application.id}`}>
//                       <Button variant="outline" size="sm">
//                         <Eye className="w-4 h-4 mr-1" />
//                         Review
//                       </Button>
//                     </Link>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }










"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Eye, CheckCircle, XCircle, Clock, Users, FileText } from "lucide-react";
import Link from "next/link";
import KYCCard from "./Card";
import { fetchAllKyc } from "@/actions/kyc/superAdmin";
import { KYCAccountType, KYCStatus } from "@prisma/client";

interface KycLevels {
  level1?: { status: KYCStatus; updatedAt?: Date };
  level2?: { status: KYCStatus; updatedAt?: Date };
  level3?: { status: KYCStatus; updatedAt?: Date };
}



interface MappedKycApplication {
  id: string;
  fullName: string;
  email: string;
  status: KYCStatus;
  accountType: KYCAccountType;
  completionScore: number;
  submittedAt: Date;
  reviewedAt?: Date;
  documentCount: number;
}

export function KycDashboard() {
  const [kycData, setKycData] = useState<MappedKycApplication[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);

  // fetch data from server action
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const res = await fetchAllKyc();
        
        if (res.success && res.data) {
          const mapped = res.data.map((k: any) => {
            const levels = k.levels || {};
            const levelKeys = Object.keys(levels) as (keyof KycLevels)[];
            const totalLevels = levelKeys.length;
            
            const completedLevels = levelKeys.filter(key => 
              levels[key]?.status === "COMPLETED"
            ).length;

            let completionScore = totalLevels > 0 ? (completedLevels / totalLevels) * 100 : 0;

            if (completedLevels === totalLevels && k.status !== "APPROVED") {
              completionScore = 95;
            }

            if (k.status === "APPROVED") {
              completionScore = 100;
            }

            return {
              id: k.id,
              fullName: k.user.fullName,
              email: k.user.email,
              status: k.status,
              accountType: k.accountType,
              completionScore: Math.round(completionScore),
              submittedAt: k.createdAt,
              reviewedAt: k.reviewedTime || undefined,
              documentCount: k.kycDocuments.length,
            };
          });
          
          setKycData(mapped);
        }
      } catch (error) {
        console.error("Error fetching KYC data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  // filtering
  const filteredData = kycData.filter((application) => {
    const matchesSearch =
      application.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      application.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      application.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || application.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // badges
  const getStatusBadge = (status: KYCStatus) => {
    const statusConfig = {
      PENDING: { label: "Pending", variant: "secondary" as const, icon: Clock },
      COMPLETED: { label: "Under Review", variant: "default" as const, icon: Eye },
      APPROVED: { label: "Approved", variant: "default" as const, icon: CheckCircle },
      REJECTED: { label: "Rejected", variant: "destructive" as const, icon: XCircle },
      IN_PROGRESS: {label: "In Progress", variant: "warning" as const, icon: Clock },
    };

    const config = statusConfig[status];
    if (!config) return null;

    const Icon = config.icon;
    return (
      <Badge variant={config.variant} className="flex items-center gap-1 text-nowrap">
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  const getAccountTypeBadge = (type: KYCAccountType) => {
    const typeConfig = {
      INDIVIDUAL: { label: "Individual", className: "bg-purple-100 text-purple-800 border-purple-200" },
     ORGANIZATION : { label: "Organization", className: "bg-green-100 text-green-800 border-green-200" },
    };

    const config = typeConfig[type];
    return (
      <Badge variant="outline" className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const stats = {
    total: kycData.length,
    pending: kycData.filter((app) => app.status === "PENDING").length,
    underReview: kycData.filter((app) => app.status === "COMPLETED").length,
    approved: kycData.filter((app) => app.status === "APPROVED").length,
    rejected: kycData.filter((app) => app.status === "REJECTED").length,
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">KYC Management</h1>
          <p className="text-muted-foreground">Review and manage user verification applications</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <KYCCard title="Total Applications" count={stats.total} Icon={Users} />
        <KYCCard title="Pending Applications" count={stats.pending} Icon={Clock} />
        <KYCCard title="Under Review" count={stats.underReview} Icon={Eye} />
        <KYCCard title="Approved" count={stats.approved} Icon={CheckCircle} />
        <KYCCard title="Rejected" count={stats.rejected} Icon={XCircle} />
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Applications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="COMPLETED">Under Review</SelectItem>
                <SelectItem value="APPROVED">Approved</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Applications Table */}
      <Card>
        <CardHeader>
          <CardTitle>KYC Applications</CardTitle>
          <CardDescription>
            Showing {filteredData.length} of {kycData.length} applications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className=" text-nowrap truncate max-w-[200px]">Application ID</TableHead>
                <TableHead className=" text-nowrap truncate max-w-[200px]">Account Type</TableHead>
                <TableHead>Full Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Completion</TableHead>
                <TableHead>Documents</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8">
                    Loading KYC applications...
                  </TableCell>
                </TableRow>
              ) : filteredData.length > 0 ? (
                filteredData.map((application) => (
                  <TableRow key={application.id}>
                    <TableCell className="font-mono text-sm truncate max-w-max-[200px]">{application.id}</TableCell>
                    <TableCell>{getAccountTypeBadge(application.accountType)}</TableCell>
                    <TableCell className="font-medium truncate text-nowrap ">{application.fullName}</TableCell>
                    <TableCell>{application.email}</TableCell>
                    <TableCell>{getStatusBadge(application.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Progress value={application.completionScore} className="w-16" />
                        <span className="text-sm text-muted-foreground">{application.completionScore}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <FileText className="w-4 h-4 text-muted-foreground" />
                        <span>{application.documentCount}</span>
                      </div>
                    </TableCell>
                    <TableCell>{new Date(application.submittedAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Link href={`/xontrol/kyc/${application.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-1" />
                          Review
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8">
                    No KYC applications found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}