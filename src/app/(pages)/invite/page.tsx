"use client"
import MailInviteForm from "@/app/components/auth/MailInviteForm";
import CommonFooter from "@/app/components/common/CommonFooter";
import CommonHeader from "@/app/components/common/CommonHeader";
import LoadingScreen from "@/app/components/common/LoadingScreen";
import { Suspense } from "react";

export default function Invite() {
  return (
    <div className="flex flex-col p-4 bg-base-300 h-dvh">
      <CommonHeader />
      <main className="flex-grow p-4 bg-base-100 rounded-lg h-full">
        <div className="flex flex-col items-center justify-center h-full">  
          <Suspense fallback={<LoadingScreen/>}>
            <MailInviteForm/>
          </Suspense>
        </div>
      </main>
      <CommonFooter />
    </div>
  );
}
