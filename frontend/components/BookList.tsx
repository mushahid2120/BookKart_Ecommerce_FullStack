"use client";
import { useEffect, useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";
import Link from "next/link";
import { IBook } from "@/app/books/page";
import { monthDiff } from "@/lib/bookUploadTime";
import { IWishlistItem } from "@/lib/types/product";
import { useDispatch, useSelector } from "react-redux";
import {
  useAddToWishlistMutation,
  useLazyGetWishlistQuery,
  useRemoveFromWishlistMutation,
} from "@/store/api";
import {  setWishlist } from "@/store/slice/wishlistSlice";
import toast from "react-hot-toast";
import { RootState } from "@/store/store";

export default function BookList({ books }: { books: IBook[] }) {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const dispatch = useDispatch();
  const [addProductToWishList] = useAddToWishlistMutation();
  const [getWishlist] = useLazyGetWishlistQuery();
  const [removeProductFromWishlist] = useRemoveFromWishlistMutation();
  const wishlist=useSelector((state:RootState)=>state.wishlist.product)

  const calculateDiscount = (price: number, finalPrice: number) => {
    if (price > finalPrice && price > 0) {
      return Math.round(((price - finalPrice) / price) * 100);
    }
    return 0;
  };

  const handleAddToWishlist = async (productId:string) => {
    try {
      const response = await addProductToWishList(productId).unwrap();
      if(response.isSuccess){
        await fetchingWishlist()
      }
    } catch (error: any) {
      console.log(error);
      if (error.status === 400) {
        toast.error("Seller will not added their own product to wishlist");
      }
    }
  };

  const removeFromWishlistByProductId = async (productid: string) => {
    try {
      const response = await removeProductFromWishlist(productid).unwrap();
      if(response.isSuccess){
        await fetchingWishlist()
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchingWishlist = async () => {
    try {
      const response = await getWishlist({}).unwrap();
      if (response.isSuccess) {
        dispatch(setWishlist(response.data))
      }
    } catch (error) {
      console.log(error);
    }
  };


  useEffect(() => {
    fetchingWishlist();
  }, []);

  if (books.length === 0)
    return (
      <div className=" text-center py-12 text-2xl text-gray-700">
        No Book Found
      </div>
    );



  return (
    <div>
      <div className="grid lg:grid-cols-3 grid-cols-2 gap-4 mt-2 ml-2 ">
        {books
          .slice((currentPage - 1) * 6, currentPage * 6)
          .map((book: any) => (
            <Link href={`/books/${book._id}`} key={book._id}>
              <Card className="relative hover:shadow-2xl py-0 overflow-hidden pb-4 gap-2 sm:gap-4">
                <img
                  src={book.images[0]}
                  alt={book.title}
                  className="relative aspect-video w-full object-cover"
                />

                <div className="absolute mt-2 bg-orange-600 text-white rounded-r-xl pl-1 pr-2 font-semibold text-sm z-100">
                  {calculateDiscount(book.price, book.finalPrice)}% Off
                </div>

                <div
                  className=" absolute top-2 right-2 p-1 text-red-500 bg-[#ddeafe] hover:bg-[#c5d5ee] hover:text-red-600 rounded-full z-100"
                  onClick={(e) => {
                    e.preventDefault(); // stops Link navigation
                    e.stopPropagation();

                    if (wishlist.find((item)=>item._id===book._id)) {
                      removeFromWishlistByProductId(book._id);
                    } else {
                      handleAddToWishlist(book._id);
                    }
                  }}
                >
                  <Heart
                    width={22}
                    fill={
                      book &&
                      wishlist &&
                      wishlist.find((item)=>item._id===book._id)
                        ? "red"
                        : "none"
                    }
                  />
                </div>

                <CardContent className="px-2 sm:px-4">
                  <div className="font-semibold truncate sm:py-0 sm:text-base text-[14px]">
                    {book.title}
                  </div>
                  <div className="font-normal sm:text-sm text-[12px]  text-gray-500 ">
                    {book.author}
                  </div>

                  <h3 className="sm:text-lg text-[13px] font-semibold my-1 text-(--color-price-text)">
                    ₹{book.finalPrice}
                    <span className="line-through sm:text-sm text-[11px] font-normal sm:ml-2 ml-1">
                      ₹{book.price}
                    </span>
                  </h3>
                  <div className="flex justify-between items-center ">
                    <p className="sm:text-[12px] text-[8px] text-gray-400">
                      {monthDiff(book.createdAt)} month ago
                    </p>

                    <span className="sm:text-[14px] text-[10px] text-gray-500">
                      {book.condition}
                    </span>
                  </div>

                  {/* <Button className="mt-3 w-full bg-[#eb5a0d]">Buy Now</Button> */}
                </CardContent>
              </Card>
            </Link>
          ))}
      </div>
      <div className="flex gap-2 justify-center items-center mt-8">
        <Button
          variant="outline"
          className={
            currentPage === 1 ? "text-black/20 hover:text-black/20" : ""
          }
          onClick={() => {
            setCurrentPage((prev) => {
              if (prev === 1) return prev;
              return prev - 1;
            });
          }}
        >
          <ChevronLeft />
        </Button>
        {Array.from({ length: Math.ceil(books.length / 6) }).map((_, i) => {
          if (i + 1 <= currentPage + 2 && i + 1 >= currentPage - 1)
            return (
              <Button
                variant="outline"
                key={i}
                className={` ${currentPage === i + 1 ? "bg-blue-400 text-white" : ""}`}
                onClick={() => {
                  setCurrentPage((prev) => i + 1);
                }}
              >
                {i + 1}
              </Button>
            );
        })}
        <Button
          variant="outline"
          className={
            currentPage === books.length / 6
              ? "text-black/40 hover:text-black/40"
              : ""
          }
          onClick={() => {
            setCurrentPage((prev) => {
              if (prev === books.length / 6) return prev;
              return prev + 1;
            });
          }}
        >
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
}
