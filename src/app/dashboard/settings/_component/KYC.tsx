// "use client"

// import { Separator } from "@/components/ui/separator"
// import { useState, useRef } from "react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Progress } from "@/components/ui/progress"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Textarea } from "@/components/ui/textarea"
// import {
//   Shield,
//   Upload,
//   CheckCircle,
//   Clock,
//   XCircle,
//   FileText,
//   User,
//   AlertTriangle,
//   Loader2,
//   Camera,
//   Building,
//   MapPin,
//   Plus,
// } from "lucide-react"
// import { useToast } from "@/hooks/use-toast"
// import Image from "next/image"

// interface KYCLevel {
//   level: number
//   title: string
//   description: string
//   status: "completed" | "in_progress" | "pending" | "not_started"
//   requirements: string[]
// }

// export default function KYCPage() {
//   const [currentLevel, setCurrentLevel] = useState(0) // Start at 0 to show "Add KYC" button
//   const [showKYCForm, setShowKYCForm] = useState(false)
//   const [accountType, setAccountType] = useState<"individual" | "organization" | "">("")
//   const [isUploading, setIsUploading] = useState<string | null>(null)
//   const [isTakingPhoto, setIsTakingPhoto] = useState(false)
//   const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null)
//   const videoRef = useRef<HTMLVideoElement>(null)
//   const canvasRef = useRef<HTMLCanvasElement>(null)
//   const { toast } = useToast()

//   const [kycLevels, setKycLevels] = useState<KYCLevel[]>([
//     {
//       level: 1,
//       title: "Basic Information",
//       description: "Account type and basic details",
//       status: "not_started",
//       requirements: ["Account type selection", "Basic profile information"],
//     },
//     {
//       level: 2,
//       title: "Identity Verification",
//       description: "Government ID or Organization documentation",
//       status: "not_started",
//       requirements: ["Identity documents", "Personal/Business information verification"],
//     },
//     {
//       level: 3,
//       title: "Proof of Life & Address",
//       description: "Live photo verification and address proof",
//       status: "not_started",
//       requirements: ["Live photo capture", "Proof of address document"],
//     },
//   ])

//   // Level 2 Individual Form Data
//   const [individualData, setIndividualData] = useState({
//     idType: "",
//     idNumber: "",
//     issuingCountry: "",
//     expiryDate: "",
//     occupation: "",
//     politicallyExposed: false,
//   })

//   // Level 2 Organization Form Data
//   const [organizationData, setOrganizationData] = useState({
//     legalName: "",
//     tradingName: "",
//     registrationNumber: "",
//     taxId: "",
//     incorporationDate: "",
//     incorporationCountry: "",
//     businessType: "",
//     industry: "",
//     website: "",
//     description: "",
//     registeredAddress: "",
//     operatingAddress: "",
//     contactPerson: "",
//     contactEmail: "",
//     contactPhone: "",
//   })

//   // Level 3 Form Data
//   const [level3Data, setLevel3Data] = useState({
//     addressType: "",
//     addressDocument: null as File | null,
//     livePhoto: null as string | null,
//   })

//   const startKYCProcess = () => {
//     setShowKYCForm(true)
//     setCurrentLevel(1)
//     setKycLevels((levels) => levels.map((l) => (l.level === 1 ? { ...l, status: "in_progress" as const } : l)))
//   }

//   const startCamera = async () => {
//     try {
//       setIsTakingPhoto(true)
//       const stream = await navigator.mediaDevices.getUserMedia({
//         video: {
//           width: 640,
//           height: 480,
//           facingMode: "user",
//         },
//       })
//       if (videoRef.current) {
//         videoRef.current.srcObject = stream
//       }
//     } catch (error) {
//       toast({
//         title: "Camera Error",
//         description: "Unable to access camera. Please check permissions.",
//         variant: "destructive",
//       })
//       setIsTakingPhoto(false)
//     }
//   }

//   const capturePhoto = () => {
//     if (videoRef.current && canvasRef.current) {
//       const canvas = canvasRef.current
//       const video = videoRef.current
//       const context = canvas.getContext("2d")

//       canvas.width = video.videoWidth
//       canvas.height = video.videoHeight

//       if (context) {
//         context.drawImage(video, 0, 0)
//         const photoData = canvas.toDataURL("image/jpeg")
//         setCapturedPhoto(photoData)
//         setLevel3Data({ ...level3Data, livePhoto: photoData })

//         // Stop camera
//         const stream = video.srcObject as MediaStream
//         stream?.getTracks().forEach((track) => track.stop())
//         setIsTakingPhoto(false)

//         toast({
//           title: "Photo captured",
//           description: "Your live photo has been captured successfully.",
//         })
//       }
//     }
//   }

//   const stopCamera = () => {
//     if (videoRef.current) {
//       const stream = videoRef.current.srcObject as MediaStream
//       stream?.getTracks().forEach((track) => track.stop())
//     }
//     setIsTakingPhoto(false)
//   }

//   const handleFileUpload = (field: string, file: File) => {
//     setIsUploading(field)
//     setTimeout(() => {
//       if (field === "addressDocument") {
//         setLevel3Data({ ...level3Data, addressDocument: file })
//       }
//       setIsUploading(null)
//       toast({
//         title: "Document uploaded",
//         description: "Your document has been uploaded successfully.",
//       })
//     }, 2000)
//   }

//   const submitLevel = (level: number) => {
//     setIsUploading(`level-${level}`)
//     setTimeout(() => {
//       setKycLevels((levels) =>
//         levels.map((l) =>
//           l.level === level
//             ? { ...l, status: "completed" as const }
//             : l.level === level + 1
//               ? { ...l, status: "in_progress" as const }
//               : l,
//         ),
//       )

//       // Update level 2 title based on account type
//       if (level === 1 && accountType) {
//         setKycLevels((levels) =>
//           levels.map((l) =>
//             l.level === 2
//               ? {
//                   ...l,
//                   title: accountType === "individual" ? "Identity Verification" : "Organization Verification",
//                   description:
//                     accountType === "individual" ? "Government ID verification" : "Organization documentation",
//                   requirements:
//                     accountType === "individual"
//                       ? ["Government-issued ID", "Personal information verification"]
//                       : ["Organization registration", "Business license", "Tax documentation"],
//                 }
//               : l,
//           ),
//         )
//       }

//       setCurrentLevel(level + 1)
//       setIsUploading(null)
//       toast({
//         title: "Level completed",
//         description: `KYC Level ${level} has been submitted for review.`,
//       })
//     }, 2000)
//   }

//   const getStatusIcon = (status: string) => {
//     switch (status) {
//       case "completed":
//         return <CheckCircle className="h-5 w-5 text-green-500" />
//       case "in_progress":
//         return <Clock className="h-5 w-5 text-yellow-500" />
//       case "pending":
//         return <AlertTriangle className="h-5 w-5 text-gray-400" />
//       default:
//         return <XCircle className="h-5 w-5 text-gray-400" />
//     }
//   }

//   const getStatusBadge = (status: string) => {
//     switch (status) {
//       case "completed":
//         return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Completed</Badge>
//       case "in_progress":
//         return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">In Progress</Badge>
//       case "pending":
//         return <Badge variant="outline">Pending</Badge>
//       default:
//         return <Badge variant="outline">Not Started</Badge>
//     }
//   }

//   const getOverallProgress = () => {
//     const completedLevels = kycLevels.filter((level) => level.status === "completed").length
//     return (completedLevels / kycLevels.length) * 100
//   }

//   // If KYC not started, show the initial state
//   if (!showKYCForm) {
//     return (
//       <div className="space-y-8">
//         {/* KYC Not Started State */}
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <Shield className="h-5 w-5" />
//               KYC Verification
//             </CardTitle>
//             <CardDescription>
//               Complete your Know Your Customer (KYC) verification to unlock full platform features and increase your
//               account limits.
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="text-center py-12">
//               <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-6">
//                 <Shield className="h-12 w-12 text-gray-400" />
//               </div>
//               <h3 className="text-xl font-semibold mb-2">Start Your KYC Verification</h3>
//               <p className="text-gray-600 mb-6 max-w-md mx-auto">
//                 Verify your identity to access premium features, higher transaction limits, and enhanced security for
//                 your account.
//               </p>

//               {/* Benefits */}
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 max-w-2xl mx-auto">
//                 <div className="p-4 bg-blue-50 rounded-lg">
//                   <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
//                     <User className="h-4 w-4 text-blue-600" />
//                   </div>
//                   <h4 className="font-medium text-sm">Level 1</h4>
//                   <p className="text-xs text-gray-600">Basic verification</p>
//                 </div>
//                 <div className="p-4 bg-green-50 rounded-lg">
//                   <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
//                     <FileText className="h-4 w-4 text-green-600" />
//                   </div>
//                   <h4 className="font-medium text-sm">Level 2</h4>
//                   <p className="text-xs text-gray-600">Identity verification</p>
//                 </div>
//                 <div className="p-4 bg-purple-50 rounded-lg">
//                   <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
//                     <Camera className="h-4 w-4 text-purple-600" />
//                   </div>
//                   <h4 className="font-medium text-sm">Level 3</h4>
//                   <p className="text-xs text-gray-600">Full verification</p>
//                 </div>
//               </div>

//               <Button onClick={startKYCProcess} size="lg"  className="bg-black text-white hover:bg-white hover:text-black disabled:bg-gray-300 disabled:cursor-not-allowed">
//                 <Plus className="h-4 w-4 mr-2" />
//                 Start KYC Verification
//               </Button>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Information Card */}
//         <Card>
//           <CardHeader>
//             <CardTitle>What You'll Need</CardTitle>
//             <CardDescription>Prepare these documents before starting your verification process.</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//               <div className="space-y-4">
//                 <h4 className="font-medium text-blue-600 flex items-center gap-2">
//                   <User className="h-4 w-4" />
//                   For Individual Accounts
//                 </h4>
//                 <ul className="space-y-3 text-sm text-gray-600">
//                   <li className="flex items-start gap-2">
//                     <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
//                     <span>Government-issued photo ID (Passport, Driver's License, National ID)</span>
//                   </li>
//                   <li className="flex items-start gap-2">
//                     <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
//                     <span>Proof of address (Utility bill, Bank statement, within 3 months)</span>
//                   </li>
//                   <li className="flex items-start gap-2">
//                     <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
//                     <span>Device with camera for live photo verification</span>
//                   </li>
//                 </ul>
//               </div>
//               <div className="space-y-4">
//                 <h4 className="font-medium text-green-600 flex items-center gap-2">
//                   <Building className="h-4 w-4" />
//                   For Organization Accounts
//                 </h4>
//                 <ul className="space-y-3 text-sm text-gray-600">
//                   <li className="flex items-start gap-2">
//                     <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
//                     <span>Certificate of Incorporation or Business Registration</span>
//                   </li>
//                   <li className="flex items-start gap-2">
//                     <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
//                     <span>Business License and Tax Registration documents</span>
//                   </li>
//                   <li className="flex items-start gap-2">
//                     <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
//                     <span>Recent bank statement and proof of business address</span>
//                   </li>
//                 </ul>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     )
//   }

//   return (
//     <div className="space-y-8">
//       {/* KYC Overview */}
//       <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2">
//             <Shield className="h-5 w-5" />
//             KYC Verification Status
//           </CardTitle>
//           <CardDescription>Complete all verification levels to unlock full platform features.</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-6">
//             {/* Progress */}
//             <div className="space-y-2">
//               <div className="flex justify-between text-sm">
//                 <span>Overall Progress</span>
//                 <span>{Math.round(getOverallProgress())}% Complete</span>
//               </div>
//               <Progress value={getOverallProgress()} className="h-3" />
//             </div>

//             {/* Level Overview */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               {kycLevels.map((level) => (
//                 <div
//                   key={level.level}
//                   className={`p-4 border rounded-lg ${
//                     level.status === "completed"
//                       ? "border-green-200 bg-green-50"
//                       : level.status === "in_progress"
//                         ? "border-yellow-200 bg-yellow-50"
//                         : "border-gray-200"
//                   }`}
//                 >
//                   <div className="flex items-center justify-between mb-2">
//                     <div className="flex items-center gap-2">
//                       {getStatusIcon(level.status)}
//                       <span className="font-medium">Level {level.level}</span>
//                     </div>
//                     {getStatusBadge(level.status)}
//                   </div>
//                   <h3 className="font-semibold mb-1">{level.title}</h3>
//                   <p className="text-sm text-gray-600 mb-2">{level.description}</p>
//                   <ul className="text-xs text-gray-500 space-y-1">
//                     {level.requirements.map((req, index) => (
//                       <li key={index}>• {req}</li>
//                     ))}
//                   </ul>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Level 1: Account Type Selection */}
//       {currentLevel >= 1 && (
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <User className="h-5 w-5" />
//               Level 1: Account Type Selection
//             </CardTitle>
//             <CardDescription>Choose whether this account represents an individual or organization.</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div
//                   className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
//                     accountType === "individual"
//                       ? "border-red-500 bg-red-50"
//                       : "border-gray-200 hover:border-gray-300"
//                   }`}
//                   onClick={() => setAccountType("individual")}
//                 >
//                   <div className="flex items-center gap-3">
//                     <User className="h-6 w-6 text-xred-500" />
//                     <div>
//                       <h3 className="font-semibold">Individual Account</h3>
//                       <p className="text-sm text-gray-600">Personal account for individual use</p>
//                       <p className="text-xs text-gray-500 mt-1">Requires government ID verification</p>
//                     </div>
//                   </div>
//                 </div>
//                 <div
//                   className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
//                     accountType === "organization"
//                       ? "border-red-500 bg-red-50"
//                       : "border-gray-200 hover:border-gray-300"
//                   }`}
//                   onClick={() => setAccountType("organization")}
//                 >
//                   <div className="flex items-center gap-3">
//                     <Building className="h-6 w-6 text-xred-500" />
//                     <div>
//                       <h3 className="font-semibold">Organization Account</h3>
//                       <p className="text-sm text-gray-600">Business or organization account</p>
//                       <p className="text-xs text-gray-500 mt-1">Requires business documentation</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {kycLevels[0].status !== "completed" && (
//                 <div className="flex justify-end">
//                   <Button
//                     onClick={() => submitLevel(1)}
//                     disabled={isUploading === "level-1" || !accountType}
//                      className="bg-black text-white hover:bg-white hover:text-black disabled:bg-gray-300 disabled:cursor-not-allowed"
//                   >
//                     {isUploading === "level-1" ? (
//                       <>
//                         <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                         Submitting...
//                       </>
//                     ) : (
//                       "Complete Level 1"
//                     )}
//                   </Button>
//                 </div>
//               )}
//             </div>
//           </CardContent>
//         </Card>
//       )}

//       {/* Level 2: Identity/Organization Verification */}
//       {currentLevel >= 2 && (
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               {accountType === "individual" ? <FileText className="h-5 w-5" /> : <Building className="h-5 w-5" />}
//               Level 2: {accountType === "individual" ? "Identity Verification" : "Organization Verification"}
//             </CardTitle>
//             <CardDescription>
//               {accountType === "individual"
//                 ? "Provide your government-issued identification and personal details."
//                 : "Provide your organization's registration and business details."}
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-6">
//               {accountType === "individual" ? (
//                 <>
//                   {/* Individual KYC Form */}
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <div className="space-y-2">
//                       <Label htmlFor="idType">ID Document Type</Label>
//                       <Select
//                         value={individualData.idType}
//                         onValueChange={(value) => setIndividualData({ ...individualData, idType: value })}
//                       >
//                         <SelectTrigger>
//                           <SelectValue placeholder="Select ID type" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           <SelectItem value="passport">Passport</SelectItem>
//                           <SelectItem value="drivers_license">Driver's License</SelectItem>
//                           <SelectItem value="national_id">National ID Card</SelectItem>
//                           <SelectItem value="state_id">State ID Card</SelectItem>
//                         </SelectContent>
//                       </Select>
//                     </div>
//                     <div className="space-y-2">
//                       <Label htmlFor="idNumber">ID Number</Label>
//                       <Input
//                         id="idNumber"
//                         value={individualData.idNumber}
//                         onChange={(e) => setIndividualData({ ...individualData, idNumber: e.target.value })}
//                         placeholder="Enter ID number"
//                       />
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <div className="space-y-2">
//                       <Label htmlFor="issuingCountry">Issuing Country</Label>
//                       <Select
//                         value={individualData.issuingCountry}
//                         onValueChange={(value) => setIndividualData({ ...individualData, issuingCountry: value })}
//                       >
//                         <SelectTrigger>
//                           <SelectValue placeholder="Select country" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           <SelectItem value="NGN">Nigeria</SelectItem>
//                           <SelectItem value="US">United States</SelectItem>
//                           <SelectItem value="CA">Canada</SelectItem>
//                           <SelectItem value="UK">United Kingdom</SelectItem>
//                           <SelectItem value="DE">Germany</SelectItem>
//                           <SelectItem value="FR">France</SelectItem>
//                           <SelectItem value="AU">Australia</SelectItem>
//                         </SelectContent>
//                       </Select>
//                     </div>
//                     <div className="space-y-2">
//                       <Label htmlFor="expiryDate">Expiry Date</Label>
//                       <Input
//                         id="expiryDate"
//                         type="date"
//                         value={individualData.expiryDate}
//                         onChange={(e) => setIndividualData({ ...individualData, expiryDate: e.target.value })}
//                       />
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <div className="space-y-2">
//                       <Label htmlFor="occupation">Occupation</Label>
//                       <Input
//                         id="occupation"
//                         value={individualData.occupation}
//                         onChange={(e) => setIndividualData({ ...individualData, occupation: e.target.value })}
//                         placeholder="Your profession"
//                       />
//                     </div>
//                   </div>


