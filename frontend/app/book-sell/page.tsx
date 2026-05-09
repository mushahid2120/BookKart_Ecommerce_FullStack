"use client";
import AccordianFeild from "@/components/AccordianFeild";
import RadioGroupFeild from "@/components/RadioGroupFeild";
import SelectFeild from "@/components/SelectFeild";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCreateProductMutation } from "@/store/api";
import {
  Book,
  Camera,
  CircleQuestionMark,
  CreditCard,
  DollarSign,
  Loader,
  PlusCircle,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

const BookType: string[] = [
  "College Books (Higher Education Textbooks)",
  "Exam/Test Preparation Books",
  "Reading Books (Novels, Children, Business, Literature, History,etc.)",
  "School Books (up to  12th)",
];

const BookCondition: string[] = ["Excellect", "Good", "Fair"];

const ForClass = [
  "B.Tech",
  "B.Sc",
  "B.Com",
  "BCA",
  "MBA",
  "M.Tech",
  "M.Sc",
  "Ph.D",
  "12th",
  "11th",
  "10th",
  "9th",
  "8th",
  "7th",
  "6th",
  "5th",
];

export interface IOptionalDetail {
  value: string;
  trigger: string;
  content: React.ReactElement;
}

export interface IUPI {
  UpiId: string;
}

export interface IBankAccount {
  AccountNumber: string;
  IFSC: string;
  BankName: string;
}

export interface IBookSale {
  title: string;
  category: string;
  condition: string;
  classType: string;
  images: FileList;
  subject: string;
  price: number;
  author: string;
  edition: string;
  description: string;
  finalPrice: string;
  shippingCharge: number;
  paymentMode: string;
  paymentDetails: IUPI | IBankAccount;
}

export default function page() {
  const [addProduct] = useCreateProductMutation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewsImages, setPreviewsImages] = useState<string[]>([]);
  const [isFreeShipping, setIsFreeShipping] = useState<boolean>(false);
  const router=useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<IBookSale>({
    mode: "onChange",
    defaultValues: {
      title: "",
      category: "",
      condition: "",
      classType: "",
      images: undefined as unknown as FileList,
      subject: "",
      price: 0,
      author: "",
      edition: "",
      description: "",
      finalPrice: "",
      shippingCharge: 0,
      paymentMode: "UPI",
      paymentDetails: { UpiId: "" },
    },
  });

  const watchedImages = watch("images");
  const paymentMode = watch("paymentMode");

  const OptionalDetails = [
    {
      value: "bookInfo",
      trigger: "Book Information",
      content: (
        <div className="flex flex-col gap-4 md:m-4 my-2 text-[#374151]">
          <div className="flex flex-col sm:flex-row gap-1 sm:gap-4 sm:justify-between sm:items-center text-sm font-medium whitespace-nowrap">
            <label htmlFor="ad-title">MRP</label>
            <Input
              type="number"
              id="ad-title"
              className=" w-full md:max-w-140 sm:max-w-110 max-w-100 text-sm font-normal"
              placeholder="Enter your MRP"
              {...register("price", {
                max: { value: 20000, message: "MRP should be less than 20000" },
              })}
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-1 sm:gap-4 sm:justify-between sm:items-center text-sm font-medium whitespace-nowrap">
            <label htmlFor="ad-title">Author</label>
            <Input
              type="text"
              id="ad-title"
              className="  w-full md:max-w-140 sm:max-w-110 max-w-100 text-sm font-normal"
              placeholder="Enter your author name"
              {...register("author", {
                maxLength: {
                  value: 50,
                  message: "Author name must be less than 50 character",
                },
              })}
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-1 sm:gap-4 sm:justify-between sm:items-center text-sm font-medium whitespace-nowrap">
            <label htmlFor="ad-title">Edition (Year)</label>
            <Input
              type="text"
              id="ad-title"
              className="  w-full md:max-w-140 sm:max-w-110 max-w-100 text-sm font-normal"
              placeholder="Enter book edition year"
              {...register("edition", {
                maxLength: {
                  value: 50,
                  message: "Edition must be less than 50 character",
                },
              })}
            />
          </div>
        </div>
      ),
    },
    {
      value: "adDesc",
      trigger: "Ad Description",
      content: (
        <div className="flex flex-col sm:flex-row gap-1 sm:gap-4 sm:justify-between text-sm font-medium whitespace-nowrap">
          <label htmlFor="ad-title">Description</label>

          <Textarea
            placeholder="Enter your description"
            {...register("description", {
              maxLength: {
                value: 100,
                message: "description must be less than 100 character",
              },
            })}
            className="text-sm font-normal"
          />
        </div>
      ),
    },
  ];

  const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB in bytes
  const MAX_FILES = 4;

  const { ref: hookFormRef, ...rest } = register("images", {
    required: "Book image is required",
    validate: {
      // 1. Check if the number of files exceeds 4
      lessThanMax: (files: FileList) =>
        files.length <= MAX_FILES ||
        `You can only upload up to ${MAX_FILES} images`,

      // 2. Check if any individual file is larger than 15MB
      sizeCheck: (files: FileList) => {
        for (let i = 0; i < files.length; i++) {
          if (files[i].size > MAX_FILE_SIZE) {
            return `Each image must be less than 15MB (${files[i].name} is too large)`;
          }
        }
        return true;
      },
      isImage: (files: FileList) => {
        for (let i = 0; i < files.length; i++) {
          if (!files[i].type.startsWith("image/")) {
            return `File "${files[i].name}" is not a valid image`;
          }
        }
        return true;
      },
    },
  });

  const convertToFormData = (data: IBookSale) => {
    const formData = new FormData();

        if(isFreeShipping){
      data.shippingCharge=0;
    }

    Object.entries(data).forEach(([key, value]) => {
      if (key !== "images" && key !== "paymentDetails") {
        formData.append(key, String(value));
      }
    });

    // 🔹 images
    if (data.images) {
      Array.from(data.images).forEach((file) => {
        formData.append("images", file); // must match multer
      });
    }

    if (paymentMode === "UPI") {
      formData.append(
        "paymentDetails",
        JSON.stringify({ UpiId: (data.paymentDetails as IUPI).UpiId }),
      );
    } else {
      formData.append(
        "paymentDetails",
        JSON.stringify({
          bankDetails:{AccountNumber: (data.paymentDetails as IBankAccount).AccountNumber,
          IFSC: (data.paymentDetails as IBankAccount).IFSC,
          BankName: (data.paymentDetails as IBankAccount).BankName,}
        }),
      );
    }

    return formData;
  };

  const handlePost = async (data: IBookSale) => {
    setIsLoading(true);
    try {
      const formData = convertToFormData(data);
      const response = await addProduct(formData).unwrap();
      if (response.isSuccess) {
        toast.success("Your Book has been posted");
        setIsLoading(false);
        setTimeout(()=>{router.push(`/books/${response.data.id}`)},3000)
      }
    } catch (error: any) {
      console.log(error);
      if (error.status == 500) toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (watchedImages && watchedImages.length > 0) {
      const files = Array.from(watchedImages as FileList);
      const newPreviews = files.map((file) => URL.createObjectURL(file));

      setPreviewsImages(newPreviews);
      return () => newPreviews.forEach((url) => URL.revokeObjectURL(url));
    } else {
      setPreviewsImages([]);
    }
  }, [watchedImages]);

  return (
    <main className="bg-(--color-surface-soft) space-y-4 flex flex-col items-center py-4 md:px-4 px-2">
      <div className="text-center space-y-2 py-4">
        <h1 className="text-(--color-accent-yellow) text-3xl font-semibold">
          Sell Your Used Books
        </h1>
        <p className="text-(--color-header-text) text-xl">
          Submit a free classified ad to sell your used books for cash in India
        </p>
      </div>
      <form
        className="w-full max-w-200 space-y-10"
        onSubmit={handleSubmit(handlePost)}
      >
        <fieldset>
          {/* Book Details */}
          <Card className="relative overflow-hidden p-0 ">
            <div className="h-1 bg-(--color-button-yellow) w-full absolute top-0"></div>
            <CardHeader className="flex text-xl items-center text-(--color-button-yellow-hover) font-medium bg-(--color-surface-soft) py-6">
              <Book /> <span>Book Details</span>
            </CardHeader>
            <CardContent className="flex flex-col gap-6 md:m-4 my-2 pb-4">
              <div className=" relative flex flex-col sm:flex-row gap-1 sm:gap-4 sm:justify-between sm:items-center text-sm font-medium whitespace-nowrap">
                <label htmlFor="ad-title">Ad Title</label>
                <Input
                  type="text"
                  id="title"
                  className=" w-full md:max-w-140 sm:max-w-110 max-w-100 text-sm font-normal"
                  placeholder="Enter your ad title"
                  {...register("title", {
                    required: "Title is required ",
                    maxLength: {
                      value: 50,
                      message: "Title must be less than 50 character",
                    },
                  })}
                />
                {errors?.title && (
                  <p className="text-(--color-danger) text-[10px] font-normal absolute -bottom-4 right-0">
                    {errors.title.message}
                  </p>
                )}
              </div>
              <div className="flex relative flex-col sm:flex-row gap-1 sm:gap-4 sm:justify-between sm:items-center text-sm font-medium ">
                <label htmlFor="ad-title">Book Type</label>
                <SelectFeild
                  placeholder="please select book type"
                  selectItems={BookType}
                  control={control}
                  name="category"
                />
                {errors.category && (
                  <p className="text-(--color-danger) text-[10px] font-normal absolute -bottom-4 right-0">
                    {errors?.category?.message}
                  </p>
                )}
              </div>
              <div className=" relative flex flex-col sm:flex-row gap-1 sm:gap-4 sm:justify-between sm:items-center text-sm font-medium whitespace-nowrap">
                <label htmlFor="ad-title">Book Condition</label>
                <RadioGroupFeild
                  RadioItem={BookCondition}
                  control={control}
                  name="condition"
                />
                {errors.condition && (
                  <p className="text-(--color-danger) text-[10px] font-normal absolute right-0">
                    error.condition.message
                  </p>
                )}
              </div>
              <div className="relative flex flex-col sm:flex-row gap-1 sm:gap-4 sm:justify-between sm:items-center text-sm font-medium whitespace-nowrap">
                <label htmlFor="ad-title">For Class</label>
                <SelectFeild
                  placeholder="please select book type"
                  selectItems={ForClass}
                  control={control}
                  name="classType"
                />
                {errors.classType && (
                  <p className="text-(--color-danger) text-[10px] font-normal absolute -bottom-4 right-0">
                    {errors.classType?.message}
                  </p>
                )}
              </div>
              <div className="relative flex flex-col sm:flex-row gap-1 sm:gap-4 sm:justify-between sm:items-center text-sm font-medium ">
                <label htmlFor="ad-title">Book Title/Subject</label>
                <Input
                  type="text"
                  id="ad-title"
                  className="w-full md:max-w-140 sm:max-w-110 max-w-100 text-sm font-normal"
                  placeholder="Enter your book name"
                  {...register("subject", {
                    required: "Book Title/Subject is required",
                    maxLength: {
                      value: 50,
                      message:
                        "Book Title/Subject must be less than 50 character",
                    },
                  })}
                />
                {errors.subject && (
                  <p className="text-(--color-danger) text-[10px] font-normal absolute -bottom-4 right-0">
                    {errors.subject.message}
                  </p>
                )}
              </div>
              <div className=" relative flex flex-col sm:gap-2 gap-1  text-sm font-medium ">
                <label htmlFor="ad-title">Upload Photos</label>
                <div className="text-(--color-accent-yellow) text-center flex flex-col items-center justify-center gap-2  border-dashed border-2 rounded-md p-4 border-(--color-surface-muted) bg-(--color-surface-soft) hover:underline cursor-pointer">
                  {previewsImages.length > 0 ? (
                    <div className="flex gap-2 mt-2 flex-wrap">
                      {previewsImages.map((url, index) => (
                        <div
                          key={index}
                          className="relative w-20 h-20 border rounded-md overflow-hidden"
                        >
                          <img
                            src={url}
                            alt="preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                      <div className="relative flex items-center justify-center w-20 h-20 border border-dashed bg-white rounded-md overflow-hidden">
                        <PlusCircle
                          size={32}
                          onClick={() => {
                            fileInputRef.current?.click();
                          }}
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      <Camera size={32} />
                      <p
                        onClick={() => {
                          fileInputRef.current?.click();
                        }}
                      >
                        Click here to upload up to 4 images (Size: 15MB max.
                        each)
                      </p>
                    </>
                  )}
                </div>
                <Input
                  type="file"
                  multiple
                  className="hidden"
                  {...rest}
                  ref={(e) => {
                    hookFormRef(e); // Give the element to React Hook Form
                    fileInputRef.current = e; // Give the element to your manual ref
                  }}
                />
                {errors.images && (
                  <p className="text-(--color-danger) text-[10px] font-normal absolute -bottom-4 right-0">
                    {errors.images?.message}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </fieldset>
        <fieldset>
          {/* Optional Details */}
          <Card className="relative overflow-hidden p-0 ">
            <div className="h-1 bg-(--color-accent-yellow) w-full absolute top-0"></div>
            <CardHeader className="flex flex-col text-xl  text-(--color-button-yellow-hover) font-medium bg-(--color-surface-soft) py-6">
              <div className="flex items-center gap-4">
                <CircleQuestionMark /> <span>Optional Details</span>{" "}
              </div>
              <p className="text-(--color-text-muted) text-sm font-light">
                (Description, MRP, Author, etc...)
              </p>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 md:m-4 my-2">
              <AccordianFeild optionalDetail={OptionalDetails} />
            </CardContent>
          </Card>
        </fieldset>
        <fieldset>
          {/* Pricing Details */}
          <Card className="relative overflow-hidden p-0 ">
            <div className="h-1 bg-[#eab308] w-full absolute top-0"></div>
            <CardHeader className="flex flex-col text-xl  text-(--color-button-yellow-hover) font-medium bg-(--color-surface-soft) py-6">
              <div className="flex items-center gap-4">
                <DollarSign /> <span>Pricing Details</span>{" "}
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-6 md:m-4 my-2">
              <div className="relative flex flex-col sm:flex-row gap-1 sm:gap-4 sm:justify-between sm:items-center text-sm font-medium whitespace-nowrap">
                <label htmlFor="ad-title">Your Price (₹)</label>
                <Input
                  type="number"
                  id="ad-title"
                  className=" md:max-w-140 text-sm font-normal"
                  placeholder="Enter your final price"
                  {...register("finalPrice", {
                    required: "Price is required",
                    max: {
                      value: 2000,
                      message: "price must be less than 2000",
                    },
                  })}
                />
                {errors.finalPrice && (
                  <p className="text-(--color-danger) text-[10px] font-normal absolute -bottom-4 right-0">
                    {errors.finalPrice?.message}
                  </p>
                )}
              </div>
              <div>
                <div className="flex items-center justify-between gap-4">
                  <div className="relative flex flex-col sm:flex-row gap-1 sm:gap-4 sm:justify-between sm:items-center text-sm font-medium whitespace-nowrap">
                    <label htmlFor="ad-title">Shipping Charges</label>
                    <Input
                      type="number"
                      id="ad-title"
                      className=" md:max-w-140 text-sm font-normal"
                      placeholder="Enter shipping charges"
                      {...(isFreeShipping ? { disabled: true } : {})}
                      {...register("shippingCharge", {
                        max: {
                          value: 2000,
                          message: "Shipping Charge must be less than 2000",
                        },
                      })}
                    />
                  </div>{" "}
                  <p>or</p>
                  <div className=" flex items-center text-sm gap-2">
                    <Checkbox
                      id="freeShipping"
                      name="FreeShippping"
                      onCheckedChange={(checked: boolean) => {
                        setIsFreeShipping(checked);
                      }}
                    />{" "}
                    <label htmlFor="freeShipping">Free Shipping</label>
                  </div>
                  {errors.shippingCharge && (
                    <p className="text-(--color-danger) text-[10px] font-normal absolute bottom-4 left-8">
                      {errors.shippingCharge?.message}
                    </p>
                  )}
                </div>
                <p className="text-xs mt-1  text-right font-light">
                  Buyers prefer free shipping or low shipping charges.
                </p>
              </div>
            </CardContent>
          </Card>
        </fieldset>
        <fieldset>
          {/* Bank Details */}
          <Card className="relative overflow-hidden p-0 pb-4 ">
            <div className="h-1 bg-[#eab308] w-full absolute top-0"></div>
            <CardHeader className="flex flex-col text-xl  text-[#ca8a04] font-medium bg-(--color-surface-soft) py-6">
              <div className="flex items-center gap-4">
                <CreditCard /> <span>Bank Details</span>{" "}
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 md:m-4 my-2">
              <div className=" relative flex flex-col  sm:flex-row gap-1 sm:gap-4 sm:justify-between  text-sm font-medium whitespace-nowrap">
                <div>Payment Mode</div>
                <div>
                  <p className="font-normal whitespace-break-spaces mb-2">
                    After your book is sold, in what mode would you like to
                    receive the payment?
                  </p>
                  <RadioGroupFeild
                    RadioItem={["UPI", "Bank Account"]}
                    control={control}
                    name="paymentMode"
                  />
                  {errors.paymentMode && (
                    <p className="text-(--color-danger) text-[10px] font-normal absolute bottom-0 right-0">
                      {errors.paymentMode?.message}
                    </p>
                  )}
                </div>
              </div>
              {paymentMode === "UPI" && (
                <div className="relative flex flex-col text-[#374151] sm:flex-row gap-1 sm:gap-4 sm:justify-between sm:items-center text-sm font-medium whitespace-nowrap">
                  <label htmlFor="ad-title">UPI ID</label>
                  <Input
                    type="text"
                    id="ad-title"
                    className="w-full md:max-w-140 sm:max-w-110 max-w-100  text-sm font-normal"
                    placeholder="Enter your final price"
                    {...register("paymentDetails.UpiId", {
                      validate: (value) => {
                        // Check if the current payment mode is UPI
                        if (paymentMode === "UPI") {
                          if (!value || value.trim() === "") {
                            return "UPI ID is required for UPI payments";
                          }

                          // Optional: Add a format check
                          if (!value.includes("@")) {
                            return "Invalid UPI ID format (must include @)";
                          }
                        }
                        // If paymentMode is NOT "UPI", or value is fine, return true
                        return true;
                      },
                    })}
                  />
                  {"UpiId" in (errors.paymentDetails || {}) && (
                    <p className="text-(--color-danger) text-[10px] font-normal absolute -bottom-4 right-0">
                      {(errors.paymentDetails as any)?.UpiId?.message}
                    </p>
                  )}
                </div>
              )}
              {paymentMode === "Bank Account" && (
                <>
                  <div className="relative flex flex-col text-[#374151] sm:flex-row gap-1 sm:gap-4 sm:justify-between sm:items-center text-sm font-medium whitespace-nowrap">
                    <label htmlFor="ad-title">Account Number</label>
                    <Input
                      type="text"
                      id="ad-title"
                      className="w-full md:max-w-140 sm:max-w-110 max-w-100  text-sm font-normal"
                      placeholder="Enter your account number"
                      {...register("paymentDetails.AccountNumber", {
                        validate: (value) => {
                          // Check if the current payment mode is UPI
                          if (paymentMode === "Bank Account") {
                            if (!value || value.trim() === "") {
                              return "Account Number is required for Bank Account";
                            }
                          }
                          return true;
                        },
                      })}
                    />
                    {"AccountNumber" in (errors.paymentDetails || {}) && (
                      <p className="text-(--color-danger) text-[10px] font-normal absolute -bottom-4 right-0">
                        {(errors.paymentDetails as any)?.AccountNumber?.message}
                      </p>
                    )}
                  </div>
                  <div className="relative flex flex-col text-[#374151] sm:flex-row gap-1 sm:gap-4 sm:justify-between sm:items-center text-sm font-medium whitespace-nowrap">
                    <label htmlFor="ad-title">IFSC Code</label>
                    <Input
                      type="text"
                      id="ad-title"
                      className="w-full md:max-w-140 sm:max-w-110 max-w-100  text-sm font-normal"
                      placeholder="Enter your IFSC Code"
                      {...register("paymentDetails.IFSC", {
                        validate: (value) => {
                          if (paymentMode === "Bank Account") {
                            if (!value || value.trim() === "") {
                              return "IFSC code is required";
                            }
                          }
                          return true;
                        },
                      })}
                    />
                    {"IFSC" in (errors.paymentDetails || {}) && (
                      <p className="text-(--color-danger) text-[10px] font-normal absolute -bottom-4 right-0">
                        {(errors.paymentDetails as any)?.IFSC?.message}
                      </p>
                    )}
                  </div>
                  <div className="relative flex flex-col text-[#374151] sm:flex-row gap-1 sm:gap-4 sm:justify-between sm:items-center text-sm font-medium whitespace-nowrap">
                    <label htmlFor="ad-title">Bank Name</label>
                    <Input
                      type="text"
                      id="ad-title"
                      className="w-full md:max-w-140 sm:max-w-110 max-w-100  text-sm font-normal"
                      placeholder="Enter your Bank name"
                      {...register("paymentDetails.BankName")}
                    />
                    {"BankName" in (errors.paymentDetails || {}) && (
                      <p className="text-(--color-danger) text-[10px] font-normal absolute -bottom-4 right-0">
                        {(errors.paymentDetails as any)?.BankName?.message}
                      </p>
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </fieldset>
        <Button
          type="submit"
          className=" w-full text-xl hover:bg-(--color-button-yellow-hover) bg-(--color-button-yellow) cursor-pointer"
        >
          {isLoading ? (
            <Loader className="animate-spin cursor-pointer" />
          ) : (
            "Post Your Book"
          )}
        </Button>
      </form>
      <p className="text-xs font-light text-(--color-header-text)">
        By clicking "Post Your Book", you agree to our{" "}
        <Link href="" className="text-(--color-accent-yellow)">
          Terms of Use
        </Link>
        ,{" "}
        <Link className="text-(--color-accent-yellow)" href="">
          Privacy Policy
        </Link>
      </p>
    </main>
  );
}
