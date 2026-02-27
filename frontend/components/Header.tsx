
import Image from "next/image";
import Link from "next/link";
import { Input } from './ui/input'
import { Button } from "./ui/button";
import { Menu as MenuIcon, Search, ShoppingCart, User} from "lucide-react";
import DropDownMenu from "./DropDownMenu";
import DrawerMenu from "./DrawerMenu";

export default function Header() {


  return (
    <header className="md:px-12 sm:px-10  px-6 md:py-4  sm:py-3 py-2 text-[#374151] sticky">
      <nav className="flex justify-center items-center gap-2 md:gap-4 sm:gap-1">
        <div className="lg:hidden">
          <DrawerMenu/>
          </div>
      

          <Link href="/" className=" 100 ">
          <Image
            src="/Image/Logo.jpg"
            width={200}
            height={80}
            alt="Logo"
            className="object-cover min-w-20"
          />
        </Link>


        <div className="relative   grow md:min-w-40 min-w-32  ">
          <Input
            placeholder="Book Name / Author / Subject"
            className=" pr-8 focus-visible:outline-1"
          />
          <Button size="icon" variant="ghost" className="absolute right-0 cursor-pointer" >
            <Search />
          </Button>
        </div>

        <Link href="/">
          <Button variant="secondary" className="bg-[#ffc400] hover:bg-[#e5b108] cursor-pointer hidden lg:block">
            Sell Used Books
          </Button>
        </Link>


        {/* <div>
          <Button variant="ghost" className="hover:bg-slate-100 hidden lg:flex">
            <User />
            My Account
          </Button>
          </div> */}
        <DropDownMenu>
          <Button variant="ghost" className="hover:bg-slate-100 hidden lg:flex">
          <User />
          My Account</Button>
        </DropDownMenu >


        <Link href="/">
          <Button variant="ghost" className="hover:bg-slate-100">
            <ShoppingCart />
            Cart
          </Button>
        </Link>
      </nav>
    </header >
  )
}
