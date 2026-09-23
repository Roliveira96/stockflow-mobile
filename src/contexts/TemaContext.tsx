import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { Platform, useColorScheme } from "react-native";
import * as SystemUI from "expo-system-ui";

import { coresClaro, coresEscuro, type ModoTema } from "@/constants/theme";
import type { TemaContextData } from "@/types";

const CHAVE_TEMA = "@stockflow:tema";

const TemaContext = createContext<TemaContextData | undefined>(undefined);

export function TemaProvider({ children }: { children: ReactNode }) {
  const esquemaSistema = useColorScheme();
  const [modo, setModo] = useState<ModoTema>(esquemaSistema === "dark" ? "escuro" : "claro");

  useEffect(() => {
    async function carregarPreferencia() {
      const salvo = await AsyncStorage.getItem(CHAVE_TEMA);

      if (salvo === "claro" || salvo === "escuro") {
        setModo(salvo);
      }
    }

    carregarPreferencia();
  }, []);

  function alternarTema() {
    setModo((atual) => {
      const novo: ModoTema = atual === "claro" ? "escuro" : "claro";
      AsyncStorage.setItem(CHAVE_TEMA, novo);
      return novo;
    });
  }

  const cores = useMemo(() => (modo === "escuro" ? coresEscuro : coresClaro), [modo]);

  useEffect(() => {
    SystemUI.setBackgroundColorAsync(cores.fundo);

    if (Platform.OS === "web") {
      document.documentElement.style.backgroundColor = cores.fundo;
      document.body.style.overscrollBehavior = "none";
    }
  }, [cores]);

  return (
    <TemaContext.Provider value={{ modo, cores, alternarTema }}>{children}</TemaContext.Provider>
  );
}

export function useTema() {
  const contexto = useContext(TemaContext);

  if (!contexto) {
    throw new Error("useTema deve ser usado dentro de um TemaProvider.");
  }

  return contexto;
}
