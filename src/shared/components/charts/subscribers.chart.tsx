"use client";

import useSubscribersAnalytics from "@/shared/hooks/useSubscribersAnalytics";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface SubscribersAnalyticsData {
  month: string;
  count: number;
}

const SubscribersChart = () => {
  const { subscribersData, loading } = useSubscribersAnalytics();

  // Convert and clean data
  let rawData: SubscribersAnalyticsData[] =
    subscribersData?.last7Months?.map((item: { month: string; count: string }) => ({
      month: item.month,
      count: parseInt(item.count, 10),
    })) || [];

  // Skip leading zero-count months
  const firstNonZeroIndex = rawData.findIndex((d) => d.count > 0);
  const data = firstNonZeroIndex >= 0 ? rawData.slice(firstNonZeroIndex) : [];

  return (
    <div className="my-6 px-4 py-5 border rounded-lg bg-white w-full shadow-sm">
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-lg font-semibold text-gray-800">Active Subscribers</h3>
        <div className="flex items-center mt-2 sm:mt-0">
          <span className="inline-block w-2 h-2 rounded-full bg-[#B91C1C] mr-2" />
          <span className="text-sm text-gray-600">Subscribers</span>
        </div>
      </div>

      <p className="text-sm text-gray-500 mb-3">Shows all active subscribers over the past months</p>

      {loading ? (
        <div className="h-56 flex items-center justify-center text-gray-500">
          Loading chart...
        </div>
      ) : data.length === 0 ? (
        <div className="h-56 flex items-center justify-center text-gray-400">
          No subscriber data available.
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#B91C1C" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default SubscribersChart;


// "use client";

// import useSubscribersAnalytics from "@/shared/hooks/useSubscribersAnalytics";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   Legend,
// } from "recharts";

// interface SubscribersAnalyticsData {
//   month: string;
//   count: number; // Ensure count is a number
// }

// const SubscribersChart = () => {
//   const { subscribersData, loading } = useSubscribersAnalytics();

//   const data: SubscribersAnalyticsData[] =
//     subscribersData?.last7Months?.map((item: { month: string; count: string }) => ({
//       month: item?.month,
//       count: parseInt(item?.count, 10), // Convert to integer
//     })) || [];

//   return (
//     <div className="my-5 p-5 border rounded bg-white w-full md:h-[55vh] xl:h-[60vh]">
//       <div className="w-full flex">
//         <h3 className="font-medium">Active Subscribers</h3>
//       </div>
//       <div className="flex w-full items-center justify-between">
//         <p className="opacity-[.5]">Shows all active subscribers</p>
//         <div className="flex items-center">
//           <div className="w-2 h-2 rounded-full bg-[#B91C1C]" />
//           <span className="pl-2 text-sm opacity-[.7]">Subscribers</span>
//         </div>
//       </div>
//       {loading ? (
//         <div className="h-[85%] flex items-center justify-center w-full">
//           <h5>Loading...</h5>
//         </div>
//       ) : (
//         <ResponsiveContainer width="100%" height="85%" className="mt-5">
//           <BarChart
//             data={data}
//             margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
//           >
//             <CartesianGrid strokeDasharray="2" />
//             <XAxis dataKey="month" />
//             <YAxis allowDecimals={false} /> 
//             <Tooltip />
//             <Legend />
//             <Bar dataKey="count" fill="#B91C1C" />
//           </BarChart>

//         </ResponsiveContainer>
//       )}
//     </div>
//   );
// };

// export default SubscribersChart;
