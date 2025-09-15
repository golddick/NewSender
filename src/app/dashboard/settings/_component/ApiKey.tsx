// 'use client';

// import { useEffect, useState } from "react";
// import { ICONS } from "@/shared/utils/icons";
// import toast from "react-hot-toast";
// import useGetMembership from "@/shared/hooks/useGetMembership";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Badge } from "@/components/ui/badge";
// import { AlertTriangle, Calendar, Copy, Eye, EyeOff, Key, Shield } from "lucide-react";
// // import { Shield, Copy, RefreshCw, Key, AlertTriangle, Calendar, User, Eye, EyeOff } from "lucicon-react";

// const ApiKey = () => {
//   const { data: membership } = useGetMembership();
//   const [apiKey, setApiKey] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [showKey, setShowKey] = useState(false);
//   const [keyDetails, setKeyDetails] = useState({
//     createdAt: "",
//     expiresAt: "",
//     userId: "",
//     lastUsed: ""
//   });

//   const fetchApiKey = async () => {
//     try {
//       setLoading(true);
//       const res = await fetch("/api/api-key");
//       const json = await res.json();
//       if (res.ok) {
//         setApiKey(json.apiKey);
//         // Fetch additional key details if available
//         if (json.expiresAt) {
//           setKeyDetails(prev => ({
//             ...prev,
//             expiresAt: json.expiresAt,
//             createdAt: json.createdAt || new Date().toISOString()
//           }));
//         }
//       } else {
//         toast.error(json.error || "Failed to fetch API key");
//       }
//     } catch (err: any) {
//       toast.error(err.message || "Error fetching API key");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleGenerateOrRegenerate = async (regenerate = false) => {
//     try {
//       setLoading(true);
//       const res = await fetch(`/api/api-key?regenerate=${regenerate}`, {
//         method: "GET",
//       });
//       const json = await res.json();

//       if (res.ok) {
//         setApiKey(json.apiKey);
//         setKeyDetails(prev => ({
//           ...prev,
//           expiresAt: json.expiresAt,
//           createdAt: json.createdAt || new Date().toISOString()
//         }));
//         toast.success(regenerate ? "API Key regenerated!" : "API Key created!");
//       } else {
//         toast.error(json.error || "API Key request failed");
//       }
//     } catch (err: any) {
//       toast.error(err.message || "Error creating API key");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCopy = () => {
//     if (!apiKey) return;
//     navigator.clipboard.writeText(apiKey).then(() => {
//       toast.success("Copied to clipboard");
//     });
//   };

//   const toggleKeyVisibility = () => {
//     setShowKey(!showKey);
//   };

//   const formatDate = (dateString: string) => {
//     if (!dateString) return "N/A";
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric'
//     });
//   };

//   useEffect(() => {
//     if (membership?.plan !== "FREE") {
//       fetchApiKey();
//     }
//   }, [membership?.plan]);

//   if (membership?.plan === "FREE") {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4">
//         <Card className="w-full max-w-md shadow-lg border-0">
//           <CardHeader className="bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-t-lg">
//             <CardTitle className="flex items-center gap-2">
//               <Key className="h-5 w-5" /> Upgrade Required
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="p-6 text-center">
//             <div className="bg-amber-100 p-4 rounded-full inline-flex items-center justify-center mb-4">
//               <Key className="h-8 w-8 text-amber-600" />
//             </div>
//             <h3 className="text-lg font-medium text-gray-900 mb-2">API Access Not Available</h3>
//             <p className="text-gray-600 mb-4">
//               Please upgrade your subscription plan to access the API features.
//             </p>
//             <Button className="bg-amber-600 hover:bg-amber-700">
//               Upgrade Plan
//             </Button>
//           </CardContent>
//         </Card>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-4xl mx-auto">
//         <div className="text-center mb-8">
//           <div className="inline-flex items-center justify-center p-4 bg-blue-100 rounded-full mb-4">
//             <Key className="h-8 w-8 text-blue-600" />
//           </div>
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">API Key Management</h1>
//           <p className="text-gray-600">
//             Manage your API keys for authenticating requests to our services.
//           </p>
//         </div>

//         <Card className="shadow-lg border-0">
//           <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
//             <CardTitle className="flex items-center gap-2">
//               <Shield className="h-5 w-5" /> Your API Key
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="p-6">
//             <div className="mb-6">
//               <Label htmlFor="api-key" className="text-sm font-medium text-gray-700 mb-2 block">
//                 API Key
//               </Label>
//               <div className="flex items-center gap-2">
//                 <Input
//                   id="api-key"
//                   value={loading ? "Loading..." : showKey ? apiKey : apiKey ? "•".repeat(32) : "No API Key yet"}
//                   readOnly
//                   className="font-mono bg-gray-50"
//                 />
//                 {apiKey && (
//                   <Button onClick={toggleKeyVisibility} size="icon" variant="outline">
//                     {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
//                   </Button>
//                 )}
//                 {apiKey && (
//                   <Button onClick={handleCopy} size="icon" variant="outline">
//                     <Copy className="h-4 w-4" />
//                   </Button>
//                 )}
//               </div>
//             </div>

