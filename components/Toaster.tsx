"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

type ToastCtx = { toast: (msg: string) => void };
const Ctx = createContext<ToastCtx>({ toast: () => {} });

export function useToast() {
  return useContext(Ctx);
}

export function Toaster({ children }: { children: React.ReactNode }) {
  const [msg, setMsg] = useState<string | null>(null);
  const [shown, setShown] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const toast = useCallback((m: string) => {
    setMsg(m);
    setShown(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setShown(false), 2200);
  }, []);

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  return (
    <Ctx.Provider value={{ toast }}>
      {children}
      <div
        className={`toast ${shown ? "show" : ""}`}
        role="status"
        aria-live="polite"
      >
        {msg}
      </div>
    </Ctx.Provider>
  );
}
