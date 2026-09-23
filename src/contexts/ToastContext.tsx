import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";

import { Toast } from "@/components/Toast";
import type { ToastContextData } from "@/types";

const ToastContext = createContext<ToastContextData | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [mensagem, setMensagem] = useState<string | null>(null);
  const temporizadorRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const mostrarToast = useCallback((novaMensagem: string) => {
    if (temporizadorRef.current) {
      clearTimeout(temporizadorRef.current);
    }

    setMensagem(novaMensagem);

    temporizadorRef.current = setTimeout(() => {
      setMensagem(null);
    }, 2600);
  }, []);

  return (
    <ToastContext.Provider value={{ mostrarToast }}>
      {children}
      <Toast mensagem={mensagem} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const contexto = useContext(ToastContext);

  if (!contexto) {
    throw new Error("useToast deve ser usado dentro de um ToastProvider.");
  }

  return contexto;
}
