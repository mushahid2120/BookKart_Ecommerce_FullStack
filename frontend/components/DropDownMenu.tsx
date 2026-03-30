import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import MenuItem from "./MenuItem";
import { EachMenuItemType, User } from "./Header";

export default function DropDownMenu({
  open,
  onOpenChange,
  children,
  menuItem,
  user,
  setIsMenuOpen,
  setIsDropDownMenuOpen
}: {
  open: boolean;
  onOpenChange: (arg0:boolean) => void;
  children: React.ReactNode;
  menuItem: EachMenuItemType[];
  user: User | null;
  setIsMenuOpen: (arg0: boolean) => void;
  setIsDropDownMenuOpen:(arg0: boolean) => void;
}) {
  return (
    <DropdownMenu open={open} onOpenChange={onOpenChange}>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <MenuItem
            menuItem={menuItem}
            user={user}
            setIsMenuOpen={setIsMenuOpen}
            setIsDropDownMenuOpen={setIsDropDownMenuOpen}
          />
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
