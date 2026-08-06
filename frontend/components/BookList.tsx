"use client";
import { useEffect, useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";
import Link from "next/link";
import { IBook } from "@/app/(main)/books/page";
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
  onRetry = () => { },
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
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mt-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden shadow-sm">
            <div className="aspect-3/4 w-full bg-surface-container animate-pulse" />
            <CardContent className="p-4 space-y-3">
              <div className="h-5 bg-surface-container animate-pulse rounded w-4/5" />
              <div className="h-3 bg-surface-container animate-pulse rounded w-1/2" />
              <div className="flex justify-between items-center pt-2">
                <div className="h-6 bg-surface-container animate-pulse rounded w-1/3" />
                <div className="w-9 h-9 bg-surface-container animate-pulse rounded-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex items-center justify-center flex-col py-16 px-4 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm my-4">
        <div className="max-w-md flex items-center flex-col justify-center text-center gap-4">
          <div className="p-4 bg-error-container/20 rounded-full">
            <img
              src="/Image/EmptyWishlist.png"
              alt="Error"
              className="w-24 h-24 object-contain opacity-80"
            />
          </div>
          <h2 className="text-xl font-bold text-on-surface">Oops! Something went wrong</h2>
          <p className="text-sm text-on-surface-variant max-w-sm">{error}</p>
          <Button
            className="bg-primary text-on-primary hover:bg-primary/90 font-semibold px-6 rounded-lg cursor-pointer"
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
      <div className="flex items-center justify-center flex-col py-16 px-4 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm my-4">
        <div className="max-w-md flex items-center flex-col justify-center text-center gap-4">
          <div className="p-4 bg-surface-container-low rounded-full">
            <img
              src="/Image/EmptyWishlist.png"
              alt="No books found"
              className="w-24 h-24 object-contain opacity-80"
            />
          </div>
          <h2 className="text-xl font-bold text-on-surface">No Books Found</h2>
          <p className="text-sm text-on-surface-variant max-w-sm">
            The books matching your filters are not available right now. Try adjusting your search filters!
          </p>
        </div>
      </div>
    );
  }

  // Show books list
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {books
          .slice((currentPage - 1) * 6, currentPage * 6)
          .map((book: any) => {
            const isWishlisted = wishlist && wishlist.some((item) => item._id === book._id);
            const discount = calculateDiscount(book.price, book.finalPrice);

            return (
              <Link href={`/books/${book._id}`} key={book._id} className="block group">
                <Card className="bg-surface-container-lowest lg:max-h-100 md:max-h-120 max-h-100 max-w-90 p-0 gap-0 rounded-xl border border-outline-variant overflow-hidden book-card-hover transition-all cursor-pointer flex flex-col shadow-sm hover:shadow-md hover:-translate-y-0.5 group">
                  {/* Image Cover Container with 3:4 Aspect Ratio */}
                  <div className="aspect-3/4 h-2/5 relative overflow-hidden bg-surface-container">
                    <img
                      src={book.images?.[0] || "/placeholder-book.png"}
                      alt={book.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Condition Badge (Top-Right) */}
                    <div className="absolute top-3 right-3 z-10">
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full shadow-xs ${book.condition === "Excellent" || book.condition === "New" || book.condition === "Like New"
                          ? "bg-tertiary-container text-on-tertiary-container"
                          : "bg-surface-variant text-on-surface-variant"
                          }`}
                      >
                        {book.condition || "Used"}
                      </span>
                    </div>

                    {/* Discount Badge (Top-Left) */}
                    {discount > 0 && (
                      <div className="absolute top-3 left-3 z-10">
                        <span className="px-2.5 py-1 bg-primary-container text-on-primary-container text-xs font-bold rounded-full shadow-xs">
                          {discount}% OFF
                        </span>
                      </div>
                    )}

                    {/* Wishlist Heart Button (Bottom-Right of Image) */}
                    <button
                      type="button"
                      className="absolute bottom-3 right-3 z-10 p-2.5 bg-surface-container-lowest/90 hover:bg-surface-container-lowest text-on-surface-variant hover:text-error rounded-full shadow-md backdrop-blur-xs transition-all cursor-pointer"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (!isLoggedIn) {
                          dispatch(toggleLoginDialog());
                          return;
                        }
                        if (isWishlisted) {
                          removeFromWishlistByProductId(book._id);
                        } else {
                          handleAddToWishlist(book._id);
                        }
                      }}
                      title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                    >
                      <Heart
                        className={`w-4 h-4 transition-colors ${isWishlisted
                          ? "fill-error text-error"
                          : "text-on-surface-variant hover:text-error"
                          }`}
                      />
                    </button>
                  </div>

                  {/* Card Content Details */}
                  <CardContent className="p-4 flex flex-col flex-1 gap-0">
                    <div>
                      <h2 className="font-semibold text-xl text-on-surface group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                        {book.title}
                      </h2>
                      <p className="text-xs text-on-surface-variant mt-1 truncate">
                        By {book.author}
                      </p>
                    </div>

                    <div className="flex items-end justify-between mt-2 pt-2 border-t border-outline-variant/30">
                      <div>
                        <div className="flex items-baseline gap-1.5">
                          <span className="font-bold text-lg text-on-surface">
                            ₹{book.finalPrice}
                          </span>
                          {book.price > book.finalPrice && (
                            <span className="text-xs text-on-surface-variant line-through">
                              ₹{book.price}
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-on-surface-variant block mt-0.5">
                          {monthDiff(book.createdAt)} month ago
                        </span>
                      </div>

                      <div className="w-9 h-9 rounded-full bg-surface-container-high group-hover:bg-primary-container text-on-surface group-hover:text-on-primary-container flex items-center justify-center transition-all shadow-xs">
                        <span className="text-xs font-semibold">View</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
      </div>

      {/* Pagination Controls */}
      <div className="mt-10 flex items-center justify-center gap-2">
        <Button
          variant="outline"
          size="icon"
          disabled={currentPage === 1}
          className="w-10 h-10 rounded-full border-outline-variant text-on-surface hover:bg-surface-variant transition-colors disabled:opacity-40 cursor-pointer"
          onClick={() => {
            setCurrentPage((prev) => Math.max(prev - 1, 1));
          }}
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>

        {Array.from({ length: Math.ceil(books.length / 6) }).map((_, i) => {
          const pageNum = i + 1;
          if (pageNum <= currentPage + 2 && pageNum >= currentPage - 1) {
            return (
              <Button
                key={pageNum}
                variant="outline"
                className={`w-10 h-10 rounded-full border-outline-variant font-semibold text-sm transition-all cursor-pointer ${currentPage === pageNum
                  ? "bg-primary text-on-primary border-primary shadow-xs"
                  : "text-on-surface hover:bg-surface-variant"
                  }`}
                onClick={() => setCurrentPage(pageNum)}
              >
                {pageNum}
              </Button>
            );
          }
          return null;
        })}

        <Button
          variant="outline"
          size="icon"
          disabled={currentPage === Math.ceil(books.length / 6) || Math.ceil(books.length / 6) === 0}
          className="w-10 h-10 rounded-full border-outline-variant text-on-surface hover:bg-surface-variant transition-colors disabled:opacity-40 cursor-pointer"
          onClick={() => {
            setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(books.length / 6)));
          }}
        >
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}

