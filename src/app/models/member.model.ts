interface MemberModel {
    id: number
    email: string
    createdAt: Date
}

// request
interface LoginRequest {
    email: string
    token?: string
}
interface VerificationRequest {
    email: string // 보낼지 말지 고민중
    code: string
}

// response
interface LoginResponse {
    member: MemberModel
    token: string
}