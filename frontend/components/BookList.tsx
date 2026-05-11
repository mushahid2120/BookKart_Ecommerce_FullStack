"use client";
import { useEffect, useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";
import Link from "next/link";
import { IBook } from "@/app/books/page";
import { monthDiff } from "@/lib/bookUploadTime";
import { useDispatch, useSelector } from "react-redux";
import {
  useAddToWishlistMutation,
  useLazyGetWishlistQuery,
  useRemoveFromWishlistMutation,
} from "@/store/api";
import { setWishlist } from "@/store/slice/wishlistSlice";
import toast from "react-hot-toast";
import { RootState } from "@/store/store";
import { toggleLoginDialog } from "@/store/slice/userSlice";

export default function BookList({
  books,
  isLoading = false,
  error = null,
  onRetry = () => {},
}: {
  books: IBook[];
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}) {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const dispatch = useDispatch();
  const [addProductToWishList] = useAddToWishlistMutation();
  const [getWishlist] = useLazyGetWishlistQuery();
  const [removeProductFromWishlist] = useRemoveFromWishlistMutation();
  const wishlist = useSelector((state: RootState) => state.wishlist.product);
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);
  const productQuery = useSelector(
    (state: RootState) => state.productQuery.query,
  );

  const calculateDiscount = (price: number, finalPrice: number) => {
    if (price > finalPrice && price > 0) {
      return Math.round(((price - finalPrice) / price) * 100);
    }
    return 0;
  };

  const handleAddToWishlist = async (productId: string) => {
    try {
      const response = await addProductToWishList(productId).unwrap();
      if (response.isSuccess) {
        await fetchingWishlist();
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
      if (response.isSuccess) {
        await fetchingWishlist();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchingWishlist = async () => {
    try {
      const response = await getWishlist({}).unwrap();
      if (response.isSuccess) {
        dispatch(setWishlist(response.data));
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (isLoggedIn) fetchingWishlist();
  }, [isLoggedIn]);


  // Show loading shimmer
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid lg:grid-cols-3 grid-cols-2 gap-4 mt-2 ml-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="overflow-hidden pb-4">
              <div className="aspect-video w-full bg-(--color-surface-soft) animate-pulse"></div>
              <CardContent className="px-2 sm:px-4 pt-4">
                <div className="h-4 bg-(--color-surface-soft) animate-pulse rounded mb-2"></div>
                <div className="h-3 bg-(--color-surface-soft) animate-pulse rounded w-3/4 mb-3"></div>
                <div className="h-5 bg-(--color-surface-soft) animate-pulse rounded mb-3"></div>
                <div className="h-3 bg-(--color-surface-soft) animate-pulse rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex items-center justify-center flex-col h-96">
        <div className="max-w-120 flex items-center flex-col justify-center text-center gap-4">
          <div>
            <img
              src={`/Image/EmptyWishlist.png`}
              alt="Error Image"
              className="w-32 h-32"
            />
          </div>
          <h1 className="text-2xl font-medium text-(--color-text-primary)">
            Oops! Something went wrong
          </h1>
          <p className="text-(--color-text-muted) font-light max-w-sm">
            {error}
          </p>
          <Button
            className="bg-(--color-button-yellow) hover:bg-(--color-button-yellow-hover) text-white cursor-pointer"
            onClick={onRetry}
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  // Show empty state
  if (books.length === 0) {
    return (
      <div className="flex items-center justify-center flex-col h-96">
        <div className="max-w-120 flex items-center flex-col justify-center text-center gap-4">
          <div>
            <img
              src={`/Image/EmptyWishlist.png`}
              alt="No books found"
              className="w-32 h-32"
            />
          </div>
          <h1 className="text-2xl font-medium">No Books Found</h1>
          <p className="text-(--color-text-muted) font-light max-w-sm">
            The books matching your filters are not available right now. Try
            adjusting your search filters!
          </p>
        </div>
      </div>
    );
  }

  // Show books list
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

                <div className="absolute mt-2 bg-(--color-accent-yellow) text-white rounded-r-xl pl-1 pr-2 font-semibold text-sm z-100">
                  {calculateDiscount(book.price, book.finalPrice)}% Off
                </div>

                <div
                  className=" absolute top-2 right-2 p-1 text-(--color-danger) bg-(--color-surface-soft) hover:bg-(--color-surface-muted) hover:text-(--color-danger) rounded-full z-100"
                  onClick={(e) => {
                    e.preventDefault(); // stops Link navigation
                    e.stopPropagation();
                    if (!isLoggedIn) {
                      dispatch(toggleLoginDialog());
                      return;
                    }
                    if (wishlist.find((item) => item._id === book._id)) {
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
                      wishlist.find((item) => item._id === book._id)
                        ? "red"
                        : "none"
                    }
                  />
                </div>

                <CardContent className="px-2 sm:px-4">
                  <div className="font-semibold truncate sm:py-0 sm:text-base text-[14px]">
                    {book.title}
                  </div>
                  <div className="font-normal sm:text-sm text-[12px]  text-(--color-text-muted) ">
                    {book.author}
                  </div>

                  <h3 className="sm:text-lg text-[13px] font-semibold my-1 text-(--color-price-text)">
                    ₹{book.finalPrice}
                    <span className="line-through sm:text-sm text-[11px] font-normal sm:ml-2 ml-1">
                      ₹{book.price}
                    </span>
                  </h3>
                  <div className="flex justify-between items-center ">
                    <p className="sm:text-[12px] text-[8px] text-(--color-text-muted)">
                      {monthDiff(book.createdAt)} month ago
                    </p>

                    <span className="sm:text-[14px] text-[10px] text-(--color-text-muted)">
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
                className={` ${currentPage === i + 1 ? "bg-(--color-accent-yellow) text-white" : ""}`}
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
