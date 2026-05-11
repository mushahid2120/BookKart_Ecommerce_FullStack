"use client";
import Address from "@/components/Address";
import LoginSignupDialouge from "@/components/LoginSignupDialouge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { IOrderItem, RazorpayResponse } from "@/lib/types/order";
import {
  useAddToWishlistMutation,
  useCreateOrderMutation,
  useCreateOrUpdateAddressMutation,
  useCreateOrUpdateOrderMutation,
  useLazyGetAddressByUserIdQuery,
  useLazyGetCartQuery,
  useLazyGetOrderByOrderIdQuery,
  useLazyGetWishlistQuery,
  useRemoveFromCartMutation,
  useRemoveFromWishlistMutation,
} from "@/store/api";
import { changeCheckoutStatus, setCart } from "@/store/slice/cartSlice";
import { IAddress, setOrder } from "@/store/slice/orderSlice";
import { toggleLoginDialog } from "@/store/slice/userSlice";
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
  UserCheck,
} from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Script from "next/script";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

declare global {
  interface Window {
    Razorpay: any;
  }
}

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
  const [isPageLoading, setIsPageLoading] = useState<boolean>(true);
  const [pageError, setPageError] = useState<string | null>(null);
  const [showLoginDialog, setShowLoginDialog] = useState<boolean>(false);
  const [createOrder] = useCreateOrUpdateOrderMutation();
  const [addressDialogueStatus, setAddressDialogueStatus] = useState<
    "noAddress" | "selectAddress" | "openAddressForm" | null
  >(null);
  const [addressUpdate] = useCreateOrUpdateAddressMutation();
  const [getUserAddress] = useLazyGetAddressByUserIdQuery();
  const [getOrderByOrderId] = useLazyGetOrderByOrderIdQuery();
  const [userAddress, setUserAddress] = useState<IAddress[] | null>([]);
  const [isAddressLoading, setIsAddressLoading] = useState<boolean>(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const pathname = usePathname();
  const user = useSelector((state: RootState) => state.user);
  const [createRazorpayOrder] = useCreateOrderMutation();

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
        dispatch(changeCheckoutStatus("cart"));
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

  const fetchingAddress = async () => {
    try {
      const response = await getUserAddress({}).unwrap();
      if (response.isSuccess) {
        setUserAddress(response.data);
      }
    } catch (error: any) {
      console.log(error);
      if (error.status === 500) {
        toast.error("Something went wrong");
      }
    }
  };

  const fetchingCart = async () => {
    try {
      setPageError(null);
      const response = await getCart({}).unwrap();
      if (response.isSuccess) {
        dispatch(setCart(response.data));
      }
    } catch (error) {
      console.log(error);
      setPageError("Failed to load cart. Please try again.");
    } finally {
      setIsPageLoading(false);
    }
  };

  const fetchingOrder = async () => {
    try {
      const response = await getOrderByOrderId(cart.orderId).unwrap();
      if (response.isSuccess) {
        dispatch(setOrder(response.data));
      }
    } catch (error: any) {
      console.log(error);
      if (error.status === 500) {
        toast.error("Something went wrong");
      }
    }
  };

  const handleCreateOrder = async () => {
    if (isCreateOrderLoading) return;
    if (!cart || cart?.item.length === 0) {
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
        await fetchingCart();
        dispatch(changeCheckoutStatus("address"));
        toast.success("Order has been created");
      }
    } catch (error: any) {
      console.log(error);
    } finally {
      setIsCreateOrderLoading(false);
    }
  };

  const handleAddress = async (address: IAddress) => {
    if (isAddressLoading) return;
    setIsAddressLoading(true);
    try {
      const response = await addressUpdate({
        ...address,
        addressId: editingAddressId,
      }).unwrap();
      if (response.isSuccess) {
        await fetchingAddress();
        await fetchingOrder();
        toast.success("Address has been added");
        setAddressDialogueStatus("selectAddress");
      }
    } catch (error: any) {
      console.log(error);
      if (error.status === 500) {
        toast.error("Something went wrong");
      }
    } finally {
      setIsAddressLoading(false);
    }
  };

  const handleAddAddressOnOrder = async (address: IAddress) => {
    try {
      const response = await createOrder({
        orderId: cart.orderId,
        cartId: cart.cartId,
        shippingAddress: address._id,
      }).unwrap();
      if (response.isSuccess) {
        await fetchingOrder();
        setAddressDialogueStatus(null);
      }
    } catch (error: any) {
      console.log(error);
      if (error.status === 500) {
        toast.error("Something Went Wrong");
      }
    }
  };

  const handleRemoveAddressOnOrder = async (address: IAddress) => {
    try {
      const response = await createOrder({
        orderId: cart.orderId,
        cartId: cart.cartId,
        shippingAddress: null,
      }).unwrap();
      if (response.isSuccess) {
        await fetchingOrder();
      }
    } catch (error: any) {
      console.log(error);
      if (error.status === 500) {
        toast.error("Something Went Wrong");
      }
    }
  };

  const handleAddPaymentDetailOnOrder = async ({
    paymentDetail,
    paymentStatus,
  }: {
    paymentDetail: RazorpayResponse | null;
    paymentStatus: "pending" | "complete" | "failed";
  }) => {
    {
      try {
        const response = await createOrder({
          orderId: cart.orderId,
          cartId: cart.cartId,
          paymentDetail: JSON.stringify(paymentDetail),
          paymentStatus,
        }).unwrap();

        if (response.isSuccess) {
          await fetchingCart();
          toast.success("Order has been created");
        }
      } catch (error: any) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    if (user.isLoggedIn) {
      setIsPageLoading(true);
      fetchingCart();
      fetchingWishlist();
    } else {
      setIsPageLoading(false);
    }
  }, [user.isLoggedIn]);

  useEffect(() => {
    if (cart.checkoutStatus === "address" && user.isLoggedIn) {
      fetchingAddress();
    }
  }, [cart.checkoutStatus, user.isLoggedIn]);

  useEffect(() => {
    if (user.isLoggedIn) {
      dispatch(changeCheckoutStatus("cart"));
    }
  }, [pathname, user.isLoggedIn]);

  useEffect(() => {
    if (
      !!cart.orderId &&
      cart.orderId !== "null" &&
      cart.checkoutStatus !== "cart" &&
      user.isLoggedIn
    ) {
      fetchingOrder();
    }
  }, [cart.orderId, cart.checkoutStatus, user.isLoggedIn]);

  const handlePay = async () => {
    try {
      console.log("isLoaded");

      const response = await createRazorpayOrder({
        orderId: order._id,
        totalAmount: order.totalAmount,
      }).unwrap();
      if (response.isSuccess) {
        popupOpen(response.data.orderid);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const popupOpen = (orderid: string) => {
    console.log("popup");
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
      currency: "INR",
      name: user?.user?.name,
      order_id: orderid,
      prefill: {
        name: user?.user?.name,
        email: user?.user?.email,
        contact: user?.user?.phoneNumber,
      },
      handler: async function (res: RazorpayResponse) {
        await handleAddPaymentDetailOnOrder({
          paymentDetail: res,
          paymentStatus: "complete",
        });
      },
    };

    const rzp1 = new window.Razorpay(options);
    rzp1.on("payment.failed", async function (response: any) {
      await handleAddPaymentDetailOnOrder({
        paymentDetail: {
          razorpay_order_id: response.error.metadata.order_id,
          razorpay_payment_id: response.error.metadata.payment_id,
        },
        paymentStatus: "failed",
      });
    });
    rzp1.open();
  };

  if (pageError) {
    return (
      <div className="flex items-center justify-center flex-col h-96 bg-(--color-surface-soft)">
        <div className="max-w-md flex items-center flex-col justify-center text-center gap-4">
          <div>
            <img
              src={`/Image/EmptyWishlist.png`}
              alt="Error"
              className="w-32 h-32"
            />
          </div>
          <h1 className="text-2xl font-medium">Something went wrong</h1>
          <p className="text-(--color-text-muted) font-light">{pageError}</p>
          <Button
            className="bg-(--color-button-yellow) hover:bg-(--color-button-yellow-hover) text-white cursor-pointer px-8 py-2"
            onClick={() => {
              setIsPageLoading(true);
              fetchingCart();
            }}
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Not Logged In State */}
      {!user.isLoggedIn && (
        <div className="flex items-center justify-center flex-col h-screen bg-(--color-surface-soft)">
          <div className="max-w-md flex items-center flex-col justify-center text-center gap-4">
            <div>
              <img
                src={`/Image/EmptyWishlist.png`}
                alt="Not logged in"
                className="w-32 h-32"
              />
            </div>
            <h1 className="text-2xl font-medium">You are not logged in</h1>
            <p className="text-(--color-text-muted) font-light">
              Please log in to your account to proceed with checkout.
            </p>
            <Button
              className="bg-(--color-button-yellow) hover:bg-(--color-button-yellow-hover) text-white cursor-pointer px-8 py-2"
              onClick={() => dispatch(toggleLoginDialog())}
            >
              Login
            </Button>
          </div>
        </div>
      )}

      {/* Loading State - Shimmer Effect */}
      {user.isLoggedIn && isPageLoading && (
        <>
          <div className="flex items-center gap-4 font-medium text-lg bg-(--color-surface-soft) p-4">
            <div className="h-6 w-6 bg-(--color-surface-soft) animate-pulse rounded"></div>
            <div className="h-4 w-32 bg-(--color-surface-soft) animate-pulse rounded"></div>
          </div>
          <main className="md:px-10 sm:px-10 px-4 pb-16 bg-(--color-surface-soft)">
            <section className="flex items-center justify-center gap-4 p-6">
              <div className="flex gap-2 w-full justify-center">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-12 w-24 bg-(--color-surface-soft) animate-pulse rounded-full"
                  ></div>
                ))}
              </div>
            </section>
            <section className="flex lg:flex-row flex-col gap-8">
              <div className="gap-4 grow max-h-160 overflow-y-scroll space-y-4">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-(--color-card) p-4 rounded-lg space-y-3"
                  >
                    <div className="h-40 bg-(--color-surface-soft) animate-pulse rounded"></div>
                    <div className="h-4 bg-(--color-surface-soft) animate-pulse rounded w-3/4"></div>
                    <div className="h-4 bg-(--color-surface-soft) animate-pulse rounded w-1/2"></div>
                  </div>
                ))}
              </div>
              <div className="space-y-4">
                <div className="lg:w-80 bg-(--color-card) p-4 rounded-lg space-y-3">
                  <div className="h-6 bg-(--color-surface-soft) animate-pulse rounded w-1/2"></div>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-4 bg-(--color-surface-soft) animate-pulse rounded"
                    ></div>
                  ))}
                </div>
              </div>
            </section>
          </main>
        </>
      )}

      {/* Empty Cart State */}
      {user.isLoggedIn &&
        !isPageLoading &&
        !pageError &&
        cart.item.length === 0 && (
          <div className="flex items-center justify-center flex-col h-96 bg-(--color-surface-soft)">
            <div className="max-w-md flex items-center flex-col justify-center text-center gap-4">
              <div>
                <img
                  src={`/Image/EmptyWishlist.png`}
                  alt="Empty Cart"
                  className="w-32 h-32"
                />
              </div>
              <h1 className="text-2xl font-medium">Your cart is empty</h1>
              <p className="text-(--color-text-muted) font-light">
                Add some books to your cart to proceed with checkout.
              </p>
              <Button
                className="bg-(--color-button-yellow) hover:bg-(--color-button-yellow-hover) text-white cursor-pointer px-8 py-2"
                onClick={() => (window.location.href = "/books")}
              >
                Continue Shopping
              </Button>
            </div>
          </div>
        )}

      {/* Success State - Normal Checkout Flow */}
      {user.isLoggedIn &&
        !isPageLoading &&
        !pageError &&
        cart.item.length > 0 && (
          <>
            {cart.checkoutStatus === "payment" && (
              <Script
                id="razorpay-checkout"
                src="https://checkout.razorpay.com/v1/checkout.js"
                strategy="lazyOnload"
                onLoad={() => console.log("razorpay loaded")}
              />
            )}

            <div className="flex items-center gap-4 font-medium text-lg bg-(--color-surface-soft)  p-4">
              <ShoppingCart className="text-(--color-header-text)" />{" "}
              <span>
                {cart.item.length !== 0 && cart.item.length} items in your cart
              </span>
            </div>
            <main className="md:px-10 sm:px-10  px-4 pb-16    bg-(--color-surface-soft) ">
              <section className="flex items-center justify-center gap-4 p-6">
                <div className="flex items-center justify-center gap-2">
                  <span
                    className={`p-2.5 rounded-full text-white bg-(--color-surface-soft) shadow-xl ${cart.checkoutStatus === "cart" && "bg-[#d4a574]"}`}
                  >
                    <ShoppingCart />
                  </span>
                  <p className="font-medium">Cart</p>
                </div>
                <ChevronRight
                  strokeWidth={2}
                  className="text-(--color-text-muted)"
                />
                <div className="flex items-center justify-center gap-2">
                  <span
                    className={`p-2.5 rounded-full text-white bg-(--color-surface-soft) shadow-xl  ${cart.checkoutStatus === "address" && "bg-[#d4a574]"}`}
                  >
                    <MapPin />
                  </span>
                  <p className="font-medium">Address</p>
                </div>
                <ChevronRight
                  strokeWidth={2}
                  className="text-(--color-text-muted)"
                />
                <div className="flex items-center justify-center gap-2">
                  <span
                    className={`p-2.5 rounded-full text-white bg-(--color-surface-soft) shadow-xl ${cart.checkoutStatus === "payment" && "bg-[#d4a574]"}`}
                  >
                    <CreditCard />
                  </span>
                  <p className="font-medium">Payment</p>
                </div>
              </section>
              <section className="flex lg:flex-row flex-col gap-8">
                <Card className="gap-4 grow max-h-160 overflow-y-scroll">
                  <CardHeader className="gap-0">
                    <h1 className="text-2xl font-medium">Order Summary</h1>
                    <p className="text-(--color-text-muted) text-sm">
                      Review your items
                    </p>
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
                              <h1 className="font-medium">
                                {item.product.title}
                              </h1>
                              <p className="text-(--color-text-muted) text-sm font-light">
                                Quantity: {item.quantity}
                              </p>
                              <div>
                                <span className="text-(--color-text-muted) font-medium line-through text-sm">
                                  ₹{item.product.price}
                                </span>{" "}
                                <span className="font-medium">
                                  ₹{item.product.finalPrice}
                                </span>
                              </div>
                              <p className="text-(--color-accent-yellow) text-sm font-medium ">
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
                                      <span className="hidden sm:block">
                                        Remove
                                      </span>
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
                                      removeFromWishlistByProductId(
                                        item.product._id,
                                      );
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
                                            (book) =>
                                              item.product._id === book._id,
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
                    addressDialogueStatus={addressDialogueStatus}
                    setAddressDialogueStatus={setAddressDialogueStatus}
                    userAddress={userAddress}
                    orderAddress={order.shippingAddress}
                    isAddressLoading={isAddressLoading}
                    handleAddAddressOnOrder={handleAddAddressOnOrder}
                    handleRemoveAddressOnOrder={handleRemoveAddressOnOrder}
                    editingAddressId={editingAddressId}
                    setEditingAddressId={setEditingAddressId}
                  />
                )}

                <div className="space-y-4">
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
                        <div className="text-(--color-accent-yellow) flex items-center justify-between">
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
                                acc +
                                item.product.shippingCharge * item.quantity,
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
                          className="bg-blue-600 hover:bg-(--color-button-yellow) cursor-pointer"
                          onClick={async () => {
                            if (cart.checkoutStatus === "cart") {
                              await handleCreateOrder();
                            } else if (cart.checkoutStatus === "address") {
                              if (
                                !!userAddress &&
                                !order?.shippingAddress &&
                                !userAddress.find(
                                  (address) =>
                                    order.shippingAddress?._id === address._id,
                                )
                              ) {
                                if (userAddress.length === 0)
                                  setAddressDialogueStatus("noAddress");
                                setAddressDialogueStatus("selectAddress");
                              } else {
                                dispatch(changeCheckoutStatus("payment"));
                              }
                            } else if (cart.checkoutStatus === "payment") {
                              await handlePay();
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
                        <p className="text-sm flex items-center gap-2 justify-center text-(--color-header-text)">
                          <Shield /> Safe and Secure Payments
                        </p>
                      </CardContent>
                    </Card>
                  )}

                  {order?.shippingAddress &&
                    !(cart?.checkoutStatus === "cart") && (
                      <Card className="gap-2 lg:w-80">
                        <CardHeader className="text-xl font-medium">
                          Delivery Address
                        </CardHeader>
                        <CardContent className="text-[sm]">
                          <div>{order.shippingAddress.addressLine1}</div>
                          <div>{order.shippingAddress.addressLine2}</div>
                          <div>
                            {order.shippingAddress.city},{" "}
                            {order.shippingAddress.state}{" "}
                            {order.shippingAddress.pin}
                          </div>
                          <div>Phone: {order.shippingAddress.phoneNumber}</div>
                        </CardContent>
                        <CardFooter>
                          <Button
                            variant="outline"
                            className="ml-auto cursor-pointer"
                            onClick={() => {
                              setAddressDialogueStatus("selectAddress");
                            }}
                          >
                            <MapPin />
                            <span>Change Address</span>
                          </Button>
                        </CardFooter>
                      </Card>
                    )}
                </div>
              </section>
            </main>
          </>
        )}
    </>
  );
}
