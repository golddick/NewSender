"use client";

import Loader from "@/components/Loader";
import { useUser } from "@clerk/nextjs";
import { CopyCheckIcon, CopyIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const MyCampaigns = () => {
  const { user } = useUser();
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  // const baseUrl = process.env.NEXT_PUBLIC_WEBSITE_URL || "http://localhost:3003";
  const baseUrl =  "http://localhost:3003";
  const subscribeUrl = `${baseUrl}/subscribe?userId=${user?.id}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(subscribeUrl);
      setCopied(true);
      toast.success("URL copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy URL");
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="w-full p-6">
      <h1 className="text-3xl font-bold mb-6">Generated Subscription Link</h1>

      <div className="rounded p-4 bg-white shadow border">
        <p className="text-sm font-medium mb-1">Your subscription URL:</p>
        <p className="text-xs text-gray-500 break-all mb-3">{subscribeUrl}</p>

        <button
          onClick={handleCopy}
          className="flex items-center gap-2 p-2 rounded hover:bg-gray-100"
          aria-label="Copy subscription URL"
        >
          {copied ? (
            <>
              <CopyCheckIcon size={16} className="text-green-500" /> Copied!
            </>
          ) : (
            <>
              <CopyIcon size={16} /> Copy
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default MyCampaigns;



















// import React from 'react'

// const CategoryURL = () => {
//   return (
//     <div>
//       urlllll
//     </div>
//   )
// }

// export default CategoryURL
