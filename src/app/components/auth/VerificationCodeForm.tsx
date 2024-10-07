"use client";
import { useEffect, useRef, useState } from "react";

interface VerificationCodeFormProps {
  email: string;
  onSuccess: (verificationCode: string) => void;
  onResendCode: () => Promise<void>;
  onChangeEmail: () => void;
}

export default function VerificationCodeForm({ email, onSuccess, onResendCode, onChangeEmail }: VerificationCodeFormProps) {
  const CODE_LENGTH = 6
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [code, setCode] = useState<string[]>(Array(CODE_LENGTH).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, CODE_LENGTH);
  }, []);

  useEffect(() => {
    if (code.every(digit => digit === '')) {
      inputRefs.current[0]?.focus();
    }
  }, [code]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    if (value.length > 1) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    if (value !== '' && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
    if (newCode.every(digit => digit !== '')) {
      handleSubmit(newCode.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && index > 0 && code[index] === '') {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (fullCode: string) => {
    setLoading(true);
    setError('');
    try {
      await onSuccess(fullCode);
    } catch (err) {
      setError('인증에 실패했습니다. 다시 시도해 주세요.')
      resetCode();
    } finally {
      setLoading(false);
    }
  };

  const resetCode = () => {
    setCode(Array(CODE_LENGTH).fill(''));
  };

  const handleResendCode = async () => {
    setLoading(true);
    setError('');
    try {
      await onResendCode();
      resetCode();
      setError('새로운 인증 코드가 전송되었습니다.');
    } catch (err) {
      setError('인증 코드 재전송에 실패했습니다. 다시 시도해 주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div role="alert" className="alert alert-info mb-4 text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          className="h-6 w-6 shrink-0 stroke-current">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <span>{email} 로 인증 코드가 전송되었습니다.</span>
      </div>
      <div className="flex gap-2 mb-4">
        {code.map((digit, index) => (
          <input 
            key={index}
            ref={(el) => {inputRefs.current[index] = el}}
            type="text" 
            inputMode="numeric"
            pattern="\d*"
            className="w-full p-0 text-lg font-bold text-center input input-bordered" 
            placeholder="-"
            value={digit}
            onChange={e => handleChange(index, e.target.value)}
            onKeyDown={e => handleKeyDown(index, e)}
            maxLength={1}
            disabled={loading}
          />  
        ))}
      </div>
      
      {error && <p className="mb-4 text-red-500">{error}</p>}
      {loading && <p className="mb-4 text-blue-500">전송중...</p>}
      
      <div className="flex gap-4">
        <button className="btn btn-sm" onClick={handleResendCode} disabled={loading}>
          인증번호 재요청
        </button>
        <button className="btn btn-sm" onClick={onChangeEmail} disabled={loading}>
          이메일 변경
        </button>
      </div>
    </div>
  );
}
