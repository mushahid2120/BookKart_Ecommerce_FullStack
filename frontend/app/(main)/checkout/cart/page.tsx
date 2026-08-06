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

  // ─── Derived helpers ───────────────────────────────────────────────────────
  const steps = [
    { key: "cart", label: "Cart", icon: <ShoppingCart className="w-4 h-4" />, num: 1 },
    { key: "address", label: "Address", icon: <MapPin className="w-4 h-4" />, num: 2 },
    { key: "payment", label: "Payment", icon: <CreditCard className="w-4 h-4" />, num: 3 },
  ] as const;

  const currentStepIndex = steps.findIndex((s) => s.key === cart.checkoutStatus);

  // ─── Page Error State ───────────────────────────────────────────────────────
  if (pageError) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-surface-bright px-4">
        <div className="flex flex-col items-center text-center gap-5 max-w-sm">
          <div className="w-24 h-24 rounded-full bg-surface-container flex items-center justify-center">
            <img
              src="/Image/EmptyWishlist.png"
              alt="Error"
              className="w-16 h-16 object-contain"
            />
          </div>
          <div className="space-y-2">
            <h1 className="text-[22px] font-bold text-[#191c1d]">
              Something went wrong
            </h1>
            <p className="text-[14px] text-on-surface-variant">{pageError}</p>
          </div>
          <button
            className="px-8 py-3 bg-primary-container hover:bg-[#ecc200] text-on-primary-container font-semibold rounded-full text-[14px] transition-colors cursor-pointer active:scale-95"
            onClick={() => {
              setIsPageLoading(true);
              fetchingCart();
            }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* ── Not Logged In State ────────────────────────────────────────────── */}
      {!user.isLoggedIn && (
        <div className="min-h-[70vh] flex items-center justify-center bg-surface-bright px-4">
          <div className="flex flex-col items-center text-center gap-5 max-w-sm">
            <div className="w-28 h-28 rounded-full bg-surface-container flex items-center justify-center">
              <img
                src="/Image/EmptyWishlist.png"
                alt="Not logged in"
                className="w-20 h-20 object-contain"
              />
            </div>
            <div className="space-y-2">
              <h1 className="text-[24px] font-bold text-[#191c1d]">
                You are not logged in
              </h1>
              <p className="text-[14px] text-on-surface-variant leading-relaxed">
                Please log in to your account to proceed with checkout.
              </p>
            </div>
            <button
              className="px-8 py-3 bg-primary-container hover:bg-[#ecc200] text-on-primary-container font-semibold rounded-full text-[14px] transition-colors cursor-pointer active:scale-95"
              onClick={() => dispatch(toggleLoginDialog())}
            >
              Login to Continue
            </button>
          </div>
        </div>
      )}

      {/* ── Loading Skeleton ───────────────────────────────────────────────── */}
      {user.isLoggedIn && isPageLoading && (
        <div className="bg-surface-bright min-h-screen">
          {/* Stepper skeleton */}
          <div className="border-b border-outline-variant bg-white px-4 md:px-8 lg:px-8 py-4">
            <div className="max-w-7xl mx-auto flex items-center justify-center gap-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-10 h-10 rounded-full bg-surface-container animate-pulse" />
                    <div className="w-14 h-3 rounded bg-surface-container animate-pulse" />
                  </div>
                  {i < 3 && (
                    <div className="w-16 h-0.5 bg-surface-container animate-pulse rounded mb-4" />
                  )}
                </div>
              ))}
            </div>
          </div>
          {/* Content skeleton */}
          <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-8 py-8">
            <div className="flex lg:flex-row flex-col gap-6">
              {/* Left panel */}
              <div className="grow space-y-4">
                <div className="bg-white rounded-xl border border-outline-variant p-6 space-y-4">
                  <div className="h-6 w-40 bg-surface-container animate-pulse rounded-lg" />
                  <div className="h-4 w-28 bg-surface-container animate-pulse rounded" />
                  <div className="border-t border-outline-variant pt-4 space-y-4">
                    {[1, 2].map((i) => (
                      <div key={i} className="flex gap-4 py-4">
                        <div className="w-24 h-32 bg-surface-container animate-pulse rounded-lg shrink-0" />
                        <div className="flex-1 space-y-3">
                          <div className="h-4 bg-surface-container animate-pulse rounded w-3/4" />
                          <div className="h-3 bg-surface-container animate-pulse rounded w-1/2" />
                          <div className="h-3 bg-surface-container animate-pulse rounded w-1/3" />
                          <div className="flex gap-2 mt-4">
                            <div className="h-8 w-24 bg-surface-container animate-pulse rounded-full" />
                            <div className="h-8 w-28 bg-surface-container animate-pulse rounded-full" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {/* Right panel */}
              <div className="lg:w-80 w-full">
                <div className="bg-white rounded-xl border border-outline-variant p-6 space-y-4">
                  <div className="h-5 w-32 bg-surface-container animate-pulse rounded-lg" />
                  <div className="border-t border-outline-variant pt-4 space-y-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="flex justify-between">
                        <div className="h-4 w-28 bg-surface-container animate-pulse rounded" />
                        <div className="h-4 w-16 bg-surface-container animate-pulse rounded" />
                      </div>
                    ))}
                  </div>
                  <div className="h-11 w-full bg-surface-container animate-pulse rounded-full mt-2" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Empty Cart State ───────────────────────────────────────────────── */}
      {user.isLoggedIn &&
        !isPageLoading &&
        !pageError &&
        cart.item.length === 0 && (
          <div className="min-h-[60vh] flex items-center justify-center bg-surface-bright px-4">
            <div className="flex flex-col items-center text-center gap-5 max-w-sm">
              <div className="w-36 h-36 rounded-full bg-surface-container flex items-center justify-center">
                <img
                  src="/Image/EmptyWishlist.png"
                  alt="Empty Cart"
                  className="w-28 h-28 object-contain"
                />
              </div>
              <div className="space-y-2">
                <h1 className="text-[24px] font-bold text-[#191c1d]">
                  Your cart is empty
                </h1>
                <p className="text-[14px] text-on-surface-variant leading-relaxed">
                  Add some books to your cart to proceed with checkout.
                </p>
              </div>
              <button
                className="px-8 py-3 bg-primary-container hover:bg-[#ecc200] text-on-primary-container font-semibold rounded-full text-[14px] transition-colors cursor-pointer active:scale-95"
                onClick={() => (window.location.href = "/books")}
              >
                Browse Books
              </button>
            </div>
          </div>
        )}

      {/* ── Main Checkout Flow ─────────────────────────────────────────────── */}
      {user.isLoggedIn &&
        !isPageLoading &&
        !pageError &&
        cart.item.length > 0 && (
          <div className="bg-surface-bright min-h-screen">
            {/* Razorpay Script */}
            {cart.checkoutStatus === "payment" && (
              <Script
                id="razorpay-checkout"
                src="https://checkout.razorpay.com/v1/checkout.js"
                strategy="lazyOnload"
                onLoad={() => console.log("razorpay loaded")}
              />
            )}

            {/* ── Checkout Progress Stepper ───────────────────────────────── */}
            <div className="bg-white border-b border-outline-variant shadow-sm">
              <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-8 py-5">
                <div className="flex items-center justify-center gap-0">
                  {steps.map((step, idx) => {
                    const isActive = cart.checkoutStatus === step.key;
                    const isCompleted = currentStepIndex > idx;
                    return (
                      <div key={step.key} className="flex items-center">
                        <div className="flex flex-col items-center gap-1.5">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-[14px] transition-all duration-200 ${
                              isActive
                                ? "bg-primary-container text-on-primary-container shadow-md shadow-primary-container/40"
                                : isCompleted
                                ? "bg-tertiary-container text-on-tertiary-container"
                                : "bg-surface-container text-on-surface-variant"
                            }`}
                          >
                            {isCompleted ? (
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2.5}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            ) : (
                              step.num
                            )}
                          </div>
                          <span
                            className={`text-[12px] font-semibold tracking-wide ${
                              isActive
                                ? "text-on-primary-container"
                                : isCompleted
                                ? "text-on-tertiary-container"
                                : "text-on-surface-variant"
                            }`}
                          >
                            {step.label}
                          </span>
                        </div>
                        {idx < steps.length - 1 && (
                          <div
                            className={`w-16 sm:w-24 h-0.5 mx-3 mb-5 rounded-full transition-colors duration-300 ${
                              currentStepIndex > idx
                                ? "bg-tertiary-container"
                                : "bg-outline-variant"
                            }`}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* ── Page Header ────────────────────────────────────────────── */}
            <div className="bg-white border-b border-outline-variant">
              <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-8 py-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-primary-container/20 flex items-center justify-center">
                  <ShoppingCart className="w-5 h-5 text-on-primary-container" />
                </div>
                <div>
                  <h1 className="text-[18px] font-bold text-[#191c1d] leading-tight">
                    {cart.item.length !== 0 && cart.item.length}{" "}
                    {cart.item.length === 1 ? "item" : "items"} in your cart
                  </h1>
                  <p className="text-[12px] text-on-surface-variant">
                    Review your order before proceeding
                  </p>
                </div>
              </div>
            </div>

            {/* ── Main Content ────────────────────────────────────────────── */}
            <main className="max-w-7xl mx-auto px-4 md:px-8 lg:px-8 py-6 pb-16">
              <div className="flex lg:flex-row flex-col gap-6 items-start">

                {/* ── Left: Cart Items ──────────────────────────────────── */}
                <div className="grow min-w-0">
                  <div className="bg-white rounded-xl border border-outline-variant shadow-sm overflow-hidden">
                    {/* Card Header */}
                    <div className="px-6 pt-6 pb-4 border-b border-outline-variant">
                      <h2 className="text-[20px] font-bold text-[#191c1d]">
                        Order Summary
                      </h2>
                      <p className="text-[13px] text-on-surface-variant mt-0.5">
                        Review your items before checkout
                      </p>
                    </div>

                    {/* Scrollable Items List */}
                    <div className="max-h-150 overflow-y-auto custom-scrollbar">
                      {cart.item &&
                        cart.item.map((item, index) => {
                          const isInWishlist =
                            wishlist &&
                            wishlist.find(
                              (book) => item.product._id === book._id,
                            );
                          const isLastItem = index === cart.item.length - 1;

                          return (
                            <div
                              key={index}
                              className={`px-6 py-5 transition-colors hover:bg-surface-bright ${
                                !isLastItem ? "border-b border-outline-variant" : ""
                              }`}
                            >
                              <div className="flex flex-col sm:flex-row gap-4">
                                {/* Book Thumbnail */}
                                <div className="shrink-0">
                                  {item.product.image ? (
                                    <div className="w-24 h-32 rounded-lg overflow-hidden border border-outline-variant shadow-sm bg-surface-container-low">
                                      <Image
                                        src={item.product.image}
                                        width={96}
                                        height={128}
                                        alt={item.product.title || "Book cover"}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                  ) : (
                                    <div className="w-24 h-32 rounded-lg border border-outline-variant bg-surface-container flex items-center justify-center">
                                      <ShoppingCart className="w-8 h-8 text-outline" />
                                    </div>
                                  )}
                                </div>

                                {/* Book Details */}
                                <div className="flex-1 min-w-0 flex flex-col justify-between gap-3">
                                  <div className="space-y-1.5">
                                    {/* Title */}
                                    <h3 className="font-semibold text-[15px] text-[#191c1d] leading-snug line-clamp-2">
                                      {item.product.title}
                                    </h3>

                                    {/* Quantity chip */}
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-surface-container text-[#191c1d] rounded-full text-[12px] font-semibold">
                                        Qty: {item.quantity}
                                      </span>
                                      {/* Shipping badge */}
                                      {item.product.shippingCharge === 0 ? (
                                        <span className="inline-flex items-center px-2.5 py-1 bg-tertiary-container text-on-tertiary-container rounded-full text-[12px] font-semibold">
                                          Free Shipping
                                        </span>
                                      ) : (
                                        <span className="inline-flex items-center px-2.5 py-1 bg-surface-container text-on-surface-variant rounded-full text-[12px]">
                                          Shipping: ₹{item.product.shippingCharge}
                                        </span>
                                      )}
                                    </div>

                                    {/* Pricing */}
                                    <div className="flex items-baseline gap-2">
                                      <span className="text-[18px] font-bold text-[#191c1d]">
                                        ₹{item.product.finalPrice}
                                      </span>
                                      {item.product.price !== item.product.finalPrice && (
                                        <>
                                          <span className="text-[13px] text-outline line-through">
                                            ₹{item.product.price}
                                          </span>
                                          <span className="text-[12px] font-semibold text-tertiary">
                                            {Math.round(
                                              ((item.product.price - item.product.finalPrice) /
                                                item.product.price) *
                                                100,
                                            )}
                                            % off
                                          </span>
                                        </>
                                      )}
                                    </div>
                                  </div>

                                  {/* Action Buttons */}
                                  <div className="flex items-center gap-2">
                                    {/* Remove from cart */}
                                    <button
                                      id={`remove-cart-${item.product._id}`}
                                      onClick={() => handleRemoveFromCart(item.product._id)}
                                      disabled={!!isCartLoading}
                                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[13px] font-medium transition-all cursor-pointer ${
                                        isCartLoading === item.product._id
                                          ? "border-outline-variant text-on-surface-variant opacity-70 cursor-not-allowed"
                                          : "border-outline-variant text-on-surface-variant hover:border-error hover:text-error hover:bg-error-container active:scale-95"
                                      }`}
                                    >
                                      {isCartLoading === item.product._id ? (
                                        <Loader className="w-3.5 h-3.5 animate-spin" />
                                      ) : (
                                        <Trash2 className="w-3.5 h-3.5" />
                                      )}
                                      <span className="hidden sm:inline">Remove</span>
                                    </button>

                                    {/* Wishlist toggle */}
                                    <button
                                      id={`wishlist-${item.product._id}`}
                                      onClick={() => {
                                        if (isInWishlist) {
                                          removeFromWishlistByProductId(item.product._id);
                                        } else {
                                          handleAddToWishlist(item.product._id);
                                        }
                                      }}
                                      disabled={!!isWishlistLoading}
                                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[13px] font-medium transition-all cursor-pointer ${
                                        isWishlistLoading === item.product._id
                                          ? "border-outline-variant text-on-surface-variant opacity-70 cursor-not-allowed"
                                          : isInWishlist
                                          ? "border-accent-coral text-accent-coral bg-accent-coral-container hover:bg-[#fecdd3] active:scale-95"
                                          : "border-outline-variant text-on-surface-variant hover:border-accent-coral hover:text-accent-coral hover:bg-accent-coral-container active:scale-95"
                                      }`}
                                    >
                                      {isWishlistLoading === item.product._id ? (
                                        <Loader className="w-3.5 h-3.5 animate-spin" />
                                      ) : (
                                        <Heart
                                          className="w-3.5 h-3.5"
                                          fill={isInWishlist ? "#fb7185" : "none"}
                                        />
                                      )}
                                      <span className="hidden sm:inline">
                                        {isInWishlist ? "Wishlisted" : "Add to Wishlist"}
                                      </span>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </div>

                {/* ── Right: Address (step 2) + Order Summary Sidebar ────── */}
                <div className="lg:w-80 w-full shrink-0 space-y-4">

                  {/* Address Component (step 2 only) */}
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

                  {/* ── Price Details Card ─────────────────────────────── */}
                  {cart.item && (
                    <div className="bg-white rounded-xl border border-outline-variant shadow-sm overflow-hidden">
                      {/* Card Header */}
                      <div className="px-5 pt-5 pb-3 border-b border-outline-variant">
                        <h2 className="text-[16px] font-bold text-[#191c1d] uppercase tracking-wide">
                          Price Details
                        </h2>
                      </div>

                      <div className="px-5 py-4 space-y-3">
                        {/* Items subtotal */}
                        <div className="flex items-center justify-between text-[14px]">
                          <span className="text-on-surface-variant">
                            Price ({cart.item.length}{" "}
                            {cart.item.length === 1 ? "item" : "items"})
                          </span>
                          <span className="font-medium text-[#191c1d]">
                            ₹
                            {cart.item.reduce(
                              (acc: number, item: any) =>
                                acc + item.product.price * item.quantity,
                              0,
                            )}
                          </span>
                        </div>

                        {/* Discount */}
                        <div className="flex items-center justify-between text-[14px]">
                          <span className="text-on-surface-variant">Discount</span>
                          <span className="font-semibold text-tertiary">
                            − ₹
                            {cart.item.reduce(
                              (acc: number, item: any) =>
                                acc +
                                (item.product.price -
                                  item.product.finalPrice * item.quantity),
                              0,
                            )}
                          </span>
                        </div>

                        {/* Delivery */}
                        <div className="flex items-center justify-between text-[14px]">
                          <span className="text-on-surface-variant">Delivery Charges</span>
                          {cart.item.reduce(
                            (acc: number, item: any) =>
                              acc + item.product.shippingCharge * item.quantity,
                            0,
                          ) === 0 ? (
                            <span className="font-semibold text-tertiary">Free</span>
                          ) : (
                            <span className="font-medium text-[#191c1d]">
                              ₹
                              {cart.item.reduce(
                                (acc: number, item: any) =>
                                  acc +
                                  item.product.shippingCharge * item.quantity,
                                0,
                              )}
                            </span>
                          )}
                        </div>

                        {/* Separator */}
                        <div className="border-t border-outline-variant my-1" />

                        {/* Total */}
                        <div className="flex items-center justify-between">
                          <span className="text-[15px] font-bold text-[#191c1d]">
                            Total Amount
                          </span>
                          <span className="text-[16px] font-bold text-[#191c1d]">
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

                        {/* Savings note */}
                        {cart.item.reduce(
                          (acc: number, item: any) =>
                            acc +
                            (item.product.price -
                              item.product.finalPrice * item.quantity),
                          0,
                        ) > 0 && (
                          <div className="bg-tertiary-container/20 border border-tertiary-container rounded-lg px-3 py-2 text-[12px] font-semibold text-on-tertiary-container">
                            🎉 You save ₹
                            {cart.item.reduce(
                              (acc: number, item: any) =>
                                acc +
                                (item.product.price -
                                  item.product.finalPrice * item.quantity),
                              0,
                            )}{" "}
                            on this order!
                          </div>
                        )}

                        {/* Proceed / Action Button */}
                        <button
                          id="proceed-checkout-btn"
                          className="w-full flex items-center justify-center gap-2 py-3 bg-primary-container hover:bg-[#ecc200] text-on-primary-container font-bold rounded-full text-[14px] transition-colors cursor-pointer active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
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
                          disabled={isCreateOrderLoading}
                        >
                          {isCreateOrderLoading ? (
                            <Loader className="w-4 h-4 animate-spin" />
                          ) : (
                            <>
                              {cart.checkoutStatus === "cart" && (
                                <>
                                  <ChevronRight className="w-4 h-4" />
                                  Proceed to Checkout
                                </>
                              )}
                              {cart.checkoutStatus === "address" && (
                                <>
                                  <ChevronRight className="w-4 h-4" />
                                  Proceed to Payment
                                </>
                              )}
                              {cart.checkoutStatus === "payment" && (
                                <>
                                  <CreditCard className="w-4 h-4" />
                                  Proceed to Pay
                                </>
                              )}
                            </>
                          )}
                        </button>

                        {/* Go Back button */}
                        {cart && cart.checkoutStatus !== "cart" && (
                          <button
                            id="go-back-btn"
                            className="w-full flex items-center justify-center gap-2 py-2.5 border border-outline-variant text-on-surface-variant hover:bg-surface-container-low font-medium rounded-full text-[13px] transition-colors cursor-pointer active:scale-95"
                            onClick={() => {
                              if (cart.checkoutStatus === "address") {
                                dispatch(changeCheckoutStatus("cart"));
                              } else if (cart.checkoutStatus === "payment") {
                                dispatch(changeCheckoutStatus("address"));
                              }
                            }}
                          >
                            <ChevronLeft className="w-4 h-4" />
                            Go Back
                          </button>
                        )}

                        {/* Security note */}
                        <div className="flex items-center justify-center gap-1.5 pt-1">
                          <Shield className="w-3.5 h-3.5 text-tertiary" />
                          <span className="text-[11px] text-on-surface-variant">
                            Safe and Secure Payments
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ── Delivery Address Card (step 2 / 3) ─────────────── */}
                  {order?.shippingAddress &&
                    !(cart?.checkoutStatus === "cart") && (
                      <div className="bg-white rounded-xl border border-outline-variant shadow-sm overflow-hidden">
                        <div className="px-5 pt-5 pb-3 border-b border-outline-variant flex items-center gap-2">
                          <MapPin className="w-4 h-4 ext-surface-tint" />
                          <h2 className="text-[15px] font-bold text-[#191c1d]">
                            Delivery Address
                          </h2>
                        </div>
                        <div className="px-5 py-4 space-y-1 text-[13px] text-on-surface-variant">
                          <div className="font-medium text-[#191c1d]">
                            {order.shippingAddress.addressLine1}
                          </div>
                          <div>{order.shippingAddress.addressLine2}</div>
                          <div>
                            {order.shippingAddress.city},{" "}
                            {order.shippingAddress.state}{" "}
                            {order.shippingAddress.pin}
                          </div>
                          <div className="text-on-surface-variant">
                            📞 {order.shippingAddress.phoneNumber}
                          </div>
                        </div>
                        <div className="px-5 pb-4">
                          <button
                            className="w-full flex items-center justify-center gap-2 py-2 border border-outline-variant text-on-surface-variant hover:bg-surface-container-low font-medium rounded-full text-[13px] transition-colors cursor-pointer active:scale-95"
                            onClick={() => setAddressDialogueStatus("selectAddress")}
                          >
                            <MapPin className="w-3.5 h-3.5" />
                            Change Address
                          </button>
                        </div>
                      </div>
                    )}
                </div>
              </div>
            </main>
          </div>
        )}
    </>
  );
}
