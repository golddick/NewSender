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
import { Menu } from "lucide-react"
import Logo from "./logo"
import NavItems from "./nav.items"

export function MobileHeader() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Menu/>
      </SheetTrigger>
      <SheetContent side={"left"} className=" p-2  bg-gray-100 h-full w-[280px]">
        <SheetHeader>
          <SheetTitle>
            <div>
                 <Logo />
            </div>
          </SheetTitle>
          <SheetDescription>
            TheNews Email marking Platform
          </SheetDescription>
        </SheetHeader>
        <div >
            <NavItems />
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
