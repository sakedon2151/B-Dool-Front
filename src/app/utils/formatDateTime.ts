import { format, formatDistanceToNow, parseISO, differenceInHours, differenceInDays, isYesterday, isThisYear, isToday } from "date-fns";
import { ko } from "date-fns/locale";

type DateString = string | null | undefined;

const parseDate = (dateString: string): Date => {
  if (!dateString) throw new Error("날짜 데이터 관련 에러");
  const parsed = parseISO(dateString);
  // Invalid Date 체크 추가
  if (isNaN(parsed.getTime())) {
    throw new Error("유효하지 않은 날짜 형식");
  }
  return parsed;
};

// 메시지 전송 시간 함수
export const toMessageTime = (dateString: DateString): string => {
  if (!dateString) return "날짜 정보 없음"
  try {
    const date = parseDate(dateString);
    if (isToday(date)) {
      return format(date, "a h:mm", { locale: ko });
    }
    return format(date, "M월 d일 a h:mm", { locale: ko });
  } catch (error) {
    console.error("Date parsing error:", error);
    return "Invalid Date";
  }
};

// 메시지 리스트의 분기별 정리
export const toDayDividerTime = (dateString: DateString): string => {
  if (!dateString) return "날짜 정보 없음"
  try {
    const date = parseDate(dateString);
    if (isToday(date)) {
      return "오늘";
    } else if (isYesterday(date)) {
      return "어제";
    } else if (isThisYear(date)) {
      return format(date, "M월 d일", { locale: ko });
    }
    return format(date, "yyyy년 M월 d일", { locale: ko });
  } catch (error) {
    console.error("Date parsing error:", error);
    return "Invalid Date";
  }
};

// 상대적 시간을 반환 (예: "3시간 전", "2일 전", "1개월 전")
export const toRelativeTime = (dateString: DateString): string => {
  if (!dateString) return "날짜 정보 없음"
  try { 
    const date = parseDate(dateString);
    return formatDistanceToNow(date, { 
      addSuffix: true, 
      locale: ko 
    });
  } catch (error) {
    console.error("Date parsing error:", error);
    return "Invalid Date";
  }
};

// 생성일자를 상황에 맞게 포맷팅
// - 24시간 이내: n시간 전
// - 7일 이내: n일 전
// - 이번 년도: M월 d일
// - 이전 년도: yyyy년 M월 d일
export const toCreatedAt = (dateString: DateString): string => {
  if (!dateString) return "날짜 정보 없음"
  try {
    const date = parseDate(dateString);
    const now = new Date();
    const hoursDiff = differenceInHours(now, date);
    const daysDiff = differenceInDays(now, date);
    if (hoursDiff < 24) {
      return formatDistanceToNow(date, { 
        addSuffix: true, 
        locale: ko 
      });
    } else if (daysDiff < 7) {
      return `${daysDiff}일 전`;
    } else if (isThisYear(date)) {
      return format(date, "M월 d일", { locale: ko });
    }
    return format(date, "yyyy년 M월 d일", { locale: ko });
  } catch (error) {
    console.error("Date parsing error:", error);
    return "Invalid Date";
  }
};

// 수정일자를 상황에 맞게 포맷팅 (생성일자와 비교하여 표시)
export const toUpdatedAt = (updatedAt?: string, createdAt?: string): string => {
  if (!updatedAt) return "날짜 정보 없음";
  try {
    // 생성일자가 없거나 수정일자와 같으면 수정일자만 반환
    if (!createdAt || updatedAt === createdAt) {
      return toCreatedAt(updatedAt);
    }
    // 생성일자와 다르면 "수정됨" 표시 추가
    return `${toCreatedAt(updatedAt)} (수정됨)`;
  } catch (error) {
    console.error("Date parsing error:", error);
    return "Invalid Date";
  }
};

// 상세 날짜 시간 포맷 (예: 2024년 3월 15일 오후 2:30)
export const toDetailDateTime = (dateString: DateString): string => {
  if (!dateString) return "날짜 정보 없음"
  try {
    const date = parseDate(dateString);
    return format(date, "yyyy년 M월 d일 a h:mm", { locale: ko });
  } catch (error) {
    console.error("Date parsing error:", error);
    return "Invalid Date";
  }
};