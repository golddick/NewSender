


'use client';

import SettingsTab from "@/shared/components/tabs/settings.tabs";
import useGetMembership from "@/shared/hooks/useGetMembership";
import useSettingsFilter from "@/shared/hooks/useSettingsFilter";
import { UserProfile } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { ICONS } from "@/shared/utils/icons";
import toast from "react-hot-toast";
import { ScrollArea } from "@/components/ui/scroll-area";

const Page = () => {
  const { activeItem } = useSettingsFilter();
  const { data } = useGetMembership();
  const [apiKey, setApiKey] = useState("");

  useEffect(() => {
    const storedKey = Cookies.get("api_key");
    if (!storedKey) {
      generateApiKeyHandler();
    } else {
      setApiKey(storedKey);
    }
  }, []);

  const generateApiKeyHandler = async (regenerate = false) => {
    try {
      const res = await fetch(`/api/api-key?regenerate=${regenerate}`, {
        method: "GET",
      });
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
    const textToCopy = apiKey;
    navigator.clipboard.writeText(textToCopy).then(() => {
      toast.success("Copied");
    });
  };

  const handleRegenerateApiKey = () => {
    generateApiKeyHandler(true);
  };

  return (
    <div className="w-full p-5">
      <SettingsTab />
      {activeItem === "Customize Profile" && (
        <div className="w-full flex justify-center">
          <UserProfile />
        </div>
      )}
      {activeItem === "API Access" && (
        <div>
          {data?.plan === "FREE" ? (
            <div className="w-full h-[90vh] flex items-center justify-center">
              <h3>
                Please update your subscription plan to get access of API...!
              </h3>
            </div>
          ) : (
            <div className="p-4 w-full overflow-hidden">
              <h3>API KEY:</h3>
              <ScrollArea className="max-h-[200px] w-full rounded-md border p-4 whitespace-pre-line break-words copy-text flex-wrap flex">
                {apiKey}
              </ScrollArea>
              <div className="flex items-center">
                <div
                  className="h-[38px] w-[90px] rounded my-3 cursor-pointer bg-[#DFE7FF] flex items-center justify-center"
                  onClick={handleCopy}
                >
                  <span className="text-lg">{ICONS.copy}</span>
                  <span className="pl-1">copy</span>
                </div>
                <div
                  className="h-[38px] w-[120px] ml-4 rounded my-3 cursor-pointer bg-[#DFE7FF] flex items-center justify-center"
                  onClick={handleRegenerateApiKey}
                >
                  <span className="text-lg">{ICONS.regenerate}</span>
                  <span className="pl-1">Regenerate</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Page;
