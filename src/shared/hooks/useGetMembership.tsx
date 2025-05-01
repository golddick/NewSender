// "use client";

// import { getMemberShip } from "@/actions/get.membership";
// import { useEffect, useState } from "react";

// const useGetMembership = () => {
//   const [data, setData] = useState<MembershipTypes[]>([]);
//   const [loading, setLoading] = useState(true);

//   console.log(data, "data from useGetMembership");

//   useEffect(() => {
//     handleGetMembership();
//   }, []);

//   const handleGetMembership = async () => {
//     await getMemberShip()
//       .then((res) => {
//         setData(res);
//         setLoading(false);
//       })
//       .catch((error) => {
//         console.log(error);
//         setLoading(false);
//       });
//   };

//   return { data, loading };
// };

// export default useGetMembership;




import { useEffect, useState } from "react";
import { getMemberShip } from "@/actions/get.membership";

const useGetMembership = () => {
  const [data, setData] = useState<MembershipTypes | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleGetMembership = async () => {
      try {
        const res = await getMemberShip();
        console.log(res, "res from useGetMembership");
        setData(res);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    handleGetMembership();
  }, []);

  return { data, loading };
};

export default useGetMembership;
