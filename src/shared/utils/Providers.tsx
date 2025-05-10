// "use client";
// import { NextUIProvider } from "@nextui-org/react";
// import { usePathname } from "next/navigation";
// import { useUser } from "@clerk/nextjs";
// import DashboardSidebar from "@/shared/widgets/dashboard/sidebar/dashboard.sidebar";
// import { Toaster } from "react-hot-toast";
// import { addStripe } from "@/actions/add.stripe";
// import { useEffect } from "react";
// import { addPaystack } from "@/actions/add.paystack";

// interface ProviderProps {
//   children: React.ReactNode;
// }

// export default function Providers({ children }: ProviderProps) {
//   const pathname = usePathname();

//   const { isLoaded, user } = useUser();



//   // useEffect(() => {
//   //   const isStripeCustomerIdHas = async () => {
//   //     await addStripe();
//   //   };
  
//   //   if (isLoaded && user) {
//   //     isStripeCustomerIdHas();
//   //   }
//   // }, [isLoaded, user]);


//   useEffect(() => {
//     const isPaystackCustomerIdHas = async () => {
//       await addPaystack();
//     };
  
//     if (isLoaded && user) {
//       isPaystackCustomerIdHas();
//     }
//   }, [isLoaded, user]);

//   return (
//     <NextUIProvider>
//       {pathname !== "/dashboard/new-email" &&
//       pathname !== "/" &&
//       pathname !== "/about" &&
//       pathname !== "/documentation" &&
//       pathname !== "/sign-up" &&
//       pathname !== "/subscribe" &&
//       pathname !== "/success" &&
//       pathname !== "/sign-in" ? (
//         <div className="w-full flex">
//           <div className="w-[290px] min-h-screen overflow-y-scroll hidden lg:block">
//             <DashboardSidebar />
//           </div>
//           {children}
//         </div>
//       ) : (
//         <>{children}</>
//       )}
//       <Toaster position="bottom-center" reverseOrder={false} />
//     </NextUIProvider>
//   );
// }





"use client";

import { NextUIProvider } from "@nextui-org/react";
import { usePathname } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import DashboardSidebar from "@/shared/widgets/dashboard/sidebar/dashboard.sidebar";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import { addPaystack } from "@/actions/add.paystack";

interface ProviderProps {
  children: React.ReactNode;
}

export default function Providers({ children }: ProviderProps) {
  const pathname = usePathname();
  const { isLoaded, user } = useUser();

  useEffect(() => {
    const isPaystackCustomerIdHas = async () => {
      await addPaystack();
    };

    if (isLoaded && user) {
      isPaystackCustomerIdHas();
    }
  }, [isLoaded, user]);

  // Sidebar is only visible for /dashboard routes
  const shouldShowSidebar = pathname.startsWith("/dashboard");

  return (
    <NextUIProvider>
      {shouldShowSidebar ? (
        <div className="w-full flex">
          <aside className="w-[290px] min-h-screen overflow-y-scroll hidden lg:block border-r">
            <DashboardSidebar />
          </aside>
          <main className="flex-1">{children}</main>
        </div>
      ) : (
        <main>{children}</main>
      )}
      <Toaster position="bottom-center" reverseOrder={false} />
    </NextUIProvider>
  );
}
