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
import MenuItem from "./MenuItem"
import { MenuIcon } from "lucide-react"
import Image from "next/image"

export default function DrawerMenu() {
  return (
        <Sheet>
  <SheetTrigger><MenuIcon strokeWidth={3} className="size-6 cursor-pointer" / ></SheetTrigger>
  <SheetContent side="left">
    <SheetHeader >
      <SheetTitle>
        <Image
        src="/Image/Logo.jpg"
        alt="Logo"
        width={150}
        height={60}
        />
      </SheetTitle>
      <hr />
      <SheetDescription>
        <MenuItem/>
      </SheetDescription>
    </SheetHeader>
  </SheetContent>
</Sheet>
  )
}
