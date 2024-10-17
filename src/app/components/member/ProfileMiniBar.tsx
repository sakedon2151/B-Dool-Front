import { FaGear } from "react-icons/fa6";
import ProfileModal from "./ProfileModal";
import { useProfileStore } from "@/app/stores/profile.store";

export default function ProfileMiniBar() {
  const currentProfile = useProfileStore(state => state.currentProfile)
  
  return (
    <>
      <div className="flex items-center justify-between p-2">
        <div className="flex gap-4">
          <div className="avatar online placeholder">
            <div className="w-12 rounded-full bg-neutral text-neutral-content">
              <span>U</span>
            </div>
          </div>
          <div>
            <p>{currentProfile.nickname}</p>
            <p>{currentProfile.position}</p>
          </div>
        </div>
        
        <button className="bg-transparent btn btn-circle" onClick={()=>document.getElementById('profile-modal')?.showModal()}>
          <FaGear className="w-5 h-5"/>
        </button>
      </div>

      {/* modal dialog */}
      <dialog id="profile-modal" className="modal modal-bottom lg:modal-middle">
        <div className="modal-box lg:fixed lg:bottom-4 lg:left-4 p-4">
          <form method="dialog">
            <button className="absolute btn btn-sm btn-circle btn-ghost right-2 top-2">✕</button>
          </form>
          <ProfileModal/>
        </div>
      </dialog>
    </>
  );
}
