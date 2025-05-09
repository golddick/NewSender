"use client";
import useSubscribersAnalytics from "@/shared/hooks/useSubscribersAnalytics";
import useEmailAnalytics from "@/shared/hooks/useEmailAnalytics";
import { ICONS } from "@/shared/utils/icons";

const DashboardOverViewCard = () => {
  const { subscribersData, loading: loadingSubs } = useSubscribersAnalytics();
  const { analytics, loading: loadingEmails } = useEmailAnalytics();

  const lastMonthSubscribers =
    !loadingSubs &&
    subscribersData?.last7Months[subscribersData?.last7Months?.length - 1];

  const previousLastMonthSubscribers =
    !loadingSubs &&
    subscribersData?.last7Months[subscribersData?.last7Months?.length - 2];

  let comparePercentage = 0;
  if (previousLastMonthSubscribers?.count > 0) {
    comparePercentage =
      ((lastMonthSubscribers?.count - previousLastMonthSubscribers.count) /
        previousLastMonthSubscribers.count) *
      100;
  } else {
    comparePercentage = 100;
  }

  return (
    <div className="flex flex-wrap bg-white border rounded overflow-hidden w-full">
      {/* Card */}
      <div className="w-full md:w-1/3 border-b md:border-b-0 md:border-r p-5">
        <h5 className="text-base font-semibold">Subscribers</h5>
        <div className="flex items-center justify-between mt-2">
          <span className="text-xl font-medium">
            {loadingSubs ? "..." : lastMonthSubscribers?.count || 0}
          </span>
          <div className="flex items-center px-3 py-1 bg-[#DCFCE6] rounded-full text-[#21C55D] text-sm">
            {ICONS.topArrow}
            <span className="pl-1">{comparePercentage.toFixed(1)}%</span>
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          from {previousLastMonthSubscribers?.count || 0} (last 4 weeks)
        </p>
      </div>

      {/* Open Rate */}
      <div className="w-full md:w-1/3 border-b md:border-b-0 md:border-r p-5">
        <h5 className="text-base font-semibold">Open Rate</h5>
        <div className="flex items-center justify-between mt-2">
          <span className="text-xl font-medium">
            {loadingEmails ? "..." : `${analytics.opened} / ${analytics.total}`}
          </span>
          <div className="flex items-center px-3 py-1 bg-gray-100 rounded-full text-sm">
            {loadingEmails ? "..." : `${analytics.openRate}%`}
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          from {analytics.total} emails (last 4 weeks)
        </p>
      </div>

      {/* Click Rate */}
      <div className="w-full md:w-1/3 p-5">
        <h5 className="text-base font-semibold">Click Rate</h5>
        <div className="flex items-center justify-between mt-2">
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


