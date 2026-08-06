"use client";

import { useState, useMemo, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import {
  CircleCheckBig,
  Edit,
  Eye,
  Package,
  Truck,
  ChevronLeft,
  ChevronRight,
  DollarSign,
} from "lucide-react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { setAdminDashboard } from "@/store/slice/adminSlice";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

// Form types
interface FilterFormData {
  orderStatus: string;
  paymentStatus: string;
  search: string;
  startDate: string;
  endDate: string;
}

interface EditOrderFormData {
  status: string;
  paymentStatus: string;
  notes: string;
}

interface PaySellerFormData {
  product: string;
  paymentMethod: string;
  amount: string;
  notes: string;
}

type DialogState = "detail" | "edit" | "paySeller" | null;

export default function AdminOrdersPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const dispatch = useDispatch();
  const itemsPerPage = 10;
  const [dialogState, setDialogState] = useState<DialogState>(null);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const orders = useSelector((state: RootState) => state.admin.order);
  const [paginatedOrders, setPaginatedOrders] = useState<any>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [filterOrders, setFilterOrders] = useState<any>(null);
  const [totalPages, setTotalPages] = useState<number>(0);

  // React Hook Form instances
  const filterForm = useForm<FilterFormData>({
    defaultValues: {
      orderStatus: "",
      paymentStatus: "",
      search: "",
      startDate: "",
      endDate: "",
    },
  });

  const editOrderForm = useForm<EditOrderFormData>({
    defaultValues: {
      status: "",
      paymentStatus: "",
      notes: "",
    },
  });

  const paySellerForm = useForm<PaySellerFormData>({
    defaultValues: {
      product: "",
      paymentMethod: "",
      amount: "",
      notes: "",
    },
  });

  // Handle filter form submission
  const onFilterSubmit = (data: FilterFormData) => {
    setFilterOrders(filteredOrders);
    setCurrentPage(1);
  };

  // Reset filters
  const handleResetFilters = () => {
    filterForm.reset();
    setFilterOrders(orders);
    setCurrentPage(1);
  };

  // Filter and sort orders
  const filteredOrders = useMemo(() => {
    const filters = filterForm.getValues();

    if (!orders) return [];
    return orders.filter((order) => {
      if (filters.orderStatus && order.status !== filters.orderStatus) {
        return false;
      }
      if (
        filters.paymentStatus &&
        order.paymentStatus !== filters.paymentStatus
      )
        return false;
      const customerName = order.user?.name || "Unknown";
      if (
        filters.search &&
        !customerName.toLowerCase().includes(filters.search.toLowerCase()) &&
        !order._id.includes(filters.search)
      )
        return false;
      if (
        filters.startDate &&
        new Date(order.createdAt) < new Date(filters.startDate)
      )
        return false;
      if (
        filters.endDate &&
        new Date(order.createdAt) > new Date(filters.endDate)
      )
        return false;
      return true;
    });
  }, [filterForm.watch()]);

  useEffect(() => {
    if (filterOrders) {
      setTotalPages(Math.ceil(filterOrders.length / itemsPerPage));
      const startIdx = (currentPage - 1) * itemsPerPage;
      setPaginatedOrders(filterOrders.slice(startIdx, startIdx + itemsPerPage));
    }
  }, [filterOrders, currentPage]);

  useEffect(() => {
    if (orders) {
      setFilterOrders(orders);
    }
  }, [orders]);

  // Handle dialog open
  const openDialog = (state: DialogState, order: any) => {
    setSelectedOrder(order);
    setDialogState(state);
    if (state === "edit" && order) {
      editOrderForm.reset({
        status: order.status,
        paymentStatus: order.paymentStatus || "",
        notes: "",
      });
    }
    if (state === "paySeller") {
      paySellerForm.reset({
        product: "",
        paymentMethod: "",
        amount: "",
        notes: "",
      });
    }
  };

  // Handle dialog close
  const closeDialog = () => {
    setDialogState(null);
    setSelectedOrder(null);
    editOrderForm.reset();
    paySellerForm.reset();
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Get status badge color matching Stitch design
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      processing: "bg-primary-container text-on-primary-container",
      shipped: "bg-[#ffe07c] text-[#564500]",
      delivered: "bg-tertiary-container text-[#00531c]",
      canceled: "bg-[#ffdad6] text-[#93000a]",
      cancelled: "bg-[#ffdad6] text-[#93000a]",
    };
    return colors[status?.toLowerCase()] || "bg-[#e1e3e4] text-[#191c1d]";
  };

  const getPaymentColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-[#e2dfe0] text-[#636263]",
      complete: "bg-[#e7e8e9] text-[#191c1d]",
      completed: "bg-[#e7e8e9] text-[#191c1d]",
      failed: "bg-[#ffdad6] text-[#93000a]",
    };
    return colors[status?.toLowerCase()] || "bg-[#e1e3e4] text-[#191c1d]";
  };

  const sellerPayment = async (data: any) => {
    try {
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchingDashboardDetail = async () => {
    try {
      const response = await fetch(`${BASE_URL}/admin/order-dashboard`);
      const data = await response.json();
      if (data.isSuccess) {
        dispatch(setAdminDashboard(data.data));
      }
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  const updateOrderStatus = async (data: any, orderId: string) => {
    try {
      const response = await fetch(
        `${BASE_URL}/admin/update-order/${orderId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        },
      );
      const result = await response.json();
      if (result.isSuccess) {
        await fetchingDashboardDetail();
      }
      console.log(result);
    } catch (error) {
      console.log(error);
    }
    console.log(data, orderId);
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Header Section */}
      <header className="flex flex-col gap-1">
        <div className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant">
          Management / Orders
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-[#191c1d] tracking-tight">
          Orders
        </h1>
      </header>

      {/* Filter Section Card */}
      <section className="bg-white rounded-lg border border-outline-variant p-6 shadow-sm flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-bold text-[#191c1d]">Filters</h2>
          <p className="text-sm text-on-surface-variant">
            Filter orders by various criteria
          </p>
        </div>
        <form onSubmit={filterForm.handleSubmit(onFilterSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end mt-2">
            {/* Order Status */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#191c1d] tracking-wide">
                Order Status
              </label>
              <Controller
                name="orderStatus"
                control={filterForm.control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger className="w-full h-12 bg-transparent border border-outline-variant rounded-lg px-4 text-sm text-[#191c1d] focus:border-surface-tint focus:ring-1 focus:ring-surface-tint outline-none">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-outline-variant">
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="canceled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {/* Payment Status */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#191c1d] tracking-wide">
                Payment Status
              </label>
              <Controller
                name="paymentStatus"
                control={filterForm.control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger className="w-full h-12 bg-transparent border border-outline-variant rounded-lg px-4 text-sm text-[#191c1d] focus:border-surface-tint focus:ring-1 focus:ring-surface-tint outline-none">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-outline-variant">
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {/* Search */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#191c1d] tracking-wide">
                Search
              </label>
              <Input
                placeholder="Order ID or Customer"
                {...filterForm.register("search")}
                className="w-full h-12 bg-transparent border border-outline-variant rounded-lg px-4 text-sm text-[#191c1d] placeholder:text-[#5f5e5f] focus:border-surface-tint focus:ring-1 focus:ring-surface-tint outline-none shadow-none"
              />
            </div>

            {/* Start Date */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#191c1d] tracking-wide">
                Start Date
              </label>
              <div className="relative">
                <Input
                  type="date"
                  {...filterForm.register("startDate")}
                  className="w-full h-12 bg-transparent border border-outline-variant rounded-lg px-4 text-sm text-[#191c1d] placeholder:text-[#5f5e5f] focus:border-surface-tint focus:ring-1 focus:ring-surface-tint outline-none shadow-none"
                />
              </div>
            </div>

            {/* End Date */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#191c1d] tracking-wide">
                End Date
              </label>
              <div className="relative">
                <Input
                  type="date"
                  {...filterForm.register("endDate")}
                  className="w-full h-12 bg-transparent border border-outline-variant rounded-lg px-4 text-sm text-[#191c1d] placeholder:text-[#5f5e5f] focus:border-surface-tint focus:ring-1 focus:ring-surface-tint outline-none shadow-none"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 items-end h-12">
              <Button
                type="submit"
                className="flex-1 bg-primary-container text-on-primary-container font-bold h-full rounded-lg px-4 hover:opacity-90 transition-opacity border-none shadow-none"
              >
                Apply Filters
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleResetFilters}
                className="px-4 bg-transparent border border-outline-variant text-[#191c1d] rounded-lg h-full font-semibold hover:bg-[#e1e3e4] transition-colors shadow-none"
              >
                Reset
              </Button>
            </div>
          </div>
        </form>
      </section>

      {/* Orders Table Card Section */}
      {filterOrders && (
        <section className="bg-white rounded-lg border border-outline-variant p-6 shadow-sm flex flex-col flex-1">
          <div className="flex flex-col gap-1 mb-4">
            <h2 className="text-xl font-bold text-[#191c1d]">Orders</h2>
            <p className="text-sm text-on-surface-variant">
              Showing {paginatedOrders.length} of {filterOrders.length} orders
            </p>
          </div>

          <div className="overflow-x-auto">
            <Table className="w-full text-left border-collapse min-w-200">
              <TableHeader>
                <TableRow className="border-b border-outline-variant hover:bg-transparent">
                  <TableHead className="text-xs font-semibold text-on-surface-variant py-3 px-3">
                    Order ID
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-on-surface-variant py-3 px-3">
                    Customer
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-on-surface-variant py-3 px-3">
                    Date
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-on-surface-variant py-3 px-3">
                    Amount
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-on-surface-variant py-3 px-3">
                    Status
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-on-surface-variant py-3 px-3">
                    Payment
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-on-surface-variant py-3 px-3 text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="text-sm text-[#191c1d]">
                {paginatedOrders.length > 0 ? (
                  paginatedOrders.map((order: any) => {
                    const customerName = order.user?.name || "Unknown";

                    return (
                      <TableRow
                        key={order._id}
                        className="border-b border-outline-variant hover:bg-[#e1e3e4]/30 transition-colors group"
                      >
                        <TableCell className="py-4 px-3 font-medium text-[#191c1d]">
                          #{order._id.slice(0, 6)}
                        </TableCell>
                        <TableCell className="py-4 px-3 text-[#191c1d]">
                          {customerName}
                        </TableCell>
                        <TableCell className="py-4 px-3 text-[#191c1d]">
                          {formatDate(order.createdAt)}
                        </TableCell>
                        <TableCell className="py-4 px-3 font-medium text-[#191c1d]">
                          ₹{order.totalAmount}
                        </TableCell>
                        <TableCell className="py-4 px-3">
                          <span
                            className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${getStatusColor(
                              order.status,
                            )}`}
                          >
                            {order.status === "processing" && (
                              <Package size={14} />
                            )}
                            {order.status === "shipped" && (
                              <Truck size={14} />
                            )}
                            {order.status === "delivered" && (
                              <CircleCheckBig size={14} />
                            )}
                            {order.status}
                          </span>
                        </TableCell>
                        <TableCell className="py-4 px-3">
                          <span
                            className={`inline-flex items-center text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${getPaymentColor(
                              order.paymentStatus || "pending",
                            )}`}
                          >
                            {order.paymentStatus || "pending"}
                          </span>
                        </TableCell>
                        <TableCell className="py-4 px-3 text-right">
                          <div className="flex items-center justify-end gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => openDialog("detail", order)}
                              className="text-on-surface-variant hover:text-surface-tint p-1.5 rounded-lg hover:bg-[#e1e3e4] transition-colors"
                              title="View Details"
                            >
                              <Eye size={18} />
                            </button>
                            <button
                              onClick={() => openDialog("edit", order)}
                              className="text-on-surface-variant hover:text-surface-tint p-1.5 rounded-lg hover:bg-[#e1e3e4] transition-colors"
                              title="Edit Order"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => openDialog("paySeller", order)}
                              className="text-on-surface-variant hover:text-surface-tint p-1.5 rounded-lg hover:bg-[#e1e3e4] transition-colors"
                              title="Process Seller Payment"
                            >
                              <DollarSign size={18} />
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="h-24 text-center text-on-surface-variant"
                    >
                      No orders found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="mt-auto pt-4 border-t border-outline-variant flex items-center justify-between">
            <span className="text-sm text-on-surface-variant">
              Page {currentPage} of {totalPages || 1}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-8 h-8 rounded-lg border border-outline-variant flex items-center justify-center text-on-surface-variant hover:bg-[#e1e3e4] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages || totalPages === 0}
                className="w-8 h-8 rounded-lg border border-outline-variant flex items-center justify-center text-on-surface-variant hover:bg-[#e1e3e4] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* View Detail Dialog */}
      <Dialog open={dialogState === "detail"} onOpenChange={closeDialog}>
        <DialogContent className="sm:max-w-2xl max-h-[95vh] overflow-y-auto bg-white border border-outline-variant">
          <DialogHeader>
            <DialogTitle className="text-on-primary-container text-xl font-bold">
              Order Details
            </DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              {/* Order Status */}
              <Card className="bg-surface-container-low border border-outline-variant p-4 shadow-none">
                <CardTitle className="text-base font-bold p-0 text-on-primary-container">
                  Order Status
                </CardTitle>
                <CardContent className="flex items-center justify-between p-0 text-on-surface-variant mt-4">
                  <div
                    className={`flex flex-col items-center gap-1 ${
                      selectedOrder?.status === "processing" && "text-surface-tint font-semibold"
                    }`}
                  >
                    <span
                      className={`rounded-full ${
                        selectedOrder?.status === "processing"
                          ? "bg-primary-container text-on-primary-container"
                          : "bg-[#e1e3e4] text-on-surface-variant"
                      } p-2`}
                    >
                      <Package size={22} />
                    </span>
                    <span className="text-xs font-medium">Processing</span>
                  </div>
                  <div className="h-1 flex-1 bg-outline-variant mx-2"></div>
                  <div
                    className={`flex flex-col items-center gap-1 ${
                      selectedOrder?.status === "shipped" && "text-surface-tint font-semibold"
                    }`}
                  >
                    <span
                      className={`rounded-full ${
                        selectedOrder?.status === "shipped"
                          ? "bg-primary-container text-on-primary-container"
                          : "bg-[#e1e3e4] text-on-surface-variant"
                      } p-2`}
                    >
                      <Truck size={22} />
                    </span>
                    <span className="text-xs font-medium">Shipped</span>
                  </div>
                  <div className="h-1 flex-1 bg-outline-variant mx-2"></div>
                  <div
                    className={`flex flex-col items-center gap-1 ${
                      selectedOrder?.status === "delivered" && "text-surface-tint font-semibold"
                    }`}
                  >
                    <span
                      className={`rounded-full ${
                        selectedOrder?.status === "delivered"
                          ? "bg-tertiary-container text-[#00531c]"
                          : "bg-[#e1e3e4] text-on-surface-variant"
                      } p-2`}
                    >
                      <CircleCheckBig size={22} />
                    </span>
                    <span className="text-xs font-medium">Delivered</span>
                  </div>
                </CardContent>
              </Card>

              {/* Items */}
              <Card className="bg-surface-container-low border border-outline-variant p-4 shadow-none">
                <CardTitle className="text-base font-bold p-0 text-on-primary-container">
                  Items
                </CardTitle>
                <CardContent className="flex flex-col gap-4 justify-between p-0 mt-4">
                  {selectedOrder?.items.map((item: any, index: number) => (
                    <Link key={index} href={`/books/${item.product._id}`}>
                      <div className="flex items-center gap-4 rounded-lg hover:bg-[#e1e3e4] p-2 transition-colors">
                        <img
                          src={item.product.images[0]}
                          alt="orderImage"
                          className="w-20 h-24 object-cover rounded border border-outline-variant"
                        />
                        <div className="flex flex-col">
                          <h3 className="font-semibold text-base text-[#191c1d]">
                            {item.product.title}
                          </h3>
                          <div className="flex gap-3 items-center text-sm text-on-surface-variant">
                            <span className="font-medium">
                              {item.product.subject}
                            </span>
                            <span>({item.product.author})</span>
                          </div>
                          <p className="text-xs text-on-surface-variant mt-2">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </CardContent>
              </Card>

              {/* Shipping Address */}
              <Card className="bg-surface-container-low border border-outline-variant p-4 shadow-none">
                <CardTitle className="text-base font-bold p-0 text-on-primary-container">
                  Shipping Address
                </CardTitle>
                <CardContent className="flex flex-col justify-between p-0 mt-3 text-sm text-[#191c1d]">
                  {selectedOrder?.shippingAddress ? (
                    <>
                      <div>{selectedOrder.shippingAddress.addressLine1}</div>
                      <div>
                        {selectedOrder.shippingAddress.city},{" "}
                        {selectedOrder.shippingAddress.state} -{" "}
                        {selectedOrder.shippingAddress.pin}
                      </div>
                    </>
                  ) : (
                    <div className="text-on-surface-variant">Shipping Address not added yet.</div>
                  )}
                </CardContent>
              </Card>

              {/* Order Summary */}
              <Card className="bg-primary-container border-none p-4 rounded-lg shadow-none">
                <CardTitle className="text-base font-bold p-0 text-on-primary-container">
                  Order Summary
                </CardTitle>
                <CardContent className="flex flex-col gap-1.5 p-0 mt-3 text-sm text-on-primary-container font-medium">
                  <div>Order ID: #{selectedOrder?._id}</div>
                  {selectedOrder?.paymentDetail?.razorpay_payment_id && (
                    <div>
                      Payment ID: {selectedOrder.paymentDetail.razorpay_payment_id}
                    </div>
                  )}
                  <div className="font-bold text-base mt-1">
                    Total Amount: ₹{selectedOrder?.totalAmount}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Order Dialog */}
      <Dialog open={dialogState === "edit"} onOpenChange={closeDialog}>
        <DialogContent className="sm:max-w-md bg-white border border-outline-variant">
          <DialogHeader>
            <DialogTitle className="text-[#191c1d] text-lg font-bold">
              Edit Order
            </DialogTitle>
            <DialogDescription className="text-on-surface-variant">
              Update order status and payment details
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <form
              onSubmit={editOrderForm.handleSubmit(async (data) => {
                await updateOrderStatus(data, selectedOrder._id);
                closeDialog();
              })}
            >
              <div className="space-y-4">
                {/* Order Status */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#191c1d]">
                    Order Status
                  </label>
                  <Controller
                    name="status"
                    control={editOrderForm.control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full bg-white border border-outline-variant h-10 text-sm">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border border-outline-variant">
                          <SelectItem value="processing">Processing</SelectItem>
                          <SelectItem value="shipped">Shipped</SelectItem>
                          <SelectItem value="delivered">Delivered</SelectItem>
                          <SelectItem value="canceled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                {/* Payment Status */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#191c1d]">
                    Payment Status
                  </label>
                  <Controller
                    name="paymentStatus"
                    control={editOrderForm.control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full bg-white border border-outline-variant h-10 text-sm">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border border-outline-variant">
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="failed">Failed</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                {/* Notes */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#191c1d]">
                    Notes (Optional)
                  </label>
                  <Textarea
                    placeholder="Add any notes about this order..."
                    {...editOrderForm.register("notes")}
                    className="bg-white border border-outline-variant resize-none text-sm"
                    rows={4}
                  />
                </div>

                {/* Buttons */}
                <div className="flex gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={closeDialog}
                    className="flex-1 border border-outline-variant text-[#191c1d] hover:bg-[#e1e3e4]"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-primary-container text-on-primary-container font-bold hover:bg-[#ecc200]"
                  >
                    Update Order
                  </Button>
                </div>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Pay Seller Dialog */}
      <Dialog open={dialogState === "paySeller"} onOpenChange={closeDialog}>
        <DialogContent className="sm:max-w-md max-h-[95vh] overflow-y-auto bg-white border border-outline-variant">
          <DialogHeader>
            <DialogTitle className="text-[#191c1d] text-lg font-bold">
              Process Seller Payment
            </DialogTitle>
            <DialogDescription className="text-on-surface-variant">
              Process payment to the seller for this order
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <form
              onSubmit={paySellerForm.handleSubmit(async (data) => {
                await sellerPayment(data);
                closeDialog();
              })}
            >
              <div className="space-y-4">
                {/* Select Product */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#191c1d]">
                    Select Product
                  </label>
                  <Controller
                    name="product"
                    control={paySellerForm.control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={(value) => {
                          field.onChange(value);
                          const chosenItem = selectedOrder?.items.find(
                            (item: any) => item.product._id === value,
                          );
                          if (chosenItem) {
                            setSelectedProduct(chosenItem.product);
                          }
                          paySellerForm.setValue(
                            "paymentMethod",
                            chosenItem?.product?.paymentMethod || "upi",
                          );
                          paySellerForm.setValue(
                            "amount",
                            chosenItem?.product?.finalPrice,
                          );
                        }}
                      >
                        <SelectTrigger className="w-full bg-white border border-outline-variant h-10 text-sm">
                          <SelectValue placeholder="Select product" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border border-outline-variant">
                          {selectedOrder?.items.map(
                            (item: any, idx: number) => (
                              <SelectItem key={idx} value={item.product._id}>
                                {item.product.title}
                              </SelectItem>
                            ),
                          )}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                {/* Seller Information (Read-only) */}
                {selectedProduct && (
                  <Card className="bg-surface-container-low border border-outline-variant p-4 shadow-none">
                    <CardTitle className="text-xs font-bold text-on-primary-container uppercase tracking-wider">
                      Seller Information
                    </CardTitle>
                    {selectedOrder && selectedOrder?.items && (
                      <div className="space-y-1.5 text-xs text-on-surface-variant mt-2">
                        <div>
                          <span className="font-semibold text-[#191c1d]">Name:</span>{" "}
                          {selectedProduct.seller?.name || "N/A"}
                        </div>
                        <div>
                          <span className="font-semibold text-[#191c1d]">Email:</span>{" "}
                          {selectedProduct.seller?.email || "N/A"}
                        </div>
                        <div>
                          <span className="font-semibold text-[#191c1d]">Phone:</span>{" "}
                          {selectedProduct.seller?.phoneNumber || "N/A"}
                        </div>
                        <div>
                          <span className="font-semibold text-[#191c1d]">UPI ID:</span>{" "}
                          {selectedProduct?.paymentDetails?.UpiId ||
                            selectedProduct?.paymentDetails?.bankDetails ||
                            "N/A"}
                        </div>
                      </div>
                    )}
                  </Card>
                )}

                {/* Payment Method */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#191c1d]">
                    Payment Method
                  </label>
                  <Controller
                    name="paymentMethod"
                    control={paySellerForm.control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full bg-white border border-outline-variant h-10 text-sm">
                          <SelectValue placeholder="Select method" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border border-outline-variant">
                          <SelectItem value="upi">UPI</SelectItem>
                          <SelectItem value="bank">Bank Account</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                {/* Amount */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#191c1d]">
                    Amount
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">
                      ₹
                    </span>
                    <Input
                      type="number"
                      placeholder="0"
                      {...paySellerForm.register("amount")}
                      className="bg-white border border-outline-variant pl-8 h-10 text-sm"
                    />
                  </div>
                </div>

                {/* Notes */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#191c1d]">
                    Notes (Optional)
                  </label>
                  <Textarea
                    placeholder="Add any notes..."
                    {...paySellerForm.register("notes")}
                    className="bg-white border border-outline-variant resize-none text-sm"
                    rows={3}
                  />
                </div>

                {/* Buttons */}
                <div className="flex gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={closeDialog}
                    className="flex-1 border border-outline-variant text-[#191c1d] hover:bg-[#e1e3e4]"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-primary-container text-on-primary-container font-bold hover:bg-[#ecc200]"
                  >
                    Process Payment
                  </Button>
                </div>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
