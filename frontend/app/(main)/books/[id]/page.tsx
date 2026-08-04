"use client";
import { Button } from "@/components/ui/button";
import { monthDiff } from "@/lib/bookUploadTime";
import { IProduct } from "@/lib/types/product";
import {
  useAddToCartMutation,
  useAddToWishlistMutation,
  useLazyGetCartQuery,
  useLazyGetProductByIdQuery,
  useLazyGetWishlistQuery,
  useRemoveFromCartMutation,
  useRemoveFromWishlistMutation,
} from "@/store/api";
import { setCart } from "@/store/slice/cartSlice";
import { toggleLoginDialog } from "@/store/slice/userSlice";
import { setWishlist } from "@/store/slice/wishlistSlice";
import { RootState } from "@/store/store";
import {
  CircleCheck,
  Heart,
  Loader,
  MapPin,
  Megaphone,
  ShoppingCart,
  Truck,
  User,
} from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

const howWork = [
  {
    step: "Step 1",
    title: "Seller posts an Ad",
    description: "Seller posts an ad on book kart to sell their used books.",
    icon: <Megaphone className="w-10 h-10 text-surface-tint/80" />,
  },
  {
    step: "Step 2",
    title: "Buyer Pays Online",
    description: "Buyer makes an online payment to book kart to buy those books.",
    icon: (
      <svg className="w-10 h-10 text-surface-tint/80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <path d="M2 10h20" />
      </svg>
    ),
  },
  {
    step: "Step 3",
    title: "Seller ships the books",
    description: "Seller then ships the books to the buyer",
    icon: <Truck className="w-10 h-10 text-surface-tint/80" />,
  },
];

