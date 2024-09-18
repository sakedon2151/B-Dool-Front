import ModalPortal from "./ModalPortal";

interface ParticipantModalProps {
  profile: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
  onClose: () => void;
}

export default function ParticipantModal({ profile, onClose }: ParticipantModalProps) {
  return (
    <ModalPortal>
      <div>
        <h2>{profile.name}</h2>
        <p>Email: {profile.email}</p>
        <p>Role: {profile.role}</p>
        <button onClick={onClose} style={{ marginTop: "20px" }}>
          Close
        </button>
      </div>
    </ModalPortal>
  );
}
