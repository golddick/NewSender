'use client'


import { AdminsideBarBottomItems, AdminsideBarItems, sideBarBottomItems, sideBarItems } from "@/app/configs/constants";
import useRouteChange from "@/shared/hooks/useRouteChange";
import { ICONS } from "@/shared/utils/icons";
import { useClerk } from "@clerk/nextjs";
import Link from "next/link";
import { redirect, usePathname } from "next/navigation";
import { useEffect } from "react";

interface DashboardSideBarProps {
  onNavigate?: () => void;
  bottomContent?: boolean;
}

const AdminSidebarItems = ({onNavigate, bottomContent}:DashboardSideBarProps) => {
  const { activeRoute, setActiveRoute } = useRouteChange();
  const { signOut, user } = useClerk();
  const pathName = usePathname();

  const LogoutHandler = () => {
    signOut();
    redirect("/sign-in");
  };

  useEffect(() => {
    setActiveRoute(pathName);
  }, [pathName, setActiveRoute]);

  return (
    <>
      {!bottomContent ? (
        <>
          {AdminsideBarItems.map((item: DashboardSideBarTypes, index: number) => (
          <Link
          key={index}
          href={item.url}
          onClick={onNavigate}
          className={`text-xl p-2 py-5 flex rounded-md gap-4 items-center w-full mr-2 font-playfair  ${
            item.url === activeRoute ? 'bg-gold-100 text-gold-700' : 'hover:bg-gray-200 hover:text-red-700'
          }`}
        >
          <span
          >
            {item.icon}
          </span>
          <span
          >
            {item.title}
          </span>
        </Link>
        
          ))}
        </>
      ) : (
        <>
          {AdminsideBarBottomItems.map(
            (item: DashboardSideBarTypes, index: number) => (
              <Link
                href={item.url }
                key={index}
                onClick={onNavigate}
                className={`text-xl p-2 py-5 flex rounded-md gap-4 items-center w-full mr-2 font-playfair  ${
                  item.url === activeRoute ? 'bg-gold-100 text-gold-700' : 'hover:bg-gray-200'
                }`}
              >
                <span
                >
                  {item.icon}
                </span>
                <span
                >
                  {item.title}
                </span>
              </Link>
            )
          )}
          {/* sign out */}
          <div className="p-2 py-5 flex items-center cursor-pointer border-b"
          onClick={LogoutHandler}
          >
            <span className="text-3xl mr-2">{ICONS.logOut}</span>
            <span className="text-xl">Sign Out</span>
          </div>
          {/* footer */}
          <br />
          <br />
          <p className="text-sm text-center pt-5 pb-10">
            © 2024 SIXTHGRID. All rights reserved.
          </p>
        </>
      )}
    </>
  );
};

export default AdminSidebarItems;
