// "use client"

// import type React from "react"

// import { useState, useEffect } from "react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Badge } from "@/components/ui/badge"
// import { CheckCircle, Mail, User, Shield, Bell } from "lucide-react"
// import toast from "react-hot-toast"

// interface SubscribeParams {
//   app?: string
//   campaign?: string
//   message?: string
//   utm_source?: string
//   utm_medium?: string
//   utm_campaign?: string
//   ref?: string
// }

// export function SubscribeFormPage() {
//   const [email, setEmail] = useState("")
//   const [name, setName] = useState("")
//   const [isSubmitted, setIsSubmitted] = useState(false)
//   const [isLoading, setIsLoading] = useState(false)
//   const [params, setParams] = useState<SubscribeParams>({})

//   useEffect(() => {
//     // Parse URL parameters
//     const urlParams = new URLSearchParams(window.location.search)
//     const parsedParams: SubscribeParams = {
//       app: urlParams.get("app") || undefined,
//       campaign: urlParams.get("campaign") || undefined,
//       message: urlParams.get("message") || undefined,
//       utm_source: urlParams.get("utm_source") || undefined,
//       utm_medium: urlParams.get("utm_medium") || undefined,
//       utm_campaign: urlParams.get("utm_campaign") || undefined,
//       ref: urlParams.get("ref") || undefined,
//     }
//     setParams(parsedParams)
//   }, [])

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()

//     if (!email || !name) {
//     //   toast({
//     //     title: "Missing Information",
//     //     description: "Please fill in both your name and email address.",
//     //     variant: "destructive",
//     //   })
//     toast.error('Please fill in both your name and email address.')
//       return
//     }

//     setIsLoading(true)

//     // Simulate API call
//     setTimeout(() => {
//       setIsLoading(false)
//       setIsSubmitted(true)
//       toast.success(" Successfully Subscribed!")
//     }, 1500)
//   }

//   const getAppDisplayName = (app?: string) => {
//     if (!app) return "Newsletter"
//     return app.charAt(0).toUpperCase() + app.slice(1)
//   }

//   const getCampaignDisplayName = (campaign?: string) => {
//     if (!campaign) return "General Updates"
//     // Extract readable name from campaign ID or use as is
//     return "Newsletter Updates"
//   }

//   if (isSubmitted) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
//         <Card className="w-full max-w-md bg-white shadow-xl">
//           <CardContent className="p-8 text-center">
//             <div className="mb-6">
//               <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
//               <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome Aboard!</h1>
//               <p className="text-gray-600">
//                 You've successfully subscribed to <strong>{getAppDisplayName(params.app)}</strong>
//               </p>
//             </div>

//             <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
//               <p className="text-sm text-green-800">
//                 <strong>What's next?</strong>
//                 <br />
//                 Check your email for a confirmation message and get ready for amazing content!
//               </p>
//             </div>

//             <div className="space-y-3 text-sm text-gray-600">
//               <div className="flex items-center justify-center gap-2">
//                 <Mail className="h-4 w-4" />
//                 <span>Confirmation email sent to {email}</span>
//               </div>
//               <div className="flex items-center justify-center gap-2">
//                 <Bell className="h-4 w-4" />
//                 <span>You can unsubscribe anytime</span>
//               </div>
//             </div>

//             <Button onClick={() => window.close()} className="mt-6 w-full bg-black text-white hover:bg-gray-800">
//               Close Window
//             </Button>
//           </CardContent>
//         </Card>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
//       <div className="w-full max-w-md">
//         <Card className="bg-white shadow-xl">
//           <CardHeader className="text-center pb-4">
//             <div className="mb-4">
//               <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
//                 <Mail className="h-8 w-8 text-white" />
//               </div>
//               <CardTitle className="text-2xl font-bold text-gray-900">
//                 Subscribe to {getAppDisplayName(params.app)}
//               </CardTitle>
//               <CardDescription className="text-gray-600 mt-2">
//                 {params.message ||
//                   `Join our newsletter and stay updated with the latest from ${getAppDisplayName(params.app)}`}
//               </CardDescription>
//             </div>

