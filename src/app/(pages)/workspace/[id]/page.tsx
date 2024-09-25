"use client";
import ChannelListNav from "@/app/components/channel/ChannelListNav";
import ChannelMemberCard from "@/app/components/channel/ChannelMemberCard";
import ChannelMessageInput from "@/app/components/channel/ChannelMessageInput";
import ChannelMessageList from "@/app/components/channel/ChannelMessageList";
import ChannelParticipantList from "@/app/components/channel/ChannelParticipantList";
import WorkspaceHeader from "@/app/components/workspace/WorkspaceHeader";
import WorkspaceListNav from "@/app/components/workspace/WorkspaceListNav";

interface WorkspacePageProps {
  params: {
    id: string;
  };
}

export default function workspace({ params }: WorkspacePageProps) {
  const workspaceId = parseInt(params.id, 10)

  return (
    <div className="drawer lg:drawer-open">
      <input id="workspace-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        <div className="drawer drawer-end lg:drawer-open">
          <input id="participant-drawer" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content">
            <label htmlFor="workspace-drawer" aria-label="open sidebar" className="btn btn-square btn-ghost m-2 lg:hidden fixed">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block h-6 w-6 stroke-current">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </label>
            <label htmlFor="participant-drawer" aria-label="open sidebar" className="btn btn-square btn-ghost m-2 lg:hidden fixed right-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block h-6 w-6 stroke-current">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </label>
            <div className="h-dvh flex flex-col overflow-hidden">
              <header className="border-b box-border">
                <WorkspaceHeader/>
              </header>
              <main className="flex flex-col flex-grow">
                <div className="flex flex-row flex-grow h-[100px]">
                  <section className="flex-grow overflow-y-auto">
                    <ChannelMessageList/>
                  </section>
                </div>
                <div className="border-t box-border">
                  <ChannelMessageInput/>
                </div>
              </main>
            </div>
          </div>
          <div className="drawer-side z-10">
            <label htmlFor="participant-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
            <div className="h-dvh flex flex-col overflow-hidden bg-base-100">
              <div className="flex flex-grow h-[100px]">
                <aside className="w-[255px] border-l box-border overflow-y-auto">
                  <ChannelParticipantList workspaceId={workspaceId} />
                </aside>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="drawer-side">
        <label htmlFor="workspace-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
        <div className="h-dvh flex flex-col overflow-hidden bg-base-100">
          <div className="flex flex-row flex-grow h-[100px]">
            <nav className="overflow-y-auto flex-shrink-0 ">
              <WorkspaceListNav/>
            </nav>
            <aside className="w-48 border-r box-border overflow-y-auto flex-shrink-0">
              <ChannelListNav workspaceId={workspaceId}/>
            </aside>
          </div>
          <div className="w-64 border-r border-t">
            <ChannelMemberCard/>
          </div>
        </div>
      </div>
    </div>
  );
}
