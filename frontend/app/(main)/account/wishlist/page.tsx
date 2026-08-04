"use client";
import { Button } from "@/components/ui/button";
import {
  useAddToCartMutation,
  useLazyGetCartQuery,
  useLazyGetWishlistQuery,
  useRemoveFromCartMutation,
  useRemoveFromWishlistMutation,
} from "@/store/api";
import { setCart } from "@/store/slice/cartSlice";
import { setWishlist } from "@/store/slice/wishlistSlice";
import { toggleLoginDialog } from "@/store/slice/userSlice";
import { RootState } from "@/store/store";
import { Check, Heart, Loader, ShoppingCart, Trash2, Eye, Library } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

export default function page() {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);
  const [getWishlist] = useLazyGetWishlistQuery();
  const [removeProductFromWishlist] = useRemoveFromWishlistMutation();
  const wishlist = useSelector((state: RootState) => state.wishlist.product);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);
  const [isAddingToCart, setIsAddingToCart] = useState<boolean>(false);
  const [isPageLoading, setIsPageLoading] = useState<boolean>(true);
  const [pageError, setPageError] = useState<string | null>(null);
  const [getCart] = useLazyGetCartQuery();
  const [removeFromCart] = useRemoveFromCartMutation();
  const [addToCart] = useAddToCartMutation();
  const cart = useSelector((state: RootState) => state.cart);

  useEffect(() => {
    fetchingWishlist();
  }, []);

  const removeFromWishlistByProductId = async (productid: string) => {
    try {
      setIsDeleting(true);
      setDeletingProductId(productid);
      const response = await removeProductFromWishlist(productid).unwrap();
      if (response.isSuccess) {
        await fetchingWishlist();
        toast.success("Item has been remove from wishlist");
      }
    } catch (error: any) {
      console.log(error);
      if (error.status === 500) {
        toast.error("Something went wrong");
      }
    } finally {
      setIsDeleting(false);
      setDeletingProductId(null);
    }
  };

  const fetchingWishlist = async () => {
    try {
      setPageError(null);
      const response = await getWishlist({}).unwrap();
      if (response.isSuccess) {
        dispatch(setWishlist(response.data));
      }
    } catch (error) {
      console.log(error);
      setPageError("Failed to load wishlist. Please try again.");
    } finally {
      setIsPageLoading(false);
    }
  };

  const handleAddToCart = async ({
    productid,
    quantity,
  }: {
    productid: string;
    quantity: number;
  }) => {
    if (isAddingToCart) return;
    try {
      setIsAddingToCart(true);
      const response = await addToCart({ productid, quantity }).unwrap();
      if (response.isSuccess) {
        await fetchingCart();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleRemoveFromCart = async (productid: string) => {
    if (isAddingToCart) return;
    try {
      setIsAddingToCart(true);
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
      setIsAddingToCart(false);
    }
  };

  const fetchingCart = async () => {
    try {
      const response = await getCart({}).unwrap();
      console.log(response);
      if (response.isSuccess) {
        dispatch(setCart(response.data));
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="flex items-center justify-center flex-col min-h-112 py-12 px-4 bg-surface-container-lowest border border-outline-variant/30 rounded-3xl text-center shadow-xs">
        <div className="max-w-md flex flex-col items-center justify-center text-center gap-4">
          <div className="w-20 h-20 rounded-full bg-primary-container/30 flex items-center justify-center text-primary mb-2">
            <Heart size={40} className="text-primary fill-primary/20" />
          </div>
          <div>
            <img src="/Image/EmptyWishlist.png" alt="Wishlist" className="w-48 h-auto mx-auto mb-4 opacity-90" />
          </div>
          <h1 className="text-2xl font-bold text-on-surface">Please log in to view your wishlist</h1>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            You need to be logged in to access and manage your saved wishlist items.
          </p>
          <Button
            className="bg-primary hover:bg-primary-fixed-dim text-on-primary font-bold px-8 py-3 rounded-full shadow-xs transition-all cursor-pointer flex items-center gap-2 mt-2"
            onClick={() => dispatch(toggleLoginDialog())}
          >
            Login
          </Button>
        </div>
      </div>
    );
  }

  if (isPageLoading) {
    return (
      <div className="w-full space-y-6">
        <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-outline-variant/30">
          <div>
            <div className="flex items-center gap-3.5 mb-1">
              <div className="w-10 h-10 rounded-full bg-primary-container/30 flex items-center justify-center text-primary">
                <Heart size={24} className="text-primary fill-primary" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">My Wishlist</h1>
            </div>
            <p className="text-sm text-on-surface-variant ml-1">Manage your saved books.</p>
          </div>
          <div className="h-9 w-32 bg-surface-container-high animate-pulse rounded-full"></div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-4 shadow-xs animate-pulse flex flex-col gap-4" key={index}>
              <div className="w-full aspect-3/4 bg-surface-container-high rounded-xl"></div>
              <div className="space-y-2">
                <div className="h-5 bg-surface-container-high rounded w-3/4"></div>
                <div className="h-4 bg-surface-container-high rounded w-1/2"></div>
              </div>
              <div className="h-6 bg-surface-container-high rounded w-1/3 mt-auto"></div>
              <div className="h-10 bg-surface-container-high rounded-full w-full"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (pageError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-100 gap-4 bg-surface-container-lowest border border-outline-variant/30 rounded-3xl p-8 text-center shadow-xs">
        <p className="text-error font-medium text-base">{pageError}</p>
        <Button onClick={fetchingWishlist} variant="outline" className="border-outline hover:bg-surface-container-low rounded-full px-6 cursor-pointer">
          Try Again
        </Button>
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div className="w-full space-y-6">
        <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-outline-variant/30">
          <div>
            <div className="flex items-center gap-3.5 mb-1">
              <div className="w-10 h-10 rounded-full bg-primary-container/30 flex items-center justify-center text-primary">
                <Heart size={24} className="text-primary fill-primary" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">My Wishlist</h1>
            </div>
            <p className="text-sm text-on-surface-variant ml-1">Manage your saved books.</p>
          </div>
          <div className="bg-surface-container px-4 py-2 rounded-full text-xs font-semibold text-on-surface inline-flex items-center gap-2 self-start sm:self-end border border-outline-variant/30">
            <Library size={16} className="text-primary" />
            <span>Total items: 0</span>
          </div>
        </header>

        <div className="flex items-center justify-center flex-col py-12 px-4 bg-surface-container-lowest border border-outline-variant/30 rounded-3xl text-center shadow-xs">
          <div className="max-w-md flex flex-col items-center justify-center text-center gap-4">
            <div>
              <img
                src="/Image/EmptyWishlist.png"
                alt="Empty Wishlist"
                className="w-52 h-auto mx-auto mb-2 opacity-90"
              />
            </div>
            <h2 className="text-2xl font-bold text-on-surface">Your wishlist is empty.</h2>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Looks like you haven't added any items to your wishlist yet. Browse our collection and save your favorites!
            </p>
            <Link href="/books">
              <Button className="bg-primary hover:bg-primary-fixed-dim text-on-primary font-bold px-8 py-3 rounded-full shadow-xs transition-all cursor-pointer mt-2">
                Browse Books
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-outline-variant/30">
        <div>
          <div className="flex items-center gap-3.5 mb-1">
            <div className="w-10 h-10 rounded-full bg-primary-container/30 flex items-center justify-center text-primary">
              <Heart size={24} className="text-primary fill-primary" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">My Wishlist</h1>
          </div>
          <p className="text-sm text-on-surface-variant ml-1">Manage your saved books.</p>
        </div>
        <div className="bg-surface-container px-4 py-2 rounded-full text-xs font-semibold text-on-surface inline-flex items-center gap-2 self-start sm:self-end border border-outline-variant/30">
          <Library size={16} className="text-primary" />
          <span>Total items: {wishlist.length}</span>
        </div>
      </header>

      {/* Grid Layout for Wishlist Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlist.map((item, index) => {
          const isInCart = cart.item.findIndex((it) => it.product._id === item._id) !== -1;
          const isCurrentlyDeleting = isDeleting && deletingProductId === item._id;

          return (
            <article
              key={item._id || index}
              className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 hover:border-outline-variant/70 p-4 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col group relative overflow-hidden"
            >
              {/* Image Preview & Floating Quick Actions */}
              <div className="w-full aspect-3/4 mb-4 relative rounded-xl overflow-hidden bg-surface-container-low border border-outline-variant/20 flex items-center justify-center">
                {item.images ? (
                  <img
                    src={item.images}
                    alt={item.title || "Book cover"}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-on-surface-variant/40">
                    <Library size={48} />
                  </div>
                )}

                {/* Hover Quick View Overlay */}
                <div className="absolute inset-0 bg-inverse-surface/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <Link href={`/books/${item._id}`}>
                    <span className="bg-surface-container-lowest text-on-surface px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-2 hover:bg-primary-container hover:text-on-primary-container transition-colors shadow-sm cursor-pointer">
                      <Eye size={16} />
                      Quick View
                    </span>
                  </Link>
                </div>

                {/* Floating Remove Button */}
                <button
                  className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-surface-container-lowest/90 text-error flex items-center justify-center hover:bg-error hover:text-on-error transition-all shadow-xs z-10 cursor-pointer disabled:opacity-50"
                  title="Remove from wishlist"
                  disabled={isDeleting}
                  onClick={() => removeFromWishlistByProductId(item._id)}
                >
                  {isCurrentlyDeleting ? (
                    <Loader size={16} className="animate-spin" />
                  ) : (
                    <Trash2 size={16} />
                  )}
                </button>
              </div>

              {/* Book Details */}
              <div className="flex flex-col flex-1">
                <Link href={`/books/${item._id}`}>
                  <h3 className="font-bold text-base text-on-surface leading-snug mb-1 group-hover:text-primary transition-colors line-clamp-2 cursor-pointer">
                    {item.title}
                  </h3>
                </Link>
                {"author" in item && (item as any).author && (
                  <p className="text-xs text-on-surface-variant line-clamp-1 mb-2">
                    {(item as any).author}
                  </p>
                )}

                {/* Price Display */}
                <div className="font-bold text-lg text-on-surface mb-4 mt-auto pt-2">
                  ₹{item.finalPrice}
                </div>

                {/* Action Button */}
                {!isInCart ? (
                  <Button
                    className="w-full h-10 bg-primary-container text-on-primary-container hover:bg-primary-fixed font-semibold rounded-full flex items-center justify-center gap-2 transition-colors cursor-pointer text-xs shadow-xs"
                    onClick={() => {
                      handleRemoveFromCart(item._id);
                      handleAddToCart({ productid: item._id, quantity: 1 });
                    }}
                  >
                    <ShoppingCart size={16} />
                    <span>Add to Cart</span>
                  </Button>
                ) : (
                  <Button
                    className="w-full h-10 bg-surface-variant text-on-surface-variant font-semibold rounded-full flex items-center justify-center gap-2 cursor-pointer text-xs opacity-90 hover:bg-surface-container-high transition-colors"
                    onClick={() => {
                      handleRemoveFromCart(item._id);
                    }}
                  >
                    <Check size={16} />
                    <span>Item in Cart</span>
                  </Button>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

