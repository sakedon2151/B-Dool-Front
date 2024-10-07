import VerificationCodeForm from "./VerificationCodeForm";
import { useState } from "react";
import { BiMailSend } from "react-icons/bi";
import { useRouter } from "next/navigation";
import { mailService } from "@/app/services/auth/mailSender.service";
import { authService } from "@/app/services/auth/auth.service";
import { memberService } from "@/app/services/member/member.service";
import { useMemberStore } from "@/app/stores/member.store";
import { setToken } from "@/app/utils/tokenController";

export default function EmailLoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [showVerification, setShowVerification] = useState<boolean>(false);
  
  const setCurrentMember = useMemberStore(state => state.setCurrentMember); // 로그인 객체
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
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
      setLoading(false);
    }
  };

  const handleVerificationSuccess = async (verificationCode: string) => {
    try {
      const isVerified = await mailService.verifyCode(email, parseInt(verificationCode, 10));
      if (isVerified) {
        const getToken = await authService.generateToken(email);
        setToken(getToken); // 쿠키에 토큰 담기
        const member = await memberService.getCurrentMember(); // 받은 토큰으로 member 호출
        setCurrentMember(member); // store 에 member 담기
        router.push("/workspace");
      } else {
        setError('인증에 실패했습니다. 다시 시도해 주세요.');
        // 6자리 키 재호출
      }
    } catch (err) {
      setError('오류가 발생했습니다. 다시 시도해 주세요.');
      console.error('Verification error:', err);
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
    <div className="bg-base-300 rounded-md p-4 lg:w-[768px] w-full">      
      <h2 className="text-lg font-bold text-center">이메일로 시작하기</h2>
      <div className="mt-2 divider"></div>
      {error && <div className="mb-4 alert alert-error">{error}</div>}
      {!showVerification ? (
        <form className="text-center" onSubmit={handleSubmit}>
          <label className="flex items-center gap-2 mb-4 input input-bordered">
            <BiMailSend className="w-6 h-6 opacity-50"/>
            <input
              className="w-full"
              type="email"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              placeholder="이메일" 
              required
            />
          </label>
          <button className="btn" type="submit" disabled={loading}>
            {loading ? '처리 중...' : '이메일 전송'}
          </button>
        </form>
      ) : (
        <VerificationCodeForm 
          email={email}
          onSuccess={handleVerificationSuccess} 
          onResendCode={handleResendCode}  
          onChangeEmail={handleChangeEmail}
        />
      )}
    </div>
  );
}

