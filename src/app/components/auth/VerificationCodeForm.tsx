"use client";
import { MemberModel } from "@/app/models/member.model";
import { authService } from "@/app/services/auth/auth.api";
import { useEffect, useRef, useState } from "react";

interface VerificationCodeFormProps {
  email: string;
  onSuccess: (member: MemberModel) => void;
}

export default function VerificationCodeForm({ email, onSuccess }: VerificationCodeFormProps) {
  const CODE_LENGTH = 6
  const [code, setCode] = useState<string[]>(Array(CODE_LENGTH).fill(''));
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, CODE_LENGTH);
  }, []);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    if (value !== '' && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
    if (newCode.every(digit => digit !== '')) {
      verifyCode(newCode.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && index > 0 && code[index] === '') {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const verifyCode = async (fullCode: string) => {
    console.log('Verifying code:', fullCode);
    setLoading(true);
    setError('');
    try {
      const response = await authService.verifyCode({email, code: fullCode});
      if (response.member) {
        onSuccess(response.member);
      } else {
        setError('인증 코드가 잘못되었습니다. 다시 시도해 주세요.');
        resetCode();
      }
    } catch (err) {
      setError('오류가 발생했습니다. 다시 시도해 주세요.');
      console.error('Verification error:', err);
      resetCode();
    } finally {
      setLoading(false);
    }
  };

  const resetCode = () => {
    setCode(Array(CODE_LENGTH).fill(''));
    inputRefs.current[0]?.focus();
  };

  return (
    <div>
      <div className="flex gap-2 mb-4">
        {code.map((digit, index) => (
          <input 
            key={index}
            ref={(el) => {inputRefs.current[index] = el}}
            type="text" 
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
      {error && <p className="mb-2 text-red-500">{error}</p>}
      {loading && <p className="mb-2 text-blue-500">진행중...</p>}
    </div>
    
  );
}
