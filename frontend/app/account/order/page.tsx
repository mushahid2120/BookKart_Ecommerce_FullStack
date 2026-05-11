"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { IOrder } from "@/lib/types/order";
import { useLazyGetOrderByUserIdQuery } from "@/store/api";
import {
  Calendar,
  CircleCheckBig,
  CreditCard,
  Package,
  ShoppingBag,
  Truck,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Link from "next/link";

export default function page() {
  const [isShowLess, setIsShowLess] = useState<boolean>(false);
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [getAllOrderOfUser] = useLazyGetOrderByUserIdQuery();
  const [detailOrder, setDetailOrder] = useState<IOrder | null>(null);
  const [isPageLoading, setIsPageLoading] = useState<boolean>(true);
  const [pageError, setPageError] = useState<string | null>(null);

  useEffect(() => {
    fetchingAllOrder();
  }, []);

  const fetchingAllOrder = async () => {
    try {
      setPageError(null);
      const response = await getAllOrderOfUser({}).unwrap();
      if (response.isSuccess) {
        setOrders(response.data);
      }
    } catch (error: any) {
      console.log(error);
      setPageError("Failed to load orders. Please try again.");
    } finally {
      setIsPageLoading(false);
    }
  };

  const giveMeDate = (givenDate: string) => {
    const convertedDate = new Date(givenDate);
    return convertedDate.toLocaleDateString() as string;
  };

  return (
    <>
      {/* Loading State */}
      {isPageLoading && (
        <div className="space-y-4">
          <Card className="bg-linear-to-r from-(--color-accent-yellow) to-(--color-button-yellow-hover) text-white gap-0">
            <CardHeader className="h-10 bg-(--color-surface-soft) animate-pulse rounded"></CardHeader>
          </Card>
          <div className="grid sm:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="pt-0 overflow-hidden p-4 space-y-3">
                <div className="h-6 bg-(--color-surface-soft) animate-pulse rounded w-1/2"></div>
                <div className="h-4 bg-(--color-surface-soft) animate-pulse rounded"></div>
                <div className="h-20 bg-(--color-surface-soft) animate-pulse rounded"></div>
                <div className="h-10 bg-(--color-surface-soft) animate-pulse rounded"></div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Error State */}
      {!isPageLoading && pageError && (
        <div className="flex items-center justify-center flex-col h-96">
          <div className="max-w-md flex items-center flex-col justify-center text-center gap-4">
            <img src={`/Image/EmptyWishlist.png`} alt="Error" className="w-32 h-32" />
            <h1 className="text-2xl font-medium">Something went wrong</h1>
            <p className="text-(--color-text-muted) font-light">{pageError}</p>
            <Button
              className="bg-(--color-button-yellow) hover:bg-(--color-button-yellow-hover) text-white cursor-pointer px-8"
              onClick={() => {
                setIsPageLoading(true);
                fetchingAllOrder();
              }}
            >
              Try Again
            </Button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isPageLoading && !pageError && orders.length === 0 && (
        <div className="flex items-center justify-center flex-col h-96">
          <div className="max-w-md flex items-center flex-col justify-center text-center gap-4">
            <img src={`/Image/EmptyWishlist.png`} alt="No orders" className="w-32 h-32" />
            <h1 className="text-2xl font-medium">No orders yet</h1>
            <p className="text-(--color-text-muted) font-light">You haven't placed any orders yet. Shop now!</p>
            <Link href="/books">
              <Button className="bg-(--color-button-yellow) hover:bg-(--color-button-yellow-hover) text-white cursor-pointer px-8">
                Start Shopping
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Success State */}
      {!isPageLoading && !pageError && orders.length > 0 && (
      <div className="space-y-4">
        <Card className=" rounded-md bg-linear-to-r from-(--color-accent-yellow) to-(--color-button-yellow-hover) text-white gap-0">
          <CardHeader className="text-4xl font-medium">My Orders</CardHeader>
          <CardContent className="text-white font-light">
            View and manage your recent purchases
          </CardContent>
        </Card>
        <div className="grid sm:grid-cols-2 gap-4">
          {orders
            .filter((order, i) => (isShowLess && i < 2) || !isShowLess)
            .map((order, index) => (
              <Card
                className="pt-0 overflow-hidden w-full sm:max-w-76 gap-2"
                key={index}
              >
                <CardHeader className="bg-(--color-surface-soft) py-4">
                  <h1 className="flex items-center text-(--color-header-text) text-xl font-medium gap-2">
                    <ShoppingBag size={16} />{" "}
                    <span>Order #{order._id.slice(0, 6)}</span>
                  </h1>
                  <p className="flex items-center text-(--color-text-muted) text-xs gap-2">
                    <Calendar size={14} />{" "}
                    <span>{giveMeDate(order.createdAt)}</span>
                  </p>
                </CardHeader>
                <CardContent className="flex flex-col gap-1">
                  <div className="h-10 mb-2">
                    {order.items.slice(0, 2).map((prod, i) => (
                      <div className="font-medium truncate" key={i}>
                        {prod.product.title}
                      </div>
                    ))}
                    {order.items.length > 2 && (
                      <div className=" truncate text-(--color-text-muted) text-sm ">
                        + {order.items.length - 2} books more
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CreditCard size={20} />
                    <span>Total: </span>
                    <span className=" text-base">₹{order.totalAmount}</span>
                  </div>
                  <p>
                    <span className="text-sm">Status:</span>{" "}
                    <span className="text-xs font-medium text-(--color-button-yellow-hover) bg-(--color-accent-yellow) py-1 px-2 rounded-xl">
                      {order.status}
                    </span>
                  </p>
                </CardContent>
                <CardFooter className="mt-4">
                  <Button
                    className="w-full bg-linear-to-r from-(--color-accent-yellow) to-(--color-button-yellow-hover) text-white hover:to-(--color-button-yellow-hover) hover:from-(--color-accent-yellow) cursor-pointer"
                    onClick={() => setDetailOrder(order)}
                  >
                    View Detial
                  </Button>
                </CardFooter>
              </Card>
            ))}
        </div>
        <div className="flex justify-center">
          <Button
            className="bg-linear-to-r from-(--color-accent-yellow) to-(--color-button-yellow-hover) text-white hover:to-(--color-button-yellow-hover) hover:from-(--color-accent-yellow) cursor-pointer"
            onClick={() => {
              setIsShowLess(!isShowLess);
            }}
          >
            {isShowLess ? "View All Orders" : "View Less Orders"}
          </Button>
        </div>
      </div>

      
      <Dialog
        open={!!(detailOrder && orders)}
        onOpenChange={() => {
          setDetailOrder(null);
        }}
      >
        <DialogContent className="sm:max-w-180 max-h-[95vh] z-2000 overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-(--color-button-yellow-hover) text-xl font-semibold">
              Order Details
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <Card className="bg-(--color-surface-soft) gap-2 p-4">
              <CardTitle className="text-lg p-0 text-(--color-button-yellow-hover)">
                Order Status
              </CardTitle>
              <CardContent className="flex items-center justify-between p-0 text-(--color-text-muted)">
                <div
                  className={`flex flex-col items-center jusitfy-center gap-1 ${detailOrder?.status === "processing" && "text-blue-700"}`}
                >
                  <span className={`rounded-full ${detailOrder?.status === "processing" ?("bg-(--color-surface-muted)"):("bg-(--color-surface-soft)")}  p-2`} >
                    <Package size={22} />
                  </span>
                  <span className="text-xs font-medium">Processing</span>
                </div>
                <div className="h-1 flex-1 bg-gray-300"></div>
                <div
                  className={`flex flex-col items-center jusitfy-center gap-1 ${detailOrder?.status === "shipped" && "text-blue-700"}`}
                >
                  <span className={`rounded-full ${detailOrder?.status === "shipped" ?("bg-(--color-surface-muted)"):("bg-(--color-surface-soft)")}  p-2`} >
                    <Truck />
                  </span>
                  <span className="text-xs font-medium">Shipped</span>
                </div>
                <div className="h-1 flex-1 bg-gray-300"></div>
                <div
                  className={`flex flex-col items-center jusitfy-center gap-1 ${detailOrder?.status === "delivered" && "text-blue-700"}`}
                >
                  <span className={`rounded-full ${detailOrder?.status === "delivered" ?("bg-(--color-surface-muted)"):("bg-(--color-surface-soft)")}  p-2`} >
                    <CircleCheckBig />
                  </span>
                  <span className="text-xs font-medium">Delivered</span>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-(--color-surface-soft) gap-2 p-4">
              <CardTitle className="text-lg p-0 text-blue-800">Items</CardTitle>
              <CardContent className="flex flex-col gap-4 justify-between p-0 ">
                {detailOrder?.items.map((item, index) => (
                  <Link href={`/books/${item.product._id}`}  key={index}>
                    <div className="flex items-center gap-4 rounded-md hover:bg-(--color-surface-muted)">
                    <img
                      src={item.product.images[0]}
                      alt="orderImage"
                      className="w-24 h-26 object-fit"
                    />
                    <div className="flex flex-col">
                      <h1 className="font-medium text-lg">
                        {item.product.title}
                      </h1>
                      <div className="flex gap-4 items-center">
                        <h3 className="font-medium">{item.product.subject}</h3>
                        <p className="text-sm">({item.product.author})</p>
                      </div>
                      <p className="font-light text-(--color-header-text) text-sm mt-2">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                  </div>
                  </Link>
                ))}
              </CardContent>
            </Card>
            <Card className="bg-(--color-surface-soft) gap-2 p-4">
              <CardTitle className="text-lg p-0 text-(--color-accent-yellow)">
                Shipping Address
              </CardTitle>
              <CardContent className="flex flex-col  justify-between p-0 ">
                {detailOrder?.shippingAddress ? (
                  <>
                    <div>{detailOrder.shippingAddress.addressLine1}</div>
                    <div>
                      {detailOrder.shippingAddress.city},{" "}
                      {detailOrder.shippingAddress.state} -{" "}
                      {detailOrder.shippingAddress.pin}
                    </div>
                  </>
                ) : (
                  <div>Shipping Address not added yet.</div>
                )}
              </CardContent>
            </Card>
            <Card className="bg-(--color-accent-yellow) gap-2 p-4">
              <CardTitle className="text-lg p-0 text-(--color-accent-yellow)">
                Shipping Address
              </CardTitle>
              <CardContent className="flex flex-col  justify-between p-0 ">
                <div>Order ID: {detailOrder?._id}</div>
                <div>
                  Payment ID: {detailOrder?.paymentDetail?.razorpay_payment_id}
                </div>
                <div>Amount: ₹{detailOrder?.totalAmount}</div>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
