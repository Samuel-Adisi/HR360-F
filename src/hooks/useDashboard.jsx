// src/hooks/useDashboard.js
import * as Haptics from "expo-haptics";
import * as Location from "expo-location";
import { useCallback, useEffect, useRef, useState } from "react";
import {
    clockIn,
    clockOut,
    fetchDashboard,
    fetchNotifications,
} from "../api/dashboard";

const REFRESH_INTERVAL_MS = 45000; // 45 seconds

function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function useDashboard() {
  const [data, setData] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [sectionErrors, setSectionErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [clockLoading, setClockLoading] = useState(false);
  const [toast, setToast] = useState(null); // { message, type: 'success'|'error' }
  const intervalRef = useRef(null);

  // ── Load dashboard ────────────────────────────────────────────────────────
  const load = useCallback(async (isRefresh = false) => {
    try {
      if (!isRefresh) setLoading(true);
      const [dash, notifs] = await Promise.allSettled([
        fetchDashboard(),
        fetchNotifications(),
      ]);
      if (dash.status === "fulfilled") {
        setData(dash.value);
        setSectionErrors((prev) => ({ ...prev, dashboard: null }));
      } else {
        setSectionErrors((prev) => ({
          ...prev,
          dashboard: dash.reason?.message,
        }));
      }
      if (notifs.status === "fulfilled") {
        setNotifications(notifs.value);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // ── Auto-refresh ──────────────────────────────────────────────────────────
  useEffect(() => {
    load();
    intervalRef.current = setInterval(() => load(true), REFRESH_INTERVAL_MS);
    return () => clearInterval(intervalRef.current);
  }, [load]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    load(true);
  }, [load]);

  // ── Show toast ────────────────────────────────────────────────────────────
  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  // ── Clock in/out ──────────────────────────────────────────────────────────
  const handleClock = useCallback(async () => {
    if (clockLoading) return;
    const isClockedIn = data?.today?.is_clocked_in ?? false;

    // ── Location check ────────────────────────────────────────────────────
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        showToast("Location permission required to clock in", "error");
        return;
      }
      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      const wl = data?.work_location;
      if (wl) {
        const dist = getDistance(
          loc.coords.latitude,
          loc.coords.longitude,
          wl.latitude,
          wl.longitude,
        );
        if (dist > wl.radius_meters) {
          showToast(
            `You are ${Math.round(dist)}m away from ${wl.name}. Must be within ${wl.radius_meters}m.`,
            "error",
          );
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          return;
        }
      }
      const coords = {
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      };

      // ── Optimistic update ───────────────────────────────────────────────
      setClockLoading(true);
      const now = new Date().toTimeString().slice(0, 8);
      setData((prev) => ({
        ...prev,
        today: {
          ...prev.today,
          is_clocked_in: !isClockedIn,
          ...(isClockedIn
            ? { check_out: now }
            : { check_in: now, status: "Present" }),
        },
      }));
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      // ── API call ────────────────────────────────────────────────────────
      if (isClockedIn) {
        await clockOut(coords);
        showToast("Clocked out successfully", "success");
      } else {
        await clockIn(coords);
        showToast("Clocked in successfully", "success");
      }
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      load(true); // re-sync
    } catch (err) {
      // Revert optimistic update on failure
      setData((prev) => ({
        ...prev,
        today: { ...prev.today, is_clocked_in: isClockedIn },
      }));
      showToast("Clock action failed. Try again.", "error");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setClockLoading(false);
    }
  }, [clockLoading, data, load, showToast]);

  // ── Insights ──────────────────────────────────────────────────────────────
  const insights = (() => {
    if (!data) return [];
    const { attendance, leave } = data;
    const results = [];
    const rateDiff =
      (attendance.attendance_rate ?? 0) - (attendance.last_month_rate ?? 0);
    const lateDiff =
      (attendance.days_late ?? 0) - (attendance.last_month_days_late ?? 0);

    if (rateDiff > 0)
      results.push({
        icon: "trending-up",
        color: "#059669",
        text: `Attendance improved by ${rateDiff}% vs last month 🎉`,
      });
    else if (rateDiff < 0)
      results.push({
        icon: "trending-down",
        color: "#DC2626",
        text: `Attendance dropped ${Math.abs(rateDiff)}% vs last month`,
      });

    if ((attendance.days_late ?? 0) >= 3)
      results.push({
        icon: "time-outline",
        color: "#F59E0B",
        text: `You've been late ${attendance.days_late} times this month`,
      });
    if (lateDiff < 0)
      results.push({
        icon: "checkmark-circle-outline",
        color: "#059669",
        text: `${Math.abs(lateDiff)} fewer late days than last month`,
      });

    if ((attendance.attendance_rate ?? 0) >= 95)
      results.push({
        icon: "star-outline",
        color: "#7C3AED",
        text: "Outstanding attendance — you're in the top tier!",
      });
    else if ((attendance.attendance_rate ?? 0) >= 80)
      results.push({
        icon: "checkmark-done-outline",
        color: "#0F766E",
        text: "You are on track for full attendance this month",
      });

    if ((leave.used_days ?? 0) === 0)
      results.push({
        icon: "calendar-outline",
        color: "#0A66C2",
        text: "You haven't taken any leave yet this year",
      });

    return results.slice(0, 3);
  })();

  const unreadCount = notifications.filter((n) => !n.read).length;

  return {
    data,
    loading,
    refreshing,
    onRefresh,
    sectionErrors,
    clockLoading,
    handleClock,
    toast,
    insights,
    notifications,
    unreadCount,
  };
}
