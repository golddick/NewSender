"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  CheckCircle,
  Clock,
  XCircle,
  AlertTriangle,
  User,
  Building,
  Camera,
  MapPin,
  FileText,
  Download,
  Eye,
  Edit,
  RefreshCw,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { KYCAccountType, KYCStatus } from "@prisma/client"
import Image from "next/image"

// interface KYCDetailsViewProps {
//   kycData: {
//     accountType: "individual" | "organization"
//     status: "pending" | "approved" | "rejected" | "under_review"
//     submittedAt: string
//     reviewedAt?: string
//     reviewedBy?: string
//     rejectionReason?: string
//     individualData?: {
//       idType: string
//       idNumber: string
//       issuingCountry: string
//       expiryDate: string
//       placeOfBirth: string
//       occupation: string
//       sourceOfFunds: string
//     }
//     organizationData?: {
//       legalName: string
//       tradingName: string
//       registrationNumber: string
//       taxId: string
//       incorporationDate: string
//       incorporationCountry: string
//       businessType: string
//       industry: string
//       numberOfEmployees: string
//       annualRevenue: string
//       website: string
//       description: string
//       registeredAddress: string
//       operatingAddress: string
//       contactPerson: string
//       contactEmail: string
//       contactPhone: string
//       bankName: string
//       bankAccount: string
//       swiftCode: string
//     }
//     livePhoto?: string
//     addressDocument?: {
//       type: string
//       filename: string
//       uploadedAt: string
//     }
//     documents?: Array<{
//       type: string
//       filename: string
//       uploadedAt: string
//     }>
//   }
//   onEdit: () => void
//   onResubmit: () => void
// }

interface KYCDetailsViewProps {
  kycData: {
    accountType: KYCAccountType;
    status:KYCStatus
    submittedAt: string;
    reviewedAt?: string;
    reviewedBy?: string;
    rejectionReason?: string;
    individualData?: {
      idType: string;
      idNumber: string;
      issuingCountry: string;
      expiryDate: string;
      occupation?: string;
    };
    organizationData?: {
      legalName: string;
      tradingName: string;
      registrationNumber: string;
      taxId: string;
      incorporationDate: string;
      incorporationCountry: string;
      businessType: string;
      industry: string;
      website: string;
      description: string;
      registeredAddress: string;
      operatingAddress: string;
      contactPerson: string;
      contactEmail: string;
      contactPhone: string;
    };
    livePhoto?: string;
    addressDocument?: {
      type: string;
      filename?: string;
      uploadedAt: string;
      url?: string;
    };
    documents?: Array<{
      type: string;
      filename?: string;
      uploadedAt: string;
      url?: string;
    }>;
  };
  onEdit: () => void;
  onResubmit: () => void;
}

