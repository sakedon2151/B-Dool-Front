import { useCallback, useRef, useState } from "react";
import { FaFileArrowUp } from "react-icons/fa6";
import { IoMdSend } from "react-icons/io";

import styles from "./ChannelMessageInput.module.css"

// workspace page component
export default function ChannelMessageInput() {

  const [message, setMessage] = useState('')
  const textarea = useRef<HTMLTextAreaElement>(null);

  const maxMessageLength = 100;

  // textarea 높이 증가 핸들러
  const handleResizeHeight = useCallback(() => {
    if (textarea.current) {
      textarea.current.style.height = '3rem'; // height 초기화
      textarea.current.style.height = `${textarea.current.scrollHeight}px`;
    }
  }, []);

  // onChange useState & resizeHight
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value); // textarea 에서 발생하는 변화 저장
    handleResizeHeight(); // 줄바꿈에 대응하기 위해 높이 증가 핸들러 호출
  };

  // textarea 엔터키 핸들러
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') { // 키보드 이벤트 e 의 대상은 enter 키로 설정
      if (!e.shiftKey) { // 줄바꿈 키가 아닌 엔터 인식시 
        e.preventDefault(); // enter 로 인한 새로고침 방지
        handleSubmit(e); // form 태그 submit 발생
      }
    }
  };

  // 폼 제출 핸들러
  const handleSubmit = (e: React.FormEvent<HTMLFormElement> | React.KeyboardEvent<HTMLTextAreaElement>) => {
    e.preventDefault(); // form 제출로 인한 세로고침 방지
    
    console.log("submit string:", message);
    setMessage('');
    
    // if (message.trim()) { 
      
    // }
  };

  return (
    <div className="">
      <form className="p-2 flex gap-2" onSubmit={handleSubmit}>

        <div className="flex flex-grow w-full relative"> 
          <textarea value={message} maxLength={maxMessageLength} ref={textarea} onChange={handleChange} onKeyDown={handleKeyDown} name="message" className={`${styles.textareaCustom} textarea textarea-bordered resize-none w-full h-12`}  placeholder="메시지를 입력하세요."></textarea>
          
          <button type="submit" className="absolute bottom-0 right-0 w-[54px] h-[48px] flex items-center justify-center">
            <IoMdSend className="w-5 h-5"/>
          </button>
          
          <span className="text-xs text-gray-500 absolute bottom-0 right-[54px]">
            {message.length}/{maxMessageLength}
          </span>
        </div>

        <div className="tooltip tooltip-top" data-tip="파일 올리기">
          <button type="button" className="btn m-auto">
            <FaFileArrowUp className="w-5 h-5"/>
          </button>
        </div>
        
      </form>
    </div>
  );
}
