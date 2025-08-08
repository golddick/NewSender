// import useSettingsFilter from "@/shared/hooks/useSettingsFilter";
// import { Tab, Tabs } from "@nextui-org/react";

// const SettingsTab = () => {
//   const { activeItem, setActiveItem } = useSettingsFilter();

//   return (
//     <Tabs
//       variant={"underlined"}
//       aria-label="Tabs variants"
//       selectedKey={activeItem}
//       onSelectionChange={(key) => setActiveItem(String(key))}
//       className=" w-full flex items-center gap-x-2  flex-wrap bg-yellow-300"
//     >
//       <Tab key="API Access" title="API Access" />
//       <Tab key="Customize Profile" title="Customize Profile" />
//       <Tab key="KYC" title="KYC" />
//       <Tab key="Subscription" title="Subscription" />
//       <Tab key="Notification" title="Notification" />
//     </Tabs>
//   );
// };

// export default SettingsTab;


import useSettingsFilter from "@/shared/hooks/useSettingsFilter";
import { Tab, Tabs } from "@nextui-org/react";
import { useMediaQuery } from "@/hooks/use-media-query";

const SettingsTab = () => {
  const { activeItem, setActiveItem } = useSettingsFilter();
  const isMobile = useMediaQuery("(max-width: 640px)");
  const isTablet = useMediaQuery("(min-width: 641px) and (max-width: 1024px)");

  return (
    <div className="w-full overflow-x-auto pb-2">
      <Tabs
        variant="underlined"
        aria-label="Settings tabs"
        selectedKey={activeItem}
        onSelectionChange={(key) => setActiveItem(String(key))}
        classNames={{
          base: "w-full",
          tabList: `flex-nowrap ${isMobile ? "gap-1" : "gap-4"}`,
          tab: `${isMobile ? "px-2 py-1 text-sm" : "px-4 py-2"}`,
          cursor: "bg-primary",
        }}
        size={isMobile ? "sm" : "md"}
      >
        <Tab 
          key="API Access" 
          title="API Access" 
          className="whitespace-nowrap"
        />
        <Tab 
          key="Customize Profile" 
          title={isMobile ? "Profile" : "Customize Profile"} 
          className="whitespace-nowrap"
        />
        <Tab 
          key="KYC" 
          title="KYC" 
          className="whitespace-nowrap"
        />
        <Tab 
          key="Subscription" 
          title={isMobile ? "Subscription" : "Subscription"} 
          className="whitespace-nowrap"
        />
        <Tab 
          key="Notification" 
          title={isMobile ? "Notification" : "Notification"} 
          className="whitespace-nowrap"
        />
      </Tabs>
    </div>
  );
};

export default SettingsTab;