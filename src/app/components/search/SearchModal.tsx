import React, { useState } from "react";
import SearchInput from "./SearchInput";
import { UnifiedSearchResponse } from "@/app/models/search.model";
import { useProfileStore } from "@/app/stores/profile.store";
import SearchResults from "./SearchResults";

interface SearchModalProps {
  workspaceId: number
}

export default function SearchModal({ workspaceId }: SearchModalProps) {
  const [searchResults, setSearchResults] = useState<UnifiedSearchResponse | null>(null)
  const [searching, setSearching] = useState<boolean>(false)
  const currentProfile = useProfileStore(state => state.currentProfile); // Zustand Store
  
  const handleSearchComplete = (results: UnifiedSearchResponse) => {
    setSearchResults(results)
    setSearching(false)
  }

  return (
    <div>
      <SearchInput
        workspaceId={workspaceId}
        profileId={currentProfile.id}
        onSearchComplete={handleSearchComplete}
        placeholder="검색어를 입력하세요."
      />
      <SearchResults results={searchResults} loading={searching}/>
    </div>
  );
}
