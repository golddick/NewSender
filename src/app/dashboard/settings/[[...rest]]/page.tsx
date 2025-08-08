

// 'use client';

// import { Suspense } from "react";
// import SettingsTab from "@/shared/components/tabs/settings.tabs";
// import useGetMembership from "@/shared/hooks/useGetMembership";
// import useSettingsFilter from "@/shared/hooks/useSettingsFilter";
// import { UserProfile } from "@clerk/nextjs";
// import { useEffect } from "react";
// import { SubscriptionSettings } from "../_component/Sub-management";
// import KYCPage from "../_component/KYC";
// import ApiKey from "../_component/ApiKey";
// import { NotificationCenter } from "../_component/Notification-Management";
// import { useSearchParams } from "next/navigation";
// import Loader from "@/components/Loader";

// function SettingsContent() {
//   const { activeItem, setActiveItem } = useSettingsFilter();
//   const searchParams = useSearchParams();

//   useEffect(() => {
//     const tab = searchParams.get("tab");
//     if (tab) {
//       setActiveItem(tab);
//     }
//   }, [searchParams, setActiveItem]);

//   return (
//     <div className="w-full">
//       <SettingsTab />
//       <div className="mt-5">
//         {activeItem === "Customize Profile" && (
//           <div className="w-full flex justify-center">
//             <UserProfile />
//           </div>
//         )}
//         {activeItem === "API Access" && <ApiKey />}
//         {activeItem === "KYC" && (
//           <div className="w-full flex items-center justify-center overflow-y-auto m-auto mt-10 ">
//             <KYCPage />
//           </div>
//         )}
//         {activeItem === "Subscription Management" && (
//           <div className="w-full flex items-center justify-center overflow-y-auto m-auto mt-10 ">
//             <SubscriptionSettings />
//           </div>
//         )}
//         {activeItem === "Notification" && (
//           <div className="w-full flex items-center justify-center overflow-y-auto m-auto mt-10 ">
//             <NotificationCenter />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default function Page() {
//   return (
//     <Suspense fallback={<div><Loader/></div>}>
//       <SettingsContent />
//     </Suspense>
//   );
// }




'use client';

import { Suspense } from "react";
import SettingsTab from "@/shared/components/tabs/settings.tabs";
import useGetMembership from "@/shared/hooks/useGetMembership";
import useSettingsFilter from "@/shared/hooks/useSettingsFilter";
import { UserProfile } from "@clerk/nextjs";
import { useEffect } from "react";
import { SubscriptionSettings } from "../_component/Sub-management";
import KYCPage from "../_component/KYC";
import ApiKey from "../_component/ApiKey";
import { NotificationCenter } from "../_component/Notification-Management";
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
  }, [searchParams, setActiveItem]);

  return (
    <div className="w-full  mx-auto px-4  lg:px-8 ">
      {/* Settings Tab - Responsive */}
      <div className="overflow-x-auto ">
        <SettingsTab />
      </div>

      {/* Content Area - Responsive */}
      <div className="mt-5 pb-10 ">
        {activeItem === "Customize Profile" && (
          <div className="w-full flex justify-center">
              <UserProfile />
          </div>
        )}
        
        {activeItem === "API Access" && (
          <div className="">
            <ApiKey />
          </div>
        )}
        
        {activeItem === "KYC" && (
          <div className="w-full ">
           
              <KYCPage />
              
          </div>
        )}
        
        {activeItem === "Subscription" && (
          <div className="w-full">
              <SubscriptionSettings />
          </div>
        )}
        
        {activeItem === "Notification" && (
          <div className="w-full ">
              <NotificationCenter />
          </div>
        )}
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={
      <div >
        <Loader/>
      </div>
    }>
      <SettingsContent />
    </Suspense>
  );
}








// 'use client';

// import { Suspense } from "react";
// import SettingsTab from "@/shared/components/tabs/settings.tabs";
// import useSettingsFilter from "@/shared/hooks/useSettingsFilter";
// import { UserProfile } from "@clerk/nextjs";
// import { useEffect } from "react";
// import { SubscriptionSettings } from "../_component/Sub-management";
// import KYCPage from "../_component/KYC";
// import ApiKey from "../_component/ApiKey";
// import { NotificationCenter } from "../_component/Notification-Management";
// import { useSearchParams } from "next/navigation";
// import Loader from "@/components/Loader";
// import { useMediaQuery } from "@/hooks/use-media-query";

// function SettingsContent() {
//   const { activeItem, setActiveItem } = useSettingsFilter();
//   const searchParams = useSearchParams();
//   const isMobile = useMediaQuery("(max-width: 640px)");
//   const isTablet = useMediaQuery("(min-width: 641px) and (max-width: 1024px)");

//   useEffect(() => {
//     const tab = searchParams.get("tab");
//     if (tab) {
//       setActiveItem(tab);
//     }
//   }, [searchParams, setActiveItem]);

//   // Responsive width classes based on device
//   const getContentWidthClass = () => {
//     if (isMobile) return "w-full px-4";
//     if (isTablet) return "w-full max-w-3xl px-6";
//     return "w-full max-w-4xl px-0";
//   };

//   return (
//     <div className={`w-full mx-auto ${isMobile ? 'px-2' : 'px-6'}`}>
//       {/* Responsive Settings Tab */}
//       <div className={`${isMobile ? 'overflow-x-auto py-2' : ''}`}>
//         <SettingsTab />
//       </div>

//       {/* Responsive Content Area */}
//       <div className={`mt-5 pb-10 ${getContentWidthClass()} mx-auto`}>
//         {activeItem === "Customize Profile" && (
//           <div className="flex justify-center">
//             <div className={isMobile ? "w-full" : "w-full max-w-4xl"}>
//               <UserProfile />
//             </div>
//           </div>
//         )}
        
//         {activeItem === "API Access" && <ApiKey />}
        
//         {activeItem === "KYC" && (
//           <div className={isMobile ? "w-full" : "w-full max-w-4xl mx-auto"}>
//             <KYCPage />
//           </div>
//         )}
        
//         {activeItem === "Subscription Management" && (
//           <div className={isMobile ? "w-full" : "w-full max-w-4xl mx-auto"}>
//             <SubscriptionSettings />
//           </div>
//         )}
        
//         {activeItem === "Notification" && (
//           <div className={isMobile ? "w-full" : "w-full max-w-4xl mx-auto"}>
//             <NotificationCenter />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default function Page() {
//   return (
//     <Suspense fallback={
//       <div className="min-h-screen flex items-center justify-center">
//         <Loader/>
//       </div>
//     }>
//       <SettingsContent />
//     </Suspense>
//   );
// }

