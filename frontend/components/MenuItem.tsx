import { ChevronRight, Lock, User } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { EachMenuItemType } from "./Header";
import { useDispatch } from "react-redux";
import { IUserState, logout, toggleLoginDialog } from "@/store/slice/userSlice";
import { useLogoutMutation } from "@/store/api";
import toast from "react-hot-toast";
import UserCard from "./UserCard";

export default function MenuItem({
  menuItem,
  user,
  setIsMenuOpen,
  setIsDropDownMenuOpen,
}: {
  menuItem: EachMenuItemType[];
  user: IUserState | null;
  setIsMenuOpen: (arg0: boolean) => void;

  setIsDropDownMenuOpen: (arg0: boolean) => void;
}) {
  const dispatch = useDispatch();
  const [logoutApi] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      if (setIsMenuOpen) setIsMenuOpen(false);
      if (setIsDropDownMenuOpen) setIsDropDownMenuOpen(false);
      const response = await logoutApi({}).unwrap();
      if (response.isSuccess) {
        toast.success("Logout Successfull");
        dispatch(logout());
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went Wrong");
    }
  };

  return (
    <>
      {user !== null ? (
        <UserCard user={user} />
      ) : (
        <Button
          variant="ghost"
          className="w-full hover:bg-(--color-surface-muted) flex px-2 py-5 text-(--color-header-text) font-normal"
        >
          <div
            onClick={() => {
              if (setIsMenuOpen) setIsMenuOpen(false);
              if (setIsDropDownMenuOpen) setIsDropDownMenuOpen(false);
              dispatch(toggleLoginDialog());
            }}
            className="flex justify-between items-center  text-[16px] w-full"
          >
            <div className="flex items-center gap-3">
              <Lock />
              <div>Login/Sign Up</div>
            </div>
            <ChevronRight />
          </div>
        </Button>
      )}
      {menuItem.map((item) => {
        if (item.path)
          return (
            <Button
              variant="ghost"
              className="w-full hover:bg-(--color-surface-muted) flex px-2 py-5 text-(--color-header-text) font-normal"
              key={item.title}
            >
              <Link
                href={item.path}
                className="flex justify-between items-center  text-[16px] w-full"
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <div>{item.title}</div>
                </div>
                <ChevronRight />
              </Link>
            </Button>
          );
        if (item.onClick)
          return (
            <Button
              variant="ghost"
              className="w-full hover:bg-(--color-surface-muted) flex px-2 py-5 text-(--color-header-text) font-normal"
              key={item.title}
              onClick={item.onClick}
            >
              <div className="flex justify-between items-center  text-[16px] w-full">
                <div className="flex items-center gap-3">
                  {item.icon}
                  <div>{item.title}</div>
                </div>
                <ChevronRight />
              </div>
            </Button>
          );
      })}
      {user && (
        <Button
          variant="ghost"
          className="w-full hover:bg-(--color-surface-muted) flex px-2 py-5 text-(--color-header-text) font-normal"
        >
          <div
            onClick={handleLogout}
            className="flex justify-between items-center  text-[16px] w-full"
          >
            <div className="flex items-center gap-3">
              <Lock />
              <div>Logout</div>
            </div>
            <ChevronRight />
          </div>
        </Button>
      )}
    </>
  );
}
