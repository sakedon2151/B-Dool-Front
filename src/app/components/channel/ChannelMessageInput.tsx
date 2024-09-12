import { FaFileArrowUp } from "react-icons/fa6";
import { IoMdSend } from "react-icons/io";


// workspace page component
export default function ChannelMessageInput() {
  return (
    <div className="">
      <form className="p-2 flex gap-2">

        <label className="input input-bordered flex items-center gap-2 w-full">
          <textarea name="message" className="grow" placeholder="메시지를 입력하세요."></textarea>
          
          <button type="submit">
            <IoMdSend className="w-5 h-5"/>
          </button>
        </label>  

        <div className="tooltip tooltip-top" data-tip="파일 올리기">
          <button type="button" className="btn m-auto">
            <FaFileArrowUp className="w-5 h-5"/>
          </button>
        </div>
        
      
      </form>
    </div>
  );
}
