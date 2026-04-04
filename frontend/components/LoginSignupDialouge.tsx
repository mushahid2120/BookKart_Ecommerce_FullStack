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
import {
  Eye,
  EyeOff,
  Loader,
  Lock,
  Mail,
  CircleUserRound,
  CircleCheckBig,
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { setEmailVerified, setUser, toggleLoginDialog } from "@/store/slice/userSlice";
import { useForm } from "react-hook-form";
import {
  useForgotPasswordMutation,
  useLazyCheckUserQuery,
  useLoginMutation,
  useRegisterMutation,
} from "@/store/api";
import toast from "react-hot-toast";

interface ILogin {
  email: string;
  password: string;
}

interface ISignUp extends ILogin {
  name: string;
}

interface IForgotPassword {
  email: string;
}

export default function LoginSignupDialouge({
  isLoginOpen,
}: {
  isLoginOpen: boolean;
}) {
  const [isShowPassword, setIsShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const dispatch = useDispatch();
  const [registerApi] = useRegisterMutation();
  const [loginApi] = useLoginMutation();
  const [checkUser] = useLazyCheckUserQuery();
  const [forgotpassword] = useForgotPasswordMutation();
  const [loginError, setLoginError] = useState<string | null>(null);
  const [signupError, setSignUpError] = useState<ISignUp>({
    name: "",
    email: "",
    password: "",
  });
  const [forgotPasswordError, setforgotPasswordError] = useState<string | null>(
    null,
  );
  const [isResetLinkSent, setIsResetLinkSent] = useState<boolean>(false);

  const { register: loginRegister, handleSubmit: handleLoginSubmit } =
    useForm<ILogin>();
  const { register: signupRegister, handleSubmit: handleSignupSubmit } =
    useForm<ISignUp>();
  const {
    register: forgotPasswordRegister,
    handleSubmit: handleForgotPasswordSubmit,
  } = useForm<IForgotPassword>();

  //Login Submission
  const handleLogin = async (data: ILogin) => {
    try {
      setIsLoading(true);
      const { email, password } = data;
      const response = await loginApi({ email, password }).unwrap();
      if (response.isSuccess) {
        toast.success("Login Successfull");
        dispatch(toggleLoginDialog());
        
        const res = await checkUser({}).unwrap();
        if (res.isSuccess) {
          dispatch(setUser(res.data));
        }
        dispatch(setEmailVerified(response.data.isEmailVerified));
      }
    } catch (error: any) {
      console.log(error);
      setLoginError(error.data.message);
      if (error.status === 500)
        toast.error("Something went wrong try again later");
    } finally {
      setIsLoading(false);
    }
  };

  //SignUp Submission
  const handleSignup = async (data: ISignUp) => {
    try {
      setIsLoading(true);
      const { email, password, name } = data;
      if (name === "") {
        setSignUpError((prevState: ISignUp) => ({
          ...prevState,
          name: "Name is Required",
        }));
        return;
      }
      if (email === "") {
        setSignUpError((prevState: ISignUp) => ({
          ...prevState,
          email: "Email is Required",
        }));
        return;
      }
      if (password === "") {
        setSignUpError((prevState: ISignUp) => ({
          ...prevState,
          password: "Password is Required",
        }));
        return;
      }
      const response = await registerApi({ email, password, name }).unwrap();
      if (response.isSuccess) {
        toast.success(
          "User has been created check your email and verify Email",
        );
        dispatch(toggleLoginDialog());
      }
    } catch (error: any) {
      console.log(error);
      if (error.data?.message)
        setSignUpError((prevState) => ({
          ...prevState,
          ...error.data.message,
        }));
      if (error.status === 500)
        toast.error("Something went wrong try again later");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (data: IForgotPassword) => {
    try {
      setIsLoading(true);
      const response = await forgotpassword(data.email).unwrap();
      console.log(response);
      if (response.isSuccess) {
        setIsResetLinkSent(true);
      }
    } catch (error: any) {
      console.log(error);
      if (error.status === 400) {
        toast.error("Email not found");
      }
      if (error.status === 500)
        toast.error("Something went wrong try again later");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      open={isLoginOpen}
      onOpenChange={() => {
        dispatch(toggleLoginDialog());
      }}
    >
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
              className="space-y-6 mt-5 text-[#686868]"
              onSubmit={handleLoginSubmit(handleLogin)}
            >
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  placeholder="Email"
                  {...loginRegister("email", { required: true })}
                  className="pl-10 text-black"
                  onChange={() => {
                    if (loginError) setLoginError(null);
                  }}
                />
                <Mail className="absolute top-1/2 -translate-y-1/2 left-2" />
              </div>
              <div className="relative">
                <Input
                  id="password"
                  {...loginRegister("password", { required: true })}
                  placeholder="Password"
                  type={isShowPassword ? "text" : "password"}
                  className="pl-10 text-black"
                  onChange={() => {
                    if (loginError) setLoginError(null);
                  }}
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
              <div className="relative">
                {loginError && (
                  <p className="absolute -top-4 text-xs text-red-500 pl-2 font-medium w-full">
                    {loginError}
                  </p>
                )}
                <Button type="submit" className=" w-full ">
                  {isLoading ? (
                    <Loader className="animate-spin cursor-pointer" />
                  ) : (
                    "Login"
                  )}
                </Button>
              </div>
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
            <form
              className="space-y-6 mt-5 text-[#686868]"
              onSubmit={handleSignupSubmit(handleSignup)}
            >
              <div className="relative">
                {signupError.name && (
                  <p className="absolute -top-4 text-xs text-red-500 text-right pl-2 font-medium w-full">
                    {signupError.name}
                  </p>
                )}
                <Input
                  id="name"
                  type="name"
                  {...signupRegister("name", { required: true })}
                  placeholder="Name"
                  className=" pl-10 text-black"
                  onChange={() => {
                    if (signupError.name)
                      setSignUpError((prevState: ISignUp) => ({
                        ...prevState,
                        name: "",
                      }));
                  }}
                />
                <CircleUserRound className="absolute top-1/2 -translate-y-1/2 left-2" />
              </div>

              <div className="relative">
                {signupError.email && (
                  <p className="absolute -top-4 text-xs text-red-500 text-right pl-2 font-medium w-full">
                    {signupError.email}
                  </p>
                )}
                <Input
                  id="email"
                  type="email"
                  {...signupRegister("email", { required: true })}
                  placeholder="Email"
                  className="pl-10 text-black"
                  onChange={() => {
                    if (signupError.email)
                      setSignUpError((prevState: ISignUp) => ({
                        ...prevState,
                        email: "",
                      }));
                  }}
                />
                <Mail className="absolute top-1/2 -translate-y-1/2 left-2" />
              </div>
              <div className="relative">
                {signupError.password && (
                  <p className="absolute -top-4 text-xs text-red-500 text-right pl-2 font-medium w-full">
                    {signupError.password}
                  </p>
                )}
                <Input
                  id="password"
                  {...signupRegister("password", { required: true })}
                  placeholder="Password"
                  type={isShowPassword ? "text" : "password"}
                  className="pl-10 text-black"
                  onChange={() => {
                    if (signupError.password)
                      setSignUpError((prevState: ISignUp) => ({
                        ...prevState,
                        password: "",
                      }));
                  }}
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
            {isResetLinkSent ? (
              <div className="flex justify-center items-center flex-col gap-2">
                <div>
                  <CircleCheckBig size={72} className="text-[#d7925a]" />
                </div>
                <h1 className="text-xl font-medium">Reset Link Send</h1>
                <p className="text-center text-[#686868] text-sm">
                  we've sent reset password link to your email. Please, check
                  you inbox and follow the instruction to reset your password
                </p>
                <Button type="submit" className=" w-full">
                  {isLoading ? (
                    <Loader className="animate-spin cursor-pointer" />
                  ) : (
                    "Send Another Link"
                  )}
                </Button>
              </div>
            ) : (
              <>
                <form
                  className="space-y-4 mt-5 text-[#686868]"
                  onSubmit={handleForgotPasswordSubmit(handleForgotPassword)}
                >
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      {...forgotPasswordRegister("email", { required: true })}
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
              </>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
