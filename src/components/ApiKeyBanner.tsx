"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getGeminiKey } from "@/lib/api-keys";

export function ApiKeyBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(!getGeminiKey());
  }, []);

  if (!show) return null;

  return (
    <div className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-center text-sm text-amber-950">
      Add your Gemini API key in{" "}
      <Link href="/settings" className="font-semibold underline">
        Settings
      </Link>{" "}
      to enable live AI coach summaries. Demo mode uses built-in encouragement.
    </div>
  );
}
