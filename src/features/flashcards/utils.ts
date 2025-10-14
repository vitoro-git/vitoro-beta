export function countClozeString(str: string | null): number {
  if (!str) return 0;
  const matches = str.match(/\{\{c\d+::.*?\}\}/g);
  return matches ? matches.length : 0;
}

export function hiddenClozeString(
  str: string | null,
  revealedCount: number
): string {
  if (!str) return "";

  let currentCount = 0;

  return str.replace(/\{\{c\d+::(.*?)\}\}/g, (_, content) => {
    currentCount++;
    if (currentCount <= revealedCount)
      return `<span class="highlight font-semibold">${content}</span>`;
    return `<span class="bg-gray-400 text-gray-400 rounded-sm px-1">_____</span>`;
  });
}
