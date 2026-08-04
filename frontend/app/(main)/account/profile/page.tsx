"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUpdateUserMutation } from "@/store/api";
import { IUserState } from "@/store/slice/userSlice";
import { RootState } from "@/store/store";
import {
  Loader,
  User,
  Mail,
  Phone,
  Edit3,
  CheckCircle2,
  Shield,
  Bell,
  MapPin,
  Calendar,
  Camera,
  X,
  Save,
  AlertCircle,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast/headless";
import { useSelector } from "react-redux";

export default function Page() {
  const user = useSelector((state: RootState) => state.user.user);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<IUserState>({
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      phoneNumber: user?.phoneNumber || "",
    },
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [pageError, setPageError] = useState<string | null>(null);
  const [updateUser] = useUpdateUserMutation();

  const handleUpdateUserData = async (data: IUserState) => {
    console.log(data);
    try {
      setIsLoading(true);
      setPageError(null);
      const response = await updateUser({ ...data }).unwrap();
      if (response.isSuccess) {
        toast.success("Your profile has been updated");
        setIsEditing(false);
      }
    } catch (error: any) {
      console.log(error);
      if (error.status === 500 || error.status === "FETCH_ERROR") {
        setPageError("Failed to update profile. Please try again.");
        toast.error("Something went wrong");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* ── Stitch Hero Profile Banner Card ── */}
      <Card className="overflow-hidden border border-outline-variant/40 rounded-3xl bg-surface-container-lowest shadow-xs p-0">
        {/* Banner Cover Gradient */}
        <div className="h-32 sm:h-40 bg-linear-to-r from-primary-container via-primary-fixed to-primary-fixed-dim relative">
          <div className="absolute inset-0 bg-[radial-gradient(#231b00_1px,transparent_1px)] bg-size-[16px_16px] opacity-15" />
        </div>

        {/* Profile Info Overlay */}
        <div className="px-6 sm:px-8 pb-6 -mt-16 sm:-mt-20 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 relative z-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">
            {/* Avatar Container */}
            <div className="relative group">
              <Avatar className="h-28 w-28 sm:h-32 sm:w-32 border-4 border-white shadow-md ring-2 ring-primary-fixed-dim/30">
                {user?.profilePic ? (
                  <AvatarImage src={user.profilePic} alt={user.name} />
                ) : (
                  <AvatarFallback className="bg-primary-container text-on-primary-fixed font-extrabold text-3xl sm:text-4xl">
                    {getInitials(user?.name)}
                  </AvatarFallback>
                )}
              </Avatar>
              <button
                type="button"
                className="absolute bottom-1 right-1 bg-primary-container text-on-primary-fixed p-2 rounded-full shadow-md hover:bg-primary-fixed-dim transition-transform hover:scale-105 cursor-pointer border border-white"
                title="Change Avatar"
              >
                <Camera size={16} />
              </button>
            </div>

            {/* Profile Meta Details */}
            <div className="space-y-1">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
                  {user?.name || "BookKart Member"}
                </h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-tertiary-container/60 text-on-tertiary-container border border-tertiary/20">
                  <CheckCircle2 size={12} /> Verified Member
                </span>
              </div>
              <p className="text-sm text-on-surface-variant flex items-center gap-1.5">
                <Mail size={14} className="text-outline" />
                {user?.email || "No email provided"}
              </p>
              {user?.phoneNumber && (
                <p className="text-xs text-on-surface-variant flex items-center gap-1.5 pt-0.5">
                  <Phone size={13} className="text-outline" />
                  {user.phoneNumber}
                </p>
              )}
            </div>
          </div>


        </div>

        {/* Overview Stats Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 px-6 sm:px-8 py-4 bg-surface-container-low/60 border-t border-outline-variant/30 text-xs">
          <div className="flex flex-col">
            <span className="text-on-surface-variant font-medium">Account Status</span>
            <span className="font-bold text-on-surface text-sm">Active & Verified</span>
          </div>
          <div className="flex flex-col">
            <span className="text-on-surface-variant font-medium">Role</span>
            <span className="font-bold text-on-surface text-sm">Buyer & Seller</span>
          </div>
          <div className="flex flex-col">
            <span className="text-on-surface-variant font-medium">Security Tier</span>
            <span className="font-bold text-on-surface text-sm flex items-center gap-1">
              <Shield size={13} className="text-tertiary" /> High Protection
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-on-surface-variant font-medium">Member Since</span>
            <span className="font-bold text-on-surface text-sm">2024</span>
          </div>
        </div>
      </Card>

      {/* Page Error Banner */}
      {pageError && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-error-container text-on-error-container border border-error-container/60 text-sm font-medium">
          <AlertCircle size={18} className="shrink-0" />
          <span>{pageError}</span>
        </div>
      )}

      {/* ── Personal Information Form Card ── */}
      <Card className="border border-outline-variant/40 rounded-3xl bg-surface-container-lowest shadow-xs overflow-hidden p-0">
        <CardHeader className="p-6 bg-surface-container-low/40 border-b border-outline-variant/30">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary-container text-on-primary-container">
              <User size={20} />
            </div>
            <div>
              <CardTitle className="text-lg font-bold text-on-surface">Personal Information</CardTitle>
              <CardDescription className="text-xs text-on-surface-variant mt-0.5">
                Update your account details and contact information
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 sm:p-8">
          <form
            className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl"
            onSubmit={handleSubmit(handleUpdateUserData)}
          >
            {/* User Name */}
            <fieldset className="flex flex-col gap-2 relative">
              <label htmlFor="name" className="text-xs font-bold text-on-surface flex items-center gap-1.5">
                <User size={13} className="text-outline" /> User Name
              </label>
              <Input
                type="text"
                id="name"
                className="w-full bg-surface-container-lowest border-outline-variant/60 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl px-4 py-2.5 text-sm transition-all"
                placeholder={user ? "" : "Enter your username"}
                {...register("name", {
                  required: "User name is required",
                  disabled: !isEditing,
                  maxLength: {
                    value: 50,
                    message: "Name must be less than 50 characters",
                  },
                })}
              />
              {errors?.name && (
                <p className="text-destructive text-xs font-medium mt-1 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.name.message}
                </p>
              )}
            </fieldset>

            {/* Email */}
            <fieldset className="flex flex-col gap-2 relative">
              <label htmlFor="email" className="text-xs font-bold text-on-surface flex items-center gap-1.5">
                <Mail size={13} className="text-outline" /> Email Address
              </label>
              <Input
                type="email"
                id="email"
                className="w-full bg-surface-container-lowest border-outline-variant/60 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl px-4 py-2.5 text-sm transition-all"
                placeholder={user ? "" : "Enter your Email"}
                {...register("email", {
                  required: "Email is required",
                  disabled: !isEditing,
                  maxLength: {
                    value: 50,
                    message: "Email must be less than 50 characters",
                  },
                })}
              />
              {errors?.email && (
                <p className="text-destructive text-xs font-medium mt-1 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.email.message}
                </p>
              )}
            </fieldset>

            {/* Phone Number */}
            <fieldset className="flex flex-col gap-2 relative">
              <label htmlFor="phoneNumber" className="text-xs font-bold text-on-surface flex items-center gap-1.5">
                <Phone size={13} className="text-outline" /> Phone Number
              </label>
              <Input
                type="tel"
                id="phoneNumber"
                className="w-full bg-surface-container-lowest border-outline-variant/60 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl px-4 py-2.5 text-sm transition-all"
                placeholder={user ? "" : "+91 98765 43210"}
                {...register("phoneNumber", {
                  required: "Phone number is required",
                  disabled: !isEditing,
                  maxLength: {
                    value: 50,
                    message: "Phone number must be less than 50 characters",
                  },
                })}
              />
              {errors?.phoneNumber && (
                <p className="text-destructive text-xs font-medium mt-1 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.phoneNumber.message}
                </p>
              )}
            </fieldset>

            {/* Date of Birth (Presentation Field) */}
            <fieldset className="flex flex-col gap-2 relative opacity-80">
              <label className="text-xs font-bold text-on-surface flex items-center gap-1.5">
                <Calendar size={13} className="text-outline" /> Date of Birth
              </label>
              <Input
                type="text"
                disabled
                className="w-full bg-surface-container-low border-outline-variant/30 rounded-xl px-4 py-2.5 text-sm text-on-surface-variant cursor-not-allowed"
                value="Not Specified"
              />
            </fieldset>

            {/* Address Summary (Presentation Field) */}
            <fieldset className="flex flex-col gap-2 relative md:col-span-2 opacity-80">
              <label className="text-xs font-bold text-on-surface flex items-center gap-1.5">
                <MapPin size={13} className="text-outline" /> Shipping Address Summary
              </label>
              <Input
                type="text"
                disabled
                className="w-full bg-surface-container-low border-outline-variant/30 rounded-xl px-4 py-2.5 text-sm text-on-surface-variant cursor-not-allowed"
                value="Manage full addresses in your Saved Addresses tab"
              />
            </fieldset>
          </form>

          {/* Edit / Save Action Bar at bottom */}
          <div className="mt-8 pt-6 border-t border-outline-variant/30 flex items-center justify-between flex-wrap gap-4">
            <span className="text-xs text-on-surface-variant">
              {isEditing ? "Modify fields above and save changes." : "Click Edit Profile to make updates to your account information."}
            </span>
            {!isEditing ? (
              <Button
                className="bg-primary-container hover:bg-primary-fixed-dim text-on-primary-fixed font-bold px-6 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer border border-primary-fixed-dim/40"
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </Button>
            ) : (
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  className="border-outline-variant/60 text-on-surface-variant hover:bg-surface-container-low rounded-xl px-5 py-2 text-sm font-semibold cursor-pointer"
                  onClick={() => setIsEditing(false)}
                >
                  Discard Changes
                </Button>
                <Button
                  className="bg-primary-container hover:bg-primary-fixed-dim text-on-primary-fixed font-bold px-6 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-2 border border-primary-fixed-dim/40"
                  onClick={() => {
                    const userData = watch();
                    handleUpdateUserData(userData);
                  }}
                >
                  {isLoading ? (
                    <Loader className="animate-spin text-on-primary-fixed" size={16} />
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

    </div>
  );
}

