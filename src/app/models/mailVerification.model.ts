interface MailVerification {
  id: number
  email: string
  verificationCode: string
  expiredAt: Date
  createdAt: Date
}