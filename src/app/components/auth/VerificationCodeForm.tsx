"use client";
import { useEffect, useRef, useState } from "react";

export default function VerificationCodeForm() {
  
  const CODE_LENGTH = 6
  const [code, setCode] = useState<string[]>(Array(CODE_LENGTH).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, CODE_LENGTH);
  }, []);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return; // 한 글자만 입력 가능
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
    // 여기에 axios를 사용한 코드 검증 로직
    console.log('Verifying code:', fullCode);
  };

  return (
    <div className="flex gap-2 mb-4">
      {code.map((digit, index) => (
        <input 
          key={index}
          ref={(el: HTMLInputElement | null) => {inputRefs.current[index] = el}}
          type="text" 
          className="input input-bordered w-full text-center font-bold text-lg p-0" 
          placeholder="-"
          value={digit}

          onChange={e => handleChange(index, e.target.value)}
          onKeyDown={e => handleKeyDown(index, e)}
          maxLength={1}
        />  
      ))}
    </div>
  );
}
