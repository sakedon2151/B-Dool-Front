import { useCallback, useRef, useState } from "react";
import { FaFileArrowUp } from "react-icons/fa6";
import { IoMdSend } from "react-icons/io";

// channel message send input component

export default function ChannelMessageInput() {

  const [message, setMessage] = useState('')
  const textarea = useRef<HTMLTextAreaElement>(null);
  const MAX_MESSAGE_LENGTH = 100;

  // textarea height control handler
  const handleResizeHeight = useCallback(() => {
    if (textarea.current) {
      textarea.current.style.height = '3rem';
      textarea.current.style.height = `${textarea.current.scrollHeight}px`;
    }
  }, []);

  // onChange useState & resizeHight & maxLengthIssue
  const handleTextarea = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length > MAX_MESSAGE_LENGTH) {
      e.target.value = e.target.value.slice(0, MAX_MESSAGE_LENGTH)
    }
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
    if (message.trim() === '') {
      return;
    }
    console.log("submit string:", message);
    setMessage('');
    if (textarea.current) {
      textarea.current.style.height = '3rem'
    }
  };

  return (
    <form className="p-2 flex gap-2" onSubmit={handleSubmit}>
      <div className="flex flex-grow w-full relative"> 
        <textarea value={message} maxLength={MAX_MESSAGE_LENGTH} ref={textarea} onChange={handleTextarea} onKeyDown={handleKeyDown} name="message" className="textarea textarea-bordered resize-none w-full h-12 max-h-36 leading-8" placeholder="메시지를 입력하세요."></textarea>
        <button type="submit" className="absolute bottom-0 right-0 w-[54px] h-[48px] flex items-center justify-center">
          <IoMdSend className="w-5 h-5"/>
        </button>
        <div className="text-xs text-gray-500 absolute bottom-0 right-[54px] h-[48px] leading-[48px]">
          {message.length}/{MAX_MESSAGE_LENGTH}
        </div>
      </div>
      <div className="tooltip tooltip-top" data-tip="파일 올리기">
        <button type="button" className="btn m-auto">
          <FaFileArrowUp className="w-5 h-5"/>
        </button>
      </div>
    </form>
  );
}
