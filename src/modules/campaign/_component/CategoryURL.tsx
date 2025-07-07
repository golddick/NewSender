
"use client";

import { getIntegrationsWithCampaigns } from "@/actions/application-Integration/application";
import Loader from "@/components/Loader";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@clerk/nextjs";
import { Campaign, Integration } from "@prisma/client";
import { CopyCheckIcon, CopyIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const MyCampaigns = () => {
  const { user } = useUser();
  const [copied, setCopied] = useState<string | null>(null);
  type IntegrationWithCampaigns = Omit<Integration, "createdAt" | "updatedAt" | "recipients" | "userId"> & {
    campaigns: Campaign[];
  };
  
  const [integrations, setIntegrations] = useState<IntegrationWithCampaigns[]>([]);
  const [loading, setLoading] = useState(true);

  // const baseUrl = process.env.NEXT_PUBLIC_WEBSITE_URL || "http://localhost:3003";
  const baseUrl = "http://localhost:3003";

  useEffect(() => {
    const fetchData = async () => { 
      if (!user?.id) return;

      try {
        setLoading(true);
        const result = await getIntegrationsWithCampaigns(user.id);

        
          if (!result) {
            toast.error("No response received");
            return;
          }
        
        if (result.error) {
          toast.error(result.error);
          return;
        }

        if (result.data) {
          // Ensure campaigns is an array of Campaign objects
          setIntegrations(
            result.data.map((integration: any) => ({
              ...integration,
              campaigns: Array.isArray(integration.campaigns)
                ? integration.campaigns.map((c: any) => ({
                    ...c,
                    // Optionally, ensure createdAt is a Date object if needed:
                    createdAt: c.createdAt ? new Date(c.createdAt) : undefined,
                  }))
                : [],
            }))
          );
        }
      } catch (error) {
        toast.error("Error loading data");
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleCopy = async (url: string, id: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(id);
      toast.success("URL copied to clipboard!");
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      toast.error("Failed to copy URL");
    }
  };

  if (loading) {
    return (
     <Loader/>
    );
  }

  return (
    <div className="w-full p-6">
      <h1 className="text-3xl font-bold mb-6">Generated Subscription Links</h1>

      {integrations.length === 0 ? (
        <p className="text-gray-600">No integrations with campaigns found</p>
      ) : (
        <div className="space-y-6">
          {integrations.map((integration) => (
            <div key={integration.id} className=" rounded p-4 bg-white ">
              <div className="flex items-center gap-3 mb-3">
                {integration.logo && (
                  <div className=" relative w-8 h-8  rounded">
                  <Image
                    fill 
                    src={integration.logo} 
                    alt={integration.name}
                    className=" rounded absolute object-contain"
                  />
                    </div>
                )}
                <Badge className="text-xl font-semibold capitalize">{integration.name}</Badge>
              </div>
              
              {Array.isArray(integration.campaigns) && integration.campaigns.length > 0 ? (
                <div className="space-y-3 border shadow-md rounded-md p-4">
                  {integration.campaigns.map((campaign: Campaign) => {
                  const subscribeUrl = `${baseUrl}/subscribe?appName=${integration.name}&campaignId=${campaign.id}`;
                  return (
                    <div key={campaign.id} className="flex justify-between items-center pl-2">
                    <div>
                      <p className="text-sm font-medium">{campaign.name}</p>
                      <p className="text-xs text-gray-500 break-all">{subscribeUrl}</p>
                    </div>
                    <button
                      onClick={() => handleCopy(subscribeUrl, campaign.id)}
                      className="p-2 rounded hover:bg-gray-100"
                      aria-label="Copy subscription URL"
                    >
                      {copied === campaign.id ? (
                      <CopyCheckIcon size={16} className="text-green-500" />
                      ) : (
                      <CopyIcon size={16} />
                      )}
                    </button>
                    </div>
                  );
                  })}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No campaigns for this integration</p>
              )}
            </div>
          ))}


        

        </div>
      )}
    </div>
  );
};

export default MyCampaigns;