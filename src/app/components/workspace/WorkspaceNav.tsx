import { ProfileModel } from "@/app/models/profile.model";
import { WorkspaceModel } from "@/app/models/workspace.model";
import { useProfilesByMemberId } from "@/app/queries/profile.query";
import { useWorkspacesByIds } from "@/app/queries/workspace.query";
import { useMemberStore } from "@/app/stores/member.store";
import { useWorkspaceStore } from "@/app/stores/workspace.store";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

export default function WorkspaceNav() {
  const router = useRouter()
  const currentMember = useMemberStore(state => state.currentMember); // Zustand Store
  const setCurrentWorkspace = useWorkspaceStore(state => state.setCurrentWorkspace);  // Zustand Store
  const { data: profiles, isLoading: isLoadingProfiles, error: profilesError } = useProfilesByMemberId(currentMember.id) // API Query

  const workspaceIds = useMemo(() => {
    if (!profiles) return [];
    return Array.from(new Set(profiles.map((profile: ProfileModel) => profile.workspaceId)));
  }, [profiles]);

  const { data: workspaces, isLoading: isLoadingWorkspaces, error: workspacesError } = useWorkspacesByIds(workspaceIds);

  const handleWorkspaceSelect = (workspace: WorkspaceModel) => {
    setCurrentWorkspace(workspace);
    router.push(`/workspace/${workspace.id}`);
  };

  if (isLoadingProfiles || isLoadingWorkspaces) {
    return <div className="">Loading...</div>;
  }
  if (profilesError || workspacesError) {
    return <div className="text-center">에러가 발생했습니다. 잠시 후 다시 시도해주세요.<br/>{profilesError?.message || workspacesError?.message}</div>;
  }
  if (!profiles || !workspaces) {
    return <div>참여중인 워크스페이스가 존재하지 않습니다.</div>;
  }

  return (
    <div className="h-full shadow-inner">
      <ul className="p-1 menu">
        
        {workspaces.map((workspace: WorkspaceModel) => (
          <li key={workspace.id} className="m-1">
            <a className="block w-12 p-0 overflow-hidden transition-all aspect-square rounded-btn hover:rounded-3xl" onClick={() => handleWorkspaceSelect(workspace)}>
              <img className="object-cover w-full h-full" src={workspace.workspaceImageUrl} alt="workspace_thumbnail_img"/>
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
