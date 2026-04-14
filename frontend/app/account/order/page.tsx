"use client"
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { IOrder } from "@/lib/types/product";
import { Calendar, CreditCard, ShoppingBag } from "lucide-react";
import { useState } from "react";

export default function page() {
  const [isShowLess,setIsShowLess]=useState<boolean>(false)
  const [orders,setOrders]=useState<IOrder[] | []>([])

  const giveMeDate=(givenDate:string)=>{
    const convertedDate=new Date(givenDate)
    return convertedDate.toLocaleDateString() as string
  }

  return (
    <div className="space-y-4">
      <Card className=" rounded-md bg-linear-to-r from-[#f97316] to-[#f69e0c] text-white gap-0">
        <CardHeader className="text-4xl font-medium">My Orders</CardHeader>
        <CardContent className="text-white font-light">
          View and manage your recent purchases
        </CardContent>
      </Card>
      <div className="grid sm:grid-cols-2 gap-4">
        {orders.filter((order,i)=>((isShowLess && i<2)||(!isShowLess))).map((order)=>(
          <Card className="pt-0 overflow-hidden w-full sm:max-w-76 gap-2">
          <CardHeader className="bg-[#fdf2f9] py-4">
            <h1 className="flex items-center text-[#7e22ce] text-xl font-medium gap-2">
              <ShoppingBag size={16} /> <span>Order {order._id}</span>
            </h1>
            <p className="flex items-center text-[#737373] text-xs gap-2">
              <Calendar size={14} /> <span>{giveMeDate(order.createdAt)}</span>
            </p>
          </CardHeader>
          <CardContent className="flex flex-col gap-1">
            <div className="font-medium truncate">{order.items.map((prod)=>prod.product.title).join(", ")}</div>
            <div className="flex items-center gap-2 text-sm">
              <CreditCard size={20} />
              <span>Total: </span>
              <span className=" text-base">₹{order.totalAmount}</span>
            </div>
            <p>
              <span className="text-sm">Status:</span>{" "}
              <span className="text-xs font-medium text-[#954d0e] bg-[#fef9c3] py-1 px-2 rounded-xl">
                {order.paymentStatus}
              </span>
            </p>
          </CardContent>
          <CardFooter className="mt-4">
            <Button className="w-full bg-linear-to-r from-[#f97316] to-[#f69e0c] text-white hover:to-[#ca7e04] hover:from-[#dd6109] cursor-pointer">
              View Detial
            </Button>
          </CardFooter>
        </Card>
        ))}
      </div>
      <div className="flex justify-center">
        <Button className="bg-linear-to-r from-[#f97316] to-[#f69e0c] text-white hover:to-[#ca7e04] hover:from-[#dd6109] cursor-pointer" onClick={()=>{
          setIsShowLess(!isShowLess)
        }}>
          {isShowLess ?"View All Orders":"View Less Orders"}
        </Button>
      </div>
    </div>
  );
}
