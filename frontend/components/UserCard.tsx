import React from "react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { User } from "lucide-react";
import { IUserState } from "@/store/slice/userSlice";

export default function UserCard({ user }: { user: IUserState | null }) {
  return (
    <Button
      variant="ghost"
      className="w-full h-auto hover:bg-surface-container-high text-on-surface px-3 py-4 font-normal rounded-xl transition-colors cursor-pointer"
    >
      <div className="flex items-center gap-4 text-base w-full">
        <div className="overflow-hidden">
          <Avatar className="h-10 w-10 border border-outline-variant/30">
            {user ? (
              user?.profilePic ? (
                <AvatarImage src={user.profilePic} alt={user.name} />
              ) : (
                <AvatarFallback className="bg-primary-container text-on-primary-container font-bold">
                  {user.name
                    .split(" ")
                    .map((name: string) => name[0])
                    .join("")}
                </AvatarFallback>
              )
            ) : (
              <AvatarFallback className="bg-surface-container text-on-surface">
                <User className="h-5 w-5" />
              </AvatarFallback>
            )}
          </Avatar>
        </div>
        {user && (
          <div className="flex flex-col items-start text-left">
            <h3 className="text-base font-bold text-on-surface leading-snug">
              {user.name}
            </h3>
            <p className="text-xs font-medium text-on-surface-variant truncate max-w-[170px]">
              {user.email}
            </p>
          </div>
        )}
      </div>
    </Button>
  );
}
