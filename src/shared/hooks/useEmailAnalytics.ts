


import { useEffect, useState } from "react";
import { getEmailTrendsByDate } from "@/actions/email/get.email.trends";
import { useClerk } from "@clerk/nextjs";
import { calculatePercentage } from "@/lib/utils";

export default function useEmailAnalytics() {
  const { user } = useClerk();

  const [analytics, setAnalytics] = useState({
    openRate: 0,
    clickRate: 0,
    total: 0,
    opened: 0,
    clicked: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if ( !user) return; 

    const fetchAnalytics = async () => {
      try {
        const trends = await getEmailTrendsByDate(user.id); 

        const total = trends.reduce((acc, curr) => acc + curr.total, 0);
        const opened = trends.reduce((acc, curr) => acc + curr.opened, 0);
        const clicked = trends.reduce((acc, curr) => acc + curr.clicked, 0);
        const openRate = calculatePercentage(opened, total);
        const clickRate = calculatePercentage(clicked, total);

        setAnalytics({
          total,
          opened,
          clicked,
          openRate,
          clickRate
          
          // openRate: total ? parseFloat(((opened / total) * 100).toFixed(2)) : 0,
          // clickRate: total ? parseFloat(((clicked / total) * 100).toFixed(2)) : 0,
        });
      } catch (error) {
        console.error("Error fetching email analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [ user]);

  return { analytics, loading };
}
