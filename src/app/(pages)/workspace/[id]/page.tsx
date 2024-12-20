"use client";
import ChannelList from "@/app/components/channel/ChannelList";
import ProfileMiniBar from "@/app/components/member/ProfileMiniBar";
import MessageInput from "@/app/components/chatting/MessageInput";
import MessageList from "@/app/components/chatting/MessageList";
import ParticipantList from "@/app/components/channel/ParticipantList";
import WorkspaceHeader from "@/app/components/workspace/WorkspaceHeader";
import WorkspaceNav from "@/app/components/workspace/WorkspaceNav";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faList } from "@fortawesome/free-solid-svg-icons";
import { useWorkspaceStore } from "@/app/stores/workspace.store";

export default function Workspace() {
  const currentWorkspace = useWorkspaceStore(state => state.currentWorkspace)

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
              <FontAwesomeIcon icon={faList} className="w-6 h-6 opacity-75"/>
            </label>
            <div className="flex flex-col overflow-hidden h-dvh">
              <header className="box-border border-b border-base-300">
                <WorkspaceHeader/>
              </header>
              <main className="flex flex-col flex-grow">
                <div className="flex flex-row flex-grow h-[100px]">
                  <section className="flex-grow overflow-y-auto">
                    <MessageList workspaceId={currentWorkspace.id} />
                  </section>
                </div>
                <div className="box-border border-t border-base-300">
                  <MessageInput workspaceId={currentWorkspace.id} />
                </div>
              </main>
            </div>
          </div>
          <div className="z-10 drawer-side">
            <label htmlFor="participant-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
            <div className="flex flex-col overflow-hidden h-dvh bg-base-100">
              <div className="flex flex-grow h-[100px]">
                <aside className="w-[255px] border-l box-border overflow-y-auto border-base-300">
                  <ParticipantList/>
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
            <nav className="flex-shrink-0 overflow-y-auto">
              <WorkspaceNav/>
            </nav>
            <aside className="box-border flex-shrink-0 w-48 overflow-y-auto border-r border-base-300">
              <ChannelList workspaceId={currentWorkspace.id}/>
            </aside>
          </div>
          <div className="w-64 border-t border-r border-base-300">
            <ProfileMiniBar/>
          </div>
        </div>
      </div>
    </div>
  );
}
