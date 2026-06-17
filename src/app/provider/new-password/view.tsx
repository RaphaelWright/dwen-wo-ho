"use client";

import Layout from "@/app/provider/auth/layout";
import NewPassword from "@/components/provider/auth/new-password/index";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

const NewPasswordPage = () => {
  return (
    <Layout>
      <Suspense
        fallback={
          <div className="bg-background flex h-screen w-full items-center justify-center">
            <Loader2 className="text-primary h-8 w-8 animate-spin" />
          </div>
        }
      >
        <NewPassword />
      </Suspense>
    </Layout>
  );
};

export default NewPasswordPage;
