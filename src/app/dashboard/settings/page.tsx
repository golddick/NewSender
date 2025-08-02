


// 'use client';

// import SettingsTab from "@/shared/components/tabs/settings.tabs";
// import useGetMembership from "@/shared/hooks/useGetMembership";
// import useSettingsFilter from "@/shared/hooks/useSettingsFilter";
// import { UserProfile } from "@clerk/nextjs";
// import { useEffect, useState } from "react";
// import Cookies from "js-cookie";
// import { ICONS } from "@/shared/utils/icons";
// import toast from "react-hot-toast";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { SubscriptionSettings } from "./_component/Sub-management";
// import KYCPage from "./_component/KYC";
// // import { NotificationEmailList } from "./_component/Notification-Management";
// import ApiKey from "./_component/ApiKey";
// import { NotificationCenter } from "./_component/Notification-Management";
// import { useSearchParams } from "next/navigation";

// const Page = () => {
//  const { activeItem, setActiveItem } = useSettingsFilter();
// const searchParams = useSearchParams();

// useEffect(() => {
//   const tab = searchParams.get("tab");
//   if (tab) {
//     setActiveItem(tab); 
//   }
// }, [searchParams]);



//   return (
//     <div className=" w-full ">
          
//       <SettingsTab />
//     <div className=" mt-5">
//         {activeItem === "Customize Profile" && (
//         <div className="w-full flex justify-center">
//           <UserProfile />
//         </div>
//       )}
//       {activeItem === "API Access" && (
//         <ApiKey />
//       )}

//       {activeItem === "KYC" && (
//         <div className="w-full  flex items-center justify-center overflow-y-auto m-auto mt-10 ">
//           <KYCPage/>
//         </div>
//       )}

//       {activeItem === "Subscription Management" && (
//         <div className="w-full  flex items-center justify-center overflow-y-auto m-auto mt-10 ">
//           <SubscriptionSettings/>
//         </div>
//       )}

//       {activeItem === "Notification" && (
//         <div className="w-full  flex items-center justify-center overflow-y-auto m-auto mt-10 ">
//           <NotificationCenter/>
//         </div>
//       )}
//     </div>
//     </div>
//   );
// };

// export default Page;











'use client';

import { Suspense } from "react";
import SettingsTab from "@/shared/components/tabs/settings.tabs";
import useGetMembership from "@/shared/hooks/useGetMembership";
import useSettingsFilter from "@/shared/hooks/useSettingsFilter";
import { UserProfile } from "@clerk/nextjs";
import { useEffect } from "react";
import { SubscriptionSettings } from "./_component/Sub-management";
import KYCPage from "./_component/KYC";
import ApiKey from "./_component/ApiKey";
import { NotificationCenter } from "./_component/Notification-Management";
import { useSearchParams } from "next/navigation";
import Loader from "@/components/Loader";

function SettingsContent() {
  const { activeItem, setActiveItem } = useSettingsFilter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab) {
      setActiveItem(tab);
    }
  }, [searchParams]);

  return (
    <div className="w-full">
      <SettingsTab />
      <div className="mt-5">
        {activeItem === "Customize Profile" && (
          <div className="w-full flex justify-center">
            <UserProfile />
          </div>
        )}
        {activeItem === "API Access" && <ApiKey />}
        {activeItem === "KYC" && (
          <div className="w-full flex items-center justify-center overflow-y-auto m-auto mt-10 ">
            <KYCPage />
          </div>
        )}
        {activeItem === "Subscription Management" && (
          <div className="w-full flex items-center justify-center overflow-y-auto m-auto mt-10 ">
            <SubscriptionSettings />
          </div>
        )}
        {activeItem === "Notification" && (
          <div className="w-full flex items-center justify-center overflow-y-auto m-auto mt-10 ">
            <NotificationCenter />
          </div>
        )}
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div><Loader/></div>}>
      <SettingsContent />
    </Suspense>
  );
}

