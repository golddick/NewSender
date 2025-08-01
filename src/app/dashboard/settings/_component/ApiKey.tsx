'use client';

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { ICONS } from "@/shared/utils/icons";
import toast from "react-hot-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import useGetMembership from "@/shared/hooks/useGetMembership";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const ApiKey = () => {
  const { data: membership } = useGetMembership();
  const [apiKey, setApiKey] = useState("");

  useEffect(() => {
    if (membership?.plan !== "FREE") {
      const storedKey = Cookies.get("api_key");
      if (!storedKey) {
        generateApiKeyHandler();
      } else {
        setApiKey(storedKey);
      }
    }
  }, [membership?.plan]);

  const generateApiKeyHandler = async (regenerate = false) => {
    try {
      const res = await fetch(`/api/api-key?regenerate=${regenerate}`, { method: "GET" });
      const json = await res.json();

      if (res.ok) {
        Cookies.set("api_key", json.apiKey);
        setApiKey(json.apiKey);
        if (regenerate) toast.success("API Key updated!");
      } else {
        throw new Error(json.error);
      }
    } catch (error: any) {
      toast.error(error.message || "API Key generation failed");
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(apiKey).then(() => {
      toast.success("Copied to clipboard");
    });
  };

  const handleRegenerateApiKey = () => {
    generateApiKeyHandler(true);
  };

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
            {apiKey || "Generating API Key..."}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <Button
              variant="outline"
              onClick={handleCopy}
              className="flex items-center justify-center gap-2"
            >
              {ICONS.copy}
              Copy
            </Button>

            <Button
              variant="secondary"
              onClick={handleRegenerateApiKey}
              className="flex items-center justify-center gap-2"
            >
              {ICONS.regenerate}
              Regenerate
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApiKey;
