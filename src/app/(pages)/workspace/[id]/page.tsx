"use client";
import ChannelList from "@/app/components/channel/ChannelList";
import MiniProfileBar from "@/app/components/member/MiniProfileBar";
import MessageInput from "@/app/components/chatting/MessageInput";
import MessageList from "@/app/components/chatting/MessageList";
import ParticipantList from "@/app/components/channel/ParticipantList";
import WorkspaceHeader from "@/app/components/workspace/WorkspaceHeader";
import WorkspaceNav from "@/app/components/workspace/WorkspaceNav";

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
            <label htmlFor="workspace-drawer" aria-label="open sidebar" className="fixed m-2 btn btn-square btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block w-6 h-6 stroke-current">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </label>
            <label htmlFor="participant-drawer" aria-label="open sidebar" className="fixed right-0 m-2 btn btn-square btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block w-6 h-6 stroke-current">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </label>
            <div className="flex flex-col overflow-hidden h-dvh">
              <header className="box-border border-b">
                <WorkspaceHeader/>
              </header>
              <main className="flex flex-col flex-grow">
                <div className="flex flex-row flex-grow h-[100px]">
                  <section className="flex-grow overflow-y-auto">
                    <MessageList/>
                  </section>
                </div>
                <div className="box-border border-t">
                  <MessageInput/>
                </div>
              </main>
            </div>
          </div>
          <div className="z-10 drawer-side">
            <label htmlFor="participant-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
            <div className="flex flex-col overflow-hidden h-dvh bg-base-100">
              <div className="flex flex-grow h-[100px]">
                <aside className="w-[255px] border-l box-border overflow-y-auto">
                  <ParticipantList workspaceId={workspaceId} />
                </aside>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="drawer-side">
        <label htmlFor="workspace-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
        <div className="flex flex-col overflow-hidden h-dvh bg-base-100">
          <div className="flex flex-row flex-grow h-[100px]">
            <nav className="flex-shrink-0 overflow-y-auto ">
              <WorkspaceNav/>
            </nav>
            <aside className="box-border flex-shrink-0 w-48 overflow-y-auto border-r">
              <ChannelList workspaceId={workspaceId}/>
            </aside>
          </div>
          <div className="w-64 border-t border-r">
            <MiniProfileBar/>
          </div>
        </div>
      </div>
    </div>
  );
}
