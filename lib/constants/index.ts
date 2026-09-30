/**
 * Centralized Domain Constants for HotelHub SaaS
 */

export const ROOM_STATUSES = {
  AVAILABLE: "available",
  OCCUPIED: "occupied",
  RESERVED: "reserved",
  CLEANING: "cleaning",
  MAINTENANCE: "maintenance",
} as const;

export type RoomStatusKey = (typeof ROOM_STATUSES)[keyof typeof ROOM_STATUSES];

export const BOOKING_STATUSES = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  CHECKED_IN: "checked_in",
  CHECKED_OUT: "checked_out",
  CANCELLED: "cancelled",
  NO_SHOW: "no_show",
} as const;

export type BookingStatusKey = (typeof BOOKING_STATUSES)[keyof typeof BOOKING_STATUSES];

export const PAYMENT_METHODS = {
  UPI_QR: "upi_qr",
  CREDIT_CARD: "credit_card",
  DEBIT_CARD: "debit_card",
  NET_BANKING: "net_banking",
  CASH: "cash",
  CORPORATE_BILL: "corporate_bill",
} as const;

export type PaymentMethodKey = (typeof PAYMENT_METHODS)[keyof typeof PAYMENT_METHODS];
