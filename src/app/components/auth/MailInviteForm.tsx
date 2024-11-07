import { useMemberStore } from "@/app/stores/member.store";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import ProfileCreateForm from "../member/ProfileCreateForm";
import { ProfileInsertModel } from "@/app/models/profile.model";
import { useCreateProfile } from "@/app/queries/profile.query";
import MailInviteVerifyForm from "./MailInviteVerifyForm";
import { MemberModel } from "@/app/models/member.model";
import { WorkspaceModel } from "@/app/models/workspace.model";
import { useWorkspaceStore } from "@/app/stores/workspace.store";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { channelService } from "@/app/services/channel/channel.service";
import { participantService } from "@/app/services/channel/participant.service";

interface MailInviteFormProps {
  invitationCode: string | null
}

export default function MailInviteForm({ invitationCode }:MailInviteFormProps) {
  const router = useRouter();
  const [step, setStep] = useState<number>(1)

  const [memberData, setMemberData] = useState<MemberModel | null>(null);
  const [workspaceData, setWorkspaceData] = useState<WorkspaceModel | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const setCurrentMember = useMemberStore(state => state.setCurrentMember); // Zustand Store
  const setCurrentWorkspace = useWorkspaceStore(state => state.setCurrentWorkspace); // Zustand Store
  const createProfileMutation = useCreateProfile() // API Query

  useEffect(() => {
    if (!invitationCode) {
      setError("유효하지 않은 초대 링크입니다.");
      return;
    }
  }, [invitationCode]);

  useEffect(() => {
    return () => {
      setMemberData(null);
      setWorkspaceData(null);
      setStep(1);
      setError(null);
    };
  }, []);

  const handleEmailSubmit = async (member: MemberModel, workspace: WorkspaceModel) => {
    setMemberData(member);
    setWorkspaceData(workspace);
    setCurrentMember(member);
    setStep(2);
  };

  const handleProfileSubmit = async (data: ProfileInsertModel) => {
    try {
      setIsLoading(true);
      if (!memberData || !workspaceData) {
        setError("필요한 데이터가 없습니다.");
        return;
      }
      // 프로필 생성
      const profileData = await createProfileMutation.mutateAsync({
        memberId: memberData.id,
        data: {
          ...data,
          workspaceId: workspaceData.id,
          isWorkspaceCreater: false
        }
      })
      const channelData = await channelService.getDefaultChannelByWorkspaceId(workspaceData.id)
      await participantService.createParticipant({
        channelId: channelData.channelId,
        profileId: profileData.id,
        nickname: profileData.nickname,
        profileURL: profileData.profileImgUrl,
      })
      setCurrentWorkspace(workspaceData);
      router.push(`/workspace/${workspaceData.url}`);
    } catch (error) {
      setError("워크스페이스 참여 중 오류가 발생했습니다.");
      console.error("워크스페이스 참여 실패:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const handlePrevious = () => {
    setStep(1);
  }

  return (
    <div className="bg-base-200 rounded-lg p-4 lg:w-[768px] w-full shadow-lg">

      <div className="text-center">
        {step === 1 ? (
          <>
            <h2 className="text-lg font-bold opacity-75">워크스페이스 초대 요청</h2>
            <p className="mb-4 opacity-75">워크스페이스에 참여하시려면 초대 요청을 수신한 이메일을 입력해주세요.</p>
          </>
        ) : (
          <>
            <h2 className="text-lg font-bold opacity-75">{workspaceData?.name} 프로필 생성</h2>
            <p className="mb-4 opacity-75">워크스페이스에서 활동하기 위한 프로필을 생성합니다.</p>
          </>
        )}
      </div>
      
      {error && (
        <div className="alert alert-error mb-4">
          <FontAwesomeIcon icon={faCircleXmark} className="w-6 h-6 opacity-75"/>
          {error}
        </div>
      )}
      
      {isLoading && (
        <div className="flex justify-center my-4">
          <span className="loading loading-spinner"></span>
        </div>
      )}

      {step === 1 ? (
        <MailInviteVerifyForm 
          invitationCode={invitationCode} 
          onEmailSubmit={handleEmailSubmit}
        />
      ) : (
        <ProfileCreateForm 
          onSubmit={handleProfileSubmit} 
          onPrevious={handlePrevious}
        />
      )}

    </div>
  );
}