//             {apiKey && (
//               <>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//                   <div className="flex flex-col">
//                     <span className="text-sm font-medium text-gray-700 mb-1">Created</span>
//                     <div className="flex items-center gap-2 text-sm text-gray-600">
//                       <Calendar className="h-4 w-4" />
//                       {formatDate(keyDetails.createdAt)}
//                     </div>
//                   </div>
//                   <div className="flex flex-col">
//                     <span className="text-sm font-medium text-gray-700 mb-1">Expires</span>
//                     <div className="flex items-center gap-2 text-sm text-gray-600">
//                       <Calendar className="h-4 w-4" />
//                       {formatDate(keyDetails.expiresAt)}
//                     </div>
//                   </div>
//                 </div>

//                 <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
//                   <div className="flex items-start gap-3">
//                     <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
//                     <div>
//                       <h4 className="font-medium text-amber-800">Security Notice</h4>
//                       <p className="text-sm text-amber-700 mt-1">
//                         Treat your API key as a secret. Do not expose it in client-side code or public repositories.
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </>
//             )}

//             <div className="flex flex-col sm:flex-row gap-3">
//               {apiKey && (
//                 <Button
//                   variant="outline"
//                   onClick={handleCopy}
//                   className="flex items-center justify-center gap-2"
//                   disabled={loading}
//                 >
//                   <Copy className="h-4 w-4" />
//                   Copy
//                 </Button>
//               )}

//               <Button
//                 variant={apiKey ? "secondary" : "default"}
//                 onClick={() => handleGenerateOrRegenerate(!!apiKey)}
//                 className="flex items-center justify-center gap-2"
//                 disabled={loading}
//               >
//                 {loading ? (
//                   <RefreshC className="h-4 w-4 animate-spin" />
//                 ) : (
//                   <RefreshCw className="h-4 w-4" />
//                 )}
//                 {apiKey ? "Regenerate" : "Generate API Key"}
//               </Button>
//             </div>
//           </CardContent>
//         </Card>

//         <Card className="shadow-lg border-0 mt-8">
//           <CardHeader className="bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-t-lg">
//             <CardTitle className="flex items-center gap-2">
//               <Shield className="h-5 w-5" /> API Usage
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="p-6">
//             <div className="prose prose-sm max-w-none">
//               <h3 className="text-lg font-medium text-gray-900 mb-2">Authentication</h3>
//               <p className="text-gray-600 mb-4">
//                 Include your API key in the <Badge variant="outline">X-API-Key</Badge> header for all requests:
//               </p>
              
//               <div className="bg-gray-800 rounded-lg p-4 text-gray-100 font-mono text-sm mb-6">
//                 <pre>curl -H "X-API-Key: your-api-key" https://api.example.com/v1/endpoint</pre>
//               </div>

//               <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
//                 <h4 className="text-blue-800 font-medium flex items-center gap-2">
//                   <AlertTriangle className="h-4 w-4" /> Important
//                 </h4>
//                 <p className="text-blue-700 text-sm mt-1">
//                   Regenerate your API key immediately if you suspect it has been compromised.
//                 </p>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default ApiKey;

"use client";

import { useEffect, useState } from "react";
import { ICONS } from "@/shared/utils/icons";
import toast from "react-hot-toast";
import useGetMembership from "@/shared/hooks/useGetMembership";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const ApiKey = () => {
  const { data: membership } = useGetMembership();
  const [apiKey, setApiKey] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchApiKey = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/api-key");
      const json = await res.json();
      console.log(json, "API Key fetched")
      if (res.ok) {
        setApiKey(json.apiKey);
      } else {
        toast.error(json.error || "Failed to fetch API key");
      }
    } catch (err: any) {
      toast.error(err.message || "Error fetching API key");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateOrRegenerate = async (regenerate = false) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/api-key?regenerate=${regenerate}`, {
        method: "GET",
      });
      const json = await res.json();

      if (res.ok) {
        setApiKey(json.apiKey);
        console.log(apiKey, "Generated API Key:", )
        toast.success(regenerate ? "API Key regenerated!" : "API Key created!");
      } else {
        toast.error(json.error || "API Key request failed");
      }
    } catch (err: any) {
      toast.error(err.message || "Error creating API key");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(apiKey).then(() => {
      toast.success("Copied to clipboard");
    });
  };

  useEffect(() => {
    if (membership?.plan !== "FREE") {
      fetchApiKey();
    }
  }, [membership?.plan]);

  if (membership?.plan === "FREE") {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4">
        <h3 className="text-lg md:text-xl font-semibold text-gray-700">
          Please upgrade your subscription plan to access the API.
        </h3>
      </div>
    );
  }

  return (
    <div className="flex justify-center px-4">
      <Card className="w-full max-w-2xl shadow-lg border rounded-lg bg-white">
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl font-bold text-gray-800">
            API Key Access
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-500">
            Use your API key to authenticate requests. Keep it safe and do not share it publicly.
          </p>

          <div className="bg-gray-100 p-3 rounded-lg border text-sm font-mono break-all">
            {loading ? "Loading..." : apiKey || "No API Key yet"}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            {apiKey && (
              <Button
                variant="outline"
                onClick={handleCopy}
                className="flex items-center justify-center gap-2"
              >
                {ICONS.copy}
                Copy
              </Button>
            )}

            <Button
              variant="secondary"
              onClick={() => handleGenerateOrRegenerate(!!apiKey)}
              className="flex items-center justify-center gap-2"
            >
              {ICONS.regenerate}
              {apiKey ? "Regenerate" : "Generate"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApiKey;
