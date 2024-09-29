type SessionType = "VIDEO_CONFERENCE" | "SCREEN_SHARE";
export interface SessionModel {
  sessionId: string; // uuid pk
  startAt: string; // 세션 시작시간
  endAt: string; // 세션 종료시간
  profileId: number; // ?
  sessionType: SessionType; // 세션 타입
  channelMemberId: string; // 세션 생성자 pk
}

// Strict Type Model
