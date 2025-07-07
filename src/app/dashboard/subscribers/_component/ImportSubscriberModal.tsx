// "use client";

// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { useEffect, useState } from "react";
// import { Upload } from "lucide-react";
// import ImportCSVBTN from "./exportCSVBTN";
// import { getCampaignsByIntegrationId } from "@/actions/campaign/get-campaign";
// import toast from "react-hot-toast";
// import { Alert, AlertDescription } from "@/components/ui/alert";


// interface ImportSubscriberModalProps {
//   newsletterOwnerId?: string;
//   integrations: {
//     id: string;
//     name: string;
//     logo: string | null;
//   }[];
//   onImportComplete: () => void;
// }

// export function ImportSubscriberModal({
//   newsletterOwnerId,
//   integrations,
//   onImportComplete,
// }: ImportSubscriberModalProps) {
//   const [selectedIntegrationId, setSelectedIntegrationId] = useState<string>("");
//   const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
//   const [campaigns, setCampaigns] = useState<{ id: string; name: string }[]>([]);
//   const [open, setOpen] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [importStatus, setImportStatus] = useState<{
//   success: boolean;
//   message: string;
//   invalidEntries?: string[];
//   count?: number;
//   duplicateCount?: number;
//   duplicateEmails?: string[];
//   existingEmails?: string[];
// } | null>(null);


//   // if (!newsletterOwnerId) return null;

//   // Fetch campaigns when integration changes
//   useEffect(() => {
//     const fetchCampaigns = async () => {
//       if (!selectedIntegrationId) {
//         setCampaigns([]);
//         return;
//       }

//       try {
//         setError(null);
//         const result = await getCampaignsByIntegrationId(selectedIntegrationId);
//         if (result?.error) {
//           setError(result.error);
//           toast.error(result.error);
//           setCampaigns([]);
//         } else {
//           setCampaigns(result.data || []);
//         }
//       } catch (err) {
//         const errorMessage = "Failed to fetch campaigns";
//         setError(errorMessage);
//         toast.error(errorMessage);
//         console.error(errorMessage, err);
//         setCampaigns([]);
//       }
//     };

//     fetchCampaigns();
//   }, [selectedIntegrationId]);

//   const resetSelection = () => {
//     setSelectedIntegrationId("");
//     setSelectedCampaignId(null);
//     setCampaigns([]);
//     setError(null);
//     setImportStatus(null);
//   };

//   const handleImportComplete = (status: {
//     success: boolean;
//     message: string;
//     invalidEntries?: string[];
//     count?: number;
//     duplicateCount?: number;
//   }) => {
//     setImportStatus(status);
    
//     if (status.success) {
//     toast.success(status.message)
//       onImportComplete();
//       setOpen(false);
//       resetSelection();
//     } else {

//     toast.error(status.message);
//     }
//   };


//   return (
//     <Dialog
//       open={open}
//       onOpenChange={(isOpen) => {
//         setOpen(isOpen);
//         if (!isOpen) resetSelection();
//       }}
//     >
//       <DialogTrigger asChild>
//         <Button
//           variant="outline"
//           className="border-gold-600 text-gold-600 hover:bg-blue-50"
//         >
//           <Upload className="h-4 w-4 mr-2" />
//           Import CSV/Excel
//         </Button>
//       </DialogTrigger>
//       <DialogContent className="max-h-[80vh] overflow-y-auto">
//         <DialogHeader>
//           <DialogTitle>Import Subscribers</DialogTitle>
//         </DialogHeader>

