import { locale } from "user-settings";
import { gettext } from "i18n";

////////////////////////////////////////////////////////////////////
///   functions
export function localizedDate(day, weekDay, month) {
  const monthName = gettext(`month_long_${month}`);
  const dayName = gettext(`day_short_${weekDay}`);
  const dayMonthSeparator = gettext("day_month_separator");
  /* debug
  console.log(`locale=${locale.language}`);
  */
  switch (locale.language) {
    case "zh-cn":
      // 2月7日周二 = Month_Date_Weekday
      return `${monthName}${dayMonthSeparator}${day}${dayName}`;
    case "ja-jp":
      // 8月3日（木）= Month_Date (Weekday)
      return `${monthName}${dayMonthSeparator}${day} (${dayName})`;
    case "ko-kr":
      // 2/7 (목) = Month/date (day)
      return `${month+1}${dayMonthSeparator}${day} (${dayName})`;
    case "de-de":
      // Di, 7. Feb
      return `${dayName}, ${day}${dayMonthSeparator}${monthName}`;
    case "en-us":
      // Thu, Feb 7
      return `${dayName}${dayMonthSeparator} ${monthName} ${day}`;
    default:
      // Thu, 7 Feb
      return `${dayName}${dayMonthSeparator} ${day} ${monthName}`;
  }
}