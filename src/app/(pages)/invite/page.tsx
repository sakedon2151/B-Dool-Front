"use client"
import MailInviteForm from "@/app/components/auth/MailInviteForm";
import CommonFooter from "@/app/components/common/CommonFooter";
import CommonHeader from "@/app/components/common/CommonHeader";
import { useSearchParams } from "next/navigation";

export default function Invite() {
  const searchParams = useSearchParams();
  const invitationCode = searchParams.get('code');

  return (
    <div className="flex flex-col p-4 bg-base-300 h-dvh">
      <CommonHeader />
      <main className="flex-grow p-4 bg-base-100 rounded-lg h-full">
        
        <div className="flex flex-col items-center justify-center h-full">  
          <MailInviteForm invitationCode={invitationCode}/>
        </div>
      
      </main>
      <CommonFooter />
    </div>
  );
}
