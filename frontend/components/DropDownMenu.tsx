import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import MenuItem from "./MenuItem";
import { EachMenuItemType } from "./Header";
import { IUserState } from "@/store/slice/userSlice";

export default function DropDownMenu({
  open,
  onOpenChange,
  children,
  menuItem,
  user,
  setIsMenuOpen,
  setIsDropDownMenuOpen,
}: {
  open: boolean;
  onOpenChange: (arg0: boolean) => void;
  children: React.ReactNode;
  menuItem: EachMenuItemType[];
  user: IUserState | null;
  setIsMenuOpen: (arg0: boolean) => void;
  setIsDropDownMenuOpen: (arg0: boolean) => void;
}) {
  return (
    <DropdownMenu open={open} onOpenChange={onOpenChange}>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent className="z-[2000] border-outline-variant/40 bg-surface-container-lowest text-on-surface p-2 rounded-2xl shadow-xl min-w-64">
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
