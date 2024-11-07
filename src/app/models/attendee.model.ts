// fullModel
type StatusType = "PENDING" | "OK" | "NO";
export interface AttendeeModel {
  id: number;
  status: StatusType;
  eventId: number;
  profileId: number;
}