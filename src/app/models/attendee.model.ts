type StatusType = 'PENDING' | 'OK' | 'NO'

interface AttendeeModel {
    id: number
    status: StatusType
    eventId: number // 일정 ID
    profileId: number // 참석자 프로필 ID
}