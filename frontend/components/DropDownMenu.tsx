import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import MenuItem from "./MenuItem";
import { EachMenuItemType, User } from "./Header";

export default function DropDownMenu({
  children,
  menuItem,
  user,
  setIsMenuOpen,
}: {
  open: boolean;
  onOpenChange: (arg0:boolean) => void;
  children: React.ReactNode;
  menuItem: EachMenuItemType[];
  user: User | null;
  setIsMenuOpen: (arg0: boolean) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <MenuItem
            menuItem={menuItem}
            user={user}
            setIsMenuOpen={setIsMenuOpen}
          />
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
