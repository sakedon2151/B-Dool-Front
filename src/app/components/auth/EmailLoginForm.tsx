import { useState } from "react";
import { MemberModel } from "@/app/models/member.model";
import { authService } from "@/app/services/auth/auth.api";
import VerificationCodeForm from "./VerificationCodeForm";
import { BiMailSend } from "react-icons/bi";
import { useRouter } from "next/navigation";

export default function EmailLoginForm() {
  const [email, setEmail] = useState<string>('');
  const [showVerification, setShowVerification] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const setUser = useUserStore((state) => state.setUser);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await authService.({email});
      if (response.member) {
        setUser(response.member);
        router.push("/workspace");
      } else {
        setShowVerification(true);
      }
    } catch (err) {
      setError('오류가 발생했습니다. 다시 시도해 주세요.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerificationSuccess = (member: MemberModel) => {
    console.log('Verification successful:', member);
    const handleVerificationSuccess = (member: MemberModel) => {
      setUser(member);
      router.push("/workspace");
    };
  };

  return (
    <div className="bg-base-300 rounded-btn p-4 lg:w-[768px] container">      
      <h2 className="text-lg font-bold text-center">이메일로 시작하기</h2>
      <div className="mt-2 divider"></div>
      
      {error && <div className="mb-4 alert alert-error">{error}</div>}
      <form className="text-center" onSubmit={handleSubmit}>
        <label className="flex items-center gap-2 mb-4 input input-bordered">
          <BiMailSend className="w-6 h-6 opacity-70"/>
          <input
            type="email"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            placeholder="이메일" 
            required
          />
        </label>

        {showVerification ? (
            <VerificationCodeForm email={email} onSuccess={handleVerificationSuccess} />
        ) : (
          <button className="btn" type="submit" disabled={loading}>
            {loading ? '처리 중...' : '로그인'}
          </button>
        )}

      </form>
    </div>
  );
}
function useUserStore(arg0: (state: any) => any) {
  throw new Error("Function not implemented.");
}

