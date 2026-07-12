import React, { useState, useEffect } from "react";
import {
  LayoutDashboard, Car, Users, Route, Navigation2, Wrench, Fuel,
  DollarSign, BarChart3, FileText, Bell, Settings, LogOut, Sun, Moon,
  TrendingUp, AlertTriangle, Clock, ArrowUpRight, ArrowDownRight,
  Download, Search, Plus, Shield, UserCheck, FileWarning, Award,
  Truck, ChevronRight, Eye, EyeOff, Target, BookOpen, Filter,
  MapPin, Activity, X, RefreshCw,
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
const API = "https://transitops-odoo-844v.onrender.com/api";

// ─── Types ────────────────────────────────────────────────────────────────────

type Role = "admin" | "driver" | "safety" | "finance";

interface UserRecord {
  email: string;
  password: string;
  role: Role;
  name: string;
  title: string;
  initials: string;
  color: string;
}

// ─── Auth Data ────────────────────────────────────────────────────────────────

const USERS: UserRecord[] = [
  { email: "admin@transitops.com", password: "Admin123!", role: "admin", name: "Marcus Chen", title: "Fleet Manager", initials: "MC", color: "#2563EB" },
  { email: "driver@transitops.com", password: "Driver123!", role: "driver", name: "James Rodriguez", title: "Senior Driver", initials: "JR", color: "#14B8A6" },
  { email: "safety@transitops.com", password: "Safety123!", role: "safety", name: "Sarah Mitchell", title: "Safety Officer", initials: "SM", color: "#F59E0B" },
  { email: "finance@transitops.com", password: "Finance123!", role: "finance", name: "David Park", title: "Financial Analyst", initials: "DP", color: "#8B5CF6" },
];

// ─── Nav Config ───────────────────────────────────────────────────────────────

type NavItem = { id: string; label: string; icon: React.ElementType; badge?: number };

const NAV: Record<Role, NavItem[]> = {
  admin: [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "vehicles", label: "Vehicles", icon: Car },
    { id: "drivers", label: "Drivers", icon: Users },
    { id: "trips", label: "Trips", icon: Route },
    { id: "dispatch", label: "Dispatch", icon: Navigation2 },
    { id: "maintenance", label: "Maintenance", icon: Wrench },
    { id: "fuel", label: "Fuel", icon: Fuel },
    { id: "expenses", label: "Expenses", icon: DollarSign },
    { id: "reports", label: "Reports", icon: FileText },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "documents", label: "Documents", icon: BookOpen },
    { id: "users", label: "Users", icon: UserCheck },
    { id: "notifications", label: "Notifications", icon: Bell, badge: 4 },
    { id: "settings", label: "Settings", icon: Settings },
  ],
  driver: [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "my-trips", label: "My Trips", icon: Route },
    { id: "vehicle", label: "Assigned Vehicle", icon: Car },
    { id: "fuel-log", label: "Fuel Log", icon: Fuel },
    { id: "history", label: "Trip History", icon: Clock },
    { id: "profile", label: "Profile", icon: UserCheck },
    { id: "notifications", label: "Notifications", icon: Bell, badge: 2 },
  ],
  safety: [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "compliance", label: "Driver Compliance", icon: Shield },
    { id: "license", label: "License Verification", icon: FileText },
    { id: "scores", label: "Safety Scores", icon: Award },
    { id: "incidents", label: "Incident Reports", icon: FileWarning },
    { id: "alerts", label: "Alerts", icon: AlertTriangle, badge: 3 },
  ],
  finance: [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "expenses", label: "Expenses", icon: DollarSign },
    { id: "fuel-cost", label: "Fuel Cost", icon: Fuel },
    { id: "revenue", label: "Revenue", icon: TrendingUp },
    { id: "roi", label: "ROI", icon: Target },
    { id: "reports", label: "Reports", icon: FileText },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "export", label: "Export", icon: Download },
  ],
};

// ─── Mock Data ────────────────────────────────────────────────────────────────

const tripVolumeData = [
  { day: "Mon", trips: 42, revenue: 8400 },
  { day: "Tue", trips: 58, revenue: 11600 },
  { day: "Wed", trips: 51, revenue: 10200 },
  { day: "Thu", trips: 67, revenue: 13400 },
  { day: "Fri", trips: 73, revenue: 14600 },
  { day: "Sat", trips: 38, revenue: 7600 },
  { day: "Sun", trips: 29, revenue: 5800 },
];

const fuelBreakdown = [
  { name: "Diesel", value: 54, color: "#2563EB" },
  { name: "Petrol", value: 28, color: "#14B8A6" },
  { name: "Electric", value: 12, color: "#8B5CF6" },
  { name: "Hybrid", value: 6, color: "#F59E0B" },
];

const revenueExpense = [
  { month: "Jan", revenue: 124000, expenses: 89000 },
  { month: "Feb", revenue: 138000, expenses: 95000 },
  { month: "Mar", revenue: 152000, expenses: 98000 },
  { month: "Apr", revenue: 141000, expenses: 102000 },
  { month: "May", revenue: 168000, expenses: 108000 },
  { month: "Jun", revenue: 179000, expenses: 112000 },
];

const fuelCostData = [
  { month: "Jan", diesel: 12400, petrol: 6800, electric: 1200 },
  { month: "Feb", diesel: 13200, petrol: 7100, electric: 1400 },
  { month: "Mar", diesel: 14100, petrol: 7600, electric: 1800 },
  { month: "Apr", diesel: 13800, petrol: 7300, electric: 2100 },
  { month: "May", diesel: 15200, petrol: 8100, electric: 2400 },
  { month: "Jun", diesel: 14900, petrol: 7800, electric: 2800 },
];

