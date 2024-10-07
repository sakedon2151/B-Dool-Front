import { WorkspaceModel } from "@/app/models/workspace.model";
// import { workspaceService } from "@/app/services/workspace/workspace.api";
import { useEffect, useState } from "react";

export default function WorkspaceNav() {
  const [workspaces, setWorkspaces] = useState<WorkspaceModel[]>([])
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // useEffect(() => {
  //   fetchWorkspaces(workspaceId) // workspaceId 배열 전달
  // }, [workspaceId])  

  const fetchWorkspaces = async (workspaceId: number) => {
    try {
      const response = await workspaceService.getFilteredWorkspaceList(workspaceId)
      setWorkspaces(response)
    } catch (error) {
      console.error('error', error);
      setError('워크스페이스 목록을 불러오는데 실패했습니다. 나중에 다시 시도해주세요.')
    } finally {
      setIsLoading(false)
    }
  };
  
  return (
    <div className="h-full shadow-inner">
      <ul className="p-1 menu">
        
        {/* response list loop */}
        {workspaces.map((workspace) => (
          <li key={workspace.id} className="m-1">
            <a className="block w-12 p-0 overflow-hidden transition-all aspect-square rounded-btn hover:rounded-3xl">
              <img className="object-cover w-full h-full" src="https://mir-s3-cdn-cf.behance.net/project_modules/fs/eed560189998237.65b50b647abf4.png" alt="workspace_thumbnail_img"/>
            </a>
          </li>
        ))}
        
        <li className="m-1">
          <a className="block w-12 p-0 overflow-hidden transition-all aspect-square rounded-btn hover:rounded-3xl">
            <img className="object-cover w-full h-full" src="https://mir-s3-cdn-cf.behance.net/project_modules/fs/eed560189998237.65b50b647abf4.png" alt="workspace_thumbnail_img"/>
          </a>
        </li>

      </ul>
    </div>
  )
}
