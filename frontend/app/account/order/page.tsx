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

export default function page() {
  const [isShowLess, setIsShowLess] = useState<boolean>(false);
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [getAllOrderOfUser] = useLazyGetOrderByUserIdQuery();
  const [detailOrder, setDetailOrder] = useState<IOrder | null>(null);

  useEffect(() => {
    fetchingAllOrder();
  }, []);

  const fetchingAllOrder = async () => {
    try {
      const response = await getAllOrderOfUser({}).unwrap();
      if (response.isSuccess) {
        setOrders(response.data);
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  const giveMeDate = (givenDate: string) => {
    const convertedDate = new Date(givenDate);
    return convertedDate.toLocaleDateString() as string;
  };

  return (
    <>
      <div className="space-y-4">
        <Card className=" rounded-md bg-linear-to-r from-[#f97316] to-[#f69e0c] text-white gap-0">
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
                <CardHeader className="bg-[#fdf2f9] py-4">
                  <h1 className="flex items-center text-[#7e22ce] text-xl font-medium gap-2">
                    <ShoppingBag size={16} />{" "}
                    <span>Order #{order._id.slice(0, 6)}</span>
                  </h1>
                  <p className="flex items-center text-[#737373] text-xs gap-2">
                    <Calendar size={14} />{" "}
                    <span>{giveMeDate(order.createdAt)}</span>
                  </p>
                </CardHeader>
                <CardContent className="flex flex-col gap-1">
                  <div>
                    {order.items.slice(0, 2).map((prod, i) => (
                      <div className="font-medium truncate" key={i}>
                        {prod.product.title}
                      </div>
                    ))}
                    {order.items.length > 2 && (
                      <div className=" truncate text-[#737373] text-sm ">
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
                    <span className="text-xs font-medium text-[#954d0e] bg-[#fef9c3] py-1 px-2 rounded-xl">
                      {order.status}
                    </span>
                  </p>
                </CardContent>
                <CardFooter className="mt-4">
                  <Button
                    className="w-full bg-linear-to-r from-[#f97316] to-[#f69e0c] text-white hover:to-[#ca7e04] hover:from-[#dd6109] cursor-pointer"
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
            className="bg-linear-to-r from-[#f97316] to-[#f69e0c] text-white hover:to-[#ca7e04] hover:from-[#dd6109] cursor-pointer"
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
            <DialogTitle className="text-blue-700 text-xl font-semibold">
              Order Details
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <Card className="bg-[#f9e7f6] gap-2 p-4">
              <CardTitle className="text-lg p-0 text-blue-800">
                Order Status
              </CardTitle>
              <CardContent className="flex items-center justify-between p-0 text-[#7f838a]">
                <div
                  className={`flex flex-col items-center jusitfy-center gap-1 ${detailOrder?.status === "processing" && "text-blue-700"}`}
                >
                  <span className={`rounded-full ${detailOrder?.status === "processing" ?("bg-[#ccd6e5]"):("bg-[#F3F4F6]")}  p-2`} >
                    <Package size={22} />
                  </span>
                  <span className="text-xs font-medium">Processing</span>
                </div>
                <div className="h-1 flex-1 bg-gray-300"></div>
                <div
                  className={`flex flex-col items-center jusitfy-center gap-1 ${detailOrder?.status === "shipped" && "text-blue-700"}`}
                >
                  <span className={`rounded-full ${detailOrder?.status === "shipped" ?("bg-[#ccd6e5]"):("bg-[#F3F4F6]")}  p-2`} >
                    <Truck />
                  </span>
                  <span className="text-xs font-medium">Shipped</span>
                </div>
                <div className="h-1 flex-1 bg-gray-300"></div>
                <div
                  className={`flex flex-col items-center jusitfy-center gap-1 ${detailOrder?.status === "delivered" && "text-blue-700"}`}
                >
                  <span className={`rounded-full ${detailOrder?.status === "delivered" ?("bg-[#ccd6e5]"):("bg-[#F3F4F6]")}  p-2`} >
                    <CircleCheckBig />
                  </span>
                  <span className="text-xs font-medium">Delivered</span>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-[#d3f5fe] gap-2 p-4">
              <CardTitle className="text-lg p-0 text-blue-800">Items</CardTitle>
              <CardContent className="flex flex-col gap-4 justify-between p-0 ">
                {detailOrder?.items.map((item, index) => (
                  <Link href={`/books/${item.product._id}`}  key={index}>
                    <div className="flex items-center gap-4 rounded-md hover:bg-[#abc8d0]">
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
                      <p className="font-light text-[#4B5563] text-sm mt-2">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                  </div>
                  </Link>
                ))}
              </CardContent>
            </Card>
            <Card className="bg-[#cefbf0] gap-2 p-4">
              <CardTitle className="text-lg p-0 text-[#166534]">
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
            <Card className="bg-[#fff3cd] gap-2 p-4">
              <CardTitle className="text-lg p-0 text-[#854D0E]">
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
