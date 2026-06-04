"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  PoseLandmarker,
  FilesetResolver,
  type NormalizedLandmark,
} from "@mediapipe/tasks-vision";
import { LandmarkSmoother } from "@/lib/pose/smoothing";
import type { Point3 } from "@/lib/pose/angles";
import { LM } from "@/lib/pose/angles";

const POSE_CONNECTIONS: [number, number][] = [
  [LM.LEFT_SHOULDER, LM.RIGHT_SHOULDER],
  [LM.LEFT_SHOULDER, LM.LEFT_ELBOW],
  [LM.LEFT_ELBOW, LM.LEFT_WRIST],
  [LM.RIGHT_SHOULDER, LM.RIGHT_ELBOW],
  [LM.RIGHT_ELBOW, LM.RIGHT_WRIST],
  [LM.LEFT_SHOULDER, LM.LEFT_HIP],
  [LM.RIGHT_SHOULDER, LM.RIGHT_HIP],
  [LM.LEFT_HIP, LM.RIGHT_HIP],
  [LM.LEFT_HIP, LM.LEFT_KNEE],
  [LM.LEFT_KNEE, LM.LEFT_ANKLE],
  [LM.RIGHT_HIP, LM.RIGHT_KNEE],
  [LM.RIGHT_KNEE, LM.RIGHT_ANKLE],
];

type PoseCameraProps = {
  active: boolean;
  onLandmarks: (landmarks: Point3[]) => void;
  statusColor: string;
};

export function PoseCamera({ active, onLandmarks, statusColor }: PoseCameraProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const landmarkerRef = useRef<PoseLandmarker | null>(null);
  const smootherRef = useRef(new LandmarkSmoother());
  const rafRef = useRef<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const initPose = useCallback(async () => {
    try {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.21/wasm"
      );
      const base = {
        modelAssetPath:
          "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task",
      };
      try {
        landmarkerRef.current = await PoseLandmarker.createFromOptions(vision, {
          baseOptions: { ...base, delegate: "GPU" },
          runningMode: "VIDEO",
          numPoses: 1,
        });
      } catch {
        landmarkerRef.current = await PoseLandmarker.createFromOptions(vision, {
          baseOptions: { ...base, delegate: "CPU" },
          runningMode: "VIDEO",
          numPoses: 1,
        });
      }
      setLoading(false);
    } catch {
      setError("Could not load pose model. Try refreshing or use Chrome.");
      setLoading(false);
    }
  }, []);

  const startCamera = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false,
      });
      video.srcObject = stream;
      await video.play();
      setError(null);
    } catch {
      setError(
        "Camera access denied. Allow webcam permission over HTTPS and try again."
      );
    }
  }, []);

  useEffect(() => {
    initPose();
    const video = videoRef.current;
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      const stream = video?.srcObject as MediaStream | null;
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, [initPose]);

  useEffect(() => {
    if (!active) return;
    startCamera();
  }, [active, startCamera]);

  useEffect(() => {
    if (!active || loading || error) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const landmarker = landmarkerRef.current;
    if (!video || !canvas || !landmarker) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let lastVideoTime = -1;

    const drawSkeleton = (
      points: NormalizedLandmark[],
      color: string
    ) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      for (const [a, b] of POSE_CONNECTIONS) {
        const p1 = points[a];
        const p2 = points[b];
        if (!p1 || !p2) continue;
        ctx.beginPath();
        ctx.moveTo(p1.x * canvas.width, p1.y * canvas.height);
        ctx.lineTo(p2.x * canvas.width, p2.y * canvas.height);
        ctx.stroke();
      }
      ctx.fillStyle = "#0f766e";
      for (const p of points) {
        ctx.beginPath();
        ctx.arc(p.x * canvas.width, p.y * canvas.height, 4, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const loop = () => {
      if (!video.videoWidth) {
        rafRef.current = requestAnimationFrame(loop);
        return;
      }
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      if (video.currentTime !== lastVideoTime) {
        lastVideoTime = video.currentTime;
        const result = landmarker.detectForVideo(video, performance.now());
        const raw = result.landmarks[0];
        if (raw) {
          const points: Point3[] = raw.map((l) => ({
            x: l.x,
            y: l.y,
            z: l.z,
            visibility: l.visibility,
          }));
          const smooth = smootherRef.current.smooth(points);
          onLandmarks(smooth);
          const drawPoints: NormalizedLandmark[] = smooth.map((p) => ({
            x: p.x,
            y: p.y,
            z: p.z ?? 0,
            visibility: p.visibility ?? 1,
          }));

          const color =
            statusColor === "good"
              ? "#22c55e"
              : statusColor === "warn"
                ? "#f59e0b"
                : statusColor === "risk"
                  ? "#ef4444"
                  : "#14b8a6";

          drawSkeleton(drawPoints, color);
        }
      }
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [active, loading, error, onLandmarks, statusColor]);

  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-slate-900">
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover opacity-0"
        playsInline
        muted
      />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full object-cover -scale-x-100"
      />
      {(loading || error) && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/90 p-4 text-center text-sm text-white">
          {error ?? "Loading pose tracking..."}
        </div>
      )}
    </div>
  );
}
