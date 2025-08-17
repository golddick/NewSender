"use client";

// import { Button } from "@/components/ui/button";
// import {
//   Sheet, 
//   SheetClose,
//   SheetContent,
//   SheetDescription,
//   SheetHeader,
//   SheetTitle,
//   SheetTrigger,
// } from "@/components/ui/sheet";
// import DashboardSideBar from "@/shared/widgets/dashboard/sidebar/dashboard.sidebar";
// import { Menu } from "lucide-react";
// import { useState } from "react";

// export function MobileNav() {
  // const [isOpen, setIsOpen] = useState(false);

  // const handleClose = () => setIsOpen(false);

//   return (
//     <Sheet open={isOpen} onOpenChange={setIsOpen}>
//       <SheetTrigger asChild>
//         <Button className="rounded-lg border" variant="outline">
//           <Menu />
//         </Button>
//       </SheetTrigger>

//       <SheetContent
//         side="left"
//         className="w-[300px] bg-gray-100 overflow-y-auto"
//       >
//         <SheetHeader>
//           <SheetTitle>TheNews</SheetTitle>
//           <SheetDescription>
//             <SheetClose onClick={handleClose} />
//           </SheetDescription>
//         </SheetHeader>
//         <DashboardSideBar onNavigate={handleClose} />
//       </SheetContent>
//     </Sheet>
//   );
// }



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

export function MobileNav() {

    const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => setIsOpen(false);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">
           <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side={'left'} className="  bg-gray-100 w-[280px] min-h-screen overflow-y-auto">
        <SheetHeader>
          <SheetTitle>TheNews</SheetTitle>
          <SheetDescription>
          Your Email Markerting Platform
          </SheetDescription>
        </SheetHeader> 
        <div className="w-full h-auto bg-gray-100">
          <DashboardItems  onNavigate={handleClose}/>
          <UserPlan /> 
          <DashboardItems bottomContent={true} />
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
