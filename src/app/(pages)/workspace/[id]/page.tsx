"use client";
import ChannelList from "@/app/components/channel/ChannelList";
import ProfileMiniBar from "@/app/components/member/ProfileMiniBar";
import MessageInput from "@/app/components/chatting/MessageInput";
import MessageList from "@/app/components/chatting/MessageList";
import ParticipantList from "@/app/components/channel/ParticipantList";
import WorkspaceHeader from "@/app/components/workspace/WorkspaceHeader";
import WorkspaceNav from "@/app/components/workspace/WorkspaceNav";
import { useParams } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

export default function workspace() {
  const params = useParams();
  const workspaceId = parseInt(params.id as string, 10);

  return (
    <div className="drawer lg:drawer-open">
      <input id="workspace-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        <div className="drawer drawer-end lg:drawer-open">
          <input id="participant-drawer" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content">
            <label htmlFor="workspace-drawer" aria-label="open sidebar" className="fixed m-2 btn btn-square btn-ghost lg:hidden">
              <FontAwesomeIcon icon={faBars} className="w-6 h-6 opacity-75"/>
            </label>
            <label htmlFor="participant-drawer" aria-label="open sidebar" className="fixed right-0 m-2 btn btn-square btn-ghost lg:hidden">
              <FontAwesomeIcon icon={faBars} className="w-6 h-6 opacity-75"/>
            </label>
            <div className="flex flex-col overflow-hidden h-dvh">
              <header className="box-border border-b">
                <WorkspaceHeader/>
              </header>
              <main className="flex flex-col flex-grow">
                <div className="flex flex-row flex-grow h-[100px]">
                  <section className="flex-grow overflow-y-auto">
                    <MessageList workspaceId={workspaceId} />
                  </section>
                </div>
                <div className="box-border border-t">
                  <MessageInput workspaceId={workspaceId} />
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
            <ProfileMiniBar/>
          </div>
        </div>
      </div>
    </div>
  );
}
