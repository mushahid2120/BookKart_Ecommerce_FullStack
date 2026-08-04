"use client";

import { Button } from "@/components/ui/button";
import { IProduct } from "@/lib/types/product";
import {
  useDeleteProductMutation,
  useLazyGetProductBySellerIdQuery,
} from "@/store/api";
import {
  BookOpen,
  Eye,
  Loader2,
  Plus,
  RefreshCcw,
  Search,
  Trash2,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import toast from "react-hot-toast";

export default function SellingProductsPage() {
  const [sellingbook, setSellingBook] = useState<IProduct[]>([]);
  const [getMyPostedBooks] = useLazyGetProductBySellerIdQuery();
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [isPageLoading, setIsPageLoading] = useState<boolean>(true);
  const [pageError, setPageError] = useState<string | null>(null);
  const [deleteProduct] = useDeleteProductMutation();

  // Client presentation search & category filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    getAllPostedBooksByMe();
  }, []);

  const getAllPostedBooksByMe = async () => {
    try {
      setPageError(null);
      setIsPageLoading(true);
      const response = await getMyPostedBooks({}).unwrap();

      if (response.isSuccess) {
        setSellingBook(response.data);
      }
    } catch (error: any) {
      console.log(error);
      setPageError("Failed to load your listed books. Please try again.");
    } finally {
      setIsPageLoading(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      setIsLoading(productId);
      const response = await deleteProduct(productId).unwrap();
      if (response.isSuccess) {
        getAllPostedBooksByMe();
        toast.success("Product has been deleted successfully");
      }
    } catch (error: any) {
      console.log(error);
      if (error.status === 500) {
        toast.error("Something went wrong");
      }
    } finally {
      setIsLoading(null);
    }
  };

  // Extract unique categories for filter tabs
  const categories = useMemo(() => {
    const set = new Set<string>();
    sellingbook.forEach((book) => {
      if (book.category) set.add(book.category);
    });
    return ["All", ...Array.from(set)];
  }, [sellingbook]);

  // Filter books based on search & selected category
  const filteredBooks = useMemo(() => {
    return sellingbook.filter((book) => {
      const matchesSearch =
        searchQuery.trim() === "" ||
        book.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.category?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" || book.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [sellingbook, searchQuery, selectedCategory]);

  // Loading skeleton matching Stitch card grid
  if (isPageLoading) {
    return (
      <div className="space-y-6">
        <div className="rounded-2xl bg-surface-container-lowest border border-outline-variant/40 p-6 animate-pulse h-28 flex flex-col justify-center space-y-3">
          <div className="h-6 bg-surface-container-high rounded-md w-1/3"></div>
          <div className="h-4 bg-surface-container-low rounded-md w-1/2"></div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="rounded-2xl bg-surface-container-lowest border border-outline-variant/40 animate-pulse aspect-3/4 flex flex-col p-4 space-y-3"
            >
              <div className="bg-surface-container-high rounded-xl flex-1 w-full"></div>
              <div className="h-4 bg-surface-container-high rounded w-3/4"></div>
              <div className="h-3 bg-surface-container-low rounded w-1/2"></div>
              <div className="h-8 bg-surface-container-high rounded-xl w-full mt-2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Page error state
  if (pageError) {
    return (
      <div className="flex items-center justify-center min-h-112 bg-surface-container-lowest border border-outline-variant/40 rounded-3xl p-8 text-center shadow-xs">
        <div className="max-w-md flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-error-container text-on-error-container flex items-center justify-center mb-1">
            <AlertCircle size={32} />
          </div>
          <h1 className="text-2xl font-bold text-on-surface">Something went wrong</h1>
          <p className="text-sm text-on-surface-variant leading-relaxed">{pageError}</p>
          <Button
            className="bg-primary hover:bg-primary-fixed-dim text-on-primary font-bold px-6 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-2 mt-2"
            onClick={getAllPostedBooksByMe}
          >
            <RefreshCcw size={16} />
            <span>Try Again</span>
          </Button>
        </div>
      </div>
    );
  }

  // Empty state matching Stitch design
  if (sellingbook.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-125 bg-surface-container-lowest border border-outline-variant/40 rounded-3xl p-8 md:p-12 text-center shadow-xs">
        <div className="max-w-md flex flex-col items-center gap-5">
          <div className="relative w-36 h-36 flex items-center justify-center rounded-3xl bg-surface-container-low/70 border border-outline-variant/30 p-4">
            <img
              src="/Image/selling-book.png"
              alt="No listed books"
              className="object-contain max-h-full max-w-full drop-shadow-md"
            />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-on-surface">
              You haven't sold any books yet.
            </h1>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Start selling your books to reach potential buyers. List your first book now and make it available to others.
            </p>
          </div>
          <Link href="/book-sell">
            <Button className="bg-primary-container hover:bg-primary-fixed text-on-primary-container font-bold px-8 py-3 rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-2.5">
              <Plus size={18} />
              <span>Sell Your First Book</span>
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Seller Dashboard Header Section */}
      <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-3xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center justify-between ">
              <h1 className="whitespace-nowrap text-xl sm:text-3xl font-bold text-on-surface tracking-tight">
                Your Listed Books
              </h1>
            </div>
            <p className="text-sm text-on-surface-variant">
              Manage and track your book listings on the BookKart marketplace
            </p>
          </div>

          <Link href="/book-sell" className="shrink-0">
            <Button className="w-full md:w-auto bg-primary-container hover:bg-primary-fixed text-on-primary-container font-bold px-5 py-2.5 rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer border border-outline-variant/30">
              <Plus size={18} />
              <span>Sell Another Book</span>
            </Button>
          </Link>
        </div>


      </div>

      {/* No Search Results State */}
      {filteredBooks.length === 0 && (
        <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-8 text-center space-y-3">
          <p className="text-on-surface-variant font-medium text-sm">
            No books found matching "{searchQuery}"
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("All");
            }}
            className="text-xs font-bold text-primary hover:underline cursor-pointer"
          >
            Clear search filters
          </button>
        </div>
      )}

      {/* Bento Grid Layout matching Stitch export */}
      {filteredBooks.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {filteredBooks.map((book) => (
            <div
              key={book._id}
              className="bg-surface-container-lowest rounded-2xl border border-outline-variant/50 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col group relative"
            >
              {/* Floating Delete Button */}
              <div className="absolute top-2.5 right-2.5 z-20">
                <button
                  aria-label="Delete listing"
                  disabled={isLoading === book._id}
                  onClick={() => handleDeleteProduct(book._id)}
                  className="bg-error-container text-on-error-container hover:bg-error hover:text-on-error w-8.5 h-8.5 rounded-full flex items-center justify-center shadow-md border border-outline-variant/60 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
                  title="Delete product"
                >
                  {isLoading === book._id ? (
                    <Loader2 className="w-4 h-4 animate-spin text-current" />
                  ) : (
                    <Trash2 className="w-4 h-4 text-current" strokeWidth={2.2} />
                  )}
                </button>
              </div>

              {/* Book Cover Image */}
              <div className="aspect-3/4 h-40 sm:h-50 md:h-60  w-full bg-surface-container-low relative overflow-hidden flex items-center justify-center">
                {book.images && book.images[0] ? (
                  <img
                    src={book.images[0]}
                    alt={book.title || "Book cover"}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center p-4 text-on-surface-variant/40">
                    <BookOpen size={36} />
                  </div>
                )}
              </div>

              {/* Book Details */}
              <div className="p-3.5 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1">
                  <h3 className="font-bold text-sm text-on-surface line-clamp-1 group-hover:text-primary transition-colors">
                    {book.title}
                  </h3>
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[11px] font-medium text-on-surface-variant truncate">
                      {book.subject || book.category || "General"}
                    </span>
                    {book.classType && (
                      <span className="text-[10px] bg-surface-container-high text-on-surface-variant px-1.5 py-0.5 rounded font-medium">
                        Class {book.classType}
                      </span>
                    )}
                  </div>
                </div>

                {/* Pricing & View Action */}
                <div className="pt-2 border-t border-outline-variant/20 space-y-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-base font-bold text-on-surface">
                      ₹{book.finalPrice ?? book.price ?? 0}
                    </span>
                    {book.price && book.finalPrice && book.price > book.finalPrice && (
                      <span className="text-xs text-on-surface-variant line-through">
                        ₹{book.price}
                      </span>
                    )}
                  </div>

                  <Link href={`/books/${book._id}`} className="block">
                    <Button className="w-full py-1.5 bg-primary-container text-on-primary-container font-bold text-[11px] rounded-xl hover:bg-primary-fixed transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer">
                      <Eye size={13} />
                      <span>View</span>
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}

          {/* Add Listing Card Placeholder inside grid */}
          <Link
            href="/book-sell"
            className="bg-surface-container-low/60 rounded-2xl border-2 border-dashed border-outline-variant/60 hover:border-primary hover:bg-surface-container-high/40 transition-all duration-300 overflow-hidden flex flex-col items-center justify-center p-6 aspect-3/4 cursor-pointer group text-center"
          >
            <div className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-xs">
              <Plus className="text-on-primary-container w-6 h-6" />
            </div>
            <h3 className="font-bold text-sm text-on-surface">Sell Another Book</h3>
            <p className="text-[11px] text-on-surface-variant mt-1">
              List a new book for sale
            </p>
          </Link>
        </div>
      )}
    </div>
  );
}
