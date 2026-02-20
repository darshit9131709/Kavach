'use client';

import { useState } from 'react';
import {
  MOCK_STATS,
  MOCK_AI_STATUS,
  MOCK_ALERTS,
  MOCK_VEHICLES,
  SEVERITY_OPTIONS,
} from '@/lib/company-dashboard-mock';

const STATUS_COLORS = {
  red: {
    bg: 'bg-red-100 dark:bg-red-900/20',
    text: 'text-red-600 dark:text-red-400',
    dot: 'bg-red-500',
  },
  amber: {
    bg: 'bg-amber-100 dark:bg-amber-900/20',
    text: 'text-amber-600 dark:text-amber-400',
    dot: 'bg-amber-500',
  },
  emerald: {
    bg: 'bg-emerald-100 dark:bg-emerald-900/20',
    text: 'text-emerald-600 dark:text-emerald-400',
    dot: 'bg-emerald-500',
  },
};

function getStatusStyle(status) {
  const key = status.toLowerCase();
  if (key === 'critical' || key === 'verifying' || key === 'attention') {
    return key === 'critical' ? 'red' : 'amber';
  }
  return 'emerald';
}

export default function CompanyDashboardPage() {
  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [activeNav, setActiveNav] = useState('overview');

  const filteredAlerts = MOCK_ALERTS.filter((alert) => {
    const matchesSearch =
      !search.trim() ||
      alert.vehicleId.toLowerCase().includes(search.toLowerCase()) ||
      alert.alertType.toLowerCase().includes(search.toLowerCase());
    const matchesSeverity =
      severityFilter === 'all' ||
      alert.status.toLowerCase() === severityFilter ||
      (severityFilter === 'resolved' && alert.status === 'Resolved') ||
      (severityFilter === 'critical' && alert.status === 'Critical') ||
      (severityFilter === 'warning' &&
        ['Verifying', 'Attention'].includes(alert.status));
    return matchesSearch && matchesSeverity;
  });

  const navItems = [
    { id: 'overview', icon: 'dashboard', label: 'Overview' },
    { id: 'vehicles', icon: 'local_taxi', label: 'Live Vehicles' },
    { id: 'incidents', icon: 'emergency', label: 'Incidents' },
    {
      id: 'alerts',
      icon: 'notifications',
      label: 'Alerts',
      badge: 3,
    },
    { id: 'analytics', icon: 'bar_chart', label: 'Analytics' },
  ];

  return (
    <div className="flex h-screen overflow-hidden font-display bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 border-r border-primary/10 bg-white dark:bg-background-dark/50 flex flex-col justify-between">
        <div className="flex flex-col gap-8 p-6">
          <div className="flex items-center gap-3">
            <div className="bg-primary p-2 rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-white">
                shield_person
              </span>
            </div>
            <div className="flex flex-col">
              <h1 className="text-primary text-lg font-bold leading-none">
                Kavach
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-xs font-medium">
                Enterprise Safety
              </p>
            </div>
          </div>
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveNav(item.id)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors w-full text-left ${
                  activeNav === item.id
                    ? 'bg-primary text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary'
                }`}
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                <span className="text-sm">{item.label}</span>
                {item.badge ? (
                  <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                ) : null}
              </button>
            ))}
          </nav>
        </div>
        <div className="p-6 flex flex-col gap-4 border-t border-primary/10">
          <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-white text-sm font-bold shadow-lg shadow-primary/20 hover:brightness-110">
            <span className="material-symbols-outlined text-sm">
              support_agent
            </span>
            Dispatch Assistance
          </button>
          <div className="flex flex-col gap-1">
            <button className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary transition-colors w-full text-left">
              <span className="material-symbols-outlined">settings</span>
              <span className="text-sm">Settings</span>
            </button>
            <button className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary transition-colors w-full text-left">
              <span className="material-symbols-outlined">help</span>
              <span className="text-sm">Support</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-y-auto bg-background-light dark:bg-background-dark">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-8 bg-white dark:bg-background-dark/80 border-b border-primary/10 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              Fleet Safety Overview
            </h2>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative w-64">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
                search
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search vehicle, driver or alert..."
                className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-lg py-1.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative">
                <span className="material-symbols-outlined">notifications</span>
                <div className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-background-dark"></div>
              </button>
              <button className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <span className="material-symbols-outlined">account_circle</span>
              </button>
              <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden border border-primary/20">
                <span className="material-symbols-outlined text-primary text-xl">
                  person
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-8 space-y-8 max-w-7xl mx-auto w-full">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-background-dark/60 p-6 rounded-xl border border-primary/10 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Live Vehicles
                </p>
                <h3 className="text-3xl font-bold mt-1 text-slate-800 dark:text-slate-100 tracking-tight">
                  {MOCK_STATS.liveVehicles.toLocaleString()}
                </h3>
                <p className="text-xs text-emerald-500 font-bold mt-2 flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">
                    trending_up
                  </span>
                  {MOCK_STATS.liveVehiclesTrend} vs last hour
                </p>
              </div>
              <div className="bg-primary/10 p-3 rounded-lg">
                <span className="material-symbols-outlined text-primary text-3xl">
                  local_shipping
                </span>
              </div>
            </div>
            <div className="bg-white dark:bg-background-dark/60 p-6 rounded-xl border border-primary/10 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Active Rides
                </p>
                <h3 className="text-3xl font-bold mt-1 text-slate-800 dark:text-slate-100 tracking-tight">
                  {MOCK_STATS.activeRides}
                </h3>
                <p className="text-xs text-emerald-500 font-bold mt-2 flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">
                    trending_up
                  </span>
                  {MOCK_STATS.activeRidesTrend} vs last hour
                </p>
              </div>
              <div className="bg-blue-500/10 p-3 rounded-lg">
                <span className="material-symbols-outlined text-blue-500 text-3xl">
                  commute
                </span>
              </div>
            </div>
            <div className="bg-white dark:bg-background-dark/60 p-6 rounded-xl border border-primary/10 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  AI Safety Score
                </p>
                <h3 className="text-3xl font-bold mt-1 text-slate-800 dark:text-slate-100 tracking-tight">
                  {MOCK_STATS.aiSafetyScore}%
                </h3>
                <p className="text-xs text-emerald-500 font-bold mt-2 flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">
                    check_circle
                  </span>
                  {MOCK_STATS.aiSafetyStatus}
                </p>
              </div>
              <div className="bg-emerald-500/10 p-3 rounded-lg">
                <span className="material-symbols-outlined text-emerald-500 text-3xl">
                  psychology
                </span>
              </div>
            </div>
          </div>

          {/* AI Safety Engine Status */}
          <section>
            <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
              AI Safety Engine Status
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {MOCK_AI_STATUS.map((zone) => {
                const zoneStyles = {
                  emerald:
                    'border-l-emerald-500 bg-white dark:bg-background-dark/60',
                  amber: 'border-l-amber-500 bg-white dark:bg-background-dark/60',
                  red: 'border-l-red-500 bg-white dark:bg-background-dark/60',
                };
                const iconStyles = {
                  emerald:
                    'p-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 rounded-lg',
                  amber:
                    'p-2 bg-amber-50 dark:bg-amber-900/20 text-amber-500 rounded-lg',
                  red: 'p-2 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-lg',
                };
                return (
                  <div
                    key={zone.id}
                    className={`p-5 rounded-xl border-l-4 shadow-sm flex items-start gap-4 ${zoneStyles[zone.color] || zoneStyles.emerald}`}
                  >
                    <div className={iconStyles[zone.color] || iconStyles.emerald}>
                      <span className="material-symbols-outlined">
                        {zone.icon}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-slate-100">
                        {zone.title}
                      </h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {zone.count} {zone.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Vehicle List & Dashcam Status (compact) */}
          <section>
            <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
              Vehicle List & Dashcam Status
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {MOCK_VEHICLES.map((v) => (
                <div
                  key={v.id}
                  className="bg-white dark:bg-background-dark/60 p-4 rounded-xl border border-primary/10 shadow-sm"
                >
                  <p className="text-sm font-bold text-primary truncate">
                    {v.id}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {v.driver}
                  </p>
                  <div className="mt-2 flex items-center justify-between">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        v.status === 'critical'
                          ? 'bg-red-500'
                          : v.status === 'warning'
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                    />
                    <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          v.dashcam === 'recording'
                            ? 'bg-red-500 animate-pulse'
                            : 'bg-slate-400'
                        }`}
                      />
                      {v.dashcam}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Main Layout: Alerts Table & Live Map */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
            {/* Recent Incidents / AI Alerts Feed */}
            <div className="xl:col-span-2 bg-white dark:bg-background-dark/60 rounded-xl border border-primary/10 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-primary/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                    Recent Safety Alerts
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Live feed from AI monitoring system
                  </p>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  <select
                    value={severityFilter}
                    onChange={(e) => setSeverityFilter(e.target.value)}
                    className="text-sm border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-primary"
                  >
                    {SEVERITY_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <button className="text-sm text-primary font-semibold hover:underline">
                    View All Alerts
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 dark:bg-slate-800/50">
                    <tr className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
                      <th className="px-6 py-4">Timestamp</th>
                      <th className="px-6 py-4">Vehicle ID</th>
                      <th className="px-6 py-4">Alert Type</th>
                      <th className="px-6 py-4">Dashcam</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-primary/5">
                    {filteredAlerts.map((alert) => {
                      const statusStyle =
                        STATUS_COLORS[alert.alertTypeColor] ||
                        STATUS_COLORS.amber;
                      const statusBadge =
                        STATUS_COLORS[getStatusStyle(alert.status)] ||
                        STATUS_COLORS.amber;
                      return (
                        <tr
                          key={alert.id}
                          className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300 font-medium">
                            {alert.timestamp}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-primary">
                            {alert.vehicleId}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <span
                                className={`w-2 h-2 rounded-full ${statusStyle.dot}`}
                              />
                              <span className="text-sm text-slate-700 dark:text-slate-200">
                                {alert.alertType}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`text-[10px] font-medium flex items-center gap-1 ${
                                alert.dashcamStatus === 'recording'
                                  ? 'text-red-600 dark:text-red-400'
                                  : 'text-slate-500 dark:text-slate-400'
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  alert.dashcamStatus === 'recording'
                                    ? 'bg-red-500 animate-pulse'
                                    : 'bg-slate-400'
                                }`}
                              />
                              {alert.dashcamStatus}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${statusBadge.bg} ${statusBadge.text}`}
                            >
                              {alert.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
                                alert.actionPrimary
                                  ? 'bg-primary text-white hover:brightness-110'
                                  : 'border border-primary text-primary hover:bg-primary/5'
                              }`}
                            >
                              {alert.action}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {filteredAlerts.length === 0 && (
                <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                  No alerts match your filters.
                </div>
              )}
            </div>

            {/* Live Map Placeholder */}
            <div className="bg-white dark:bg-background-dark/60 rounded-xl border border-primary/10 shadow-sm h-full overflow-hidden flex flex-col">
              <div className="p-6 border-b border-primary/10">
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                  Live Deployment
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Current active regions
                </p>
              </div>
              <div className="flex-1 bg-slate-200 dark:bg-slate-800 relative min-h-[300px]">
                <div className="absolute inset-0 opacity-40 mix-blend-overlay bg-gradient-to-br from-slate-300 to-slate-500 dark:from-slate-700 dark:to-slate-900"></div>
                <div className="absolute top-1/4 left-1/3">
                  <div className="relative">
                    <div className="absolute -inset-2 bg-primary/40 rounded-full animate-ping"></div>
                    <div className="relative bg-primary w-4 h-4 rounded-full border-2 border-white"></div>
                  </div>
                </div>
                <div className="absolute bottom-1/3 right-1/4">
                  <div className="bg-red-500 w-4 h-4 rounded-full border-2 border-white shadow-lg"></div>
                </div>
                <div className="absolute top-1/2 right-1/2">
                  <div className="bg-primary w-3 h-3 rounded-full border-2 border-white opacity-60"></div>
                </div>
                <div className="absolute bottom-4 left-4 right-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm p-3 rounded-lg border border-primary/20 shadow-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded bg-primary/20 flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary">
                        map
                      </span>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-100 uppercase">
                        Active Region: Tech Corridor
                      </p>
                      <p className="text-[10px] text-slate-500">
                        412 active rides in this sector
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Action Area */}
          <div className="bg-primary/5 rounded-xl p-8 border border-primary/20 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-4xl">
                  security
                </span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                  Kavach AI Monitoring Active
                </h3>
                <p className="text-slate-500 dark:text-slate-400">
                  System is scanning 4,200 data points per second. AI Health:
                  99.8% uptime.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <button className="bg-white dark:bg-slate-800 border border-primary/20 text-primary px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-primary/5 transition-colors">
                Download Report
              </button>
              <button className="bg-primary text-white px-6 py-2.5 rounded-lg font-bold text-sm hover:brightness-110 shadow-lg shadow-primary/25 transition-all">
                System Configuration
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
