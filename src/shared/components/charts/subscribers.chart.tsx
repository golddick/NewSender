'use client';

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
import { useEffect, useState } from "react";

interface SubscribersAnalyticsData {
  month: string;
  count: number;
  monthName: string;
}

const SubscribersChart = () => {
  const { subscribersData, loading } = useSubscribersAnalytics();
  const [processedData, setProcessedData] = useState<SubscribersAnalyticsData[]>([]);

  useEffect(() => {
    if (subscribersData?.last7Months) {
      // Convert and clean data with proper month names
      let rawData: SubscribersAnalyticsData[] = subscribersData.last7Months.map(
        (item: { month: string; count: string }) => {
          const date = new Date(item.month);
          const monthName = date.toLocaleString('default', { month: 'short', year: '2-digit' });
          return {
            month: item.month,
            count: parseInt(item.count, 10),
            monthName: monthName
          };
        }
      );

      // Find the first month with subscribers
      const firstNonZeroIndex = rawData.findIndex((d) => d.count > 0);
      
      // Get the most recent 7 months from the first month with subscribers
      let slicedData = firstNonZeroIndex >= 0 
        ? rawData.slice(firstNonZeroIndex, firstNonZeroIndex + 7)
        : rawData.slice(0, 7);

      // If we have less than 7 months, generate empty months with real month names
      if (slicedData.length < 7) {
        const emptyMonths = [];
        const lastDate = slicedData.length > 0 
          ? new Date(slicedData[slicedData.length - 1].month) 
          : new Date();
        
        for (let i = slicedData.length; i < 7; i++) {
          const emptyDate = new Date(lastDate);
          emptyDate.setMonth(emptyDate.getMonth() + (i - slicedData.length + 1));
          const monthName = emptyDate.toLocaleString('default', { month: 'short', year: '2-digit' });
          
          emptyMonths.push({
            month: emptyDate.toISOString(),
            count: 0,
            monthName: monthName
          });
        }
        
        slicedData = [...slicedData, ...emptyMonths];
      }

      setProcessedData(slicedData);
    }
  }, [subscribersData]);

  return (
    <div className="my-6 px-4 py-5 border rounded-lg bg-white w-full shadow-sm">
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800">
          Active Subscribers
        </h3>
        <div className="flex items-center mt-2 sm:mt-0">
          <span className="inline-block w-2 h-2 rounded-full bg-[#B91C1C] mr-2" />
          <span className="text-sm text-gray-600">Subscribers</span>
        </div>
      </div>

      <p className="text-sm text-gray-500 mb-3">
        Showing last 7 months of subscriber activity from when subscriptions started.
      </p>

      {loading ? (
        <div className="h-56 flex items-center justify-center text-gray-500">
          Loading chart...
        </div>
      ) : processedData.length === 0 ? (
        <div className="h-56 flex items-center justify-center text-gray-400">
          No subscriber data available.
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={processedData}
            margin={{ top: 10, right: 20, left: 0, bottom: 20 }}
            barCategoryGap="20%"
            barGap={2}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="monthName" 
            />
            <YAxis allowDecimals={false} />
            <Tooltip 
              formatter={(value) => [`${value} subscribers`, 'Count']}
              labelFormatter={(label) => {
                const dataPoint = processedData.find(d => d.monthName === label);
                if (!dataPoint) return label;
                const date = new Date(dataPoint.month);
                return date.toLocaleString('default', { month: 'long', year: 'numeric' });
              }}
            />
            <Legend />
            <Bar 
              dataKey="count" 
              name="Subscribers"
              fill="#B91C1C" 
              barSize={30} 
            />
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
