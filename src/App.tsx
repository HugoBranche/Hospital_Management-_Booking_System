import { useState } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

type Role = "patient" | "receptionist" | "doctor";
type View =
  | "login"
  | "patient-dashboard"
  | "patient-request"
  | "patient-appointments"
  | "receptionist-dashboard"
  | "receptionist-assign"
  | "receptionist-appointments"
  | "doctor-dashboard"
  | "doctor-requests"
  | "doctor-appointments";

type Status =
  | "Pending"
  | "Assigned"
  | "Accepted"
  | "Confirmed"
  | "Declined"
  | "Cancelled"
  | "Completed";

interface Appointment {
  id: number;
  patient: string;
  doctor: string;
  department: string;
  date: string;
  time: string;
  status: Status;
  reason: string;
}

// ─── Sample Data ──────────────────────────────────────────────────────────────

const DOCTORS = [
  { name: "Dr. Sarah Mitchell", department: "Cardiology", available: true },
  { name: "Dr. James Patel", department: "General Medicine", available: true },
  { name: "Dr. Emily Chen", department: "Orthopedics", available: false },
  { name: "Dr. Robert Garcia", department: "Dermatology", available: true },
  { name: "Dr. Aisha Okonkwo", department: "Neurology", available: true },
];

const DEPARTMENTS = [
  "Cardiology",
  "General Medicine",
  "Orthopedics",
  "Dermatology",
  "Neurology",
  "Pediatrics",
  "Gynecology",
];

const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 1,
    patient: "John Doe",
    doctor: "Dr. Sarah Mitchell",
    department: "Cardiology",
    date: "2026-09-20",
    time: "10:00 AM",
    status: "Confirmed",
    reason: "Chest pain and shortness of breath",
  },
  {
    id: 2,
    patient: "Maria Santos",
    doctor: "Dr. James Patel",
    department: "General Medicine",
    date: "2026-09-21",
    time: "02:30 PM",
    status: "Accepted",
    reason: "Annual check-up",
  },
  {
    id: 3,
    patient: "Ahmed Al-Hassan",
    doctor: "",
    department: "Neurology",
    date: "2026-09-22",
    time: "11:00 AM",
    status: "Pending",
    reason: "Recurring migraines",
  },
  {
    id: 4,
    patient: "Lisa Park",
    doctor: "Dr. Robert Garcia",
    department: "Dermatology",
    date: "2026-09-19",
    time: "09:00 AM",
    status: "Completed",
    reason: "Skin rash evaluation",
  },
  {
    id: 5,
    patient: "Carlos Mendes",
    doctor: "",
    department: "Orthopedics",
    date: "2026-09-23",
    time: "03:00 PM",
    status: "Pending",
    reason: "Knee pain after sports injury",
  },
  {
    id: 6,
    patient: "Fatima Noor",
    doctor: "Dr. Aisha Okonkwo",
    department: "Neurology",
    date: "2026-09-18",
    time: "01:00 PM",
    status: "Declined",
    reason: "Memory loss concerns",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: Status }) {
  const styles: Record<Status, string> = {
    Pending: "bg-amber-100 text-amber-700 border border-amber-200",
    Assigned: "bg-blue-100 text-blue-700 border border-blue-200",
    Accepted: "bg-emerald-100 text-emerald-700 border border-emerald-200",
    Confirmed: "bg-teal-100 text-teal-700 border border-teal-200",
    Declined: "bg-red-100 text-red-700 border border-red-200",
    Cancelled: "bg-gray-100 text-gray-600 border border-gray-200",
    Completed: "bg-slate-100 text-slate-600 border border-slate-200",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}>
      {status}
    </span>
  );
}

