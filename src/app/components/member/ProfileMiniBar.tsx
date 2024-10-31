import { useProfileStore } from "@/app/stores/profile.store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import ProfileUpdateModal from "./ProfileUpdateModal";
import { useState } from "react";

export default function ProfileMiniBar() {
  const currentProfile = useProfileStore(state => state.currentProfile) // Zustand Store
  const [isLoading, setIsLoading] = useState<boolean>(true);

  return (
    <>
      <div className="flex items-center justify-between p-2">
        <div className="flex gap-4">
          <div className={`avatar placeholder ${currentProfile.isOnline ? 'online' : 'offline'}`}>
            <div className="w-12 rounded-full bg-neutral text-neutral-content">
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-base-300 rounded-full skeleton">
                  {/* <div className="loading loading-spinner"></div> */}
                </div>
              )}
              <img 
                src={currentProfile.profileImgUrl} 
                alt="profile_image"
                onLoad={() => setIsLoading(false)}
                onError={() => setIsLoading(false)}
              />
            </div>
          </div>
          <div>
            <p className="font-bold opacity-75">{currentProfile.nickname}</p>
            <p className="">{currentProfile.position}</p>
          </div>
        </div>
        
        <button className="btn btn-circle" onClick={() => (document.getElementById('profile-modal') as HTMLDialogElement).showModal()}>
          <FontAwesomeIcon icon={faGear} className="w-4 h-4 opacity-75"/>
        </button>
      </div>

      {/* profile modal dialog */}
      <dialog id="profile-modal" className="modal modal-bottom md:modal-middle">
        <div className="modal-box md:fixed md:bottom-4 md:left-4 p-4">
          <form method="dialog">
            <button className="absolute btn btn-sm btn-circle btn-ghost right-2 top-2">✕</button>
          </form>
          <ProfileUpdateModal/>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>닫기</button>
        </form>
      </dialog>
    </>
  );
}
