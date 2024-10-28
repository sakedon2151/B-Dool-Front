import { useState, useCallback, ChangeEvent, useEffect, useRef } from 'react';
import { useElastic } from '@/app/hooks/useElastic';
import type { UnifiedSearchResponse, SearchRequest } from '@/app/models/search.model';
import { debounce } from 'lodash';

interface SearchInputProps {
  workspaceId: number;
  onSearchComplete?: (results: UnifiedSearchResponse) => void;
  placeholder?: string;
  debounceTime?: number;
}

export default function SearchInput({ workspaceId, onSearchComplete, placeholder = "메시지, 파일, 멤버 검색...", debounceTime = 1000 }: SearchInputProps) {
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [isTyping, setIsTyping] = useState<boolean>(false)
  const searchTimeoutRef = useRef<NodeJS.Timeout>()
  const { loading, error, searchResults, performSearch } = useElastic(workspaceId)

  const executeSearch = useCallback((term: string) => {
    if (term.trim()) {
      const searchParams: SearchRequest = {
        keyword: term.trim()
      }
      performSearch(searchParams)
    }
  }, [performSearch])

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchTerm(value)
    setIsTyping(true)
    // 이전 타이머 취소
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }
    // 새로운 타이머 설정
    searchTimeoutRef.current = setTimeout(() => {
      setIsTyping(false)
      if (value.trim()) {
        executeSearch(value)
      }
    }, debounceTime)
  }

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [])

  const handleClearSearch = () => {
    setSearchTerm('')
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }
    setIsTyping(false)
  }

  useEffect(() => {
    if (searchResults && onSearchComplete) {
      onSearchComplete(searchResults)
    }
  }, [searchResults, onSearchComplete])

  return (
    <div className="flex flex-col w-full max-w-2xl">
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="w-full px-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          aria-label="Search"
          disabled={loading}
        />
        
        {/* 검색 아이콘 */}
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <svg 
            width="18" 
            height="18" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
        </div>

        {/* 상태 표시 (로딩/타이핑/초기화) */}
        {(loading || isTyping || searchTerm) && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {loading ? (
              <svg
                className="animate-spin text-gray-400"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" strokeDasharray="40" strokeDashoffset="20"/>
              </svg>
            ) : isTyping ? (
              <span className="text-sm text-gray-400">입력 중...</span>
            ) : (
              <button
                type="button"
                onClick={handleClearSearch}
                className="text-gray-400 hover:text-gray-600"
                aria-label="검색어 지우기"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            )}
          </div>
        )}
      </div>

      {/* 에러 메시지 */}
      {error && (
        <div className="mt-2 text-sm text-red-500">
          {error.message}
        </div>
      )}

      {/* 검색 결과 요약 (타이핑 중이 아닐 때만 표시) */}
      {searchResults && searchTerm && !isTyping && (
        <div className="mt-2 text-sm text-gray-600">
          검색 결과: 멤버 {searchResults.profiles.length}개,
          메시지 {searchResults.messages.length}개,
          파일 {searchResults.files.length}개
        </div>
      )}
    </div>
  )
}