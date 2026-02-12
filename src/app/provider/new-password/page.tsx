"use client";

import Layout from "@/app/provider/auth/layout";
import NewPassword from "@/features/provider/components/ui/new-password";
import { Suspense } from "react";

const NewPasswordPage = () => {
  return (
    <Layout>
      <Suspense fallback={<div>Loading...</div>}>
        <NewPassword />
      </Suspense>
    </Layout>
  );
};

export default NewPasswordPage;


