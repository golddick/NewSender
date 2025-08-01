// hooks/useSubscribers.ts
import { useState, useEffect } from 'react';
import { getSubscribers } from '@/actions/subscriber/get.subscribers';
import { SubscriptionStatus } from '@prisma/client';

interface Subscriber {
  id: string;
  email: string;
  name: string | null;
  source: string;
  status: SubscriptionStatus;
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
  pageUrl: string | null;
}

export const useSubscribers = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubscribers = async () => {
    try {
      setLoading(true);
      const result = await getSubscribers();
      if (result.error) throw new Error(result.error);

      console.log(result.subscribers, 'reseult severr')

      setSubscribers(result.subscribers || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load subscribers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  return { subscribers, loading, error, refetch: fetchSubscribers };
};