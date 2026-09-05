"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { CheckCircle } from "lucide-react";

export default function ConfirmPage() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const handleConfirmation = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        setStatus("error");
        return;
      }

      if (data.session) {
        setStatus("success");
        setTimeout(() => router.push("/"), 2000);
      } else {
        setStatus("success");
        setTimeout(() => router.push("/login"), 2000);
      }
    };

    handleConfirmation();
  }, [supabase, router]);

  if (status === "loading") {
    return (
      <div className="text-center">
        <div className="animate-spin w-8 h-8 border-2 border-hairline border-t-ink rounded-full mx-auto mb-4" />
        <p className="text-body-md text-body">Confirming your email...</p>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="text-center">
        <CheckCircle className="w-12 h-12 text-link mx-auto mb-4" />
        <h1 className="font-display font-semibold text-heading-lg text-ink mb-2">
          Email Confirmed!
        </h1>
        <p className="text-body-md text-body">
          Redirecting you to the dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="text-center">
      <p className="text-body-md text-error">Something went wrong. Please try again.</p>
    </div>
  );
}
