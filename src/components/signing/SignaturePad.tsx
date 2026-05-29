"use client";

import { useEffect, useRef } from "react";
import SignaturePadLib from "signature_pad";
import { Button } from "@/components/ui/button";

export function SignaturePad({ onChange }: { onChange: (value: string) => void }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const padRef = useRef<SignaturePadLib | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ratio = Math.max(window.devicePixelRatio || 1, 1);
    canvas.width = canvas.offsetWidth * ratio;
    canvas.height = 220 * ratio;
    const context = canvas.getContext("2d");
    context?.scale(ratio, ratio);
    const inkColor = getComputedStyle(document.documentElement).getPropertyValue("--signature-ink").trim() || "#6366f1";
    padRef.current = new SignaturePadLib(canvas, { backgroundColor: "rgba(0,0,0,0)", penColor: inkColor });
    padRef.current.addEventListener("endStroke", () => onChange(padRef.current?.toDataURL() ?? ""));

    return () => {
      padRef.current?.off();
      padRef.current = null;
    };
  }, [onChange]);

  return (
    <div className="space-y-3">
      <canvas ref={canvasRef} className="h-[220px] w-full rounded-2xl border border-dashed border-zinc-300 bg-white dark:border-zinc-700 dark:bg-zinc-950" />
      <Button variant="outline" size="sm" onClick={() => { padRef.current?.clear(); onChange(""); }}>Clear</Button>
    </div>
  );
}
