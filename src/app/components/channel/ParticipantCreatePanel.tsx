import { ChannelModel } from '@/app/models/channel.model'
import { ProfileModel } from '@/app/models/profile.model'
import { useCreateParticipant } from '@/app/queries/participant.query'
import { useParticipantStore } from '@/app/stores/participant.store'
import { faRightToBracket } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import toast from 'react-hot-toast'

interface ParticipantCreatePanelProps {
  channelData: ChannelModel,
  profileData: ProfileModel
}

export default function ParticipantCreatePanel({ channelData, profileData }: ParticipantCreatePanelProps) {
  const setCurrentParticipant = useParticipantStore(state => state.setCurrentParticipant); // Zustand Store
  const createParticipantMutation = useCreateParticipant(); // API Query

  const handleChannelJoin = async () => {
    try {
      if (!channelData || !profileData) {
        throw new Error("필요한 데이터가 없습니다.");
      }
      const createParticipant = await createParticipantMutation.mutateAsync({
        channelId: channelData.channelId,
        nickname: profileData.nickname,
        profileUrl: profileData.profileImgUrl,
        profileId: profileData.id
      })
      setCurrentParticipant(createParticipant);
      toast.success('채널에 참여했습니다.');
    } catch (error) {
      console.error('채널 참여 실패:', error);
      toast.error('채널 참여에 실패했습니다.');
    }
  }

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <h2 className="text-lg font-bold">{channelData.name} 에 참여하기</h2>
      <p className='text-sm text-gray-500 mb-4'>{channelData.description}</p>
      <button 
        className="btn"
        onClick={handleChannelJoin}
        disabled={createParticipantMutation.isPending}
      >
        {createParticipantMutation.isPending ? (
          <span className='loading loading-spinner'></span>
        ) : (
          <>
            <FontAwesomeIcon icon={faRightToBracket} />
            채널 참여하기
          </>
        )}
      </button>
    </div>
  )
}
