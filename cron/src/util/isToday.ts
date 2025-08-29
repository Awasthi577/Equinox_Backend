export const isToday = (dateStr: string) => {
  const cleanedStr = dateStr.replace('·', '').replace(/\s+/g, ' ').trim();
  const tweetDate = new Date(cleanedStr);

  if (isNaN(tweetDate.getTime())) {
    return false;
  }
  const today = new Date();
  return (
    tweetDate.getUTCFullYear() === today.getUTCFullYear() &&
    tweetDate.getUTCMonth() === today.getUTCMonth() &&
    tweetDate.getUTCDate() === today.getUTCDate()
  );
};