//             {params.campaign && (
//               <Badge variant="secondary" className="mx-auto">
//                 {getCampaignDisplayName(params.campaign)}
//               </Badge>
//             )}
//           </CardHeader>

//           <CardContent className="p-6 pt-0">
//             <form onSubmit={handleSubmit} className="space-y-4">
//               <div className="space-y-2">
//                 <Label htmlFor="name" className="text-sm font-medium text-gray-700">
//                   Full Name
//                 </Label>
//                 <div className="relative">
//                   <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
//                   <Input
//                     id="name"
//                     type="text"
//                     placeholder="Enter your full name"
//                     value={name}
//                     onChange={(e) => setName(e.target.value)}
//                     className="pl-10 border-gray-300 focus:border-black focus:ring-black"
//                     required
//                   />
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="email" className="text-sm font-medium text-gray-700">
//                   Email Address
//                 </Label>
//                 <div className="relative">
//                   <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
//                   <Input
//                     id="email"
//                     type="email"
//                     placeholder="Enter your email address"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     className="pl-10 border-gray-300 focus:border-black focus:ring-black"
//                     required
//                   />
//                 </div>
//               </div>

//               <Button type="submit" className="w-full bg-black text-white hover:bg-gray-800 py-3" disabled={isLoading}>
//                 {isLoading ? (
//                   <div className="flex items-center gap-2">
//                     <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                     Subscribing...
//                   </div>
//                 ) : (
//                   "Subscribe Now"
//                 )}
//               </Button>
//             </form>

//             {/* Benefits */}
//             <div className="mt-6 pt-6 border-t border-gray-200">
//               <h3 className="text-sm font-medium text-gray-900 mb-3">What you'll get:</h3>
//               <ul className="space-y-2 text-sm text-gray-600">
//                 <li className="flex items-center gap-2">
//                   <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
//                   <span>Weekly newsletter with curated content</span>
//                 </li>
//                 <li className="flex items-center gap-2">
//                   <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
//                   <span>Exclusive updates and announcements</span>
//                 </li>
//                 <li className="flex items-center gap-2">
//                   <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
//                   <span>No spam, unsubscribe anytime</span>
//                 </li>
//               </ul>
//             </div>

//             {/* Privacy */}
//             <div className="mt-4 pt-4 border-t border-gray-200">
//               <div className="flex items-center gap-2 text-xs text-gray-500">
//                 <Shield className="h-3 w-3" />
//                 <span>Your privacy is protected. We never share your information.</span>
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Footer */}
//         <div className="text-center mt-6 text-xs text-gray-500">
//           <p>Powered by {getAppDisplayName(params.app)} Newsletter System</p>
//           {params.ref && <p className="mt-1">Referral: {params.ref}</p>}
//         </div>
//       </div>
//     </div>
//   )
// }




"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Mail, User, Shield, Bell } from "lucide-react";
import { getIntegrationByName } from "@/actions/application-Integration/application";
import { getCampaignById } from "@/actions/campaign/get-campaign";
import { addSubscriber } from "@/actions/subscriber/add.subscriber";
import { Integration } from "@prisma/client";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import Loader from "@/components/Loader";

