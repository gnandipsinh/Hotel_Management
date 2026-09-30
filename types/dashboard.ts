export type KpiTone = "default" | "success" | "warning" | "danger";

export interface KpiMetric {
  id: string;
  label: string;
  value: string;
  sublabel?: string;
  trend?: {
    direction: "up" | "down" | "neutral";
    value: string;
    label: string;
  };
  tone?: KpiTone;
}

export interface BookingRow {
  id: string;
  guestName: string;
  guestSub: string;
  room: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  source: string;
  status: "Confirmed" | "Pending" | "Checked-in" | "Checked-out" | "Cancelled" | "No-show";
  amount: string;
  payment: string;
}

export interface RoomTile {
  number: string;
  type: string;
  status: "Available" | "Occupied" | "Reserved" | "Cleaning" | "Dirty" | "Maintenance" | "Out of Service";
  detail?: string;
}

export interface OccupancyPoint {
  label: string;
  value: number;
}

export interface SupportTicket {
  id: string;
  hotel: string;
  subject: string;
  priority: "Low" | "Medium" | "High";
  status: "Open" | "In Progress" | "Waiting for Customer" | "Resolved";
  age: string;
}

export interface AuditEvent {
  id: string;
  actor: string;
  action: string;
  target: string;
  scope: string;
  time: string;
}
