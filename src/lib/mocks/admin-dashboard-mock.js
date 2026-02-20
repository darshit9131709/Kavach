/**
 * Mock data for Admin Dashboard (UI only).
 * Replace with real API calls in the backend phase.
 */

export const PLATFORM_STATS = {
  totalUsers: 18420,
  totalCompanies: 214,
  pendingCompanies: 9,
  sosEventsToday: 17,
  aiAlertsToday: 64,
  uptime: '99.92%',
};

export const MOCK_USERS = [
  {
    id: 'u_1001',
    name: 'Aditi Sharma',
    email: 'aditi@example.com',
    role: 'user',
    status: 'active',
    createdAt: '2026-02-10',
    lastLogin: '2026-02-19 10:12',
  },
  {
    id: 'u_1002',
    name: 'Neha Verma',
    email: 'neha@example.com',
    role: 'user',
    status: 'active',
    createdAt: '2026-02-02',
    lastLogin: '2026-02-19 09:05',
  },
  {
    id: 'u_2001',
    name: 'Rohit Singh',
    email: 'rohit@fleetco.com',
    role: 'company',
    status: 'active',
    createdAt: '2026-01-28',
    lastLogin: '2026-02-19 08:41',
  },
  {
    id: 'u_9001',
    name: 'Super Admin',
    email: 'admin@kavach.app',
    role: 'admin',
    status: 'active',
    createdAt: '2026-01-01',
    lastLogin: '2026-02-19 10:21',
  },
];

export const MOCK_COMPANIES = [
  {
    id: 'c_301',
    name: 'FleetCo Mobility',
    email: 'ops@fleetco.com',
    status: 'approved', // approved | pending | rejected
    fleetSize: 1240,
    createdAt: '2026-01-20',
  },
  {
    id: 'c_302',
    name: 'SafeRide Transport',
    email: 'admin@saferide.io',
    status: 'pending',
    fleetSize: 420,
    createdAt: '2026-02-16',
  },
  {
    id: 'c_303',
    name: 'UrbanCab Services',
    email: 'security@urbancab.in',
    status: 'pending',
    fleetSize: 860,
    createdAt: '2026-02-17',
  },
  {
    id: 'c_304',
    name: 'MetroLink Logistics',
    email: 'hello@metrolink.co',
    status: 'rejected',
    fleetSize: 110,
    createdAt: '2026-02-05',
  },
];

export const MOCK_SOS_EVENTS = [
  {
    id: 'sos_8801',
    timestamp: '2026-02-19 10:42',
    userName: 'Aditi Sharma',
    userId: 'u_1001',
    location: 'Bangalore, KA',
    status: 'active', // active | resolved
  },
  {
    id: 'sos_8802',
    timestamp: '2026-02-19 10:20',
    userName: 'Neha Verma',
    userId: 'u_1002',
    location: 'Delhi, DL',
    status: 'resolved',
  },
  {
    id: 'sos_8803',
    timestamp: '2026-02-19 09:58',
    userName: 'Anonymous User',
    userId: 'u_1012',
    location: 'Mumbai, MH',
    status: 'active',
  },
];

export const MOCK_AI_ALERTS = [
  {
    id: 'ai_4101',
    timestamp: '2026-02-19 10:38',
    source: 'Company Fleet',
    entity: 'KA-01-EF-4291',
    type: 'SOS Keyword Detected',
    severity: 'critical', // critical | warning | info
    status: 'open', // open | investigating | closed
  },
  {
    id: 'ai_4102',
    timestamp: '2026-02-19 10:35',
    source: 'Company Fleet',
    entity: 'KA-05-GT-1120',
    type: 'Route Deviation',
    severity: 'warning',
    status: 'investigating',
  },
  {
    id: 'ai_4103',
    timestamp: '2026-02-19 10:12',
    source: 'User App',
    entity: 'u_1002',
    type: 'Unusual Stop Pattern',
    severity: 'info',
    status: 'closed',
  },
  {
    id: 'ai_4104',
    timestamp: '2026-02-19 09:55',
    source: 'User App',
    entity: 'u_1001',
    type: 'High-Risk Zone Entry',
    severity: 'warning',
    status: 'open',
  },
];

