"use client";
import Link from "next/link";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  BookLock,
  CircleQuestionMark,
  FileTerminal,
  Heart,
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
import { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { toggleLoginDialog } from "@/store/slice/userSlice";
import { RootState } from "@/store/store";
import { useLazyGetCartQuery } from "@/store/api";
import { setCart } from "@/store/slice/cartSlice";
import { setQuery } from "@/store/slice/productQuery";

export interface EachMenuItemType {
  title: string;
  icon: React.ReactNode;
  path?: string;
  onClick?: () => void;
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isDropDownMenuOpen, setIsDropDownMenuOpen] = useState<boolean>(false);
  const isLoginOpen = useSelector(
    (state: RootState) => state.user.isLogingDialogOpen,
  );
  const user = useSelector((state: RootState) => state.user.user);
  const dispatch = useDispatch();
  const router = useRouter();
  const cart = useSelector((state: RootState) => state.cart);
  const [getCart] = useLazyGetCartQuery();
  const pathname = usePathname();
  const queryRef = useRef<HTMLInputElement>(null);

  const handleProtectNav = (href: string) => {
    if (user) {
      router.push(href);
      setIsMenuOpen(false);
      setIsDropDownMenuOpen(false);
    } else {
      dispatch(toggleLoginDialog());
      setIsMenuOpen(false);
      setIsDropDownMenuOpen(false);
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
    { title: "About Us", icon: <UsersRound />, path: "/about-us" },
    { title: "Terms & Use", icon: <FileTerminal />, path: "/term-of-use" },
    { title: "Privacy Policy", icon: <BookLock />, path: "/privacy-policy" },
    { title: "Help", icon: <CircleQuestionMark />, path: "/help" },
  ];

  useEffect(() => {
    if (/^\/book\/[^\/]+$/.test(pathname) || pathname !== "/checkout/cart") {
      fetchingCart();
    }
  }, [pathname]);

  const fetchingCart = async () => {
    try {
      const response = await getCart({}).unwrap();
      if (response.isSuccess) {
        dispatch(setCart(response.data));
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  const handleProductQuery = (event: React.SubmitEvent) => {
    event.preventDefault();
    if (!queryRef.current) return;
    const query = queryRef.current.value.toLowerCase();
    dispatch(setQuery(query));
    if (pathname !== "/books") {
      router.push("/books");
    }
  };



  return (
    <header className="sticky top-0 z-1000 w-full border-b border-outline-variant/20 bg-inverse-surface shadow-sm">
      <nav className="max-w-7xl mx-auto flex items-center justify-between  gap-2 md:gap-4 px-8 py-2">
        {/* Mobile hamburger */}
        <div className="lg:hidden flex items-center justify-center">
          <DrawerMenu
            isMenuOpen={isMenuOpen}
            setIsMenuOpen={setIsMenuOpen}
            menuItem={menuItem}
            user={user}
            setIsDropDownMenuOpen={setIsDropDownMenuOpen}
          />
        </div>

        {/* Logo */}
        <Link
          href="/"
          className="flex items-center shrink-0 transition-opacity hover:opacity-80"
        >
          <span className="text-2xl font-black tracking-tight select-none text-white">
            Book
            <span className="text-primary-fixed">Kart</span>
          </span>
        </Link>

        {/* Search bar */}
        <div className="relative grow max-w-md mx-4 hidden sm:block">
          <form onSubmit={handleProductQuery}>
            <Input
              placeholder="Find your next favorite story..."
              ref={queryRef}
              className="w-full h-11 pl-4 pr-10 rounded-full text-sm border bg-white/10 border-outline-variant/30 text-inverse-on-surface placeholder:text-white/50 focus-visible:ring-2 focus-visible:ring-primary-fixed"
            />
            <Button
              size="icon"
              variant="ghost"
              type="submit"
              className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full text-primary-fixed hover:bg-white/10"
            >
              <Search className="h-4 w-4" />
            </Button>
          </form>
        </div>

        <div className="flex justify-content items-center gap-4">
          {/* Desktop actions */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Sell a Book */}
            <Link href="/book-sell">
              <button className="px-6 py-2.5 rounded-full font-bold text-sm bg-primary-fixed text-on-primary-fixed transition-all hover:brightness-110 hover:shadow-lg active:scale-95">
                Sell a Book
              </button>
            </Link>

            {/* My Account dropdown */}
            <DropDownMenu
              open={isDropDownMenuOpen}
              onOpenChange={setIsDropDownMenuOpen}
              menuItem={menuItem}
              user={user}
              setIsMenuOpen={setIsMenuOpen}
              setIsDropDownMenuOpen={setIsDropDownMenuOpen}
            >
              <button className="flex items-center gap-2 text-white/80 hover:text-white transition-colors cursor-pointer">
                <Avatar className="h-7 w-7">
                  {user ? (
                    user?.profilePic ? (
                      <AvatarImage src={user.profilePic} alt={user.name} />
                    ) : (
                      <AvatarFallback className="text-xs font-bold bg-primary-container text-on-primary-container">
                        {user.name
                          .split(" ")
                          .map((name: string) => name[0])
                          .join("")}
                      </AvatarFallback>
                    )
                  ) : (
                    <AvatarFallback className="bg-surface-container text-on-surface">
                      <User className="h-3 w-3" />
                    </AvatarFallback>
                  )}
                </Avatar>
                <span className="text-sm font-semibold hidden md:inline">
                  My Profile
                </span>
              </button>
            </DropDownMenu>

          </div>

          {/* Cart */}
          <Link href="/checkout/cart">
            <button className="relative p-2 rounded-full text-white/80 hover:text-white transition-colors cursor-pointer">
              <ShoppingCart className="h-5 w-5" />
              {cart.item?.length > 0 && (
                <span className="absolute top-0 right-0 bg-accent-coral text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold shadow-sm">
                  {cart.item.length}
                </span>
              )}
            </button>
          </Link>
        </div>

        <LoginSignupDialouge isLoginOpen={isLoginOpen} />
      </nav>

      {/* Mobile search row */}
      <div className="sm:hidden px-4 pb-2">
        <form onSubmit={handleProductQuery} className="relative">
          <Input
            placeholder="Search books..."
            ref={queryRef}
            className="w-full h-10 pl-4 pr-10 rounded-full text-sm border bg-white/10 border-outline-variant/30 text-inverse-on-surface placeholder:text-white/50"
          />
          <Button
            size="icon"
            variant="ghost"
            type="submit"
            className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full text-primary-fixed hover:bg-white/10"
          >
            <Search className="h-4 w-4" />
          </Button>
        </form>
      </div>


    </header>
  );
}
