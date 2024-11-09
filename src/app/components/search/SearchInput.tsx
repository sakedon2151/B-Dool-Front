import { useState, useCallback, ChangeEvent, useEffect, useRef } from 'react';
import { useElastic } from '@/app/hooks/useElastic';
import type { UnifiedSearchResponse, SearchRequest } from '@/app/models/search.model';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faXmark } from '@fortawesome/free-solid-svg-icons';

interface SearchInputProps {
  workspaceId: number;
  profileId: number;
  onSearchComplete?: (results: UnifiedSearchResponse) => void;
  placeholder?: string;
  debounceTime?: number;
}

export default function SearchInput({ workspaceId, profileId, onSearchComplete, placeholder = "메시지, 파일, 멤버 검색...", debounceTime = 1000 }: SearchInputProps) {
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [isTyping, setIsTyping] = useState<boolean>(false)
  const searchTimeoutRef = useRef<NodeJS.Timeout>()
  const { isLoading, error, searchResults, performSearch } = useElastic(workspaceId)

  const executeSearch = useCallback((term: string) => {
    if (term.trim()) {
      const searchParams: SearchRequest = {
        keyword: term.trim(),
        profileId
      }
      console.log(searchParams)
      performSearch(searchParams)
    }
  }, [performSearch, profileId])

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
    <div className="flex flex-col w-full">
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="input input-bordered w-full px-12"
          disabled={isLoading}
        />

        <FontAwesomeIcon icon={faMagnifyingGlass} className='w-4 h-4 opacity-75 absolute left-4 top-4'/>

        {(isLoading || isTyping || searchTerm) && (
          <div>
            {isLoading ? (
              <span className='loading loading-spinner absolute right-3 top-1/2 -translate-y-1/2'></span>
            ) : isTyping ? (
              <span className="loading loading-dots absolute right-3 top-1/2 -translate-y-1/2"></span>
            ) : (
              <button
                type="button"
                className="btn btn-sm btn-ghost btn-circle absolute right-2 top-2"
                onClick={handleClearSearch}
              >
                <FontAwesomeIcon icon={faXmark} className='w-4 h-4 opacity-75'/>
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
    </div>
  )
}