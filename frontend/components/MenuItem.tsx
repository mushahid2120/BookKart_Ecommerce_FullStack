import { BookLock, ChevronRight, CircleQuestionMark, FileTerminal, Heart, Lock, Package, PiggyBank, ShoppingCart, User, UsersRound } from 'lucide-react'
import Link from 'next/link'
import { Button } from "./ui/button"

export interface EachMenuItemType {
    title: string,
    icon: React.ReactNode,
    path?: string
}

export default function MenuItem() {
          const menuItem: EachMenuItemType[] = [{ title: "Login/Sign Up", icon: <Lock /> },
    { title: "My Profile", icon: <User />, path: "myprofile" },
    { title: "My Orders", icon: <Package />, path: "myorder" },
    { title: "My Selling Orders", icon: <PiggyBank />, path: "mysellingorders" },
    { title: "Cart", icon: <ShoppingCart />, path: "cart" },
    { title: "Wishlist", icon: <Heart />, path: "wishlist" },
    { title: "About Us", icon: <UsersRound />, path: "about-us" },
    { title: "Terms & Use", icon: <FileTerminal />, path: "term-use" },
    { title: "Privacy Policy", icon: <BookLock />, path: "privacy-policy" },
    { title: "Help", icon: <CircleQuestionMark />, path: "help" },
    ]

  return menuItem.map((item) => {
                        if (item.path)
                            return (
                                <Button variant="ghost" className='w-full hover:bg-slate-100 flex px-2  py-5 text-[#374151] font-normal' key={item.title}>
                                    <Link href={item.path} className='flex justify-between items-center  text-[16px] w-full' key={item.title} >
                                        <div className='flex items-center gap-3'>
                                            {item.icon}
                                            <div>{item.title}</div>
                                        </div>
                                        <ChevronRight />
                                    </Link>
                                </Button>
                            )
                    })
  
}
