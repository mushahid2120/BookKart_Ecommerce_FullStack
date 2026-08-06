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
  Image as ImageIcon,
  Trash2,
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
        <div className="flex flex-col gap-4 py-2">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 sm:justify-between sm:items-center text-sm font-medium">
            <label htmlFor="price-mrp" className="text-on-surface-variant text-xs uppercase font-semibold tracking-wider">MRP (₹)</label>
            <Input
              type="number"
              id="price-mrp"
              className="w-full sm:max-w-xs h-11 rounded-xl border border-outline-variant bg-surface text-on-surface text-sm font-normal focus:border-primary focus:ring-1 focus:ring-primary"
              placeholder="Enter your MRP"
              {...register("price", {
                max: { value: 20000, message: "MRP should be less than 20000" },
              })}
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 sm:justify-between sm:items-center text-sm font-medium">
            <label htmlFor="author-name" className="text-on-surface-variant text-xs uppercase font-semibold tracking-wider">Author</label>
            <Input
              type="text"
              id="author-name"
              className="w-full sm:max-w-xs h-11 rounded-xl border border-outline-variant bg-surface text-on-surface text-sm font-normal focus:border-primary focus:ring-1 focus:ring-primary"
              placeholder="Enter your author name"
              {...register("author", {
                maxLength: {
                  value: 50,
                  message: "Author name must be less than 50 character",
                },
              })}
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 sm:justify-between sm:items-center text-sm font-medium">
            <label htmlFor="edition-year" className="text-on-surface-variant text-xs uppercase font-semibold tracking-wider">Edition (Year)</label>
            <Input
              type="text"
              id="edition-year"
              className="w-full sm:max-w-xs h-11 rounded-xl border border-outline-variant bg-surface text-on-surface text-sm font-normal focus:border-primary focus:ring-1 focus:ring-primary"
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
        <div className="flex flex-col gap-2 py-2">
          <label htmlFor="ad-description" className="text-on-surface-variant text-xs uppercase font-semibold tracking-wider">Description</label>
          <Textarea
            id="ad-description"
            placeholder="Enter your description"
            {...register("description", {
              maxLength: {
                value: 100,
                message: "description must be less than 100 character",
              },
            })}
            className="w-full rounded-xl border border-outline-variant bg-surface text-on-surface text-sm font-normal focus:border-primary focus:ring-1 focus:ring-primary min-h-25"
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
        setTimeout(()=>{router.push(`/books/${response.data.productid}`)},3000)
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
    <main className="w-full max-w-7xl mx-auto px-4 md:px-8 pt-6 pb-12 flex flex-col gap-6">
      {/* Hero Header */}
      <section className="mb-2">
        <h1 className="font-headline-xl text-3xl md:text-4xl text-primary font-bold mb-2">
          Sell Your Used Books
        </h1>
        <p className="font-body-lg text-base md:text-lg text-on-surface-variant">
          Submit a free classified ad to sell your used books for cash in India
        </p>
      </section>

      {/* Media-Focused Split Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Image Upload (Sticky on Desktop) */}
        <div className="lg:col-span-5 h-fit lg:sticky lg:top-26">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-3xl shadow-sm overflow-hidden flex flex-col h-full">
            <div className="bg-surface-container-low px-6 py-4 border-b border-outline-variant flex items-center gap-3 rounded-t-3xl">
              <Camera className="text-primary w-6 h-6" />
              <h2 className="font-headline-md text-xl text-on-surface font-semibold">
                Upload Book Cover
              </h2>
            </div>
            <div className="p-6 flex flex-col gap-4">
              <p className="font-body-md text-sm text-on-surface-variant">
                Upload clear images of your book's cover, back, and any relevant interior pages to attract buyers.
              </p>

              {/* Upload Dropzone Container */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-full max-h-100 aspect-3/4 border-2 border-dashed border-primary/50 rounded-3xl bg-surface hover:bg-surface-container-low transition-colors flex flex-col items-center justify-center p-6 cursor-pointer group relative overflow-hidden"
              >
                {previewsImages.length > 0 ? (
                  <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-inner">
                    <img
                      src={previewsImages[0]}
                      alt="Primary Book Cover Preview"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white p-4 text-center">
                      <Camera className="w-10 h-10 mb-2" />
                      <span className="font-semibold text-sm">Click to change / add photos</span>
                      <span className="text-xs text-white/80 mt-1">
                        ({previewsImages.length} of 4 uploaded)
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full bg-primary-container/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Camera className="text-primary w-8 h-8" />
                    </div>
                    <span className="font-headline-md text-lg text-primary font-semibold mb-2">
                      Upload Photos
                    </span>
                    <p className="font-body-sm text-xs text-on-surface-variant max-w-55">
                      Click or drag images here to upload up to 4 images (Size: 15MB max. each)
                    </p>
                  </div>
                )}
              </div>

              {/* Preview Thumbnails Row */}
              <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
                {[0, 1, 2, 3].map((index) => {
                  const isUploaded = index < previewsImages.length;
                  return (
                    <div
                      key={index}
                      onClick={() => fileInputRef.current?.click()}
                      className={`min-w-19 h-24 rounded-xl border flex items-center justify-center cursor-pointer transition-all relative overflow-hidden ${
                        isUploaded
                          ? "border-primary shadow-sm bg-surface"
                          : "border-dashed border-outline-variant bg-surface text-outline-variant hover:border-primary/50"
                      }`}
                    >
                      {isUploaded ? (
                        <>
                          <img
                            src={previewsImages[index]}
                            alt={`Thumbnail ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          {index === 0 && (
                            <span className="absolute bottom-1 left-1 bg-primary text-white text-[10px] px-1.5 py-0.5 rounded font-medium shadow-xs">
                              Cover
                            </span>
                          )}
                        </>
                      ) : (
                        <div className="flex flex-col items-center justify-center gap-1 text-on-surface-variant/60">
                          <PlusCircle className="w-5 h-5" />
                          <span className="text-[10px] font-medium">Slot {index + 1}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <input
                type="file"
                multiple
                className="hidden"
                {...rest}
                ref={(e) => {
                  hookFormRef(e);
                  fileInputRef.current = e;
                }}
              />
              {errors.images && (
                <p className="text-error text-xs font-medium mt-1">
                  {errors.images?.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Book Information Form */}
        <div className="lg:col-span-7">
          <form onSubmit={handleSubmit(handlePost)} className="flex flex-col gap-6">
            
            {/* Book Details Card */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-3xl shadow-sm overflow-hidden flex flex-col">
              <div className="bg-surface-container-low px-6 py-4 border-b border-outline-variant flex items-center gap-3 rounded-t-3xl">
                <Book className="text-primary w-6 h-6" />
                <h2 className="font-headline-md text-xl text-on-surface font-semibold">
                  Book Information
                </h2>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                
                {/* Ad Title */}
                <div className="md:col-span-2 flex flex-col gap-1.5 relative">
                  <label htmlFor="title" className="font-label-md text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                    Ad Title
                  </label>
                  <input
                    id="title"
                    type="text"
                    className="w-full h-12 px-4 rounded-xl border border-outline-variant bg-surface text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm transition-all placeholder:text-on-surface-variant/60"
                    placeholder="Enter your ad title"
                    {...register("title", {
                      required: "Title is required",
                      maxLength: {
                        value: 50,
                        message: "Title must be less than 50 characters",
                      },
                    })}
                  />
                  {errors?.title && (
                    <p className="text-error text-xs font-medium mt-1">{errors.title.message}</p>
                  )}
                </div>

                {/* Book Title / Subject */}
                <div className="md:col-span-2 flex flex-col gap-1.5 relative">
                  <label htmlFor="subject" className="font-label-md text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                    Book Title / Subject
                  </label>
                  <input
                    id="subject"
                    type="text"
                    className="w-full h-12 px-4 rounded-xl border border-outline-variant bg-surface text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm transition-all placeholder:text-on-surface-variant/60"
                    placeholder="Enter your book name"
                    {...register("subject", {
                      required: "Book Title/Subject is required",
                      maxLength: {
                        value: 50,
                        message: "Book Title/Subject must be less than 50 characters",
                      },
                    })}
                  />
                  {errors.subject && (
                    <p className="text-error text-xs font-medium mt-1">{errors.subject.message}</p>
                  )}
                </div>

                {/* Book Type */}
                <div className="flex flex-col gap-1.5 relative">
                  <label className="font-label-md text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                    Book Type
                  </label>
                  <SelectFeild
                    placeholder="please select book type"
                    selectItems={BookType}
                    control={control}
                    name="category"
                  />
                  {errors.category && (
                    <p className="text-error text-xs font-medium mt-1">{errors?.category?.message}</p>
                  )}
                </div>

                {/* For Class */}
                <div className="flex flex-col gap-1.5 relative">
                  <label className="font-label-md text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                    For Class
                  </label>
                  <SelectFeild
                    placeholder="please select class"
                    selectItems={ForClass}
                    control={control}
                    name="classType"
                  />
                  {errors.classType && (
                    <p className="text-error text-xs font-medium mt-1">{errors.classType?.message}</p>
                  )}
                </div>

                {/* Book Condition */}
                <div className="md:col-span-2 flex flex-col gap-1.5 mt-1 relative">
                  <label className="font-label-md text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                    Book Condition
                  </label>
                  <RadioGroupFeild
                    RadioItem={BookCondition}
                    control={control}
                    name="condition"
                  />
                  {errors.condition && (
                    <p className="text-error text-xs font-medium mt-1">{errors.condition?.message}</p>
                  )}
                </div>

              </div>
            </div>

            {/* Optional Details Card */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-3xl shadow-sm overflow-hidden flex flex-col">
              <div className="bg-surface-container-low px-6 py-4 border-b border-outline-variant flex items-center gap-3 rounded-t-3xl">
                <CircleQuestionMark className="text-primary w-6 h-6" />
                <div>
                  <h2 className="font-headline-md text-xl text-on-surface font-semibold">
                    Optional Details
                  </h2>
                  <p className="font-body-sm text-xs text-on-surface-variant">
                    (Description, MRP, Author, etc...)
                  </p>
                </div>
              </div>
              <div className="p-6">
                <AccordianFeild optionalDetail={OptionalDetails} />
              </div>
            </div>

            {/* Pricing Details Card */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-3xl shadow-sm overflow-hidden flex flex-col">
              <div className="bg-surface-container-low px-6 py-4 border-b border-outline-variant flex items-center gap-3 rounded-t-3xl">
                <DollarSign className="text-primary w-6 h-6" />
                <h2 className="font-headline-md text-xl text-on-surface font-semibold">
                  Pricing Details
                </h2>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                
                {/* Your Price */}
                <div className="flex flex-col gap-1.5 relative">
                  <label htmlFor="finalPrice" className="font-label-md text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                    Your Price (₹)
                  </label>
                  <div className="relative w-full">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm font-medium">₹</span>
                    <input
                      id="finalPrice"
                      type="number"
                      className="w-full h-12 pl-8 pr-4 rounded-xl border border-outline-variant bg-surface text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm transition-all placeholder:text-on-surface-variant/60"
                      placeholder="Enter final price"
                      {...register("finalPrice", {
                        required: "Price is required",
                        max: {
                          value: 2000,
                          message: "Price must be less than 2000",
                        },
                      })}
                    />
                  </div>
                  {errors.finalPrice && (
                    <p className="text-error text-xs font-medium mt-1">{errors.finalPrice?.message}</p>
                  )}
                </div>

                {/* Shipping Charges */}
                <div className="flex flex-col gap-1.5 relative">
                  <label htmlFor="shippingCharge" className="font-label-md text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                    Shipping Charges
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="relative flex-1">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm font-medium">₹</span>
                      <input
                        id="shippingCharge"
                        type="number"
                        disabled={isFreeShipping}
                        className="w-full h-12 pl-8 pr-4 rounded-xl border border-outline-variant bg-surface text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm transition-all disabled:opacity-50 disabled:bg-surface-container-high"
                        placeholder="0"
                        {...register("shippingCharge", {
                          max: {
                            value: 2000,
                            message: "Shipping Charge must be less than 2000",
                          },
                        })}
                      />
                    </div>
                    <span className="text-sm text-on-surface-variant font-medium">or</span>
                    <div className="flex items-center gap-2 cursor-pointer whitespace-nowrap">
                      <Checkbox
                        id="freeShipping"
                        checked={isFreeShipping}
                        onCheckedChange={(checked: boolean) => {
                          setIsFreeShipping(checked);
                        }}
                      />
                      <label htmlFor="freeShipping" className="text-sm font-medium text-on-surface cursor-pointer">
                        Free Shipping
                      </label>
                    </div>
                  </div>
                  <p className="text-xs text-on-surface-variant mt-1">Buyers prefer free shipping or low shipping charges.</p>
                  {errors.shippingCharge && (
                    <p className="text-error text-xs font-medium mt-1">{errors.shippingCharge?.message}</p>
                  )}
                </div>

              </div>
            </div>

            {/* Payment Preferences Card */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-3xl shadow-sm overflow-hidden flex flex-col">
              <div className="bg-surface-container-low px-6 py-4 border-b border-outline-variant flex items-center gap-3 rounded-t-3xl">
                <CreditCard className="text-primary w-6 h-6" />
                <h2 className="font-headline-md text-xl text-on-surface font-semibold">
                  Payment Preferences
                </h2>
              </div>
              <div className="p-6 flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <label className="font-label-md text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                    Payment Mode
                  </label>
                  <p className="text-sm text-on-surface">
                    After your book is sold, in what mode would you like to receive the payment?
                  </p>
                  <div className="mt-2">
                    <RadioGroupFeild
                      RadioItem={["UPI", "Bank Account"]}
                      control={control}
                      name="paymentMode"
                    />
                  </div>
                  {errors.paymentMode && (
                    <p className="text-error text-xs font-medium mt-1">{errors.paymentMode?.message}</p>
                  )}
                </div>

                {paymentMode === "UPI" && (
                  <div className="flex flex-col gap-1.5 relative">
                    <label htmlFor="upiId" className="font-label-md text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                      UPI ID
                    </label>
                    <input
                      id="upiId"
                      type="text"
                      className="w-full h-12 px-4 rounded-xl border border-outline-variant bg-surface text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm transition-all placeholder:text-on-surface-variant/60"
                      placeholder="Enter your UPI ID (e.g. username@upi)"
                      {...register("paymentDetails.UpiId", {
                        validate: (value) => {
                          if (paymentMode === "UPI") {
                            if (!value || value.trim() === "") {
                              return "UPI ID is required for UPI payments";
                            }
                            if (!value.includes("@")) {
                              return "Invalid UPI ID format (must include @)";
                            }
                          }
                          return true;
                        },
                      })}
                    />
                    {"UpiId" in (errors.paymentDetails || {}) && (
                      <p className="text-error text-xs font-medium mt-1">
                        {(errors.paymentDetails as any)?.UpiId?.message}
                      </p>
                    )}
                  </div>
                )}

                {paymentMode === "Bank Account" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5 md:col-span-2">
                      <label htmlFor="accountNumber" className="font-label-md text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                        Account Number
                      </label>
                      <input
                        id="accountNumber"
                        type="text"
                        className="w-full h-12 px-4 rounded-xl border border-outline-variant bg-surface text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm transition-all"
                        placeholder="Enter your account number"
                        {...register("paymentDetails.AccountNumber", {
                          validate: (value) => {
                            if (paymentMode === "Bank Account") {
                              if (!value || value.trim() === "") {
                                return "Account Number is required";
                              }
                            }
                            return true;
                          },
                        })}
                      />
                      {"AccountNumber" in (errors.paymentDetails || {}) && (
                        <p className="text-error text-xs font-medium mt-1">
                          {(errors.paymentDetails as any)?.AccountNumber?.message}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="ifscCode" className="font-label-md text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                        IFSC Code
                      </label>
                      <input
                        id="ifscCode"
                        type="text"
                        className="w-full h-12 px-4 rounded-xl border border-outline-variant bg-surface text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm transition-all"
                        placeholder="Enter IFSC Code"
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
                        <p className="text-error text-xs font-medium mt-1">
                          {(errors.paymentDetails as any)?.IFSC?.message}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="bankName" className="font-label-md text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                        Bank Name
                      </label>
                      <input
                        id="bankName"
                        type="text"
                        className="w-full h-12 px-4 rounded-xl border border-outline-variant bg-surface text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm transition-all"
                        placeholder="Enter Bank name"
                        {...register("paymentDetails.BankName")}
                      />
                      {"BankName" in (errors.paymentDetails || {}) && (
                        <p className="text-error text-xs font-medium mt-1">
                          {(errors.paymentDetails as any)?.BankName?.message}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Action */}
            <div className="flex flex-col items-center mt-2 mb-8">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 h-14 bg-primary-container text-on-primary-container hover:bg-primary-container/90 rounded-3xl font-headline-md text-lg font-semibold shadow-sm transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center"
              >
                {isLoading ? <Loader className="animate-spin h-6 w-6" /> : "Post Your Book"}
              </Button>
              <p className="font-label-md text-xs text-on-surface-variant mt-3 text-center">
                By clicking "Post Your Book", you agree to our{" "}
                <Link href="/term-of-use" className="text-primary underline font-medium hover:opacity-80">
                  Terms of Use
                </Link>
                ,{" "}
                <Link href="/privacy-policy" className="text-primary underline font-medium hover:opacity-80">
                  Privacy Policy
                </Link>
              </p>
            </div>

          </form>
        </div>

      </div>
    </main>
  );
}
