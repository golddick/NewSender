"use client";

import { ICONS } from "@/shared/utils/icons";
import { useUser } from "@clerk/nextjs";
import DashboardItems from "./dashboard.items";
import UserPlan from "./user.plan";

interface DashboardSideBarProps {
  onNavigate?: () => void;
}

const DashboardSideBar = ({onNavigate}:DashboardSideBarProps) => {
  const { user } = useUser();

  return (
    <div className="p-2  bg-gray-100 h-full  fixed top-0 left-0 w-[290px] hidden lg:block overflow-y-scroll">
      <div className="p-2 flex items-center rounded font-playfair ">
        <span className="text-2xl">{ICONS.home}</span>
        <h5 className="pl-2 pt-1 capitalize">{user?.username} Newsletter...</h5>
      </div>
      <div>
        <DashboardItems  onNavigate={onNavigate}/>
        <UserPlan />
        <DashboardItems bottomContent={true} />
      </div>
    </div>
  );
};

export default DashboardSideBar;
