"use client";

import { useState, useEffect, useCallback } from "react";
import { useClerk } from "@clerk/nextjs";
import { getSubscribers } from "@/actions/subscriber/get.subscribers";
import { SubscriptionStatus } from "@prisma/client";

interface Subscriber {
  id: string;
  email: string;
  name: string | null;
  status: SubscriptionStatus,
  newsLetterOwnerId: string;
  createdAt: Date;
  updatedAt: Date;
  campaign: {
    id: string;
    name: string;
    trigger: string;
  } | null;
  integration: {
    id: string;
    name: string;
    logo: string | null;
    url: string | null;
  } | null;
}

interface SubscribersResponse {
  subscribers: Subscriber[] | null;
  error: string | null;
}

const useSubscribersData = () => {
  const [data, setData] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useClerk();

  const fetchSubscribers = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await getSubscribers();
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      setData(response.subscribers || []);
    } catch (err) {
      console.error("Error fetching subscribers:", err);
      setError(err instanceof Error ? err.message : 'Failed to fetch subscribers');
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchSubscribers();
  }, [fetchSubscribers]);

  return { 
    data, 
    loading, 
    error,
    refetch: fetchSubscribers 
  };
};

export default useSubscribersData;

