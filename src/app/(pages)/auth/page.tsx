"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import EmailLoginForm from "@/app/components/auth/EmailLoginForm";
import CommonFooter from "@/app/components/common/CommonFooter";
import CommonHeader from "@/app/components/common/CommonHeader";
// import { useMemberStore } from "@/app/stores/memberStores";
import { getToken, removeToken } from "@/app/utils/tokenController";
import { memberService } from "@/app/services/member/member.service";

export default function auth() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true);
  // const setFetchedMember = useMemberStore((state) => state.setFetchedMember) // zustand store

  useEffect(() => {    
    checkHasToken();
  }, [router]);

  const checkHasToken = async () => {
    const token = getToken();
    if (token) {
      try {
        await authService.refreshToken();
        const currentMember = await memberService.getCurrentMember();
        console.log(currentMember)
        // setFetchedMember(currentMember);
        router.push("/workspace");
      } catch (error) {
        console.error("유효성 검증 실패:", error);
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
