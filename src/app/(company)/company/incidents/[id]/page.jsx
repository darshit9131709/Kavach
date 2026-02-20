'use client';

export default function IncidentDetailPage({ params }) {
  const incidentId = params?.id || 'KV-8842';

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen font-display">
      {/* Top Navigation Bar */}
      <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-primary/10 bg-white dark:bg-slate-900 px-6 py-3 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="text-primary">
            <span className="material-symbols-outlined text-3xl">
              shield_with_heart
            </span>
          </div>
          <h2 className="text-slate-900 dark:text-slate-100 text-lg font-bold leading-tight tracking-tight">
            Kavach Enterprise
          </h2>
        </div>
        <nav className="hidden md:flex flex-1 justify-center gap-8">
          <a className="text-slate-600 dark:text-slate-400 text-sm font-medium hover:text-primary transition-colors">
            Dashboard
          </a>
          <a className="text-primary text-sm font-bold border-b-2 border-primary pb-1">
            Incidents
          </a>
          <a className="text-slate-600 dark:text-slate-400 text-sm font-medium hover:text-primary transition-colors">
            Fleet
          </a>
          <a className="text-slate-600 dark:text-slate-400 text-sm font-medium hover:text-primary transition-colors">
            Reports
          </a>
        </nav>
        <div className="flex items-center gap-4">
          <button className="flex items-center justify-center rounded-lg h-10 w-10 bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <button className="flex items-center justify-center rounded-lg h-10 w-10 bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
            <span className="material-symbols-outlined">settings</span>
          </button>
          <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden border border-primary/20">
            <span className="material-symbols-outlined text-primary">
              person
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-[1440px] mx-auto p-6 lg:p-8">
        {/* Breadcrumb & Title */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-2">
            <span className="hover:text-primary cursor-pointer">Incidents</span>
            <span className="material-symbols-outlined text-xs">
              chevron_right
            </span>
            <span className="text-slate-900 dark:text-slate-100 font-medium">
              Incident #{incidentId}
            </span>
          </div>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                Incident #{incidentId}
              </h1>
              <div className="flex items-center gap-3 mt-1">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5" />
                  Active - Under Review
                </span>
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                  Flagged 4m 12s ago • Route: Downtown Loop
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="px-5 h-11 flex items-center justify-center rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                Dismiss Incident
              </button>
              <button className="px-6 h-11 flex items-center justify-center rounded-lg bg-primary text-white font-bold text-sm shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all">
                <span className="material-symbols-outlined mr-2">
                  emergency_share
                </span>
                Escalate Protocol
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Video & Timeline */}
          <div className="lg:col-span-8 space-y-6">
            {/* Video Container */}
            <div className="bg-black rounded-xl overflow-hidden shadow-2xl relative aspect-video group">
              <img
                alt="Vehicle Cabin View"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDKykhMhAhI0cGDV8XwpoNMePDtTv6dt1PZXIRt8AZ0r5i-etDnUaOTbdfbqsyuhECTYVTdYUB2BKbvLBjk6LpRi78QcFQz8cjDGfqqHB_fgTlt-eNbLOsIMu-QA7uUTk4x54lIDyrTktZc9SG7VnX42phQjznH0jREfEMdD4EJduaVknA21GeeFQx1YbkViU-i3B1-ug6CK5lrZT7o-18nVX-E85p3B42co76D-6xcqIKT4vbAzpkiyBBDnu6PxHFIy6CZVwYcvjk"
                className="w-full h-full object-cover opacity-60"
              />
              {/* Overlay Controls */}
              <div className="absolute inset-0 flex flex-col justify-between p-6">
                <div className="flex justify-between items-start">
                  <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/20 flex items-center gap-2">
                    <span className="flex h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-white text-xs font-bold tracking-widest uppercase">
                      Live Feed - Cam 01
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button className="bg-black/40 p-2 rounded-lg text-white hover:bg-black/60">
                      <span className="material-symbols-outlined text-sm">
                        grid_view
                      </span>
                    </button>
                    <button className="bg-black/40 p-2 rounded-lg text-white hover:bg-black/60">
                      <span className="material-symbols-outlined text-sm">
                        fullscreen
                      </span>
                    </button>
                  </div>
                </div>
                <div className="flex justify-center">
                  <button className="size-16 rounded-full bg-primary/90 text-white flex items-center justify-center shadow-xl hover:scale-105 transition-transform">
                    <span className="material-symbols-outlined text-4xl leading-none">
                      play_arrow
                    </span>
                  </button>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-white text-xs font-medium">
                      04:12
                    </span>
                    <div className="h-1.5 flex-1 bg-white/20 rounded-full overflow-hidden relative">
                      <div className="absolute left-0 top-0 bottom-0 bg-primary w-[75%]" />
                      <div className="absolute left-[75%] top-1/2 -translate-y-1/2 size-3 bg-white rounded-full border-2 border-primary" />
                    </div>
                    <span className="text-white text-xs font-medium">
                      05:30
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-white/80">
                    <div className="flex items-center gap-4">
                      <span className="material-symbols-outlined cursor-pointer hover:text-white">
                        skip_previous
                      </span>
                      <span className="material-symbols-outlined cursor-pointer hover:text-white">
                        replay_10
                      </span>
                      <span className="material-symbols-outlined cursor-pointer hover:text-white">
                        forward_10
                      </span>
                      <span className="material-symbols-outlined cursor-pointer hover:text-white">
                        skip_next
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs font-mono uppercase tracking-wider bg-black/40 px-3 py-1 rounded">
                      <span>Lat: 34.0522 N</span>
                      <span>Long: 118.2437 W</span>
                      <span className="text-primary font-bold">42 MPH</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Incident Timeline */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">
                  history
                </span>
                Incident Timeline
              </h3>
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-[11px] before:w-0.5 before:-translate-x-1/2 before:bg-slate-200 dark:before:bg-slate-800">
                <div className="relative flex gap-4 items-start pl-8">
                  <div className="absolute left-0 mt-1 size-[22px] rounded-full border-4 border-white dark:border-slate-900 bg-red-500 z-10" />
                  <div className="flex-1">
                    <p className="text-sm font-bold">SOS Keyword Detected</p>
                    <p className="text-xs text-slate-500">
                      Audio trigger: &quot;Help, stop the car&quot;
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-wider">
                      04:12 Ago
                    </p>
                  </div>
                </div>
                <div className="relative flex gap-4 items-start pl-8">
                  <div className="absolute left-0 mt-1 size-[22px] rounded-full border-4 border-white dark:border-slate-900 bg-amber-500 z-10" />
                  <div className="flex-1">
                    <p className="text-sm font-bold">Erratic Steering Pattern</p>
                    <p className="text-xs text-slate-500">
                      Sharp 45° deviation from GPS route
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-wider">
                      04:45 Ago
                    </p>
                  </div>
                </div>
                <div className="relative flex gap-4 items-start pl-8 opacity-60">
                  <div className="absolute left-0 mt-1 size-[22px] rounded-full border-4 border-white dark:border-slate-900 bg-slate-300 dark:bg-slate-700 z-10" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Trip Commenced</p>
                    <p className="text-xs text-slate-500">
                      Pickup: Union Station, Terminal 2
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-wider">
                      12:30 Ago
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: AI & Info */}
          <div className="lg:col-span-4 space-y-6">
            {/* AI Confidence Card */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 overflow-hidden relative">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <span className="material-symbols-outlined text-6xl">
                  psychology
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-6">
                AI Confidence Score
              </h3>
              <div className="flex items-center justify-center gap-8">
                <div className="relative size-32">
                  <svg className="size-full" viewBox="0 0 100 100">
                    <circle
                      className="text-slate-100 dark:text-slate-800"
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      stroke="currentColor"
                      strokeWidth="10"
                    />
                    <circle
                      className="text-primary confidence-ring"
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      stroke="currentColor"
                      strokeDasharray="251.2"
                      strokeDashoffset="20.1"
                      strokeLinecap="round"
                      strokeWidth="10"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-black text-slate-900 dark:text-white">
                      92%
                    </span>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-lg font-bold text-primary">
                    High Potential Distress
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-tight">
                    Neural Engine detected verbal aggression &amp; route
                    deviation.
                  </p>
                </div>
              </div>
            </div>

            {/* Audio Status Indicator */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500">
                  In-Cabin Audio
                </h3>
                <span className="px-2 py-1 rounded bg-red-500/10 text-red-500 text-[10px] font-black uppercase">
                  Alert Active
                </span>
              </div>
              <div className="flex items-center gap-1.5 h-12">
                <div className="flex-1 bg-primary/20 h-1 rounded-full relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-between px-1">
                    <div className="w-1 bg-primary rounded-full h-[30%]" />
                    <div className="w-1 bg-primary rounded-full h-[60%]" />
                    <div className="w-1 bg-primary rounded-full h-[90%] animate-pulse" />
                    <div className="w-1 bg-primary rounded-full h-[40%]" />
                    <div className="w-1 bg-primary rounded-full h-[70%]" />
                    <div className="w-1 bg-primary rounded-full h-[20%]" />
                    <div className="w-1 bg-primary rounded-full h-[50%]" />
                    <div className="w-1 bg-primary rounded-full h-[80%] animate-pulse" />
                    <div className="w-1 bg-primary rounded-full h-[40%]" />
                    <div className="w-1 bg-primary rounded-full h-[30%]" />
                    <div className="w-1 bg-primary rounded-full h-[90%]" />
                    <div className="w-1 bg-primary rounded-full h-[50%]" />
                    <div className="w-1 bg-primary rounded-full h-[20%]" />
                  </div>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                <span>SOS Trigger: Detected</span>
                <button className="text-primary font-bold hover:underline">
                  Open Transcript
                </button>
              </div>
            </div>

            {/* Vehicle & Driver Info */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800">
              <div className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <span className="material-symbols-outlined text-primary bg-primary/10 p-2 rounded-lg">
                    directions_car
                  </span>
                  <div>
                    <h4 className="text-sm font-bold">Toyota Camry (2023)</h4>
                    <p className="text-xs text-slate-500 font-mono tracking-wider">
                      PLATE: KV-L89-442
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <p className="text-slate-400 mb-1 uppercase tracking-tighter font-semibold">
                      Fuel Level
                    </p>
                    <p className="font-bold">64% (240 mi)</p>
                  </div>
                  <div>
                    <p className="text-slate-400 mb-1 uppercase tracking-tighter font-semibold">
                      Last Service
                    </p>
                    <p className="font-bold">12 Days Ago</p>
                  </div>
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="size-10 rounded-lg bg-slate-200 overflow-hidden">
                    <img
                      alt="Driver"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBVi6JwEmgZni9frvkGPpy2dQnpJmluMx1CoFY1Y80REqh81fKZFncjWIAhXbS6BIYML0d1K98KavLu2vVC0N44rxW0bGR7SWEYivE3ZYb3j6-dBmEgddpiRz7S7DYUzMMIr00T4o8TWNQbO_c2-4gV9EbJXVRHy2vBI7v5R5_urTRrrahPUklpT0g1fPDwx87hMfAWCiAGuzY_HQTOgxMAU1I16c6yKbjKbcZwbuXPQGyPkQe4XPEiBLk-OyBxh2dcCqFsgy7kmvw"
                      className="size-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold">Marcus Thorne</h4>
                    <div className="flex items-center gap-1 text-amber-500">
                      <span className="material-symbols-outlined text-sm">
                        star
                      </span>
                      <span className="text-xs font-bold">4.92</span>
                      <span className="text-slate-400 font-normal ml-1 text-xs">
                        (2,402 rides)
                      </span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <p className="text-slate-400 mb-1 uppercase tracking-tighter font-semibold">
                      Security Clearance
                    </p>
                    <p className="font-bold text-green-600">
                      Level 3 - Elite
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-400 mb-1 uppercase tracking-tighter font-semibold">
                      Shift Hours
                    </p>
                    <p className="font-bold">04:12 / 08:00</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Mini Map */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
              <div className="h-40 bg-slate-200 relative group cursor-crosshair">
                <img
                  alt="Map"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCpsCZmyeQaePw8Va6_ANoD2lRCWOXOtALSR7bzj6O3fuY4Z9oADeagQmMIboUA8McsR2DkCK6GKZojnnvkhZ4JEbO04Ou82ZBd8eoVN-M57CZ645KDW2N-yuyv4gsDtcWGoDGLC2BFrs-80x7Pa24ZjdPII0fFZUihdDOEavOlU9lqCdyKRVh7QO96lQDmpkd2v_S6lRQop4c2PUBikgiIlVZ-grs40YAjVDPkfRITb_Cj-DMg3TB135aKXiR0VXTh-PG_WCC5HW0"
                  className="w-full h-full object-cover grayscale-[0.5] contrast-[1.2]"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    <div className="size-4 bg-primary rounded-full animate-ping absolute inset-0 opacity-50" />
                    <div className="size-4 bg-primary rounded-full border-2 border-white shadow-lg relative" />
                  </div>
                </div>
                <div className="absolute bottom-2 left-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur px-2 py-1 rounded text-[10px] font-bold shadow-sm">
                  37.7749° N, 122.4194° W
                </div>
              </div>
            </div>

            {/* Operator Notes */}
            <div className="space-y-3">
              <textarea
                rows={3}
                placeholder="Add situational notes..."
                className="w-full rounded-xl border-slate-200 dark:border-slate-800 dark:bg-slate-900 text-sm focus:ring-primary focus:border-primary placeholder:text-slate-400"
              />
              <button className="w-full py-3 bg-slate-900 dark:bg-slate-100 dark:text-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 transition-colors text-sm">
                Submit Observations
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

