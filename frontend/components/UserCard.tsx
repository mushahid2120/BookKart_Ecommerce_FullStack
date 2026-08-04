import React from "react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { User } from "lucide-react";
import { IUserState } from "@/store/slice/userSlice";

export default function UserCard({ user }: { user: IUserState | null }) {
  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Button
      variant="ghost"
      className="w-full h-auto hover:bg-surface-container-high/60 text-on-surface px-3 py-3.5 font-normal rounded-2xl transition-all cursor-pointer border border-transparent hover:border-outline-variant/30"
    >
      <div className="flex items-center gap-3.5 text-base w-full">
        <div className="relative shrink-0">
          <Avatar className="h-11 w-11 border-2 border-primary-fixed ring-2 ring-primary/10 shadow-xs">
            {user ? (
              user?.profilePic ? (
                <AvatarImage src={user.profilePic} alt={user.name} />
              ) : (
                <AvatarFallback className="bg-primary-container text-on-primary-container font-bold text-sm">
                  {getInitials(user.name)}
                </AvatarFallback>
              )
            ) : (
              <AvatarFallback className="bg-surface-container text-on-surface">
                <User className="h-5 w-5" />
              </AvatarFallback>
            )}
          </Avatar>
          {user && (
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-tertiary ring-2 ring-white" />
          )}
        </div>
        {user && (
          <div className="flex flex-col items-start text-left min-w-0 flex-1">
            <h3 className="text-sm font-bold text-on-surface leading-tight truncate w-full">
              {user.name}
            </h3>
            <p className="text-xs text-on-surface-variant truncate w-full mt-0.5">
              {user.email}
            </p>
          </div>
        )}
      </div>
    </Button>
  );
}

