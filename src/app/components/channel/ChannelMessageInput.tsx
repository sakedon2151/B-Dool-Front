import { useCallback, useRef, useState } from "react";
import { FaFileArrowUp } from "react-icons/fa6";
import { IoMdSend } from "react-icons/io";

import styles from "./ChannelMessageInput.module.css"

// workspace page component
export default function ChannelMessageInput() {

  const [message, setMessage] = useState('')
  const textarea = useRef<HTMLTextAreaElement>(null);

  const maxMessageLength = 100;

  // textarea height control handler
  const handleResizeHeight = useCallback(() => {
    if (textarea.current) {
      textarea.current.style.height = '3rem';
      textarea.current.style.height = `${textarea.current.scrollHeight}px`;
    }
  }, []);

  // onChange useState & resizeHight
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    handleResizeHeight();
  };

  // textarea keyboard enter handler
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      if (!e.shiftKey) { 
        e.preventDefault();
        handleSubmit(e);
      }
    }
  };

  // form submit handler
  const handleSubmit = (e: React.FormEvent<HTMLFormElement> | React.KeyboardEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    console.log("submit string:", message);
    setMessage('');
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
