import { useState } from "react";
import CalendarModal from "../calendar/CalendarModal";
import { useChannelStore } from "@/app/stores/channel.store";
import { useWorkspaceStore } from "@/app/stores/workspace.store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical, faHashtag, faMagnifyingGlass, faUser, faVideo } from "@fortawesome/free-solid-svg-icons";
import { faBell, faCalendarDays } from '@fortawesome/free-regular-svg-icons'
import SearchModal from "../search/SearchInput";

export default function WorkspaceHeader() {
  const currentChannel = useChannelStore(state => state.currentChannel);  // Zustand Store
  const currentWorkspace = useWorkspaceStore(state => state.currentWorkspace);  // Zustand Store
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      <div className="justify-between navbar">
        <div className="flex gap-2 ml-14 lg:m-0">
          <div className="avatar">
            <div className="w-12 rounded-btn">
              <img src={currentWorkspace.workspaceImageUrl} alt="workspace_thumbnail_image"/>
            </div>
          </div>
          <div className="flex flex-col">
            <h2 className="font-bold ">{currentWorkspace.name}</h2>
            <div className="flex items-center gap-2">
              {currentChannel.channelType === "DM" ? <FontAwesomeIcon icon={faUser} className="w-4 h-4 opacity-75"/> : <FontAwesomeIcon icon={faHashtag} className="w-4 h-4 opacity-75"/>}
              <p>{currentChannel.name}</p>
            </div>
          </div>
        </div>
        
        <div className="mr-14 lg:m-0">

          <div className="block lg:hidden">
            <button className="btn btn-ghost" onClick={toggleExpand}>
              <FontAwesomeIcon icon={faEllipsisVertical} className="w-4 h-4 opacity-75"/>
            </button>

            {isExpanded && (
              <div className="absolute right-0 mt-4 p-2 bg-base-100 rounded-btn rounded-r-none border-y border-l border-base-300 z-10 shadow-lg">
                <div className="flex flex-col gap-2">
                  <button className="btn btn-ghost btn-circle" onClick={() => (document.getElementById('calendar-modal') as HTMLDialogElement).showModal()}>
                    <FontAwesomeIcon icon={faCalendarDays} className="w-4 h-4 opacity-75"/>
                  </button>

                  <button className="btn btn-ghost btn-circle">
                    <FontAwesomeIcon icon={faVideo} className="w-4 h-4 opacity-75"/>
                  </button>

                  <button className="btn btn-ghost btn-circle" onClick={() => (document.getElementById('search-modal') as HTMLDialogElement).showModal()}>
                    <FontAwesomeIcon icon={faMagnifyingGlass} className="w-4 h-4 opacity-75"/>
                  </button>

                  <div className="dropdown dropdown-end">
                    <button className="btn btn-ghost btn-circle">
                      <div className="indicator">
                        <FontAwesomeIcon icon={faBell} className="w-4 h-4 opacity-75"/>
                        <span className="badge badge-xs badge-error indicator-item"></span>
                      </div>
                    </button>
                    <div className="dropdown-content bg-base-100 rounded-box z-[20] w-52 p-2 shadow">
                      알림 리스트 컴포넌트
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="lg:block hidden">
            <div className="lg:tooltip lg:tooltip-bottom" data-tip="캘린더">
              <button className="btn btn-ghost btn-circle" onClick={() => (document.getElementById('calendar-modal') as HTMLDialogElement).showModal()} >
                <FontAwesomeIcon icon={faCalendarDays} className="w-4 h-4 opacity-75"/>
              </button>
            </div>
            
            <div className="lg:tooltip lg:tooltip-bottom" data-tip="영상 통화">
              <button className="btn btn-ghost btn-circle">
                <FontAwesomeIcon icon={faVideo} className="w-4 h-4 opacity-75"/>
              </button>
            </div>
            
            <div className="lg:tooltip lg:tooltip-bottom" data-tip="검색">
              <button className="btn btn-ghost btn-circle" onClick={() => (document.getElementById('search-modal') as HTMLDialogElement).showModal()} >
                <FontAwesomeIcon icon={faMagnifyingGlass} className="w-4 h-4 opacity-75"/>
              </button>
            </div>
            
            <div className="dropdown dropdown-end lg:tooltip lg:tooltip-bottom" data-tip="알림">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
                <div className="indicator">
                  <FontAwesomeIcon icon={faBell} className="w-4 h-4 opacity-75"/>
                  <span className="z-0 badge badge-xs badge-error indicator-item"></span>
                </div>
              </div>
              <div tabIndex={0} className="dropdown-content bg-base-100 rounded-box z-[20] w-52 p-2 shadow">
                알림 리스트 컴포넌트
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* modal dialog */}
      <dialog id="calendar-modal" className="modal">
        <div className="modal-box p-4">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </form>
          <CalendarModal/>
        </div>
      </dialog>
      
      {/* modal dialog */}
      <dialog id="search-modal" className="modal">
        <div className="modal-box p-4">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </form>
          <SearchModal/>
        </div>
      </dialog>
    </>
  );
}
