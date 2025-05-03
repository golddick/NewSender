// app/success/page.tsx
import { Suspense } from "react";
import SuccessPage from "./_component/SuccessPage";
import { Loader } from "lucide-react";

export default function Page() {
  return (
    <Suspense fallback={<div className="grid place-items-center h-screen"><Loader className=" size-6 animate-spin"/></div>}>
      <SuccessPage />
    </Suspense>
  );
}
