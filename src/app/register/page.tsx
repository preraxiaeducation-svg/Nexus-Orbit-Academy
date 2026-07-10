"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { InterestRegistrationForm } from "@/components/interest/InterestRegistrationForm";

export default function RegisterPage() {
  const router = useRouter();

  const handleCancel = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-24 pb-10">
      <div className="w-full max-w-6xl">
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">🚀</div>
          <h1 className="text-3xl font-bold text-white orbit-heading">
            Get Registered
          </h1>
          <p className="text-gray-500 text-sm mt-2 max-w-2xl mx-auto body-copy">
            Share your academic background and learning goals so we can guide you toward the right program at Nexus Orbit Academy.
          </p>
        </div>
        <InterestRegistrationForm onCancel={handleCancel} />
        <div className="text-center mt-6">
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-300">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