export function KYCDetailsView({ kycData, onEdit, onResubmit }: KYCDetailsViewProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const getStatusBadge = (status: KYCStatus) => {
    switch (status) {
      case "APPROVED":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircle className="h-3 w-3 mr-1" />
            Approved
          </Badge>
        )
      case "PENDING":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            <Clock className="h-3 w-3 mr-1" />
            Pending Review
          </Badge>
        )
      case "COMPLETED":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            <Eye className="h-3 w-3 mr-1" />
            Under Review
          </Badge>
        )
      case "REJECTED":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            <XCircle className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        )
      default:
        return (
          <Badge variant="outline">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Unknown
          </Badge>
        )
    }
  }

  const getStatusIcon = (status: KYCStatus) => {
    switch (status) {
      case "APPROVED":
        return <CheckCircle className="h-8 w-8 text-green-500" />
      case "PENDING":
        return <Clock className="h-8 w-8 text-yellow-500" />
      case "COMPLETED":
        return <Eye className="h-8 w-8 text-blue-500" />
      case "REJECTED":
        return <XCircle className="h-8 w-8 text-red-500" />
      default:
        return <AlertTriangle className="h-8 w-8 text-gray-500" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const maskSensitiveData = (data: string, visibleChars = 4) => {
    if (!data || data.length <= visibleChars) return data
    return data.slice(0, visibleChars) + "*".repeat(data.length - visibleChars)
  }

  console.log(kycData, 'kycData', 'KYC Details View'  )

  return (
    <div className="space-y-6">
      {/* Status Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getStatusIcon(kycData.status)}
              <div>
                <CardTitle className="flex items-center gap-2">
                  KYC Verification Status
                  {getStatusBadge(kycData.status)}
                </CardTitle>
                <CardDescription>
                  {kycData.accountType === "INDIVIDUAL" ? "Individual Account" : "Organization Account"} verification
                </CardDescription>
              </div>
            </div>
            <div className="flex gap-2">
              {kycData.status === "REJECTED" && (
                <Button onClick={onResubmit} size="sm" className="bg-xred-500 hover:bg-xred-600">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Resubmit
                </Button>
              )}
              {(kycData.status === "PENDING" || kycData.status === "IN_PROGRESS") && (
                <Button onClick={onEdit} variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-600">Submitted</p>
              <p className="text-sm">{formatDate(kycData.submittedAt)}</p>
            </div>
            {kycData.reviewedAt && (
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-600">Reviewed</p>
                <p className="text-sm">{formatDate(kycData.reviewedAt)}</p>
              </div>
            )}
            {kycData.reviewedBy && (
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-600">Reviewed By</p>
                <p className="text-sm">{kycData.reviewedBy}</p>
              </div>
            )}
          </div>

          {kycData.status === "REJECTED" && kycData.rejectionReason && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start gap-2">
                <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                <div>
                  <h4 className="font-medium text-red-900">Rejection Reason</h4>
                  <p className="text-sm text-red-800 mt-1">{kycData.rejectionReason}</p>
                </div>
              </div>
            </div>
          )}

          {kycData.status === "APPROVED" && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-900">Verification Complete</h4>
                  <p className="text-sm text-green-800 mt-1">
                    Your identity has been successfully verified. You now have access to all platform features.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Account Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {kycData.accountType === "INDIVIDUAL" ? <User className="h-5 w-5" /> : <Building className="h-5 w-5" />}
            {kycData.accountType === "INDIVIDUAL" ? "Personal Information" : "Organization Information"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {kycData.accountType === "INDIVIDUAL" && kycData.individualData ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">ID Document Type</p>
                  <p className="text-sm capitalize">{kycData.individualData.idType.replace("_", " ")}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">ID Number</p>
                  <p className="text-sm font-mono">{maskSensitiveData(kycData.individualData.idNumber, 6)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Issuing Country</p>
                  <p className="text-sm">{kycData.individualData.issuingCountry}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Expiry Date</p>
                  <p className="text-sm">{kycData.individualData.expiryDate}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Occupation</p>
                  <p className="text-sm">{kycData.individualData.occupation}</p>
                </div>
              </div>
            </div>
          ) : kycData.organizationData ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Legal Name</p>
                    <p className="text-sm">{kycData.organizationData.legalName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Trading Name</p>
                    <p className="text-sm">{kycData.organizationData.tradingName || "Same as legal name"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Registration Number</p>
                    <p className="text-sm font-mono">
                      {maskSensitiveData(kycData.organizationData.registrationNumber, 6)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Tax ID</p>
                    <p className="text-sm font-mono">{maskSensitiveData(kycData.organizationData.taxId, 4)}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Incorporation Date</p>
                    <p className="text-sm">{kycData.organizationData.incorporationDate}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Country</p>
                    <p className="text-sm">{kycData.organizationData.incorporationCountry}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Business Type</p>
                    <p className="text-sm capitalize">{kycData.organizationData.businessType.replace("_", " ")}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Industry</p>
                    <p className="text-sm capitalize">{kycData.organizationData.industry}</p>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-4">Business Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Website</p>
                      <p className="text-sm">
                        {kycData.organizationData.website ? (
                          <a
                            href={kycData.organizationData.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {kycData.organizationData.website}
                          </a>
                        ) : (
                          "Not provided"
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Contact Person</p>
                      <p className="text-sm">{kycData.organizationData.contactPerson}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Contact Email</p>
                      <p className="text-sm">{kycData.organizationData.contactEmail}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Contact Phone</p>
                      <p className="text-sm">{kycData.organizationData.contactPhone}</p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-4">Address Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Registered Address</p>
                    <p className="text-sm whitespace-pre-line">{kycData.organizationData.registeredAddress}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Operating Address</p>
                    <p className="text-sm whitespace-pre-line">
                      {kycData.organizationData.operatingAddress || "Same as registered address"}
                    </p>
                  </div>
                </div>
              </div>

              <Separator />


              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Business Description</p>
                <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                  {kycData.organizationData.description}
                </p>
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>

      {/* Live Photo Verification */}
      {kycData.livePhoto && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Live Photo Verification
            </CardTitle>
            <CardDescription>Photo captured during verification process</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Image
                  src={kycData.livePhoto }
                  alt="Live verification photo"
                  width={200}
                  height={200}
                  className=" object-cover rounded-lg border-2 border-gray-200 "
                />
                <div className="absolute -top-2 -right-2">
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100 text-xs">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Live Photo Captured</p>
                <p className="text-xs text-gray-600 mb-2">
                  This photo was taken during the verification process to confirm your identity.
                </p>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View Full Size
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Live Verification Photo</DialogTitle>
                      <DialogDescription>Photo captured during KYC verification process</DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-center relative  ">
                      <Image
                        width={300}
                        height={300}
                        src={kycData.livePhoto || "/logo.jpg"}
                        alt="Live verification photo"
                        className="  rounded-lg"
                      />
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Address Verification */}
      {kycData.addressDocument && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Address Verification
            </CardTitle>
            <CardDescription>Proof of address document</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{kycData.addressDocument.type.replace("_", " ").toUpperCase()}</p>
                <p className="text-xs text-gray-600">Uploaded on {formatDate(kycData.addressDocument.uploadedAt)}</p>
                <p className="text-xs text-gray-500">{kycData.addressDocument.filename}</p>
              </div>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Supporting Documents */}
      {kycData.documents && kycData.documents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Supporting Documents
            </CardTitle>
            <CardDescription>Additional documents submitted for verification</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {kycData.documents.map((doc, index) => (
                <div key={index} className="flex items-center gap-4 p-3 border rounded-lg">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <FileText className="h-5 w-5 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{doc.type.replace("_", " ").toUpperCase()}</p>
                    <p className="text-xs text-gray-600">Uploaded on {formatDate(doc.uploadedAt)}</p>
                    <p className="text-xs text-gray-500">{doc.filename}</p>
                  </div>
                  <div className="flex gap-2">
              {/* Preview Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (doc.url) {
                    window.open(doc.url, "_blank"); // open in new tab
                  }
                }}
                disabled={!doc.url}
              >
                <Download className="h-4 w-4 mr-2" />
                Preview
              </Button>

              {/* Download Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (doc.url) {
                    const link = document.createElement("a");
                    link.href = doc.url;
                    link.download = doc.filename ?? `${doc.type}.pdf`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }
                }}
                disabled={!doc.url}
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Next Steps */}
      {kycData.status === 'PENDING' && (
        <Card>
          <CardHeader>
            <CardTitle>What&apos;s Next?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                  <span className="text-xs font-medium text-blue-600">1</span>
                </div>
                <div>
                  <p className="text-sm font-medium">Review in Progress</p>
                  <p className="text-xs text-gray-600">Our team is reviewing your submitted documents.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center mt-0.5">
                  <span className="text-xs font-medium text-gray-600">2</span>
                </div>
                <div>
                  <p className="text-sm font-medium">Verification Complete</p>
                  <p className="text-xs text-gray-600">
                    You&apos;ll receive an email notification once verification is complete.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center mt-0.5">
                  <span className="text-xs font-medium text-gray-600">3</span>
                </div>
                <div>
                  <p className="text-sm font-medium">Full Access</p>
                  <p className="text-xs text-gray-600">Access all platform features with increased limits.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
