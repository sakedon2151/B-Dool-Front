import { ProfileModel } from "@/app/models/profile.model";
import { WorkspaceModel } from "@/app/models/workspace.model";
import { useProfilesByMemberId, useUpdateProfileOnlineStatus } from "@/app/queries/profile.query";
import { useWorkspacesByIds } from "@/app/queries/workspace.query";
import { useMemberStore } from "@/app/stores/member.store";
import { useProfileStore } from "@/app/stores/profile.store";
import { useWorkspaceStore } from "@/app/stores/workspace.store";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

export default function WorkspaceNav() {
  const router = useRouter()
  const currentMember = useMemberStore(state => state.currentMember); // Zustand Store
  const currentProfile = useProfileStore(state => state.currentProfile); // Zustand Store
  const setCurrentWorkspace = useWorkspaceStore(state => state.setCurrentWorkspace);  // Zustand Store
  
  const updateProfileOnlineStatusMutation = useUpdateProfileOnlineStatus(); // API Query

  const { data: profiles, isLoading: isLoadingProfiles, error: profilesError } = useProfilesByMemberId(currentMember.id) // API Query
  const workspaceIds = useMemo(() => {
    if (!profiles) return [];
    return Array.from(new Set(profiles.map((profile: ProfileModel) => profile.workspaceId)));
  }, [profiles]);
  const { data: workspaces, isLoading: isLoadingWorkspaces, error: workspacesError } = useWorkspacesByIds(workspaceIds);

  const handleWorkspaceSelect = async (workspace: WorkspaceModel) => {
    try {
      await updateProfileOnlineStatusMutation.mutateAsync({
        profileId: currentProfile.id,
        isOnline: false
      });
      setCurrentWorkspace(workspace);
      router.push(`/workspace/${workspace.id}`);
    } catch (error) {
      console.error("워크스페이스 변경 에러:", error);
    }
  };

  const renderWorkspaceList = (workspaces: WorkspaceModel[]) => (
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
  )

  return (
    <div className="h-full shadow-inner">
      {isLoadingProfiles || isLoadingWorkspaces ? (
        <ul className="p-1 menu">
          <li className="skeleton">Loading</li>
          <li className="skeleton">Loading</li>
          <li className="skeleton">Loading</li>
        </ul>
      ) : profilesError || workspacesError ? (
        <ul className="p-1 menu">
          <li>Error</li>
        </ul>
      ) : !profiles || !workspaces ? (
        <ul className="p-1 menu">
          <li>NotFound</li>
        </ul>
      ) : (
        renderWorkspaceList(workspaces)
      )}
    </div>
  );
}
