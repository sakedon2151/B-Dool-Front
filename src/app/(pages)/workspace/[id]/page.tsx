"use client";
import ChannelListNav from "@/app/components/channel/ChannelListNav";
import ChannelMemberCard from "@/app/components/channel/ChannelMemberCard";
import ChannelMessageInput from "@/app/components/channel/ChannelMessageInput";
import ChannelParticipantList from "@/app/components/channel/ChannelParticipantList";
import WorkspaceHeader from "@/app/components/workspace/WorkspaceHeader";
import WorkspaceListNav from "@/app/components/workspace/WorkspaceListNav";

import { useEffect } from "react";

export default function workspace() {
  useEffect(() => {
    document.body.style.padding = "0"
    return () => {
      document.body.style.padding = "1rem"
    };
  }, []);

  return (
    <div className="h-dvh flex flex-col overflow-hidden">
      <header className="border-b">
        <WorkspaceHeader/>
      </header>

      <main className="flex flex-col flex-grow">
        <div className="flex flex-row flex-grow h-[100px]">
          <nav className="overflow-y-auto box-border">
            <WorkspaceListNav/>
          </nav>
          
          <aside className="w-48 border-r box-border overflow-y-auto">
            <ChannelListNav/>
          </aside>
          
          <section className="flex flex-col flex-grow overflow-hidden">
            <header className="h-20 border-b box-border">
              채널 info
            </header>
            <article className="flex-grow overflow-y-auto">
              해당 채널 채팅 컴포넌트
            </article>
          </section>
          
          <aside className="w-48 border-l box-border">
            <ChannelParticipantList/>
          </aside>
        </div>

        <div className="flex flex-row border-t">
          <div className="w-64 border-r">
            <ChannelMemberCard/>
          </div>
          <div className="flex-grow">
            <ChannelMessageInput/>
          </div>
        </div>
      
      </main>
    </div>
  );
}
