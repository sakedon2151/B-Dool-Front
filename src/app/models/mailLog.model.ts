interface MailLogModel {
  id: number
  email: string
  subject: string
  body: string
  isSent: boolean
  sentAt: Date
}