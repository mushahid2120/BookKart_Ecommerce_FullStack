"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  useAddToWishlistMutation,
  useLazyGetWishlistQuery,
  useRemoveFromWishlistMutation,
} from "@/store/api";
import { setWishlist } from "@/store/slice/wishlistSlice";
import { RootState } from "@/store/store";
import { Check, Heart, Loader, ShoppingCart, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

export default function page() {
  const dispatch = useDispatch();
  const [getWishlist] = useLazyGetWishlistQuery();
  const [removeProductFromWishlist] = useRemoveFromWishlistMutation();
  const wishlist = useSelector((state: RootState) => state.wishlist.product);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isAddingToCart, setIsAddingToCart] = useState<boolean>(false);

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
    } catch (error:any) {
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
      const response = await getWishlist({}).unwrap();
      if (response.isSuccess) {
        dispatch(setWishlist(response.data));
      }
    } catch (error) {
      console.log(error);
    }
  };

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
          <p className="text-[#4B5563] font-ligth">
            Looks like you haven't added any items to your wishlist yet. Browse
            our collection and save your favorites!
          </p>
          <Link href="/books">
            <Button className="bg-linear-to-r from-[#22c55e] to-[#10b981] hover:from-[#12c754] hover:to-[#08cf8d] cursor-pointer">
              Browse Books
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (wishlist) {
    return (
      <div>
        <h1 className="flex items-center text-xl font-medium my-4">
          <Heart /> My WishList
        </h1>
        {wishlist.map((item, index) => (
          <div className="grid sm:grid-cols-2" key={index}>
            <Card className="w-72 gap-2 py-4">
              <CardHeader className="gap-0">
                <h2 className="text-sm font-medium ">{item.title}</h2>
                <p className="text-[#737373] font-light text-sm">
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
                  className="bg-red-500 cursor-pointer"
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
                <Button className="bg-blue-600 text-white cursor-pointer">
                  <ShoppingCart /> Add to Cart
                </Button>
                {/* <Button className="bg-[#8b8b8b] text-white cursor-pointer">
              <Check /> Item in Cart
            </Button> */}
              </CardFooter>
            </Card>
          </div>
        ))}
      </div>
    );
  }
}
