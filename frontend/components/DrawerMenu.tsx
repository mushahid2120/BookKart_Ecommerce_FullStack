import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import MenuItem from "./MenuItem";
import { MenuIcon } from "lucide-react";
import Image from "next/image";
import { EachMenuItemType, User } from "./Header";

export default function DrawerMenu({
  isMenuOpen,
  menuItem,
  user,
  setIsMenuOpen,
  setIsDropDownMenuOpen
}: {

  isMenuOpen: boolean;
  menuItem: EachMenuItemType[];
  user: User | null;
  setIsMenuOpen: (arg0: boolean) => void;
  setIsDropDownMenuOpen: (arg0: boolean) => void;
}) {
  return (
    <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen} >
      <SheetTrigger>
        <MenuIcon strokeWidth={3} className="size-6 cursor-pointer" />
      </SheetTrigger>
      <SheetContent side="left" className="overflow-y-auto z-2000">
        <SheetHeader>
          <SheetTitle>
            <Image
              src="/Image/Logo.jpg"
              alt="Logo"
              width={150}
              height={60}
              className="w-auto"
            />
          </SheetTitle>
          <hr />
          <SheetDescription >
            <MenuItem
              menuItem={menuItem}
              user={user}
              setIsMenuOpen={setIsMenuOpen}
              setIsDropDownMenuOpen={setIsDropDownMenuOpen}
            />
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
