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
    document.getElementById('workspace-modal')?.close()
    setModalKey(prev => prev + 1);
  };

  const handleModalOpen = () => {
    setModalKey(prev => prev + 1);
    document.getElementById('workspace-modal')?.showModal();
  };

  const handleWorkspaceSelect = (workspace: WorkspaceModel) => {
    setCurrentWorkspace(workspace);
    router.push(`/workspace/${workspace.id}`);
  };

  if (isLoadingProfiles || isLoadingWorkspaces) {
    return <div className="loading loading-spinner loading-lg">Loading...</div>;
  }
  if (profilesError || workspacesError) {
    return <div className="text-center">에러가 발생했습니다. 잠시 후 다시 시도해주세요.<br/>{profilesError?.message || workspacesError?.message}</div>;
  }
  if (!profiles || !workspaces) {
    return <div>참여중인 워크스페이스를 찾을 수 없습니다.</div>;
  }

  return (
    <>
      <div className="bg-base-300 rounded-md p-4 lg:w-[768px] w-full h-full">
        <h2 className="text-lg font-bold text-center">워크스페이스</h2>
        <div className="divider mt-2"></div>
        <ul className="menu p-0 overflow-scroll">
          
          {workspaces.map((workspace: WorkspaceModel) => (
            <li key={workspace.id} className='border mb-2 rounded-md'>
              <a className="p-2" onClick={() => handleWorkspaceSelect(workspace)}>

                <div className="avatar">
                  <div className="w-16 rounded-btn">
                    <img src={workspace.workspaceImageUrl} />
                  </div>
                </div>

                <div>
                  <p className='text-lg font-bold'>{workspace.name}</p>
                  <p>{workspace.description}</p>
                </div>

                <div className="avatar-group -space-x-4 rtl:space-x-reverse">
                  {profiles
                    .filter(profile => profile.workspaceId === workspace.id)
                    .slice(0, 3)
                    .map((profile: ProfileModel, index) => (
                      <div key={`${workspace.id}-${profile.id || index}`} className="avatar border">
                        <div className="w-8">
                          <img src={profile.profileImgUrl || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"} alt="profile image"/>
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
            <div role="alert" className="alert alert-info mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="h-6 w-6 shrink-0 stroke-current">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span>참여중인 워크스페이스 목록이 없습니다.</span>
            </div>
          )}

          <li className="">
            <button className="btn btn-primary" onClick={handleModalOpen}>
              워크스페이스 생성하기
            </button>
          </li>

        </ul>
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
