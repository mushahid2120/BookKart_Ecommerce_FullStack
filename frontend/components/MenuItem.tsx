import { ChevronRight, Lock, User } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { EachMenuItemType, User as UserType } from "./Header";
import { useDispatch } from "react-redux";
import { logout, toggleLoginDialog } from "@/store/slice/userSlice";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {  useLogoutMutation } from "@/store/api";
import toast from "react-hot-toast";

export default function MenuItem({
  menuItem,
  user,
  setIsMenuOpen,
  setIsDropDownMenuOpen,
}: {
  menuItem: EachMenuItemType[];
  user: UserType | null;
  setIsMenuOpen: (arg0: boolean) => void;

  setIsDropDownMenuOpen: (arg0: boolean) => void;
}) {
  const dispatch = useDispatch();
  const [logoutApi] = useLogoutMutation();

  const handleLogout=async () => {
              try {
                if (setIsMenuOpen) setIsMenuOpen(false);
                if (setIsDropDownMenuOpen) setIsDropDownMenuOpen(false);
                const response = await logoutApi({}).unwrap();
                if (response.isSuccess) {
                  toast.success("Logout Successfull");
                  dispatch(logout())
                }
              } catch (error) {
                console.log(error);
                toast.error("Something went Wrong");
              }
            }


  return (
    <>
      {user !== null ? (
        <Button
          variant="ghost"
          className="w-full h-auto hover:bg-slate-100 px-2  py-5 text-[#374151] font-normal"
        >
          <div className="flex gap-4  text-[16px] w-full">
            <div className=" overflow-hidden">
              <Avatar>
                {user ? (
                  user?.profilePic ? (
                    <AvatarImage
                      src={user.profilePic}
                      alt="@shadcn"
                      className="grayscale"
                    />
                  ) : (
                    <AvatarFallback>
                      {user.name
                        .split(" ")
                        .map((name: string) => name[0])
                        .join("")}
                    </AvatarFallback>
                  )
                ) : (
                  <AvatarFallback>
                    <User />
                  </AvatarFallback>
                )}
              </Avatar>
            </div>
            {user && (
              <div className="">
                <h3 className="text-lg font-medium">{user.name}</h3>
                <p className="text-[14px] font-light">{user.email}</p>
              </div>
            )}
          </div>
        </Button>
      ) : (
        <Button
          variant="ghost"
          className="w-full hover:bg-slate-100 flex px-2  py-5 text-[#374151] font-normal"
        >
          <div
            onClick={() => {
              if(setIsMenuOpen) setIsMenuOpen(false);
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
              className="w-full hover:bg-slate-100 flex px-2  py-5 text-[#374151] font-normal"
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
              className="w-full hover:bg-slate-100 flex px-2  py-5 text-[#374151] font-normal"
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
          className="w-full hover:bg-slate-100 flex px-2  py-5 text-[#374151] font-normal"
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
