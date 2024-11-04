import { mailService } from "@/app/services/auth/mailSender.service";
import { useProfileStore } from "@/app/stores/profile.store";
import { useWorkspaceStore } from "@/app/stores/workspace.store";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";

export default function MailInviteModal() {
  const [email, setEmail] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  const currentProfile = useProfileStore(state => state.currentProfile); // Zustand Store
  const currentWorkspace = useWorkspaceStore(state => state.currentWorkspace); // Zustand Store
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('이메일을 입력해주세요.');
      return;
    }
    setIsLoading(true);
    setError('');
    setSuccessMessage('');
    try {
      await mailService.sendInvitation(
        currentProfile.id,
        email,
        currentWorkspace.id
      );
      setSuccessMessage(`${email}에 초대 메일이 발송되었습니다.`);
      setEmail('');
    } catch (error) {
      setError('오류가 발생했습니다. 다시 시도해 주세요.');
      console.error('초대 에러:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-center font-bold text-lg opacity-75 mb-4">워크스페이스 초대</h2>
      <form className="text-center" onSubmit={handleSubmit}>
        <label className="flex items-center gap-2 mb-4 input input-bordered">
          <FontAwesomeIcon icon={faEnvelope} className="opacity-50 w-4 h-4" />
          <input
            className="w-full"
            type="email"
            value={email}
            placeholder="이메일"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          />
        </label>
        
        {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}
        {error && <p className="text-red-500 mb-4">{error}</p>}
        
        <button className="btn btn-block" type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <span className="loading loading-spinner"></span>
              메일을 보내고 있어요.
            </>
          ) : (
            "이메일 전송"
          )}
        </button>
      </form>
    </div>
  );
}
