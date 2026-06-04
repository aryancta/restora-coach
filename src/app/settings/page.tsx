"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ExternalLink, KeyRound, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getApiKeys, setApiKeys } from "@/lib/api-keys";
import { toast } from "sonner";

export default function SettingsPage() {
  const [geminiKey, setGeminiKey] = useState("");
  const [voiceDefault, setVoiceDefault] = useState(true);

  useEffect(() => {
    const keys = getApiKeys();
    setGeminiKey(keys.gemini ?? "");
    const v = localStorage.getItem("restora_voice_default");
    setVoiceDefault(v !== "false");
  }, []);

  const save = () => {
    setApiKeys({ gemini: geminiKey.trim() || undefined });
    localStorage.setItem("restora_voice_default", String(voiceDefault));
    toast.success("Settings saved locally on this device");
  };

  const clearKeys = () => {
    setGeminiKey("");
    setApiKeys({});
    toast.message("API keys cleared");
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-3xl font-bold">Settings</h1>
      <p className="mt-2 text-muted-foreground">
        Keys stay in your browser only. We never send them to our servers except
        as a header on your own coach request.
      </p>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <KeyRound className="h-5 w-5" />
            Google Gemini API
          </CardTitle>
          <CardDescription>
            Free tier via Google AI Studio powers live AI coach summaries after
            each session. Leave blank for built-in demo encouragement.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="gemini-key">API key</Label>
            <Input
              id="gemini-key"
              name="gemini-key"
              type="password"
              placeholder="AIza..."
              value={geminiKey}
              onChange={(e) => setGeminiKey(e.target.value)}
              autoComplete="off"
            />
          </div>
          <a
            href="https://aistudio.google.com/app/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
          >
            Get a free key at Google AI Studio
            <ExternalLink className="h-3 w-3" />
          </a>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Accessibility</CardTitle>
          <CardDescription>
            Spoken rep counts and safety cues during workouts (Web Speech API).
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <Label htmlFor="voice-default">Voice cues on by default</Label>
          <Switch
            id="voice-default"
            checked={voiceDefault}
            onCheckedChange={setVoiceDefault}
          />
        </CardContent>
      </Card>

      <div className="mt-8 flex flex-wrap gap-3">
        <Button onClick={save}>
          <Save className="h-4 w-4" />
          Save settings
        </Button>
        <Button variant="outline" onClick={clearKeys}>
          Clear API keys
        </Button>
        <Button variant="ghost" asChild>
          <Link href="/dashboard">Back to progress</Link>
        </Button>
      </div>

      <p className="mt-8 text-xs text-muted-foreground">
        MediaPipe pose tracking runs fully client-side and needs no API key.
      </p>
    </div>
  );
}
