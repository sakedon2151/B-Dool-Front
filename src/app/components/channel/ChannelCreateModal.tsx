import { useCreateChannel } from '@/app/queries/channel.query'
import { useProfileStore } from '@/app/stores/profile.store'
import { useWorkspaceStore } from '@/app/stores/workspace.store'
import { faGlobe, faLock } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useState } from 'react'

interface ChannelCreateModalProps {
  isOpen: boolean
  onClose: () => void;
}

export default function ChannelCreateModal({ isOpen, onClose }: ChannelCreateModalProps) {
  const [channelName, setChannelName] = useState<string>('')
  const [channelInfo, setChannelInfo] = useState<string>('')
  const [isPrivate, setIsPrivate] = useState<boolean>(false)

  const currentProfile = useProfileStore(state => state.currentProfile) // Zustand Store
  const currentWorkspace = useWorkspaceStore(state => state.currentWorkspace) // Zustand Store
  const createChannelMutation = useCreateChannel() // API Query

  const resetForm = () => {
    setChannelName('')
    setChannelInfo('')
    setIsPrivate(false)
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
        isPrivate: isPrivate,
        description: channelInfo,
        profileId: currentProfile.id,
        channelType: 'CUSTOM'
      })
      resetForm()
      onClose()
    } catch (error) {
      console.error('채널 생성 오류:', error)
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
        <h2 className="divider font-bold text-lg opacity-75">채널 공개 여부</h2>
        <p className="font-thin text-sm text-center">*비공개 채널은 해당 채널의 참가자 초대로만 접속이 가능합니다.</p>
        <div className="form-control justify-center gap-4 mb-4">
          <label className="label cursor-pointer p-0">
            <div>
              <FontAwesomeIcon icon={faGlobe} className='w-4 h-4 opacity-75'/>
              <span className="label-text ml-4">공개</span>
            </div>
            <input type="radio" name="radio-10" className="radio" checked={!isPrivate} onChange={() => setIsPrivate(false)} />
          </label>
          <label className="label cursor-pointer p-0">
            <div>
              <FontAwesomeIcon icon={faLock} className='w-4 h-4 opacity-75'/>
              <span className="label-text ml-4">비공개</span>
            </div>
            <input type="radio" name="radio-10" className="radio" checked={isPrivate} onChange={() => setIsPrivate(true)}/>
          </label>
        </div>
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
