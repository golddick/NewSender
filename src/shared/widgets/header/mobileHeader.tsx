


"use client";

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import DashboardItems from "@/shared/widgets/dashboard/sidebar/dashboard.items";
import DashboardSideBar from "@/shared/widgets/dashboard/sidebar/dashboard.sidebar"
import UserPlan from "@/shared/widgets/dashboard/sidebar/user.plan";
import { Menu } from "lucide-react";
import { useState } from "react"
import Logo from "./logo";
import NavItems from "./nav.items";
import MobileNavItems from "./mobile.Nav.item";

export function MobileHeader() {

       const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => setIsOpen(false);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">
           <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side={'left'} className="  bg-white w-[250px] mt-[60px] flex flex-col  gap-6 overflow-y-auto">
        <SheetHeader>
          <SheetTitle className=" w-full flex items-center  justify-center">
             <Logo />
          </SheetTitle>
          <SheetDescription>
          Your Email Markerting Platform
          </SheetDescription>
        </SheetHeader> 
        <div className="w-full h-auto bg-transparent">
             <MobileNavItems  onNavigate={handleClose}/>
        </div>
        {/* <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose>
        </SheetFooter> */}
      </SheetContent>
    </Sheet>
  )
}

