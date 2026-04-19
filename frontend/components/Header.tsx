"use client";
import Image from "next/image";
import Link from "next/link";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  BookLock,
  CircleQuestionMark,
  FileTerminal,
  Heart,
  Menu as MenuIcon,
  Package,
  PiggyBank,
  Search,
  ShoppingCart,
  User,
  UsersRound,
} from "lucide-react";
import DropDownMenu from "./DropDownMenu";
import DrawerMenu from "./DrawerMenu";
import LoginSignupDialouge from "./LoginSignupDialouge";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { toggleLoginDialog } from "@/store/slice/userSlice";
import { RootState } from "@/store/store";

export interface EachMenuItemType {
  title: string;
  icon: React.ReactNode;
  path?: string;
  onClick?: () => void;
}

export interface User{
  email:string;
  name:string;
  profilePic:string;
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isDropDownMenuOpen,setIsDropDownMenuOpen]=useState<boolean>(false);
  // const [isLoginOpen, setIsLoginOpen] = useState<boolean>(false);
  const isLoginOpen = useSelector(
    (state: RootState) => state.user.isLogingDialogOpen,
  );
  const user = useSelector((state: RootState) => state.user.user);
  const dispatch = useDispatch();
  const router = useRouter();
  const cart=useSelector((state:RootState)=>state.cart.product)
  
  const handleProtectNav = (href: string) => {
    if (user) {
      router.push(href);
      setIsMenuOpen(false);
      setIsDropDownMenuOpen(false)
    } else {
      dispatch(toggleLoginDialog());
      setIsMenuOpen(false);
      setIsDropDownMenuOpen(false)
    }
  };

  const menuItem: EachMenuItemType[] = [
    {
      title: "My Profile",
      icon: <User />,
      onClick: () => handleProtectNav("/account/profile"),
    },
    {
      title: "My Orders",
      icon: <Package />,
      onClick: () => handleProtectNav("/account/order"),
    },
    {
      title: "My Selling Orders",
      icon: <PiggyBank />,
      onClick: () => handleProtectNav("/account/selling-products"),
    },
    {
      title: "Cart",
      icon: <ShoppingCart />,
      onClick: () => handleProtectNav("/checkout/cart"),
    },
    {
      title: "Wishlist",
      icon: <Heart />,
      onClick: () => handleProtectNav("/account/wishlist"),
    },
    { title: "About Us", icon: <UsersRound />, path: "about-us" },
    { title: "Terms & Use", icon: <FileTerminal />, path: "term-of-use" },
    { title: "Privacy Policy", icon: <BookLock />, path: "privacy-policy" },
    { title: "Help", icon: <CircleQuestionMark />, path: "help" },
  ];


  return (
    <header className="md:px-12 sm:px-10  px-6 md:py-4  sm:py-3 py-2 text-[#374151] bg-[#fffbebc1] backdrop-blur-lg sticky top-0 z-1000 border-solid border border-b-[#e5e7eb]">
      <nav className="flex justify-center items-center gap-2 md:gap-4 sm:gap-1">
        <div className="lg:hidden">
          <DrawerMenu
            isMenuOpen={isMenuOpen}
            setIsMenuOpen={setIsMenuOpen}
            menuItem={menuItem}
            user={user}
            setIsDropDownMenuOpen={setIsDropDownMenuOpen}
          />
        </div>

        <Link href="/">
          <Image
            src="/Image/Logo.jpg"
            width={200}
            height={80}
            loading="eager"
            alt="Logo"
            className="object-cover w-auto min-w-20"
          />
        </Link>

        <div className="relative   grow md:min-w-40 min-w-32  ">
          <Input
            placeholder="Book Name / Author / Subject"
            className=" pr-8 focus-visible:outline-1"
          />
          <Button
            size="icon"
            variant="ghost"
            className="absolute right-0 cursor-pointer"
          >
            <Search />
          </Button>
        </div>

        <Link href="/book-sell">
          <Button
            variant="secondary"
            className="bg-[#ffc400] hover:bg-[#e5b108] cursor-pointer hidden lg:block"
          >
            Sell Used Books
          </Button>
        </Link>

        {/* <div>
          <Button variant="ghost" className="hover:bg-slate-100 hidden lg:flex">
            <User />
            My Account
          </Button>
          </div> */}
        <DropDownMenu
          open={isDropDownMenuOpen}
          onOpenChange={setIsDropDownMenuOpen}
          menuItem={menuItem}
          user={user}
          setIsMenuOpen={setIsMenuOpen}
          setIsDropDownMenuOpen={setIsDropDownMenuOpen}
        >
          <Button variant="ghost" className="hover:bg-slate-100 hidden lg:flex">
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
            My Account
          </Button>
        </DropDownMenu>

        <LoginSignupDialouge
          isLoginOpen={isLoginOpen}
        />

        <Link href="/checkout/cart">
          <Button variant="ghost" className="relative hover:bg-slate-100">
            <ShoppingCart />
            Cart
            <div className="absolute top-0 left-4 px-1  bg-[#EF4444] text-white rounded-full text-[10px]">{cart.length>0 && cart.length}</div>
          </Button>
        </Link>
      </nav>
    </header>
  );
}
