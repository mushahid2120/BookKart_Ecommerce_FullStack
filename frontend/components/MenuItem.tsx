import { ChevronRight, Lock } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import Image from "next/image";
import { EachMenuItemType, User as UserType } from "./Header";
import { useDispatch } from "react-redux";
import { toggleLoginDialog } from "@/store/slice/userSlice";

export default function MenuItem({
  menuItem,
  user,
  setIsMenuOpen
}: {
  menuItem: EachMenuItemType[];
  user: UserType | null;
    setIsMenuOpen:(arg0:boolean)=>void
}) {
  const dispatch=useDispatch()
  console.log(user)
  return (
    <>
      {user !== null ? (
        <Button
          variant="ghost"
          className="w-full h-auto hover:bg-slate-100 px-2  py-5 text-[#374151] font-normal"
        >
          <div className="flex gap-4  text-[16px] w-full">
            <div className=" overflow-hidden">
              <Image
                src={user.profilePic}
                width={50}
                height={50}
                alt="profile Pic"
                className="aspect-square rounded-full"
              />
            </div>
            <div className="">
              <h3 className="text-lg font-medium">{user.userName}</h3>
              <p className="text-[14px] font-light">{user.email}</p>
            </div>
          </div>
        </Button>
      ) : (
        <Button
          variant="ghost"
          className="w-full hover:bg-slate-100 flex px-2  py-5 text-[#374151] font-normal"
        >
          <div
            onClick={() => {
              setIsMenuOpen(false);
              dispatch(toggleLoginDialog())
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
    </>
  );
}
