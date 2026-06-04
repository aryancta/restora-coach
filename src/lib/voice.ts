let lastSpoken = "";
let lastAt = 0;

export function speakCue(text: string, enabled: boolean) {
  if (!enabled || typeof window === "undefined") return;
  if (!("speechSynthesis" in window)) return;
  const now = Date.now();
  if (text === lastSpoken && now - lastAt < 4000) return;
  lastSpoken = text;
  lastAt = now;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.rate = 0.95;
  utter.pitch = 1;
  window.speechSynthesis.speak(utter);
}

export function speakRepCount(count: number, enabled: boolean) {
  speakCue(`Rep ${count}`, enabled);
}
