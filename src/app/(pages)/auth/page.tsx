"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import EmailLoginForm from "@/app/components/auth/EmailLoginForm";
import CommonFooter from "@/app/components/common/CommonFooter";
import CommonHeader from "@/app/components/common/CommonHeader";
import { getToken, removeToken } from "@/app/utils/cookieController";
import { memberService } from "@/app/services/member/member.service";
import { authService } from "@/app/services/auth/auth.service";
import { useMemberStore } from "@/app/stores/member.store";
import LoadingScreen from "@/app/components/common/LoadingScreen";

export default function Auth() {
  const router = useRouter()
  const [loading, setLoading] = useState(true);
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
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingScreen/>;
  }

  return (
    <div className="flex flex-col p-4 bg-base-300 h-dvh">
      <CommonHeader />
      <main className="flex-grow p-4 bg-base-100 rounded-lg h-full">
        
        <div className="flex flex-col items-center justify-center h-full">  
          <EmailLoginForm />
        </div>
      
      </main>
      <CommonFooter />
    </div>
  );
}
