"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Loader, Lock, Mail } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { toggleLoginDialog } from "@/store/slice/userSlice";

export default function LoginSignupDialouge({
  isLoginOpen,
  setIsMenuOpen
}: {
  isLoginOpen: boolean;
  setIsMenuOpen: (arg0: boolean) => void;
}) {
  const [isShowPassword, setIsShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const dispatch=useDispatch()

  const handleLogin = (e: any) => {
    e.preventDefault();
    setIsLoading(true);
  };

  return (
    <Dialog open={isLoginOpen} onOpenChange={()=>{dispatch(toggleLoginDialog())}}>
      <DialogContent className="sm:max-w-sm  ">
        <DialogHeader>
          <DialogTitle className="text-xl text-center">
            Welcome to Book Kart
          </DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="w-full p-1">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
            <TabsTrigger value="forgot">Forgot</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <form
              className="space-y-4 mt-5 text-[#686868]"
              onSubmit={(e) => {
                handleLogin(e);
              }}
            >
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="pl-10 text-black"
                />
                <Mail className="absolute top-1/2 -translate-y-1/2 left-2" />
              </div>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  placeholder="Password"
                  type={isShowPassword ? "text" : "password"}
                  className="pl-10 text-black"
                />
                <Lock className="absolute top-1/2 -translate-y-1/2 left-2" />
                {isShowPassword ? (
                  <EyeOff
                    className="absolute top-1/2 -translate-y-1/2 right-2 cursor-pointer"
                    onClick={() => {
                      setIsShowPassword(false);
                    }}
                  />
                ) : (
                  <Eye
                    className="absolute top-1/2 -translate-y-1/2 right-2 cursor-pointer "
                    onClick={() => {
                      setIsShowPassword(true);
                    }}
                  />
                )}
              </div>
              <Button type="submit" className=" w-full">
                {isLoading ? (
                  <Loader className="animate-spin cursor-pointer" />
                ) : (
                  "Login"
                )}
              </Button>
            </form>
            <div className="flex justify-between items-center gap-1 my-2 text-sm text-[#686868]">
              <hr className="grow" />
              or
              <hr className="grow" />
            </div>
            <div className="mb-2">Login with Google</div>

            <p className="text-sm text-[#686868] text-center">
              By clicking "agree", you agree to our{" "}
              <Link href="term-of-use" className="text-blue-500">
                Terms of Use
              </Link>
              ,{" "}
              <Link href="privacy-policy" className="text-blue-500">
                Privac Policy
              </Link>
            </p>
          </TabsContent>

          <TabsContent value="signup">
            <form className="space-y-4 mt-5 text-[#686868]">
              <div className="relative">
                <Input
                  id="name"
                  type="name"
                  name="name"
                  placeholder="Name"
                  className=" text-black"
                />
              </div>

              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="pl-10 text-black"
                />
                <Mail className="absolute top-1/2 -translate-y-1/2 left-2" />
              </div>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  placeholder="Password"
                  type={isShowPassword ? "text" : "password"}
                  className="pl-10 text-black"
                />
                <Lock className="absolute top-1/2 -translate-y-1/2 left-2" />
                {isShowPassword ? (
                  <EyeOff
                    className="absolute top-1/2 -translate-y-1/2 right-2 cursor-pointer"
                    onClick={() => {
                      setIsShowPassword(false);
                    }}
                  />
                ) : (
                  <Eye
                    className="absolute top-1/2 -translate-y-1/2 right-2 cursor-pointer "
                    onClick={() => {
                      setIsShowPassword(true);
                    }}
                  />
                )}
              </div>
              <Button type="submit" className=" w-full">
                {isLoading ? (
                  <Loader className="animate-spin cursor-pointer" />
                ) : (
                  "SignUp"
                )}
              </Button>
            </form>

            <p className="text-sm text-[#686868] mt-2 text-center">
              By clicking "agree", you agree to our{" "}
              <Link href="term-of-use" className="text-blue-500">
                Terms of Use
              </Link>
              ,{" "}
              <Link href="privacy-policy" className="text-blue-500">
                Privac Policy
              </Link>
            </p>
          </TabsContent>

          <TabsContent value="forgot">
            <form className="space-y-4 mt-5 text-[#686868]">
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="pl-10 text-black"
                />
                <Mail className="absolute top-1/2 -translate-y-1/2 left-2" />
              </div>

              <Button type="submit" className=" w-full">
                {isLoading ? (
                  <Loader className="animate-spin cursor-pointer" />
                ) : (
                  "Send Resent Link"
                )}
              </Button>
            </form>

            <p className="text-sm text-[#686868] mt-2 text-center">
              By clicking "agree", you agree to our{" "}
              <Link href="term-of-use" className="text-blue-500">
                Terms of Use
              </Link>
              ,{" "}
              <Link href="privacy-policy" className="text-blue-500">
                Privac Policy
              </Link>
            </p>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
