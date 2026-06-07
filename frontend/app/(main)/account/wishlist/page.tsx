"use client";
import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";
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
import { Check, Heart, Loader, ShoppingCart, Trash2 } from "lucide-react";
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
      <div className="flex items-center justify-center flex-col h-full">
        <div className="max-w-120 flex items-center flex-col justify-center text-center gap-2">
          <div>
            <img src={`/Image/EmptyWishlist.png`} alt="Hero Image" className="w-full" />
          </div>
          <h1 className="text-2xl font-medium">Please log in to view your wishlist.</h1>
          <p className="text-(--color-header-text) font-light">
            You need to be logged in to access your wishlist.
          </p>
          <Button
            className="bg-linear-to-r from-(--color-accent-yellow) to-(--color-button-yellow-hover) hover:from-(--color-accent-yellow) hover:to-(--color-button-yellow-hover) cursor-pointer"
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
      <div>
        <h1 className="flex items-center text-xl font-medium my-4">
          <Heart /> My WishList
        </h1>
        <div className="grid sm:grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card className="w-72 gap-2 py-4 animate-pulse" key={index}>
              <CardHeader className="gap-0">
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
              </CardHeader>
              <div className="h-60 w-40 mx-auto bg-gray-300 rounded"></div>
              <CardFooter className="flex items-center justify-between">
                <div className="h-10 w-20 bg-gray-300 rounded"></div>
                <div className="h-10 w-32 bg-gray-300 rounded"></div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (pageError) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-red-500">{pageError}</p>
        <Button onClick={fetchingWishlist} variant="outline">
          Try Again
        </Button>
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div className="flex items-center justify-center flex-col h-full">
        <div className=" max-w-120 flex items-center flex-col justify-center text-center gap-2">
          <div>
            <img
              src={`/Image/EmptyWishlist.png`}
              alt="Hero Image"
              className="w=full"
            />
          </div>
          <h1 className="text-2xl font-medium">Your wishlist is empty.</h1>
          <p className="text-(--color-header-text) font-ligth">
            Looks like you haven't added any items to your wishlist yet. Browse
            our collection and save your favorites!
          </p>
          <Link href="/books">
            <Button className="bg-linear-to-r from-(--color-accent-yellow) to-(--color-button-yellow-hover) hover:from-(--color-accent-yellow) hover:to-(--color-button-yellow-hover) cursor-pointer">
              Browse Books
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="flex items-center text-xl font-medium my-4">
        <Heart /> My WishList
      </h1>
      <div className="grid sm:grid-cols-2 gap-4">
        {wishlist.map((item, index) => (
          <Card className="w-72 gap-2 py-4" key={index}>
            <CardHeader className="gap-0">
              <h2 className="text-sm font-medium ">{item.title}</h2>
              <p className="text-(--color-text-muted) font-light text-sm">
                ${item.finalPrice}
              </p>
            </CardHeader>
            <div className="h-60 w-40 mx-auto">
              {item.images && (
                <img
                  src={item.images}
                  alt="order image "
                  className="object-cover h-full w-full"
                />
              )}
            </div>
            <CardFooter className="flex items-center justify-between">
              <Button
                className="bg-(--color-danger) cursor-pointer"
                onClick={() => {
                  removeFromWishlistByProductId(item._id);
                }}
              >
                {isDeleting ? (
                  <Loader className="animate-spin cursor-pointer" />
                ) : (
                  <Trash2 />
                )}
              </Button>
              {cart.item.findIndex(
                (it) => it.product._id === item._id,
              ) === -1 ? (
                <Button
                  className="bg-(--color-button-yellow) text-white cursor-pointer"
                  onClick={() => {
                    handleRemoveFromCart(item._id);
                    handleAddToCart({ productid: item._id, quantity: 1 });
                  }}
                >
                  <ShoppingCart /> Add to Cart
                </Button>
              ) : (
                <Button
                  className="bg-(--color-surface-muted) text-white cursor-pointer"
                  onClick={() => {
                    handleRemoveFromCart(item._id);
                  }}
                >
                  <Check /> Item in Cart
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