export function SubscribeFormPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [campaign, setCampaign] = useState<any>(null);
  const [integration, setIntegration] = useState<Partial<Integration>>();
  const searchParams = useSearchParams();
  const router = useRouter();

  const campaignId = searchParams.get("campaignId");
  const appName = searchParams.get("appName");

  useEffect(() => {
    const fetchData = async () => {
      if (!campaignId || !appName) {
        console.error("Invalid subscription link - missing campaignId or appName");
        toast.error("Invalid subscription link");
        router.push("/dashboard");
        return;
      }

      setLoading(true);
      try {
        // Fetch integration data
        const integrationRes = await getIntegrationByName(appName);
        if (!integrationRes || integrationRes.error || !integrationRes.data) {
          const errorMsg = integrationRes?.error || "Integration not found";
          console.error("Failed to fetch integration:", errorMsg);
          throw new Error(errorMsg);
        }
        setIntegration(integrationRes.data as Partial<Integration>);

        // Fetch campaign data
        const campaignRes = await getCampaignById(campaignId);
        if (!campaignRes) {
          console.error("Campaign not found for ID:", campaignId);
          throw new Error("Campaign not found");
        }
        setCampaign(campaignRes);

        console.log("Successfully loaded integration and campaign data");
      } catch (error) {
        console.error("Error in fetchData:", error);
        toast.error(error instanceof Error ? error.message : "Failed to load data");
        router.push("/");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [campaignId, appName, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !campaignId || !appName || !integration?.id) {
      console.error("Missing required fields:", {
        email,
        campaignId,
        appName,
        integrationId: integration?.id
      });
      toast.error("Please provide all required information");
      return;
    }

    setLoading(true);
    try {
      console.log("Attempting to subscribe:", { email, name, campaignId });
      
      const result = await addSubscriber({
        email,
        name: name,
        integrationId: integration?.id,
        campaignId: campaignId,
        source: "THENEWS website-form",
        status: 'Subscribed',
        pageUrl: window.location.href,
      });

      if (result?.error) {
        console.error("Subscription failed:", result.error);
        throw new Error(result.error);
      }

      console.log("Subscription successful for email:", email);
      toast.success('Subscribed successfully!');
      setIsSubmitted(true);
      setEmail("");
      setName("");

    } catch (error) {
      console.error("Error in handleSubmit:", error);
      toast.error(error instanceof Error ? error.message : String(error));
    } finally {
      setLoading(false);
    }
  };

  if (loading && (!campaign || !integration)) {
    return (
     <Loader/>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white shadow-xl">
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome Aboard!</h1>
              <p className="text-gray-600">
                You&apos;ve successfully subscribed to <strong>{integration?.name}</strong>
              </p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-green-800">
                <strong>What&apos;s next?</strong>
                <br />
                Check your email for a confirmation message and get ready for amazing content!
              </p>
            </div>

            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-center justify-center gap-2">
                <Mail className="h-4 w-4" />
                <span>Confirmation email sent to {email || 'subscriber'}</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Bell className="h-4 w-4" />
                <span>You can unsubscribe anytime</span>
              </div>
            </div>

            <Button onClick={() => window.close()} className="mt-6 w-full bg-black text-white hover:bg-gray-800">
              Close Window
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="bg-white shadow-xl">
          <CardHeader className="text-center pb-4">
            <div className="mb-4">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900 capitalize">
                Subscribe to {integration?.name}
              </CardTitle>
              <CardDescription className="text-gray-600 mt-2">
                {campaign?.description ||
                  `Join our newsletter and stay updated with the latest from ${integration?.name}`}
              </CardDescription>
            </div>

            {campaign?.name && (
              <Badge variant="secondary" className="mx-auto">
                {campaign.name}
              </Badge>
            )}
          </CardHeader>

          <CardContent className="p-6 pt-0">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                  Full Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10 border-gray-300 focus:border-black focus:ring-black"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 border-gray-300 focus:border-black focus:ring-black"
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full bg-black text-white hover:bg-gray-800 py-3" disabled={loading}>
                {loading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Subscribing...
                  </div>
                ) : (
                  "Subscribe Now"
                )}
              </Button>
            </form>

            {/* Benefits */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-900 mb-3">What you&apos;ll get:</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <span>Weekly newsletter with curated content</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <span>Exclusive updates and announcements</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <span>No spam, unsubscribe anytime</span>
                </li>
              </ul>
            </div>

            {/* Privacy */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Shield className="h-3 w-3" />
                <span>Your privacy is protected. We never share your information.</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6 text-xs text-gray-500">
          <p>Powered by THENEWS Newsletter System</p>
        </div>
      </div>
    </div>
  );
}