//                   {/* ID Document Upload */}
//                   <div className="space-y-4">
//                     <h4 className="font-medium">Upload ID Document</h4>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <div className="space-y-2">
//                         <Label>Front Side</Label>
//                         <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
//                           <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
//                           <p className="text-sm text-gray-600">Upload front side of ID</p>
//                           <Input type="file" accept="image/*" className="mt-2" />
//                         </div>
//                       </div>
//                       <div className="space-y-2">
//                         <Label>Back Side</Label>
//                         <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
//                           <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
//                           <p className="text-sm text-gray-600">Upload back side of ID</p>
//                           <Input type="file" accept="image/*" className="mt-2" />
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </>
//               ) : (
//                 <>
//                   {/* Organization KYC Form */}
//                   <div className="space-y-4 max-h-[7">
//                     <h4 className="font-medium text-lg">Organization Details</h4>

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                       <div className="space-y-2">
//                         <Label htmlFor="legalName">Legal Name</Label>
//                         <Input
//                           id="legalName"
//                           value={organizationData.legalName}
//                           onChange={(e) => setOrganizationData({ ...organizationData, legalName: e.target.value })}
//                           placeholder="Official registered name"
//                         />
//                       </div>
//                       <div className="space-y-2">
//                         <Label htmlFor="tradingName">Trading Name (if different)</Label>
//                         <Input
//                           id="tradingName"
//                           value={organizationData.tradingName}
//                           onChange={(e) => setOrganizationData({ ...organizationData, tradingName: e.target.value })}
//                           placeholder="Business/brand name"
//                         />
//                       </div>
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                       <div className="space-y-2">
//                         <Label htmlFor="registrationNumber">Registration Number</Label>
//                         <Input
//                           id="registrationNumber"
//                           value={organizationData.registrationNumber}
//                           onChange={(e) =>
//                             setOrganizationData({ ...organizationData, registrationNumber: e.target.value })
//                           }
//                           placeholder="Company registration number"
//                         />
//                       </div>
//                       <div className="space-y-2">
//                         <Label htmlFor="taxId">Tax ID / EIN</Label>
//                         <Input
//                           id="taxId"
//                           value={organizationData.taxId}
//                           onChange={(e) => setOrganizationData({ ...organizationData, taxId: e.target.value })}
//                           placeholder="Tax identification number"
//                         />
//                       </div>
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                       <div className="space-y-2">
//                         <Label htmlFor="incorporationDate">Incorporation Date</Label>
//                         <Input
//                           id="incorporationDate"
//                           type="date"
//                           value={organizationData.incorporationDate}
//                           onChange={(e) =>
//                             setOrganizationData({ ...organizationData, incorporationDate: e.target.value })
//                           }
//                         />
//                       </div>
//                       <div className="space-y-2">
//                         <Label htmlFor="incorporationCountry">Country of Incorporation</Label>
//                         <Select
//                           value={organizationData.incorporationCountry}
//                           onValueChange={(value) =>
//                             setOrganizationData({ ...organizationData, incorporationCountry: value })
//                           }
//                         >
//                           <SelectTrigger>
//                             <SelectValue placeholder="Select country" />
//                           </SelectTrigger>
//                           <SelectContent>
//                             <SelectItem value="NGN">Nigeria</SelectItem>
//                             <SelectItem value="US">United States</SelectItem>
//                             <SelectItem value="CA">Canada</SelectItem>
//                             <SelectItem value="UK">United Kingdom</SelectItem>
//                             <SelectItem value="DE">Germany</SelectItem>
//                             <SelectItem value="FR">France</SelectItem>
//                             <SelectItem value="AU">Australia</SelectItem>
//                           </SelectContent>
//                         </Select>
//                       </div>
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                       <div className="space-y-2">
//                         <Label htmlFor="businessType">Business Type</Label>
//                         <Select
//                           value={organizationData.businessType}
//                           onValueChange={(value) => setOrganizationData({ ...organizationData, businessType: value })}
//                         >
//                           <SelectTrigger>
//                             <SelectValue placeholder="Select business type" />
//                           </SelectTrigger>
//                           <SelectContent>
//                             <SelectItem value="corporation">Corporation</SelectItem>
//                             <SelectItem value="llc">LLC</SelectItem>
//                             <SelectItem value="partnership">Partnership</SelectItem>
//                             <SelectItem value="sole_proprietorship">Sole Proprietorship</SelectItem>
//                             <SelectItem value="nonprofit">Non-profit</SelectItem>
//                             <SelectItem value="government">Government Entity</SelectItem>
//                           </SelectContent>
//                         </Select>
//                       </div>
//                       <div className="space-y-2">
//                         <Label htmlFor="industry">Industry</Label>
//                         <Select
//                           value={organizationData.industry}
//                           onValueChange={(value) => setOrganizationData({ ...organizationData, industry: value })}
//                         >
//                           <SelectTrigger>
//                             <SelectValue placeholder="Select industry" />
//                           </SelectTrigger>
//                           <SelectContent>
//                             <SelectItem value="technology">Technology</SelectItem>
//                             <SelectItem value="finance">Finance</SelectItem>
//                             <SelectItem value="healthcare">Healthcare</SelectItem>
//                             <SelectItem value="education">Education</SelectItem>
//                             <SelectItem value="retail">Retail</SelectItem>
//                             <SelectItem value="manufacturing">Manufacturing</SelectItem>
//                             <SelectItem value="other">Other</SelectItem>
//                           </SelectContent>
//                         </Select>
//                       </div>
//                     </div>

      

//                     <div className="space-y-2">
//                       <Label htmlFor="website">Company Website</Label>
//                       <Input
//                         id="website"
//                         value={organizationData.website}
//                         onChange={(e) => setOrganizationData({ ...organizationData, website: e.target.value })}
//                         placeholder="https://example.com"
//                       />
//                     </div>

//                     <div className="space-y-2">
//                       <Label htmlFor="description">Business Description</Label>
//                       <Textarea
//                         id="description"
//                         value={organizationData.description}
//                         onChange={(e) => setOrganizationData({ ...organizationData, description: e.target.value })}
//                         placeholder="Describe your business activities and services"
//                         rows={3}
//                       />
//                     </div>

//                     <Separator />

//                     <h4 className="font-medium text-lg">Contact Information</h4>

//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                       <div className="space-y-2">
//                         <Label htmlFor="contactPerson">Contact Person</Label>
//                         <Input
//                           id="contactPerson"
//                           value={organizationData.contactPerson}
//                           onChange={(e) => setOrganizationData({ ...organizationData, contactPerson: e.target.value })}
//                           placeholder="Full name"
//                         />
//                       </div>
//                       <div className="space-y-2">
//                         <Label htmlFor="contactEmail">Contact Email</Label>
//                         <Input
//                           id="contactEmail"
//                           type="email"
//                           value={organizationData.contactEmail}
//                           onChange={(e) => setOrganizationData({ ...organizationData, contactEmail: e.target.value })}
//                           placeholder="contact@company.com"
//                         />
//                       </div>
//                       <div className="space-y-2">
//                         <Label htmlFor="contactPhone">Contact Phone</Label>
//                         <Input
//                           id="contactPhone"
//                           value={organizationData.contactPhone}
//                           onChange={(e) => setOrganizationData({ ...organizationData, contactPhone: e.target.value })}
//                           placeholder="+1 (555) 123-4567"
//                         />
//                       </div>
//                     </div>

//                     <Separator />

//                     <h4 className="font-medium text-lg">Address Information</h4>

//                     <div className="space-y-4">
//                       <div className="space-y-2">
//                         <Label htmlFor="registeredAddress">Registered Address</Label>
//                         <Textarea
//                           id="registeredAddress"
//                           value={organizationData.registeredAddress}
//                           onChange={(e) =>
//                             setOrganizationData({ ...organizationData, registeredAddress: e.target.value })
//                           }
//                           placeholder="Full registered address"
//                           rows={2}
//                         />
//                       </div>
//                       <div className="space-y-2">
//                         <Label htmlFor="operatingAddress">Operating Address (if different)</Label>
//                         <Textarea
//                           id="operatingAddress"
//                           value={organizationData.operatingAddress}
//                           onChange={(e) =>
//                             setOrganizationData({ ...organizationData, operatingAddress: e.target.value })
//                           }
//                           placeholder="Full operating address"
//                           rows={2}
//                         />
//                       </div>
//                     </div>

//                     <Separator />

                   

//                     {/* Document Upload for Organization */}
//                     <div className="space-y-4">
//                       <h4 className="font-medium">Required Documents</h4>
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         <div className="space-y-2">
//                           <Label>Certificate of Incorporation</Label>
//                           <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
//                             <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
//                             <p className="text-sm text-gray-600">Upload incorporation certificate</p>
//                             <Input type="file" accept=".pdf,.jpg,.jpeg,.png" className="mt-2" />
//                           </div>
//                         </div>
//                         <div className="space-y-2">
//                           <Label>Business License</Label>
//                           <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
//                             <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
//                             <p className="text-sm text-gray-600">Upload business license</p>
//                             <Input type="file" accept=".pdf,.jpg,.jpeg,.png" className="mt-2" />
//                           </div>
//                         </div>
                        
//                       </div>
//                     </div>
//                   </div>
//                 </>
//               )}

//               {kycLevels[1].status !== "completed" && (
//                 <div className="flex justify-end">
//                   <Button
//                     onClick={() => submitLevel(2)}
//                     disabled={isUploading === "level-2"}
//                     className="bg-black text-white hover:bg-white hover:text-black disabled:bg-gray-300 disabled:cursor-not-allowed"
//                   >
//                     {isUploading === "level-2" ? (
//                       <>
//                         <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                         Submitting...
//                       </>
//                     ) : (
//                       "Complete Level 2"
//                     )}
//                   </Button>
//                 </div>
//               )}
//             </div>
//           </CardContent>
//         </Card>
//       )}

//       {/* Level 3: Proof of Life & Address */}
//       {currentLevel >= 3 && (
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <Camera className="h-5 w-5" />
//               Level 3: Proof of Life & Address Verification
//             </CardTitle>
//             <CardDescription>Take a live photo and upload proof of address document.</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-8">
//               {/* Live Photo Capture */}
//               <div className="space-y-4">
//                 <h4 className="font-medium text-lg flex items-center gap-2">
//                   <Camera className="h-5 w-5" />
//                   Live Photo Verification
//                 </h4>
//                 <p className="text-sm text-gray-600">
//                   Take a live photo using your device camera. This helps us verify your identity and prevent fraud.
//                 </p>

//                 <div className="border rounded-lg p-6">
//                   {!isTakingPhoto && !capturedPhoto && (
//                     <div className="text-center space-y-4">
//                       <div className="w-32 h-32 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
//                         <Camera className="h-12 w-12 text-gray-400" />
//                       </div>
//                       <div>
//                         <h5 className="font-medium mb-2">Ready to take your photo?</h5>
//                         <p className="text-sm text-gray-600 mb-4">
//                           Make sure you're in a well-lit area and looking directly at the camera.
//                         </p>
//                         <Button onClick={startCamera}  className="bg-black text-white hover:bg-white hover:text-black disabled:bg-gray-300 disabled:cursor-not-allowed">
//                           <Camera className="h-4 w-4 mr-2" />
//                           Start Camera
//                         </Button>
//                       </div>
//                     </div>
//                   )}

//                   {isTakingPhoto && (
//                     <div className="space-y-4">
//                       <div className="relative">
//                         <video ref={videoRef} autoPlay playsInline className="w-full max-w-md mx-auto rounded-lg" />
//                         <canvas ref={canvasRef} className="hidden" />
//                       </div>
//                       <div className="flex justify-center gap-4">
//                         <Button onClick={capturePhoto}  className="bg-black text-white hover:bg-white hover:text-black disabled:bg-gray-300 disabled:cursor-not-allowed">
//                           <Camera className="h-4 w-4 mr-2" />
//                           Capture Photo
//                         </Button>
//                         <Button onClick={stopCamera} variant="outline">
//                           Cancel
//                         </Button>
//                       </div>
//                       <div className="text-center">
//                         <p className="text-sm text-gray-600">
//                           Position your face in the center and click "Capture Photo"
//                         </p>
//                       </div>
//                     </div>
//                   )}

//                   {capturedPhoto && (
//                     <div className="text-center space-y-4">
//                       <div className="relative inline-block">
//                         <div className="relative w-48 h-48 ">
//                         <Image
//                           src={capturedPhoto || "/placeholder.svg"}
//                           alt="Captured photo"
//                           fill
//                           className="object-cover rounded-lg mx-auto absolute"
//                         />
//                         </div>
//                         <div className="absolute top-2 right-2">
//                           <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
//                             <CheckCircle className="h-3 w-3 mr-1" />
//                             Captured
//                           </Badge>
//                         </div>
//                       </div>
//                       <div>
//                         <p className="text-sm text-gray-600 mb-4">
//                           Photo captured successfully! You can retake if needed.
//                         </p>
//                         <Button
//                           onClick={() => {
//                             setCapturedPhoto(null)
//                             setLevel3Data({ ...level3Data, livePhoto: null })
//                           }}
//                           variant="outline"
//                             className="bg-black text-white hover:bg-white hover:text-black disabled:bg-gray-300 disabled:cursor-not-allowed"
//                         >
//                           Retake Photo
//                         </Button>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* Address Document Upload */}
//               <div className="space-y-4">
//                 <h4 className="font-medium text-lg flex items-center gap-2">
//                   <MapPin className="h-5 w-5" />
//                   Proof of Address
//                 </h4>
//                 <p className="text-sm text-gray-600">
//                   Upload a recent document that shows your current address (within the last 3 months).
//                 </p>

//                 <div className="space-y-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="addressType">Document Type</Label>
//                     <Select
//                       value={level3Data.addressType}
//                       onValueChange={(value) => setLevel3Data({ ...level3Data, addressType: value })}
//                     >
//                       <SelectTrigger>
//                         <SelectValue placeholder="Select document type" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="utility_bill">Utility Bill (Electric, Gas, Water)</SelectItem>
//                         <SelectItem value="bank_statement">Bank Statement</SelectItem>
//                         <SelectItem value="lease_agreement">Lease Agreement</SelectItem>
//                         <SelectItem value="mortgage_statement">Mortgage Statement</SelectItem>
//                         <SelectItem value="insurance_statement">Insurance Statement</SelectItem>
//                         <SelectItem value="government_letter">Government Letter</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>

//                   <div className="space-y-2">
//                     <Label>Upload Document</Label>
//                     <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
//                       {level3Data.addressDocument ? (
//                         <div className="space-y-2">
//                           <FileText className="h-8 w-8 mx-auto text-green-500" />
//                           <p className="text-sm font-medium">{level3Data.addressDocument.name}</p>
//                           <p className="text-xs text-gray-500">
//                             {(level3Data.addressDocument.size / 1024 / 1024).toFixed(2)} MB
//                           </p>
//                           <Button
//                             variant="outline"
//                             size="sm"
//                             onClick={() => setLevel3Data({ ...level3Data, addressDocument: null })}
//                           >
//                             Remove
//                           </Button>
//                         </div>
//                       ) : (
//                         <div className="space-y-2">
//                           <Upload className="h-8 w-8 mx-auto text-gray-400" />
//                           <p className="text-sm text-gray-600">Drag and drop your document here, or click to browse</p>
//                           <Input
//                             type="file"
//                             accept=".pdf,.jpg,.jpeg,.png"
//                             onChange={(e) => {
//                               const file = e.target.files?.[0]
//                               if (file) {
//                                 handleFileUpload("addressDocument", file)
//                               }
//                             }}
//                             className="mt-2"
//                           />
//                           <p className="text-xs text-gray-500">Supported formats: PDF, JPG, PNG. Max size: 10MB</p>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Requirements Checklist */}
//               <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
//                 <h5 className="font-medium text-blue-900 mb-3">Document Requirements</h5>
//                 <ul className="space-y-2 text-sm text-blue-800">
//                   <li className="flex items-center gap-2">
//                     <CheckCircle className="h-4 w-4 text-blue-600" />
//                     Document must be issued within the last 3 months
//                   </li>
//                   <li className="flex items-center gap-2">
//                     <CheckCircle className="h-4 w-4 text-blue-600" />
//                     Your full name must be clearly visible
//                   </li>
//                   <li className="flex items-center gap-2">
//                     <CheckCircle className="h-4 w-4 text-blue-600" />
//                     Complete address must be shown
//                   </li>
//                   <li className="flex items-center gap-2">
//                     <CheckCircle className="h-4 w-4 text-blue-600" />
//                     Document must be clear and readable
//                   </li>
//                   <li className="flex items-center gap-2">
//                     <CheckCircle className="h-4 w-4 text-blue-600" />
//                     All four corners of the document must be visible
//                   </li>
//                 </ul>
//               </div>

//               {kycLevels[2].status !== "completed" && (
//                 <div className="flex justify-end">
//                   <Button
//                     onClick={() => submitLevel(3)}
//                     disabled={isUploading === "level-3" || !capturedPhoto || !level3Data.addressDocument}
//                     className="bg-black text-white hover:bg-white hover:text-black disabled:bg-gray-300 disabled:cursor-not-allowed"
//                   >
//                     {isUploading === "level-3" ? (
//                       <>
//                         <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                         Submitting...
//                       </>
//                     ) : (
//                       "Complete Level 3"
//                     )}
//                   </Button>
//                 </div>
//               )}
//             </div>
//           </CardContent>
//         </Card>
//       )}

