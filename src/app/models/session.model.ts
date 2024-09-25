type SessionType = "VIDEO_CONFERENCE" | "SCREEN_SHARE";

interface SessionModel {
  id: number;
  startAt: string;
  endAt: string;
  profileId: number;
  sessionType: SessionType;
  profileId2: number;
}
