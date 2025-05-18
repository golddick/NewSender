import React from "react";
import AdminSideBar from "@/modules/admin/_component/AdminSideBar";
import AdminTopBar from "@/modules/admin/_component/AdminTopBar";



export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
        <div className=" flex min-h-screen w-full  gap-3 bg-[#f3dcdc1a]">
        <AdminSideBar />
        <div className="    p-2 w-full  lg:ml-[230px]">
        <AdminTopBar/>
        <div className="flex flex-col ">
        {children}
        </div>
        </div>
      </div>
    </>
  );
}
