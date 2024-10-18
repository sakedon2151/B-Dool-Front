"use client";
import { faCheck, faCircleCheck, faCircleInfo, faInfo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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

  const handleSubmit = (fullCode: string) => {
    setLoading(true);
    setError('');
    try {
      onSuccess(fullCode);
    } catch (err) {
      setError('인증에 실패했습니다. 다시 시도해 주세요.')
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setLoading(true);
    setError('');
    try {
      await onResendCode();
      setError('새로운 인증 코드가 전송되었습니다.');
    } catch (err) {
      setError('인증 코드 재전송에 실패했습니다. 다시 시도해 주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div role="alert" className="alert alert-info mb-4">
        <FontAwesomeIcon icon={faCircleInfo} className="w-6 h-6 opacity-75"/>
        <span className="">{email} 로 인증 코드가 전송되었습니다.</span>
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
        <button className="btn btn-outline btn-sm" onClick={handleResendCode} disabled={loading}>
          인증번호 재요청
        </button>
        <button className="btn btn-outline btn-sm" onClick={onChangeEmail} disabled={loading}>
          이메일 변경
        </button>
      </div>
    </div>
  );
}
