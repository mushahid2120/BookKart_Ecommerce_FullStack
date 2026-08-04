"use client";

import { ChevronRight, LogOut, UserPlus } from "lucide-react";
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
        toast.success("Logout Successful");
        dispatch(logout());
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went Wrong");
    }
  };

  return (
    <div className="flex flex-col gap-0.5 w-full">
      {user !== null ? (
        <UserCard user={user} />
      ) : (
        <Button
          variant="ghost"
          className="w-full hover:bg-surface-container-high text-on-surface flex px-3 py-3 h-auto font-normal rounded-xl transition-colors cursor-pointer justify-between"
          onClick={() => {
            if (setIsMenuOpen) setIsMenuOpen(false);
            if (setIsDropDownMenuOpen) setIsDropDownMenuOpen(false);
            dispatch(toggleLoginDialog());
          }}
        >
          <div className="flex items-center gap-3 text-sm font-semibold">
            <UserPlus className="h-4 w-4 text-primary" />
            <span>Login / Sign Up</span>
          </div>
          <ChevronRight className="h-4 w-4 text-on-surface-variant" />
        </Button>
      )}

      {menuItem.map((item) => {
        if (item.path)
          return (
            <Button
              variant="ghost"
              asChild
              className="w-full hover:bg-surface-container-high text-on-surface flex px-3 py-3 h-auto font-normal rounded-xl transition-colors cursor-pointer justify-between"
              key={item.title}
            >
              <Link
                href={item.path}
                className="flex justify-between items-center text-sm font-semibold w-full"
              >
                <div className="flex items-center gap-3">
                  <span className="text-on-surface-variant shrink-0">
                    {item.icon}
                  </span>
                  <span>{item.title}</span>
                </div>
                <ChevronRight className="h-4 w-4 text-on-surface-variant shrink-0" />
              </Link>
            </Button>
          );
        if (item.onClick)
          return (
            <Button
              variant="ghost"
              className="w-full hover:bg-surface-container-high text-on-surface flex px-3 py-3 h-auto font-normal rounded-xl transition-colors cursor-pointer justify-between"
              key={item.title}
              onClick={item.onClick}
            >
              <div className="flex justify-between items-center text-sm font-semibold w-full">
                <div className="flex items-center gap-3">
                  <span className="text-on-surface-variant shrink-0">
                    {item.icon}
                  </span>
                  <span>{item.title}</span>
                </div>
                <ChevronRight className="h-4 w-4 text-on-surface-variant shrink-0" />
              </div>
            </Button>
          );
      })}

      {user && (
        <Button
          variant="ghost"
          className="w-full hover:bg-error-container/40 text-error flex px-3 py-3 h-auto font-normal rounded-xl transition-colors cursor-pointer justify-between mt-1"
          onClick={handleLogout}
        >
          <div className="flex items-center gap-3 text-sm font-semibold">
            <LogOut className="h-4 w-4 text-error shrink-0" />
            <span>Logout</span>
          </div>
          <ChevronRight className="h-4 w-4 text-error/60 shrink-0" />
        </Button>
      )}
    </div>
  );
}
