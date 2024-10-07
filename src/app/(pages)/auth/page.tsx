"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import EmailLoginForm from "@/app/components/auth/EmailLoginForm";
import CommonFooter from "@/app/components/common/CommonFooter";
import CommonHeader from "@/app/components/common/CommonHeader";
import { getToken, removeToken } from "@/app/utils/tokenController";
import { memberService } from "@/app/services/member/member.service";
import { authService } from "@/app/services/auth/auth.service";
import { useMemberStore } from "@/app/stores/member.store";

export default function auth() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true);
  const { setCurrentMember } = useMemberStore();

  useEffect(() => {    
    checkHasToken();
  });

  const checkHasToken = async () => {
    const token = getToken();
    if (token) {
      try {
        // await authService.refreshToken(); // 에러 발생!
        const currentMember = await memberService.getCurrentMember();
        setCurrentMember(currentMember)
        router.push("/workspace");
      } catch (error) {
        console.error("유효성 검증 실패:", error);
        removeToken(); // 토큰이 유효하지 않은 경우 일단 제거
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

        <div className="flex flex-col items-center justify-center h-full p-4 bg-base-200 rounded-lg">  
          <EmailLoginForm />
        </div>
        
      </main>
      <CommonFooter />
    </div>
  );
}
