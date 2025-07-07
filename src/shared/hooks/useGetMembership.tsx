'use client';

import { useEffect, useState } from "react";

export interface MembershipTypes {
  id: string;
  userId: string;
  plan: string;
  role: string;
  subscriptionStatus: string;
  paystackCustomerId: string;
  email: string;
  organization?: string | null;
  amount: number;
  currency: string;
  lastPaymentDate?: string;
  nextPaymentDate?: string;
  subscriberLimit: number;
  emailLimit: number;
  campaignLimit: number;
  appIntegratedLimit: number;
  termsAndConditionsAccepted: boolean;
}

const useGetMembership = () => {
  const [data, setData] = useState<MembershipTypes | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleGetMembership = async () => {
      try {
        const res = await fetch("/api/membership", { method: "GET" });
        if (!res.ok) throw new Error("Failed to fetch membership");
        const json = await res.json();
        if (!json) {
          setError("No membership found.");
        } else {
          setData(json);
        }
      } catch (err) {
        console.error("Failed to fetch membership:", err);
        setError("An error occurred while fetching membership.");
      } finally {
        setLoading(false);
      }
    };

    handleGetMembership();
  }, []);

  return { data, loading, error };
};

export default useGetMembership;
