const GEMINI_API_KEY = "AIzaSyC9YaI5ogw79vXfDNTaoOXe4tCdXCun7Qc";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

// Cache corrected names to avoid redundant API calls
const nameCache = new Map<string, string>();

export async function correctPlayerName(input: string): Promise<string | null> {
  const trimmed = input.trim();
  if (!trimmed) return null;

  const cacheKey = trimmed.toLowerCase();
  if (nameCache.has(cacheKey)) {
    return nameCache.get(cacheKey)!;
  }

  try {
    const response = await fetch(GEMINI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `You are a cricket player name corrector. Given the input "${trimmed}", return ONLY the corrected full name of the cricket player. If it's already correct, return it as-is. If you can't identify the player, return "UNKNOWN". Return ONLY the name, nothing else.`
          }]
        }],
        generationConfig: {
          temperature: 0,
          maxOutputTokens: 50,
        }
      }),
    });

    if (!response.ok) return null;

    const data = await response.json();
    const result = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (result && result !== "UNKNOWN") {
      nameCache.set(cacheKey, result);
      return result;
    }
    return null;
  } catch (e) {
    console.error("Gemini API error:", e);
    return null;
  }
}

export async function fetchPlayerNationality(name: string): Promise<"indian" | "overseas" | "unknown"> {
  const trimmed = name.trim();
  if (!trimmed) return "unknown";

  try {
    const response = await fetch(GEMINI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Is the cricket player "${trimmed}" from India? Reply ONLY with "INDIAN" or "OVERSEAS". Nothing else.`
          }]
        }],
        generationConfig: {
          temperature: 0,
          maxOutputTokens: 10,
        }
      }),
    });

    if (!response.ok) return "unknown";

    const data = await response.json();
    const result = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim().toUpperCase();

    if (result?.includes("INDIAN")) return "indian";
    if (result?.includes("OVERSEAS")) return "overseas";
    return "unknown";
  } catch {
    return "unknown";
  }
}
