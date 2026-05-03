import React from 'react'
import { Button } from './ui/button'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { User } from 'lucide-react'
import { IUserState } from '@/store/slice/userSlice';

export default function UserCard({user}:{user: IUserState | null;}) {

  return (
            <Button
              variant="ghost"
              className="w-full h-auto hover:bg-(--color-surface-muted) px-2 py-5 font-normal"
            >
              <div className="flex items-center gap-4 text-base w-full">
                <div className="overflow-hidden">
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
                  <div className="flex flex-col items-start">
                    <h3 className="text-lg font-medium">{user.name}</h3>
                    <p className="text-sm font-normal">{user.email}</p>
                  </div>
                )}
              </div>
            </Button>
  )
}
