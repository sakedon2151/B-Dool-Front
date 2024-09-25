type DaysOfWeekType =
  | "SUNDAY"
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY";

interface DaysOfWeekModel {
  id: number; // daysOfWeek PK
  daysOfWeek: DaysOfWeekType;
  recurrenceId: number; // 일정반복 ID
}
