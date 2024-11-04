"use client"

import { ProfileModel } from "@/app/models/profile.model";
import { WorkspaceModel } from "@/app/models/workspace.model";
import { useProfilesByMemberId } from "@/app/queries/profile.query";
import { useWorkspacesByIds } from "@/app/queries/workspace.query";
import { useMemberStore } from "@/app/stores/member.store"
import { useMemo, useState } from "react";
import WorkspaceCreateModal from "./WorkspaceCreateModal";
import { useRouter } from "next/navigation";
import { useWorkspaceStore } from "@/app/stores/workspace.store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo, faCircleXmark } from "@fortawesome/free-solid-svg-icons";

export default function WorkspaceList() {
  const router = useRouter()
  const [modalKey, setModalKey] = useState<number>(0);
  
  const currentMember = useMemberStore(state => state.currentMember); // Zustand Store
  const setCurrentWorkspace = useWorkspaceStore(state => state.setCurrentWorkspace);  // Zustand Store

  const { data: profiles, isLoading: isLoadingProfiles, error: profilesError } = useProfilesByMemberId(currentMember.id) // API Query
  const workspaceIds = useMemo(() => {
    if (!profiles) return [];
    return Array.from(new Set(profiles.map((profile: ProfileModel) => profile.workspaceId)));
  }, [profiles]);
  const { data: workspaces, isLoading: isLoadingWorkspaces, error: workspacesError } = useWorkspacesByIds(workspaceIds); // API Query

  const handleModalClose = () => {
    (document.getElementById('workspace-modal') as HTMLDialogElement).close()
    setModalKey(prev => prev + 1);
  };

  const handleModalOpen = () => {
    setModalKey(prev => prev + 1);
    (document.getElementById('workspace-modal') as HTMLDialogElement).showModal()
  };

  const handleWorkspaceSelect = (workspace: WorkspaceModel) => {
    setCurrentWorkspace(workspace);
    router.push(`/workspace/${workspace.url}`);
  };

  return (
    <>
      <div className="bg-base-200 rounded-lg p-4 lg:w-[768px] w-full h-full shadow-lg relative">
        <h2 className="text-lg font-bold opacity-75 text-center mb-4">워크스페이스</h2>

        {isLoadingProfiles || isLoadingWorkspaces ? (
          <div className="skeleton rounded-lg w-full h-[calc(100%-44px)] shadow-lg"></div>
        ) : profilesError || workspacesError ? (
          <div role="alert" className="alert alert-error">
            <FontAwesomeIcon icon={faCircleXmark} className="w-6 h-6 opacity-75"/>
            에러가 발생했습니다. 잠시 후 다시 시도해주세요.<br/>{profilesError?.message || workspacesError?.message}
          </div>
        ) : !profiles || !workspaces ? (
          <div className="bg-base-100 rounded-lg w-full h-[calc(100%-44px)] shadow-lg flex items-center justify-center">데이터를 불러 올 수 없습니다.</div>
        ) : (
          <div className="h-[calc(100%-108px)] overflow-y-auto">
            <ul className="menu flex-row p-0">
              {workspaces.map((workspace: WorkspaceModel) => (
                
                <li key={workspace.id} className='mb-4 bg-base-100 w-full rounded-lg'>
                  <a className="p-4 gap-4" onClick={() => handleWorkspaceSelect(workspace)}>
                    <div className="avatar">
                      <div className="w-16 rounded-lg">
                        <img src={workspace.workspaceImageUrl} />
                      </div>
                    </div>
                    <div>
                      <p className='text-lg font-bold'>{workspace.name}</p>
                      <p>{workspace.description}</p>
                    </div>
                    <div className="avatar-group -space-x-4 rtl:space-x-reverse lg:block hidden">
                      {profiles
                        .filter(profile => profile.workspaceId === workspace.id)
                        .slice(0, 3)
                        .map((profile: ProfileModel, index) => (
                          <div key={`${workspace.id}-${profile.id || index}`} className="avatar border border-base-100">
                            <div className="w-8">
                              <img src={profile.profileImgUrl} alt="profile_image"/>
                            </div>
                          </div>
                        ))
                      }
                      {profiles.filter((profile: ProfileModel) => profile.workspaceId === workspace.id).length > 3 && (
                        <div className="avatar placeholder border">
                          <div className="bg-neutral text-neutral-content w-8">
                            <span className='text-xs'>+{profiles.filter((profile: ProfileModel) => profile.workspaceId === workspace.id).length - 3}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </a>
                </li>

              ))}
              {workspaces.length === 0 && (
                <div role="alert" className="alert alert-info mb-4">
                  <FontAwesomeIcon icon={faCircleInfo} className="w-6 h-6 opacity-75"/>
                  <span>참여중인 워크스페이스 목록이 없습니다.</span>
                </div>
              )}
            </ul>
            
            <button className="btn w-[calc(100%-32px)] bg-base-100 absolute bottom-4 left-4" onClick={handleModalOpen}>
              새 워크스페이스 생성하기
            </button>
          </div>
        )}
      </div>

      <dialog id="workspace-modal" className="modal modal-bottom lg:modal-middle">
        <div className="modal-box p-4">
          <WorkspaceCreateModal key={modalKey} onComplete={handleModalClose} />
          <div className="modal-action absolute bottom-4 right-4">
            <form method="dialog">
              <button className="btn" onClick={handleModalClose} >취소</button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  )
}
