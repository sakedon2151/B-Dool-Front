import { useProfileById } from "@/app/queries/profile.query";
import { faEnvelope, faPencil, faRightToBracket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface ParticipantModalProps {
  profileId: number;
}

export default function ParticipantModal({ profileId }: ParticipantModalProps) {
  // const getOnlineStatus = (isOnline: boolean) => isOnline ? 'online' : 'offline';

  const { data: profile, isLoading: isLoadingProfile, error: profileError } = useProfileById(profileId) // API Query
  
  return (
    <div>
      {isLoadingProfile ? (
        <div className="skeleton w-full h-full"></div>
      ) : profileError ? (
        <div>알 수 없는 오류가 발생했습니다.</div>
      ) : !profile ? (
        <div>데이터를 불러오지 못했습니다.</div>
      ) : (
        <>
          <div className="flex items-center gap-4 mb-4">
            <div className={`avatar ${profile.isOnline ? 'online' : 'offline'}`}>
              <div className="w-12 h-12 rounded-full">
                <img src={profile.profileImgUrl} alt="profile_image"/>
              </div>
            </div>

            <div className="w-full">
              <p className="text-lg font-bold">{profile.nickname} • {profile.name}</p>
              <p className="text-nowrap">{profile.position}</p>
            </div>
          </div>
          
          {/* <div className="my-2 divider"></div> */}
          
          <div className="bg-base-200 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-4">
              <FontAwesomeIcon icon={faEnvelope} className="w-4 h-4 opacity-75"/>
              <p className="font-medium">{profile.email}</p>
            </div>
            <div className="flex items-center gap-2 mb-4">
              <FontAwesomeIcon icon={faPencil} className="w-4 h-4 opacity-75"/>
              <p>{profile.status}</p>
            </div>
            <div className="flex items-center gap-2 mb-4">
              <FontAwesomeIcon icon={faRightToBracket} className="w-4 h-4 opacity-75"/>
              <p>{profile.createdAt}</p>
            </div>
          <button className="btn btn-block bg-base-100">Direct Message</button>
          </div>
          
        </>
      )}
    </div>
  );
}
