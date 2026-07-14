"use client";

import { useState, FormEvent } from "react";
import HudPanel from "@/components/HudPanel";
import { SITE_PASSWORD } from "@/lib/siteAccess";

export default function PasswordGate({ onUnlock }: { onUnlock: () => void }) {
  const [value, setValue] = useState("");
  const [shake, setShake] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (value.trim() === SITE_PASSWORD) {
      onUnlock();
      return;
    }
    setShake(true);
    setValue("");
    setTimeout(() => setShake(false), 350);
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <HudPanel bg="peach" className={`w-full max-w-xs ${shake ? "animate-shake" : ""}`}>
        <p className="font-hud text-sm tracking-[0.2em] text-pixel-ink-soft mb-4 text-center">
          &gt;&gt; ACCESS LOCKED
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4">
          <label className="w-full flex flex-col gap-1">
            <span className="font-pixel text-[10px] text-pixel-ink-soft">
              ENTER PASSWORD
            </span>
            <input
              type="password"
              inputMode="numeric"
              autoFocus
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="pixel-border-sm bg-white px-3 py-2 font-body text-sm text-pixel-ink text-center tracking-widest focus:outline-none"
            />
          </label>
          <button
            type="submit"
            className="pixel-btn bg-pixel-butter font-body text-xs text-pixel-ink px-4 py-2 cursor-pointer"
          >
            Unlock
          </button>
        </form>
      </HudPanel>
    </main>
  );
}
