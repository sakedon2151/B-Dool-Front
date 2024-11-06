"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import EmailLoginForm from "@/app/components/auth/MailLoginForm";
import CommonFooter from "@/app/components/common/CommonFooter";
import CommonHeader from "@/app/components/common/CommonHeader";
import { getToken } from "@/app/utils/cookieController";
import { memberService } from "@/app/services/member/member.service";
import { useMemberStore } from "@/app/stores/member.store";
import LoadingScreen from "@/app/components/common/LoadingScreen";

export default function Auth() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { setCurrentMember } = useMemberStore();

  useEffect(() => {    
    checkHasToken();
  }, []);

  const checkHasToken = async () => {
    try {
      const token = getToken();
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const currentMember = await memberService.getCurrentMember();
        setCurrentMember(currentMember);
        router.push("/workspace");
      } catch (error) {
        console.error("Auth check failed:", error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
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
