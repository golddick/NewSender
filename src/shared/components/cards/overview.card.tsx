"use client";

import useSubscribersAnalytics from "@/shared/hooks/useSubscribersAnalytics";
import useEmailAnalytics from "@/shared/hooks/useEmailAnalytics";
import { ICONS } from "@/shared/utils/icons";

const DashboardOverViewCard = () => {
  const { subscribersData, loading: loadingSubs } = useSubscribersAnalytics();
  const { analytics, loading: loadingEmails } = useEmailAnalytics();

  // Subscribers data
  const lastMonthSubs = !loadingSubs && subscribersData?.last7Months?.slice(-1)[0];
  const prevMonthSubs = !loadingSubs && subscribersData?.last7Months?.slice(-2)[0];

  // Unsubscribers data
  const lastMonthUnsubs = lastMonthSubs?.counts?.Unsubscribed || 0;
  const prevMonthUnsubs = prevMonthSubs?.counts?.Unsubscribed || 0;

  // Calculate percentage changes
  const subsPercentageChange = prevMonthSubs?.counts?.Subscribed
    ? ((lastMonthSubs?.counts?.Subscribed - prevMonthSubs.counts.Subscribed) /
        prevMonthSubs.counts.Subscribed) *
      100
    : lastMonthSubs?.counts?.Subscribed ? 100 : 0;

  const unsubsPercentageChange = prevMonthUnsubs
    ? ((lastMonthUnsubs - prevMonthUnsubs) / prevMonthUnsubs) * 100
    : lastMonthUnsubs ? 100 : 0;

  return (
    <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 bg-white border rounded overflow-hidden w-full">
      {/* Subscribers Card */}
      <div className="w-full border-b md:border-b-0 md:border-r p-2 lg:p-2">
        <h5 className="text-base font-semibold truncate md:max-w-[150px] lg:max-w-full">Subscribers</h5>
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          <span className="text-xl font-medium">
            {loadingSubs ? "..." : lastMonthSubs?.counts?.Subscribed || 0}
          </span>
          <div
            className={` flex items-center px-2 py-1 rounded-full text-sm ${
              subsPercentageChange >= 0
                ? "bg-[#DCFCE6] text-[#21C55D]"
                : "bg-[#FEE2E2] text-[#DC2626]"
            }`}
          >
            {subsPercentageChange >= 0 ? ICONS.topArrow : ICONS.bottomArrow}
            <span className="pl-1">{Math.abs(subsPercentageChange).toFixed(1)}%</span>
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          from. {prevMonthSubs?.counts?.Subscribed || 0} (last 4 weeks)
        </p>
      </div>

      {/* Unsubscribers Card */}
      <div className="w-full border-b md:border-b-0 md:border-r p-2  lg:p-2">
        <h5 className="text-base font-semibold truncate md:max-w-[150px] lg:max-w-full">Unsubscribers</h5>
        <div className="flex items-center gap-2 flex-wrap mt-2">
          <span className="text-xl font-medium">
            {loadingSubs ? "..." : lastMonthUnsubs}
          </span>
          <div
            className={`flex items-center px-2 py-1 rounded-full text-sm ${
              unsubsPercentageChange <= 0
                ? "bg-[#DCFCE6] text-[#21C55D]"
                : "bg-[#FEE2E2] text-[#DC2626]"
            }`}
          >
            {unsubsPercentageChange <= 0 ? ICONS.topArrow : ICONS.bottomArrow}
            <span className="pl-1">{Math.abs(unsubsPercentageChange).toFixed(1)}%</span>
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          from {prevMonthUnsubs} (last 4 weeks)
        </p>
      </div>

      {/* Open Rate Card */}
      <div className="w-full border-b md:border-b-0 md:border-r p-2 lg:p-2">
        <h5 className="text-base font-semibold truncate md:max-w-[150px] lg:max-w-full">Open Rate</h5>
        <div className="flex items-center gap-2 flex-wrap mt-2">
          <span className="text-xl font-medium">
            {loadingEmails ? "..." : `${analytics.opened} / ${analytics.total}`}
          </span>
          <div className="flex items-center px-3 py-1 bg-gray-100 rounded-full text-sm ">
            {loadingEmails ? "..." : `${analytics.openRate}%`}
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          from {analytics.total} emails (last 4 weeks)
        </p>
      </div>

      {/* Click Rate Card */}
      <div className="w-full p-2 lg:p-2">
        <h5 className="text-base font-semibold truncate md:max-w-[150px] lg:max-w-full">Click Rate</h5>
        <div className="flex items-center gap-2 flex-wrap mt-2">
          <span className="text-xl font-medium">
            {loadingEmails ? "..." : `${analytics.clicked} / ${analytics.total}`}
          </span>
          <div className="flex items-center px-3 py-1 bg-gray-100 rounded-full text-sm">
            {loadingEmails ? "..." : `${analytics.clickRate}%`}
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          from {analytics.total} emails (last 4 weeks)
        </p>
      </div>
    </div>
  );
};

export default DashboardOverViewCard;