//       {/* Verification Tips */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Verification Tips</CardTitle>
//           <CardDescription>Follow these guidelines to ensure quick approval of your verification.</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//             <div className="space-y-4">
//               <h4 className="font-medium text-green-600 flex items-center gap-2">
//                 <CheckCircle className="h-4 w-4" />
//                 Best Practices
//               </h4>
//               <ul className="space-y-3 text-sm text-gray-600">
//                 <li className="flex items-start gap-2">
//                   <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
//                   <span>Ensure all documents are clear, high-resolution, and well-lit</span>
//                 </li>
//                 <li className="flex items-start gap-2">
//                   <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
//                   <span>Use recent documents (within 3 months for address proof)</span>
//                 </li>
//                 <li className="flex items-start gap-2">
//                   <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
//                   <span>Make sure your name matches exactly across all documents</span>
//                 </li>
//                 <li className="flex items-start gap-2">
//                   <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
//                   <span>Capture all four corners of documents in photos</span>
//                 </li>
//                 <li className="flex items-start gap-2">
//                   <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
//                   <span>Take live photos in good lighting conditions</span>
//                 </li>
//               </ul>
//             </div>
//             <div className="space-y-4">
//               <h4 className="font-medium text-red-600 flex items-center gap-2">
//                 <XCircle className="h-4 w-4" />
//                 Common Mistakes
//               </h4>
//               <ul className="space-y-3 text-sm text-gray-600">
//                 <li className="flex items-start gap-2">
//                   <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
//                   <span>Submitting blurry, dark, or low-quality images</span>
//                 </li>
//                 <li className="flex items-start gap-2">
//                   <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
//                   <span>Using expired or outdated documents</span>
//                 </li>
//                 <li className="flex items-start gap-2">
//                   <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
//                   <span>Covering parts of documents with fingers or objects</span>
//                 </li>
//                 <li className="flex items-start gap-2">
//                   <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
//                   <span>Submitting screenshots instead of original photos</span>
//                 </li>
//                 <li className="flex items-start gap-2">
//                   <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
//                   <span>Using documents with different names or spellings</span>
//                 </li>
//               </ul>
//             </div>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }





"use client"

