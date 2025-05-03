
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
