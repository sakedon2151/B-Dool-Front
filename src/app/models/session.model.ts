type SessionType = 'VIDEO_CONFERENCE' | 'SCREEN_SHARE'

interface SessionModel {
  id: number
  startAt: Date
  endAt: Date

  profileId: number
  sessionType: SessionType
  
  profileId2: number
}