//         <div className="space-y-4">
//           {/* Display persistent errors */}
//           {error && (
//             <Alert variant="destructive">
//               <AlertDescription>{error}</AlertDescription>
//             </Alert>
//           )}


          // {/* Display detailed import status */}
          //   {importStatus && (
          //   <Alert variant={importStatus.success ? "default" : "destructive"}>
          //       <AlertDescription>
          //       <div className="font-medium">{importStatus.message}</div>

          //       {importStatus.duplicateEmails && importStatus.duplicateEmails.length > 0 && (
          //           <div className="mt-2">
          //           <p className="font-medium">Duplicate Emails:</p>
          //           <ul className="list-disc pl-5 max-h-40 overflow-y-auto text-sm text-muted-foreground">
          //               {importStatus.duplicateEmails.map((email, index) => (
          //               <li key={`dup-${index}`}>{email}</li>
          //               ))}
          //           </ul>
          //           </div>
          //       )}

          //       {importStatus.existingEmails && importStatus.existingEmails.length > 0 && (
          //           <div className="mt-2">
          //           <p className="font-medium">Already Existing Emails:</p>
          //           <ul className="list-disc pl-5 max-h-40 overflow-y-auto text-sm text-muted-foreground">
          //               {importStatus.existingEmails.map((email, index) => (
          //               <li key={`exist-${index}`}>{email}</li>
          //               ))}
          //           </ul>
          //           </div>
          //       )}

          //       {importStatus.invalidEntries && importStatus.invalidEntries.length > 0 && (
          //           <div className="mt-2">
          //           <p className="font-medium">Invalid Entries:</p>
          //           <ul className="list-disc pl-5 max-h-40 overflow-y-auto text-sm text-muted-foreground">
          //               {importStatus.invalidEntries.map((entry, index) => (
          //               <li key={`invalid-${index}`}>{entry}</li>
          //               ))}
          //           </ul>
          //           </div>
          //       )}
          //       </AlertDescription>
          //   </Alert>
          //   )}

          

//           {/* Integration Select */}
//           <div>
//             <label className="block text-sm font-medium mb-1">Integration</label>
//             <Select
//               value={selectedIntegrationId}
//               onValueChange={(value) => {
//                 setSelectedIntegrationId(value);
//                 setSelectedCampaignId(null);
//                 setError(null);
//                 setImportStatus(null);
//               }}
//             >
//               <SelectTrigger>
//                 <SelectValue placeholder="Select integration" />
//               </SelectTrigger>
//               <SelectContent>
//                 {integrations.map((integration) => (
//                   <SelectItem key={integration.id} value={integration.id}>
//                     {integration.name}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>

//           {/* Campaign Select */}
//           {selectedIntegrationId && (
//             <div>
//               <label className="block text-sm font-medium mb-1">
//                 Campaign (Optional)
//               </label>
//               <Select
//                 value={selectedCampaignId || "none"}
//                 onValueChange={(value) => {
//                   setSelectedCampaignId(value === "none" ? null : value);
//                   setError(null);
//                   setImportStatus(null);
//                 }}
//               >
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select campaign (optional)" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="none">No Campaign</SelectItem>
//                   {campaigns.map((campaign) => (
//                     <SelectItem key={campaign.id} value={campaign.id}>
//                       {campaign.name}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//           )}

//           {/* Import Button */}

//            {selectedIntegrationId && (
//             <ImportCSVBTN
//               newsletterOwnerId={newsletterOwnerId}
//               integrationId={selectedIntegrationId}
//               campaignId={selectedCampaignId}
//               onImportComplete={handleImportComplete}
//             />
//           )}
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }



"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload } from "lucide-react";
import ImportCSVBTN from "./exportCSVBTN";
import { getCampaignsByIntegrationId } from "@/actions/campaign/get-campaign";
import toast from "react-hot-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ImportSubscriberModalProps {
  newsletterOwnerId?: string;
  integrations: {
    id: string;
    name: string;
    logo: string | null;
  }[];
  onImportComplete: () => void;
}

