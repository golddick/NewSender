"use client";

import { useUser } from "@clerk/nextjs";
import { Button } from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";

const Toolbar = () => {
  const { user } = useUser();

  return (
    <>
     
      {user ? (
        <>
          <Link href={"/dashboard"}>
            <Image
              src={user?.imageUrl}
              alt=""
              width={30}
              height={30}
              className="rounded-full"
            />
          </Link>

        </>
      ) : (
        <Link href={"/sign-in"}>Login</Link>
      )}
    </>
  );
};

export default Toolbar;


// 'use client';

// import { useUser } from "@clerk/nextjs";
// import { Button } from "@nextui-org/react";
// import Image from "next/image";
// import Link from "next/link";
// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { getMembershipStatus } from "@/actions/getTermsMembership";

// // Assuming you have a way to fetch membership status (terms acceptance)


// const Toolbar = () => {
//   const { user } = useUser();
//   const router = useRouter();
//   const [hasAcceptedTerms, setHasAcceptedTerms] = useState<boolean | null>(null);

//   useEffect(() => {
//     const checkUserTerms = async () => {
//       if (user) {
//         const membershipStatus = await getMembershipStatus();
//         if (membershipStatus?.termsAccepted === false) {
//           // Redirect to the legal page if the user has not accepted terms
//           router.push("/legal");
//         } else {
//           setHasAcceptedTerms(true); // User has accepted terms
//         }
//       }
//     };

//     if (user) {
//       checkUserTerms();
//     }
//   }, [user, router]);

//   return (
//     <>
//       {user ? (
//         <>
//           {hasAcceptedTerms === null ? (
//             <div>Loading...</div> // Show loading state until terms acceptance is checked
//           ) : (
//             <Link href={hasAcceptedTerms ? "/dashboard" : "/"} passHref>
//               <Image
//                 src={user?.imageUrl}
//                 alt="User Avatar"
//                 width={40}
//                 height={40}
//                 className="rounded-full"
//               />
//               <Button color="primary" className="text-lg">
//                 Dashboard
//               </Button>
//             </Link>
//           )}
//         </>
//       ) : (
//         <Link href="/sign-in">Login</Link>
//       )}
//     </>
//   );
// };

// export default Toolbar;
