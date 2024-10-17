import { format, parseISO, isToday, isYesterday, isThisYear } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { ko } from "date-fns/locale";

// 한국 시간대로 변환하는 함수
const toKoreanTime = (dateTimeString: string): Date | null => {
  if (!dateTimeString) return null;
  try {
    const date = parseISO(dateTimeString);
    if (isNaN(date.getTime())) return null; // 유효하지 않은 날짜 체크
    return toZonedTime(date, "Asia/Seoul");
  } catch (error) {
    console.error("Invalid date string:", dateTimeString);
    return null;
  }
};

export const toMessageTime = (dateTimeString: string): string => {
  const date = toKoreanTime(dateTimeString);
  if (!date) return "Invalid Date";
  if (isToday(date)) {
    return format(date, "a h:mm", { locale: ko });
  } else {
    return format(date, "M월 d일 a h:mm", { locale: ko });
  }
};

export const toDayDividerTime = (dateTimeString: string): string => {
  const date = toKoreanTime(dateTimeString);
  if (!date) return "Invalid Date";
  if (isToday(date)) {
    return "오늘";
  } else if (isYesterday(date)) {
    return "어제";
  } else if (isThisYear(date)) {
    return format(date, "M월 d일", { locale: ko });
  } else {
    return format(date, "yyyy년 M월 d일", { locale: ko });
  }
};

// 범용적인 한국 시간 포맷팅 함수
export const formatKoreanTime = (
  dateTimeString: string,
  formatString: string = "yyyy년 MM월 dd일 HH:mm:ss"
): string => {
  const date = toKoreanTime(dateTimeString);
  if (!date) return "Invalid Date";
  try {
    return format(date, formatString, { locale: ko });
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid Date";
  }
};