export function ImportSubscriberModal({
  newsletterOwnerId,
  integrations,
  onImportComplete,
}: ImportSubscriberModalProps) {
  const [selectedIntegrationId, setSelectedIntegrationId] = useState<string>("");
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
  const [campaigns, setCampaigns] = useState<{ id: string; name: string }[]>([]);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [importStatus, setImportStatus] = useState<{
    success: boolean;
    message: string;
    invalidEntries?: string[];
    count?: number;
    duplicateCount?: number;
    duplicateEmails?: string[];
    existingEmails?: string[];
  } | null>(null);

  // ✅ useEffect is always called regardless of condition
  useEffect(() => {
    if (!selectedIntegrationId) {
      setCampaigns([]);
      return;
    }

    const fetchCampaigns = async () => {
      try {
        setError(null);
        const result = await getCampaignsByIntegrationId(selectedIntegrationId);
        if (result?.error) {
          setError(result.error);
          toast.error(result.error);
          setCampaigns([]);
        } else {
          setCampaigns(result.data || []);
        }
      } catch (err) {
        const errorMessage = "Failed to fetch campaigns";
        setError(errorMessage);
        toast.error(errorMessage);
        console.error(errorMessage, err);
        setCampaigns([]);
      }
    };

    fetchCampaigns();
  }, [selectedIntegrationId]);

  const resetSelection = () => {
    setSelectedIntegrationId("");
    setSelectedCampaignId(null);
    setCampaigns([]);
    setError(null);
    setImportStatus(null);
  };

  const handleImportComplete = (status: {
    success: boolean;
    message: string;
    invalidEntries?: string[];
    count?: number;
    duplicateCount?: number;
  }) => {
    setImportStatus(status);
    if (status.success) {
      toast.success(status.message);
      onImportComplete();
      setOpen(false);
      resetSelection();
    } else {
      toast.error(status.message);
    }
  };

  // ✅ Now only render if valid
  if (!newsletterOwnerId) {
    return (
      <Button variant="outline" disabled>
        <Upload className="h-4 w-4 mr-2" />
        Import CSV/Excel
      </Button>
    );
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) resetSelection();
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline" className="border-gold-600 text-gold-600 hover:bg-blue-50">
          <Upload className="h-4 w-4 mr-2" />
          Import CSV/Excel
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Import Subscribers</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

                   {/* Display detailed import status */}
            {importStatus && (
            <Alert variant={importStatus.success ? "default" : "destructive"}>
                <AlertDescription>
                <div className="font-medium">{importStatus.message}</div>

                {importStatus.duplicateEmails && importStatus.duplicateEmails.length > 0 && (
                    <div className="mt-2">
                    <p className="font-medium">Duplicate Emails:</p>
                    <ul className="list-disc pl-5 max-h-40 overflow-y-auto text-sm text-muted-foreground">
                        {importStatus.duplicateEmails.map((email, index) => (
                        <li key={`dup-${index}`}>{email}</li>
                        ))}
                    </ul>
                    </div>
                )}

                {importStatus.existingEmails && importStatus.existingEmails.length > 0 && (
                    <div className="mt-2">
                    <p className="font-medium">Already Existing Emails:</p>
                    <ul className="list-disc pl-5 max-h-40 overflow-y-auto text-sm text-muted-foreground">
                        {importStatus.existingEmails.map((email, index) => (
                        <li key={`exist-${index}`}>{email}</li>
                        ))}
                    </ul>
                    </div>
                )}

                {importStatus.invalidEntries && importStatus.invalidEntries.length > 0 && (
                    <div className="mt-2">
                    <p className="font-medium">Invalid Entries:</p>
                    <ul className="list-disc pl-5 max-h-40 overflow-y-auto text-sm text-muted-foreground">
                        {importStatus.invalidEntries.map((entry, index) => (
                        <li key={`invalid-${index}`}>{entry}</li>
                        ))}
                    </ul>
                    </div>
                )}
                </AlertDescription>
            </Alert>
            )}

          {/* Integration Select */}
          <div>
            <label className="block text-sm font-medium mb-1">Integration</label>
            <Select
              value={selectedIntegrationId}
              onValueChange={(value) => {
                setSelectedIntegrationId(value);
                setSelectedCampaignId(null);
                setError(null);
                setImportStatus(null);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select integration" />
              </SelectTrigger>
              <SelectContent>
                {integrations.map((integration) => (
                  <SelectItem key={integration.id} value={integration.id}>
                    {integration.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Campaign Select */}
          {selectedIntegrationId && (
            <div>
              <label className="block text-sm font-medium mb-1">Campaign (Optional)</label>
              <Select
                value={selectedCampaignId || "none"}
                onValueChange={(value) => {
                  setSelectedCampaignId(value === "none" ? null : value);
                  setError(null);
                  setImportStatus(null);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select campaign (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Campaign</SelectItem>
                  {campaigns.map((campaign) => (
                    <SelectItem key={campaign.id} value={campaign.id}>
                      {campaign.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {selectedIntegrationId && (
            <ImportCSVBTN
              newsletterOwnerId={newsletterOwnerId}
              integrationId={selectedIntegrationId}
              campaignId={selectedCampaignId}
              onImportComplete={handleImportComplete}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