const safetyScoreData = [
  { driver: "J. Smith", score: 94 },
  { driver: "M. Johnson", score: 87 },
  { driver: "R. Williams", score: 79 },
  { driver: "K. Brown", score: 92 },
  { driver: "L. Davis", score: 68 },
];

const incidentTrend = [
  { week: "W1", incidents: 3 },
  { week: "W2", incidents: 5 },
  { week: "W3", incidents: 2 },
  { week: "W4", incidents: 4 },
  { week: "W5", incidents: 1 },
  { week: "W6", incidents: 3 },
];

const driverWeeklyKm = [
  { day: "Mon", km: 124 },
  { day: "Tue", km: 187 },
  { day: "Wed", km: 142 },
  { day: "Thu", km: 198 },
  { day: "Fri", km: 167 },
  { day: "Sat", km: 98 },
  { day: "Sun", km: 0 },
];

const recentTrips = [
  { id: "TR-2847", driver: "J. Rodriguez", vehicle: "BUS-042", route: "CBD → Airport T2", status: "completed", distance: "47 km", revenue: "$186" },
  { id: "TR-2846", driver: "M. Santos", vehicle: "VAN-018", route: "North → Central", status: "in-progress", distance: "22 km", revenue: "$94" },
  { id: "TR-2845", driver: "D. Kim", vehicle: "BUS-037", route: "East → West Hub", status: "completed", distance: "63 km", revenue: "$248" },
  { id: "TR-2844", driver: "A. Patel", vehicle: "COACH-09", route: "City → Beach", status: "cancelled", distance: "—", revenue: "$0" },
  { id: "TR-2843", driver: "T. Wilson", vehicle: "VAN-024", route: "Hospital → Home", status: "completed", distance: "18 km", revenue: "$72" },
];

const vehicles = [
  { id: "BUS-042", type: "Bus", driver: "James Rodriguez", status: "active", km: "142,847", fuel: 74, next: "3 days" },
  { id: "VAN-018", type: "Van", driver: "Maria Santos", status: "active", km: "87,234", fuel: 91, next: "1 week" },
  { id: "BUS-037", type: "Bus", driver: "David Kim", status: "active", km: "198,102", fuel: 45, next: "Overdue" },
  { id: "COACH-09", type: "Coach", driver: "Unassigned", status: "maintenance", km: "56,789", fuel: 62, next: "In service" },
  { id: "TRUCK-11", type: "Truck", driver: "Tom Wilson", status: "active", km: "231,445", fuel: 28, next: "5 days" },
];

const maintenanceAlerts = [
  { vehicle: "BUS-042", type: "Oil Change", due: "2 days", priority: "high" },
  { vehicle: "TRUCK-11", type: "Brake Inspection", due: "5 days", priority: "medium" },
  { vehicle: "VAN-018", type: "Tyre Rotation", due: "1 week", priority: "low" },
  { vehicle: "COACH-03", type: "Engine Service", due: "Overdue", priority: "critical" },
];

const complianceDrivers = [
  { name: "James Rodriguez", score: 94, license: "active", training: "Jun 12, 2026", incidents: 0, status: "active" },
  { name: "Maria Santos", score: 87, license: "active", training: "May 28, 2026", incidents: 1, status: "active" },
  { name: "David Kim", score: 79, license: "expiring", training: "Mar 15, 2026", incidents: 2, status: "active" },
  { name: "Aisha Patel", score: 92, license: "active", training: "Jul 1, 2026", incidents: 0, status: "active" },
  { name: "Tom Wilson", score: 68, license: "expired", training: "Jan 20, 2026", incidents: 3, status: "suspended" },
];

// ─── Utility ──────────────────────────────────────────────────────────────────

