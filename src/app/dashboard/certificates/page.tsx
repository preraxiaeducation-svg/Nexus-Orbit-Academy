import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { getAuthSession } from "@/lib/auth";
import { DEPARTMENTS } from "@/config/departments";
import CertificateCanvas from "@/components/ui/CertificateCanvas";

export const metadata: Metadata = {
  title: "My Certificates",
};

export default async function CertificatesPage() {
  const session = await getAuthSession();
  if (!session) redirect("/login");

  const certificates = await prisma.certificate.findMany({
    where: { userId: session.userId },
    include: {
      course: {
        select: {
          title: true,
          slug: true,
          department: true,
          level: true,
        },
      },
    },
    orderBy: { issuedAt: "desc" },
  });

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-white" style={{ fontFamily: "Orbitron, sans-serif" }}>
            My Certificates
          </h1>
          <p className="text-gray-500 mt-2" style={{ fontFamily: "Inter, sans-serif" }}>
            Verified certificates issued when you passed a final exam.
          </p>
        </div>

        {certificates.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <div className="text-5xl mb-4">🏅</div>
            <h3 className="text-white font-bold text-lg mb-2" style={{ fontFamily: "Orbitron, sans-serif" }}>
              No certificates yet
            </h3>
            <p className="text-gray-500 mb-6 text-sm" style={{ fontFamily: "Inter, sans-serif" }}>
              Complete a course exam successfully to earn your first Nexus Orbit certificate.
            </p>
            <Link href="/courses" className="btn-primary">
              Explore Courses
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {certificates.map((certificate) => {
              const dept = DEPARTMENTS.find((d) => d.id === certificate.course.department.toLowerCase());
              return (
                <div key={certificate.id} className="glass-card p-6 grid gap-6 lg:grid-cols-[1fr_2fr] items-center">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{dept?.icon ?? "🏆"}</span>
                      <div>
                        <div className="text-sm text-gray-400">Verified Certificate</div>
                        <h2 className="text-lg font-semibold text-white" style={{ fontFamily: "Orbitron, sans-serif" }}>
                          {certificate.course.title}
                        </h2>
                      </div>
                    </div>

                    <div className="grid gap-1.5 text-sm text-gray-400" style={{ fontFamily: "Inter, sans-serif" }}>
                      <div>Level: {certificate.course.level}</div>
                      <div>Issued: {new Date(certificate.issuedAt).toLocaleDateString()}</div>
                      <div className="break-all font-mono text-xs mt-1">ID: {certificate.certificateUid}</div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Link href={`/verify/${certificate.certificateUid}`} className="btn-gold text-xs px-4 py-2 flex-1 text-center">
                        Verify Publicly
                      </Link>
                      <Link href={`/dashboard/course/${certificate.course.slug}`} className="btn-secondary text-xs px-4 py-2 flex-1 text-center">
                        Open Course
                      </Link>
                    </div>
                  </div>

                  <div className="w-full flex justify-center">
                    <CertificateCanvas
                      studentName={session.name}
                      courseTitle={certificate.course.title}
                      courseLevel={certificate.course.level}
                      issuedAt={certificate.issuedAt}
                      certificateUid={certificate.certificateUid}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
