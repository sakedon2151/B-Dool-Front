"use client"
import LoginForm from "@/app/components/auth/EmailLoginForm";
import VerificationCodeInput from "@/app/components/auth/VerificationCodeForm";
import WebFooter from "@/app/components/index/WebFooter";
import WebHeader from "@/app/components/index/WebHeader";
import { useRouter } from "next/navigation";

// login, register page
export default function auth() {
  const router = useRouter()

  return (
    <>
      <WebHeader />
      <main>
        <div className="card bg-base-200 rounded-2xl p-8 h-dvh items-center">
          <LoginForm/>
          <button onClick={() => router.push(`/workspace/${1}`)} className="btn btn-warning mt-4">bypass</button>
        </div>
      </main>
      <WebFooter />
    </>
  );
}
