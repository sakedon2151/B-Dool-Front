"use client"
import { ProfileModel } from '@/app/models/profile.model';
import { WorkspaceModel } from '@/app/models/workspace.model';
import { profileService } from '@/app/services/member/profile.api';
import { workspaceService } from '@/app/services/workspace/workspace.api';
import { profile } from 'console';
import { filter } from 'lodash';
import React, { useEffect, useState } from 'react'

export default function WorkspaceList() {
  const [workspaces, setWorkspaces] = useState<WorkspaceModel[]>([]);
  const [profiles, setProfiles] = useState<ProfileModel[]>([]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const memberId = 1 // 임시. store 로 담은 member 객체 불러오기

  useEffect(() => {
    // if (memberId) {
    //   fetchProfilesAndWorkspaces();
    // }

    fetchProfilesAndWorkspaces();
  }, [memberId]);

  const fetchProfilesAndWorkspaces = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // const fetchedProfiles = await profileService.getProfilesByMemberId(memberId);
      // setProfiles(fetchedProfiles);

      // const workspaceIds = fetchedProfiles
      //   .map(profile => profile.workspaceId)
      //   .filter((value, index, self) => self.indexOf(value) === index);

      // const fetchedWorkspaces = await workspaceService.getFilteredWorkspaceList(workspaceIds);
      const fetchedWorkspaces = await workspaceService.getWorkspaceList();
      setWorkspaces(fetchedWorkspaces);
    } catch (error) {
      console.error('Failed to fetch profiles or workspaces:', error);
      setError('데이터를 불러오는데 실패했습니다. 나중에 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ul className="menu bg-base-300 rounded-box lg:w-[768px] container">
      {workspaces.map((workspace) => (
        <li key={workspace.id} className='border mb-2 rounded-btn'>
          <a className='p-2'>

            <div className="avatar">
              <div className="w-16 rounded-btn">
                <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
              </div>
            </div>

            <div className="">
              <p className='text-lg font-bold'>{workspace.name}</p>
              <p>{workspace.description}</p>
            </div>

            <div className="avatar-group -space-x-4 rtl:space-x-reverse">
              {profiles
                .filter(profile => profile.workspaceId === workspace.id)
                .slice(0, 3)
                .map((profile, index) => (
                  <div key={profile.id} className="avatar border">
                    <div className="w-8">
                      <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                    </div>
                  </div>
                ))
              }
              {profiles.filter(profile => profile.workspaceId === workspace.id).length > 3 && (
                <div className="avatar placeholder border">
                  <div className="bg-neutral text-neutral-content w-8">
                    <span className='text-xs'>+99</span>
                  </div>
                </div>
              )}
            </div>
          </a>
        </li>
      ))}
      {workspaces.length === 0 && !isLoading && (
        <li className='border'>
          <a className='h-12'>
            참여중인 워크스페이스가 없습니다.
          </a>
        </li>
      )}
    </ul>
  )
}
