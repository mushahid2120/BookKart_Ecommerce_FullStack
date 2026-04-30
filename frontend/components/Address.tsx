"use client";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Edit, Plus } from "lucide-react";
import { Label } from "./ui/label";
import { useForm } from "react-hook-form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { IAddress } from "@/store/slice/orderSlice";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Checkbox } from "./ui/checkbox";

export default function Address({
  handleAddress,
  isChangingAddress,
  setIsChangingAddress,
  address,
  currentAddressIndex,
}: {
  handleAddress: (address: IAddress) => void;
  isChangingAddress: boolean;
  setIsChangingAddress: (val: boolean) => void;
  address?: IAddress[];
  currentAddressIndex?: number;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IAddress>();
  const [emptyAddress, setEmptyAddress] = useState<boolean>(false);
  const [isAddressForm, setIsAddressForm] = useState<boolean>(false);
  const [isAddressDialoageOpen, setIsAddressDialoageOpen] =
    useState<boolean>(false);

  useEffect(() => {
    if (address && address.length === 0) {
      setEmptyAddress(true);
      setIsAddressDialoageOpen(true);
    }
    if (currentAddressIndex === -1) {
      setIsAddressDialoageOpen(true);
      setIsChangingAddress(true);
    }
  }, [address]);

  console.log({ emptyAddress });
  console.log({ isAddressDialoageOpen });
  console.log({ address });
  return (
    <Dialog
      open={isAddressDialoageOpen}
      onOpenChange={() => {
        setIsAddressDialoageOpen(false);
      }}
    >
      {emptyAddress && (
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center ">
              Select or Add Delivery Address
            </DialogTitle>
          </DialogHeader>
          <Button
            variant="outline"
            className="cursor-pointer"
            onClick={() => {
              setIsAddressForm(true);
              setEmptyAddress(false);
            }}
          >
            <Plus /> Add New Adddress
          </Button>
        </DialogContent>
      )}
      {isAddressForm && (
        <DialogContent className="sm:max-w-md  z-2000">
          <DialogHeader>
            <DialogTitle>Add New Address</DialogTitle>
          </DialogHeader>
          <form
            className="flex flex-col gap-4 "
            onSubmit={handleSubmit(handleAddress)}
          >
            <fieldset className="relative flex flex-col gap-2">
              <label htmlFor="ad-title" className="text-base font-medium ">
                Phone Number
              </label>
              <Input
                type="tel"
                id="phoneNumber"
                className=" md:max-w-140 text-sm font-normal focus-visible:ring-0"
                placeholder="10-digit mobile number"
                {...register("phoneNumber", {
                  required: "phone number is required",
                  maxLength: {
                    value: 10,
                    message: "Enter 10 digit valid mobile number",
                  },
                })}
              />
              {errors.phoneNumber && (
                <p className="text-red-500 text-[10px] font-normal absolute -bottom-4 right-0">
                  {errors.phoneNumber?.message}
                </p>
              )}
            </fieldset>
            <fieldset>
              <label htmlFor="ad-title" className="text-base font-medium ">
                Address Line 1
              </label>

              <Textarea
                placeholder="Street Address, House Number"
                id="addressLine1"
                {...register("addressLine1", {
                  required: "address line 1 is required",
                  maxLength: {
                    value: 200,
                    message: "Address must is less than 200 words",
                  },
                })}
                className="text-sm font-normal focus-visible:ring-0"
              />
            </fieldset>
            <fieldset className="relative flex flex-col gap-2">
              <label htmlFor="ad-title" className="text-base font-medium ">
                Address Line 2 (optional)
              </label>
              <Input
                type="text"
                id="addressLine2"
                className=" md:max-w-140 text-sm font-normal focus-visible:ring-0"
                placeholder="Appartment, suit, unit, etc"
                {...register("addressLine2", {
                  maxLength: {
                    value: 100,
                    message: "address line 2 must be less than 100 character",
                  },
                })}
              />
              {errors.addressLine2 && (
                <p className="text-red-500 text-[10px] font-normal absolute -bottom-4 right-0">
                  {errors.addressLine2?.message}
                </p>
              )}
            </fieldset>

            <div className="flex gap-4">
              <fieldset className="relative flex flex-col gap-2">
                <label htmlFor="ad-title" className="text-base font-medium ">
                  City
                </label>
                <Input
                  type="text"
                  id="city"
                  className=" md:max-w-140 text-sm font-normal focus-visible:ring-0"
                  {...register("city", {
                    required: "city is required",
                    maxLength: {
                      value: 20,
                      message: "city must be less than 20 character",
                    },
                  })}
                />
                {errors.city && (
                  <p className="text-red-500 text-[10px] font-normal absolute -bottom-4 right-0">
                    {errors.city?.message}
                  </p>
                )}
              </fieldset>
              <fieldset className="relative flex flex-col gap-2">
                <label htmlFor="ad-title" className="text-base font-medium ">
                  State
                </label>
                <Input
                  type="text"
                  id="state"
                  className=" md:max-w-140 text-sm font-normal focus-visible:ring-0"
                  {...register("state", {
                    required: "state is required",
                    maxLength: {
                      value: 20,
                      message: "state must be less than 20 character",
                    },
                  })}
                />
                {errors.state && (
                  <p className="text-red-500 text-[10px] font-normal absolute -bottom-4 right-0">
                    {errors.state?.message}
                  </p>
                )}
              </fieldset>
            </div>
            <fieldset className="relative flex flex-col gap-2">
              <label htmlFor="ad-title" className="text-base font-medium ">
                Pincode
              </label>
              <Input
                type="number"
                id="pin"
                className=" md:max-w-140 text-sm font-normal focus-visible:ring-0"
                placeholder="Appartment, suit, unit, etc"
                {...register("pin", {
                  required: "pincode is required",
                  max: {
                    value: 999999,
                    message: "Enter valid 6 digit pincode",
                  },
                  min: {
                    value: 100000,
                    message: "Enter valid 6 digit pincode",
                  },
                })}
              />
              {errors.pin && (
                <p className="text-red-500 text-[10px] font-normal absolute -bottom-4 right-0">
                  {errors.pin?.message}
                </p>
              )}
            </fieldset>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
            >
              Add Adddress
            </Button>
          </form>
        </DialogContent>
      )}
      {isChangingAddress && (
        <DialogContent className="sm:max-w-2xl  z-2000">
          <DialogHeader>
            <DialogTitle className="text-center ">
              Select or Add Delivery Address
            </DialogTitle>
          </DialogHeader>
          <div className="flex gap-4">
            {address &&
              address.map((add: IAddress) => (
                <Card className="sm:max-w-1/2 gap-2">
                  <CardHeader className="flex justify-between items-center">
                    <Checkbox className="w-5 h-5 border-black cursor-pointer" />
                    <Button variant="ghost">
                      <Edit size={20} />
                    </Button>
                  </CardHeader>
                  <CardContent className="text-[#4B5563] text-sm">
                    <div>
                      {add.addressLine1}
                    </div>
                    <div>
                      {add.addressLine2}
                    </div>
                    <div>{add.city} {add.state} {add.pin}</div>
                    <div className="font-medium">Phone: {add.phoneNumber}</div>
                  </CardContent>
                </Card>
              ))}
          </div>
          <Button
            variant="outline"
            className="cursor-pointer"
            onClick={() => {
              setIsAddressForm(true);
              setEmptyAddress(false);
            }}
          >
            <Plus /> Add New Adddress
          </Button>
        </DialogContent>
      )}
    </Dialog>
  );
}
