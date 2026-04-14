"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useUpdateUserMutation } from "@/store/api";
import { RootState } from "@/store/store";
import { Loader } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast/headless";
import { useSelector } from "react-redux";

export interface IUserData {
  userName: string;
  email: string;
  phoneNumber: number;
}

export default function page() {
  const user = useSelector((state: RootState) => state.user.user);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<IUserData>({
    defaultValues: {
      userName: user?.name || "",
      email: user?.email || "",
      phoneNumber: user?.phoneNumber || "",
    },
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [updateUser] = useUpdateUserMutation();

  const handleUpdateUserData = async (data: IUserData) => {
    console.log(data)
    try {
      setIsLoading(true);
      const response = await updateUser({ ...data }).unwrap();
      if (response.isSuccess) {
        toast.success("Your profile as been updated");
        setIsEditing(false);
      }
    } catch (error: any) {
      console.log(error);
      console.log(error.status==="FETCH_ERROR")
      if (error.status === 500 ||error.status==="FETCH_ERROR") {
        toast.error("Something went wrong");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card className=" rounded-md bg-linear-to-r from-[#ec4899] to-[#f43f5f] text-white gap-0">
        <CardHeader className="text-4xl font-medium">My Profile</CardHeader>
        <CardDescription className="text-white font-light ml-6">
          Manage your personal information and preferences
        </CardDescription>
      </Card>
      <Card className="relative overflow-hidden p-0 ">
        <div className="h-1 bg-[#ec4899] w-full absolute top-0"></div>
        <CardHeader className="flex flex-col text-xl  text-[#be185d] font-medium gap-2 bg-[#eefdf5] py-4">
          <span>Personal Information</span>{" "}
          <p className="text-[#737373] text-sm font-normal">
            Update your profile details and contact information
          </p>
        </CardHeader>
        <CardContent className="flex flex-col gap-6 md:m-4 my-2 pb-4">
          <form
            className="w-full max-w-200 space-y-4 grid md:grid-cols-2  md:gap-4"
            onSubmit={handleSubmit(handleUpdateUserData)}
          >
            <fieldset className=" relative flex  flex-col gap-2  text-sm font-medium whitespace-nowrap">
              <label htmlFor="userName">User Name</label>
              <Input
                type="text"
                id="userName"
                className=" w-full md:max-w-140 sm:max-w-110 max-w-100 text-sm font-normal"
                placeholder={user ? "" : "Enter your username "}
                {...register("userName", {
                  required: "user Name is required ",
                  disabled: !isEditing,
                  maxLength: {
                    value: 50,
                    message: "userName must be less than 50 character",
                  },
                })}
              />
              {errors?.userName && (
                <p className="text-red-500 text-[10px] font-normal absolute -bottom-4 right-0">
                  {errors.userName.message}
                </p>
              )}
            </fieldset>
            <fieldset className=" relative flex  flex-col gap-2  text-sm font-medium whitespace-nowrap">
              <label htmlFor="email">Email</label>
              <Input
                type="email"
                id="email"
                className=" w-full md:max-w-140 sm:max-w-110 max-w-100 text-sm font-normal"
                placeholder={user ? "" : "Enter your Email"}
                {...register("email", {
                  required: "Email is required ",
                  disabled: !isEditing,
                  maxLength: {
                    value: 50,
                    message: "email must be less than 50 character",
                  },
                })}
              />
              {errors?.email && (
                <p className="text-red-500 text-[10px] font-normal absolute -bottom-4 right-0">
                  {errors.email?.message}
                </p>
              )}
            </fieldset>
            <fieldset className=" relative flex  flex-col gap-2 text-sm font-medium whitespace-nowrap">
              <label htmlFor="phoneNumber">Phone Number</label>
              <Input
                type="tel"
                id="phoneNumber"
                className=" w-full md:max-w-140 sm:max-w-110 max-w-100 text-sm font-normal"
                placeholder={user ? "" : "+91 321 212 212"}
                {...register("phoneNumber", {
                  required: "phone number is required ",
                  disabled: !isEditing,
                  maxLength: {
                    value: 50,
                    message: "phone number must be less than 50 character",
                  },
                })}
              />
              {errors?.phoneNumber && (
                <p className="text-red-500 text-[10px] font-normal absolute -bottom-4 right-0">
                  {errors.phoneNumber.message}
                </p>
              )}
            </fieldset>
          </form>
          {!isEditing && (
            <Button
              className="bg-linear-to-r from-[#ec4899] to-[#f43f5f] text-white hover:bg-linear-to-r hover:from-[#e12e88] hover:to-[#f43f5f] cursor-pointer"
              onClick={() => {
                setIsEditing(true);
              }}
            >
              Edit Profile
            </Button>
          )}
          {isEditing && (
            <div className=" flex justify-between w-full">
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditing(false);
                }}
              >
                Discard Changes
              </Button>
              <Button className="bg-linear-to-r from-[#ec4899] to-[#f43f5f] text-white hover:bg-linear-to-r hover:from-[#e12e88] hover:to-[#f43f5f] cursor-pointer"  onClick={()=>{
                const userData=watch();
                handleUpdateUserData(userData)
              }}>
                {isLoading ? (
                  <Loader className="animate-spin cursor-pointer" />
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
