import { useState } from 'react'
import type { UnifiedSearchResponse } from '@/app/models/search.model'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faMessage, faFile, faDownload } from '@fortawesome/free-solid-svg-icons'

interface SearchResultsProps {
  results: UnifiedSearchResponse | null
  loading?: boolean
}

type TabType = 'profiles' | 'messages' | 'files'

export default function SearchResults({ results, loading }: SearchResultsProps) {
  const [activeTab, setActiveTab] = useState<TabType>('profiles')

  if (!results && !loading) return null
  const { profiles, messages, files } = results || { profiles: [], messages: [], files: [] }

  // 탭 설정
  const tabs = [
    { id: 'profiles' as TabType, label: '프로필', count: profiles.length, icon: faUser },
    { id: 'messages' as TabType, label: '메시지', count: messages.length, icon: faMessage },
    { id: 'files' as TabType, label: '파일', count: files.length, icon: faFile }
  ]

  // 프로필 결과 렌더링
  const renderProfileResults = () => (
    <div className="space-y-2 overflow-y-auto h-72">
      {profiles.map((profile) => (
        <div key={profile.id} className="flex justify-between p-2 hover:bg-base-200 rounded-lg">
          
          <div className="flex items-center gap-4">
            <div className="avatar">
              <div className="w-12 h-12 rounded-full">
                <img src={profile.profileImgUrl} alt="profile_image" />
              </div>
            </div>

            <div>
              <div className="flex gap-2">
                <p className="font-medium">{profile.nickname}</p>•
                <p className="font-medium">{profile.name}</p>-
                <p className="font-medium">{profile.position}</p>
              </div>
              <p className="text-sm text-gray-500">{profile.email}</p>
            </div>
          </div>

          <button className="btn btn-ghost">
            <FontAwesomeIcon icon={faMessage} className='w-4 h-4 opacity-75'/>
          </button>
        </div>
      ))}
    </div>
  )

  // 메시지 결과 렌더링
  const renderMessageResults = () => (
    <div className="space-y-2 overflow-y-auto h-72">
      {messages.map((message) => (
        <div key={message.messageId} className="p-2 hover:bg-base-200 rounded-lg">
          
          <p className="text-sm mb-1 text-gray-500">
            {new Date(message.sendDate).toLocaleString()}
          </p>
          
          <p className="font-medium">{message.content}</p>
          
          {message.fileUrl && (
            <div className="text-sm text-blue-500 mt-1">
              <FontAwesomeIcon icon={faFile} className="mr-1" />
              첨부파일
            </div>
          )}
        
        </div>
      ))}
    </div>
  )

  // 파일 결과 렌더링
  const renderFileResults = () => (
    <div className="space-y-2 overflow-y-auto h-72">
      {files.map((file) => (
        <div key={file.fileId} className="flex justify-between p-2 bg-base-100 hover:bg-base-300 rounded-lg">
          
          <div className="flex items-center gap-4">
            <div className="btn btn-square">
              <FontAwesomeIcon icon={faFile} className="w-4 h-4 opacity-75"/>
            </div>

            <div>
              <p className="font-medium">{file.originalFileName}</p>
              <p className="text-sm text-gray-500">
                {(file.size / 1024 / 1024).toFixed(2)} MB • {file.extension.toUpperCase()}
              </p>
            </div>
          </div>

          <button className="btn btn-ghost">
            <FontAwesomeIcon icon={faDownload} className='w-4 h-4 opacity-75'/>
          </button>
        
        </div>
      ))}
    </div>
  )

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center p-8">
          <span className="loading loading-spinner"></span>
        </div>
      )
    }
    switch (activeTab) {
      case 'profiles':
        return profiles.length ? renderProfileResults() : <p className="text-center p-4 text-gray-500">프로필 검색 결과가 없습니다.</p>
      case 'messages':
        return messages.length ? renderMessageResults() : <p className="text-center p-4 text-gray-500">메시지 검색 결과가 없습니다.</p>
      case 'files':
        return files.length ? renderFileResults() : <p className="text-center p-4 text-gray-500">파일 검색 결과가 없습니다.</p>
    }
  }

  return (
    <div className="mt-4">
      <div role="tablist" className="tabs tabs-boxed bg-base-100">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`tab gap-2 ${activeTab === tab.id ? 'tab-active' : ''}`}
          >
            <FontAwesomeIcon icon={tab.icon} className='w-4 h-4 opacity-75'/>
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>
      <div className="mt-4">
        {renderContent()}
      </div>
    </div>
  )
}