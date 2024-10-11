"use client"

import { ProfileModel } from "@/app/models/profile.model";
import { WorkspaceModel } from "@/app/models/workspace.model";
import { useProfilesByMemberId } from "@/app/queries/profile.query";
import { useWorkspacesByIds } from "@/app/queries/workspace.query";
import { useMemberStore } from "@/app/stores/member.store"
import { useMemo } from "react";
import WorkspaceCreateModal from "./WorkspaceCreateModal";

export default function WorkspaceList() {
  const currentMember = useMemberStore(state => state.currentMember); // Zustand Store
  const { data: profiles, isLoading: isLoadingProfiles, error: profilesError } = useProfilesByMemberId(currentMember.id) // API Query

  const workspaceIds = useMemo(() => {
    if (!profiles) return [];
    return Array.from(new Set(profiles.map((profile: ProfileModel) => profile.workspaceId)));
  }, [profiles]);
  
  const { data: workspaces, isLoading: isLoadingWorkspaces, error: workspacesError } = useWorkspacesByIds(workspaceIds);

  if (isLoadingProfiles || isLoadingWorkspaces) {
    return <div>Loading...</div>;
  }

  if (profilesError || workspacesError) {
    return <div>An error occurred: {profilesError?.message || workspacesError?.message}</div>;
  }

  if (!profiles || !workspaces) {
    return <div>No data available</div>;
  }

  return (
    <>
      <div className="bg-base-300 rounded-md p-4 lg:w-[768px] w-full h-full">
        <h2 className="text-lg font-bold text-center">워크스페이스</h2>
        <div className="divider mt-2"></div>
        <ul className="menu rounded-box p-0 overflow-scroll">
          {workspaces.map((workspace: WorkspaceModel) => (
            <li key={workspace.id} className='border mb-2 rounded-md'>
              <a className="p-2">

                <div className="avatar">
                  <div className="w-16 rounded-btn">
                    <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
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
                    .map((profile: ProfileModel) => (
                      <div key={`${workspace.id}-${profile.id}`} className="avatar border">
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

          <li className="border rounded-md w-full">
            <a className="p-2 place-content-center" onClick={()=>document.getElementById('workspace-modal')?.showModal()}>
              <p className="">워크스페이스 생성하기</p>
            </a>
          </li>

        </ul>
      </div>

      <dialog id="workspace-modal" className="modal modal-bottom lg:modal-middle">
        <div className="modal-box p-4">
          
          <WorkspaceCreateModal />

          <div className="modal-action">
            <form method="dialog">
              <button className="btn">취소</button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  )
}
