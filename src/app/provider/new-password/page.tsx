"use client";

import Layout from "@/app/provider/auth/layout";
import NewPassword from "@/components/provider/auth/new-password";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

const NewPasswordPage = () => {
  return (
    <Layout>
      <Suspense
        fallback={
          <div className="h-screen w-full flex items-center justify-center bg-background">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        }
      >
        <NewPassword />
      </Suspense>
    </Layout>
  );
};

export default NewPasswordPage;
