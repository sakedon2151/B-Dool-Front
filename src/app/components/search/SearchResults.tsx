import { useState } from 'react'
import type { UnifiedSearchResponse } from '@/app/models/search.model'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faMessage, faFile } from '@fortawesome/free-solid-svg-icons'

interface SearchResultsProps {
  results: UnifiedSearchResponse | null
  loading?: boolean
}

type TabType = 'profiles' | 'messages' | 'files'

export default function SearchResults({ results, loading }: SearchResultsProps) {
  const [activeTab, setActiveTab] = useState<TabType>('profiles')

  if (!results && !loading) return null
  const { profiles, messages, files } = results || { profiles: [], messages: [], files: [] }

  // 탭 데이터 설정
  const tabs = [
    { id: 'profiles' as TabType, label: '프로필', count: profiles.length, icon: faUser },
    { id: 'messages' as TabType, label: '메시지', count: messages.length, icon: faMessage },
    { id: 'files' as TabType, label: '파일', count: files.length, icon: faFile }
  ]

  // 프로필 결과 렌더링
  const renderProfileResults = () => (
    <div className="space-y-2">
      {profiles.map((profile) => (
        <div key={profile.id} className="flex items-center p-3 hover:bg-base-200 rounded-lg">
          <div className="avatar">
            <div className="w-10 h-10 rounded-full">
              <img src={profile.profileImgUrl || '/default-avatar.png'} alt={profile.name} />
            </div>
          </div>
          <div className="ml-3">
            <div className="font-medium">{profile.name}</div>
            <div className="text-sm text-gray-500">{profile.email}</div>
          </div>
        </div>
      ))}
    </div>
  )

  // 메시지 결과 렌더링
  const renderMessageResults = () => (
    <div className="space-y-2">
      {messages.map((message) => (
        <div key={message.messageId} className="p-3 hover:bg-base-200 rounded-lg">
          <div className="text-sm mb-1 text-gray-500">
            {new Date(message.sendDate).toLocaleString()}
          </div>
          <div className="font-medium">{message.content}</div>
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
    <div className="space-y-2">
      {files.map((file) => (
        <div key={file.fileId} className="flex items-center p-3 hover:bg-base-200 rounded-lg">
          <FontAwesomeIcon 
            icon={faFile} 
            className="w-10 h-10 text-gray-400"
          />
          <div className="ml-3">
            <div className="font-medium">{file.originalFileName}</div>
            <div className="text-sm text-gray-500">
              {(file.size / 1024 / 1024).toFixed(2)} MB • {file.extension.toUpperCase()}
            </div>
          </div>
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
        return profiles.length ? renderProfileResults() : <div className="text-center p-4 text-gray-500">프로필 검색 결과가 없습니다.</div>
      case 'messages':
        return messages.length ? renderMessageResults() : <div className="text-center p-4 text-gray-500">메시지 검색 결과가 없습니다.</div>
      case 'files':
        return files.length ? renderFileResults() : <div className="text-center p-4 text-gray-500">파일 검색 결과가 없습니다.</div>
    }
  }

  return (
    <div className="mt-4">
      {/* 탭 메뉴 */}
      <div className="tabs tabs-boxed">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`tab flex-1 gap-2 ${activeTab === tab.id ? 'tab-active' : ''}`}
          >
            <FontAwesomeIcon icon={tab.icon} />
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* 결과 컨텐츠 */}
      <div className="mt-4">
        {renderContent()}
      </div>
    </div>
  )
}