import dummyProfiles from "@/app/tests/dummyProfiles";
import { useEffect, useState } from "react";
import ParticipantModal from "./ParticipantModal";

export default function ChannelParticipantList() {
  const [profiles, setProfiles] = useState<ProfileModel[]>([])
  const [selectedProfile, setSelectedProfile] = useState<ProfileModel | null>(null);
  const [modalPosition, setModalPosition] = useState({ top: 'auto', bottom: 'auto' });

  const onlineProfiles = profiles.filter(profile => profile.isOnline);
  const offlineProfiles = profiles.filter(profile => !profile.isOnline);

  const handleProfileClick = (profile: ProfileModel, event: React.MouseEvent) => {
    const liElement = (event.target as HTMLElement).closest('li');
    if (liElement) {
      const rect = liElement.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const modalHeight = 220; // 임의 지정
      if (rect.bottom + modalHeight > windowHeight) {
        setModalPosition({ 
          top: 'auto',
          bottom: `${windowHeight - rect.bottom}px`
        });
      } else {
        setModalPosition({ 
          top: `${rect.top}px`,
          bottom: 'auto'
        });
      }
    }
    setSelectedProfile(profile);
    document.getElementById('participant-modal')?.showModal();
  };

  useEffect(() => {
    setProfiles(dummyProfiles)
  }, [])  

  return (
    <div>
      <ul className="menu">
        <li className="menu-title">온라인 - {onlineProfiles.length}</li>
        {onlineProfiles.map((profile) => (
          <li key={profile.id} onClick={(e) => handleProfileClick(profile, e)}>
            <a>
              <div className="avatar online placeholder">
                <div className="bg-neutral text-neutral-content w-8 rounded-full">
                  <span className="text-xs">U</span>
                </div>
              </div>
              <p className="truncate whitespace-nowrap overflow-hidden">{profile.nickname}</p>
            </a>
          </li>
        ))}
      </ul>

      <ul className="menu">
        <li className="menu-title">오프라인 - {offlineProfiles.length}</li>
        {offlineProfiles.map((profile) => (
          <li key={profile.id} onClick={(e) => handleProfileClick(profile, e)}>
            <a>
              <div className="avatar offline placeholder">
                <div className="bg-neutral text-neutral-content w-8 rounded-full">
                  <span className="text-xs">U</span>
                </div>
              </div>
              <p className="truncate whitespace-nowrap overflow-hidden">{profile.nickname}</p>
            </a>
          </li>
        ))}
      </ul>

      <dialog id="participant-modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box participant-modal-box" style={{
          top: modalPosition.top,
          bottom: modalPosition.bottom
        }}>
          <ParticipantModal selectedProfile={selectedProfile}/>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
}
