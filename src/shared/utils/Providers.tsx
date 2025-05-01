"use client";
import { NextUIProvider } from "@nextui-org/react";
import { usePathname } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import DashboardSidebar from "@/shared/widgets/dashboard/sidebar/dashboard.sidebar";
import { Toaster } from "react-hot-toast";
import { addStripe } from "@/actions/add.stripe";
import { useEffect } from "react";

interface ProviderProps {
  children: React.ReactNode;
}

export default function Providers({ children }: ProviderProps) {
  const pathname = usePathname();

  const { isLoaded, user } = useUser();

  // const isStripeCustomerIdHas = async () => {
  //   await addStripe();
  // };

  // if (!isLoaded) {
  //   return null;
  // } else {
  //   if (user) {
  //     isStripeCustomerIdHas();
  //   }
  // }


  useEffect(() => {
    const isStripeCustomerIdHas = async () => {
      await addStripe();
    };
  
    if (isLoaded && user) {
      isStripeCustomerIdHas();
    }
  }, [isLoaded, user]);

  return (
    <NextUIProvider>
      {pathname !== "/dashboard/new-email" &&
      pathname !== "/" &&
      pathname !== "/sign-up" &&
      pathname !== "/subscribe" &&
      pathname !== "/success" &&
      pathname !== "/sign-in" ? (
        <div className="w-full flex">
          <div className="w-[290px] h-screen overflow-y-scroll">
            <DashboardSidebar />
          </div>
          {children}
        </div>
      ) : (
        <>{children}</>
      )}
      <Toaster position="bottom-center" reverseOrder={false} />
    </NextUIProvider>
  );
}
