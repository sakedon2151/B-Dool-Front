"use client"
import EmailLoginForm from "@/app/components/auth/EmailLoginForm";
import CommonFooter from "@/app/components/common/CommonFooter";
import CommonHeader from "@/app/components/common/CommonHeader";
import { useRouter } from "next/navigation";

export default function auth() {
  const router = useRouter()

  return (
    <div className="flex flex-col p-4 h-dvh">
      <CommonHeader />
      <main className="flex-grow">
        <div className="flex flex-col items-center justify-center h-full p-4 bg-base-200 rounded-btn">
          
          <EmailLoginForm />
          <button onClick={() => router.push("/workspace")} className="mt-4 btn btn-warning">bypass</button>
        
        </div>
      </main>
      <CommonFooter />
    </div>
  );
}
