
// "use client";



// import { useState, useEffect, useCallback } from "react";
// import { getAllSubscribers, getSubscribers } from "@/actions/get.subscribers";
// import { useClerk } from "@clerk/nextjs";

// const useGetAllSubscribersData = () => {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const { user } = useClerk();

//   // Use useCallback to memoize the refetch function
//   const refetch = useCallback(async () => {
//     setLoading(true);
//     try {
//       const res = await getAllSubscribers({ newsLetterOwnerId: user?.id! });
//       setData(res); 
//     } catch (err) {
//       console.error("Error fetching subscribers:", err);
//     } finally {
//       setLoading(false);
//     }
//   }, [user]);

//   useEffect(() => {
//     if (user) {
//       refetch(); // Trigger fetch on user change or component mount
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [user, refetch]);

//   return { data, loading, refetch };
// };

// export default useGetAllSubscribersData;
