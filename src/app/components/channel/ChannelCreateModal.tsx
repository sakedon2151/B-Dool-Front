import React, { useEffect, useState } from 'react'
import { useCreateChannel } from '@/app/queries/channel.query'
import { useProfileStore } from '@/app/stores/profile.store'
import { useWorkspaceStore } from '@/app/stores/workspace.store'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGlobe, faLock } from '@fortawesome/free-solid-svg-icons'
import toast from 'react-hot-toast'

interface ChannelCreateModalProps {
  isOpen: boolean
  onClose: () => void;
}

export default function ChannelCreateModal({ isOpen, onClose }: ChannelCreateModalProps) {
  const [channelName, setChannelName] = useState<string>('')
  const [channelInfo, setChannelInfo] = useState<string>('')

  const currentProfile = useProfileStore(state => state.currentProfile) // Zustand Store
  const currentWorkspace = useWorkspaceStore(state => state.currentWorkspace) // Zustand Store
  const createChannelMutation = useCreateChannel() // API Query

  const resetForm = () => {
    setChannelName('')
    setChannelInfo('')
  }

  useEffect(() => {
    if (!isOpen) {
      resetForm()
    }
  }, [isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createChannelMutation.mutateAsync({
        workspacesId: currentWorkspace.id,
        name: channelName,
        isPrivate: false,
        description: channelInfo,
        profileId: currentProfile.id,
        channelType: 'CUSTOM',
        nickname: currentProfile.nickname
      })
      toast.success('채널이 생성되었습니다.');
      resetForm()
      onClose()
    } catch (error) {
      console.error('채널 생성 오류:', error)
      toast.error('채널 생성에 실패했습니다.');
    }
  }

  return (
    <div>
      <h2 className="text-lg font-bold mb-4 text-center opacity-75">새 채널 생성</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text" 
          className="input input-bordered w-full mb-4" 
          placeholder="채널 이름"
          value={channelName}
          onChange={(e) => setChannelName(e.target.value)}
          required
        />
        <textarea
          className="textarea textarea-bordered resize-none w-full mb-4" 
          placeholder="채널 정보"
          maxLength={50}
          value={channelInfo}
          onChange={(e) => setChannelInfo(e.target.value)}
          required
        />
        
        <div className="text-center">
          <button 
            className='btn'
            disabled={createChannelMutation.isPending}
            type='submit'
          >
            {createChannelMutation.isPending ? (
              <span className="loading loading-spinner"></span>
            ) : '채널 생성'}
          </button>  
        </div>
      </form>
    </div>
  )
}
