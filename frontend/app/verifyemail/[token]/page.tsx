"use client";
import { Button } from "@/components/ui/button";
import { useVerifyEmailMutation } from "@/store/api";
import {
  authStatus,
  setEmailVerified,
  toggleLoginDialog,
} from "@/store/slice/userSlice";
import { RootState } from "@/store/store";
import { CircleAlert, CircleCheckBig, CircleX, Loader } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

export default function page() {
  const isEmailVerified = useSelector(
    (state: RootState) => state.user.isEmailVerified,
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const [verificationStatus, setVerificationStatus] = useState<
    "loading" | "success" | "already verified" | "failed"
  >("loading");
  const [verifyEmail] = useVerifyEmailMutation();
  const { token } = useParams();

  useEffect(() => {
    const verify = async () => {
      if (isEmailVerified) {
        setVerificationStatus("already verified");
        return;
      }
      try {
        const response = await verifyEmail(token).unwrap();
        if (response.isSuccess) {
          dispatch(setEmailVerified(true));
          setVerificationStatus("success");
          dispatch(authStatus());
          toast.success("Email has been verified");
          setTimeout(() => {
            window.location.href = "/";
          }, 3000);
        }
        verify();
      } catch (error: any) {
        console.log(error);
        setVerificationStatus("failed");
        if (error.status === 500) {
          toast.error("Something went wrong");
        }
      }
    };
    if(verificationStatus==="loading")
    verify();
  }, [token]);

  if (verificationStatus === "already verified") {
    return (
      <main className="flex items-center justify-center bg-[#ddeafe]">
        <div className="flex justify-center items-center flex-col gap-2 bg-white p-8 m-4 rounded-md max-w-[400px]">
          <div>
            <CircleAlert size={72} className="text-[#4d3bd7]" />
          </div>
          <h1 className="text-xl font-medium text-[#4d3bd7]">
            Email already Verified!!
          </h1>
          <p className="text-center text-[#686868] text-sm">
            Email Already Verified you can use our services
          </p>
          <Button
            type="submit"
            className=" w-full"
            onClick={() => {
              if (isLoading) return;
              router.push("/");
              dispatch(toggleLoginDialog());
            }}
          >
            {isLoading ? (
              <Loader className="animate-spin cursor-pointer" />
            ) : (
              "Login to Your Account"
            )}
          </Button>
        </div>
      </main>
    );
  }

  if (verificationStatus === "failed") {
    return (
      <main className="flex items-center justify-center bg-[#ddeafe]">
        <div className="flex justify-center items-center flex-col gap-2 bg-white p-8 m-4 rounded-md max-w-[400px]">
          <div>
            <CircleX size={72} className="text-[#e20909]" />
          </div>
          <h1 className="text-xl text-[#e20909] font-medium">
            Email Verification Failed!!
          </h1>
          <p className="text-center text-[#686868] text-sm">
            Email Verification failed. Resend the verification Email or May be
            you are already verified.Try again to Login your account
          </p>
          <Button
            type="submit"
            className=" w-full"
            onClick={() => {
              if (isLoading) return;
              router.push("/");
              dispatch(toggleLoginDialog());
            }}
          >
            {isLoading ? (
              <Loader className="animate-spin cursor-pointer" />
            ) : (
              "Login to Your Account"
            )}
          </Button>
        </div>
      </main>
    );
  }

  if (verificationStatus === "loading") {
    return (
      <main className="flex items-center justify-center bg-[#ddeafe]">
        <div className="flex justify-center items-center flex-col gap-2 bg-white p-8 m-4 rounded-md max-w-[400px]">
          <h2 className="text-2xl">Loading Please Wait...</h2>
        </div>
      </main>
    );
  }

  if (verificationStatus === "success") {
    return (
      <main className="flex items-center justify-center bg-[#ddeafe]">
        <div className="flex justify-center items-center flex-col gap-2">
          <div>
            <CircleCheckBig size={72} className="text-[#d7925a]" />
          </div>
          <h1 className="text-xl font-medium">Email has been Verified</h1>
          <p className="text-center text-[#686868] text-sm">
            Your Email has been Verified. you can use our services
          </p>
          <Button type="submit" className=" w-full">
            {isLoading ? (
              <Loader className="animate-spin cursor-pointer" />
            ) : (
              "Send Another Link"
            )}
          </Button>
        </div>
      </main>
    );
  }
}
