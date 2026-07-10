"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function VerifySearchPage() {
  const [certificateId, setCertificateId] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!certificateId.trim()) {
      setError("Enter a certificate UID to verify.");
      return;
    }
    setError("");
    router.push(`/verify/${certificateId.trim()}`);
  };

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <div className="glass-card p-10 text-center">
          <div className="text-5xl mb-4">🔍</div>
          <h1 className="text-3xl font-bold text-white mb-3">
            Verify a Certificate
          </h1>
          <p className="text-gray-400 mb-6">
            Enter a certificate UID to confirm whether it has been issued by Nexus Orbit Academy.
          </p>

          <form onSubmit={submit} className="space-y-4">
            <input
              value={certificateId}
              onChange={(event) => setCertificateId(event.target.value)}
              placeholder="Certificate UID"
              className="input-field w-full"
              autoFocus
            />
            {error && <div className="text-sm text-rose-300">{error}</div>}
            <button type="submit" className="btn-primary w-full">
              Verify Certificate
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
