import React from "react";
import SearchInput from "./SearchInput";
import { UnifiedSearchResponse } from "@/app/models/search.model";

export default function SearchModal() {
  
  const handleSearchComplete = (results: UnifiedSearchResponse) => {
    console.log('Search Results:', results)
  }

  const workspaceId: number = 1;

  return (
    <div className="">
      <SearchInput
        workspaceId={workspaceId}
        onSearchComplete={handleSearchComplete}
        placeholder="검색어를 입력하세요."
      />

    </div>
  );
}
