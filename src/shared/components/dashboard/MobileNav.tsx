"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import DashboardSideBar from "@/shared/widgets/dashboard/sidebar/dashboard.sidebar";
import { Menu } from "lucide-react";
import { useState } from "react";

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => setIsOpen(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button className="rounded-lg border" variant="outline">
          <Menu />
        </Button>
      </SheetTrigger>

      <SheetContent
        side="left"
        className="w-[300px] bg-gray-100 overflow-y-auto"
      >
        <DashboardSideBar onNavigate={handleClose} />
      </SheetContent>
    </Sheet>
  );
}
