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
    // Filter logic will be applied through the form values
    setFilterOrders(filteredOrders);
    setCurrentPage(1);
  };

  // Reset filters
  const handleResetFilters = () => {
    filterForm.reset();
    setFilterOrders(orders)
    setCurrentPage(1);
  };

  // Filter and sort orders
  const filteredOrders = useMemo(() => {
    const filters = filterForm.getValues();
    const customers: Record<string, string> = {
      "6507a7": "Md. Sajal Ali",
      "781278": "Anu Singh",
    };

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
      const customerName = order.user.name || "Unknown";
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
  }, [filterOrders]);

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

  // Get status badge color
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      processing: "bg-(--color-accent-yellow) text-black",
      shipped: "bg-(--color-primary) text-white",
      delivered: "bg-(--color-accent-yellow)/50 text-black",
      canceled: "bg-(--color-danger) text-white",
    };
    return colors[status] || "bg-(--color-surface-muted)";
  };

  const getPaymentColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-(--color-accent-yellow) text-black",
      completed: "bg-(--color-accent-yellow)/50 text-black",
      failed: "bg-(--color-danger) text-white",
    };
    return colors[status] || "bg-(--color-surface-muted)";
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
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.35em] text-(--color-text-muted)">
          Management
        </p>
        <h2 className="text-3xl font-semibold">Orders</h2>
      </div>

      {/* Filter Section */}
      <Card className="bg-(--color-card) border-(--color-header-border)">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Filter orders by various criteria</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={filterForm.handleSubmit(onFilterSubmit)}>
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {/* Order Status */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Order Status</label>
                  <Controller
                    name="orderStatus"
                    control={filterForm.control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="bg-white border border-gray-300">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
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
                <div className="space-y-2">
                  <label className="text-sm font-medium">Payment Status</label>
                  <Controller
                    name="paymentStatus"
                    control={filterForm.control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="bg-white border border-gray-300">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="failed">Failed</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                {/* Search */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Search</label>
                  <Input
                    placeholder="Order ID or Customer"
                    {...filterForm.register("search")}
                    className="bg-white border border-gray-300"
                  />
                </div>

                {/* Start Date */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Start Date</label>
                  <Input
                    type="date"
                    {...filterForm.register("startDate")}
                    className="bg-white border border-gray-300"
                  />
                </div>

                {/* End Date */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">End Date</label>
                  <Input
                    type="date"
                    {...filterForm.register("endDate")}
                    className="bg-white border border-gray-300"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex items-end gap-2">
                  <Button
                    type="submit"
                    className="flex-1 bg-(--color-accent-yellow) text-black hover:bg-(--color-button-yellow-hover)"
                  >
                    Apply Filters
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleResetFilters}
                    className="flex-1 border-(--color-header-border)"
                  >
                    Reset
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Orders Table Section */}
      {filterOrders && (
        <Card className="bg-(--color-card) border-(--color-header-border)">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Orders</CardTitle>
                <CardDescription>
                  Showing {paginatedOrders.length} of {filterOrders.length}{" "}
                  orders
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-(--color-header-border)">
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedOrders.length > 0 ? (
                    paginatedOrders.map((order: any) => {
                      const customerName = order.user.name || "Unknown";

                      return (
                        <TableRow
                          key={order._id}
                          className="border-(--color-header-border) hover:bg-(--color-surface-muted)"
                        >
                          <TableCell className="font-medium">
                            #{order._id.slice(0, 6)}
                          </TableCell>
                          <TableCell>{customerName}</TableCell>
                          <TableCell>{formatDate(order.createdAt)}</TableCell>
                          <TableCell>₹{order.totalAmount}</TableCell>
                          <TableCell>
                            <span
                              className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold uppercase ${getStatusColor(
                                order.status,
                              )}`}
                            >
                              {order.status === "processing" && (
                                <Package size={12} />
                              )}
                              {order.status === "shipped" && (
                                <Truck size={12} />
                              )}
                              {order.status === "delivered" && (
                                <CircleCheckBig size={12} />
                              )}
                              {order.status}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span
                              className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase ${getPaymentColor(
                                order.paymentStatus || "pending",
                              )}`}
                            >
                              {order.paymentStatus || "pending"}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => openDialog("detail", order)}
                                className="rounded p-1 hover:bg-(--color-surface-muted)"
                                title="View Details"
                              >
                                <Eye
                                  size={18}
                                  className="text-(--color-primary)"
                                />
                              </button>
                              <button
                                onClick={() => openDialog("edit", order)}
                                className="rounded p-1 hover:bg-(--color-surface-muted)"
                                title="Edit Order"
                              >
                                <Edit
                                  size={18}
                                  className="text-(--color-accent-yellow)"
                                />
                              </button>
                              <button
                                onClick={() => openDialog("paySeller", order)}
                                className="rounded p-1 hover:bg-(--color-surface-muted)"
                                title="Process Seller Payment"
                              >
                                <DollarSign
                                  size={18}
                                  className="text-(--color-primary)"
                                />
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
                        className="h-24 text-center text-(--color-text-muted)"
                      >
                        No orders found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="mt-6 flex items-center justify-between">
              <p className="text-sm text-(--color-text-muted)">
                Page {currentPage} of {totalPages || 1}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="border-(--color-header-border)"
                >
                  <ChevronLeft size={16} />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="border-(--color-header-border)"
                >
                  <ChevronRight size={16} />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* View Detail Dialog */}
      <Dialog open={dialogState === "detail"} onOpenChange={closeDialog}>
        <DialogContent className="sm:max-w-2xl max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-(--color-button-yellow-hover) text-xl font-semibold">
              Order Details
            </DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              {/* Order Status */}
              <Card className="bg-(--color-surface-soft) gap-2 p-4">
                <CardTitle className="text-lg p-0 text-(--color-button-yellow-hover)">
                  Order Status
                </CardTitle>
                <CardContent className="flex items-center justify-between p-0 text-(--color-text-muted) mt-4">
                  <div
                    className={`flex flex-col items-center gap-1 ${
                      selectedOrder?.status === "processing" && "text-blue-700"
                    }`}
                  >
                    <span
                      className={`rounded-full ${
                        selectedOrder?.status === "processing"
                          ? "bg-(--color-surface-muted)"
                          : "bg-(--color-surface-soft)"
                      } p-2`}
                    >
                      <Package size={22} />
                    </span>
                    <span className="text-xs font-medium">Processing</span>
                  </div>
                  <div className="h-1 flex-1 bg-gray-300"></div>
                  <div
                    className={`flex flex-col items-center gap-1 ${
                      selectedOrder?.status === "shipped" && "text-blue-700"
                    }`}
                  >
                    <span
                      className={`rounded-full ${
                        selectedOrder?.status === "shipped"
                          ? "bg-(--color-surface-muted)"
                          : "bg-(--color-surface-soft)"
                      } p-2`}
                    >
                      <Truck size={22} />
                    </span>
                    <span className="text-xs font-medium">Shipped</span>
                  </div>
                  <div className="h-1 flex-1 bg-gray-300"></div>
                  <div
                    className={`flex flex-col items-center gap-1 ${
                      selectedOrder?.status === "delivered" && "text-blue-700"
                    }`}
                  >
                    <span
                      className={`rounded-full ${
                        selectedOrder?.status === "delivered"
                          ? "bg-(--color-surface-muted)"
                          : "bg-(--color-surface-soft)"
                      } p-2`}
                    >
                      <CircleCheckBig size={22} />
                    </span>
                    <span className="text-xs font-medium">Delivered</span>
                  </div>
                </CardContent>
              </Card>

              {/* Items */}
              <Card className="bg-(--color-surface-soft) gap-2 p-4">
                <CardTitle className="text-lg p-0 text-(--color-button-yellow-hover)">
                  Items
                </CardTitle>
                <CardContent className="flex flex-col gap-4 justify-between p-0 mt-4">
                  {selectedOrder?.items.map((item: any, index: number) => (
                    <Link key={index} href={`/books/${item.product._id}`}>
                      <div className="flex items-center gap-4 rounded-md hover:bg-(--color-surface-muted) p-2">
                        <img
                          src={item.product.images[0]}
                          alt="orderImage"
                          className="w-24 h-26 object-cover rounded"
                        />
                        <div className="flex flex-col">
                          <h1 className="font-medium text-lg">
                            {item.product.title}
                          </h1>
                          <div className="flex gap-4 items-center">
                            <h3 className="font-medium">
                              {item.product.subject}
                            </h3>
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

              {/* Shipping Address */}
              <Card className="bg-(--color-surface-soft) gap-2 p-4">
                <CardTitle className="text-lg p-0 text-(--color-accent-yellow)">
                  Shipping Address
                </CardTitle>
                <CardContent className="flex flex-col justify-between p-0 mt-4">
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
                    <div>Shipping Address not added yet.</div>
                  )}
                </CardContent>
              </Card>

              {/* Order Summary */}
              <Card className="bg-(--color-accent-yellow) gap-2 p-4">
                <CardTitle className="text-lg p-0 text-black">
                  Order Summary
                </CardTitle>
                <CardContent className="flex flex-col gap-2 p-0 mt-4 text-black">
                  <div>Order ID: {selectedOrder?._id}</div>
                  <div>
                    Payment ID:{" "}
                    {selectedOrder?.paymentDetail?.razorpay_payment_id}
                  </div>
                  <div>Amount: ₹{selectedOrder?.totalAmount}</div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Order Dialog */}
      <Dialog open={dialogState === "edit"} onOpenChange={closeDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Order</DialogTitle>
            <DialogDescription>
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
                <div className="space-y-2">
                  <label className="text-sm font-medium">Order Status</label>
                  <Controller
                    name="status"
                    control={editOrderForm.control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="bg-white border border-gray-300">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
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
                <div className="space-y-2">
                  <label className="text-sm font-medium">Payment Status</label>
                  <Controller
                    name="paymentStatus"
                    control={editOrderForm.control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="bg-white border border-gray-300">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="failed">Failed</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                {/* Notes */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Notes (Optional)
                  </label>
                  <Textarea
                    placeholder="Add any notes about this order..."
                    {...editOrderForm.register("notes")}
                    className="bg-white border border-gray-300 resize-none"
                    rows={4}
                  />
                </div>

                {/* Buttons */}
                <div className="flex gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={closeDialog}
                    className="flex-1 border-(--color-header-border)"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-(--color-accent-yellow) text-black hover:bg-(--color-button-yellow-hover)"
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
        <DialogContent className="sm:max-w-md max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Process Seller Payment</DialogTitle>
            <DialogDescription>
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
                <div className="space-y-2">
                  <label className="text-sm font-medium">Select Product</label>
                  <Controller
                    name="product"
                    control={paySellerForm.control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={(value) => {
                          // 1. Update the form field value
                          field.onChange(value);

                          // 2. Find the full product object from your items list
                          const chosenItem = selectedOrder?.items.find(
                            (item: any) => item.product._id === value,
                          );

                          // 3. Save the product to your useState variable
                          if (chosenItem) {
                            setSelectedProduct(chosenItem.product);
                          }

                          paySellerForm.setValue(
                            "paymentMethod",
                            chosenItem.product.paymentMethod || "upi",
                          );
                          paySellerForm.setValue(
                            "amount",
                            chosenItem.product.finalPrice,
                          );
                        }}
                      >
                        <SelectTrigger className="bg-white border border-gray-300">
                          <SelectValue placeholder="Select product" />
                        </SelectTrigger>
                        <SelectContent>
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
                  <Card className="bg-(--color-surface-soft) p-4">
                    <CardTitle className="text-sm">
                      Seller Information
                    </CardTitle>
                    {selectedOrder && selectedOrder?.items && (
                      <div className="space-y-2 text-sm text-(--color-text-muted)">
                        <div>
                          <span className="font-medium">Name:</span>{" "}
                          {selectedProduct.seller.name}
                        </div>
                        <div>
                          <span className="font-medium">Email:</span>{" "}
                          {selectedProduct.seller.email}
                        </div>
                        <div>
                          <span className="font-medium">Phone:</span>{" "}
                          {selectedProduct.seller.phoneNumber}
                        </div>
                        <div>
                          <span className="font-medium">UPI ID:</span>{" "}
                          {selectedProduct?.paymentDetails?.UpiId ||
                            selectedProduct?.paymentDetails?.bankDetails}
                        </div>
                      </div>
                    )}
                  </Card>
                )}

                {/* Payment Method */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Payment Method</label>
                  <Controller
                    name="paymentMethod"
                    control={paySellerForm.control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="bg-white border border-gray-300">
                          <SelectValue placeholder="Select method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="upi">UPI</SelectItem>
                          <SelectItem value="bank">Bank Account</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                {/* Amount */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Amount</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-(--color-text-muted)">
                      ₹
                    </span>
                    <Input
                      type="number"
                      placeholder="0"
                      {...paySellerForm.register("amount")}
                      className="bg-white border border-gray-300 pl-8"
                    />
                  </div>
                </div>

                {/* Notes */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Notes (Optional)
                  </label>
                  <Textarea
                    placeholder="Add any notes..."
                    {...paySellerForm.register("notes")}
                    className="bg-white border border-gray-300 resize-none"
                    rows={3}
                  />
                </div>

                {/* Buttons */}
                <div className="flex gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={closeDialog}
                    className="flex-1 border-(--color-header-border)"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-(--color-accent-yellow) text-black hover:bg-(--color-button-yellow-hover)"
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
