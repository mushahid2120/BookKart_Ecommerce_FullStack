"use client";
import Address from "@/components/Address";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { IOrderItem } from "@/lib/types/order";
import {
  useAddToWishlistMutation,
  useCreateOrUpdateOrderMutation,
  useLazyGetCartQuery,
  useLazyGetWishlistQuery,
  useRemoveFromCartMutation,
  useRemoveFromWishlistMutation,
} from "@/store/api";
import { changeCheckoutStatus, setCart } from "@/store/slice/cartSlice";
import {
  IAddress,
  setOrderItem,
  setShippingAddress,
} from "@/store/slice/orderSlice";
import { setWishlist } from "@/store/slice/wishlistSlice";
import { RootState } from "@/store/store";
import {
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Heart,
  Loader,
  MapPin,
  Shield,
  ShoppingCart,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

export default function page() {
  const cart = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch();
  const [getCart] = useLazyGetCartQuery();
  const [removeFromCart] = useRemoveFromCartMutation();
  const [addProductToWishList] = useAddToWishlistMutation();
  const [getWishlist] = useLazyGetWishlistQuery();
  const [removeProductFromWishlist] = useRemoveFromWishlistMutation();
  const wishlist = useSelector((state: RootState) => state.wishlist.product);
  const order = useSelector((state: RootState) => state.order);
  const [isCartLoading, setIsCartLoading] = useState<string | null>(null);
  const [isWishlistLoading, setIsWishlistLoading] = useState<string | null>(
    null,
  );
  const [isCreateOrderLoading, setIsCreateOrderLoading] =
    useState<boolean>(false);
  const [createOrder] = useCreateOrUpdateOrderMutation();
  const [isChangingAddress, setIsChangingAddress] = useState<boolean>(false);

  const handleAddToWishlist = async (productId: string) => {
    if (isWishlistLoading) return;
    try {
      setIsWishlistLoading(productId);
      const response = await addProductToWishList(productId).unwrap();
      if (response.isSuccess) {
        await fetchingWishlist();
      }
    } catch (error: any) {
      console.log(error);
      if (error.status === 400) {
        toast.error("Seller will not added their own product to wishlist");
      }
    } finally {
      setIsWishlistLoading(null);
    }
  };

  const handleRemoveFromCart = async (productid: string) => {
    if (isCartLoading) return;
    try {
      setIsCartLoading(productid);
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
      setIsCartLoading(null);
    }
  };

  const removeFromWishlistByProductId = async (productid: string) => {
    if (isWishlistLoading) return;
    try {
      setIsWishlistLoading(productid);
      const response = await removeProductFromWishlist(productid).unwrap();
      if (response.isSuccess) {
        await fetchingWishlist();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsWishlistLoading(null);
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

  const handleCreateOrder = async () => {
    if (isCreateOrderLoading) return;
    if (!cart || cart?.item.length === 0 || !cart.orderId) {
      console.log("cart is empty");
      return;
    }
    try {
      setIsCreateOrderLoading(true);
      const response = await createOrder({
        orderId: cart.orderId,
        cartId: cart.cartId,
        status: "processing",
      }).unwrap();

      if (response.isSuccess) {
        dispatch(changeCheckoutStatus("address"));
        dispatch(
          setOrderItem({
            items: cart.item,
            _id: cart.orderId,
            status: "processing",
          }),
        );
        toast.success("Order has been created");
      }
    } catch (error: any) {
      console.log(error);
    } finally {
      setIsCreateOrderLoading(false);
    }
  };

  const handleAddress = async (address: IAddress) => {
    dispatch(changeCheckoutStatus("address"));
    dispatch(setShippingAddress(address));
    toast.success("Address has been added");
    setIsChangingAddress(true);
  };

  useEffect(() => {
    fetchingCart();
    fetchingWishlist();
  }, []);

  console.log({ cart });
  console.log({ order });

  return (
    <>
      <div className="flex items-center gap-4 font-medium text-lg bg-[#f3f4f6]  p-4">
        <ShoppingCart className="text-[#4b5563]" />{" "}
        <span>
          {cart.item.length !== 0 && cart.item.length} items in your cart
        </span>
      </div>
      <main className="md:px-10 sm:px-10  px-4 pb-16    bg-[#ddeafe] ">
        <section className="flex items-center justify-center gap-4 p-6">
          <div className="flex items-center justify-center gap-2">
            <span
              className={`p-2.5 rounded-full text-white bg-blue-300 shadow-xl ${cart.checkoutStatus === "cart" && "bg-blue-700"}`}
            >
              <ShoppingCart />
            </span>
            <p className="font-medium">Cart</p>
          </div>
          <ChevronRight strokeWidth={2} className="text-[#c8cacf]" />
          <div className="flex items-center justify-center gap-2">
            <span
              className={`p-2.5 rounded-full text-white bg-blue-300 shadow-xl  ${cart.checkoutStatus === "address" && "bg-blue-700"}`}
            >
              <MapPin />
            </span>
            <p className="font-medium">Address</p>
          </div>
          <ChevronRight strokeWidth={2} className="text-[#c8cacf]" />
          <div className="flex items-center justify-center gap-2">
            <span
              className={`p-2.5 rounded-full text-white bg-blue-300 shadow-xl ${cart.checkoutStatus === "payment" && "bg-blue-700"}`}
            >
              <CreditCard />
            </span>
            <p className="font-medium">Payment</p>
          </div>
        </section>
        <section className="flex lg:flex-row flex-col gap-8">
          <Card className="gap-4 grow h-160 overflow-y-scroll">
            <CardHeader className="gap-0">
              <h1 className="text-2xl font-medium">Order Summary</h1>
              <p className="text-[#737373] text-sm">Review your items</p>
            </CardHeader>
            <CardContent>
              {cart.item &&
                cart.item.map((item, index) => (
                  <div key={index}>
                    <div
                      className="flex flex-col sm:flex-row gap-8"
                      key={index}
                    >
                      {item.product.image && (
                        <Image
                          src={item.product.image}
                          width={200}
                          height={200}
                          alt="cartImage "
                          className="w-60 h-60"
                        />
                      )}
                      <div className="space-y-1">
                        <h1 className="font-medium">{item.product.title}</h1>
                        <p className="text-[#6B7280] text-sm font-light">
                          Quantity: {item.quantity}
                        </p>
                        <div>
                          <span className="text-[#6B7280] font-medium line-through text-sm">
                            ₹{item.product.price}
                          </span>{" "}
                          <span className="font-medium">
                            ₹{item.product.finalPrice}
                          </span>
                        </div>
                        <p className="text-[#16A34A] text-sm font-medium ">
                          {item.product.shippingCharge === 0
                            ? "Free Shipping"
                            : `Shipping Charge: ₹${item.product.shippingCharge}`}
                        </p>
                        <div className="flex gap-4 mt-6">
                          <Button
                            variant="outline"
                            className="text-xs cursor-pointer"
                            onClick={() => {
                              handleRemoveFromCart(item.product._id);
                            }}
                          >
                            {isCartLoading &&
                            isCartLoading === item.product._id ? (
                              <Loader className="animate-spin cursor-not-allowed" />
                            ) : (
                              <>
                                <Trash2 />{" "}
                                <span className="hidden sm:block">Remove</span>
                              </>
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            className="text-xs cursor-pointer"
                            onClick={() => {
                              if (
                                wishlist.find(
                                  (book) => book._id === item.product._id,
                                )
                              ) {
                                removeFromWishlistByProductId(item.product._id);
                              } else {
                                handleAddToWishlist(item.product._id);
                              }
                            }}
                          >
                            {isWishlistLoading &&
                            isWishlistLoading === item.product._id ? (
                              <Loader className="animate-spin cursor-not-allowed" />
                            ) : (
                              <>
                                <Heart
                                  fill={
                                    item &&
                                    wishlist &&
                                    wishlist.find(
                                      (book) => item.product._id === book._id,
                                    )
                                      ? "red"
                                      : "none"
                                  }
                                />{" "}
                                <span className="hidden sm:block">
                                  Add to Wishlist
                                </span>
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                    <hr className="my-4" />
                  </div>
                ))}
            </CardContent>
          </Card>

          {cart.checkoutStatus === "address" && (
            <Address
              handleAddress={handleAddress}
              isChangingAddress={isChangingAddress}
              setIsChangingAddress={setIsChangingAddress}
              address={order.shippingAddress}
              currentAddressIndex={order.currentSelectedShippingAddress}
            />
          )}

          {cart.item && (
            <Card className="lg:w-80 gap-2 h-90">
              <CardHeader className="text-xl font-medium ">
                Price Details
              </CardHeader>
              <CardContent className="flex flex-col gap-4 text-sm">
                <div className="flex items-center justify-between">
                  <span>Price ({cart.item.length} items)</span>
                  <span>
                    ₹
                    {cart.item.reduce(
                      (acc: number, item: any) =>
                        acc + item.product.price * item.quantity,
                      0,
                    )}
                  </span>
                </div>
                <div className="text-[#16A34A] flex items-center justify-between">
                  <span>Discount</span>
                  <span>
                    - ₹
                    {cart.item.reduce(
                      (acc: number, item: any) =>
                        acc +
                        (item.product.price -
                          item.product.finalPrice * item.quantity),
                      0,
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Delivery Charges</span>
                  <span className="text-[16A34A]">
                    {cart.item.reduce(
                      (acc: number, item: any) =>
                        acc + item.product.shippingCharge * item.quantity,
                      0,
                    )}
                  </span>
                </div>
                <hr />
                <div className="flex items-center justify-between font-medium ">
                  <span>Total Amount</span>
                  <span>
                    ₹
                    {cart.item.reduce(
                      (acc: number, item: any) =>
                        acc +
                        item.product.finalPrice * item.quantity +
                        item.product.shippingCharge,
                      0,
                    )}
                  </span>
                </div>
                <Button
                  className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
                  onClick={async () => {
                    if (cart.checkoutStatus === "cart") {
                      await handleCreateOrder();
                    } else if (cart.checkoutStatus === "address") {
                      dispatch(changeCheckoutStatus("payment"));
                    } else if (cart.checkoutStatus === "payment") {
                      dispatch(changeCheckoutStatus("cart"));
                    }
                  }}
                >
                  {isCreateOrderLoading ? (
                    <Loader className="animate-spin cursor-not-allowed" />
                  ) : (
                    <>
                      {cart.checkoutStatus === "cart" && (
                        <>
                          {" "}
                          <ChevronRight /> Proceed to Checkout{" "}
                        </>
                      )}
                      {cart.checkoutStatus === "address" && (
                        <>
                          {" "}
                          <ChevronRight /> Proceed to Payment{" "}
                        </>
                      )}
                      {cart.checkoutStatus === "payment" && (
                        <>
                          {" "}
                          <ChevronRight /> Proceed to Pay{" "}
                        </>
                      )}
                    </>
                  )}
                </Button>
                {cart && cart.checkoutStatus !== "cart" && (
                  <Button
                    variant="outline"
                    className="cursor-pointer"
                    onClick={() => {
                      if (cart.checkoutStatus === "address") {
                        dispatch(changeCheckoutStatus("cart"));
                      } else if (cart.checkoutStatus === "payment") {
                        dispatch(changeCheckoutStatus("address"));
                      }
                    }}
                  >
                    <ChevronLeft /> Go Back
                  </Button>
                )}
                <p className="text-sm flex items-center gap-2 justify-center text-[#4B5563]">
                  <Shield /> Safe and Secure Payments
                </p>
              </CardContent>
            </Card>
          )}
        </section>
      </main>
    </>
  );
}
