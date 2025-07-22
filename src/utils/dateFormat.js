export const formatMonthYear = (date) => {
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
};
