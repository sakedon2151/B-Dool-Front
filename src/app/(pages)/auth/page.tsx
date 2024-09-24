"use client"
import LoginForm from "@/app/components/auth/EmailLoginForm";
import WebFooter from "@/app/components/index/WebFooter";
import WebHeader from "@/app/components/index/WebHeader";
import { useRouter } from "next/navigation";

// login, register page
export default function auth() {
  const router = useRouter()

  return (
    <div className="p-4 h-dvh flex flex-col">
      <WebHeader />
      
      <main className="flex-grow">
        <div className="bg-base-200 rounded-btn p-4 h-full flex flex-col justify-center items-center">
          
          <LoginForm/>
          <button onClick={() => router.push(`/workspace/${1}`)} className="btn btn-warning mt-4">bypass</button>

        </div>
      </main>
      
      <WebFooter />
    </div>
  );
}
