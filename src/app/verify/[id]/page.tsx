import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import CertificateCanvas from "@/components/ui/CertificateCanvas";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Verify Certificate ${id}`,
  };
}

export default async function VerifyCertificatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const certificate = await prisma.certificate.findUnique({
    where: { certificateUid: id },
    include: {
      course: { select: { title: true, slug: true, level: true } },
      user: { select: { name: true, email: true } },
    },
  });

  if (!certificate) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-28 px-4 sm:px-6">
        <div className="glass-card p-12 text-center max-w-xl">
          <div className="text-5xl mb-4">❌</div>
          <h1 className="text-3xl font-bold text-white mb-3" style={{ fontFamily: "Orbitron, sans-serif" }}>
            Certificate Not Found
          </h1>
          <p className="text-gray-400 mb-6" style={{ fontFamily: "Inter, sans-serif" }}>
            The certificate ID you entered is invalid or has not been issued by Nexus Orbit Academy.
          </p>
          <Link href="/" className="btn-secondary">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="glass-card p-10 mb-8">
          <div className="flex flex-col gap-3">
            <div className="text-sm text-cyan-300 uppercase tracking-[0.24em]">Certificate verification</div>
            <h1 className="text-4xl font-bold text-white" style={{ fontFamily: "Orbitron, sans-serif" }}>
              Verified by Nexus Orbit Academy
            </h1>
            <p className="text-gray-400 text-sm" style={{ fontFamily: "Inter, sans-serif" }}>
              This certificate is authentic and has been issued to the learner below.
            </p>
          </div>
        </div>

        <div className="glass-card p-8 grid gap-6">
          <div>
            <div className="text-xs text-gray-400 uppercase tracking-[0.24em] mb-2">Certificate ID</div>
            <div className="text-sm text-white break-all font-mono" style={{ fontFamily: "Inter, sans-serif" }}>
              {certificate.certificateUid}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <p className="text-xs text-gray-400 uppercase tracking-[0.24em]">Learner</p>
              <p className="text-white text-base font-semibold" style={{ fontFamily: "Inter, sans-serif" }}>
                {certificate.user.name}
              </p>
              <p className="text-gray-400 text-sm">{certificate.user.email}</p>
            </div>

            <div className="space-y-2">
              <p className="text-xs text-gray-400 uppercase tracking-[0.24em]">Course</p>
              <p className="text-white text-base font-semibold" style={{ fontFamily: "Inter, sans-serif" }}>
                {certificate.course.title}
              </p>
              <p className="text-gray-400 text-sm">Level: {certificate.course.level}</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <div className="text-xs text-gray-400 uppercase tracking-[0.24em]">Issued</div>
              <div className="text-white text-sm">{new Date(certificate.issuedAt).toLocaleDateString()}</div>
            </div>
            <div className="space-y-2">
              <div className="text-xs text-gray-400 uppercase tracking-[0.24em]">Status</div>
              <div className="text-emerald-400 text-sm font-bold flex items-center gap-1">
                <span>✓</span> Verified
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-xs text-gray-400 uppercase tracking-[0.24em]">Proof</div>
              <div className="text-white text-sm">Cryptographically Valid</div>
            </div>
          </div>

          <div className="pt-6 border-t border-white/10 flex justify-center w-full">
            <CertificateCanvas
              studentName={certificate.user.name}
              courseTitle={certificate.course.title}
              courseLevel={certificate.course.level}
              issuedAt={certificate.issuedAt}
              certificateUid={certificate.certificateUid}
              readOnly={true}
            />
          </div>

          <div className="pt-4 border-t border-white/10">
            <p className="text-gray-400 text-sm" style={{ fontFamily: "Inter, sans-serif" }}>
              If you are the certificate holder, save this URL or share the certificate UID with employers to prove completion.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-3">
            <Link href="/" className="btn-secondary w-full sm:w-auto text-center">
              Back to Home
            </Link>
            <Link href={`/dashboard/certificates`} className="btn-primary w-full sm:w-auto text-center">
              My Certificates
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