function StatCard({
  label,
  value,
  icon,
  accent,
}: {
  label: string;
  value: number | string;
  icon: string;
  accent?: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 flex items-center gap-4">
      <div className={`w-11 h-11 rounded-lg flex items-center justify-center text-xl ${accent ?? "bg-teal-50 text-teal-600"}`}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-semibold text-slate-800">{value}</p>
        <p className="text-sm text-slate-500">{label}</p>
      </div>
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

const NAV_ITEMS: Record<Role, { label: string; view: View; icon: string }[]> = {
  patient: [
    { label: "Dashboard", view: "patient-dashboard", icon: "⊞" },
    { label: "Request Appointment", view: "patient-request", icon: "+" },
    { label: "My Appointments", view: "patient-appointments", icon: "📋" },
  ],
  receptionist: [
    { label: "Dashboard", view: "receptionist-dashboard", icon: "⊞" },
    { label: "Appointment Requests", view: "receptionist-assign", icon: "📥" },
    { label: "Appointments", view: "receptionist-appointments", icon: "📋" },
  ],
  doctor: [
    { label: "Dashboard", view: "doctor-dashboard", icon: "⊞" },
    { label: "Appointment Requests", view: "doctor-requests", icon: "📥" },
    { label: "My Appointments", view: "doctor-appointments", icon: "📋" },
  ],
};

const ROLE_LABEL: Record<Role, string> = {
  patient: "Patient",
  receptionist: "Receptionist",
  doctor: "Doctor",
};

const ROLE_USER: Record<Role, string> = {
  patient: "John Doe",
  receptionist: "Anna Rivera",
  doctor: "Dr. Sarah Mitchell",
};

function Sidebar({
  role,
  currentView,
  onNav,
  onLogout,
}: {
  role: Role;
  currentView: View;
  onNav: (v: View) => void;
  onLogout: () => void;
}) {
  return (
    <aside className="w-60 bg-white border-r border-slate-200 flex flex-col h-screen sticky top-0 shrink-0">
      {/* Brand */}
      <div className="px-5 py-5 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">M</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800 leading-tight">MediBook</p>
            <p className="text-xs text-slate-400">Hospital</p>
          </div>
        </div>
      </div>

      {/* User info */}
      <div className="px-5 py-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-teal-100 rounded-full flex items-center justify-center text-teal-700 font-semibold text-sm">
            {ROLE_USER[role][0]}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-slate-800 truncate">{ROLE_USER[role]}</p>
            <p className="text-xs text-teal-600 font-medium">{ROLE_LABEL[role]}</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {NAV_ITEMS[role].map((item) => {
          const active = currentView === item.view;
          return (
            <button
              key={item.view}
              onClick={() => onNav(item.view)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                active
                  ? "bg-teal-50 text-teal-700"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-800"
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-slate-100">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
        >
          <span>↩</span> Logout
        </button>
      </div>
    </aside>
  );
}

function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-6">
      <h1 className="text-xl font-semibold text-slate-800">{title}</h1>
      {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
    </div>
  );
}

// ─── Login ────────────────────────────────────────────────────────────────────

function LoginPage({ onLogin }: { onLogin: (role: Role) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const demos: { label: string; role: Role; email: string }[] = [
    { label: "Patient", role: "patient", email: "john.doe@email.com" },
    { label: "Receptionist", role: "receptionist", email: "anna.rivera@medibook.com" },
    { label: "Doctor", role: "doctor", email: "s.mitchell@medibook.com" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50 to-cyan-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-0 bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-200">
        {/* Illustration panel */}
        <div className="bg-gradient-to-br from-teal-600 to-cyan-700 p-10 flex flex-col justify-between text-white">
          <div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-6">
              <span className="text-2xl font-bold">M</span>
            </div>
            <h2 className="text-2xl font-semibold leading-snug mb-2" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              MediBook Hospital
            </h2>
            <p className="text-teal-100 text-sm leading-relaxed">
              Streamlined appointment management for patients, receptionists, and doctors.
            </p>
          </div>

          {/* Decorative cards */}
          <div className="space-y-3">
            {[
              { icon: "👤", label: "Patient Portal", desc: "Request & track appointments" },
              { icon: "📋", label: "Reception Desk", desc: "Assign & manage bookings" },
              { icon: "🩺", label: "Doctor View", desc: "Accept & schedule visits" },
            ].map((item) => (
              <div key={item.label} className="bg-white/10 rounded-xl p-3 flex items-center gap-3">
                <span className="text-xl">{item.icon}</span>
                <div>
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className="text-xs text-teal-200">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form panel */}
        <div className="p-10 flex flex-col justify-center">
          <h3 className="text-xl font-semibold text-slate-800 mb-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Sign in to your account
          </h3>
          <p className="text-sm text-slate-500 mb-7">Welcome back — please enter your details.</p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
              />
            </div>
            <div className="flex justify-end">
              <button className="text-xs text-teal-600 hover:text-teal-700 font-medium transition-colors">
                Forgot password?
              </button>
            </div>
          </div>

          {/* Demo quick-access */}
          <div className="mt-5 mb-5">
            <p className="text-xs text-slate-400 mb-2.5 font-medium uppercase tracking-wide">Quick demo login</p>
            <div className="grid grid-cols-3 gap-2">
              {demos.map((d) => (
                <button
                  key={d.role}
                  onClick={() => onLogin(d.role)}
                  className="border border-slate-200 rounded-lg px-2 py-2 text-xs font-medium text-slate-600 hover:border-teal-400 hover:text-teal-700 hover:bg-teal-50 transition-colors cursor-pointer"
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => {
              const role = demos.find((d) => d.email === email)?.role ?? "patient";
              onLogin(role);
            }}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-2.5 rounded-lg text-sm transition-colors cursor-pointer"
          >
            Sign In
          </button>

          <p className="text-xs text-slate-400 text-center mt-4">
            MediBook Hospital Management System · v1.0
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Patient Dashboard ────────────────────────────────────────────────────────

function PatientDashboard({
  appointments,
  onNav,
}: {
  appointments: Appointment[];
  onNav: (v: View) => void;
}) {
  const mine = appointments.filter((a) => a.patient === "John Doe");
  const upcoming = mine.filter((a) => ["Confirmed", "Accepted", "Assigned"].includes(a.status));
  const pending = mine.filter((a) => a.status === "Pending");
  const completed = mine.filter((a) => a.status === "Completed");

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-slate-800" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          Good morning, John 👋
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">Here's an overview of your health appointments.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatCard label="Pending Requests" value={pending.length} icon="⏳" accent="bg-amber-50 text-amber-600" />
        <StatCard label="Upcoming Appointments" value={upcoming.length} icon="📅" />
        <StatCard label="Completed Appointments" value={completed.length} icon="✓" accent="bg-slate-50 text-slate-500" />
      </div>

      {/* Upcoming appointment highlight */}
      {upcoming.length > 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-5 mb-6">
          <p className="text-xs font-semibold text-teal-600 uppercase tracking-wide mb-3">Next Appointment</p>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-800 font-medium">{upcoming[0].doctor}</p>
              <p className="text-sm text-slate-500">{upcoming[0].department}</p>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-sm text-slate-600">📅 {upcoming[0].date}</span>
                <span className="text-sm text-slate-600">🕐 {upcoming[0].time}</span>
              </div>
            </div>
            <StatusBadge status={upcoming[0].status} />
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 p-10 mb-6 flex flex-col items-center text-center">
          <div className="w-14 h-14 bg-teal-50 rounded-full flex items-center justify-center text-2xl mb-3">📅</div>
          <p className="text-slate-600 font-medium">No upcoming appointments</p>
          <p className="text-sm text-slate-400 mt-1">Request your first appointment to get started.</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={() => onNav("patient-request")}
          className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer"
        >
          + Request Appointment
        </button>
        <button
          onClick={() => onNav("patient-appointments")}
          className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer"
        >
          My Appointments
        </button>
      </div>
    </div>
  );
}

// ─── Patient — Request Appointment ───────────────────────────────────────────

function PatientRequestAppointment({ onSubmit }: { onSubmit: (appt: Appointment) => void }) {
  const [department, setDepartment] = useState("");
  const [doctor, setDoctor] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [reason, setReason] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const filteredDoctors = department
    ? DOCTORS.filter((d) => d.department === department)
    : DOCTORS;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newAppt: Appointment = {
      id: Date.now(),
      patient: "John Doe",
      doctor: "",
      department,
      date,
      time,
      status: "Pending",
      reason,
    };
    onSubmit(newAppt);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div>
        <PageHeader title="Request Appointment" />
        <div className="bg-white rounded-xl border border-slate-200 p-12 flex flex-col items-center text-center max-w-md mx-auto">
          <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center text-3xl mb-4">✓</div>
          <h3 className="text-lg font-semibold text-slate-800 mb-2">Request Submitted!</h3>
          <p className="text-sm text-slate-500 mb-1">
            Appointment request submitted successfully.
          </p>
          <p className="text-sm text-slate-500 mb-6">
            Our reception team will assign you to a doctor shortly.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="text-sm text-teal-600 hover:text-teal-700 font-medium cursor-pointer"
          >
            Submit another request →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Request Appointment" subtitle="Fill in the details below to request an appointment." />
      <div className="bg-white rounded-xl border border-slate-200 p-6 max-w-xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Department / Specialty</label>
            <select
              required
              value={department}
              onChange={(e) => { setDepartment(e.target.value); setDoctor(""); }}
              className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value="">Select a department</option>
              {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Preferred Doctor <span className="text-slate-400 font-normal">(optional)</span></label>
            <select
              value={doctor}
              onChange={(e) => setDoctor(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value="">No preference</option>
              {filteredDoctors.map((d) => (
                <option key={d.name} disabled={!d.available}>
                  {d.name}{!d.available ? " (Unavailable)" : ""}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Preferred Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Preferred Time</label>
              <select
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="">Select time</option>
                {["08:00 AM","09:00 AM","10:00 AM","11:00 AM","01:00 PM","02:00 PM","03:00 PM","04:00 PM"].map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Reason for Appointment</label>
            <textarea
              required
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Briefly describe your symptoms or reason for visiting…"
              className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer"
            >
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Patient — My Appointments ────────────────────────────────────────────────

function PatientAppointments({ appointments }: { appointments: Appointment[] }) {
  const mine = appointments.filter((a) => a.patient === "John Doe");

  return (
    <div>
      <PageHeader title="My Appointments" subtitle="View the status of all your appointment requests." />
      {mine.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 flex flex-col items-center text-center">
          <div className="w-14 h-14 bg-slate-50 rounded-full flex items-center justify-center text-2xl mb-3">📋</div>
          <p className="text-slate-600 font-medium">No appointments yet</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Doctor</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Department</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Date</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Time</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mine.map((appt) => (
                <tr key={appt.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-4 font-medium text-slate-800">{appt.doctor || <span className="text-slate-400 italic">Not assigned yet</span>}</td>
                  <td className="px-5 py-4 text-slate-600">{appt.department}</td>
                  <td className="px-5 py-4 text-slate-600">{appt.date}</td>
                  <td className="px-5 py-4 text-slate-600">{appt.time}</td>
                  <td className="px-5 py-4"><StatusBadge status={appt.status} /></td>
                  <td className="px-5 py-4">
                    {["Pending", "Assigned"].includes(appt.status) && (
                      <button className="text-xs text-red-500 hover:text-red-700 font-medium cursor-pointer">Cancel</button>
                    )}
                    {["Completed"].includes(appt.status) && (
                      <button className="text-xs text-teal-600 hover:text-teal-700 font-medium cursor-pointer">View Details</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── Receptionist Dashboard ───────────────────────────────────────────────────

function ReceptionistDashboard({
  appointments,
  onNav,
}: {
  appointments: Appointment[];
  onNav: (v: View) => void;
}) {
  const pending = appointments.filter((a) => a.status === "Pending");
  const today = appointments.filter((a) => a.date === "2026-09-18");
  const available = DOCTORS.filter((d) => d.available);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-slate-800" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          Reception Desk
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">Manage appointment requests and scheduling.</p>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Patients" value={6} icon="👥" accent="bg-blue-50 text-blue-600" />
        <StatCard label="Pending Requests" value={pending.length} icon="⏳" accent="bg-amber-50 text-amber-600" />
        <StatCard label="Appointments Today" value={today.length} icon="📅" />
        <StatCard label="Available Doctors" value={available.length} icon="🩺" accent="bg-emerald-50 text-emerald-600" />
      </div>

      {/* Pending requests */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <p className="text-sm font-semibold text-slate-800">Pending Appointment Requests</p>
          <button onClick={() => onNav("receptionist-assign")} className="text-xs text-teal-600 hover:text-teal-700 font-medium cursor-pointer">
            View all →
          </button>
        </div>
        {pending.length === 0 ? (
          <div className="p-10 flex flex-col items-center text-center">
            <p className="text-slate-500 text-sm">No pending requests — all caught up! ✓</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Patient</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Requested Date</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Specialty</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pending.map((appt) => (
                <tr key={appt.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-4 font-medium text-slate-800">{appt.patient}</td>
                  <td className="px-5 py-4 text-slate-600">{appt.date}</td>
                  <td className="px-5 py-4 text-slate-600">{appt.department}</td>
                  <td className="px-5 py-4"><StatusBadge status={appt.status} /></td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() => onNav("receptionist-assign")}
                      className="bg-teal-600 hover:bg-teal-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                    >
                      Assign Doctor
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// ─── Receptionist — Assign Doctor ─────────────────────────────────────────────

function ReceptionistAssign({
  appointments,
  onAssign,
}: {
  appointments: Appointment[];
  onAssign: (id: number, doctor: string, date: string, time: string) => void;
}) {
  const pending = appointments.filter((a) => a.status === "Pending");
  const [selected, setSelected] = useState<Appointment | null>(null);
  const [assignedDoc, setAssignedDoc] = useState("");
  const [assignedDate, setAssignedDate] = useState("");
  const [assignedTime, setAssignedTime] = useState("");
  const [confirmed, setConfirmed] = useState<string | null>(null);

  function handleAssign() {
    if (!selected || !assignedDoc) return;
    onAssign(selected.id, assignedDoc, assignedDate || selected.date, assignedTime || selected.time);
    setConfirmed(assignedDoc);
    setSelected(null);
    setAssignedDoc("");
    setAssignedDate("");
    setAssignedTime("");
  }

  return (
    <div>
      <PageHeader title="Appointment Requests" subtitle="Review pending requests and assign available doctors." />

      {confirmed && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-5 py-4 mb-5 flex items-center gap-3">
          <span className="text-emerald-600 text-lg">✓</span>
          <p className="text-sm text-emerald-700 font-medium">
            Patient successfully assigned to {confirmed}.
          </p>
          <button onClick={() => setConfirmed(null)} className="ml-auto text-emerald-600 text-lg cursor-pointer">×</button>
        </div>
      )}

      <div className="grid grid-cols-5 gap-5">
        {/* Pending list */}
        <div className="col-span-2 space-y-3">
          {pending.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-8 flex flex-col items-center text-center">
              <p className="text-slate-500 text-sm">No pending requests right now.</p>
            </div>
          ) : (
            pending.map((appt) => (
              <button
                key={appt.id}
                onClick={() => { setSelected(appt); setAssignedDoc(""); setAssignedDate(""); setAssignedTime(""); }}
                className={`w-full text-left bg-white rounded-xl border p-4 transition-all cursor-pointer ${
                  selected?.id === appt.id ? "border-teal-400 ring-1 ring-teal-400" : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <p className="font-medium text-slate-800 text-sm">{appt.patient}</p>
                <p className="text-xs text-slate-500 mt-0.5">{appt.department}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-slate-500">📅 {appt.date}</span>
                  <StatusBadge status={appt.status} />
                </div>
              </button>
            ))
          )}
        </div>

        {/* Assignment panel */}
        <div className="col-span-3">
          {selected ? (
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <p className="text-sm font-semibold text-slate-800 mb-4">Assign Doctor</p>

              {/* Patient info */}
              <div className="bg-slate-50 rounded-lg p-4 mb-5">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Patient Information</p>
                <p className="text-sm font-medium text-slate-800">{selected.patient}</p>
                <p className="text-sm text-slate-600 mt-0.5">{selected.department} · {selected.date} at {selected.time}</p>
                <p className="text-sm text-slate-500 mt-2 italic">"{selected.reason}"</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Select Available Doctor</label>
                  <select
                    required
                    value={assignedDoc}
                    onChange={(e) => setAssignedDoc(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  >
                    <option value="">Choose a doctor</option>
                    {DOCTORS.filter((d) => d.available).map((d) => (
                      <option key={d.name}>{d.name} — {d.department}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Appointment Date</label>
                    <input
                      type="date"
                      value={assignedDate}
                      onChange={(e) => setAssignedDate(e.target.value)}
                      placeholder={selected.date}
                      className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Appointment Time</label>
                    <select
                      value={assignedTime}
                      onChange={(e) => setAssignedTime(e.target.value)}
                      className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    >
                      <option value="">Keep patient preference</option>
                      {["08:00 AM","09:00 AM","10:00 AM","11:00 AM","01:00 PM","02:00 PM","03:00 PM","04:00 PM"].map((t) => (
                        <option key={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  onClick={handleAssign}
                  disabled={!assignedDoc}
                  className="bg-teal-600 hover:bg-teal-700 disabled:opacity-40 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer"
                >
                  Assign Doctor
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-dashed border-slate-300 p-10 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-xl mb-3">👈</div>
              <p className="text-slate-600 text-sm font-medium">Select a request to assign a doctor</p>
              <p className="text-xs text-slate-400 mt-1">Click on a pending request from the list.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Receptionist — Appointments ──────────────────────────────────────────────

function ReceptionistAppointments({ appointments }: { appointments: Appointment[] }) {
  const [filter, setFilter] = useState<"All" | Status>("All");

  const filters: ("All" | Status)[] = ["All", "Pending", "Confirmed", "Completed", "Cancelled"];
  const filtered = filter === "All" ? appointments : appointments.filter((a) => a.status === filter);

  return (
    <div>
      <PageHeader title="All Appointments" subtitle="View and manage every appointment in the system." />

      <div className="flex gap-2 mb-5">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
              filter === f
                ? "bg-teal-600 text-white"
                : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-10 flex flex-col items-center text-center">
            <p className="text-slate-500 text-sm">No appointments found for this filter.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {["Patient", "Doctor", "Department", "Date", "Time", "Status", "Actions"].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((appt) => (
                <tr key={appt.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-4 font-medium text-slate-800">{appt.patient}</td>
                  <td className="px-5 py-4 text-slate-600">{appt.doctor || <span className="text-slate-400 italic">Unassigned</span>}</td>
                  <td className="px-5 py-4 text-slate-600">{appt.department}</td>
                  <td className="px-5 py-4 text-slate-600">{appt.date}</td>
                  <td className="px-5 py-4 text-slate-600">{appt.time}</td>
                  <td className="px-5 py-4"><StatusBadge status={appt.status} /></td>
                  <td className="px-5 py-4 flex gap-2">
                    <button className="text-xs text-teal-600 hover:text-teal-700 font-medium cursor-pointer">Edit</button>
                    {["Pending", "Assigned"].includes(appt.status) && (
                      <button className="text-xs text-red-500 hover:text-red-700 font-medium cursor-pointer">Cancel</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// ─── Doctor Dashboard ─────────────────────────────────────────────────────────

function DoctorDashboard({ appointments, onNav }: { appointments: Appointment[]; onNav: (v: View) => void }) {
  const mine = appointments.filter((a) => a.doctor === "Dr. Sarah Mitchell");
  const pending = mine.filter((a) => a.status === "Assigned");
  const accepted = mine.filter((a) => ["Accepted", "Confirmed"].includes(a.status));
  const todayAppts = mine.filter((a) => a.date === "2026-09-18");

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-slate-800" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          Good morning, Dr. Mitchell 👋
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">You have {pending.length} pending request{pending.length !== 1 ? "s" : ""} to review.</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatCard label="Pending Requests" value={pending.length} icon="⏳" accent="bg-amber-50 text-amber-600" />
        <StatCard label="Accepted" value={accepted.length} icon="✓" accent="bg-emerald-50 text-emerald-600" />
        <StatCard label="Today's Appointments" value={todayAppts.length} icon="📅" />
      </div>

      {/* Today's schedule */}
      <div className="bg-white rounded-xl border border-slate-200 mb-5">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <p className="text-sm font-semibold text-slate-800">Today's Schedule</p>
          <span className="text-xs text-slate-400">September 18, 2026</span>
        </div>
        {todayAppts.length === 0 ? (
          <div className="p-8 flex flex-col items-center text-center">
            <p className="text-slate-500 text-sm">No appointments scheduled for today.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {todayAppts.map((appt) => (
              <div key={appt.id} className="px-5 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-teal-50 rounded-full flex items-center justify-center text-teal-700 font-medium text-sm">
                    {appt.patient[0]}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-800">{appt.patient}</p>
                    <p className="text-xs text-slate-500">{appt.reason}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-slate-600">{appt.time}</span>
                  <StatusBadge status={appt.status} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pending requests */}
      {pending.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-amber-800">You have {pending.length} unreviewed request{pending.length !== 1 ? "s" : ""}</p>
            <p className="text-xs text-amber-600 mt-0.5">Please accept or decline pending appointment assignments.</p>
          </div>
          <button
            onClick={() => onNav("doctor-requests")}
            className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer"
          >
            Review Now
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Doctor — Appointment Requests ───────────────────────────────────────────

function DoctorRequests({
  appointments,
  onAccept,
  onDecline,
}: {
  appointments: Appointment[];
  onAccept: (id: number) => void;
  onDecline: (id: number) => void;
}) {
  const requests = appointments.filter(
    (a) => a.doctor === "Dr. Sarah Mitchell" && a.status === "Assigned"
  );
  const [decliningId, setDecliningId] = useState<number | null>(null);
  const [declineReason, setDeclineReason] = useState("");
  const [flash, setFlash] = useState<{ type: "accept" | "decline"; name: string } | null>(null);

  function confirmDecline(id: number) {
    onDecline(id);
    const appt = appointments.find((a) => a.id === id);
    setFlash({ type: "decline", name: appt?.patient ?? "" });
    setDecliningId(null);
    setDeclineReason("");
  }

  function handleAccept(id: number) {
    onAccept(id);
    const appt = appointments.find((a) => a.id === id);
    setFlash({ type: "accept", name: appt?.patient ?? "" });
  }

  return (
    <div>
      <PageHeader title="Appointment Requests" subtitle="Accept or decline appointments assigned to you." />

      {flash && (
        <div className={`rounded-xl px-5 py-4 mb-5 flex items-center gap-3 border ${
          flash.type === "accept"
            ? "bg-emerald-50 border-emerald-200"
            : "bg-red-50 border-red-200"
        }`}>
          <span className={flash.type === "accept" ? "text-emerald-600 text-lg" : "text-red-500 text-lg"}>
            {flash.type === "accept" ? "✓" : "✗"}
          </span>
          <p className={`text-sm font-medium ${flash.type === "accept" ? "text-emerald-700" : "text-red-700"}`}>
            {flash.type === "accept"
              ? `Appointment with ${flash.name} accepted.`
              : `Appointment with ${flash.name} declined.`}
          </p>
          <button onClick={() => setFlash(null)} className="ml-auto text-slate-400 text-lg cursor-pointer">×</button>
        </div>
      )}

      {requests.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 flex flex-col items-center text-center">
          <div className="w-14 h-14 bg-teal-50 rounded-full flex items-center justify-center text-2xl mb-3">✓</div>
          <p className="text-slate-600 font-medium">No pending requests</p>
          <p className="text-sm text-slate-400 mt-1">All appointment requests have been reviewed.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((appt) => (
            <div key={appt.id} className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-700 font-medium text-sm shrink-0">
                    {appt.patient[0]}
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">{appt.patient}</p>
                    <p className="text-sm text-slate-500 mt-0.5">{appt.department}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs text-slate-500">📅 {appt.date}</span>
                      <span className="text-xs text-slate-500">🕐 {appt.time}</span>
                    </div>
                    <p className="text-sm text-slate-600 mt-2 bg-slate-50 rounded-lg px-3 py-2">
                      <span className="font-medium">Reason:</span> {appt.reason}
                    </p>
                  </div>
                </div>
                <StatusBadge status={appt.status} />
              </div>

              {decliningId === appt.id ? (
                <div className="mt-4 border-t border-slate-100 pt-4">
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Reason for declining</label>
                  <textarea
                    rows={2}
                    value={declineReason}
                    onChange={(e) => setDeclineReason(e.target.value)}
                    placeholder="Provide a short reason (schedule conflict, not my specialty, etc.)"
                    className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent resize-none mb-3"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => confirmDecline(appt.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                    >
                      Confirm Decline
                    </button>
                    <button
                      onClick={() => setDecliningId(null)}
                      className="bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 px-4 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => handleAccept(appt.id)}
                    className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => setDecliningId(appt.id)}
                    className="bg-white border border-red-200 text-red-500 hover:bg-red-50 px-4 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                  >
                    Decline
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Doctor — My Appointments ─────────────────────────────────────────────────

function DoctorAppointments({ appointments }: { appointments: Appointment[] }) {
  const mine = appointments.filter(
    (a) => a.doctor === "Dr. Sarah Mitchell" && a.status !== "Assigned"
  );
  const [tab, setTab] = useState<"Upcoming" | "Completed">("Upcoming");

  const upcoming = mine.filter((a) => ["Accepted", "Confirmed"].includes(a.status));
  const completed = mine.filter((a) => a.status === "Completed");
  const shown = tab === "Upcoming" ? upcoming : completed;

  return (
    <div>
      <PageHeader title="My Appointments" />

      <div className="flex gap-2 mb-5">
        {(["Upcoming", "Completed"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
              tab === t ? "bg-teal-600 text-white" : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300"
            }`}
          >
            {t} ({t === "Upcoming" ? upcoming.length : completed.length})
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 flex flex-col items-center text-center">
          <div className="w-14 h-14 bg-slate-50 rounded-full flex items-center justify-center text-2xl mb-3">📋</div>
          <p className="text-slate-600 font-medium">No {tab.toLowerCase()} appointments</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {["Patient", "Department", "Date", "Time", "Status", "Details"].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {shown.map((appt) => (
                <tr key={appt.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center text-blue-700 text-xs font-medium">
                        {appt.patient[0]}
                      </div>
                      <span className="font-medium text-slate-800">{appt.patient}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-slate-600">{appt.department}</td>
                  <td className="px-5 py-4 text-slate-600">{appt.date}</td>
                  <td className="px-5 py-4 text-slate-600">{appt.time}</td>
                  <td className="px-5 py-4"><StatusBadge status={appt.status} /></td>
                  <td className="px-5 py-4 text-slate-500 text-xs max-w-xs truncate">{appt.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── Shell ────────────────────────────────────────────────────────────────────

function DashboardShell({
  role,
  currentView,
  onNav,
  onLogout,
  children,
}: {
  role: Role;
  currentView: View;
  onNav: (v: View) => void;
  onLogout: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar role={role} currentView={currentView} onNav={onNav} onLogout={onLogout} />
      <main className="flex-1 p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [view, setView] = useState<View>("login");
  const [role, setRole] = useState<Role>("patient");
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);

  function handleLogin(r: Role) {
    setRole(r);
    setView(`${r}-dashboard` as View);
  }

  function handleLogout() {
    setView("login");
  }

  function addAppointment(appt: Appointment) {
    setAppointments((prev) => [...prev, appt]);
  }

  function assignDoctor(id: number, doctor: string, date: string, time: string) {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, doctor, date, time, status: "Assigned" } : a))
    );
  }

  function acceptAppointment(id: number) {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "Accepted" } : a))
    );
  }

  function declineAppointment(id: number) {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "Declined" } : a))
    );
  }

  if (view === "login") {
    return <LoginPage onLogin={handleLogin} />;
  }

  const nav = (v: View) => setView(v);

  const views: Partial<Record<View, React.ReactNode>> = {
    "patient-dashboard": <PatientDashboard appointments={appointments} onNav={nav} />,
    "patient-request": <PatientRequestAppointment onSubmit={addAppointment} />,
    "patient-appointments": <PatientAppointments appointments={appointments} />,
    "receptionist-dashboard": <ReceptionistDashboard appointments={appointments} onNav={nav} />,
    "receptionist-assign": <ReceptionistAssign appointments={appointments} onAssign={assignDoctor} />,
    "receptionist-appointments": <ReceptionistAppointments appointments={appointments} />,
    "doctor-dashboard": <DoctorDashboard appointments={appointments} onNav={nav} />,
    "doctor-requests": (
      <DoctorRequests
        appointments={appointments}
        onAccept={acceptAppointment}
        onDecline={declineAppointment}
      />
    ),
    "doctor-appointments": <DoctorAppointments appointments={appointments} />,
  };

  return (
    <DashboardShell role={role} currentView={view} onNav={nav} onLogout={handleLogout}>
      {views[view] ?? null}
    </DashboardShell>
  );
}