import { useState, useRef, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { useUser } from "@clerk/nextjs"
import Image from "next/image"
import {
  Shield,
  Upload,
  CheckCircle,
  Clock,
  XCircle,
  FileText,
  User,
  AlertTriangle,
  Loader2,
  Camera,
  Building,
  MapPin,
  Plus,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { KYCAccountType, KYCStatus } from "@prisma/client"
import { getKYCStatus, startKYCProcess, submitKYCLevel2, submitKYCLevel3 } from "@/actions/kyc/kyc"
import { FileUpload } from "@/components/file-upload"
import { useUploadThing } from "@/lib/uploadthing"
import Loader from "@/components/Loader"
import { KYCDetailsView } from "./kyc-details-view"
import { transformKYCData } from "./transformKYCData"


interface KYCLevel {
  level: number
  title: string
  description: string
  status: KYCStatus
  requirements: string[]
}

interface KYCData {
  accountType: KYCAccountType | ""
  individualData: {
    idType: string
    idNumber: string
    issuingCountry: string
    expiryDate: string
    occupation: string
    politicallyExposed: boolean
    idFront?: string
    idBack?: string
  }
  organizationData: {
    legalName: string
    tradingName: string
    registrationNumber: string
    taxId: string
    incorporationDate: string
    incorporationCountry: string
    businessType: string
    industry: string
    website: string
    description: string
    registeredAddress: string
    operatingAddress: string
    contactPerson: string
    contactEmail: string
    contactPhone: string
    registrationDoc?: string
    licenseDoc?: string
  }
  level3Data: {
    addressType: string
    addressDocument?: string
    livePhoto?: string
  }
  currentLevel: number
  kycLevels: KYCLevel[]
}

export default function KYCPage() {
  const { user } = useUser()
  const { toast } = useToast()
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const [isLoading, setIsLoading] = useState(true)
  const [currentLevel, setCurrentLevel] = useState(0)
  const [accountType, setAccountType] = useState<KYCAccountType | "">("")
  const [isUploading, setIsUploading] = useState<string | null>(null)
  const [isTakingPhoto, setIsTakingPhoto] = useState(false)
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null)
  const [kycStatus, setKycStatus] = useState<any>(null)

  const [kycLevels, setKycLevels] = useState<KYCLevel[]>([
    {
      level: 1,
      title: "Basic Information",
      description: "Account type and basic details",
      status: KYCStatus.PENDING,
      requirements: ["Account type selection", "Basic profile information"],
    },
    {
      level: 2,
      title: "Identity Verification",
      description: "Government ID or Organization documentation",
      status: KYCStatus.PENDING,
      requirements: ["Identity documents", "Personal/Business information verification"],
    },
    {
      level: 3,
      title: "Proof of Life & Address",
      description: "Live photo verification and address proof",
      status: KYCStatus.PENDING,
      requirements: ["Live photo capture", "Proof of address document"],
    },
  ])

  // Level 2 Individual Form Data
  const [individualData, setIndividualData] = useState({
    idType: "",
    idNumber: "",
    issuingCountry: "",
    expiryDate: "",
    occupation: "",
    SenderName: "",
    politicallyExposed: false,
    idFront: null as File | null,
    idBack: null as File | null,
  })

  // Level 2 Organization Form Data
  const [organizationData, setOrganizationData] = useState({
    legalName: "",
    tradingName: "",
    registrationNumber: "",
    taxId: "",
    incorporationDate: "",
    incorporationCountry: "",
    businessType: "",
    industry: "",
    website: "",
    SenderName: "",
    description: "",
    registeredAddress: "",
    operatingAddress: "",
    contactPerson: "",
    contactEmail: "",
    contactPhone: "",
    registrationDoc:  null as File | null,
    licenseDoc:  null as File | null,
  })

  // Level 3 Form Data
  const [level3Data, setLevel3Data] = useState({
    addressType: "",
    addressDocument: null as File | null,
    addressUploadResult: null as { url: string; key: string } | null,
    livePhoto:""
  });

  //   // UploadThing hooks
  const { startUpload: uploadIdDocuments, isUploading: isUploadingIds } = useUploadThing("kycDocument");
  const { startUpload: uploadAddressProof, isUploading: isUploadingAddress } = useUploadThing("kycDocument");

useEffect(() => {
  const fetchKYCStatus = async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    try {
      const response = await getKYCStatus();
      if (response.success && response.data) {
        const data = response.data;
        setKycStatus(data);
        console.log(kycStatus, 'kyc status data')
        // Set account type if exists
        if (data.accountType) {
          setAccountType(data.accountType);
        }

        // Safely parse levels JSON or use default empty object
        const levels = typeof data.levels === 'string' 
          ? JSON.parse(data.levels) 
          : data.levels || {};

        // Set current level based on status with null checks
        if (levels.level3?.status === KYCStatus.COMPLETED) {
          setCurrentLevel(4);
        } else if (levels.level2?.status === KYCStatus.COMPLETED) {
          setCurrentLevel(3);
        } else if (levels.level1?.status === KYCStatus.COMPLETED) {
          setCurrentLevel(2);
        } else {
          setCurrentLevel(1);
        }

        // Update level statuses with type safety
        const updatedLevels = [...kycLevels];
        if (levels.level1?.status) {
          updatedLevels[0].status = levels.level1.status;
        }
        if (levels.level2?.status) {
          updatedLevels[1].status = levels.level2.status;
          // Update title based on account type
          if (data.accountType === 'INDIVIDUAL') {
            updatedLevels[1].title = "Identity Verification";
            updatedLevels[1].description = "Government ID verification";
            updatedLevels[1].requirements = [
              "Government-issued ID", 
              "Personal information verification"
            ];
          } else {
            updatedLevels[1].title = "Organization Verification";
            updatedLevels[1].description = "Organization documentation";
            updatedLevels[1].requirements = [
              "Organization registration", 
              "Business license", 
              "Tax documentation"
            ];
          }
        }
        if (levels.level3?.status) {
          updatedLevels[2].status = levels.level3.status;
        }
        setKycLevels(updatedLevels);

        // Set form data if exists with type checking
        if (levels.level2?.data) {
          if (data.accountType === "INDIVIDUAL") {
            setIndividualData(prev => ({
              ...prev,
              ...(typeof levels.level2.data === 'object' ? levels.level2.data : {})
            }));
          } else {
            setOrganizationData(prev => ({
              ...prev,
              ...(typeof levels.level2.data === 'object' ? levels.level2.data : {})
            }));
          }
        }

        // Set level 3 data if exists
        if (levels.level3?.data && typeof levels.level3.data === 'object') {
          setLevel3Data(prev => ({
            ...prev,
            addressType: 'addressType' in levels.level3.data 
              ? levels.level3.data.addressType 
              : ""
          }));
        }

        // Set captured photo if exists
        if (data.livePhoto) {
          setCapturedPhoto(data.livePhoto);
          setLevel3Data(prev => ({ 
            ...prev, 
            livePhoto: data.livePhoto || '' 
          }));
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load KYC status",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  fetchKYCStatus();
}, [user?.id, kycLevels, kycStatus, ]);

const handleStartKYC = async ( accountType:KYCAccountType) => {
  // 1. Early return with user feedback if requirements not met
  if (!user?.id) {
    toast({
      title: "Error",
      description: "You must be logged in",
      variant: "destructive",
    });
    return;
  }

  if (!accountType) {
    toast({
      title: "Selection Required",
      description: "Please select Individual or Organization account type",
      variant: "destructive",
    });
    return;
  }

  try {
    setIsUploading("level-1");
    
    // 2. Type is now properly narrowed to KYCAccountType
    const result = await startKYCProcess(accountType, user.id);

    // 3. Handle response
    if (!result.success) {
      throw new Error(result.error || "Failed to start KYC");
    }

    // 4. Update state
    setCurrentLevel(2);
    setKycLevels(levels => levels.map(l => 
      l.level === 1 ? { ...l, status: KYCStatus.COMPLETED } : 
      l.level === 2 ? { ...l, status: KYCStatus.IN_PROGRESS } : l
    ));
    
    toast({
      title: "Success",
      description: "KYC process started successfully",
    });
  } catch (error) {
    toast({
      title: "Error",
      description: error instanceof Error ? error.message : "KYC process failed",
      variant: "destructive",
    });
  } finally {
    setIsUploading(null);
  }
}

const submitLevel2 = async () => {
  if (!user?.id || !accountType) return;

  try {
    setIsUploading("level-2");

    // Helper function to generate standardized filenames
    const generateFilename = (file: File, docType: string) => {
      const ext = file.name.split('.').pop() || '';
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      return `${docType}_${timestamp}.${ext}`.toLowerCase();
    };

    let doc1Url = "";
    let doc1Key = "";
    let doc2Url = "";
    let doc2Key = "";

    if (accountType === KYCAccountType.INDIVIDUAL) {
      if (!individualData.idFront || !individualData.idBack) {
        throw new Error("Please upload both ID documents");
      }

      const frontFilename = generateFilename(individualData.idFront, 'idfront');
      const backFilename = generateFilename(individualData.idBack, 'idback');

      const frontFile = new File([individualData.idFront], frontFilename, { 
        type: individualData.idFront.type 
      });
      const backFile = new File([individualData.idBack], backFilename, { 
        type: individualData.idBack.type 
      });

      const uploadResults = await uploadIdDocuments([frontFile, backFile]);

      if (!uploadResults || uploadResults.length < 2) {
        throw new Error("Failed to upload ID documents");
      }

      [doc1Url, doc1Key] = [uploadResults[0].url, uploadResults[0].key];
      [doc2Url, doc2Key] = [uploadResults[1].url, uploadResults[1].key];

    } else { // ORGANIZATION
      if (!organizationData.registrationDoc || !organizationData.licenseDoc) {
        throw new Error("Please upload both business documents");
      }

      const registrationFilename = generateFilename(
        organizationData.registrationDoc,
        'registrationdoc'
      );
      const licenseFilename = generateFilename(
        organizationData.licenseDoc,
        'licensedoc'
      );

      const registrationFile = new File(
        [organizationData.registrationDoc],
        registrationFilename,
        { type: organizationData.registrationDoc.type }
      );
      const licenseFile = new File(
        [organizationData.licenseDoc],
        licenseFilename,
        { type: organizationData.licenseDoc.type }
      );

      const uploadResults = await uploadIdDocuments([registrationFile, licenseFile]);

      if (!uploadResults || uploadResults.length < 2) {
        throw new Error("Failed to upload business documents");
      }

      [doc1Url, doc1Key] = [uploadResults[0].url, uploadResults[0].key];
      [doc2Url, doc2Key] = [uploadResults[1].url, uploadResults[1].key];
    }

    // Prepare form data
    const formData = new FormData();

    if (accountType === KYCAccountType.INDIVIDUAL) {
      formData.append("idType", individualData.idType);
      formData.append("idNumber", individualData.idNumber);
      formData.append("issuingCountry", individualData.issuingCountry);
      formData.append("expiryDate", individualData.expiryDate);
      formData.append("occupation", individualData.occupation);
      formData.append("senderName", individualData.SenderName);
      formData.append("idFrontUrl", doc1Url);
      formData.append("idFrontKey", doc1Key);
      formData.append("idBackUrl", doc2Url);
      formData.append("idBackKey", doc2Key);
    } else {
      formData.append("legalName", organizationData.legalName);
      formData.append("tradingName", organizationData.tradingName);
      formData.append("registrationNumber", organizationData.registrationNumber);
      formData.append("taxId", organizationData.taxId);
      formData.append("incorporationDate", organizationData.incorporationDate);
      formData.append("incorporationCountry", organizationData.incorporationCountry);
      formData.append("businessType", organizationData.businessType);
      formData.append("industry", organizationData.industry);
      formData.append("website", organizationData.website);
      formData.append("senderName", organizationData.SenderName);
      formData.append("description", organizationData.description);
      formData.append("registeredAddress", organizationData.registeredAddress);
      formData.append("operatingAddress", organizationData.operatingAddress);
      formData.append("contactPerson", organizationData.contactPerson);
      formData.append("contactEmail", organizationData.contactEmail);
      formData.append("contactPhone", organizationData.contactPhone);
      formData.append("registrationDocUrl", doc1Url);
      formData.append("registrationDocKey", doc1Key);
      formData.append("licenseDocUrl", doc2Url);
      formData.append("licenseDocKey", doc2Key);
    }

    const response = await submitKYCLevel2(formData, accountType);

    if (response.success) {
      setCurrentLevel(3);
      setKycLevels(levels => levels.map(l => 
        l.level === 2 ? { ...l, status: KYCStatus.COMPLETED } : 
        l.level === 3 ? { ...l, status: KYCStatus.IN_PROGRESS } : l
      ));
      
      toast({
        title: "Success",
        description: "Level 2 submitted successfully",
      });
    } else {
      throw new Error(response.error || "Failed to submit Level 2");
    }
  } catch (error) {
    toast({
      title: "Error",
      description: error instanceof Error ? error.message : "Failed to submit Level 2",
      variant: "destructive",
    });
  } finally {
    setIsUploading(null);
  }
};

  const submitLevel3 = async () => {
    if (!user?.id || !level3Data.addressDocument || !capturedPhoto) return
    
    try {
      setIsUploading("level-3")

      const uploadResults = await uploadAddressProof([level3Data.addressDocument]);
      
      if (!uploadResults?.[0]?.url) {
        throw new Error("Address proof upload failed");
      }

      const response = await submitKYCLevel3(
        capturedPhoto,
        uploadResults[0].url,
        uploadResults[0].key,
        level3Data.addressType
      );
      
      
      if (response.success) {
        setCurrentLevel(4)
        setKycLevels(levels => levels.map(l => 
          l.level === 3 ? { ...l, status: KYCStatus.COMPLETED } : l
        ))
        
        toast({
          title: "Success",
          description: "KYC verification completed successfully!",
        })
      } else {
        throw new Error(response.error || "Failed to complete KYC verification")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to complete KYC verification",
        variant: "destructive",
      })
    } finally {
      setIsUploading(null)
    }
  }

  const startCamera = async () => {
    try {
      setIsTakingPhoto(true)
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: 640,
          height: 480,
          facingMode: "user",
        },
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (error) {
      toast({
        title: "Camera Error",
        description: "Unable to access camera. Please check permissions.",
        variant: "destructive",
      })
      setIsTakingPhoto(false)
    }
  }

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current
      const video = videoRef.current
      const context = canvas.getContext("2d")

      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      if (context) {
        context.drawImage(video, 0, 0)
        const photoData = canvas.toDataURL("image/jpeg")
        setCapturedPhoto(photoData)
        setLevel3Data({ ...level3Data, livePhoto: photoData })

        // Stop camera
        const stream = video.srcObject as MediaStream
        stream?.getTracks().forEach(track => track.stop())
        setIsTakingPhoto(false)

        toast({
          title: "Photo captured",
          description: "Your live photo has been captured successfully.",
        })
      }
    }
  }

  const stopCamera = () => {
    if (videoRef.current) {
      const stream = videoRef.current.srcObject as MediaStream
      stream?.getTracks().forEach(track => track.stop())
    }
    setIsTakingPhoto(false)
  }


  const getStatusIcon = (status: string) => {
    switch (status) {
       case KYCStatus.COMPLETED:
        return <CheckCircle className="h-5 w-5 text-green-500" />
       case KYCStatus.IN_PROGRESS:
        return <Clock className="h-5 w-5 text-yellow-500" />
      case KYCStatus.PENDING:
        return <AlertTriangle className="h-5 w-5 text-gray-400" />
      default:
        return <XCircle className="h-5 w-5 text-gray-400" />
    }
  }

  const getStatusBadge = (status: KYCStatus) => {
    switch (status) {
      case KYCStatus.COMPLETED:
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Completed</Badge>
      case KYCStatus.IN_PROGRESS:
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">In Progress</Badge>
      case KYCStatus.PENDING:
        return <Badge variant="outline">Pending</Badge>
      default:
        return <Badge variant="outline">Not Started</Badge>
    }
  }

  const getOverallProgress = () => {
    const completedLevels = kycLevels.filter(level => level.status === KYCStatus.COMPLETED).length
    return (completedLevels / kycLevels.length) * 100
  }



    const handleAddressDocumentUpload = async (file: File) => {
    try {
      const uploadResults = await uploadAddressProof([file]);
      
      if (!uploadResults?.[0]?.url) {
        throw new Error("Address proof upload failed");
      }

      setLevel3Data({
        ...level3Data,
        addressDocument: file,
        addressUploadResult: {
          url: uploadResults[0].url,
          key: uploadResults[0].key,
        },
      });

      // toast.success("Your address proof has been uploaded successfully.");
    } catch (error) {
      // toast.error(error instanceof Error? error.message : "Failed to upload document");
    }
  };

  const handleFileInputChange = (field: "idFront" | "idBack", file: File | null) => {
    setIndividualData({
      ...individualData,
      [field]: file,
    });
  };

  const handleOrganizationFileInputChange = (field: "registrationDoc" | "licenseDoc", file: File | null) => {
    setOrganizationData({
      ...organizationData,
      [field]: file,
    });
  };


const handleEditKYC = () => {
  // Reset to level 1 to allow editing
  setCurrentLevel(1);
  // Reset status for all levels except level 1
  setKycLevels(levels => levels.map(l => 
    l.level === 1 ? l : { ...l, status: KYCStatus.PENDING }
  ));
};

const handleResubmitKYC = () => {
  // Reset to level 1 to allow resubmission
  setCurrentLevel(1);
  // Reset status for all levels
  setKycLevels(levels => levels.map(l => ({ ...l, status: KYCStatus.PENDING })));
};

 const hasCompletedKYC = transformKYCData(kycStatus)

  if (isLoading) {
    return (
      <Loader/>
    )
  }

  // If KYC not started, show the initial state
  if (currentLevel === 0) {
    return (
      <div className="space-y-8">
        {/* KYC Not Started State */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              KYC Verification
            </CardTitle>
            <CardDescription>
              Complete your Know Your Customer (KYC) verification to unlock full platform features and increase your
              account limits.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <Shield className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Start Your KYC Verification</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Verify your identity to access premium features, higher transaction limits, and enhanced security for
                your account.
              </p>

              {/* Benefits */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 max-w-2xl mx-auto">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <User className="h-4 w-4 text-blue-600" />
                  </div>
                  <h4 className="font-medium text-sm">Level 1</h4>
                  <p className="text-xs text-gray-600">Basic verification</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <FileText className="h-4 w-4 text-green-600" />
                  </div>
                  <h4 className="font-medium text-sm">Level 2</h4>
                  <p className="text-xs text-gray-600">Identity verification</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Camera className="h-4 w-4 text-purple-600" />
                  </div>
                  <h4 className="font-medium text-sm">Level 3</h4>
                  <p className="text-xs text-gray-600">Full verification</p>
                </div>
              </div>

              <div className="flex justify-center gap-4">
                <Button 
                  onClick={() => handleStartKYC(KYCAccountType.INDIVIDUAL)} 
                  size="lg" 
                  className="bg-black text-white hover:bg-white hover:text-black"
                  disabled={isUploading === "level-1"}
                >
                  {isUploading === "level-1" ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <User className="h-4 w-4 mr-2" />
                  )}
                  Individual Verification
                </Button>
                <Button 
                  onClick={() => handleStartKYC(KYCAccountType.ORGANIZATION)} 
                  size="lg" 
                  variant="outline"
                  disabled={isUploading === "level-1"}
                >
                  {isUploading === "level-1" ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Building className="h-4 w-4 mr-2" />
                  )}
                  Business Verification
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Information Card */}
        <Card>
          <CardHeader>
            <CardTitle>What You&apos;ll Need</CardTitle>
            <CardDescription>Prepare these documents before starting your verification process.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="font-medium text-blue-600 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  For Individual Accounts
                </h4>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Government-issued photo ID (Passport, Driver&apos;s License, National ID)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Proof of address (Utility bill, Bank statement, within 3 months)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Device with camera for live photo verification</span>
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="font-medium text-green-600 flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  For Organization Accounts
                </h4>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Certificate of Incorporation or Business Registration</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Business License and Tax Registration documents</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Recent bank statement and proof of business address</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

    if (hasCompletedKYC && currentLevel >=4) {
    return <KYCDetailsView kycData={hasCompletedKYC} onEdit={handleEditKYC} onResubmit={handleResubmitKYC} />
  }

  return (
    <div className="space-y-8">
      {/* KYC Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            KYC Verification Status
          </CardTitle>
          <CardDescription>Complete all verification levels to unlock full platform features.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Overall Progress</span>
                <span>{Math.round(getOverallProgress())}% Complete</span>
              </div>
              <Progress value={getOverallProgress()} className="h-3" />
            </div>

            {/* Level Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {kycLevels.map(level => (
                <div
                  key={level.level}
                  className={`p-4 border rounded-lg ${
                    level.status === KYCStatus.COMPLETED
                      ? "border-green-200 bg-green-50"
                      : level.status === KYCStatus.IN_PROGRESS
                        ? "border-yellow-200 bg-yellow-50"
                        : "border-gray-200"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(level.status)}
                      <span className="font-medium">Level {level.level}</span>
                    </div>
                    {getStatusBadge(level.status)}
                  </div>
                  <h3 className="font-semibold mb-1">{level.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{level.description}</p>
                  <ul className="text-xs text-gray-500 space-y-1">
                    {level.requirements.map((req, index) => (
                      <li key={index}>• {req}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Level 1: Account Type Selection */}
      {currentLevel >= 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Level 1: Account Type Selection
            </CardTitle>
            <CardDescription>Choose whether this account represents an individual or organization.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    accountType === KYCAccountType.INDIVIDUAL
                      ? "border-black bg-gray-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setAccountType(KYCAccountType.INDIVIDUAL)}
                >
                  <div className="flex items-center gap-3">
                    <User className="h-6 w-6" />
                    <div>
                      <h3 className="font-semibold">Individual Account</h3>
                      <p className="text-sm text-gray-600">Personal account for individual use</p>
                      <p className="text-xs text-gray-500 mt-1">Requires government ID verification</p>
                    </div>
                  </div>
                </div>
                <div
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    accountType === KYCAccountType.ORGANIZATION
                      ? "border-black bg-gray-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setAccountType(KYCAccountType.ORGANIZATION)}
                >
                  <div className="flex items-center gap-3">
                    <Building className="h-6 w-6" />
                    <div>
                      <h3 className="font-semibold">Organization Account</h3>
                      <p className="text-sm text-gray-600">Business or organization account</p>
                      <p className="text-xs text-gray-500 mt-1">Requires business documentation</p>
                    </div>
                  </div>
                </div>
              </div>

              {kycLevels[0].status !== KYCStatus.COMPLETED && (
                <div className="flex justify-end">
                  <Button
                    onClick={() => handleStartKYC(accountType as KYCAccountType)}
                    disabled={isUploading === "level-1" || !accountType}
                    className="bg-black text-white hover:bg-white hover:text-black"
                  >
                    {isUploading === "level-1" ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Complete Level 1"
                    )}
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Level 2: Identity/Organization Verification */}
      {currentLevel >= 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {accountType === KYCAccountType.INDIVIDUAL ? <FileText className="h-5 w-5" /> : <Building className="h-5 w-5" />}
              Level 2: {accountType === KYCAccountType.INDIVIDUAL ? "Identity Verification" : "Organization Verification"}
            </CardTitle>
            <CardDescription>
              {accountType === KYCAccountType.INDIVIDUAL
                ? "Provide your government-issued identification and personal details."
                : "Provide your organization's registration and business details."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {accountType === KYCAccountType.INDIVIDUAL ? (
                <>
                  {/* Individual KYC Form */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="idType">ID Document Type</Label>
                      <Select
                        value={individualData.idType}
                        onValueChange={value => setIndividualData({ ...individualData, idType: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select ID type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="passport">Passport</SelectItem>
                          <SelectItem value="drivers_license">Driver&apos;s License</SelectItem>
                          <SelectItem value="national_id">National ID Card</SelectItem>
                          <SelectItem value="state_id">State ID Card</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="idNumber">ID Number</Label>
                      <Input
                        id="idNumber"
                        value={individualData.idNumber}
                        onChange={e => setIndividualData({ ...individualData, idNumber: e.target.value })}
                        placeholder="Enter ID number"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="issuingCountry">Issuing Country</Label>
                      <Select
                        value={individualData.issuingCountry}
                        onValueChange={value => setIndividualData({ ...individualData, issuingCountry: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="NGN">Nigeria</SelectItem>
                          <SelectItem value="US">United States</SelectItem>
                          <SelectItem value="CA">Canada</SelectItem>
                          <SelectItem value="UK">United Kingdom</SelectItem>
                          <SelectItem value="DE">Germany</SelectItem>
                          <SelectItem value="FR">France</SelectItem>
                          <SelectItem value="AU">Australia</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="expiryDate">Expiry Date</Label>
                      <Input
                        id="expiryDate"
                        type="date"
                        value={individualData.expiryDate}
                        onChange={e => setIndividualData({ ...individualData, expiryDate: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="occupation">Occupation</Label>
                      <Input
                        id="occupation"
                        value={individualData.occupation}
                        onChange={e => setIndividualData({ ...individualData, occupation: e.target.value })}
                        placeholder="Your profession"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="senderName">Mail Sender Name </Label>
                      <Input
                        id="senderName"
                        value={individualData.SenderName}
                        onChange={e => setIndividualData({ ...individualData, SenderName: e.target.value })}
                        placeholder="eg.. TheNews "
                      />
                    </div>
                  </div>

                  {/* ID Document Upload */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Upload ID Document</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Front Side</Label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                          {individualData.idFront ? (
                            <div className="space-y-2">
                              <FileText className="h-8 w-8 mx-auto text-green-500" />
                              <p className="text-sm font-medium">Document uploaded</p>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setIndividualData({ ...individualData, idFront: null })}
                              >
                                Remove
                              </Button>
                            </div>
                          ) : (
                                 <>
                        <Upload className="h-6 w-6 sm:h-8 sm:w-8 mx-auto text-gray-400 mb-2" />
                        <p className="text-xs sm:text-sm text-gray-600">Upload front side of ID</p>
                        <Input
                          type="file"
                          accept="image/*,.pdf"
                          className="mt-2 text-xs"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileInputChange("idFront", file);
                          }}
                          disabled={isUploadingIds}
                        />
                      </>
                          )}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Back Side</Label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                          {individualData.idBack ? (
                            <div className="space-y-2">
                              <FileText className="h-8 w-8 mx-auto text-green-500" />
                              <p className="text-sm font-medium">Document uploaded</p>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setIndividualData({ ...individualData, idBack: null })}
                              >
                                Remove
                              </Button>
                            </div>
                          ) : (
                                   <>
                        <Upload className="h-6 w-6 sm:h-8 sm:w-8 mx-auto text-gray-400 mb-2" />
                        <p className="text-xs sm:text-sm text-gray-600">Upload back side of ID</p>
                        <Input
                          type="file"
                          accept="image/*,.pdf"
                          className="mt-2 text-xs"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileInputChange("idBack", file);
                          }}
                          disabled={isUploadingIds}
                        />
                      </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Organization KYC Form */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-lg">Organization Details</h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="legalName">Legal Name</Label>
                        <Input
                          id="legalName"
                          value={organizationData.legalName}
                          onChange={e => setOrganizationData({ ...organizationData, legalName: e.target.value })}
                          placeholder="Official registered name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="tradingName">Trading Name (if different)</Label>
                        <Input
                          id="tradingName"
                          value={organizationData.tradingName}
                          onChange={e => setOrganizationData({ ...organizationData, tradingName: e.target.value })}
                          placeholder="Business/brand name"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="registrationNumber">Registration Number</Label>
                        <Input
                          id="registrationNumber"
                          value={organizationData.registrationNumber}
                          onChange={e =>
                            setOrganizationData({ ...organizationData, registrationNumber: e.target.value })
                          }
                          placeholder="Company registration number"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="taxId">Tax ID / EIN</Label>
                        <Input
                          id="taxId"
                          value={organizationData.taxId}
                          onChange={e => setOrganizationData({ ...organizationData, taxId: e.target.value })}
                          placeholder="Tax identification number"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="incorporationDate">Incorporation Date</Label>
                        <Input
                          id="incorporationDate"
                          type="date"
                          value={organizationData.incorporationDate}
                          onChange={e =>
                            setOrganizationData({ ...organizationData, incorporationDate: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="incorporationCountry">Country of Incorporation</Label>
                        <Select
                          value={organizationData.incorporationCountry}
                          onValueChange={value =>
                            setOrganizationData({ ...organizationData, incorporationCountry: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select country" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="NGN">Nigeria</SelectItem>
                            <SelectItem value="US">United States</SelectItem>
                            <SelectItem value="CA">Canada</SelectItem>
                            <SelectItem value="UK">United Kingdom</SelectItem>
                            <SelectItem value="DE">Germany</SelectItem>
                            <SelectItem value="FR">France</SelectItem>
                            <SelectItem value="AU">Australia</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="businessType">Business Type</Label>
                        <Select
                          value={organizationData.businessType}
                          onValueChange={value => setOrganizationData({ ...organizationData, businessType: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select business type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="corporation">Corporation</SelectItem>
                            <SelectItem value="llc">LLC</SelectItem>
                            <SelectItem value="partnership">Partnership</SelectItem>
                            <SelectItem value="sole_proprietorship">Sole Proprietorship</SelectItem>
                            <SelectItem value="nonprofit">Non-profit</SelectItem>
                            <SelectItem value="government">Government Entity</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="industry">Industry</Label>
                        <Select
                          value={organizationData.industry}
                          onValueChange={value => setOrganizationData({ ...organizationData, industry: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select industry" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="technology">Technology</SelectItem>
                            <SelectItem value="finance">Finance</SelectItem>
                            <SelectItem value="healthcare">Healthcare</SelectItem>
                            <SelectItem value="education">Education</SelectItem>
                            <SelectItem value="retail">Retail</SelectItem>
                            <SelectItem value="manufacturing">Manufacturing</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                     <div className="space-y-2">
                      <Label htmlFor="website">Company Website</Label>
                      <Input
                        id="website"
                        value={organizationData.website}
                        onChange={e => setOrganizationData({ ...organizationData, website: e.target.value })}
                        placeholder="https://example.com"
                      />
                    </div>

                      <div className="space-y-2">
                      <Label htmlFor="senderName">Mail Sender Name </Label>
                      <Input
                        id="senderName"
                        value={organizationData.SenderName}
                        onChange={e => setOrganizationData({ ...organizationData, SenderName: e.target.value })}
                        placeholder="eg.. TheNews "
                      />
                    </div>
                   </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Business Description</Label>
                      <Textarea
                        id="description"
                        value={organizationData.description}
                        onChange={e => setOrganizationData({ ...organizationData, description: e.target.value })}
                        placeholder="Describe your business activities and services"
                        rows={3}
                      />
                    </div>

                    <Separator />

                    <h4 className="font-medium text-lg">Contact Information</h4>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="contactPerson">Contact Person</Label>
                        <Input
                          id="contactPerson"
                          value={organizationData.contactPerson}
                          onChange={e => setOrganizationData({ ...organizationData, contactPerson: e.target.value })}
                          placeholder="Full name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contactEmail">Contact Email</Label>
                        <Input
                          id="contactEmail"
                          type="email"
                          value={organizationData.contactEmail}
                          onChange={e => setOrganizationData({ ...organizationData, contactEmail: e.target.value })}
                          placeholder="contact@company.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contactPhone">Contact Phone</Label>
                        <Input
                          id="contactPhone"
                          value={organizationData.contactPhone}
                          onChange={e => setOrganizationData({ ...organizationData, contactPhone: e.target.value })}
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                    </div>

                    <Separator />

                    <h4 className="font-medium text-lg">Address Information</h4>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="registeredAddress">Registered Address</Label>
                        <Textarea
                          id="registeredAddress"
                          value={organizationData.registeredAddress}
                          onChange={e =>
                            setOrganizationData({ ...organizationData, registeredAddress: e.target.value })
                          }
                          placeholder="Full registered address"
                          rows={2}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="operatingAddress">Operating Address (if different)</Label>
                        <Textarea
                          id="operatingAddress"
                          value={organizationData.operatingAddress}
                          onChange={e =>
                            setOrganizationData({ ...organizationData, operatingAddress: e.target.value })
                          }
                          placeholder="Full operating address"
                          rows={2}
                        />
                      </div>
                    </div>

                    <Separator />

                    {/* Document Upload for Organization */}
                    <div className="space-y-4">
                      <h4 className="font-medium">Required Documents</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Certificate of Incorporation</Label>
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                            {organizationData.registrationDoc ? (
                              <div className="space-y-2">
                                <FileText className="h-8 w-8 mx-auto text-green-500" />
                                <p className="text-sm font-medium">Document uploaded</p>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setOrganizationData({ ...organizationData, registrationDoc: null })}
                                >
                                  Remove
                                </Button>
                              </div>
                            ) : (
                                           <>
                        <Upload className="h-6 w-6 sm:h-8 sm:w-8 mx-auto text-gray-400 mb-2" />
                        <p className="text-xs sm:text-sm text-gray-600">Upload org Inc reg doc</p>
                        <Input
                          type="file"
                          accept="image/*,.pdf"
                          className="mt-2 text-xs"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleOrganizationFileInputChange("registrationDoc", file);
                          }}
                          disabled={isUploadingIds}
                        />
                      </>

                            )}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Business License</Label>
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                            {organizationData.licenseDoc ? (
                              <div className="space-y-2">
                                <FileText className="h-8 w-8 mx-auto text-green-500" />
                                <p className="text-sm font-medium">Document uploaded</p>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setOrganizationData({ ...organizationData, licenseDoc: null })}
                                >
                                  Remove
                                </Button>
                              </div>
                            ) : (
                                         <>
                        <Upload className="h-6 w-6 sm:h-8 sm:w-8 mx-auto text-gray-400 mb-2" />
                        <p className="text-xs sm:text-sm text-gray-600">Upload org license doc</p>
                        <Input
                          type="file"
                          accept="image/*,.pdf"
                          className="mt-2 text-xs"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleOrganizationFileInputChange("licenseDoc", file);
                          }}
                          disabled={isUploadingIds}
                        />
                      </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {kycLevels[1].status !== KYCStatus.COMPLETED && (
                <div className="flex justify-end">
                  <Button
                    onClick={submitLevel2}
                    disabled={isUploading === "level-2" || 
                      (accountType === KYCAccountType.INDIVIDUAL && (!individualData.idFront || !individualData.idBack)) ||
                      (accountType === KYCAccountType.ORGANIZATION && (!organizationData.registrationDoc || !organizationData.licenseDoc))
                    }
                    className="bg-black text-white hover:bg-white hover:text-black"
                  >
                    {isUploading === "level-2" ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Complete Level 2"
                    )}
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Level 3: Proof of Life & Address */}
      {currentLevel >= 3 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Level 3: Proof of Life & Address Verification
            </CardTitle>
            <CardDescription>Take a live photo and upload proof of address document.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {/* Live Photo Capture */}
              <div className="space-y-4">
                <h4 className="font-medium text-lg flex items-center gap-2">
                  <Camera className="h-5 w-5" />
                  Live Photo Verification
                </h4>
                <p className="text-sm text-gray-600">
                  Take a live photo using your device camera. This helps us verify your identity and prevent fraud.
                </p>

                <div className="border rounded-lg p-6">
                  {!isTakingPhoto && !capturedPhoto && (
                    <div className="text-center space-y-4">
                      <div className="w-32 h-32 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                        <Camera className="h-12 w-12 text-gray-400" />
                      </div>
                      <div>
                        <h5 className="font-medium mb-2">Ready to take your photo?</h5>
                        <p className="text-sm text-gray-600 mb-4">
                          Make sure you&apos;re in a well-lit area and looking directly at the camera.
                        </p>
                        <Button onClick={startCamera} className="bg-black text-white hover:bg-white hover:text-black">
                          <Camera className="h-4 w-4 mr-2" />
                          Start Camera
                        </Button>
                      </div>
                    </div>
                  )}

                  {isTakingPhoto && (
                    <div className="space-y-4">
                      <div className="relative">
                        <video ref={videoRef} autoPlay playsInline className="w-full max-w-md mx-auto rounded-lg" />
                        <canvas ref={canvasRef} className="hidden" />
                      </div>
                      <div className="flex justify-center gap-4">
                        <Button onClick={capturePhoto} className="bg-black text-white hover:bg-white hover:text-black">
                          <Camera className="h-4 w-4 mr-2" />
                          Capture Photo
                        </Button>
                        <Button onClick={stopCamera} variant="outline">
                          Cancel
                        </Button>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600">
                          Position your face in the center and click &quot;Capture Photo&quot;
                        </p>
                      </div>
                    </div>
                  )}

                  {capturedPhoto && (
                    <div className="text-center space-y-4">
                      <div className="relative inline-block">
                        <div className="relative w-48 h-48 ">
                          <Image
                            src={capturedPhoto || "/placeholder.svg"}
                            alt="Captured photo"
                            fill
                            className="object-cover rounded-lg mx-auto absolute"
                          />
                        </div>
                        <div className="absolute top-2 right-2">
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Captured
                          </Badge>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-4">
                          Photo captured successfully! You can retake if needed.
                        </p>
                        <Button
                          onClick={() => {
                            setCapturedPhoto(null)
                            setLevel3Data({ ...level3Data, livePhoto: '' })
                          }}
                          variant="outline"
                          className="bg-black text-white hover:bg-white hover:text-black"
                        >
                          Retake Photo
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Address Document Upload */}
              <div className="space-y-4">
                <h4 className="font-medium text-lg flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Proof of Address
                </h4>
                <p className="text-sm text-gray-600">
                  Upload a recent document that shows your current address (within the last 3 months).
                </p>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="addressType">Document Type</Label>
                    <Select
                      value={level3Data.addressType}
                      onValueChange={value => setLevel3Data({ ...level3Data, addressType: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select document type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="utility_bill">Utility Bill (Electric, Gas, Water)</SelectItem>
                        <SelectItem value="bank_statement">Bank Statement</SelectItem>
                        <SelectItem value="lease_agreement">Lease Agreement</SelectItem>
                        <SelectItem value="mortgage_statement">Mortgage Statement</SelectItem>
                        <SelectItem value="insurance_statement">Insurance Statement</SelectItem>
                        <SelectItem value="government_letter">Government Letter</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Upload Document</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      {level3Data.addressDocument ? (
                        <div className="space-y-2">
                          <FileText className="h-8 w-8 mx-auto text-green-500" />
                          <p className="text-sm font-medium">{level3Data.addressDocument.name}</p>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setLevel3Data({ ...level3Data, addressDocument: null })}
                          >
                            Remove
                          </Button>
                        </div>
                      ) : (
                       <>
                    <Upload className="h-6 w-6 sm:h-8 sm:w-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-xs sm:text-sm text-gray-600">Drag and drop your document here, or click to browse</p>
                    <Input
                      type="file"
                      accept="image/*,.pdf"
                      className="mt-2 text-xs"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleAddressDocumentUpload(file);
                      }}
                      disabled={isUploadingAddress}
                    />
                          <p className="text-xs text-gray-500">Supported formats: PDF, JPG, PNG. Max size: 10MB</p>
                  </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Requirements Checklist */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h5 className="font-medium text-blue-900 mb-3">Document Requirements</h5>
                <ul className="space-y-2 text-sm text-blue-800">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-blue-600" />
                    Document must be issued within the last 3 months
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-blue-600" />
                    Your full name must be clearly visible
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-blue-600" />
                    Complete address must be shown
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-blue-600" />
                    Document must be clear and readable
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-blue-600" />
                    All four corners of the document must be visible
                  </li>
                </ul>
              </div>

              {kycLevels[2].status !== KYCStatus.COMPLETED && (
                <div className="flex justify-end">
                  <Button
                    onClick={submitLevel3}
                    disabled={isUploading === "level-3" || !capturedPhoto || !level3Data.addressDocument || !level3Data.addressType}
                    className="bg-black text-white hover:bg-white hover:text-black"
                  >
                    {isUploading === "level-3" ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Complete Level 3"
                    )}
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}


      {/* Verification Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Verification Tips</CardTitle>
          <CardDescription>Follow these guidelines to ensure quick approval of your verification.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="font-medium text-green-600 flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Best Practices
              </h4>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Ensure all documents are clear, high-resolution, and well-lit</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Use recent documents (within 3 months for address proof)</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Make sure your name matches exactly across all documents</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Capture all four corners of documents in photos</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Take live photos in good lighting conditions</span>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-medium text-red-600 flex items-center gap-2">
                <XCircle className="h-4 w-4" />
                Common Mistakes
              </h4>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Submitting blurry, dark, or low-quality images</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Using expired or outdated documents</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Covering parts of documents with fingers or objects</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Submitting screenshots instead of original photos</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Using documents with different names or spellings</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}








// "use client";

// import { useState, useRef, useEffect } from "react";
// import { useFormState, useFormStatus } from "react-dom";
// import { useUploadThing } from "@/lib/uploadthing";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Camera, Loader2, CheckCircle, XCircle, Upload, FileText, User, Building, Shield, X, Plus, Clock, AlertTriangle, CheckCheckIcon } from "lucide-react";
// import { useToast } from "@/hooks/use-toast";
// import Image from "next/image";
// import { Badge } from "@/components/ui/badge";
// import { getKYCStatus, startKYCProcess, submitKYCLevel2, submitKYCLevel3 } from "@/actions/kyc/kyc";
// import { useUser } from "@clerk/nextjs";
// import toast from "react-hot-toast";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { KYCDetailsView } from "./kyc-details-view";
// import Loader from "@/components/Loader";
// import { Progress } from "@/components/ui/progress";
// import { KYCStatus } from "@prisma/client";

// export default function KYCPage() {
//   const { user } = useUser();
//   const [accountType, setAccountType] = useState<"INDIVIDUAL" | "ORGANIZATION">('INDIVIDUAL');
//   const [isTakingPhoto, setIsTakingPhoto] = useState(false);
//   const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
//   const videoRef = useRef<HTMLVideoElement>(null);
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const [currentLevel, setCurrentLevel] = useState(0);
//   const [showKYCForm, setShowKYCForm] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [kycData, setKycData] = useState<any>(null);
//   const [loading, setLoading] = useState(true);
//   const [showKYCDetails, setShowKYCDetails] = useState(false);

//   // UploadThing hooks
//   const { startUpload: uploadIdDocuments, isUploading: isUploadingIds } = useUploadThing("kycDocument");
//   const { startUpload: uploadAddressProof, isUploading: isUploadingAddress } = useUploadThing("kycDocument");
  
//   // Form data states
//   const [individualData, setIndividualData] = useState({
//     idType: "",
//     idNumber: "",
//     issuingCountry: "",
//     expiryDate: "",
//     occupation: "",
    // idFront: null as File | null,
    // idBack: null as File | null,
//   });
  
//   const [organizationData, setOrganizationData] = useState({
//     legalName: "",
//     tradingName: "",
//     registrationNumber: "",
//     taxId: "",
//     incorporationDate: "",
//     incorporationCountry: "",
//     businessType: "",
//     industry: "",
//     website: "",
//     description: "",
//     registeredAddress: "",
//     operatingAddress: "",
//     contactPerson: "",
//     contactEmail: "",
//     contactPhone: "",
//   });
  
  // const [level3Data, setLevel3Data] = useState({
  //   addressType: "",
  //   addressDocument: null as File | null,
  //   addressUploadResult: null as { url: string; key: string } | null,
  // });

//   // Load KYC status on mount
//   useEffect(() => {
//     const loadStatus = async () => {
//       try {
//         const status = await getKYCStatus();

//         if (!status || !status.success || !status.data) {
//           console.warn("No KYC record found or user not logged in");
//           return;
//         }

//         const { accountType, levels } = status.data;
//         setAccountType(accountType);
//         setShowKYCForm(true);

//         try {
//           const level1 = levels.level1;
//           const level2 = levels.level2;
//           const level3 = levels.level3;

//           if (level3?.status === "completed") {
//             setCurrentLevel(4);
//           } else if (level2?.status === "completed") {
//             setCurrentLevel(3);
//           } else if (level1?.status === "completed") {
//             setCurrentLevel(2);
//           } else {
//             setCurrentLevel(1);
//           }
//         } catch (parseError) {
//           console.error("Failed to parse KYC levels:", parseError);
//           setCurrentLevel(1);
//         }
//       } catch (error) {
//         console.error("Failed to load KYC status:", error);
//         toast.error("Failed to load KYC status");
//       }
//     };
//     loadStatus();
//   }, []);

//   useEffect(() => {
//     const loadKYCData = async () => {
//       try {
//         setLoading(true);
//         const status = await getKYCStatus();

//         if (status.success && status.data) {
//           setKycData(status.data);

//           if (status.data.levels?.level3?.status === "completed") {
//             setShowKYCDetails(true);
//           }
//         } else {
//           console.warn(status.error || "No KYC data available");
//         }
//       } catch (error) {
//         console.error("Failed to load KYC status:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadKYCData();
//   }, []);

//   // Camera functions
//   const startCamera = async () => {
//     try {
//       setIsTakingPhoto(true);
//       const stream = await navigator.mediaDevices.getUserMedia({
//         video: { width: 640, height: 480, facingMode: "user" },
//       });
//       if (videoRef.current) {
//         videoRef.current.srcObject = stream;
//       }
//     } catch (error) {
//       toast.error("Unable to start camera");
//       setIsTakingPhoto(false);
//     }
//   };

//   const capturePhoto = () => {
//     if (videoRef.current && canvasRef.current) {
//       const canvas = canvasRef.current;
//       const video = videoRef.current;
//       const context = canvas.getContext("2d");

//       canvas.width = video.videoWidth;
//       canvas.height = video.videoHeight;

//       if (context) {
//         context.drawImage(video, 0, 0);
//         const photoData = canvas.toDataURL("image/jpeg");
//         setCapturedPhoto(photoData);

//         // Stop camera
//         const stream = video.srcObject as MediaStream;
//         stream?.getTracks().forEach((track) => track.stop());
//         setIsTakingPhoto(false);
//         toast.success("Your live photo has been captured successfully.");
//       }
//     }
//   };

//   const stopCamera = () => {
//     if (videoRef.current) {
//       const stream = videoRef.current.srcObject as MediaStream;
//       stream?.getTracks().forEach((track) => track.stop());
//     }
//     setIsTakingPhoto(false);
//   };

//   // KYC Process Handlers
  // const handleStartKYC = async () => {
  //   setIsSubmitting(true);
  //   try {
  //     if (!user) {
  //       toast.error("User not authenticated.");
  //       return;
  //     }

  //     const userId = user.id;
  //     const result = await startKYCProcess(accountType, userId);
  //     console.log(result, 'kyc result')
  //     if (result.success) {
  //       toast.success("Your KYC verification process has begun.");
  //       setShowKYCForm(true);
  //       setCurrentLevel(2);
  //     } else {
  //       throw new Error(result.error);
  //     }
  //   } catch (error) {
  //     toast.error("Failed to start KYC");
  //     console.log(error, 'error in handleStartKYC')
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

//   const handleSubmitLevel2 = async () => {
    // if (!individualData.idFront || !individualData.idBack) {
    //   toast.error("Failed to upload documents");
    //   return;
    // }

//     setIsSubmitting(true);
//     try {
      // // Upload ID documents first
      // const uploadResults = await uploadIdDocuments([
      //   individualData.idFront,
      //   individualData.idBack,
      // ]);
      
      // if (!uploadResults || uploadResults.length < 2 || !uploadResults[0].url || !uploadResults[1].url) {
      //   throw new Error("File upload failed");
      // }

//       // Prepare form data
//       const formData = new FormData();
//       formData.append("accountType", accountType);
//       formData.append("idType", individualData.idType);
//       formData.append("idNumber", individualData.idNumber);
//       formData.append("issuingCountry", individualData.issuingCountry);
//       formData.append("expiryDate", individualData.expiryDate);
//       formData.append("occupation", individualData.occupation);
      // formData.append("idFrontUrl", uploadResults[0].url);
      // formData.append("idFrontKey", uploadResults[0].key);
      // formData.append("idBackUrl", uploadResults[1].url);
      // formData.append("idBackKey", uploadResults[1].key);

//       // Submit form
//       const result = await submitKYCLevel2(formData, accountType as "INDIVIDUAL" | "ORGANIZATION");
      
//       if (result?.success) {
//         toast.success("Your KYC verification process has completed.");
//         setCurrentLevel(3);
//       } else {
//         throw new Error(result?.error || "Submission failed");
//       }
//     } catch (error) {
//       toast.error("Failed to submit verification");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleSubmitLevel3 = async () => {
//     if (!capturedPhoto) {
//       toast.error("Failed to submit photo");
//       return;
//     }

//     if (!level3Data.addressDocument) {
//       toast.error("Failed to upload your address proof document");
//       return;
//     }

//     setIsSubmitting(true);
//     try {
//       // Upload address document
      // const uploadResults = await uploadAddressProof([level3Data.addressDocument]);
      
      // if (!uploadResults?.[0]?.url) {
      //   throw new Error("Address proof upload failed");
      // }

      // const result = await submitKYCLevel3(
      //   capturedPhoto,
      //   uploadResults[0].url,
      //   uploadResults[0].key,
      //   level3Data.addressType
      // );

//       if (result.success) {
//         toast.success("Your KYC verification is complete and under review.");
//         setCurrentLevel(4);
//       } else {
//         throw new Error(result.error || "Submission failed");
//       }
//     } catch (error) {
//       toast.error(error instanceof Error? error.message : "Failed to complete verification");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

  // const handleAddressDocumentUpload = async (file: File) => {
  //   try {
  //     const uploadResults = await uploadAddressProof([file]);
      
  //     if (!uploadResults?.[0]?.url) {
  //       throw new Error("Address proof upload failed");
  //     }

  //     setLevel3Data({
  //       ...level3Data,
  //       addressDocument: file,
  //       addressUploadResult: {
  //         url: uploadResults[0].url,
  //         key: uploadResults[0].key,
  //       },
  //     });

  //     toast.success("Your address proof has been uploaded successfully.");
  //   } catch (error) {
  //     toast.error(error instanceof Error? error.message : "Failed to upload document");
  //   }
  // };

  // const handleFileInputChange = (field: "idFront" | "idBack", file: File | null) => {
  //   setIndividualData({
  //     ...individualData,
  //     [field]: file,
  //   });
  // };

//   const kycLevels = [
//     {
//       level: 1,
//       title: "Basic Information",
//       description: "Verify your basic identity information.",
//       status: kycData?.levels?.level1?.status || "pending",
//       requirements: ["Full name", "Email verification"],
//     },
//     {
//       level: 2,
//       title: "Identity Verification",
//       description: "Upload your government-issued ID.",
//       status: kycData?.levels?.level2?.status || "pending",
//       requirements: ["Valid ID (Front & Back)", "ID number", "Issuing country"],
//     },
//     {
//       level: 3,
//       title: "Address Verification",
//       description: "Provide proof of address and a live photo.",
//       status: kycData?.levels?.level3?.status || "pending",
//       requirements: ["Proof of address", "Live photo"],
//     },
//   ];

  // const transformKYCData = (kycStatus: any) => {
  //   if (!kycStatus) return null;

  //   try {
  //     // Ensure levels are safely parsed (if stored as JSON strings)
  //     const level1 = typeof kycStatus.levels.level1 === "string" 
  //       ? JSON.parse(kycStatus.levels.level1) 
  //       : kycStatus.levels.level1 || {};

  //     const level2 = typeof kycStatus.levels.level2 === "string" 
  //       ? JSON.parse(kycStatus.levels.level2) 
  //       : kycStatus.levels.level2 || {};

  //     const level3 = typeof kycStatus.levels.level3 === "string" 
  //       ? JSON.parse(kycStatus.levels.level3) 
  //       : kycStatus.levels.level3 || {};

  //     // Determine overall status
  //     let overallStatus: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "REJECTED" = "PENDING";

  //     if (level3.status === KYCStatus.COMPLETED) {
  //       overallStatus = "COMPLETED";
  //     } else if (level2.status === "COMPLETED") {
  //       overallStatus = "COMPLETED";
  //     } else if (level1.status === "COMPLETED") {
  //       overallStatus = "COMPLETED";
  //     }

  //     // Define document type
  //     type DocumentType = {
  //       type: string;
  //       filename: string;
  //       url: string;
  //       uploadedAt: string | Date;
  //     };

  //     // Extract documents from KYCDocument model
  //     const documents = kycStatus.documents?.map((doc: any) => ({
  //       type: doc.type,
  //       filename: doc.key,
  //       url: doc.url,
  //       uploadedAt: doc.uploadedAt,
  //     })) || [];

  //     return {
  //       accountType: kycStatus.accountType,
  //       status: overallStatus,
  //       submittedAt: kycStatus.createdAt,
  //       reviewedAt: kycStatus.updatedAt,
  //       reviewedBy: "TheNews Team",

  //       individualData: level2.data
  //         ? {
  //             idType: level2.data.idType,
  //             idNumber: level2.data.idNumber,
  //             issuingCountry: level2.data.issuingCountry,
  //             expiryDate: level2.data.expiryDate,
  //             occupation: level2.data.occupation,
  //           }
  //         : undefined,

  //       livePhoto: kycStatus.livePhoto,

  //       addressDocument: documents.find((d: DocumentType) => d.type === "address_proof") || undefined,

  //       documents,
  //     };
  //   } catch (error) {
  //     console.error("Error transforming KYC data:", error);
  //     return null;
  //   }
  // };

//   const handleEditKYC = () => {
//     setShowKYCDetails(false)
//     setShowKYCForm(true)
//     setCurrentLevel(1)
//   }

//   const handleResubmitKYC = () => {
//     setShowKYCDetails(false)
//     setShowKYCForm(true)
//     setCurrentLevel(1)
//     toast.success('KYC resubmission initiated.')
//   }

//   const getStatusIcon = (status: KYCStatus) => {
//     switch (status) {
//       case "COMPLETED":
//         return <CheckCircle className="h-5 w-5 text-green-500" />
//       case "IN_PROGRESS":
//         return <Clock className="h-5 w-5 text-yellow-500" />
//       case "PENDING":
//         return <AlertTriangle className="h-5 w-5 text-gray-400" />
//       case "APPROVED":
//         return <CheckCheckIcon className="h-5 w-5 text-gray-400" />
//       case "REJECTED":
//         return <X className="h-5 w-5 text-gray-400" />
//       default:
//         return <XCircle className="h-5 w-5 text-gray-400" />
//     }
//   }

//   const getStatusBadge = (status: KYCStatus) => {
//     switch (status) {
//       case "COMPLETED":
//         return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Completed</Badge>
//       case "IN_PROGRESS":
//         return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">In Progress</Badge>
//       case "PENDING":
//         return <Badge variant="outline">Pending</Badge>
//       case "REJECTED":
//         return <Badge variant="outline">Rejected</Badge>
//       case "APPROVED":
//         return <Badge variant="outline">Approved</Badge>
//       default:
//         return <Badge variant="outline">Not Started</Badge>
//     }
//   }

//   const hasCompletedKYC = transformKYCData(kycData)

//   const getOverallProgress = () => {
//     if (!kycData?.levels) return 0;

//     const levels = kycData.levels;
//     const levelStatuses = [levels.level1, levels.level2, levels.level3];

//     const completedLevels = levelStatuses.filter(
//       (level) => level?.status === "completed"
//     ).length;

//     return (completedLevels / levelStatuses.length) * 100;
//   };

  // if (hasCompletedKYC && currentLevel >=4) {
  //   return <KYCDetailsView kycData={hasCompletedKYC} onEdit={handleEditKYC} onResubmit={handleResubmitKYC} />
  // }

//   if (loading) {
//     return <Loader/>
//   }

//   if (!showKYCForm) {
//     return (
//       <div className="space-y-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
//         {/* KYC Not Started State */}
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <Shield className="h-5 w-5" />
//               <span className="text-lg sm:text-xl">KYC Verification</span>
//             </CardTitle>
//             <CardDescription className="text-sm sm:text-base">
//               Complete your Know Your Customer (KYC) verification to unlock full platform features and increase your
//               account limits.
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             {currentLevel === 0 ? (
//               <div className="text-center py-8 sm:py-12">
//                 <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4 sm:mb-6">
//                   <Shield className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400" />
//                 </div>
//                 <h3 className="text-lg sm:text-xl font-semibold mb-2">Start Your KYC Verification</h3>
//                 <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 max-w-md mx-auto">
//                   Verify your identity to access premium features, higher transaction limits, and enhanced security for
//                   your account.
//                 </p>
//                 <Button 
//                   onClick={() => setCurrentLevel(1)}
//                   size="lg" 
//                   className="bg-black text-white hover:bg-white hover:text-black w-full sm:w-auto"
//                 >
//                   <Plus className="h-4 w-4 mr-2" />
//                   Start KYC Verification
//                 </Button>
//               </div>
//             ) : currentLevel === 1 ? (
//               <div className="space-y-6">
//                 <h3 className="text-lg sm:text-xl font-semibold">Select Account Type</h3>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div
//                     className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
//                       accountType === "INDIVIDUAL" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
//                     }`}
//                     onClick={() => setAccountType("INDIVIDUAL")}
//                   >
//                     <div className="flex items-center gap-3">
//                       <User className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500" />
//                       <div>
//                         <h3 className="font-semibold text-sm sm:text-base">Individual Account</h3>
//                         <p className="text-xs sm:text-sm text-gray-600">Personal account for individual use</p>
//                       </div>
//                     </div>
//                   </div>
//                   <div
//                     className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
//                       accountType === "ORGANIZATION" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
//                     }`}
//                     onClick={() => setAccountType("ORGANIZATION")}
//                   >
//                     <div className="flex items-center gap-3">
//                       <Building className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500" />
//                       <div>
//                         <h3 className="font-semibold text-sm sm:text-base">Organization Account</h3>
//                         <p className="text-xs sm:text-sm text-gray-600">Business or organization account</p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="flex justify-end">
//                   <Button
//                     onClick={handleStartKYC}
//                     disabled={!accountType || isSubmitting}
//                     className="bg-black text-white hover:bg-white hover:text-black w-full sm:w-auto"
//                   >
//                     {isSubmitting ? (
//                       <>
//                         <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                         Starting...
//                       </>
//                     ) : (
//                       "Continue"
//                     )}
//                   </Button>
//                 </div>
//               </div>
//             ) : null}
//           </CardContent>
//         </Card>

//         {/* Information Card */}
//         <Card>
//           <CardHeader>
//             <CardTitle className="text-lg sm:text-xl">What You&apos;ll Need</CardTitle>
//             <CardDescription className="text-sm sm:text-base">
//               Prepare these documents before starting your verification process.
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
//               <div className="space-y-4">
//                 <h4 className="font-medium text-blue-600 flex items-center gap-2 text-sm sm:text-base">
//                   <User className="h-4 w-4" />
//                   For Individual Accounts
//                 </h4>
//                 <ul className="space-y-3 text-xs sm:text-sm text-gray-600">
//                   <li className="flex items-start gap-2">
//                     <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 sm:mt-2 flex-shrink-0"></div>
//                     <span>Government-issued photo ID (Passport, Driver&apos;s License, National ID)</span>
//                   </li>
//                   <li className="flex items-start gap-2">
//                     <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 sm:mt-2 flex-shrink-0"></div>
//                     <span>Proof of address (Utility bill, Bank statement, within 3 months)</span>
//                   </li>
//                   <li className="flex items-start gap-2">
//                     <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 sm:mt-2 flex-shrink-0"></div>
//                     <span>Device with camera for live photo verification</span>
//                   </li>
//                 </ul>
//               </div>
//               <div className="space-y-4">
//                 <h4 className="font-medium text-green-600 flex items-center gap-2 text-sm sm:text-base">
//                   <Building className="h-4 w-4" />
//                   For Organization Accounts
//                 </h4>
//                 <ul className="space-y-3 text-xs sm:text-sm text-gray-600">
//                   <li className="flex items-start gap-2">
//                     <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 sm:mt-2 flex-shrink-0"></div>
//                     <span>Certificate of Incorporation or Business Registration</span>
//                   </li>
//                   <li className="flex items-start gap-2">
//                     <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 sm:mt-2 flex-shrink-0"></div>
//                     <span>Business License and Tax Registration documents</span>
//                   </li>
//                   <li className="flex items-start gap-2">
//                     <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 sm:mt-2 flex-shrink-0"></div>
//                     <span>Recent bank statement and proof of business address</span>
//                   </li>
//                 </ul>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
//       {/* KYC Overview */}
//       <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2">
//             <Shield className="h-5 w-5" />
//             <span className="text-lg sm:text-xl">KYC Verification Status</span>
//           </CardTitle>
//           <CardDescription className="text-sm sm:text-base">
//             Complete all verification levels to unlock full platform features.
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-6">
//             {/* Progress */}
//             <div className="space-y-2">
//               <div className="flex justify-between text-sm">
//                 <span>Overall Progress</span>
//                 <span>{Math.round(getOverallProgress())}% Complete</span>
//               </div>
//               <Progress value={getOverallProgress()} className="h-2 sm:h-3" />
//             </div>

//             {/* Level Overview */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
//               {kycLevels.map((level) => (
//                 <div
//                   key={level.level}
//                   className={`p-3 sm:p-4 border rounded-lg ${
//                     level.status === "completed"
//                       ? "border-green-200 bg-green-50"
//                       : level.status === "in_progress"
//                         ? "border-yellow-200 bg-yellow-50"
//                         : "border-gray-200"
//                   }`}
//                 >
//                   <div className="flex items-center justify-between mb-2">
//                     <div className="flex items-center gap-2">
//                       {getStatusIcon(level.status)}
//                       <span className="font-medium text-sm sm:text-base">Level {level.level}</span>
//                     </div>
//                     {getStatusBadge(level.status)}
//                   </div>
//                   <h3 className="font-semibold text-sm sm:text-base mb-1">{level.title}</h3>
//                   <p className="text-xs sm:text-sm text-gray-600 mb-2">{level.description}</p>
//                   <ul className="text-xs text-gray-500 space-y-1">
//                     {level.requirements.map((req, index) => (
//                       <li key={index}>• {req}</li>
//                     ))}
//                   </ul>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Level 1: Account Type Selection */}
//       {currentLevel >= 1 && currentLevel < 2 && (
//         <div className="space-y-6">
//           <h2 className="text-lg sm:text-xl font-semibold">Account Type Selection</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
//             <div
//               className={`p-3 sm:p-4 border-2 rounded-lg cursor-pointer transition-all ${
//                 accountType === "INDIVIDUAL" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
//               }`}
//               onClick={() => setAccountType("INDIVIDUAL")}
//             >
//               <div className="flex items-center gap-3">
//                 <User className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500" />
//                 <div>
//                   <h3 className="font-semibold text-sm sm:text-base">Individual Account</h3>
//                   <p className="text-xs sm:text-sm text-gray-600">Personal account for individual use</p>
//                 </div>
//               </div>
//             </div>
//             <div
//               className={`p-3 sm:p-4 border-2 rounded-lg cursor-pointer transition-all ${
//                 accountType === "ORGANIZATION" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
//               }`}
//               onClick={() => setAccountType("ORGANIZATION")}
//             >
//               <div className="flex items-center gap-3">
//                 <Building className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500" />
//                 <div>
//                   <h3 className="font-semibold text-sm sm:text-base">Organization Account</h3>
//                   <p className="text-xs sm:text-sm text-gray-600">Business or organization account</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//           <div className="flex justify-end">
//             <Button
//               onClick={handleStartKYC}
//               disabled={!accountType || isSubmitting}
//               className="w-full sm:w-auto"
//             >
//               {isSubmitting ? (
//                 <>
//                   <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                   Starting...
//                 </>
//               ) : (
//                 "Continue"
//               )}
//             </Button>
//           </div>
//         </div>
//       )}

//       {/* Level 2: Identity Verification */}
//       {currentLevel >= 2 && currentLevel < 3 && (
//         <div className="space-y-6">
//           <h2 className="text-lg sm:text-xl font-semibold">Identity Verification</h2>
          
//           <div className="space-y-6">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
//               <div className="space-y-2">
//                 <Label htmlFor="idType" className="text-sm sm:text-base">ID Document Type</Label>
//                 <select
//                   id="idType"
//                   value={individualData.idType}
//                   onChange={(e) => setIndividualData({...individualData, idType: e.target.value})}
//                   className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
//                 >
//                   <option value="">Select ID type</option>
//                   <option value="passport">Passport</option>
//                   <option value="drivers_license">Driver&apos;s License</option>
//                   <option value="national_id">National ID Card</option>
//                 </select>
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="idNumber" className="text-sm sm:text-base">ID Number</Label>
//                 <Input
//                   id="idNumber"
//                   value={individualData.idNumber}
//                   onChange={(e) => setIndividualData({...individualData, idNumber: e.target.value})}
//                   placeholder="Enter ID number"
//                 />
//               </div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
//               <div className="space-y-2">
//                 <Label htmlFor="issuingCountry" className="text-sm sm:text-base">Issuing Country</Label>
//                 <select
//                   id="issuingCountry"
//                   value={individualData.issuingCountry}
//                   onChange={(e) => setIndividualData({...individualData, issuingCountry: e.target.value})}
//                   className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
//                 >
//                   <option value="">Select country</option>
//                   <option value="US">United States</option>
//                   <option value="UK">United Kingdom</option>
//                 </select>
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="expiryDate" className="text-sm sm:text-base">Expiry Date</Label>
//                 <Input
//                   id="expiryDate"
//                   type="date"
//                   value={individualData.expiryDate}
//                   onChange={(e) => setIndividualData({...individualData, expiryDate: e.target.value})}
//                 />
//               </div>
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="occupation" className="text-sm sm:text-base">Occupation</Label>
//               <Input
//                 id="occupation"
//                 value={individualData.occupation}
//                 onChange={(e) => setIndividualData({...individualData, occupation: e.target.value})}
//                 placeholder="Your profession"
//               />
//             </div>

//             {/* ID Document Upload */}
//             <div className="space-y-4">
//               <h4 className="font-medium text-sm sm:text-base">Upload ID Documents</h4>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
//                 <div className="space-y-2">
//                   <Label className="text-sm sm:text-base">Front Side</Label>
//                   <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 text-center">
//                     {individualData.idFront ? (
//                       <div className="flex items-center justify-between p-2">
//                         <div className="flex items-center gap-2">
//                           <FileText className="h-5 w-5 text-blue-500" />
//                           <span className="text-xs sm:text-sm truncate max-w-[120px] sm:max-w-[180px]">
//                             {individualData.idFront.name}
//                           </span>
//                         </div>
//                         <Button
//                           variant="ghost"
//                           size="icon"
//                           onClick={() => handleFileInputChange("idFront", null)}
//                           disabled={isUploadingIds}
//                           className="h-8 w-8"
//                         >
//                           <X className="h-3 w-3 sm:h-4 sm:w-4" />
//                         </Button>
//                       </div>
//                     ) : (
                      // <>
                      //   <Upload className="h-6 w-6 sm:h-8 sm:w-8 mx-auto text-gray-400 mb-2" />
                      //   <p className="text-xs sm:text-sm text-gray-600">Upload front side of ID</p>
                      //   <Input
                      //     type="file"
                      //     accept="image/*,.pdf"
                      //     className="mt-2 text-xs"
                      //     onChange={(e) => {
                      //       const file = e.target.files?.[0];
                      //       if (file) handleFileInputChange("idFront", file);
                      //     }}
                      //     disabled={isUploadingIds}
                      //   />
                      // </>
//                     )}
//                   </div>
//                 </div>
//                 <div className="space-y-2">
//                   <Label className="text-sm sm:text-base">Back Side</Label>
//                   <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 text-center">
//                     {individualData.idBack ? (
//                       <div className="flex items-center justify-between p-2">
//                         <div className="flex items-center gap-2">
//                           <FileText className="h-5 w-5 text-blue-500" />
//                           <span className="text-xs sm:text-sm truncate max-w-[120px] sm:max-w-[180px]">
//                             {individualData.idBack.name}
//                           </span>
//                         </div>
//                         <Button
//                           variant="ghost"
//                           size="icon"
//                           onClick={() => handleFileInputChange("idBack", null)}
//                           disabled={isUploadingIds}
//                           className="h-8 w-8"
//                         >
//                           <X className="h-3 w-3 sm:h-4 sm:w-4" />
//                         </Button>
//                       </div>
//                     ) : (
//                       <>
//                         <Upload className="h-6 w-6 sm:h-8 sm:w-8 mx-auto text-gray-400 mb-2" />
//                         <p className="text-xs sm:text-sm text-gray-600">Upload back side of ID</p>
//                         <Input
//                           type="file"
//                           accept="image/*,.pdf"
//                           className="mt-2 text-xs"
//                           onChange={(e) => {
//                             const file = e.target.files?.[0];
//                             if (file) handleFileInputChange("idBack", file);
//                           }}
//                           disabled={isUploadingIds}
//                         />
//                       </>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="flex justify-end">
//               <Button
//                 onClick={handleSubmitLevel2}
//                 disabled={isSubmitting || isUploadingIds || !individualData.idFront || !individualData.idBack}
//                 className="w-full sm:w-auto"
//               >
//                 {isSubmitting || isUploadingIds ? (
//                   <>
//                     <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                     {isUploadingIds ? "Uploading..." : "Submitting..."}
//                   </>
//                 ) : (
//                   "Submit Verification"
//                 )}
//               </Button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Level 3: Proof of Life & Address */}
//       {currentLevel >= 3 && currentLevel < 4 && (
//         <div className="space-y-6 sm:space-y-8">
//           <h2 className="text-lg sm:text-xl font-semibold">Proof of Life & Address Verification</h2>

//           {/* Live Photo Capture */}
//           <div className="space-y-4">
//             <h4 className="font-medium text-base sm:text-lg">Live Photo Verification</h4>
            
//             <div className="border rounded-lg p-4 sm:p-6">
//               {!isTakingPhoto && !capturedPhoto && (
//                 <div className="text-center space-y-3 sm:space-y-4">
//                   <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
//                     <Camera className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400" />
//                   </div>
//                   <Button onClick={startCamera} className="w-full sm:w-auto">
//                     <Camera className="h-4 w-4 mr-2" />
//                     Start Camera
//                   </Button>
//                 </div>
//               )}

//               {isTakingPhoto && (
//                 <div className="space-y-4">
//                   <div className="relative">
//                     <video 
//                       ref={videoRef} 
//                       autoPlay 
//                       playsInline 
//                       className="w-full max-w-md mx-auto rounded-lg aspect-video" 
//                     />
//                     <canvas ref={canvasRef} className="hidden" />
//                   </div>
//                   <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
//                     <Button onClick={capturePhoto} className="w-full sm:w-auto">
//                       <Camera className="h-4 w-4 mr-2" />
//                       Capture Photo
//                     </Button>
//                     <Button onClick={stopCamera} variant="outline" className="w-full sm:w-auto">
//                       Cancel
//                     </Button>
//                   </div>
//                 </div>
//               )}

//               {capturedPhoto && (
//                 <div className="text-center space-y-3 sm:space-y-4">
//                   <div className="relative inline-block">
//                     <Image
//                       src={capturedPhoto}
//                       alt="Captured photo"
//                       width={160}
//                       height={160}
//                       className="rounded-lg mx-auto aspect-square object-cover"
//                     />
//                     <Badge className="absolute top-1 right-1 sm:top-2 sm:right-2 bg-green-100 text-green-800 text-xs">
//                       <CheckCircle className="h-2 w-2 sm:h-3 sm:w-3 mr-1" />
//                       Captured
//                     </Badge>
//                   </div>
//                   <Button
//                     onClick={() => {
//                       setCapturedPhoto(null);
//                     }}
//                     variant="outline"
//                     className="w-full sm:w-auto"
//                   >
//                     Retake Photo
//                   </Button>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Address Document Upload */}
//           <div className="space-y-4">
//             <h4 className="font-medium text-base sm:text-lg">Proof of Address</h4>
            
//             <div className="space-y-2">
//               <Label htmlFor="addressType" className="text-sm sm:text-base">Document Type</Label>
//               <select
//                 id="addressType"
//                 value={level3Data.addressType}
//                 onChange={(e) => setLevel3Data({...level3Data, addressType: e.target.value})}
//                 className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
//               >
//                 <option value="">Select document type</option>
//                 <option value="utility_bill">Utility Bill</option>
//                 <option value="bank_statement">Bank Statement</option>
//                 <option value="lease_agreement">Lease Agreement</option>
//               </select>
//             </div>

//             <div className="space-y-2">
//               <Label className="text-sm sm:text-base">Upload Document</Label>
//               <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 text-center">
//                 {level3Data.addressDocument ? (
//                   <div className="flex items-center justify-between p-2">
//                     <div className="flex items-center gap-2">
//                       <FileText className="h-5 w-5 text-blue-500" />
//                       <span className="text-xs sm:text-sm truncate max-w-[120px] sm:max-w-[180px]">
//                         {level3Data.addressDocument.name}
//                       </span>
//                     </div>
//                     <Button
//                       variant="ghost"
//                       size="icon"
//                       onClick={() => setLevel3Data({...level3Data, addressDocument: null})}
//                       disabled={isUploadingAddress}
//                       className="h-8 w-8"
//                     >
//                       <X className="h-3 w-3 sm:h-4 sm:w-4" />
//                     </Button>
//                   </div>
//                 ) : (
                  // <>
                  //   <Upload className="h-6 w-6 sm:h-8 sm:w-8 mx-auto text-gray-400 mb-2" />
                  //   <p className="text-xs sm:text-sm text-gray-600">Drag and drop your document here, or click to browse</p>
                  //   <Input
                  //     type="file"
                  //     accept="image/*,.pdf"
                  //     className="mt-2 text-xs"
                  //     onChange={(e) => {
                  //       const file = e.target.files?.[0];
                  //       if (file) handleAddressDocumentUpload(file);
                  //     }}
                  //     disabled={isUploadingAddress}
                  //   />
                  // </>
//                 )}
//               </div>
//             </div>
//           </div>

//           <div className="flex justify-end">
//             <Button
//               onClick={handleSubmitLevel3}
//               disabled={isSubmitting || isUploadingAddress || !capturedPhoto || !level3Data.addressDocument}
//               className="w-full sm:w-auto"
//             >
//               {isSubmitting || isUploadingAddress ? (
//                 <>
//                   <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                   {isUploadingAddress ? "Uploading..." : "Submitting..."}
//                 </>
//               ) : (
//                 "Complete Verification"
//               )}
//             </Button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }













// "use client";

// import { useState, useRef, useEffect } from "react";
// import { useFormState, useFormStatus } from "react-dom";
// import { useUploadThing } from "@/lib/uploadthing";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Camera, Loader2, CheckCircle, XCircle, Upload, FileText, User, Building, Shield, X, Plus, Clock, AlertTriangle, CheckCheckIcon } from "lucide-react";
// import { useToast } from "@/hooks/use-toast";
// import Image from "next/image";
// import { Badge } from "@/components/ui/badge";
// import { getKYCStatus, startKYCProcess, submitKYCLevel2, submitKYCLevel3 } from "@/actions/kyc/kyc";
// import { useUser } from "@clerk/nextjs";
// import toast from "react-hot-toast";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { KYCDetailsView } from "./kyc-details-view";
// import Loader from "@/components/Loader";
// import { Progress } from "@/components/ui/progress";
// import { KYCStatus } from "@prisma/client";

// export default function KYCPage() {
//   const { user } = useUser();
//   const [accountType, setAccountType] = useState<"INDIVIDUAL" | "ORGANIZATION" >('INDIVIDUAL');
//   const [isTakingPhoto, setIsTakingPhoto] = useState(false);
//   const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
//   const videoRef = useRef<HTMLVideoElement>(null);
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const [currentLevel, setCurrentLevel] = useState(0);
//   const [showKYCForm, setShowKYCForm] = useState(false);
  
//   const [isSubmitting, setIsSubmitting] = useState(false);
//    const [kycData, setKycData] = useState<any>(null);
//   const [loading, setLoading] = useState(true);
//   const [showKYCDetails, setShowKYCDetails] = useState(false);


//   // UploadThing hooks
//   const { startUpload: uploadIdDocuments, isUploading: isUploadingIds } = useUploadThing("kycDocument");
//   const { startUpload: uploadAddressProof, isUploading: isUploadingAddress } = useUploadThing("kycDocument");
  
//   // Form data states
//   const [individualData, setIndividualData] = useState({
//     idType: "",
//     idNumber: "",
//     issuingCountry: "",
//     expiryDate: "",
//     occupation: "",
//     idFront: null as File | null,
//     idBack: null as File | null,
//   });
  
//   const [organizationData, setOrganizationData] = useState({
//     legalName: "",
//     tradingName: "",
//     registrationNumber: "",
//     taxId: "",
//     incorporationDate: "",
//     incorporationCountry: "",
//     businessType: "",
//     industry: "",
//     website: "",
//     description: "",
//     registeredAddress: "",
//     operatingAddress: "",
//     contactPerson: "",
//     contactEmail: "",
//     contactPhone: "",
//   });
  
//   const [level3Data, setLevel3Data] = useState({
//     addressType: "",
//     addressDocument: null as File | null,
//     addressUploadResult: null as { url: string; key: string } | null,
//   });

//   // Load KYC status on mount
// useEffect(() => {
//   const loadStatus = async () => {
//     try {
//       const status = await getKYCStatus();

//       if (!status || !status.success || !status.data) {
//         console.warn("No KYC record found or user not logged in");
//         return;
//       }

//       const { accountType, levels } = status.data;
//       setAccountType(accountType);
//       setShowKYCForm(true);

//       try {
//         const level1 = levels.level1;
//         const level2 = levels.level2;
//         const level3 = levels.level3;

//         if (level3?.status === "completed") {
//           setCurrentLevel(4);

//         } else if (level2?.status === "completed") {
//           setCurrentLevel(3);
//         } else if (level1?.status === "completed") {
//           setCurrentLevel(2);
//         } else {
//           setCurrentLevel(1);
//         }
//       } catch (parseError) {
//         console.error("Failed to parse KYC levels:", parseError);
//         setCurrentLevel(1);
//       }
//     } catch (error) {
//       console.error("Failed to load KYC status:", error);
//       toast.error("Failed to load KYC status");
//     }
//   };
//   loadStatus();
// }, []);

//  useEffect(() => {
//   const loadKYCData = async () => {
//     try {
//       setLoading(true);
//       const status = await getKYCStatus();

//       if (status.success && status.data) {
//         setKycData(status.data);

//         if (status.data.levels?.level3?.status === "completed") {
//           setShowKYCDetails(true);
//         }
//       } else {
//         console.warn(status.error || "No KYC data available");
//       }
//     } catch (error) {
//       console.error("Failed to load KYC status:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   loadKYCData();
// }, []);


//   // Camera functions
//   const startCamera = async () => {
//     try {
//       setIsTakingPhoto(true);
//       const stream = await navigator.mediaDevices.getUserMedia({
//         video: { width: 640, height: 480, facingMode: "user" },
//       });
//       if (videoRef.current) {
//         videoRef.current.srcObject = stream;
//       }
//     } catch (error) {
//       toast.error("Unable to start camera");
//       setIsTakingPhoto(false);
//     }
//   };

//   const capturePhoto = () => {
//     if (videoRef.current && canvasRef.current) {
//       const canvas = canvasRef.current;
//       const video = videoRef.current;
//       const context = canvas.getContext("2d");

//       canvas.width = video.videoWidth;
//       canvas.height = video.videoHeight;

//       if (context) {
//         context.drawImage(video, 0, 0);
//         const photoData = canvas.toDataURL("image/jpeg");
//         setCapturedPhoto(photoData);

//         // Stop camera
//         const stream = video.srcObject as MediaStream;
//         stream?.getTracks().forEach((track) => track.stop());
//         setIsTakingPhoto(false);
//         toast.success("Your live photo has been captured successfully .");
//       }
//     }
//   };

//   const stopCamera = () => {
//     if (videoRef.current) {
//       const stream = videoRef.current.srcObject as MediaStream;
//       stream?.getTracks().forEach((track) => track.stop());
//     }
//     setIsTakingPhoto(false);
//   };

//   // KYC Process Handlers
//   const handleStartKYC = async () => {
 
//     setIsSubmitting(true);
//     try {

//        if (!user) {
//         toast.error("User not authenticated.");
//         return;
//     }

//       const userId = user.id;
//       const result = await startKYCProcess(accountType, userId);
//       console.log(result, 'kyc result')
//       if (result.success) {
//         toast.success("Your KYC verification process has begun.");
//         setShowKYCForm(true);
//         setCurrentLevel(2);
//       } else {
//         throw new Error(result.error);
//       }
//     } catch (error) {
//       toast.error("Failed to start KYC");
//       console.log(error, 'error in handleStartKYC')
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleSubmitLevel2 = async () => {
//     if (!individualData.idFront || !individualData.idBack) {
//       toast.error("Failed to upload documents");
//       return;
//     }

//     setIsSubmitting(true);
//     try {
//       // Upload ID documents first
//       const uploadResults = await uploadIdDocuments([
//         individualData.idFront,
//         individualData.idBack,
//       ]);
      
//       if (!uploadResults || uploadResults.length < 2 || !uploadResults[0].url || !uploadResults[1].url) {
//         throw new Error("File upload failed");
//       }

//       // Prepare form data
//       const formData = new FormData();
//       formData.append("accountType", accountType);
//       formData.append("idType", individualData.idType);
//       formData.append("idNumber", individualData.idNumber);
//       formData.append("issuingCountry", individualData.issuingCountry);
//       formData.append("expiryDate", individualData.expiryDate);
//       formData.append("occupation", individualData.occupation);
//       formData.append("idFrontUrl", uploadResults[0].url);
//       formData.append("idFrontKey", uploadResults[0].key);
//       formData.append("idBackUrl", uploadResults[1].url);
//       formData.append("idBackKey", uploadResults[1].key);

//       // Submit form
//           const result = await submitKYCLevel2(formData, accountType as "INDIVIDUAL" | "ORGANIZATION");
      
//       if (result?.success) {
//         toast.success("Your KYC verification process has completed.");
//         setCurrentLevel(3);
//       } else {
//         throw new Error(result?.error || "Submission failed");
//       }
//     } catch (error) {
//       toast.error("Failed to submit verification");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleSubmitLevel3 = async () => {
//     if (!capturedPhoto) {
//       toast.error("Failed to submit photo");
//       return;
//     }

//     if (!level3Data.addressDocument) {
//       toast.error("Failed to upload your address proof document");
//       return;
//     }

//     setIsSubmitting(true);
//     try {
//       // Upload address document
//       const uploadResults = await uploadAddressProof([level3Data.addressDocument]);
      
//       if (!uploadResults?.[0]?.url) {
//         throw new Error("Address proof upload failed");
//       }

//       const result = await submitKYCLevel3(
//         capturedPhoto,
//         uploadResults[0].url,
//         uploadResults[0].key,
//         level3Data.addressType
//       );

//       if (result.success) {
//         toast.success("Your KYC verification is complete and under review.");
//         setCurrentLevel(4);
//       } else {
//         throw new Error(result.error || "Submission failed");
//       }
//     } catch (error) {
//       toast.error(error instanceof Error? error.message : "Failed to complete verification");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleAddressDocumentUpload = async (file: File) => {
//     try {
//       const uploadResults = await uploadAddressProof([file]);
      
//       if (!uploadResults?.[0]?.url) {
//         throw new Error("Address proof upload failed");
//       }

//       setLevel3Data({
//         ...level3Data,
//         addressDocument: file,
//         addressUploadResult: {
//           url: uploadResults[0].url,
//           key: uploadResults[0].key,
//         },
//       });

//       toast.success("Your address proof has been uploaded successfully.");
//     } catch (error) {
//       toast.error(error instanceof Error? error.message : "Failed to upload document");
//     }
//   };

//   const handleFileInputChange = (field: "idFront" | "idBack", file: File | null) => {
//     setIndividualData({
//       ...individualData,
//       [field]: file,
//     });
//   };

//   const kycLevels = [
//   {
//     level: 1,
//     title: "Basic Information",
//     description: "Verify your basic identity information.",
//     status: kycData?.levels?.level1?.status || "pending",
//     requirements: ["Full name", "Email verification"],
//   },
//   {
//     level: 2,
//     title: "Identity Verification",
//     description: "Upload your government-issued ID.",
//     status: kycData?.levels?.level2?.status || "pending",
//     requirements: ["Valid ID (Front & Back)", "ID number", "Issuing country"],
//   },
//   {
//     level: 3,
//     title: "Address Verification",
//     description: "Provide proof of address and a live photo.",
//     status: kycData?.levels?.level3?.status || "pending",
//     requirements: ["Proof of address", "Live photo"],
//   },
// ];


//   const transformKYCData = (kycStatus: any) => {
//   if (!kycStatus) return null;

//   try {
//     // Ensure levels are safely parsed (if stored as JSON strings)
//     const level1 = typeof kycStatus.levels.level1 === "string" 
//       ? JSON.parse(kycStatus.levels.level1) 
//       : kycStatus.levels.level1 || {};

//     const level2 = typeof kycStatus.levels.level2 === "string" 
//       ? JSON.parse(kycStatus.levels.level2) 
//       : kycStatus.levels.level2 || {};

//     const level3 = typeof kycStatus.levels.level3 === "string" 
//       ? JSON.parse(kycStatus.levels.level3) 
//       : kycStatus.levels.level3 || {};

//     // Determine overall status
//     let overallStatus: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "REJECTED" = "PENDING";

//     if (level3.status === KYCStatus.COMPLETED) {
//       overallStatus = "COMPLETED";
//     } else if (level2.status === "COMPLETED") {
//       overallStatus = "COMPLETED";
//     } else if (level1.status === "COMPLETED") {
//       overallStatus = "COMPLETED";
//     }

//      // Define document type
//     type DocumentType = {
//       type: string;
//       filename: string;
//       url: string;
//       uploadedAt: string | Date;
//     };

//      // Extract documents from KYCDocument model
//     const documents = kycStatus.documents?.map((doc: any) => ({
//       type: doc.type,
//       filename: doc.key,
//       url: doc.url,
//       uploadedAt: doc.uploadedAt,
//     })) || [];

//     return {
//       accountType: kycStatus.accountType,
//       status: overallStatus,
//       submittedAt: kycStatus.createdAt,
//       reviewedAt: kycStatus.updatedAt,
//       reviewedBy: "TheNews Team",

//       individualData: level2.data
//         ? {
//             idType: level2.data.idType,
//             idNumber: level2.data.idNumber ,
//             issuingCountry: level2.data.issuingCountry ,
//             expiryDate: level2.data.expiryDate,
//             occupation: level2.data.occupation ,
//           }
//         : undefined,

//       livePhoto: kycStatus.livePhoto,

//       addressDocument: documents.find((d: DocumentType) => d.type === "address_proof") || undefined,

//       documents,

     
//     };
//   } catch (error) {
//     console.error("Error transforming KYC data:", error);
//     return null;
//   }
// };


//     const handleEditKYC = () => {
//     setShowKYCDetails(false)
//     setShowKYCForm(true)
//     setCurrentLevel(1)
//   }

//   const handleResubmitKYC = () => {
//     setShowKYCDetails(false)
//     setShowKYCForm(true)
//     setCurrentLevel(1)
//     toast.success('KYC resubmission initiated.')
//   }

//     const getStatusIcon = (status: KYCStatus) => {
//     switch (status) {
//       case "COMPLETED":
//         return <CheckCircle className="h-5 w-5 text-green-500" />
//       case "IN_PROGRESS":
//         return <Clock className="h-5 w-5 text-yellow-500" />
//       case "PENDING":
//         return <AlertTriangle className="h-5 w-5 text-gray-400" />
//       case "APPROVED":
//         return <CheckCheckIcon className="h-5 w-5 text-gray-400" />
//       case "REJECTED":
//         return <X className="h-5 w-5 text-gray-400" />
//       default:
//         return <XCircle className="h-5 w-5 text-gray-400" />
//     }
//   }

//   const getStatusBadge = (status: KYCStatus) => {
//     switch (status) {
//       case "COMPLETED":
//         return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Completed</Badge>
//       case "IN_PROGRESS":
//         return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">In Progress</Badge>
//       case "PENDING":
//         return <Badge variant="outline">Pending</Badge>
//       case "REJECTED":
//         return <Badge variant="outline">Rejected</Badge>
//       case "APPROVED":
//         return <Badge variant="outline">Approved</Badge>
//       default:
//         return <Badge variant="outline">Not Started</Badge>
//     }
//   }

//   const hasCompletedKYC = transformKYCData(kycData)

//   const getOverallProgress = () => {
//   if (!kycData?.levels) return 0;

//   const levels = kycData.levels;
//   const levelStatuses = [levels.level1, levels.level2, levels.level3];

//   const completedLevels = levelStatuses.filter(
//     (level) => level?.status === "completed"
//   ).length;

//   return (completedLevels / levelStatuses.length) * 100;
// };


//   if (hasCompletedKYC &&  currentLevel >=4) {
//     return <KYCDetailsView kycData={hasCompletedKYC} onEdit={handleEditKYC} onResubmit={handleResubmitKYC} />
//   }

//   console.log(hasCompletedKYC, 'hasCompletedKYC', 'hasCompletedKYC')
//   console.log(kycData, 'kycData')

//   if (loading) {
//     <Loader/>
//   }

//   if ( !showKYCForm) {
//     return (
//       <div className="space-y-8">
//         {/* KYC Not Started State */}
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <Shield className="h-5 w-5" />
//               KYC Verification
//             </CardTitle>
//             <CardDescription>
//               Complete your Know Your Customer (KYC) verification to unlock full platform features and increase your
//               account limits.
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             {currentLevel === 0 ? (
//               <div className="text-center py-12">
//                 <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-6">
//                   <Shield className="h-12 w-12 text-gray-400" />
//                 </div>
//                 <h3 className="text-xl font-semibold mb-2">Start Your KYC Verification</h3>
//                 <p className="text-gray-600 mb-6 max-w-md mx-auto">
//                   Verify your identity to access premium features, higher transaction limits, and enhanced security for
//                   your account.
//                 </p>
//                 <Button 
//                   onClick={() => setCurrentLevel(1)}
//                   size="lg" 
//                   className="bg-black text-white hover:bg-white hover:text-black"
//                 >
//                   <Plus className="h-4 w-4 mr-2" />
//                   Start KYC Verification
//                 </Button>
//               </div>
//             ) : currentLevel === 1 ? (
//               <div className="space-y-6">
//                 <h3 className="text-xl font-semibold">Select Account Type</h3>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div
//                     className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
//                       accountType === "INDIVIDUAL" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
//                     }`}
//                     onClick={() => setAccountType("INDIVIDUAL")}
//                   >
//                     <div className="flex items-center gap-3">
//                       <User className="h-6 w-6 text-blue-500" />
//                       <div>
//                         <h3 className="font-semibold">Individual Account</h3>
//                         <p className="text-sm text-gray-600">Personal account for individual use</p>
//                       </div>
//                     </div>
//                   </div>
//                   <div
//                     className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
//                       accountType === "ORGANIZATION" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
//                     }`}
//                     onClick={() => setAccountType("ORGANIZATION")}
//                   >
//                     <div className="flex items-center gap-3">
//                       <Building className="h-6 w-6 text-blue-500" />
//                       <div>
//                         <h3 className="font-semibold">Organization Account</h3>
//                         <p className="text-sm text-gray-600">Business or organization account</p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="flex justify-end">
//                   <Button
//                     onClick={handleStartKYC}
//                     disabled={!accountType || isSubmitting}
//                     className="bg-black text-white hover:bg-white hover:text-black"
//                   >
//                     {isSubmitting ? (
//                       <>
//                         <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                         Starting...
//                       </>
//                     ) : (
//                       "Continue"
//                     )}
//                   </Button>
//                 </div>
//               </div>
//             ) : null}
//           </CardContent>
//         </Card>

//         {/* Information Card */}
//         <Card>
//           <CardHeader>
//             <CardTitle>What You&apos;ll Need</CardTitle>
//             <CardDescription>Prepare these documents before starting your verification process.</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//               <div className="space-y-4">
//                 <h4 className="font-medium text-blue-600 flex items-center gap-2">
//                   <User className="h-4 w-4" />
//                   For Individual Accounts
//                 </h4>
//                 <ul className="space-y-3 text-sm text-gray-600">
//                   <li className="flex items-start gap-2">
//                     <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
//                     <span>Government-issued photo ID (Passport, Driver&apos;s License, National ID)</span>
//                   </li>
//                   <li className="flex items-start gap-2">
//                     <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
//                     <span>Proof of address (Utility bill, Bank statement, within 3 months)</span>
//                   </li>
//                   <li className="flex items-start gap-2">
//                     <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
//                     <span>Device with camera for live photo verification</span>
//                   </li>
//                 </ul>
//               </div>
//               <div className="space-y-4">
//                 <h4 className="font-medium text-green-600 flex items-center gap-2">
//                   <Building className="h-4 w-4" />
//                   For Organization Accounts
//                 </h4>
//                 <ul className="space-y-3 text-sm text-gray-600">
//                   <li className="flex items-start gap-2">
//                     <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
//                     <span>Certificate of Incorporation or Business Registration</span>
//                   </li>
//                   <li className="flex items-start gap-2">
//                     <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
//                     <span>Business License and Tax Registration documents</span>
//                   </li>
//                   <li className="flex items-start gap-2">
//                     <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
//                     <span>Recent bank statement and proof of business address</span>
//                   </li>
//                 </ul>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     );
//   }


//   return (
//     <div className="space-y-8">


//       {/* KYC Overview */}
//       <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2">
//             <Shield className="h-5 w-5" />
//             KYC Verification Status
//           </CardTitle>
//           <CardDescription>Complete all verification levels to unlock full platform features.</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-6">
//             {/* Progress */}
//             <div className="space-y-2">
//               <div className="flex justify-between text-sm">
//                 <span>Overall Progress</span>
//                 <span>{Math.round(getOverallProgress())}% Complete</span>
//               </div>
//               <Progress value={getOverallProgress()} className="h-3" />
//             </div>

//             {/* Level Overview */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               {kycLevels.map((level) => (
//                 <div
//                   key={level.level}
//                   className={`p-4 border rounded-lg ${
//                     level.status === "completed"
//                       ? "border-green-200 bg-green-50"
//                       : level.status === "in_progress"
//                         ? "border-yellow-200 bg-yellow-50"
//                         : "border-gray-200"
//                   }`}
//                 >
//                   <div className="flex items-center justify-between mb-2">
//                     <div className="flex items-center gap-2">
//                       {getStatusIcon(level.status)}
//                       <span className="font-medium">Level {level.level}</span>
//                     </div>
//                     {getStatusBadge(level.status)}
//                   </div>
//                   <h3 className="font-semibold mb-1">{level.title}</h3>
//                   <p className="text-sm text-gray-600 mb-2">{level.description}</p>
//                   <ul className="text-xs text-gray-500 space-y-1">
//                     {level.requirements.map((req, index) => (
//                       <li key={index}>• {req}</li>
//                     ))}
//                   </ul>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </CardContent>
//       </Card>


//       {/* Level 1: Account Type Selection */}
//       {currentLevel >= 1 && currentLevel < 2 && (
//         <div className="space-y-6">
//           <h2 className="text-xl font-semibold">Account Type Selection</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div
//               className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
//                 accountType === "INDIVIDUAL" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
//               }`}
//               onClick={() => setAccountType("INDIVIDUAL")}
//             >
//               <div className="flex items-center gap-3">
//                 <User className="h-6 w-6 text-blue-500" />
//                 <div>
//                   <h3 className="font-semibold">Individual Account</h3>
//                   <p className="text-sm text-gray-600">Personal account for individual use</p>
//                 </div>
//               </div>
//             </div>
//             <div
//               className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
//                 accountType === "ORGANIZATION" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
//               }`}
//               onClick={() => setAccountType("ORGANIZATION")}
//             >
//               <div className="flex items-center gap-3">
//                 <Building className="h-6 w-6 text-blue-500" />
//                 <div>
//                   <h3 className="font-semibold">Organization Account</h3>
//                   <p className="text-sm text-gray-600">Business or organization account</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//           <div className="flex justify-end">
//             <Button
//               onClick={handleStartKYC}
//               disabled={!accountType || isSubmitting}
//             >
//               {isSubmitting ? (
//                 <>
//                   <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                   Starting...
//                 </>
//               ) : (
//                 "Continue"
//               )}
//             </Button>
//           </div>
//         </div>
//       )}

//       {/* Level 2: Identity Verification */}
//       {currentLevel >= 2 && currentLevel < 3 && (
//         <div className="space-y-6">
//           <h2 className="text-xl font-semibold">Identity Verification</h2>
          
//           <div className="space-y-6">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div className="space-y-2">
//                 <Label htmlFor="idType">ID Document Type</Label>
//                 <select
//                   id="idType"
//                   value={individualData.idType}
//                   onChange={(e) => setIndividualData({...individualData, idType: e.target.value})}
//                   className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
//                 >
//                   <option value="">Select ID type</option>
//                   <option value="passport">Passport</option>
//                   <option value="drivers_license">Driver&apos;s License</option>
//                   <option value="national_id">National ID Card</option>
//                 </select>
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="idNumber">ID Number</Label>
//                 <Input
//                   id="idNumber"
//                   value={individualData.idNumber}
//                   onChange={(e) => setIndividualData({...individualData, idNumber: e.target.value})}
//                   placeholder="Enter ID number"
//                 />
//               </div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div className="space-y-2">
//                 <Label htmlFor="issuingCountry">Issuing Country</Label>
//                 <select
//                   id="issuingCountry"
//                   value={individualData.issuingCountry}
//                   onChange={(e) => setIndividualData({...individualData, issuingCountry: e.target.value})}
//                   className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
//                 >
//                   <option value="">Select country</option>
//                   <option value="US">United States</option>
//                   <option value="UK">United Kingdom</option>
//                 </select>
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="expiryDate">Expiry Date</Label>
//                 <Input
//                   id="expiryDate"
//                   type="date"
//                   value={individualData.expiryDate}
//                   onChange={(e) => setIndividualData({...individualData, expiryDate: e.target.value})}
//                 />
//               </div>
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="occupation">Occupation</Label>
//               <Input
//                 id="occupation"
//                 value={individualData.occupation}
//                 onChange={(e) => setIndividualData({...individualData, occupation: e.target.value})}
//                 placeholder="Your profession"
//               />
//             </div>

//             {/* ID Document Upload */}
//             <div className="space-y-4">
//               <h4 className="font-medium">Upload ID Documents</h4>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <Label>Front Side</Label>
//                   <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
//                     {individualData.idFront ? (
//                       <div className="flex items-center justify-between p-2">
//                         <div className="flex items-center gap-2">
//                           <FileText className="h-5 w-5 text-blue-500" />
//                           <span className="text-sm truncate max-w-[180px]">
//                             {individualData.idFront.name}
//                           </span>
//                         </div>
//                         <Button
//                           variant="ghost"
//                           size="icon"
//                           onClick={() => handleFileInputChange("idFront", null)}
//                           disabled={isUploadingIds}
//                         >
//                           <X className="h-4 w-4" />
//                         </Button>
//                       </div>
//                     ) : (
//                       <>
//                         <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
//                         <p className="text-sm text-gray-600">Upload front side of ID</p>
//                         <Input
//                           type="file"
//                           accept="image/*,.pdf"
//                           className="mt-2"
//                           onChange={(e) => {
//                             const file = e.target.files?.[0];
//                             if (file) handleFileInputChange("idFront", file);
//                           }}
//                           disabled={isUploadingIds}
//                         />
//                       </>
//                     )}
//                   </div>
//                 </div>
//                 <div className="space-y-2">
//                   <Label>Back Side</Label>
//                   <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
//                     {individualData.idBack ? (
//                       <div className="flex items-center justify-between p-2">
//                         <div className="flex items-center gap-2">
//                           <FileText className="h-5 w-5 text-blue-500" />
//                           <span className="text-sm truncate max-w-[180px]">
//                             {individualData.idBack.name}
//                           </span>
//                         </div>
//                         <Button
//                           variant="ghost"
//                           size="icon"
//                           onClick={() => handleFileInputChange("idBack", null)}
//                           disabled={isUploadingIds}
//                         >
//                           <X className="h-4 w-4" />
//                         </Button>
//                       </div>
//                     ) : (
//                       <>
//                         <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
//                         <p className="text-sm text-gray-600">Upload back side of ID</p>
//                         <Input
//                           type="file"
//                           accept="image/*,.pdf"
//                           className="mt-2"
//                           onChange={(e) => {
//                             const file = e.target.files?.[0];
//                             if (file) handleFileInputChange("idBack", file);
//                           }}
//                           disabled={isUploadingIds}
//                         />
//                       </>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="flex justify-end">
//               <Button
//                 onClick={handleSubmitLevel2}
//                 disabled={isSubmitting || isUploadingIds || !individualData.idFront || !individualData.idBack}
//               >
//                 {isSubmitting || isUploadingIds ? (
//                   <>
//                     <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                     {isUploadingIds ? "Uploading..." : "Submitting..."}
//                   </>
//                 ) : (
//                   "Submit Verification"
//                 )}
//               </Button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Level 3: Proof of Life & Address */}
//       {currentLevel >= 3 && currentLevel < 4 && (
//         <div className="space-y-8">
//           <h2 className="text-xl font-semibold">Proof of Life & Address Verification</h2>

//           {/* Live Photo Capture */}
//           <div className="space-y-4">
//             <h4 className="font-medium text-lg">Live Photo Verification</h4>
            
//             <div className="border rounded-lg p-6">
//               {!isTakingPhoto && !capturedPhoto && (
//                 <div className="text-center space-y-4">
//                   <div className="w-32 h-32 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
//                     <Camera className="h-12 w-12 text-gray-400" />
//                   </div>
//                   <Button onClick={startCamera}>
//                     <Camera className="h-4 w-4 mr-2" />
//                     Start Camera
//                   </Button>
//                 </div>
//               )}

//               {isTakingPhoto && (
//                 <div className="space-y-4">
//                   <div className="relative">
//                     <video ref={videoRef} autoPlay playsInline className="w-full max-w-md mx-auto rounded-lg" />
//                     <canvas ref={canvasRef} className="hidden" />
//                   </div>
//                   <div className="flex justify-center gap-4">
//                     <Button onClick={capturePhoto}>
//                       <Camera className="h-4 w-4 mr-2" />
//                       Capture Photo
//                     </Button>
//                     <Button onClick={stopCamera} variant="outline">
//                       Cancel
//                     </Button>
//                   </div>
//                 </div>
//               )}

//               {capturedPhoto && (
//                 <div className="text-center space-y-4">
//                   <div className="relative inline-block">
//                     <Image
//                       src={capturedPhoto}
//                       alt="Captured photo"
//                       width={192}
//                       height={192}
//                       className="rounded-lg mx-auto"
//                     />
//                     <Badge className="absolute top-2 right-2 bg-green-100 text-green-800">
//                       <CheckCircle className="h-3 w-3 mr-1" />
//                       Captured
//                     </Badge>
//                   </div>
//                   <Button
//                     onClick={() => {
//                       setCapturedPhoto(null);
//                     }}
//                     variant="outline"
//                   >
//                     Retake Photo
//                   </Button>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Address Document Upload */}
//           <div className="space-y-4">
//             <h4 className="font-medium text-lg">Proof of Address</h4>
            
//             <div className="space-y-2">
//               <Label htmlFor="addressType">Document Type</Label>
//               <select
//                 id="addressType"
//                 value={level3Data.addressType}
//                 onChange={(e) => setLevel3Data({...level3Data, addressType: e.target.value})}
//                 className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
//               >
//                 <option value="">Select document type</option>
//                 <option value="utility_bill">Utility Bill</option>
//                 <option value="bank_statement">Bank Statement</option>
//                 <option value="lease_agreement">Lease Agreement</option>
//               </select>
//             </div>

//             <div className="space-y-2">
//               <Label>Upload Document</Label>
//               <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
//                 {level3Data.addressDocument ? (
//                   <div className="flex items-center justify-between p-2">
//                     <div className="flex items-center gap-2">
//                       <FileText className="h-5 w-5 text-blue-500" />
//                       <span className="text-sm truncate max-w-[180px]">
//                         {level3Data.addressDocument.name}
//                       </span>
//                     </div>
//                     <Button
//                       variant="ghost"
//                       size="icon"
//                       onClick={() => setLevel3Data({...level3Data, addressDocument: null})}
//                       disabled={isUploadingAddress}
//                     >
//                       <X className="h-4 w-4" />
//                     </Button>
//                   </div>
//                 ) : (
//                   <>
//                     <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
//                     <p className="text-sm text-gray-600">Drag and drop your document here, or click to browse</p>
//                     <Input
//                       type="file"
//                       accept="image/*,.pdf"
//                       className="mt-2"
//                       onChange={(e) => {
//                         const file = e.target.files?.[0];
//                         if (file) handleAddressDocumentUpload(file);
//                       }}
//                       disabled={isUploadingAddress}
//                     />
//                   </>
//                 )}
//               </div>
//             </div>
//           </div>

//           <div className="flex justify-end">
//             <Button
//               onClick={handleSubmitLevel3}
//               disabled={isSubmitting || isUploadingAddress || !capturedPhoto || !level3Data.addressDocument}
//             >
//               {isSubmitting || isUploadingAddress ? (
//                 <>
//                   <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                   {isUploadingAddress ? "Uploading..." : "Submitting..."}
//                 </>
//               ) : (
//                 "Complete Verification"
//               )}
//             </Button>
//           </div>
//         </div>
//       )}

//     </div>
//   );
// }