function cx(...classes: (string | false | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

// ─── Shared UI Components ─────────────────────────────────────────────────────

function Av({ initials, color, size = "md" }: { initials: string; color: string; size?: "sm" | "md" | "lg" }) {
  const s = { sm: "w-7 h-7 text-[11px]", md: "w-8 h-8 text-xs", lg: "w-10 h-10 text-sm" }[size];
  return (
    <div className={cx("rounded-full flex items-center justify-center text-white font-bold flex-shrink-0", s)} style={{ backgroundColor: color }}>
      {initials}
    </div>
  );
}

function Badge({ label, variant }: { label: string; variant?: string }) {
  const map: Record<string, string> = {
    "completed": "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800",
    "in-progress": "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800",
    "cancelled": "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800",
    "active": "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800",
    "maintenance": "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800",
    "suspended": "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800",
    "critical": "bg-red-100 text-red-700 border-red-300 dark:bg-red-900/30 dark:text-red-400 dark:border-red-700",
    "high": "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800",
    "medium": "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800",
    "low": "bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700",
    "expiring": "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800",
    "expired": "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800",
  };
  const v = variant || label;
  return (
    <span className={cx("inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border", map[v] || map.low)}>
      {label.replace(/-/g, " ")}
    </span>
  );
}

function KpiCard({ title, value, change, up, icon: Icon, iconBg, iconColor }: {
  title: string; value: string; change: string; up: boolean;
  icon: React.ElementType; iconBg: string; iconColor: string;
}) {
  return (
    <div className="bg-card border border-border rounded-xl p-5 hover:shadow-md transition-all duration-200 group">
      <div className="flex items-start justify-between mb-4">
        <div className={cx("p-2.5 rounded-xl transition-transform group-hover:scale-105", iconBg)}>
          <Icon className={cx("w-5 h-5", iconColor)} />
        </div>
        <div className={cx(
          "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
          up ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400"
             : "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400"
        )}>
          {up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {change}
        </div>
      </div>
      <p className="text-2xl font-bold text-foreground tracking-tight">{value}</p>
      <p className="text-xs text-muted-foreground mt-1 font-medium uppercase tracking-wide">{title}</p>
    </div>
  );
}

function Card({ title, action, children, className }: { title?: string; action?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <div className={cx("bg-card border border-border rounded-xl overflow-hidden", className)}>
      {title && (
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-border">
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          {action}
        </div>
      )}
      {children}
    </div>
  );
}

function ChartTip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-lg shadow-xl p-3 text-xs min-w-[120px]">
      <p className="font-semibold text-foreground mb-2">{label}</p>
      {payload.map((e: any, i: number) => (
        <p key={i} className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: e.color }} />
          <span className="text-muted-foreground">{e.name}:</span>
          <span className="font-semibold text-foreground ml-auto">
            {typeof e.value === "number" && e.value > 999 ? `$${e.value.toLocaleString()}` : e.value}
          </span>
        </p>
      ))}
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

function Sidebar({ user, active, onNav, collapsed, onCollapse, dark, onDark, onLogout }: {
  user: UserRecord; active: string; onNav: (id: string) => void;
  collapsed: boolean; onCollapse: () => void;
  dark: boolean; onDark: () => void; onLogout: () => void;
}) {
  const items = NAV[user.role];
  const sectionLabel = { admin: "Fleet Management", driver: "Driver Portal", safety: "Safety Center", finance: "Finance Hub" }[user.role];

  return (
    <aside className={cx(
      "flex flex-col h-full bg-card border-r border-border flex-shrink-0 transition-all duration-300 ease-in-out",
      collapsed ? "w-[60px]" : "w-60"
    )}>
      {/* Logo */}
      <div className={cx("flex items-center border-b border-border h-16 px-4 flex-shrink-0", collapsed ? "justify-center" : "justify-between")}>
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0 shadow-sm">
            <Truck className="w-4 h-4 text-white" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-sm font-bold text-foreground leading-none tracking-tight">TransitOps</p>
              <p className="text-[10px] text-muted-foreground mt-0.5 font-semibold uppercase tracking-widest">Platform</p>
            </div>
          )}
        </div>
        {!collapsed && (
          <button onClick={onCollapse} className="p-1.5 rounded-md hover:bg-muted text-muted-foreground transition-colors">
            <ChevronRight className="w-3.5 h-3.5 rotate-180" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {!collapsed && (
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-3 mb-2 mt-1">{sectionLabel}</p>
        )}
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNav(item.id)}
              title={collapsed ? item.label : undefined}
              className={cx(
                "w-full flex items-center rounded-lg text-sm font-medium transition-all duration-150 relative",
                collapsed ? "justify-center px-0 py-2.5" : "gap-3 px-3 py-2",
                isActive
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {!collapsed && (
                <>
                  <span className="flex-1 text-left truncate">{item.label}</span>
                  {item.badge && (
                    <span className="bg-red-500 text-white text-[10px] rounded-full min-w-[16px] h-4 flex items-center justify-center px-1 font-bold">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
              {collapsed && item.badge && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-card" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="border-t border-border p-2 space-y-1 flex-shrink-0">
        <button
          onClick={onDark}
          title={dark ? "Light Mode" : "Dark Mode"}
          className={cx(
            "w-full flex items-center rounded-lg text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors",
            collapsed ? "justify-center py-2.5 px-0" : "gap-3 px-3 py-2"
          )}
        >
          {dark ? <Sun className="w-4 h-4 flex-shrink-0" /> : <Moon className="w-4 h-4 flex-shrink-0" />}
          {!collapsed && <span>{dark ? "Light Mode" : "Dark Mode"}</span>}
        </button>

        {collapsed && (
          <button onClick={onCollapse} className="w-full flex items-center justify-center py-2.5 rounded-lg text-muted-foreground hover:bg-muted transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>
        )}

        <div className={cx("flex items-center rounded-lg px-2 py-2 hover:bg-muted cursor-pointer transition-colors", collapsed ? "justify-center" : "gap-3")}>
          <Av initials={user.initials} color={user.color} />
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-foreground truncate">{user.name}</p>
              <p className="text-[11px] text-muted-foreground truncate">{user.title}</p>
            </div>
          )}
        </div>

        <button
          onClick={onLogout}
          title="Sign Out"
          className={cx(
            "w-full flex items-center rounded-lg text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors",
            collapsed ? "justify-center py-2.5 px-0" : "gap-3 px-3 py-2"
          )}
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}

// ─── Top Bar ──────────────────────────────────────────────────────────────────

function TopBar({ title, subtitle, user }: { title: string; subtitle: string; user: UserRecord }) {
  const now = new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  return (
    <header className="flex items-center justify-between px-6 h-16 bg-card border-b border-border flex-shrink-0">
      <div>
        <h1 className="text-base font-semibold text-foreground leading-tight">{title}</h1>
        <p className="text-[11px] text-muted-foreground mt-0.5">{subtitle} · {now}</p>
      </div>
      <div className="flex items-center gap-2">
        <div className="relative hidden sm:flex items-center">
          <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-muted border border-border rounded-lg pl-9 pr-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground w-44 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 transition-all"
          />
        </div>
        <button className="relative p-2 rounded-lg hover:bg-muted text-muted-foreground transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-card" />
        </button>
        <Av initials={user.initials} color={user.color} />
      </div>
    </header>
  );
}

// ─── Admin Dashboard ──────────────────────────────────────────────────────────

function AdminDashboard() {
  return (
    <div className="p-6 space-y-5">
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard title="Total Vehicles" value="48" change="+3 this month" up={true} icon={Car} iconBg="bg-blue-50 dark:bg-blue-900/20" iconColor="text-blue-600 dark:text-blue-400" />
        <KpiCard title="Active Drivers" value="37" change="+2 this week" up={true} icon={Users} iconBg="bg-teal-50 dark:bg-teal-900/20" iconColor="text-teal-600 dark:text-teal-400" />
        <KpiCard title="Trips Today" value="127" change="-8 vs yesterday" up={false} icon={Route} iconBg="bg-purple-50 dark:bg-purple-900/20" iconColor="text-purple-600 dark:text-purple-400" />
        <KpiCard title="Revenue (MTD)" value="$179K" change="+12.4% vs last" up={true} icon={DollarSign} iconBg="bg-emerald-50 dark:bg-emerald-900/20" iconColor="text-emerald-600 dark:text-emerald-400" />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <Card title="Trip Volume & Revenue — Last 7 Days" action={
            <div className="flex gap-2">
              <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground px-2 py-1 rounded-md hover:bg-muted transition-colors">
                <Filter className="w-3 h-3" /> Filter
              </button>
              <button className="flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 px-2 py-1 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                <Download className="w-3 h-3" /> Export
              </button>
            </div>
          }>
            <div className="p-5">
              <ResponsiveContainer width="100%" height={210}>
                <AreaChart data={tripVolumeData} margin={{ top: 4, right: 4, left: -18, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gT" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.18} />
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gR" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.18} />
                      <stop offset="95%" stopColor="#14B8A6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" strokeOpacity={0.6} />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTip />} />
                  <Legend iconSize={8} wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
                  <Area type="monotone" dataKey="trips" name="Trips" stroke="#2563EB" strokeWidth={2} fill="url(#gT)" dot={false} activeDot={{ r: 5, strokeWidth: 0 }} />
                  <Area type="monotone" dataKey="revenue" name="Revenue ($)" stroke="#14B8A6" strokeWidth={2} fill="url(#gR)" dot={false} activeDot={{ r: 5, strokeWidth: 0 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        <Card title="Fuel Type Breakdown">
          <div className="p-5">
            <ResponsiveContainer width="100%" height={170}>
              <PieChart>
                <Pie data={fuelBreakdown} cx="50%" cy="50%" innerRadius={52} outerRadius={78} paddingAngle={3} dataKey="value" strokeWidth={0}>
                  {fuelBreakdown.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip formatter={(v) => [`${v}%`, ""]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-3">
              {fuelBreakdown.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-xs text-muted-foreground flex-1">{item.name}</span>
                  <span className="text-xs font-bold text-foreground">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <Card title="Recent Trips" action={
            <button className="flex items-center gap-1.5 text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors font-medium">
              <Plus className="w-3 h-3" /> New Trip
            </button>
          }>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    {["Trip ID", "Driver", "Route", "Status", "Revenue"].map(h => (
                      <th key={h} className="text-left text-[11px] font-semibold text-muted-foreground px-5 py-3 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentTrips.map((t) => (
                    <tr key={t.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors cursor-pointer">
                      <td className="px-5 py-3 text-xs font-mono font-semibold text-blue-600 dark:text-blue-400">{t.id}</td>
                      <td className="px-5 py-3 text-xs text-foreground font-medium">{t.driver}</td>
                      <td className="px-5 py-3 text-xs text-muted-foreground">{t.route}</td>
                      <td className="px-5 py-3"><Badge label={t.status} /></td>
                      <td className="px-5 py-3 text-xs font-bold text-foreground">{t.revenue}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        <Card title="Maintenance Alerts" action={<span className="text-xs font-semibold text-red-500">4 pending</span>}>
          <div className="p-3 space-y-2">
            {maintenanceAlerts.map((a) => (
              <div key={a.vehicle} className="flex items-center gap-3 p-3 rounded-lg bg-muted/40 hover:bg-muted/70 transition-colors cursor-pointer">
                <div className={cx("p-1.5 rounded-lg flex-shrink-0", {
                  critical: "bg-red-100 dark:bg-red-900/30",
                  high: "bg-orange-100 dark:bg-orange-900/30",
                  medium: "bg-amber-100 dark:bg-amber-900/30",
                  low: "bg-slate-100 dark:bg-slate-800",
                }[a.priority] || "")}>
                  <Wrench className={cx("w-3.5 h-3.5", {
                    critical: "text-red-600 dark:text-red-400",
                    high: "text-orange-600 dark:text-orange-400",
                    medium: "text-amber-600 dark:text-amber-400",
                    low: "text-slate-500",
                  }[a.priority] || "")} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-foreground font-mono">{a.vehicle}</p>
                  <p className="text-xs text-muted-foreground">{a.type}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <Badge label={a.priority} variant={a.priority} />
                  <p className="text-[10px] text-muted-foreground mt-1">{a.due}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
  const [summary, setSummary] = useState<any>(null);

useEffect(() => {

  const token = localStorage.getItem("token");

  fetch(`${API}/dashboard/summary`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then((data) => setSummary(data.data))
    .catch(console.error);

}, []);
}

function AdminVehicles() {
  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div className="relative flex items-center">
          <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-3 pointer-events-none" />
          <input type="text" placeholder="Search vehicles..." className="bg-muted border border-border rounded-lg pl-9 pr-3 py-2 text-sm w-60 focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-foreground placeholder:text-muted-foreground" />
        </div>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm">
          <Plus className="w-4 h-4" /> Add Vehicle
        </button>
      </div>
      <Card title="Fleet Overview — 48 Vehicles">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                {["Vehicle ID", "Type", "Assigned Driver", "Odometer", "Fuel Level", "Next Service", "Status"].map(h => (
                  <th key={h} className="text-left text-[11px] font-semibold text-muted-foreground px-5 py-3 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {vehicles.map((v) => (
                <tr key={v.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors cursor-pointer">
                  <td className="px-5 py-3.5 text-xs font-mono font-bold text-blue-600 dark:text-blue-400">{v.id}</td>
                  <td className="px-5 py-3.5 text-xs text-foreground">{v.type}</td>
                  <td className="px-5 py-3.5 text-xs text-foreground font-medium">{v.driver}</td>
                  <td className="px-5 py-3.5 text-xs text-muted-foreground font-mono">{v.km} km</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-muted rounded-full h-1.5">
                        <div
                          className={cx("h-1.5 rounded-full transition-all", v.fuel > 50 ? "bg-emerald-500" : v.fuel > 25 ? "bg-amber-500" : "bg-red-500")}
                          style={{ width: `${v.fuel}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground font-mono">{v.fuel}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={cx("text-xs font-semibold",
                      v.next === "Overdue" ? "text-red-500" :
                      v.next === "In service" ? "text-orange-500" :
                      v.next.includes("day") ? "text-amber-500" : "text-muted-foreground"
                    )}>{v.next}</span>
                  </td>
                  <td className="px-5 py-3.5"><Badge label={v.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function AdminGeneric({ nav }: { nav: string }) {
  const item = NAV.admin.find(n => n.id === nav);
  const Icon = item?.icon || BarChart3;
  return (
    <div className="p-6 flex flex-col items-center justify-center min-h-[440px] text-center">
      <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mb-4">
        <Icon className="w-7 h-7 text-blue-600 dark:text-blue-400" />
      </div>
      <h2 className="text-lg font-bold text-foreground mb-2">{item?.label}</h2>
      <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
        This module is fully operational. Data is synchronized from your connected fleet systems in real-time.
      </p>
      <div className="mt-6 flex gap-3">
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4" /> Add Record
        </button>
        <button className="flex items-center gap-2 border border-border text-foreground px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-muted transition-colors">
          <Download className="w-4 h-4" /> Export
        </button>
      </div>
    </div>
  );
}

function AdminContent({ nav }: { nav: string }) {
  if (nav === "dashboard") return <AdminDashboard />;
  if (nav === "vehicles") return <AdminVehicles />;
  return <div className="p-6"><AdminGeneric nav={nav} /></div>;
}

// ─── Driver Dashboard ─────────────────────────────────────────────────────────

function DriverDashboard({ user }: { user: UserRecord }) {
  const [tripActive, setTripActive] = useState(false);

  return (
    <div className="p-6 space-y-5">
      {/* Current / Next Trip */}
      <div className={cx(
        "rounded-xl p-6 border transition-all duration-500",
        tripActive
          ? "bg-gradient-to-r from-blue-600 to-teal-500 border-transparent text-white shadow-lg"
          : "bg-card border-border"
      )}>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className={cx("inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider mb-2 px-2 py-1 rounded-full",
              tripActive ? "bg-white/20 text-white" : "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
            )}>
              {tripActive ? <><span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" /> Trip Active</> : "Next Trip"}
            </div>
            <h2 className={cx("text-xl font-bold mb-2", tripActive ? "text-white" : "text-foreground")}>CBD → Airport Terminal 2</h2>
            <div className={cx("flex flex-wrap items-center gap-4 text-sm", tripActive ? "text-blue-100" : "text-muted-foreground")}>
              <span className="flex items-center gap-1.5"><Car className="w-3.5 h-3.5" /> BUS-042</span>
              <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> 47 km</span>
              <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> ~1h 24m</span>
            </div>
          </div>
          <button
            onClick={() => setTripActive(!tripActive)}
            className={cx(
              "px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 flex-shrink-0 shadow-sm",
              tripActive
                ? "bg-white text-blue-600 hover:bg-blue-50"
                : "bg-blue-600 text-white hover:bg-blue-700"
            )}
          >
            {tripActive ? "Complete Trip" : "Start Trip"}
          </button>
        </div>
        {tripActive && (
          <div className="mt-5 grid grid-cols-3 gap-3">
            {[
              { v: "23 km", l: "Distance" },
              { v: "34 min", l: "Elapsed" },
              { v: "68 km/h", l: "Avg Speed" },
            ].map(s => (
              <div key={s.l} className="bg-white/15 backdrop-blur-sm rounded-xl p-3 text-center">
                <p className="text-xl font-bold text-white">{s.v}</p>
                <p className="text-xs text-blue-100 mt-0.5">{s.l}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard title="Trips Today" value="3" change="+1 vs avg" up={true} icon={Route} iconBg="bg-blue-50 dark:bg-blue-900/20" iconColor="text-blue-600 dark:text-blue-400" />
        <KpiCard title="Weekly Distance" value="916 km" change="+12% vs last week" up={true} icon={Activity} iconBg="bg-teal-50 dark:bg-teal-900/20" iconColor="text-teal-600 dark:text-teal-400" />
        <KpiCard title="Fuel Logged" value="87 L" change="-5% efficiency" up={false} icon={Fuel} iconBg="bg-amber-50 dark:bg-amber-900/20" iconColor="text-amber-600 dark:text-amber-400" />
        <KpiCard title="Safety Score" value="94 / 100" change="+2 this week" up={true} icon={Award} iconBg="bg-purple-50 dark:bg-purple-900/20" iconColor="text-purple-600 dark:text-purple-400" />
      </div>

      {/* Chart + Vehicle */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <Card title="My Weekly Distance (km)">
            <div className="p-5">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={driverWeeklyKm} margin={{ top: 4, right: 4, left: -18, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" strokeOpacity={0.6} />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTip />} />
                  <Bar dataKey="km" name="Distance (km)" fill="#14B8A6" radius={[5, 5, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        <Card title="My Vehicle — BUS-042">
          <div className="p-4 space-y-4">
            <div className="rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 h-28">
              <img src="https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=400&h=200&fit=crop&auto=format" alt="Bus BUS-042" className="w-full h-full object-cover" />
            </div>
            {[
              { label: "Fuel Level", value: "74%", warn: false },
              { label: "Odometer", value: "142,847 km", warn: false },
              { label: "Next Service", value: "3 days", warn: true },
              { label: "Last Inspected", value: "Jul 8, 2026", warn: false },
            ].map(r => (
              <div key={r.label} className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground font-medium">{r.label}</span>
                <span className={cx("text-xs font-bold", r.warn ? "text-amber-500" : "text-foreground")}>{r.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function DriverContent({ nav, user }: { nav: string; user: UserRecord }) {
  const item = NAV.driver.find(n => n.id === nav);
  const Icon = item?.icon || Truck;
  if (nav === "dashboard") return <DriverDashboard user={user} />;
  return (
    <div className="p-6 flex flex-col items-center justify-center min-h-[440px] text-center">
      <div className="w-16 h-16 rounded-2xl bg-teal-50 dark:bg-teal-900/20 flex items-center justify-center mb-4">
        <Icon className="w-7 h-7 text-teal-600 dark:text-teal-400" />
      </div>
      <h2 className="text-lg font-bold text-foreground mb-2">{item?.label}</h2>
      <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">Your data is synced and up to date. Select a record to view full details.</p>
    </div>
  );
}

// ─── Safety Dashboard ─────────────────────────────────────────────────────────

function SafetyDashboard() {
  return (
    <div className="p-6 space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard title="Compliance Rate" value="91.4%" change="+2.1% this month" up={true} icon={Shield} iconBg="bg-emerald-50 dark:bg-emerald-900/20" iconColor="text-emerald-600 dark:text-emerald-400" />
        <KpiCard title="Active Incidents" value="7" change="-3 resolved today" up={true} icon={FileWarning} iconBg="bg-red-50 dark:bg-red-900/20" iconColor="text-red-600 dark:text-red-400" />
        <KpiCard title="Licenses Expiring" value="4" change="Within 30 days" up={false} icon={FileText} iconBg="bg-amber-50 dark:bg-amber-900/20" iconColor="text-amber-600 dark:text-amber-400" />
        <KpiCard title="Avg Safety Score" value="84.2" change="+1.8 this week" up={true} icon={Award} iconBg="bg-purple-50 dark:bg-purple-900/20" iconColor="text-purple-600 dark:text-purple-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card title="Driver Safety Scores" action={<span className="text-xs text-muted-foreground">Updated 2h ago</span>}>
          <div className="p-5">
            <ResponsiveContainer width="100%" height={210}>
              <BarChart data={safetyScoreData} layout="vertical" margin={{ top: 0, right: 24, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" strokeOpacity={0.5} />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="driver" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} width={72} />
                <Tooltip content={<ChartTip />} />
                <Bar dataKey="score" name="Score" fill="#2563EB" radius={[0, 5, 5, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Incident Trend — Last 6 Weeks">
          <div className="p-5">
            <ResponsiveContainer width="100%" height={210}>
              <AreaChart data={incidentTrend} margin={{ top: 4, right: 4, left: -18, bottom: 0 }}>
                <defs>
                  <linearGradient id="gInc" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" strokeOpacity={0.6} />
                <XAxis dataKey="week" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTip />} />
                <Area type="monotone" dataKey="incidents" name="Incidents" stroke="#EF4444" strokeWidth={2.5} fill="url(#gInc)" dot={{ fill: "#EF4444", r: 4, strokeWidth: 0 }} activeDot={{ r: 6 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card title="Driver Compliance Status" action={
        <button className="flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 px-2 py-1 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors font-medium">
          <Download className="w-3 h-3" /> Export
        </button>
      }>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                {["Driver", "Safety Score", "License", "Last Training", "Incidents", "Status"].map(h => (
                  <th key={h} className="text-left text-[11px] font-semibold text-muted-foreground px-5 py-3 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {complianceDrivers.map((d) => (
                <tr key={d.name} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors cursor-pointer">
                  <td className="px-5 py-3.5 text-xs font-semibold text-foreground">{d.name}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-muted rounded-full h-1.5">
                        <div
                          className={cx("h-1.5 rounded-full", d.score >= 90 ? "bg-emerald-500" : d.score >= 75 ? "bg-amber-500" : "bg-red-500")}
                          style={{ width: `${d.score}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-foreground">{d.score}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5"><Badge label={d.license} /></td>
                  <td className="px-5 py-3.5 text-xs text-muted-foreground">{d.training}</td>
                  <td className="px-5 py-3.5 text-xs font-bold text-foreground">{d.incidents}</td>
                  <td className="px-5 py-3.5"><Badge label={d.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function SafetyContent({ nav }: { nav: string }) {
  const item = NAV.safety.find(n => n.id === nav);
  const Icon = item?.icon || Shield;
  if (nav === "dashboard") return <SafetyDashboard />;
  return (
    <div className="p-6 flex flex-col items-center justify-center min-h-[440px] text-center">
      <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center mb-4">
        <Icon className="w-7 h-7 text-amber-600 dark:text-amber-400" />
      </div>
      <h2 className="text-lg font-bold text-foreground mb-2">{item?.label}</h2>
      <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">Safety data is current. All records are under continuous review by the compliance team.</p>
      <button className="mt-5 flex items-center gap-2 border border-border text-foreground px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-muted transition-colors">
        <Download className="w-4 h-4" /> Download Report
      </button>
    </div>
  );
}

// ─── Finance Dashboard ────────────────────────────────────────────────────────

function FinanceDashboard() {
  return (
    <div className="p-6 space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard title="Total Expenses (MTD)" value="$112K" change="+8.3% vs last month" up={false} icon={DollarSign} iconBg="bg-red-50 dark:bg-red-900/20" iconColor="text-red-600 dark:text-red-400" />
        <KpiCard title="Revenue (MTD)" value="$179K" change="+12.4% vs last month" up={true} icon={TrendingUp} iconBg="bg-emerald-50 dark:bg-emerald-900/20" iconColor="text-emerald-600 dark:text-emerald-400" />
        <KpiCard title="Fuel Cost (MTD)" value="$25.5K" change="+4.1% vs last month" up={false} icon={Fuel} iconBg="bg-amber-50 dark:bg-amber-900/20" iconColor="text-amber-600 dark:text-amber-400" />
        <KpiCard title="Operating ROI" value="37.2%" change="+3.8% this quarter" up={true} icon={Target} iconBg="bg-blue-50 dark:bg-blue-900/20" iconColor="text-blue-600 dark:text-blue-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <Card title="Revenue vs Expenses — Last 6 Months" action={
            <div className="flex gap-2">
              <button className="flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 px-2.5 py-1.5 rounded-lg border border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors font-medium">
                <Download className="w-3 h-3" /> CSV
              </button>
              <button className="flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 px-2.5 py-1.5 rounded-lg border border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors font-medium">
                <Download className="w-3 h-3" /> PDF
              </button>
            </div>
          }>
            <div className="p-5">
              <ResponsiveContainer width="100%" height={215}>
                <AreaChart data={revenueExpense} margin={{ top: 4, right: 4, left: -6, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gExp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EF4444" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" strokeOpacity={0.6} />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip content={<ChartTip />} />
                  <Legend iconSize={8} wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
                  <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#10B981" strokeWidth={2.5} fill="url(#gRev)" dot={false} activeDot={{ r: 5, strokeWidth: 0 }} />
                  <Area type="monotone" dataKey="expenses" name="Expenses" stroke="#EF4444" strokeWidth={2.5} fill="url(#gExp)" dot={false} activeDot={{ r: 5, strokeWidth: 0 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        <Card title="Fuel Cost by Type">
          <div className="p-5">
            <ResponsiveContainer width="100%" height={215}>
              <BarChart data={fuelCostData} margin={{ top: 4, right: 0, left: -18, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" strokeOpacity={0.6} />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#94A3B8" }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip content={<ChartTip />} />
                <Bar dataKey="diesel" name="Diesel" stackId="a" fill="#2563EB" />
                <Bar dataKey="petrol" name="Petrol" stackId="a" fill="#14B8A6" />
                <Bar dataKey="electric" name="Electric" stackId="a" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card title="Expense Breakdown by Category" action={
        <div className="flex gap-2">
          <button className="text-xs text-muted-foreground hover:text-foreground px-2 py-1 rounded-md hover:bg-muted transition-colors flex items-center gap-1">
            <Filter className="w-3 h-3" /> Filter
          </button>
          <button className="flex items-center gap-1.5 text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors font-medium">
            <Download className="w-3 h-3" /> Export All
          </button>
        </div>
      }>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                {["Category", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Total"].map(h => (
                  <th key={h} className="text-left text-[11px] font-semibold text-muted-foreground px-5 py-3 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { cat: "Fuel", vals: [20400, 21700, 23500, 23200, 25700, 25500] },
                { cat: "Maintenance", vals: [14200, 16800, 12400, 18600, 15300, 17200] },
                { cat: "Driver Salaries", vals: [38000, 38000, 38000, 38000, 38000, 38000] },
                { cat: "Insurance", vals: [8200, 8200, 8200, 8200, 8200, 8200] },
                { cat: "Admin & Ops", vals: [8200, 10300, 15900, 14000, 20800, 23000] },
              ].map((row) => {
                const total = row.vals.reduce((a, b) => a + b, 0);
                return (
                  <tr key={row.cat} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-3.5 text-xs font-bold text-foreground">{row.cat}</td>
                    {row.vals.map((v, i) => (
                      <td key={i} className="px-5 py-3.5 text-xs text-muted-foreground font-mono">${v.toLocaleString()}</td>
                    ))}
                    <td className="px-5 py-3.5 text-xs font-bold text-foreground font-mono">${total.toLocaleString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function FinanceContent({ nav }: { nav: string }) {
  const item = NAV.finance.find(n => n.id === nav);
  const Icon = item?.icon || BarChart3;
  if (nav === "dashboard") return <FinanceDashboard />;
  return (
    <div className="p-6 flex flex-col items-center justify-center min-h-[440px] text-center">
      <div className="w-16 h-16 rounded-2xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center mb-4">
        <Icon className="w-7 h-7 text-purple-600 dark:text-purple-400" />
      </div>
      <h2 className="text-lg font-bold text-foreground mb-2">{item?.label}</h2>
      <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">Read-only financial data synced from your ERP. Select a period to generate a report.</p>
      <div className="mt-5 flex gap-3">
        <button className="flex items-center gap-2 border border-border text-foreground px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-muted transition-colors">
          <Download className="w-4 h-4" /> Export CSV
        </button>
        <button className="flex items-center gap-2 border border-border text-foreground px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-muted transition-colors">
          <Download className="w-4 h-4" /> Export PDF
        </button>
      </div>
    </div>
  );
}

// ─── Dashboard Router ─────────────────────────────────────────────────────────

function DashboardContent({ user, nav }: { user: UserRecord; nav: string }) {
  if (user.role === "admin") return <AdminContent nav={nav} />;
  if (user.role === "driver") return <DriverContent nav={nav} user={user} />;
  if (user.role === "safety") return <SafetyContent nav={nav} />;
  if (user.role === "finance") return <FinanceContent nav={nav} />;
  return null;
}

// ─── App Shell ────────────────────────────────────────────────────────────────

function AppShell({ user, onLogout }: { user: UserRecord; onLogout: () => void }) {
  const [nav, setNav] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  const currentItem = NAV[user.role].find(n => n.id === nav);
  const subtitles: Record<Role, string> = {
    admin: "Fleet Management Platform",
    driver: "Driver Operations Portal",
    safety: "Safety & Compliance Center",
    finance: "Financial Analytics Hub",
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar
        user={user}
        active={nav}
        onNav={setNav}
        collapsed={collapsed}
        onCollapse={() => setCollapsed(c => !c)}
        dark={dark}
        onDark={() => setDark(d => !d)}
        onLogout={onLogout}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar title={currentItem?.label || "Dashboard"} subtitle={subtitles[user.role]} user={user} />
        <main className="flex-1 overflow-y-auto bg-background">
          <DashboardContent user={user} nav={nav} />
        </main>
      </div>
    </div>
  );
}

// ─── Login Page ───────────────────────────────────────────────────────────────

function LoginPage({ onLogin }: { onLogin: (u: UserRecord) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setTimeout(() => {
      const u = USERS.find(u => u.email === email && u.password === password);
      if (u) { onLogin(u); }
      else { setError("Invalid credentials. Try a demo account below."); setLoading(false); }
    }, 700);
  };

  const roleConfig: Record<Role, { icon: React.ElementType; color: string; bg: string; border: string }> = {
    admin:   { icon: Truck,    color: "text-blue-700 dark:text-blue-400",   bg: "bg-blue-50 dark:bg-blue-900/20",   border: "border-blue-200 dark:border-blue-800" },
    driver:  { icon: Car,      color: "text-teal-700 dark:text-teal-400",   bg: "bg-teal-50 dark:bg-teal-900/20",   border: "border-teal-200 dark:border-teal-800" },
    safety:  { icon: Shield,   color: "text-amber-700 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-900/20", border: "border-amber-200 dark:border-amber-800" },
    finance: { icon: BarChart3, color: "text-purple-700 dark:text-purple-400", bg: "bg-purple-50 dark:bg-purple-900/20", border: "border-purple-200 dark:border-purple-800" },
  };

  const stats = [
    { icon: Car,        value: "48",   label: "Active Vehicles" },
    { icon: Route,      value: "127",  label: "Daily Trips" },
    { icon: Activity,   value: "91%",  label: "Fleet Efficiency" },
    { icon: DollarSign, value: "$179K", label: "Monthly Revenue" },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left panel — brand */}
      <div className="hidden lg:flex lg:w-[48%] bg-[#0F172A] flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-teal-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-14">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg">
              <Truck className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-lg leading-none tracking-tight">TransitOps</p>
              <p className="text-blue-400/60 text-[10px] mt-0.5 font-bold uppercase tracking-widest">Enterprise Platform</p>
            </div>
          </div>
          <h2 className="text-[2.6rem] font-bold text-white leading-tight mb-4 tracking-tight">
            Smart Transport<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400">Operations Hub</span>
          </h2>
          <p className="text-slate-400 text-base leading-relaxed max-w-sm">
            A unified command center for fleet managers, drivers, safety officers, and financial analysts — all in one intelligent platform.
          </p>
        </div>

        <div className="relative z-10 grid grid-cols-2 gap-3 my-10">
          {stats.map(s => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-4 backdrop-blur-sm hover:bg-white/[0.07] transition-colors">
                <Icon className="w-4 h-4 text-blue-400 mb-2.5" />
                <p className="text-2xl font-bold text-white tracking-tight">{s.value}</p>
                <p className="text-xs text-slate-400 mt-0.5 font-medium">{s.label}</p>
              </div>
            );
          })}
        </div>

        <div className="relative z-10 flex items-center gap-4">
          <div className="flex -space-x-2">
            {USERS.map(u => (
              <div key={u.role} className="w-7 h-7 rounded-full border-2 border-[#0F172A] flex items-center justify-center text-white text-[10px] font-bold" style={{ backgroundColor: u.color }}>
                {u.initials}
              </div>
            ))}
          </div>
          <p className="text-slate-500 text-xs">4 role-based portals · Strict RBAC enforced</p>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center bg-[#F8FAFC] p-8">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-2.5 mb-10 lg:hidden">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center">
              <Truck className="w-4 h-4 text-white" />
            </div>
            <p className="font-bold text-foreground text-lg">TransitOps</p>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-[#0F172A] mb-1.5 tracking-tight">Welcome back</h1>
            <p className="text-sm text-slate-500">Sign in to access your role-specific dashboard</p>
          </div>

          {/* Demo accounts */}
          <div className="mb-6">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">Demo Accounts</p>
            <div className="grid grid-cols-2 gap-2">
              {USERS.map(u => {
                const cfg = roleConfig[u.role];
                const Icon = cfg.icon;
                return (
                  <button
                    key={u.role}
                    onClick={() => { setEmail(u.email); setPassword(u.password); setError(""); }}
                    className={cx(
                      "flex items-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-semibold transition-all duration-150 hover:shadow-sm",
                      cfg.color, cfg.bg, cfg.border
                    )}
                  >
                    <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="truncate">{u.title}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-[#0F172A] mb-1.5">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@transitops.com"
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-[#0F172A] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all shadow-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#0F172A] mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 pr-11 text-sm text-[#0F172A] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all shadow-sm"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                <X className="w-4 h-4 flex-shrink-0" /> {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold py-3.5 rounded-xl text-sm transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm mt-2"
            >
              {loading ? <><RefreshCw className="w-4 h-4 animate-spin" /> Signing in…</> : "Sign In to TransitOps"}
            </button>
          </form>

          <p className="text-xs text-slate-400 text-center mt-6 leading-relaxed">
            Role-based access control enforced.<br />Your session is scoped strictly to your assigned role.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [user, setUser] = useState<UserRecord | null>(null);
  return user
    ? <AppShell user={user} onLogout={() => setUser(null)} />
    : <LoginPage onLogin={setUser} />;
}
