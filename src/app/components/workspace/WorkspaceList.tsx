"use client"

import { ProfileModel } from "@/app/models/profile.model";
import { useProfilesByMemberId } from "@/app/queries/profile.query";
import { useWorkspacesByIds } from "@/app/queries/workspace.query";
import { useMemberStore } from "@/app/stores/member.store"
import { useMemo } from "react";

export default function WorkspaceList() {
  const currentMember = useMemberStore(state => state.currentMember); // 내 현재 멤버 객체
  console.log("memberStore: ", currentMember)
  const { data: profiles, isLoading: isLoadingProfiles, error: profilesError } = useProfilesByMemberId(currentMember.id)
  console.log("profiles:" + profiles)

  const workspaceIds = useMemo(() => {
    if (!profiles) return [];
    return Array.from(new Set(profiles.map((profile: ProfileModel) => profile.workspaceId)));
  }, [profiles]);
  console.log("workspaceIds: " + workspaceIds)
  const { data: workspaces, isLoading: isLoadingWorkspaces, error: workspacesError } = useWorkspacesByIds(workspaceIds);
  console.log("workspaces: " + workspaces)

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
    <ul className="menu bg-base-300 rounded-box lg:w-[768px] container">
      {workspaces.map((workspace) => (
        <li key={workspace.id} className='border mb-2 rounded-btn'>
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
                  <div key={profile.id} className="avatar border">
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
        <li className='border'>
          <a className='h-12'>참여중인 워크스페이스가 없습니다.</a>
        </li>
      )}
    </ul>
  )
}
