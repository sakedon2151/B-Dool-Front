export interface MailVerification {
  id: number;
  email: string;
  verificationCode: string;
  expiredAt: string;
  createdAt: string;
}

// Strict Type Model