import formatDate from "date-fns/format";
import parseDate from "date-fns/parse";

export const convertToSimpleDate = (date: Date|string): string => {
  if (date instanceof Date) {
    return formatDate(date, "yyyy-MM-dd");
  }

  const formatted_date = parseDate(date, "yyyy-MM-dd", new Date());
  return formatDate(formatted_date, "yyyy-MM-dd");
}