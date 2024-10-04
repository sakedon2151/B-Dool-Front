"use client"
import EmailLoginForm from "@/app/components/auth/EmailLoginForm";
import CommonFooter from "@/app/components/common/CommonFooter";
import CommonHeader from "@/app/components/common/CommonHeader";
import { authService } from "@/app/services/auth/auth.api";
import { memberService } from "@/app/services/member/member.api";
import { useMemberStore } from "@/app/stores/memberStores";
import { getToken, removeToken } from "@/app/utils/tokenController";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function auth() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true);
  const setFetchedMember = useMemberStore((state) => state.setFetchedMember)

  useEffect(() => {    
    checkHasToken();
  }, [router, setFetchedMember]);

  const checkHasToken = async () => {
    const token = getToken();
    if (token) {
      try {
        await authService.refreshToken();
        const currentMember = await memberService.getCurrentMember();
        setFetchedMember(currentMember);
        router.push("/workspace");
      } catch (error) {
        console.error("Auth check failed:", error);
        removeToken(); // 토큰이 유효하지 않은 경우 제거
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col p-4 h-dvh">
      <CommonHeader />
      <main className="flex-grow">
        <div className="flex flex-col items-center justify-center h-full p-4 bg-base-200 rounded-btn">
          
          <EmailLoginForm />
        
        </div>
      </main>
      <CommonFooter />
    </div>
  );
}
