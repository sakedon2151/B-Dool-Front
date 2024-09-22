import { FaGear } from "react-icons/fa6";

// workspace page component
export default function ChannelMemberCard() {
  return (
    <>
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
        
        <button className="btn btn-circle bg-transparent" onClick={()=>document.getElementById('account-modal')?.showModal()}>
          <FaGear className="w-5 h-5"/>
        </button>
      </div>

      <dialog id="account-modal" className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </form>
          <h3 className="font-bold text-lg">Hello!</h3>
          <p className="py-4">Press ESC key or click on ✕ button to close</p>
        </div>
      </dialog>
    </>
    
  );
}
