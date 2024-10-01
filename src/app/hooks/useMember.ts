import { useQuery } from "@tanstack/react-query";
import { useStore } from "../store";
import { memberService } from "../services/member/member.api";
import { MemberModel } from "../models/member.model";
import { useEffect } from "react";

export const useMember = (memberId: number) => {
  const { currentMember, setCurrentMember } = useStore(state => ({
    currentMember: state.currentMember,
    setCurrentMember: state.setCurrentMember
  }));

  const query = useQuery<MemberModel, Error>({
    queryKey: ['member', memberId],
    queryFn: () => memberService.getMemberById(memberId),
    enabled: !!memberId,
    refetchInterval: 60000, // 1분마다 데이터 갱신
  });

  useEffect(() => {
    if (query.data) {
      setCurrentMember(query.data);
    }
  }, [query.data, setCurrentMember]);

  return { 
    member: currentMember, 
    isLoading: query.isLoading, 
    error: query.error,
    refetch: query.refetch 
  };
};