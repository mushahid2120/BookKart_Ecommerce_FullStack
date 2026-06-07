"use client";
import { IOrder } from "@/store/slice/adminSlice";
import { RootState } from "@/store/store";
import { RechartsDevtools } from "@recharts/devtools";
import {
  BookOpen,
  IndianRupee,
  ShoppingBagIcon,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Pie,
  PieChart,
  PieLabelRenderProps,
  PieSectorShapeProps,
  Sector,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const margin = {
  top: 20,
  right: 0,
  left: 0,
  bottom: 0,
};

const stats = [
  {
    title: "Total Orders",
    value: "38",
    delta: "+12%",
    description: "from last month",
    icon: ShoppingBagIcon,
    color: "bg-(--color-primary)/10 text-(--color-primary)",
  },
  {
    title: "Total Users",
    value: "53",
    delta: "+8%",
    description: "from last month",
    icon: Users,
    color: "bg-(--color-accent-yellow)/10 text-(--color-accent-yellow)",
  },
  {
    title: "Total Products",
    value: "10",
    delta: "+5%",
    description: "from last month",
    icon: BookOpen,
    color: "bg-(--color-surface-muted)/10 text-(--color-surface-muted)",
  },
  {
    title: "Total Revenue",
    value: "₹5,604",
    delta: "+15%",
    description: "from last month",
    icon: IndianRupee,
    color: "bg-(--color-accent-yellow)/10 text-(--color-accent-yellow)",
  },
];





interface ISalesData{
  month:string;
  sales: number
}

interface IOrderStatusData {
  label: string;
  value: number;
  color: string;
}

export default function AdminDashboardPage() {
  const dashboardData = useSelector((state: RootState) => state.admin);
  const [dashboardCount, setDashboardCount] = useState<number[]>([]);
  const [salesData,setSalesData]=useState<ISalesData[]>([])
  const [orderStatus,setOrderStatus]=useState<IOrderStatusData[]>([])

  useEffect(() => {
    if(!dashboardData || !dashboardData.order || !dashboardData.totalProducts || !dashboardData.totalUser) return 
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

  const RADIAN = Math.PI / 180;
  const PIE_COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    name,
    index, // 1. Extract index to grab the correct color
  }: PieLabelRenderProps & { name?: string; index: number }) => {
    if (
      cx == null ||
      cy == null ||
      innerRadius == null ||
      outerRadius == null
    ) {
      return null;
    }

    // Skip rendering if percentage is 0% to prevent outside clutter
    if (!percent) return null;

    const ncx = Number(cx);
    const ncy = Number(cy);
    const nOuterRadius = Number(outerRadius);
    const angle = midAngle ?? 0;

    // 2. Position the label outside (add 30px padding past the outer radius)
    const outerLabelRadius = nOuterRadius + 30;
    const x = ncx + outerLabelRadius * Math.cos(-angle * RADIAN);
    const y = ncy + outerLabelRadius * Math.sin(-angle * RADIAN);

    // 3. Position coordinates for an optional anchor line starting point
    const lineStartRadius = nOuterRadius + 5;
    const lx1 = ncx + lineStartRadius * Math.cos(-angle * RADIAN);
    const ly1 = ncy + lineStartRadius * Math.sin(-angle * RADIAN);

    // Coordinate for line ending near text
    const lineEndRadius = nOuterRadius + 22;
    const lx2 = ncx + lineEndRadius * Math.cos(-angle * RADIAN);
    const ly2 = ncy + lineEndRadius * Math.sin(-angle * RADIAN);

    // 4. Resolve the matching hex color from your existing colors array
    const sliceColor = PIE_COLORS[index % PIE_COLORS.length];

    // Decide alignment: if text is on the right side, align 'start'. If left, align 'end'.
    const isRightSide = x > ncx;

    return (
      <g>
        {/* Visual connector line matching the slice color */}
        <line
          x1={lx1}
          y1={ly1}
          x2={lx2}
          y2={ly2}
          stroke={sliceColor}
          strokeWidth={1.5}
        />
        {/* Label text matching the slice color */}
        <text
          x={x}
          y={y}
          fill={sliceColor} // 5. Applied respective label color here
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

const formatSalesData = (orders:IOrder[]) => {
   const salesMap: Record<string, number> = {};
  orders.forEach(order => {
    // Only aggregate if payment is finalized and successful
    if (order.paymentStatus === "complete") {
      const date = new Date(order.createdAt);
      
      // Format to "MMM YYYY" (e.g., "May 2026")
      const monthYear = date.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric"
      });

      // Accumulate total amount
      salesMap[monthYear] = (salesMap[monthYear] || 0) + order.totalAmount;
    }
  });

  // Convert the aggregated object back into a structured array
  return Object.entries(salesMap).map(([month, sales]) => ({
    month,
    sales
  }));
};

useEffect(()=>{
  if(dashboardData?.order){
  const salesData = formatSalesData(dashboardData.order);
  const OrderStatusData=formatOrderStatusData(dashboardData.order)
  setSalesData(salesData)
  setOrderStatus(OrderStatusData)
  }
},[dashboardData.order])


const formatOrderStatusData = (orders: IOrder[]): IOrderStatusData[] => {
  const totalOrders = orders.length;

  // 1. Initialize our counters for each specific status
  const counts = {
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
  };

  // 2. Count the occurrences safely
  orders.forEach(order => {
    // Normalize string to lowercase to prevent casing mismatch bugs
    const status = order.status?.toLowerCase(); 
    if (status in counts) {
      counts[status as keyof typeof counts]++;
    }
  });

  // 3. Helper to safely calculate percentages without dividing by zero
  const getPercentage = (count: number) => {
    if (totalOrders === 0) return 0;
    return Math.round((count / totalOrders) * 100);
  };

  // 4. Return the structured UI data array with your custom Tailwind classes
  return [
    { 
      label: "Processing", 
      value: getPercentage(counts.processing), 
      color: "bg-(--color-accent-yellow)" 
    },
    { 
      label: "Shipped", 
      value: getPercentage(counts.shipped), 
      color: "bg-(--color-primary)" 
    },
    { 
      label: "Delivered", 
      value: getPercentage(counts.delivered), 
      color: "bg-(--color-accent-yellow)/50" 
    },
    { 
      label: "Cancelled", 
      value: getPercentage(counts.cancelled), 
      color: "bg-(--color-danger)" 
    },
  ];
};

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between"></div>

      <div className="grid  place-items-center  grid-cols-2 lg:grid-cols-3 xl:grid-cols-4  gap-2 ">
        {stats.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="rounded-3xl  bg-(--color-card) px-2 py-4 w-58  shadow-sm "
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-(--color-text-muted)">
                    {item.title}
                  </p>
                </div>
              </div>
              <div className=" gap-2 flex items-center justify-between text-sm text-(--color-text-muted)">
                <div className={`${item.color} rounded-2xl p-3`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="mt-3 text-3xl font-semibold">{dashboardCount[index]}</p>
                  <span>{item.delta}</span>
                  <span>{item.description}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <section className="rounded-3xl max-h-80 border border-(--color-header-border) bg-(--color-card) px-2 py-4 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <p className="text-md text-(--color-text-muted)">Monthly Sales</p>
          </div>

          <div className="flex items-center justify-center">
            <BarChart width={450} height={300} data={salesData} margin={margin}>
              <XAxis dataKey="month" stroke="#8884d8" />
              <YAxis />
              <Tooltip wrapperStyle={{ width: 100, backgroundColor: "#ccc" }} />
              <Legend
                width={100}
                wrapperStyle={{
                  bottom:20,
                  right: 0,
                  lineHeight: "40px",
                }}
              />
              <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
              <Bar dataKey="sales" fill="#8884d8" barSize={30} />
              <RechartsDevtools />
            </BarChart>
          </div>
        </section>

        <section className="rounded-3xl flex flex-col justify-center items-center max-h-80 border border-(--color-header-border) bg-(--color-card) p-6 shadow-sm">
          <PieChart
            // 1. Force the internal Recharts wrappers to allow visible overflowing text
            className="[&_.recharts-surface]:overflow-visible [&_.recharts-wrapper]:overflow-visible"
            style={{
              width: "100%",
              maxWidth: "400px",
              maxHeight: "50vh",
              aspectRatio: 1,
            }}
            // 2. Add an explicit margin to pad the interior boundaries for long labels
            margin={{ top: 20, right: 50, bottom: 20, left: 50 }}
            responsive
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
            />
            <RechartsDevtools />
          </PieChart>
          <div className="flex gap-4 items-center justify-center text-xs">
            <span className="flex justify-center items-center gap-1 text-[#0088FE]">
              <div className="w-3 h-3 bg-[#0088FE] rounded-full "></div>
              <p>Processing</p>
            </span>
            <span className="flex  justify-center items-center gap-1 text-[#00C49F]">
              <div className="w-3 h-3 bg-[#00C49F] rounded-full "></div>
              <p>Shipped</p>
            </span>
            <span className="flex  justify-center items-center gap-1 text-[#FFBB28]">
              <div className="w-3 h-3 bg-[#FFBB28] rounded-full "></div>
              <p>Delivered</p>
            </span>
            <span className="flex  justify-center items-center gap-1 text-[#FF8042]">
              <div className="w-3 h-3 bg-[#FF8042] rounded-full "></div>
              <p>Cancelled</p>
            </span>
          </div>
        </section>
      </div>

      <section className="rounded-3xl border border-(--color-header-border) bg-(--color-card) p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="mt-2 text-xl font-semibold">Recent Orders</h3>
          </div>
        </div>
        <div className="mt-2 max-h-80 overflow-x-auto">
          <table className="min-w-full divide-y divide-(--color-header-border)">
            <thead>
              <tr className="text-left text-sm uppercase text-(--color-text-muted)">
                <th className="py-3 pr-6">Order ID</th>
                <th className="py-3 pr-6">Customer</th>
                <th className="py-3 pr-6">Date</th>
                <th className="py-3 pr-6">Amount</th>
                <th className="py-3 pr-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-(--color-header-border)">
              {dashboardData?.order && dashboardData?.order.map((order) => (
                <tr key={order._id} className="hover:bg-(--color-surface-muted)">
                  <td className="py-4 pr-6 font-medium text-(--color-header-text)">
                    #{order._id?.slice(0,5)}
                  </td>
                  <td className="py-4 pr-6 text-(--color-text-muted)">
                    {order.user.name}
                  </td>
                  <td className="py-4 pr-6 text-(--color-text-muted)">
                    {new Date(order.createdAt).toLocaleDateString("en-GB")}
                  </td>
                  <td className="py-4 pr-6 text-(--color-text-muted)">
                    {order.totalAmount}
                  </td>
                  <td className="py-4 pr-6">
                    <span className="rounded-full bg-(--color-surface-muted) px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-(--color-header-text)">
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
