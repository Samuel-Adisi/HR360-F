// src/api/dashboard.js
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

async function getToken() {
  return AsyncStorage.getItem("access_token");
}

async function apiFetch(path, options = {}) {
  const token = await getToken();
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers ?? {}),
    },
  });
  if (!res.ok) throw new Error(`API error ${res.status}: ${path}`);
  return res.json();
}

// ─── Mock Data ──────────────────────────────────────────────────────────────
export const MOCK_DASHBOARD = {
  user: {
    name: "Addison Adisi",
    role: "Employee",
    employee_id: "EMP-0042",
    department: { name: "Engineering" },
  },
  today: {
    status: "Present",
    is_on_leave: false,
    check_in: "08:32:00",
    check_out: null,
    hours_worked: 4.5,
    is_clocked_in: true,
  },
  attendance: {
    days_present: 18,
    days_absent: 2,
    days_late: 3,
    days_on_leave: 1,
    total_hours_worked: 144,
    attendance_rate: 82,
    last_month_rate: 77,
    last_month_days_late: 5,
  },
  leave: {
    pending: 1,
    approved: 3,
    total_days: 20,
    used_days: 8,
    active_leave: null,
    recent: [
      {
        id: 1,
        leave_type: "Annual Leave",
        start_date: "2025-04-01",
        end_date: "2025-04-03",
        status: "approved",
      },
      {
        id: 2,
        leave_type: "Sick Leave",
        start_date: "2025-04-15",
        end_date: "2025-04-15",
        status: "pending",
      },
    ],
  },
  payroll: {
    latest_net_pay: 4850.0,
    latest_pay_status: "paid",
    latest_pay_period: "April 2025",
    latest_pay_date: "Apr 30, 2025",
    basic_salary: 5500.0,
    tax: 385.0,
    deductions: 265.0,
  },
  notifications: [
    {
      id: "n1",
      type: "leave_approved",
      message: "Annual Leave approved",
      read: false,
      time: "2h ago",
    },
    {
      id: "n2",
      type: "salary_paid",
      message: "April salary has been paid",
      read: false,
      time: "1d ago",
    },
    {
      id: "n3",
      type: "info",
      message: "Team meeting at 3PM today",
      read: true,
      time: "3h ago",
    },
  ],
  work_location: {
    latitude: 5.6037,
    longitude: -0.187,
    radius_meters: 100,
    name: "Head Office",
  },
};

// ─── API Functions ──────────────────────────────────────────────────────────
export async function fetchDashboard() {
  // TODO: uncomment for real API:
  // return apiFetch("/api/dashboard/");
  await new Promise((r) => setTimeout(r, 700));
  return MOCK_DASHBOARD;
}

export async function clockIn(payload) {
  // TODO: return apiFetch("/api/attendance/clock-in/", { method: "POST", body: JSON.stringify(payload) });
  await new Promise((r) => setTimeout(r, 1000));
  return { success: true, check_in: new Date().toTimeString().slice(0, 8) };
}

export async function clockOut(payload) {
  // TODO: return apiFetch("/api/attendance/clock-out/", { method: "POST", body: JSON.stringify(payload) });
  await new Promise((r) => setTimeout(r, 1000));
  return {
    success: true,
    check_out: new Date().toTimeString().slice(0, 8),
    hours_worked: 8.0,
  };
}

export async function fetchNotifications() {
  // TODO: return apiFetch("/api/notifications/");
  await new Promise((r) => setTimeout(r, 300));
  return MOCK_DASHBOARD.notifications;
}
