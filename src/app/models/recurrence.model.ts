type RecurrenceType = "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY" | "CUSTOM";

interface RecurrenceModel {
  id: number; // PK
  recurrenceType: RecurrenceType;
  interval: number;
  dayOfMonth: number;
  isCustom: boolean;
  eventId: number; // 일정 ID
}
