import { useDeleteWorkspace } from "@/app/queries/workspace.query";
import { useMemberStore } from "@/app/stores/member.store";
import { useWorkspaceStore } from "@/app/stores/workspace.store";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import React, { useCallback, useMemo, useState } from "react";
import toast from "react-hot-toast";

export default function WorkspaceDeleteForm() {
  const router = useRouter()

  const currentMember = useMemberStore(state => state.currentMember)
  const currentWorkspace = useWorkspaceStore(state => state.currentWorkspace)
  const deleteWorkspaceMutation = useDeleteWorkspace();

  const [confirmName, setConfirmName] = useState<string>("");
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  
  const isNameMatch = useMemo(() => 
    confirmName === currentWorkspace?.name,
    [confirmName, currentWorkspace?.name]
  );

  const handleInitiateDelete = useCallback(() => {
    setShowConfirmation(true);
    setError("");
  }, []);

  const handleConfirmChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmName(e.target.value);
    setError("");
  }, []);

  const handleDelete = useCallback(async () => {
    if (!currentWorkspace?.id) return;
    if (!isNameMatch) {
      setError("워크스페이스 이름이 일치하지 않습니다.");
      return;
    }
    try {
      await deleteWorkspaceMutation.mutateAsync({
        workspaceId: currentWorkspace.id,
        ownerId: currentMember.id
      });
      router.push("/workspace");
      toast.success('워크스페이스가 삭제되었습니다.')
    } catch (error) {
      setError("워크스페이스 삭제 중 오류가 발생했습니다.");
      toast.success('워크스페이스 삭제에 실패했습니다.')
    }
  }, [currentWorkspace?.id, isNameMatch, currentMember?.id, deleteWorkspaceMutation]);

  const handleCancel = useCallback(() => {
    setShowConfirmation(false);
    setConfirmName("");
    setError("");
  }, []);

  if (!currentWorkspace) {
    return null;
  }

  return (
    <div>
      {!showConfirmation ? (
        <button className="btn btn-error btn-block" onClick={handleInitiateDelete}>
          워크스페이스 삭제
        </button>
      ) : (
        <div>
          <div className="bg-base-300 rounded-lg p-4 text-error">
            <div className="flex items-center gap-2 mb-2">
              <FontAwesomeIcon icon={faCircleExclamation} className="w-4 h-4"/>
              <p className="font-bold">워크스페이스 삭제 주의</p>
            </div>
            <p className="text-sm">
              워크스페이스를 삭제하면 해당 데이터에 영구적으로 엑세스 할 수 없습니다.
              삭제를 진행하시려면 워크스페이스 이름을 정확히 입력해주세요.
            </p>
          </div>
          <div className="mb-4">
            <p className="text-sm font-medium my-4">
              워크스페이스 이름: <span className="font-bold">{currentWorkspace.name}</span>
            </p>
            <input
              type="text"
              className={`input input-bordered w-full ${error ? 'input-error' : ''}`}
              placeholder="워크스페이스 이름을 입력하세요"
              value={confirmName}
              onChange={handleConfirmChange}
            />
            {error && (
              <p className="text-error text-sm mt-2">{error}</p>
            )}
          </div>
          <div className="flex justify-between">
            <button className="bg-base-100 btn w-[calc(50%-8px)] mr-2" onClick={handleCancel}>
              취소
            </button>
            <button
              className="btn-error btn w-[calc(50%-8px)] ml-2"
              disabled={!isNameMatch || deleteWorkspaceMutation.isPending}
              onClick={handleDelete}
            >
              {deleteWorkspaceMutation.isPending ? <span className="loading loading-spinner"></span> : "삭제하기"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
