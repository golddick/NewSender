// src/shared/hooks/useEmailAnalytics.ts
import { useEffect, useState } from "react";
import { getEmailTrendsByDate } from "@/actions/get.email.trends";

export default function useEmailAnalytics() {
  const [analytics, setAnalytics] = useState({
    openRate: 0,
    clickRate: 0,
    total: 0,
    opened: 0,
    clicked: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      const trends = await getEmailTrendsByDate();

      const total = trends.reduce((acc, curr) => acc + curr.total, 0);
      const opened = trends.reduce((acc, curr) => acc + curr.opened, 0);
      const clicked = trends.reduce((acc, curr) => acc + curr.clicked, 0);

      setAnalytics({
        total,
        opened,
        clicked,
        openRate: total ? parseFloat(((opened / total) * 100).toFixed(2)) : 0,
        clickRate: total
          ? parseFloat(((clicked / total) * 100).toFixed(2))
          : 0,
      });

      setLoading(false);
    };

    fetchAnalytics();
  }, []);

  return { analytics, loading };
}
