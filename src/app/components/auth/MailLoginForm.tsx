import { useState } from "react";
import { useRouter } from "next/navigation";
import { mailService } from "@/app/services/auth/mailSender.service";
import { authService } from "@/app/services/auth/auth.service";
import { memberService } from "@/app/services/member/member.service";
import { useMemberStore } from "@/app/stores/member.store";
import { setToken } from "@/app/utils/cookieController";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleXmark, faEnvelope } from "@fortawesome/free-solid-svg-icons"
import MailLoginVerifyForm from "./MailLoginVerifyForm";

export default function MailLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState<string>('');
  const [showVerification, setShowVerification] = useState<boolean>(false);
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  
  const setCurrentMember = useMemberStore(state => state.setCurrentMember); // Zustand Store
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const isCodeSent = await mailService.sendVerificationCode(email);
      if (isCodeSent) {
        setShowVerification(true);
      } else {
        setError('인증 코드 전송에 실패했습니다. 다시 시도해 주세요.');
      }
    } catch (err) {
      setError('오류가 발생했습니다. 다시 시도해 주세요.');
      console.error('로그인 에러:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerificationSuccess = async (verificationCode: string) => {
    try {
      const isVerified = await mailService.verifyCode(email, parseInt(verificationCode, 10));
      if (isVerified) {
        const getToken = await authService.generateToken(email); // body 로 jwt string 값 받음
        setToken(getToken); // 쿠키에 jwt 토큰 담기
        const member = await memberService.getCurrentMember();
        setCurrentMember(member);
        router.push("/workspace");
      } else {
        setError('인증에 실패했습니다. 다시 시도해 주세요.');
      }
    } catch (err) {
      setError('오류가 발생했습니다. 다시 시도해 주세요.');
      console.error('인증코드 오류:', err);
    }
  };

  const handleResendCode = async () => {
    try {
      await mailService.sendVerificationCode(email);
    } catch (err) {
      setError('오류가 발생했습니다. 다시 시도해 주세요.');
    }
  };
  
  const handleChangeEmail = () => {
    setShowVerification(false);
    setEmail('');
  };

  return (
    <div className="bg-base-200 rounded-lg p-4 lg:w-[768px] w-full shadow-lg">      
      <h2 className="text-lg font-bold opacity-75 text-center">이메일로 시작하기</h2>
      <p className="text-sm text-gray-500 text-center mb-4">서비스 이용을 위해 이메일로 로그인하세요</p>

      {error && <div role="alert" className="mb-4 alert alert-error">
        <FontAwesomeIcon icon={faCircleXmark} className="w-6 h-6 opacity-75"/>
        {error}
      </div>}

      {!showVerification ? (
        <form className="text-center" onSubmit={handleSubmit}>
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
                메일을 보내고 있어요.
              </>
            ) : '이메일 전송'}
          </button>
        </form>
      ) : (
        <MailLoginVerifyForm 
          email={email}
          onSuccess={handleVerificationSuccess} 
          onResendCode={handleResendCode}  
          onChangeEmail={handleChangeEmail}
        />
      )}

    </div>
  );
}