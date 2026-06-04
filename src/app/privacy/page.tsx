export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold">Privacy</h1>
      <div className="mt-6 space-y-4 text-muted-foreground leading-relaxed">
        <p>
          Webcam frames are processed locally in your browser with MediaPipe. We
          do not upload video to our servers.
        </p>
        <p>
          Session history, streaks, and API keys are stored in your device
          localStorage only.
        </p>
        <p>
          If you add a Gemini API key, it is sent only as a request header when
          you request an AI coach summary, using your own Google account quota.
        </p>
        <p>
          Clear site data in your browser to remove all stored progress and keys.
        </p>
      </div>
    </div>
  );
}
