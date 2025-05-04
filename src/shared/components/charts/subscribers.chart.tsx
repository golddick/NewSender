// "use client";
// import { subscribersAnalytics } from "@/actions/subscribers.analytics";
// import useSubscribersAnalytics from "@/shared/hooks/useSubscribersAnalytics";
// import { useEffect, useState } from "react";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
// } from "recharts";

// interface subscribersAnalyticsData {
//   month: string;
//   count: string;
// }

// const SubscribersChart = () => {
//   const { subscribersData, loading } = useSubscribersAnalytics();

//   const data: subscribersAnalyticsData[] = [];

//   subscribersData &&
//     subscribersData?.last7Months?.forEach((item: subscribersAnalyticsData) => {
//       data.push({
//         month: item?.month,
//         count: item?.count,
//       });
//     });

//   return (
//     <div className="my-5 p-5 border rounded bg-white w-full md:h-[55vh] xl:h-[60vh]">
//       <div className="w-full flex">
//         <h3 className="font-medium">Active Subscribers</h3>
//       </div>
//       <div className="flex w-full items-center justify-between">
//         <p className="opacity-[.5]">Shows all active subscribers</p>
//         <div className="flex items-center">
//           <div className="w-2 h-2 rounded-full bg-[#EB4898]" />
//           <span className="pl-2 text-sm opacity-[.7]">Subscribers</span>
//         </div>
//       </div>
//       {loading ? (
//         <div className="h-[85%] flex items-center justify-center w-full">
//           <h5>Loading...</h5>
//         </div>
//       ) : (
//         <ResponsiveContainer width="100%" height={"85%"} className={"mt-5"}>
//           <LineChart
//             width={500}
//             height={200}
//             data={data}
//             syncId="anyId"
//             margin={{
//               top: 10,
//               right: 30,
//               left: 0,
//               bottom: 0,
//             }}
//           >
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="month" />
//             <YAxis />
//             <Tooltip />
//             <Line
//               type="monotone"
//               dataKey="count"
//               stroke="#EB4898"
//               fill="#EB4898"
//             />
//           </LineChart>


          
//         </ResponsiveContainer>
//       )}
//     </div>
//   );
// };

// export default SubscribersChart;


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
  count: number; // Ensure count is a number
}

const SubscribersChart = () => {
  const { subscribersData, loading } = useSubscribersAnalytics();

  const data: SubscribersAnalyticsData[] =
    subscribersData?.last7Months?.map((item: { month: string; count: string }) => ({
      month: item?.month,
      count: parseInt(item?.count, 10), // Convert to integer
    })) || [];

  return (
    <div className="my-5 p-5 border rounded bg-white w-full md:h-[55vh] xl:h-[60vh]">
      <div className="w-full flex">
        <h3 className="font-medium">Active Subscribers</h3>
      </div>
      <div className="flex w-full items-center justify-between">
        <p className="opacity-[.5]">Shows all active subscribers</p>
        <div className="flex items-center">
          <div className="w-2 h-2 rounded-full bg-[#B91C1C]" />
          <span className="pl-2 text-sm opacity-[.7]">Subscribers</span>
        </div>
      </div>
      {loading ? (
        <div className="h-[85%] flex items-center justify-center w-full">
          <h5>Loading...</h5>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="85%" className="mt-5">
          <BarChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="2" />
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
