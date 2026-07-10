"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

interface Registration {
  id: string;
  fullName: string;
  email: string;
  mobileNumber: string;
  country: string;
  preferredDepartment: string;
  preferredCourseLevel: string;
  createdAt: string;
  [key: string]: unknown;
}

interface Stats {
  totalRegistrations: number;
  todaysRegistrations: number;
  departmentStats: Array<{ preferredDepartment: string; _count: { preferredDepartment: number } }>;
  countryStats: Array<{ country: string; _count: { country: number } }>;
  levelStats: Array<{ preferredCourseLevel: string; _count: { preferredCourseLevel: number } }>;
}

export default function InterestRegistrationsAdminClient() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");
  const [level, setLevel] = useState("");
  const [country, setCountry] = useState("");
  const [sort, setSort] = useState("createdAt");
  const [order, setOrder] = useState("desc");
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams({ search, department, level, country, sort, order });
      const [regsRes, statsRes] = await Promise.all([
        fetch(`/api/admin/interest-registrations?${query.toString()}`),
        fetch("/api/admin/interest-registrations/stats"),
      ]);
      const regsData = await regsRes.json();
      const statsData = await statsRes.json();
      setRegistrations(regsData.registrations ?? []);
      setStats(statsData.stats ?? null);
    } catch {
      setRegistrations([]);
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [search, department, level, country, sort, order]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this registration?")) return;
    setDeletingId(id);
    const res = await fetch("/api/admin/interest-registrations", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      fetchData();
    }
    setDeletingId(null);
  };

  const exportCsv = () => {
    const rows = registrations.map((item) => ({
      fullName: item.fullName,
      email: item.email,
      mobileNumber: item.mobileNumber,
      country: item.country,
      preferredDepartment: item.preferredDepartment,
      preferredCourseLevel: item.preferredCourseLevel,
      createdAt: item.createdAt,
    }));

    const header = ["fullName", "email", "mobileNumber", "country", "preferredDepartment", "preferredCourseLevel", "createdAt"];
    const csv = [header.join(",")]
      .concat(
        rows.map((row) =>
          header
            .map((key) => `"${String(row[key as keyof typeof row] ?? "").replaceAll(/"/g, '""')}"`)
            .join(",")
        )
      )
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "interest-registrations.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const departmentSummary = useMemo(() => (stats?.departmentStats ?? []).slice(0, 5), [stats]);
  const countrySummary = useMemo(() => (stats?.countryStats ?? []).slice(0, 5), [stats]);
  const levelSummary = useMemo(() => (stats?.levelStats ?? []).slice(0, 5), [stats]);

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white orbit-heading">
              Interest Registrations
            </h1>
            <p className="text-gray-500 text-sm">Prospects who have expressed interest in joining the academy.</p>
          </div>
          <div className="flex gap-3">
            <Link href="/admin" className="btn-secondary py-2 px-4 text-sm">← Back to Admin</Link>
            <button onClick={exportCsv} className="btn-primary py-2 px-4 text-sm">Export CSV</button>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { label: "Total Registrations", value: stats?.totalRegistrations ?? 0, accentClass: "text-cyan-400" },
            { label: "Today's Registrations", value: stats?.todaysRegistrations ?? 0, accentClass: "text-purple-400" },
            { label: "Departments", value: departmentSummary.length, accentClass: "text-amber-400" },
            { label: "Countries", value: countrySummary.length, accentClass: "text-violet-400" },
            { label: "Levels", value: levelSummary.length, accentClass: "text-emerald-400" },
          ].map((card) => (
            <div key={card.label} className="glass-card p-4 text-center">
              <div className={`text-xl font-bold mb-1 orbit-heading ${card.accentClass}`}>
                {card.value}
              </div>
              <div className="text-xs text-gray-500">{card.label}</div>
            </div>
          ))}
        </div>

        <div className="glass-card p-4 sm:p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-3">
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name, email, country..." className="input-field" />
            <select title="Department filter" value={department} onChange={(e) => setDepartment(e.target.value)} className="input-field">
              <option value="">All Departments</option>
              <option value="AEROSPACE">Aerospace</option>
              <option value="AI_ML">AI & Machine Learning</option>
              <option value="SPACE_TECH">Space Technology</option>
              <option value="UNIVERSE">Universe</option>
            </select>
            <select title="Level filter" value={level} onChange={(e) => setLevel(e.target.value)} className="input-field">
              <option value="">All Levels</option>
              <option value="BEGINNER">Beginner</option>
              <option value="INTERMEDIATE">Intermediate</option>
              <option value="ADVANCED">Advanced</option>
            </select>
            <input value={country} onChange={(e) => setCountry(e.target.value)} placeholder="Filter by country" className="input-field" />
            <select title="Sort order" value={`${sort}:${order}`} onChange={(e) => { const [nextSort, nextOrder] = e.target.value.split(":"); setSort(nextSort); setOrder(nextOrder); }} className="input-field">
              <option value="createdAt:desc">Newest First</option>
              <option value="createdAt:asc">Oldest First</option>
              <option value="fullName:asc">Name A-Z</option>
              <option value="fullName:desc">Name Z-A</option>
            </select>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="rounded-xl border border-white/10 bg-black/20 p-4">
              <h3 className="text-sm font-semibold text-white mb-3">Department-wise</h3>
              <div className="space-y-2 text-sm text-gray-400">
                {(departmentSummary.length ? departmentSummary : [{ preferredDepartment: "No data", _count: { preferredDepartment: 0 } }]).map((item) => (
                  <div key={item.preferredDepartment} className="flex justify-between">
                    <span>{item.preferredDepartment}</span>
                    <span className="text-white">{item._count.preferredDepartment}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/20 p-4">
              <h3 className="text-sm font-semibold text-white mb-3">Country-wise</h3>
              <div className="space-y-2 text-sm text-gray-400">
                {(countrySummary.length ? countrySummary : [{ country: "No data", _count: { country: 0 } }]).map((item) => (
                  <div key={item.country} className="flex justify-between">
                    <span>{item.country}</span>
                    <span className="text-white">{item._count.country}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/20 p-4">
              <h3 className="text-sm font-semibold text-white mb-3">Level-wise</h3>
              <div className="space-y-2 text-sm text-gray-400">
                {(levelSummary.length ? levelSummary : [{ preferredCourseLevel: "No data", _count: { preferredCourseLevel: 0 } }]).map((item) => (
                  <div key={item.preferredCourseLevel} className="flex justify-between">
                    <span>{item.preferredCourseLevel}</span>
                    <span className="text-white">{item._count.preferredCourseLevel}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-center text-gray-400 py-10">Loading registrations…</div>
          ) : registrations.length === 0 ? (
            <div className="text-center text-gray-400 py-10">No registrations match the current filters.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left">
                <thead className="text-gray-400 uppercase tracking-wider text-xs">
                  <tr>
                    <th className="py-3 pr-4">Name</th>
                    <th className="py-3 pr-4">Email</th>
                    <th className="py-3 pr-4">Mobile</th>
                    <th className="py-3 pr-4">Country</th>
                    <th className="py-3 pr-4">Department</th>
                    <th className="py-3 pr-4">Level</th>
                    <th className="py-3 pr-4">Created</th>
                    <th className="py-3 pr-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {registrations.map((registration) => (
                    <tr key={registration.id} className="border-t border-white/10">
                      <td className="py-3 pr-4 text-white">{registration.fullName}</td>
                      <td className="py-3 pr-4 text-gray-300">{registration.email}</td>
                      <td className="py-3 pr-4 text-gray-300">{registration.mobileNumber}</td>
                      <td className="py-3 pr-4 text-gray-300">{registration.country}</td>
                      <td className="py-3 pr-4 text-gray-300">{registration.preferredDepartment}</td>
                      <td className="py-3 pr-4 text-gray-300">{registration.preferredCourseLevel}</td>
                      <td className="py-3 pr-4 text-gray-300">{new Date(registration.createdAt).toLocaleDateString()}</td>
                      <td className="py-3 pr-4">
                        <button onClick={() => handleDelete(registration.id)} disabled={deletingId === registration.id} className="text-red-400 hover:text-red-300 text-sm">
                          {deletingId === registration.id ? "Deleting…" : "Delete"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
