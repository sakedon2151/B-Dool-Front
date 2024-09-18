import { useState } from "react";
import ParticipantModal from "./ParticipantModal";

interface Profile { // 추후 모델 분리
  id: number;
  name: string;
  email: string;
  role: string;
}

const profiles: Profile[] = [ // test object
  { id: 1, name: "User 1", email: "user1@example.com", role: "Admin" },
  { id: 2, name: "User 2", email: "user2@example.com", role: "Member" },
  { id: 3, name: "User 3", email: "user3@example.com", role: "Member" },
];

// workspace page component
export default function ChannelParticipantList() {
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);

  const handleProfileClick = (profile: Profile) => {
    setSelectedProfile(profile);
  };

  const handleCloseModal = () => {
    setSelectedProfile(null);
  };

  return (
    <div className="">
      <ul className="menu">
        <li className="menu-title">온라인 - 6</li>

        {/* map loop */}
        {profiles.map((profile) => (
          <li key={profile.id} onClick={() => handleProfileClick(profile)}>
            <a>
              <div className="avatar online placeholder">
                <div className="bg-neutral text-neutral-content w-8 rounded-full">
                  <span className="text-xs">U</span>
                </div>
              </div>
              <p>{profile.name}</p>
            </a>
          </li>
        ))}

        {/* <li>
          <a>
            <div className="avatar online placeholder">
              <div className="bg-neutral text-neutral-content w-8 rounded-full">
                <span className="text-xs">U</span>
              </div>
            </div>
            <p>username</p>
          </a>
        </li>

        <li>
          <a>
            <div className="avatar online placeholder">
              <div className="bg-neutral text-neutral-content w-8 rounded-full">
                <span className="text-xs">U</span>
              </div>
            </div>
            <p>username</p>
          </a>
        </li>

        <li>
          <a>
            <div className="avatar online placeholder">
              <div className="bg-neutral text-neutral-content w-8 rounded-full">
                <span className="text-xs">U</span>
              </div>
            </div>
            <p>username</p>
          </a>
        </li>

        <li>
          <a>
            <div className="avatar online placeholder">
              <div className="bg-neutral text-neutral-content w-8 rounded-full">
                <span className="text-xs">U</span>
              </div>
            </div>
            <p>username</p>
          </a>
        </li> */}
      </ul>

      {/* <div className="divider"></div> */}

      <ul className="menu">
        <li className="menu-title">오프라인 - 1</li>

        {/* map loop */}
        <li>
          <a>
            <div className="avatar offline placeholder">
              <div className="bg-neutral text-neutral-content w-8 rounded-full">
                <span className="text-xs">U</span>
              </div>
            </div>
            <p>username</p>
          </a>
        </li>
      </ul>

      {selectedProfile && ( // portal model
        <ParticipantModal profile={selectedProfile} onClose={handleCloseModal} />
      )}
    </div>
  );
}
