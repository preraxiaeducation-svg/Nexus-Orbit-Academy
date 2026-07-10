import React, { Suspense } from "react";
import LoginClient from "./LoginClient";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center px-4 pt-24 pb-10" />}>
      <LoginClient />
    </Suspense>
  );
}
