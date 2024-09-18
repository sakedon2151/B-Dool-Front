import { FaGear } from "react-icons/fa6";

// workspace page component
export default function ChannelMemberCard() {
  return (
    <div className="flex justify-between items-center p-2">
      <div className="flex gap-4">
        <div className="avatar online placeholder">
          <div className="bg-neutral text-neutral-content w-12 rounded-full">
            <span>U</span>
          </div>
        </div>
        
        <div>
          <p>username</p>
          <p>status</p>
        </div>
      </div>
      
      <button className="btn btn-circle bg-transparent">
        <FaGear className="w-5 h-5"/>
      </button>
    </div>
  );
}
