"use client";
import ChannelListNav from "@/app/components/channel/ChannelListNav";
import ChannelMemberCard from "@/app/components/channel/ChannelMemberCard";
import ChannelMessageInput from "@/app/components/channel/ChannelMessageInput";
import ChannelMessageList from "@/app/components/channel/ChannelMessageList";
import ChannelParticipantList from "@/app/components/channel/ChannelParticipantList";
import WorkspaceHeader from "@/app/components/workspace/WorkspaceHeader";
import WorkspaceListNav from "@/app/components/workspace/WorkspaceListNav";

export default function workspace() {

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
                  <ChannelParticipantList/>
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
              <ChannelListNav/>
            </aside>
          </div>
          <div className="w-64 border-r border-t">
            <ChannelMemberCard/>
          </div>
        </div>
      </div>
    </div>



    // legacy layout
    // <div className="h-dvh flex flex-col overflow-hidden">
    //   <header className="border-b">
    //     <WorkspaceHeader/>
    //   </header>

    //   <main className="flex flex-col flex-grow">
    //     <div className="flex flex-row flex-grow h-[100px]">

    //       <nav className="overflow-y-auto flex-shrink-0 web-layout">
    //         <WorkspaceListNav/>
    //       </nav>
          
    //       <aside className="w-48 border-r box-border overflow-y-auto flex-shrink-0 web-layout">
    //         <ChannelListNav/>
    //       </aside>

    //       <section className="flex flex-col flex-grow overflow-hidden">
    //         <header className="border-b box-border flex-shrink-0">
    //           <ChannelInformation/>
    //         </header>
    //         <article className="flex-grow overflow-y-auto">
    //           <ChannelMessageList/>
    //         </article>
    //       </section>
          
    //       <aside className="w-48 border-l box-border overflow-y-auto flex-shrink-0 web-layout">
    //         <ChannelParticipantList/>
    //       </aside>
    //     </div>
        
    //     <div className="flex flex-row items-end h-16">
    //       <div className="w-64 border-r border-t web-layout">
    //         <ChannelMemberCard/>
    //       </div>
    //       <div className="flex-grow border-t">
    //         <ChannelMessageInput/>
    //       </div>
    //     </div>
    //   </main>
    // </div>
  );
}
