

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
import { useEffect, useState } from "react";

interface ChartData {
  monthName: string;
  Subscribed: number;
  Unsubscribed: number;
  month: string;
}

const SubscribersChart = () => {
  const { subscribersData, loading } = useSubscribersAnalytics();
  const [processedData, setProcessedData] = useState<ChartData[]>([]);

  console.log(subscribersData, 'sub data cart')

  useEffect(() => {
    if (subscribersData?.last7Months) {
      const rawData: ChartData[] = subscribersData.last7Months.map(
        (item: {
          month: string;
          counts: { Subscribed?: number; Unsubscribed?: number };
        }) => {
          const date = new Date(item.month);
          const monthName = date.toLocaleString("default", {
            month: "short",
            year: "2-digit",
          });

          return {
            month: item.month,
            monthName,
            Subscribed: item.counts?.Subscribed || 0,
            Unsubscribed: item.counts?.Unsubscribed || 0,
          };
        }
      );

      setProcessedData(rawData);
    }
  }, [subscribersData]);

  return (
    <div className="my-6 px-4 py-5 border rounded-lg bg-white w-full shadow-sm">
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800">
          Subscriber Analytics
        </h3>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span className="inline-block w-3 h-3 rounded-full bg-[#16A34A] mr-1" />
          Subscribed
          <span className="inline-block w-3 h-3 rounded-full bg-[#EF4444] ml-4 mr-1" />
          Unsubscribed
        </div>
      </div>

      <p className="text-sm text-gray-500 mb-3">
        Showing last 7 months of subscriber activity...
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
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="monthName" />
            <YAxis allowDecimals={false} />
            <Tooltip
              formatter={(value, name) => [`${value}`, name]}
              labelFormatter={(label) => {
                const dataPoint = processedData.find(d => d.monthName === label);
                if (!dataPoint) return label;
                const date = new Date(dataPoint.month);
                return date.toLocaleString("default", { month: "long", year: "numeric" });
              }}
            />
            <Legend />
            <Bar dataKey="Subscribed" name="Subscribed" fill="#16A34A" barSize={20} />
            <Bar dataKey="Unsubscribed" name="Unsubscribed" fill="#EF4444" barSize={20} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default SubscribersChart;



