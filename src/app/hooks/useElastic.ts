import { useState } from "react";
import { SearchRequest, UnifiedSearchResponse } from "../models/search.model";
import { searchService } from "../services/search/search.service";

export const useElastic = (workspaceId: number) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [searchResults, setSearchResults] = useState<UnifiedSearchResponse | null>(null);

  const performSearch = async (params: SearchRequest) => {
    try {
      setLoading(true);
      setError(null);
      const results = await searchService.unifiedSearch(workspaceId, params);
      setSearchResults(results);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('검색 중 오류가 발생했습니다.'));
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    searchResults,
    performSearch
  };
};