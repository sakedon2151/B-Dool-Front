"use client";
import ChannelInformation from "@/app/components/channel/ChannelInformation";
import ChannelListNav from "@/app/components/channel/ChannelListNav";
import ChannelMemberCard from "@/app/components/channel/ChannelMemberCard";
import ChannelMessageInput from "@/app/components/channel/ChannelMessageInput";
import ChannelMessageList from "@/app/components/channel/ChannelMessageList";
import ChannelParticipantList from "@/app/components/channel/ChannelParticipantList";
import WorkspaceHeader from "@/app/components/workspace/WorkspaceHeader";
import WorkspaceListNav from "@/app/components/workspace/WorkspaceListNav";

export default function workspace() {

  return (
    <div className="h-dvh flex flex-col overflow-hidden">
      <header className="border-b">
        <WorkspaceHeader/>
      </header>

      <main className="flex flex-col flex-grow">
        <div className="flex flex-row flex-grow h-[100px]">
          <nav className="overflow-y-auto box-border flex-shrink-0">
            <WorkspaceListNav/>
          </nav>
          <aside className="w-48 border-r box-border overflow-y-auto flex-shrink-0">
            <ChannelListNav/>
          </aside>
          <section className="flex flex-col flex-grow overflow-hidden">
            <header className="border-b box-border flex-shrink-0">
              <ChannelInformation/>
            </header>
            <article className="flex-grow overflow-y-auto">
              <ChannelMessageList/>
            </article>
          </section>
          <aside className="w-48 border-l box-border overflow-y-auto flex-shrink-0">
            <ChannelParticipantList/>
          </aside>
        </div>
        <div className="flex flex-row items-end h-16">
          <div className="w-64 border-r border-t">
            <ChannelMemberCard/>
          </div>
          <div className="flex-grow border-t">
            <ChannelMessageInput/>
          </div>
        </div>
      </main>
    </div>
  );
}
