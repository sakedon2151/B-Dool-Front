import { ProfileModel } from "@/app/models/profile.model";
import { WorkspaceModel } from "@/app/models/workspace.model";
import { useProfilesByMemberId, useUpdateProfileOnlineStatus } from "@/app/queries/profile.query";
import { useWorkspacesByIds } from "@/app/queries/workspace.query";
import { useMemberStore } from "@/app/stores/member.store";
import { useProfileStore } from "@/app/stores/profile.store";
import { useWorkspaceStore } from "@/app/stores/workspace.store";
import { faExclamation, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import WorkspaceCreateModal from "./WorkspaceCreateModal";
import CustomTooltip from "../common/CustomTooltip";
import Image from "next/image";

export default function WorkspaceNav() {
  const router = useRouter()
  const [modalKey, setModalKey] = useState<number>(0);
  const currentMember = useMemberStore(state => state.currentMember); // Zustand Store
  const currentProfile = useProfileStore(state => state.currentProfile); // Zustand Store
  const currentWorkspace = useWorkspaceStore(state => state.currentWorkspace) // Zustand Store
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

  const handleModalClose = () => {
    (document.getElementById('workspace-modal') as HTMLDialogElement).close()
    setModalKey(prev => prev + 1);
  };

  const handleModalOpen = () => {
    setModalKey(prev => prev + 1);
    (document.getElementById('workspace-modal') as HTMLDialogElement).showModal()
  };

  const renderWorkspaceList = (workspaces: WorkspaceModel[]) => (
    <ul className="p-1 menu">
      {workspaces.map((workspace: WorkspaceModel) => (
          <li key={workspace.id} className="m-1">
            <CustomTooltip content={
              <div>{workspace.name}</div>
            } className="p-0">
              <button 
                className={`btn w-12 p-0 overflow-hidden transition-all hover:ring-4 hover:ring-base-200 ${
                  currentWorkspace.id === workspace.id ? 'ring-4' : ''
                }`}
                onClick={() => handleWorkspaceSelect(workspace)}
              >
                <img src={workspace.workspaceImageUrl} alt="workspace_thumbnail_image" className="object-cover w-full h-full"/>
              </button>
            </CustomTooltip>
          </li>
        ))}
        <li className="m-1">
          <button className="btn w-12 p-0 transition-all hover:rounded-3xl" onClick={handleModalOpen}>
            <FontAwesomeIcon icon={faPlus} className="w-4 h-4 opacity-75"/>
          </button>
        </li>
    </ul>
  )

  return (
    <>
      <div className="h-full shadow-inner shadow-base-300">
        {isLoadingProfiles || isLoadingWorkspaces ? (
          <ul className="p-1 menu">
            <li className="m-1">
              <div className="skeleton w-12 h-12 rounded-btn"></div>
            </li>
            <li className="m-1">
              <div className="skeleton w-12 h-12 rounded-btn"></div>
            </li>
            <li className="m-1">
              <div className="skeleton w-12 h-12 rounded-btn"></div>
            </li>
          </ul>
        ) : profilesError || workspacesError ? (
          <ul className="p-1 menu">
            <li className="m-1">
              <button className="btn btn-error w-12 p-0 transition-all hover:rounded-3xl">
                <FontAwesomeIcon icon={faExclamation} className="w-4 h-4 opacity-75"/>
              </button>
            </li>
          </ul>
        ) : !profiles || !workspaces ? (
          <ul className="p-1 menu">
            <li>NotFound</li>
          </ul>
        ) : (
          renderWorkspaceList(workspaces)
        )}
      </div>

      <dialog id="workspace-modal" className="modal modal-bottom md:modal-middle">
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
  );
}
