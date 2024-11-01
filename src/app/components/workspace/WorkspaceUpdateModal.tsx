import { WorkspaceUpdateModel } from "@/app/models/workspace.model";
import { useUpdateWorkspace } from "@/app/queries/workspace.query";
import { useMemberStore } from "@/app/stores/member.store";
import { useWorkspaceStore } from "@/app/stores/workspace.store";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ChangeEvent, useCallback, useMemo, useRef, useState } from "react";
import WorkspaceDeleteForm from "./WorkspaceDeleteForm";

export default function WorkspaceUpdateModal() {
  const currentMember = useMemberStore(state => state.currentMember)
  const currentWorkspace = useWorkspaceStore(state => state.currentWorkspace); // Zustand Store
  const setCurrentWorkspace = useWorkspaceStore(state => state.setCurrentWorkspace) // Zustand Store
  const updateWorkspaceMutation = useUpdateWorkspace(); // API Query

  const [editingFormData, setEditingFormData] = useState<WorkspaceUpdateModel | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const fileInput = useRef<HTMLInputElement>(null)

  const workspaceImage = useMemo(() => currentWorkspace?.workspaceImageUrl, [currentWorkspace?.workspaceImageUrl]);
  
  const formData = useMemo(() => ({
    name: editingFormData?.name ?? currentWorkspace?.name ?? '',
    description: editingFormData?.description ?? currentWorkspace?.description ?? '',
    url: editingFormData?.url ?? currentWorkspace?.url ?? '',
    workspaceImageUrl: editingFormData?.workspaceImageUrl ?? currentWorkspace?.workspaceImageUrl,
    ownerId: currentMember?.id
  }), [editingFormData, currentWorkspace?.name, currentWorkspace?.description, currentWorkspace?.url, workspaceImage, currentMember?.id]);

  const isFormValid = useMemo(() => {
    return Boolean(
      currentWorkspace?.id &&
      currentMember?.id &&
      formData.name &&
      formData.description &&
      formData.url
    );
  }, [currentWorkspace?.id, currentMember?.id, formData.name, formData.description, formData.url]);

  const handleImgChange = useCallback(async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e: ProgressEvent<FileReader>) => {
        if (e.target?.result) {
          const newWorkspaceImage = e.target.result as string;
          try {
            await updateWorkspaceMutation.mutateAsync({
              workspaceId: currentWorkspace.id,
              data: {
                workspaceImageUrl: newWorkspaceImage,
                ownerId: currentMember.id
              }
            });
          } catch (error) {
            console.log("워크스페이스 이미지 변경 실패:", error);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  }, [currentWorkspace, currentMember?.id, updateWorkspaceMutation, setCurrentWorkspace]);

  const handleChange = useCallback((
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditingFormData(prevData => ({
      ...(prevData ?? {}),
      [name]: value,
      ownerId: currentMember?.id
    }));
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;
    try {
      await updateWorkspaceMutation.mutateAsync({
        workspaceId: currentWorkspace.id,
        data: formData
      });
      setIsEditing(false);
      setCurrentWorkspace({
        ...currentWorkspace,
        ...formData
      });
      setEditingFormData(null);
      console.log("워크스페이스가 업데이트 되었습니다.");
    } catch (error) {
      console.error("워크스페이스 업데이트 실패:", error);
    }
  }, [formData, currentWorkspace, setCurrentWorkspace, updateWorkspaceMutation, isFormValid]);

  const handleCancel = useCallback(() => {
    setEditingFormData(null);
    setIsEditing(false);
  }, []);

  return (
    <div className="flex flex-col">
      <div className="h-24 mb-4 text-center">
        <div className="avatar group drop-shadow-sm" onClick={() => fileInput.current?.click()}>
          <div className="w-24 h-24 rounded-full bordered border-base-200 border-4">
            <img src={workspaceImage} alt="workspace_image" className="group-hover:brightness-50"/>
          </div>
          <FontAwesomeIcon icon={faPlus} className="w-8 h-8 absolute text-white top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 invisible group-hover:visible"/>
        </div>
        <input 
          ref={fileInput}
          className="hidden"
          accept="image/png, image/jpg, image/jpeg"
          type="file" 
          onChange={handleImgChange}
        />
      </div>

      <div className="bg-base-200 p-4 rounded-lg">
        {!isEditing ? (
          <div className="info">
            <p className="text-lg font-bold opacity-75">{currentWorkspace.name}</p>
            <p className="text-base font-normal mb-4">{currentWorkspace.description}</p>
            <button className="bg-base-300 btn rounded-btn w-full" onClick={() => setIsEditing(true)}>워크스페이스 수정</button>
          </div>
        ) : (
          <div>
            <form onSubmit={handleSubmit}>
              <input 
                className="input input-bordered w-full mb-4"
                type="text"
                name="name"
                placeholder="워크스페이스 이름"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <input 
                className="input input-bordered w-full mb-4"
                type="text"
                name="url"
                placeholder="URL 지정"
                value={formData.url}
                onChange={handleChange}
                required
              />
              <textarea
                className="textarea textarea-bordered resize-none w-full mb-4"
                name="description"
                placeholder="워크스페이스 정보"
                value={formData.description}
                onChange={handleChange}
                maxLength={50}
                required
              />
              <div className="flex justify-between">
                <button type="button" className="bg-base-300 btn rounded-btn w-[calc(50%-8px)] mr-2" onClick={handleCancel}>취소하기</button>
                <button type="submit" className="bg-base-300 btn rounded-btn w-[calc(50%-8px)] ml-2">저장하기</button>
              </div>
            </form>
            <div className="divider font-bold text-gray-500">위험</div>
            <WorkspaceDeleteForm/>
          </div>
        )}
      </div>
    </div>
  );
}