export default function page() {
  const [currentImage, setCurrentImage] = useState<number>(0);
  const { id } = useParams();
  const [book, setBook] = useState<IProduct | null>(null);
  const [getBookData] = useLazyGetProductByIdQuery();
  const dispatch = useDispatch();
  const [addProductToWishList] = useAddToWishlistMutation();
  const [getWishlist] = useLazyGetWishlistQuery();
  const [removeProductFromWishlist] = useRemoveFromWishlistMutation();
  const wishlist = useSelector((state: RootState) => state.wishlist.product);
  const [isWishlist, setIsWishlist] = useState<boolean>(false);
  const [addToCart] = useAddToCartMutation();
  const cart = useSelector((state: RootState) => state.cart);
  const [getCart] = useLazyGetCartQuery();
  const [isPresentInCart, setIsPresentInCart] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPageLoading, setIsPageLoading] = useState<boolean>(true);
  const [pageError, setPageError] = useState<string | null>(null);
  const [removeFromCart] = useRemoveFromCartMutation();
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);

  useEffect(() => {
    getSigleBook();
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      fetchingWishlist();
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (book && wishlist) {
      setIsWishlist(!!wishlist.find((item) => item._id === book._id));
    }
  }, [book, wishlist]);

  useEffect(() => {
    if (book && cart) {
      setIsPresentInCart(
        !!cart.item.find((item) => item.product._id === book._id),
      );
    }
  }, [book, cart]);

  const getSigleBook = async () => {
    try {
      setIsPageLoading(true);
      setPageError(null);
      const response = await getBookData(id).unwrap();
      if (response.isSuccess) {
        setBook(response.data);
      }
    } catch (error: any) {
      console.log(error);
      setPageError("Failed to load book details. Please try again.");
    } finally {
      setIsPageLoading(false);
    }
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

  const handleAddToCart = async ({
    productid,
    quantity,
  }: {
    productid: string;
    quantity: number;
  }) => {
    if (isLoading) return;
    try {
      setIsLoading(true);
      const response = await addToCart({ productid, quantity }).unwrap();
      if (response.isSuccess) {
        await fetchingCart();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFromCart = async (productid: string) => {
    if (isLoading) return;
    try {
      setIsLoading(true);
      const response = await removeFromCart(productid).unwrap();
      if (response.isSuccess) {
        fetchingCart();
        toast.success("product has been remove from cart");
      }
    } catch (error: any) {
      console.log(error);
      if (error.status === 500) {
        toast.error("Something went wrong");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fetchingCart = async () => {
    try {
      const response = await getCart({}).unwrap();
      if (response.isSuccess) {
        dispatch(setCart(response.data));
      }
    } catch (error) {
      console.log(error);
    }
  };

  // ── Loading State ──────────────────────────────────────────────────────────
  if (isPageLoading) {
    return (
      <main className="grow pt-6 pb-12 px-4 md:px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Image skeleton */}
          <div className="lg:col-span-5 flex flex-col gap-2">
            <div className="aspect-4/3 rounded-xl bg-surface-container animate-pulse" />
            <div className="grid grid-cols-4 gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="aspect-square rounded-lg bg-surface-container animate-pulse" />
              ))}
            </div>
          </div>
          {/* Details skeleton */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="h-9 bg-surface-container animate-pulse rounded-lg w-3/4" />
            <div className="h-4 bg-surface-container animate-pulse rounded w-1/4" />
            <div className="h-12 bg-surface-container animate-pulse rounded-lg w-1/3" />
            <div className="h-12 bg-surface-container animate-pulse rounded-lg w-48" />
            <div className="rounded-xl border border-outline-variant p-5 space-y-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-4 bg-surface-container animate-pulse rounded" />
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  // ── Error State ────────────────────────────────────────────────────────────
  if (pageError) {
    return (
      <main className="grow pt-6 pb-12 px-4 md:px-8 max-w-7xl mx-auto w-full">
        <div className="flex items-center justify-center flex-col h-96">
          <div className="max-w-md flex items-center flex-col justify-center text-center gap-4">
            <div>
              <img
                src={`/Image/EmptyWishlist.png`}
                alt="Error Image"
                className="w-32 h-32"
              />
            </div>
            <h1 className="text-2xl font-semibold text-on-surface">
              Oops! Something went wrong
            </h1>
            <p className="text-on-surface-variant font-light">{pageError}</p>
            <Button
              className="bg-surface-tint hover:bg-[#564500] text-white cursor-pointer px-8 py-2 rounded-lg"
              onClick={getSigleBook}
            >
              Try Again
            </Button>
          </div>
        </div>
      </main>
    );
  }

  // ── Success State ──────────────────────────────────────────────────────────
  if (book) {
    return (
      <main className="grow pt-6 pb-12 px-4 md:px-8 max-w-7xl mx-auto w-full flex flex-col gap-6">

        {/* ── Book Header Section: Image + Details ──────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* ── Image Gallery (5 cols) ──────────────────────────────────────── */}
          <div className="lg:col-span-5 flex flex-col gap-2">
            {/* Main image */}
            <div className="aspect-4/3 bg-surface-container rounded-xl overflow-hidden relative border border-outline-variant shadow-sm group cursor-pointer">
              {book.images && (
                <Image
                  src={book.images[currentImage]}
                  fill
                  alt="Book Image"
                  loading="eager"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              )}
            </div>
            {/* Thumbnails */}
            {book.images && book.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {book.images.map((image, index) => (
                  <div
                    key={index}
                    onClick={() => setCurrentImage(index)}
                    className={`aspect-square bg-surface-container rounded-lg overflow-hidden cursor-pointer transition-all ${
                      currentImage === index
                        ? "border-2 border-surface-tint shadow-sm"
                        : "border border-outline-variant hover:border-surface-tint/50 opacity-80 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={image}
                      width={80}
                      height={80}
                      alt={`Book image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Basic Details & Actions (7 cols) ──────────────────────────── */}
          <div className="lg:col-span-7 flex flex-col gap-4">

            {/* Title + Wishlist */}
            <div className="flex justify-between items-start gap-4">
              <div>
                <h1 className="text-2xl md:text-[32px] font-bold leading-tight text-on-surface mb-1">
                  {book.title}
                </h1>
                <p className="text-sm text-on-surface-variant">
                  Posted {monthDiff(book.createdAt)} months ago
                </p>
              </div>
              <button
                aria-label={isWishlist ? "Remove from wishlist" : "Add to wishlist"}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (!isLoggedIn) {
                    dispatch(toggleLoginDialog());
                    return;
                  }
                  if (isWishlist) {
                    removeFromWishlistByProductId(book._id);
                  } else {
                    handleAddToWishlist(book._id);
                  }
                }}
                className="p-2 border border-outline-variant rounded-full text-on-surface-variant hover:text-surface-tint hover:border-surface-tint hover:bg-surface-container/50 transition-all flex items-center justify-center shrink-0 cursor-pointer"
              >
                <Heart
                  className="w-5 h-5"
                  fill={isWishlist ? "#ba1a1a" : "none"}
                  color={isWishlist ? "#ba1a1a" : "currentColor"}
                />
              </button>
            </div>

            {/* Price + Shipping badge */}
            <div className="flex items-end gap-4">
              <span className="text-[40px] font-bold leading-none text-on-surface">
                ₹{book.finalPrice}
              </span>
              <span className="text-sm font-semibold text-surface-tint bg-primary-container/20 px-2 py-1 rounded mb-1">
                Shipping available
              </span>
            </div>

            {/* Add to Cart Button */}
            <button
              className={`w-full md:w-auto mt-1 ${
                isPresentInCart
                  ? "bg-error hover:bg-on-error-container"
                  : "bg-surface-tint hover:bg-[#564500]"
              } text-white text-base font-semibold py-3 px-8 rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer`}
              onClick={() => {
                if (!isLoggedIn) {
                  dispatch(toggleLoginDialog());
                  return;
                }
                if (isPresentInCart) {
                  handleRemoveFromCart(book._id);
                } else {
                  handleAddToCart({ productid: book._id, quantity: 1 });
                }
              }}
            >
              {isLoading ? (
                <Loader className="animate-spin w-5 h-5" />
              ) : (
                <>
                  <ShoppingCart className="w-5 h-5" />
                  {isPresentInCart ? "Remove from Cart" : "Add to Cart"}
                </>
              )}
            </button>

            {/* Book Details Card */}
            <div className="mt-2 bg-white border border-outline-variant rounded-xl p-5 shadow-sm">
              <h3 className="text-lg font-semibold text-on-surface mb-4">Book Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6">
                <div className="flex justify-between sm:block border-b sm:border-none border-outline-variant/30 pb-2 sm:pb-0">
                  <span className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant block">
                    Subject/Title
                  </span>
                  <span className="text-sm font-medium text-on-surface">{book.subject}</span>
                </div>
                <div className="flex justify-between sm:block border-b sm:border-none border-outline-variant/30 pb-2 sm:pb-0">
                  <span className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant block">
                    Course
                  </span>
                  <span className="text-sm font-medium text-on-surface">{book.classType}</span>
                </div>
                <div className="flex justify-between sm:block border-b sm:border-none border-outline-variant/30 pb-2 sm:pb-0">
                  <span className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant block">
                    Category
                  </span>
                  <span className="text-sm font-medium text-on-surface">{book.category}</span>
                </div>
                <div className="flex justify-between sm:block border-b sm:border-none border-outline-variant/30 pb-2 sm:pb-0">
                  <span className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant block">
                    Author
                  </span>
                  <span className="text-sm font-medium text-on-surface">{book.author}</span>
                </div>
                <div className="flex justify-between sm:block border-b sm:border-none border-outline-variant/30 pb-2 sm:pb-0">
                  <span className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant block">
                    Edition
                  </span>
                  <span className="text-sm font-medium text-on-surface">{book.edition}</span>
                </div>
                <div className="flex justify-between sm:block">
                  <span className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant block">
                    Condition
                  </span>
                  <span className="text-sm font-medium text-on-surface">{book.condition}</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ── Description & Seller Info ─────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-2">

          {/* Description (8 cols) */}
          <div className="lg:col-span-8">
            <div className="bg-white border border-outline-variant rounded-xl p-6 shadow-sm h-full">
              <h3 className="text-lg font-semibold text-on-surface mb-3">Book Description</h3>
              <p className="text-sm text-on-surface mb-4 pb-4 border-b border-outline-variant/50 leading-relaxed">
                {book.description}
              </p>
              <h4 className="text-base font-semibold text-on-surface mb-2">Our Community</h4>
              <p className="text-sm text-on-surface-variant leading-relaxed mb-4">
                We&apos;re not just another shopping website where you buy from professional sellers
                — we are a vibrant community of students, book lovers across India who deliver
                happiness to each other!
              </p>
              <div className="flex flex-col sm:flex-row justify-between text-xs text-on-surface-variant mt-4 pt-3 border-t border-outline-variant/20">
                <span>Ad Id: {book._id}</span>
                <span>Posted: {monthDiff(book.createdAt)} months ago</span>
              </div>
            </div>
          </div>

          {/* Seller Info (4 cols) */}
          <div className="lg:col-span-4">
            <div className="bg-white border border-outline-variant rounded-xl p-6 shadow-sm sticky top-20">
              <h3 className="text-lg font-semibold text-on-surface mb-4">Sold By</h3>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary-container/20 text-surface-tint flex items-center justify-center shrink-0">
                  <User className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-semibold text-on-surface">{book.seller.name}</h4>
                    <span className="flex items-center gap-1 text-[10px] uppercase font-bold text-tertiary bg-tertiary-container/30 px-2 py-0.5 rounded-full">
                      <CircleCheck className="w-3 h-3" /> Verified
                    </span>
                  </div>
                  <p className="text-xs text-on-surface-variant leading-relaxed mt-1 flex items-start gap-1">
                    <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    <span>
                      {book?.seller?.address?.length !== 0
                        ? `${book.seller.address[0].addressLine1} ${book.seller.address[0].city} ${book.seller.address[0].state} ${book.seller.address[0].pin}`
                        : "Address Not Specified"}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* ── How It Works Section ──────────────────────────────────────────── */}
        <div className="mt-8 mb-4">
          <h2 className="text-2xl md:text-[32px] font-bold text-on-surface mb-6 text-center">
            How does it work?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {howWork.map(({ step, title, description, icon }, index) => (
              <div
                key={index}
                className="bg-surface-container border border-outline-variant rounded-xl p-6 flex flex-col items-center text-center relative overflow-hidden group hover:border-surface-tint transition-colors"
              >
                <span className="absolute top-4 left-4 bg-on-surface text-white text-xs font-semibold px-3 py-1 rounded-full">
                  {step}
                </span>
                <div className="h-28 mt-8 mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  {icon}
                </div>
                <h3 className="text-base font-semibold text-on-surface mb-2">{title}</h3>
                <p className="text-sm text-on-surface-variant">{description}</p>
              </div>
            ))}
          </div>
        </div>

      </main>
    );
  }

  // ── Fallback State ─────────────────────────────────────────────────────────
  return (
    <main className="grow pt-6 pb-12 px-4 md:px-8 max-w-7xl mx-auto w-full">
      <div className="flex items-center justify-center flex-col h-96">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-on-surface">Loading...</h1>
        </div>
      </div>
    </main>
  );
}
