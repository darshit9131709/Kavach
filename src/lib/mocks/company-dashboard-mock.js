/**
 * Mock data for Company Dashboard (UI only)
 */

export const MOCK_STATS = {
  liveVehicles: 1240,
  liveVehiclesTrend: '+2.4%',
  activeRides: 856,
  activeRidesTrend: '+1.8%',
  aiSafetyScore: 98,
  aiSafetyStatus: 'Optimized',
};

export const MOCK_AI_STATUS = [
  {
    id: 'safe',
    title: 'Safe Zone',
    count: 842,
    description: 'vehicles operating within normal safety parameters.',
    color: 'emerald',
    icon: 'gpp_good',
  },
  {
    id: 'warning',
    title: 'Warning Zone',
    count: 12,
    description: 'vehicles flagged for route deviations or unscheduled stops.',
    color: 'amber',
    icon: 'warning',
  },
  {
    id: 'incident',
    title: 'Incident Zone',
    count: 2,
    description: 'critical SOS alerts active. Response team dispatched.',
    color: 'red',
    icon: 'emergency_home',
  },
];

export const MOCK_ALERTS = [
  {
    id: '1',
    timestamp: '10:42 AM',
    vehicleId: 'KA-01-EF-4291',
    alertType: 'SOS Panic Button',
    alertTypeColor: 'red',
    status: 'Critical',
    statusColor: 'red',
    action: 'Respond',
    actionPrimary: true,
    dashcamStatus: 'recording',
  },
  {
    id: '2',
    timestamp: '10:38 AM',
    vehicleId: 'KA-05-GT-1120',
    alertType: 'Route Deviation',
    alertTypeColor: 'amber',
    status: 'Verifying',
    statusColor: 'amber',
    action: 'Details',
    actionPrimary: false,
    dashcamStatus: 'recording',
  },
  {
    id: '3',
    timestamp: '10:35 AM',
    vehicleId: 'KA-03-MR-9902',
    alertType: 'Unscheduled Stop',
    alertTypeColor: 'emerald',
    status: 'Resolved',
    statusColor: 'emerald',
    action: 'Log',
    actionPrimary: false,
    dashcamStatus: 'idle',
  },
  {
    id: '4',
    timestamp: '10:20 AM',
    vehicleId: 'KA-01-XY-5544',
    alertType: 'Late Arrival Alarm',
    alertTypeColor: 'amber',
    status: 'Attention',
    statusColor: 'amber',
    action: 'Call Driver',
    actionPrimary: false,
    dashcamStatus: 'recording',
  },
  {
    id: '5',
    timestamp: '10:15 AM',
    vehicleId: 'KA-02-BR-7788',
    alertType: 'SOS Panic Button',
    alertTypeColor: 'red',
    status: 'Critical',
    statusColor: 'red',
    action: 'Respond',
    actionPrimary: true,
    dashcamStatus: 'recording',
  },
  {
    id: '6',
    timestamp: '10:08 AM',
    vehicleId: 'KA-04-DL-3344',
    alertType: 'Speed Anomaly',
    alertTypeColor: 'amber',
    status: 'Resolved',
    statusColor: 'emerald',
    action: 'Log',
    actionPrimary: false,
    dashcamStatus: 'idle',
  },
];

export const MOCK_VEHICLES = [
  {
    id: 'KA-01-EF-4291',
    driver: 'Priya S.',
    status: 'critical',
    dashcam: 'recording',
  },
  {
    id: 'KA-05-GT-1120',
    driver: 'Rahul M.',
    status: 'warning',
    dashcam: 'recording',
  },
  { id: 'KA-03-MR-9902', driver: 'Anita K.', status: 'safe', dashcam: 'idle' },
  {
    id: 'KA-01-XY-5544',
    driver: 'Vikram R.',
    status: 'warning',
    dashcam: 'recording',
  },
  {
    id: 'KA-02-BR-7788',
    driver: 'Sneha P.',
    status: 'critical',
    dashcam: 'recording',
  },
  { id: 'KA-04-DL-3344', driver: 'Arjun T.', status: 'safe', dashcam: 'idle' },
];

export const SEVERITY_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'critical', label: 'Critical' },
  { value: 'warning', label: 'Warning' },
  { value: 'resolved', label: 'Resolved' },
];

