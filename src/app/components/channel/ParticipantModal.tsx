interface ParticipantModalProps {
  selectedProfile: ProfileModel | null
}

export default function ParticipantModal({selectedProfile}: ParticipantModalProps) {
  
  // props null 예외처리 필요
  if (!selectedProfile) return null;
  
  const getOnlineClass = (isOnline: boolean) => {
    return isOnline ? 'online' : 'offline';
  };

  return (
    <div>
      <div className="flex items-center gap-4">
        <div className={`avatar ${getOnlineClass(selectedProfile.isOnline)}`}>
          <div className="w-12 h-12 rounded-full">
            <img src={selectedProfile.profileImgUrl} alt="Profile Image"/>
          </div>
        </div>
        <div>
          <p className="font-bold text-lg">{selectedProfile?.nickname}</p>
          <p>{selectedProfile?.position}</p>
        </div>
        <div>
          <p className="">{selectedProfile.status}</p>
        </div>
      </div>
      <div className="divider my-0"></div>
      <div className="mb-4">
        <p>성함: {selectedProfile?.name}</p>
        <p>이메일: {selectedProfile?.email}</p>
      </div>
      <button className="btn btn-wide w-full">Direct Message</button>
    </div>
  );
}
