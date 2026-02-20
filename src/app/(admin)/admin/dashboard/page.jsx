'use client';

import { useMemo, useState } from 'react';
import Badge from '@/components/ui/Badge';
import StatCard from '@/components/ui/StatCard';
import DataTableShell from '@/components/ui/DataTableShell';
import {
  PLATFORM_STATS,
  MOCK_USERS,
  MOCK_COMPANIES,
  MOCK_SOS_EVENTS,
  MOCK_AI_ALERTS,
} from '@/lib/admin-dashboard-mock';

const TABS = [
  { id: 'overview', label: 'Overview', icon: 'dashboard' },
  { id: 'users', label: 'Users', icon: 'group' },
  { id: 'companies', label: 'Companies', icon: 'domain' },
  { id: 'sos', label: 'SOS Events', icon: 'sos' },
  { id: 'ai', label: 'AI Alerts', icon: 'psychology' },
];

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [query, setQuery] = useState('');
  const [companies, setCompanies] = useState(MOCK_COMPANIES);
  const [companyFilter, setCompanyFilter] = useState('all'); // all | pending | approved | rejected
  const [aiSeverity, setAiSeverity] = useState('all'); // all | critical | warning | info

  const filteredUsers = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return MOCK_USERS;
    return MOCK_USERS.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.role.toLowerCase().includes(q)
    );
  }, [query]);

  const filteredCompanies = useMemo(() => {
    const q = query.trim().toLowerCase();
    return companies.filter((c) => {
      const matchesQuery =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        String(c.fleetSize).includes(q);
      const matchesFilter =
        companyFilter === 'all' ? true : c.status === companyFilter;
      return matchesQuery && matchesFilter;
    });
  }, [companies, query, companyFilter]);

  const filteredSos = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return MOCK_SOS_EVENTS;
    return MOCK_SOS_EVENTS.filter(
      (e) =>
        e.userName.toLowerCase().includes(q) ||
        e.userId.toLowerCase().includes(q) ||
        e.location.toLowerCase().includes(q) ||
        e.status.toLowerCase().includes(q)
    );
  }, [query]);

  const filteredAi = useMemo(() => {
    const q = query.trim().toLowerCase();
    return MOCK_AI_ALERTS.filter((a) => {
      const matchesQuery =
        !q ||
        a.entity.toLowerCase().includes(q) ||
        a.type.toLowerCase().includes(q) ||
        a.source.toLowerCase().includes(q) ||
        a.status.toLowerCase().includes(q);
      const matchesSeverity = aiSeverity === 'all' ? true : a.severity === aiSeverity;
      return matchesQuery && matchesSeverity;
    });
  }, [query, aiSeverity]);

  const handleApprove = (companyId) => {
    setCompanies((prev) =>
      prev.map((c) => (c.id === companyId ? { ...c, status: 'approved' } : c))
    );
  };

  const handleReject = (companyId) => {
    setCompanies((prev) =>
      prev.map((c) => (c.id === companyId ? { ...c, status: 'rejected' } : c))
    );
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100">
      {/* Top bar */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-950/70 backdrop-blur-md border-b border-primary/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary p-2 rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-white">
                admin_panel_settings
              </span>
            </div>
            <div>
              <h1 className="text-lg font-bold leading-none">Kavach Admin</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Platform control center
              </p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-3 flex-1 justify-center max-w-xl">
            <div className="relative w-full">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
                search
              </span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search users, companies, SOS, alerts..."
                className="w-full bg-slate-100 dark:bg-slate-900 border-none rounded-lg py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors relative">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-950" />
            </button>
            <button className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors">
              <span className="material-symbols-outlined">settings</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-7xl mx-auto px-6 pb-3">
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
                  activeTab === t.id
                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-800 hover:bg-primary/5'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {t.icon}
                </span>
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Mobile search */}
        <div className="md:hidden">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
              search
            </span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search..."
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Overview */}
        {activeTab === 'overview' ? (
          <>
            <div className="flex items-end justify-between gap-4 flex-wrap">
              <div>
                <h2 className="text-2xl font-black tracking-tight">
                  Platform Overview
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  High-level stats and system activity (mock data).
                </p>
              </div>
              <div className="flex gap-3">
                <button className="px-4 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                  Download Snapshot
                </button>
                <button className="px-4 py-2 rounded-lg bg-primary text-white font-bold text-sm shadow-lg shadow-primary/20 hover:bg-primary/90 transition-colors">
                  System Settings
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard
                label="Total Users"
                value={PLATFORM_STATS.totalUsers.toLocaleString()}
                sub="All registered user accounts"
                icon="group"
                iconBg="bg-primary/10 text-primary"
              />
              <StatCard
                label="Companies"
                value={PLATFORM_STATS.totalCompanies.toLocaleString()}
                sub={`${PLATFORM_STATS.pendingCompanies} pending approvals`}
                icon="domain"
                iconBg="bg-blue-500/10 text-blue-500"
              />
              <StatCard
                label="SOS Events (Today)"
                value={PLATFORM_STATS.sosEventsToday}
                sub={`${PLATFORM_STATS.aiAlertsToday} AI alerts today`}
                icon="sos"
                iconBg="bg-red-500/10 text-red-500"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-slate-900/70 rounded-xl border border-primary/10 p-6 shadow-sm">
                <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                  System Health
                </h3>
                <div className="mt-5 flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-black text-slate-900 dark:text-slate-100">
                      {PLATFORM_STATS.uptime}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      Uptime (30 days)
                    </p>
                  </div>
                  <div className="size-12 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <span className="material-symbols-outlined">check_circle</span>
                  </div>
                </div>
                <div className="mt-6">
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span>API latency</span>
                    <span className="font-bold text-slate-700 dark:text-slate-200">
                      142ms
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mt-2">
                    <span>DB connections</span>
                    <span className="font-bold text-slate-700 dark:text-slate-200">
                      Stable
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900/70 rounded-xl border border-primary/10 p-6 shadow-sm lg:col-span-2">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                      Admin Actions
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      Common operational flows
                    </p>
                  </div>
                  <Badge tone="purple">UI only</Badge>
                </div>
                <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    onClick={() => setActiveTab('companies')}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 hover:bg-primary/5 transition-colors text-left"
                  >
                    <div className="size-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                      <span className="material-symbols-outlined">fact_check</span>
                    </div>
                    <p className="mt-3 font-bold">Review companies</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Approve or reject onboarding requests.
                    </p>
                  </button>
                  <button
                    onClick={() => setActiveTab('sos')}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 hover:bg-primary/5 transition-colors text-left"
                  >
                    <div className="size-10 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center">
                      <span className="material-symbols-outlined">sos</span>
                    </div>
                    <p className="mt-3 font-bold">Monitor SOS</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Triage active incidents in real time.
                    </p>
                  </button>
                  <button
                    onClick={() => setActiveTab('ai')}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 hover:bg-primary/5 transition-colors text-left"
                  >
                    <div className="size-10 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
                      <span className="material-symbols-outlined">psychology</span>
                    </div>
                    <p className="mt-3 font-bold">AI alerts</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Review model flags and escalations.
                    </p>
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : null}

        {/* Users */}
        {activeTab === 'users' ? (
          <DataTableShell
            title="All Users"
            subtitle="View all platform users (mock data)."
            headerRight={<Badge tone="slate">{filteredUsers.length} records</Badge>}
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 dark:bg-slate-900">
                  <tr className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Created</th>
                    <th className="px-6 py-4">Last login</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-primary/5">
                  {filteredUsers.map((u) => (
                    <tr
                      key={u.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap font-bold">
                        {u.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">
                        {u.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge tone="purple">{u.role}</Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge tone={u.status === 'active' ? 'green' : 'amber'}>
                          {u.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">
                        {u.createdAt}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">
                        {u.lastLogin}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </DataTableShell>
        ) : null}

        {/* Companies */}
        {activeTab === 'companies' ? (
          <section className="space-y-4">
            <div className="flex items-end justify-between gap-4 flex-wrap">
              <div>
                <h3 className="text-lg font-bold">Companies</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Approve or reject company onboarding (client-side only).
                </p>
              </div>
              <div className="flex gap-2 items-center flex-wrap">
                {['all', 'pending', 'approved', 'rejected'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setCompanyFilter(f)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold border transition-colors ${
                      companyFilter === f
                        ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-primary/5'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900/70 rounded-xl border border-primary/10 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-primary/10 flex items-center justify-between">
                <Badge tone="slate">{filteredCompanies.length} records</Badge>
                <Badge tone="purple">mock</Badge>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 dark:bg-slate-900">
                    <tr className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
                      <th className="px-6 py-4">Company</th>
                      <th className="px-6 py-4">Email</th>
                      <th className="px-6 py-4">Fleet size</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Created</th>
                      <th className="px-6 py-4">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-primary/5">
                    {filteredCompanies.map((c) => (
                      <tr
                        key={c.id}
                        className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors"
                      >
                        <td className="px-6 py-4 font-bold">{c.name}</td>
                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                          {c.email}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                          {c.fleetSize.toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          <Badge
                            tone={
                              c.status === 'approved'
                                ? 'green'
                                : c.status === 'rejected'
                                ? 'red'
                                : 'amber'
                            }
                          >
                            {c.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                          {c.createdAt}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {c.status === 'pending' ? (
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleApprove(c.id)}
                                className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:brightness-110"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleReject(c.id)}
                                className="px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-bold hover:brightness-110"
                              >
                                Reject
                              </button>
                            </div>
                          ) : (
                            <button className="px-3 py-1.5 rounded-lg border border-primary text-primary text-xs font-bold hover:bg-primary/5">
                              View
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        ) : null}

        {/* SOS Events */}
        {activeTab === 'sos' ? (
          <DataTableShell
            title="SOS Events"
            subtitle="View all SOS events (mock data)."
            headerRight={<Badge tone="slate">{filteredSos.length} records</Badge>}
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 dark:bg-slate-900">
                  <tr className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
                    <th className="px-6 py-4">Time</th>
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4">Location</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-primary/5">
                  {filteredSos.map((e) => (
                    <tr
                      key={e.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300 whitespace-nowrap">
                        {e.timestamp}
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold">{e.userName}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {e.userId}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300 whitespace-nowrap">
                        {e.location}
                      </td>
                      <td className="px-6 py-4">
                        <Badge tone={e.status === 'active' ? 'red' : 'green'}>
                          {e.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button className="px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-bold hover:bg-primary/90">
                          Open
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </DataTableShell>
        ) : null}

        {/* AI Alerts */}
        {activeTab === 'ai' ? (
          <section className="space-y-4">
            <div className="flex items-end justify-between gap-4 flex-wrap">
              <div>
                <h3 className="text-lg font-bold">AI Alerts</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  View AI safety alerts across the platform (mock data).
                </p>
              </div>
              <div className="flex gap-2 items-center flex-wrap">
                {['all', 'critical', 'warning', 'info'].map((s) => (
                  <button
                    key={s}
                    onClick={() => setAiSeverity(s)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold border transition-colors ${
                      aiSeverity === s
                        ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-primary/5'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <DataTableShell
              headerRight={
                <>
                  <Badge tone="slate">{filteredAi.length} records</Badge>
                  <Badge tone="purple">mock</Badge>
                </>
              }
            >
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 dark:bg-slate-900">
                    <tr className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
                      <th className="px-6 py-4">Time</th>
                      <th className="px-6 py-4">Source</th>
                      <th className="px-6 py-4">Entity</th>
                      <th className="px-6 py-4">Type</th>
                      <th className="px-6 py-4">Severity</th>
                      <th className="px-6 py-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-primary/5">
                    {filteredAi.map((a) => (
                      <tr
                        key={a.id}
                        className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors"
                      >
                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300 whitespace-nowrap">
                          {a.timestamp}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300 whitespace-nowrap">
                          {a.source}
                        </td>
                        <td className="px-6 py-4 font-bold text-primary whitespace-nowrap">
                          {a.entity}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-200">
                          {a.type}
                        </td>
                        <td className="px-6 py-4">
                          <Badge
                            tone={
                              a.severity === 'critical'
                                ? 'red'
                                : a.severity === 'warning'
                                ? 'amber'
                                : 'slate'
                            }
                          >
                            {a.severity}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <Badge
                            tone={
                              a.status === 'open'
                                ? 'amber'
                                : a.status === 'investigating'
                                ? 'purple'
                                : 'green'
                            }
                          >
                            {a.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </DataTableShell>
          </section>
        ) : null}
      </main>
    </div>
  );
}

