// "use client";

// import { getSubscribers } from "@/actions/get.subscribers";
// import { useClerk } from "@clerk/nextjs";
// import { useEffect, useState } from "react";

// const useSubscribersData = () => {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const { user } = useClerk();

//   useEffect(() => {
//     GetSubscribers();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [user]);

//   const GetSubscribers = async () => {
//     await getSubscribers({ newsLetterOwnerId: user?.id! })
//       .then((res: any) => {
//         setData(res);
//         console.log("Fetched Subscribers:", data); // Log fetched data
//         setLoading(false);
//       })
//       .catch((error) => {
//         setLoading(false);
//       });
//   };

//   return { data, loading };
// };

// export default useSubscribersData;



"use client";



import { useState, useEffect, useCallback } from "react";
import { getSubscribers } from "@/actions/get.subscribers";
import { useClerk } from "@clerk/nextjs";

const useSubscribersData = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useClerk();

  // Use useCallback to memoize the refetch function
  const refetch = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getSubscribers({ newsLetterOwnerId: user?.id! });
      setData(res);
    } catch (err) {
      console.error("Error fetching subscribers:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      refetch(); // Trigger fetch on user change or component mount
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, refetch]);

  return { data, loading, refetch };
};

export default useSubscribersData;
