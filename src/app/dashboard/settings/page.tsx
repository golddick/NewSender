


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
import { SubscriptionSettings } from "./_component/Sub-management";
import KYCPage from "./_component/KYC";
// import { NotificationEmailList } from "./_component/Notification-Management";
import ApiKey from "./_component/ApiKey";
import { NotificationCenter } from "./_component/Notification-Management";

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
    <div className=" w-full ">
          
      <SettingsTab />
    <div className=" mt-5">
        {activeItem === "Customize Profile" && (
        <div className="w-full flex justify-center">
          <UserProfile />
        </div>
      )}
      {activeItem === "API Access" && (
        <ApiKey />
      )}

      {activeItem === "KYC" && (
        <div className="w-full  flex items-center justify-center overflow-y-auto m-auto mt-10 ">
          <KYCPage/>
        </div>
      )}

      {activeItem === "Subscription Management" && (
        <div className="w-full  flex items-center justify-center overflow-y-auto m-auto mt-10 ">
          <SubscriptionSettings/>
        </div>
      )}

      {activeItem === "Notification" && (
        <div className="w-full  flex items-center justify-center overflow-y-auto m-auto mt-10 ">
          <NotificationCenter/>
        </div>
      )}
    </div>
    </div>
  );
};

export default Page;
