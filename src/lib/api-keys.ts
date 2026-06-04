export const STORAGE_NAMESPACE = "restora_api_keys";

export type ApiKeyMap = {
  gemini?: string;
};

export function getApiKeys(): ApiKeyMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_NAMESPACE);
    if (!raw) return {};
    return JSON.parse(raw) as ApiKeyMap;
  } catch {
    return {};
  }
}

export function setApiKeys(keys: ApiKeyMap): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_NAMESPACE, JSON.stringify(keys));
}

export function getGeminiKey(): string | undefined {
  return getApiKeys().gemini?.trim() || undefined;
}
