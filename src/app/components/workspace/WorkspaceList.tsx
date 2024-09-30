import { WorkspaceModel } from '@/app/models/workspace.model';
import { profileService } from '@/app/services/member/profile.api';
import { workspaceService } from '@/app/services/workspace/workspace.api';
import React, { useState } from 'react'

export default function WorkspaceList() {
  const [workspaces, setWorkspaces] = useState<WorkspaceModel[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // memberId로 profile 리스트 얻기 - 대기
  // const getProfiles = async () => {
  //   try {
  //     const response = await profileService.getProfileById
  //   } catch (error) {
  //     console.error('Failed to fetch profiles:', error);
  //   } finally {
  //     setIsLoading(false)
  //   }
  // }

  // workspaceId 배열로 workspace 리스트 얻기 - 대기
  // const fetchWorkspaces = async () => {
  //   setIsLoading(true);
  //   setError(null);
  //   try {
  //     const response = await workspaceService.getFilteredWorkspaceList();
  //     setWorkspaces(response)
  //   } catch (error) {
  //     console.error('Failed to fetch workspaces:', error);
  //     setError('워크스페이스 목록을 불러오는데 실패했습니다. 나중에 다시 시도해주세요.');
  //   } finally {
  //     setIsLoading(false)
  //   }
  // }

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
              <p className='text-lg font-bold'>워크스페이스 이름</p>
              <p>워크스페이스 설명</p>
            </div>
            <div className="avatar-group -space-x-4 rtl:space-x-reverse">
              <div className="avatar border">
                <div className="w-8">
                  <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                </div>
              </div>
              <div className="avatar border">
                <div className="w-8">
                  <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                </div>
              </div>
              <div className="avatar border">
                <div className="w-8">
                  <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                </div>
              </div>
              <div className="avatar placeholder border">
                <div className="bg-neutral text-neutral-content w-8">
                  <span className='text-xs'>+99</span>
                </div>
              </div>
            </div>
          </a>
        </li>
      ))}
        <li className='border'>
          <a className='h-12'>
            test
          </a>
        </li>
    </ul>
  )
}
