import { format, parseISO, isToday, isYesterday, isThisYear } from "date-fns";
import { ko } from "date-fns/locale";

export const toMessageTime = (dateTimeString: string): string => {
  const date = parseISO(dateTimeString);

  if (isToday(date)) {
    return format(date, "a h:mm", { locale: ko });
  } else {
    return format(date, "M월 d일 a h:mm", { locale: ko });
  }
};

export const toDayDividerTime = (dateTimeString: string): string => {
  const date = parseISO(dateTimeString);

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
