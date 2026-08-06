"use client";

import { IOrder } from "@/store/slice/adminSlice";
import { RootState } from "@/store/store";
import {
  BookOpen,
  IndianRupee,
  ShoppingBagIcon,
  TrendingUp,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  PieLabelRenderProps,
  PieSectorShapeProps,
  ResponsiveContainer,
  Sector,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// ─── Types ──────────────────────────────────────────────────────────────────

interface ISalesData {
  month: string;
  sales: number;
}

interface IOrderStatusData {
  label: string;
  value: number;
  color: string;
}

// ─── Static stat card definitions (values injected from dashboardCount) ──────

const stats = [
  {
    title: "Total Orders",
    value: "38",
    delta: "+12%",
    description: "from last month",
    icon: ShoppingBagIcon,
    iconBg: "bg-[#ffd200]/20",
    iconColor: "text-[#725c00]",
  },
  {
    title: "Total Users",
    value: "53",
    delta: "+8%",
    description: "from last month",
    icon: Users,
    iconBg: "bg-[#e2dfe0]",
    iconColor: "text-[#636263]",
  },
  {
    title: "Total Products",
    value: "10",
    delta: "+5%",
    description: "from last month",
    icon: BookOpen,
    iconBg: "bg-[#e1e3e4]",
    iconColor: "text-on-surface-variant",
  },
  {
    title: "Total Revenue",
    value: "₹5,604",
    delta: "+15%",
    description: "from last month",
    icon: IndianRupee,
    iconBg: "bg-[#ffd200]/20",
    iconColor: "text-[#725c00]",
  },
];

// ─── Pie chart colors matching Stitch design ─────────────────────────────────

const PIE_COLORS = ["#725c00", "#53e16f", "#ecc200", "#ba1a1a"];

const RADIAN = Math.PI / 180;

// ─── Component ───────────────────────────────────────────────────────────────

export default function AdminDashboardPage() {
  const dashboardData = useSelector((state: RootState) => state.admin);
  const [dashboardCount, setDashboardCount] = useState<number[]>([]);
  const [salesData, setSalesData] = useState<ISalesData[]>([]);
  const [orderStatus, setOrderStatus] = useState<IOrderStatusData[]>([]);

  // ── Derived counts ──────────────────────────────────────────────────────
  useEffect(() => {
    if (
      !dashboardData ||
      !dashboardData.order ||
      !dashboardData.totalProducts ||
      !dashboardData.totalUser
    )
      return;
    const dashboardCount = [
      dashboardData.order?.length,
      dashboardData.totalUser,
      dashboardData.totalProducts,
      dashboardData.order?.reduce((sum, order) => {
        return sum + order.totalAmount;
      }, 0),
    ];

    setDashboardCount(dashboardCount);
  }, [dashboardData]);

  // ── Sales chart data ────────────────────────────────────────────────────
  const formatSalesData = (orders: IOrder[]) => {
    const salesMap: Record<string, number> = {};
    orders.forEach((order) => {
      if (order.paymentStatus === "complete") {
        const date = new Date(order.createdAt);
        const monthYear = date.toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        });
        salesMap[monthYear] = (salesMap[monthYear] || 0) + order.totalAmount;
      }
    });
    return Object.entries(salesMap).map(([month, sales]) => ({
      month,
      sales,
    }));
  };

  // ── Order status pie data ───────────────────────────────────────────────
  const formatOrderStatusData = (orders: IOrder[]): IOrderStatusData[] => {
    const totalOrders = orders.length;
    const counts = {
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
    };
    orders.forEach((order) => {
      const status = order.status?.toLowerCase();
      if (status in counts) {
        counts[status as keyof typeof counts]++;
      }
    });
    const getPercentage = (count: number) => {
      if (totalOrders === 0) return 0;
      return Math.round((count / totalOrders) * 100);
    };
    return [
      {
        label: "Processing",
        value: getPercentage(counts.processing),
        color: "bg-(--color-accent-yellow)",
      },
      {
        label: "Shipped",
        value: getPercentage(counts.shipped),
        color: "bg-(--color-primary)",
      },
      {
        label: "Delivered",
        value: getPercentage(counts.delivered),
        color: "bg-(--color-accent-yellow)/50",
      },
      {
        label: "Cancelled",
        value: getPercentage(counts.cancelled),
        color: "bg-(--color-danger)",
      },
    ];
  };

  useEffect(() => {
    if (dashboardData?.order) {
      const salesDataResult = formatSalesData(dashboardData.order);
      const orderStatusResult = formatOrderStatusData(dashboardData.order);
      setSalesData(salesDataResult);
      setOrderStatus(orderStatusResult);
    }
  }, [dashboardData.order]);

  // ── Custom pie label ────────────────────────────────────────────────────
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    name,
    index,
  }: PieLabelRenderProps & { name?: string; index: number }) => {
    if (
      cx == null ||
      cy == null ||
      innerRadius == null ||
      outerRadius == null
    ) {
      return null;
    }
    if (!percent) return null;

    const ncx = Number(cx);
    const ncy = Number(cy);
    const nOuterRadius = Number(outerRadius);
    const angle = midAngle ?? 0;

    const outerLabelRadius = nOuterRadius + 30;
    const x = ncx + outerLabelRadius * Math.cos(-angle * RADIAN);
    const y = ncy + outerLabelRadius * Math.sin(-angle * RADIAN);

    const lineStartRadius = nOuterRadius + 5;
    const lx1 = ncx + lineStartRadius * Math.cos(-angle * RADIAN);
    const ly1 = ncy + lineStartRadius * Math.sin(-angle * RADIAN);

    const lineEndRadius = nOuterRadius + 22;
    const lx2 = ncx + lineEndRadius * Math.cos(-angle * RADIAN);
    const ly2 = ncy + lineEndRadius * Math.sin(-angle * RADIAN);

    const sliceColor = PIE_COLORS[index % PIE_COLORS.length];
    const isRightSide = x > ncx;

    return (
      <g>
        <line
          x1={lx1}
          y1={ly1}
          x2={lx2}
          y2={ly2}
          stroke={sliceColor}
          strokeWidth={1.5}
        />
        <text
          x={x}
          y={y}
          fill={sliceColor}
          textAnchor={isRightSide ? "start" : "end"}
          dominantBaseline="central"
          fontSize="12px"
          fontWeight="600"
        >
          {`${name}: ${((percent ?? 1) * 100).toFixed(0)}%`}
        </text>
      </g>
    );
  };

  const MyCustomPie = (props: PieSectorShapeProps) => {
    return (
      <Sector {...props} fill={PIE_COLORS[props.index % PIE_COLORS.length]} />
    );
  };

  // ── Status badge colour helper ──────────────────────────────────────────
  const getStatusStyle = (status: string) => {
    switch (status?.toLowerCase()) {
      case "processing":
        return "bg-[#fff8dc] text-[#705b00] border border-[#ffd200]/40";
      case "shipped":
        return "bg-[#e8fdf0] text-tertiary border border-[#64f17d]/40";
      case "delivered":
        return "bg-[#d4f8e8] text-[#00531c] border border-[#53e16f]/40";
      case "cancelled":
        return "bg-[#ffdad6] text-[#93000a] border border-[#ba1a1a]/30";
      default:
        return "bg-surface-container text-on-surface-variant border border-outline-variant/40";
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full">

      {/* ── Stats Cards ──────────────────────────────────────────────────── */}
      <section
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        aria-label="Key metrics"
      >
        {stats.map((item, index) => {
          const Icon = item.icon;
          const rawValue = dashboardCount[index];
          const displayValue =
            rawValue !== undefined
              ? index === 3
                ? `₹${rawValue.toLocaleString("en-IN")}`
                : rawValue.toLocaleString("en-IN")
              : item.value;

          return (
            <div
              key={item.title}
              className="bg-white rounded-xl p-6 border border-outline-variant shadow-sm hover:-translate-y-1 transition-transform duration-200"
            >
              {/* Icon + Trend Row */}
              <div className="flex items-start justify-between mb-3">
                <div
                  className={`w-10 h-10 rounded-full ${item.iconBg} flex items-center justify-center ${item.iconColor}`}
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <span className="flex items-center gap-1 text-tertiary text-xs font-semibold">
                  <TrendingUp className="h-3.5 w-3.5" aria-hidden="true" />
                  {item.delta}
                </span>
              </div>

              {/* Label */}
              <p className="text-sm text-on-surface-variant mb-1">{item.title}</p>

              {/* Value */}
              <p className="text-4xl font-bold text-[#191c1d] leading-tight">
                {displayValue}
              </p>

              {/* Subtitle */}
              <p className="text-xs text-on-surface-variant mt-2 font-medium tracking-wide uppercase">
                {item.description}
              </p>
            </div>
          );
        })}
      </section>

      {/* ── Analytics Row ────────────────────────────────────────────────── */}
      <section
        className="grid grid-cols-1 lg:grid-cols-3 gap-4"
        aria-label="Analytics charts"
      >
        {/* Monthly Sales Bar Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-outline-variant shadow-sm flex flex-col min-h-80">
          <h2 className="text-xl font-semibold text-[#191c1d] mb-6">
            Monthly Sales
          </h2>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart
                data={salesData}
                margin={{ top: 4, right: 8, left: 0, bottom: 0 }}
              >
                <CartesianGrid
                  stroke="#d1c6ab"
                  strokeDasharray="4 4"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  tick={{ fill: "#4d4632", fontSize: 12 }}
                  axisLine={{ stroke: "#d1c6ab" }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#4d4632", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #d1c6ab",
                    borderRadius: "8px",
                    fontSize: "13px",
                    color: "#191c1d",
                  }}
                  cursor={{ fill: "#ffd200", opacity: 0.15 }}
                />
                <Legend
                  wrapperStyle={{ fontSize: "12px", color: "#4d4632" }}
                />
                <Bar
                  dataKey="sales"
                  name="Sales"
                  fill="#ecc200"
                  radius={[4, 4, 0, 0]}
                  barSize={32}
                  isAnimationActive={true}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Order Status Pie Chart */}
        <div className="bg-white rounded-xl p-6 border border-outline-variant shadow-sm flex flex-col items-center justify-center min-h-80">
          <h2 className="text-xl font-semibold text-[#191c1d] mb-4 self-start">
            Order Status
          </h2>
          <div
            className="w-full flex-1"
            style={{ minHeight: 200 }}
          >
            <PieChart
              className="[&_.recharts-surface]:overflow-visible [&_.recharts-wrapper]:overflow-visible"
              style={{
                width: "100%",
                maxWidth: 360,
                margin: "0 auto",
                aspectRatio: 1,
              }}
              margin={{ top: 16, right: 48, bottom: 16, left: 48 }}
            >
              <Pie
                data={orderStatus}
                labelLine={false}
                outerRadius="60%"
                nameKey="label"
                label={renderCustomizedLabel}
                fill="#8884d8"
                dataKey="value"
                isAnimationActive={true}
                shape={MyCustomPie}
              >
                {orderStatus.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={PIE_COLORS[index % PIE_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #d1c6ab",
                  borderRadius: "8px",
                  fontSize: "13px",
                }}
                formatter={(value, name) => [
                  `${value}%`,
                  name,
                ]}
              />
            </PieChart>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap justify-center gap-3 mt-4">
            {(
              [
                { label: "Processing", color: PIE_COLORS[0] },
                { label: "Shipped", color: PIE_COLORS[1] },
                { label: "Delivered", color: PIE_COLORS[2] },
                { label: "Cancelled", color: PIE_COLORS[3] },
              ] as const
            ).map((entry) => (
              <span
                key={entry.label}
                className="flex items-center gap-1.5 text-xs text-on-surface-variant"
              >
                <span
                  className="w-3 h-3 rounded-full inline-block shrink-0"
                  style={{ backgroundColor: entry.color }}
                />
                {entry.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Recent Orders Table ──────────────────────────────────────────── */}
      <section
        className="bg-white rounded-xl border border-outline-variant shadow-sm overflow-hidden mb-8"
        aria-label="Recent orders"
      >
        <div className="px-6 py-5 border-b border-outline-variant">
          <h2 className="text-xl font-semibold text-[#191c1d]">
            Recent Orders
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-150">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant">
                <th className="px-6 py-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {dashboardData?.order &&
                dashboardData.order.map((order) => (
                  <tr
                    key={order._id}
                    className="hover:bg-surface-container transition-colors duration-150"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-[#191c1d]">
                      #{order._id?.slice(0, 5)}
                    </td>
                    <td className="px-6 py-4 text-sm text-on-surface-variant whitespace-nowrap">
                      {order.user.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-on-surface-variant">
                      {new Date(order.createdAt).toLocaleDateString("en-GB")}
                    </td>
                    <td className="px-6 py-4 text-sm text-[#191c1d] font-semibold">
                      ₹{order.totalAmount.toLocaleString("en-IN")}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider ${getStatusStyle(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
