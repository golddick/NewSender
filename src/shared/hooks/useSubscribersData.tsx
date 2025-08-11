"use client";

import { useState, useEffect } from "react";
import type { Subscriber } from "@prisma/client"; 
import { useUser } from "@clerk/nextjs";
import { getSubscribers } from "@/actions/subscriber/get.subscribers";

export default function useSubscribersData() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);

  const { user } = useUser();
  const newsLetterOwnerId = user?.id;

  useEffect(() => {
    if (!newsLetterOwnerId) return;

    const fetchSubscribers = async () => {
      try {
        setLoading(true);
        const res = await getSubscribers();

        if (res.error) {
          throw new Error(res.error);
        }

        setSubscribers(res.subscribers || []);
      } catch (error) {
        console.error("Error fetching subscribers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscribers();
  }, [newsLetterOwnerId]);

  return { subscribers, loading };
}
