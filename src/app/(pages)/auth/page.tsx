"use client"
import EmailLoginForm from "@/app/components/auth/EmailLoginForm";
import CommonFooter from "@/app/components/common/CommonFooter";
import CommonHeader from "@/app/components/common/CommonHeader";
import { authService } from "@/app/services/auth/auth.api";
import { useMemberStore } from "@/app/stores/memberStores";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function auth() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true);
  const setFetchedMember = useMemberStore((state) => state.setFetchedMember)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await authService.();
        if (response.isAuthenticated && response.member) {
          // 페이지에 접근하면 먼저 axios 헤더에 들어있는 토큰을 서버로 전달하고 member 객체가 응답으로 왔다면
          // zustand store 에 데이터 담고 페이지 이동
          setFetchedMember(response.member); // 사실상 로그인 데이터 클라이언트가 흭득
          router.push("/workspace"); // 로그인 이후 페이지로 이동
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, [router, setFetchedMember]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col p-4 h-dvh">
      <CommonHeader />
      <main className="flex-grow">
        <div className="flex flex-col items-center justify-center h-full p-4 bg-base-200 rounded-btn">
          <EmailLoginForm />
          <button className="mt-4 btn btn-warning">bypass</button>
        </div>
      </main>
      <CommonFooter />
    </div>
  );
}
