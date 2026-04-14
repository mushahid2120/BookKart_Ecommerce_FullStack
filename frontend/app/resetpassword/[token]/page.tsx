"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useResetPasswordMutation } from "@/store/api";
import { toggleLoginDialog } from "@/store/slice/userSlice";
import { CircleCheckBig, Eye, EyeOff, Loader, Lock } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

export interface IResetPassword {
  newpassword: string;
  confirmnewpassword: string;
}

export default function page() {
  const {token} = useParams();
  const [resetPassword]=useResetPasswordMutation();
  const [isPasswordChanged, setIsPasswordChanged] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { register, handleSubmit } = useForm<IResetPassword>();
  const [isShowPassword, setIsShowPassword] = useState<boolean>(false);
    const router = useRouter();
    const dispatch=useDispatch()

  const handleChangePassword=async(data:IResetPassword)=>{
    try {
      setIsLoading(true);
      console.log(data);
      if(data.newpassword!==data.confirmnewpassword){
        toast.error("password does not matched")
      }
      const response=await resetPassword({ token, newPassword:data.newpassword }).unwrap()
      console.log(response)
      if(response.isSuccess){
        setIsPasswordChanged(true);
      }
    } catch (error) {
        console.log(error)
    }finally{
      setIsLoading(false)
    }
  }

  if (isPasswordChanged) {
    return (
      <main className="flex items-center justify-center bg-[#ddeafe]">
        <div className="flex justify-center items-center flex-col gap-2 bg-white p-8 m-4 rounded-md max-w-[400px]">
          <div>
            <CircleCheckBig size={72} className="text-[#d7925a]" />
          </div>
          <h1 className="text-xl font-medium">Reset Password</h1>
          <p className="text-center text-[#686868] text-sm">
            Password has been reset succesully. you can login into you Account.
          </p>
          <Button type="submit" className=" w-full" onClick={()=>{
            if(isLoading) return;
            router.push('/');
            dispatch(toggleLoginDialog())
          }}>
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
  return (
    <main className="flex items-center justify-center bg-[#ddeafe]">
      <form
        className="space-y-4 mt-5 text-[#686868] bg-white p-8 m-4 rounded-md w-full max-w-[400px]"
          onSubmit={handleSubmit(handleChangePassword)}
      >
        <h1 className="text-xl font-medium text-black text-center">
          Reset Your Password
        </h1>
        <div className="relative">
          <Input
            id="newpassword"
            {...register("newpassword", { required: true })}
            placeholder="New Password"
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
        <div className="relative">
          <Input
            id="confirmnewpassword"
            type="text"
            {...register("confirmnewpassword", { required: true })}
            placeholder="Confirm New Password"
            className="pl-10 text-black"
          />
          <Lock className="absolute top-1/2 -translate-y-1/2 left-2" />
        </div>

        <Button type="submit" className=" w-full">
          {isLoading ? (
            <Loader className="animate-spin cursor-pointer" />
          ) : (
            "Reset Password"
          )}
        </Button>
      </form>
    </main>
  );
}
