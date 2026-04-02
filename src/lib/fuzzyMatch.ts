import { ALL_KNOWN_PLAYERS } from "@/data/players";

function levenshtein(a: string, b: string): number {
  const m = a.length, n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = a[i-1] === b[j-1]
        ? dp[i-1][j-1]
        : 1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]);
  return dp[m][n];
}

export function fuzzyMatchPlayer(input: string): string | null {
  const lower = input.toLowerCase().trim();
  if (!lower) return null;
  
  let bestMatch = "";
  let bestScore = Infinity;
  
  for (const player of ALL_KNOWN_PLAYERS) {
    const dist = levenshtein(lower, player.toLowerCase());
    if (dist < bestScore) {
      bestScore = dist;
      bestMatch = player;
    }
  }
  
  // Accept if distance is less than 40% of input length
  const threshold = Math.max(3, Math.floor(lower.length * 0.4));
  return bestScore <= threshold ? bestMatch : null;
}

export function getSuggestions(input: string): string[] {
  const lower = input.toLowerCase().trim();
  if (!lower) return [];
  
  return ALL_KNOWN_PLAYERS
    .filter(p => p.toLowerCase().includes(lower))
    .slice(0, 5);
}
