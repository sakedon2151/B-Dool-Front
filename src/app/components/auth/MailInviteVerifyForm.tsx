import { MemberModel } from "@/app/models/member.model";
import { WorkspaceModel } from "@/app/models/workspace.model";
import { authService } from "@/app/services/auth/auth.service";
import { mailService } from "@/app/services/auth/mailSender.service";
import { memberService } from "@/app/services/member/member.service";
import { workspaceService } from "@/app/services/workspace/workspace.service";
import { setToken } from "@/app/utils/cookieController";
import { faCircleXmark, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";

interface MailInviteVerifyFormProps {
  invitationCode: string | null
  onEmailSubmit: (memberData: MemberModel, workspaceData: WorkspaceModel) => void;
}

export default function MailInviteVerifyForm({ invitationCode, onEmailSubmit }: MailInviteVerifyFormProps) {
  const [email, setEmail] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null);
  
  const handleEmailSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!invitationCode) {
      setError("유효하지 않은 초대 링크입니다.");
      return
    }

    try {
      setIsLoading(true);
      setError('');
      
      const verifyData = await mailService.verifyInvitation(email, invitationCode);
      if (!verifyData.isValid) {
        setError('초대가 만료되었거나 유효하지 않습니다.');
        return;
      }
      
      const getToken = await authService.generateToken(email);
      setToken(getToken); // 쿠키에 토큰 담기
      const [memberData, workspaceData] = await Promise.all([
        memberService.getCurrentMember(),
        workspaceService.getWorkspaceById(verifyData.workspaceId)
      ]);

      onEmailSubmit(memberData, workspaceData);
    } catch (err) {
      setError('오류가 발생했습니다. 다시 시도해 주세요.');
      console.error('초대 에러:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {error && 
        <div role="alert" className="mb-4 alert alert-error">
          <FontAwesomeIcon icon={faCircleXmark} className="w-6 h-6 opacity-75"/>
          {error}
        </div>
      }

      <form className="text-center" onSubmit={handleEmailSubmit}>
        <label className="flex items-center gap-2 mb-4 input input-bordered">
          <FontAwesomeIcon icon={faEnvelope} className="opacity-50 w-4 h-4" />
          <input
            className="w-full"
            type="email"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            placeholder="이메일" 
            required
          />
        </label>
        <button className="btn bg-base-100" type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <span className="loading loading-spinner"></span>
              이메일 확인 중...
            </>
          ) : '이메일 확인'}
        </button>
      </form>
    </div>
  );
}
