import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useMemo } from "react";
import { StatusBar } from "expo-status-bar";

import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { TemaProvider, useTema } from "@/contexts/TemaContext";
import { ToastProvider } from "@/contexts/ToastContext";
import { criarEstilos } from "@/styles/layout.styles";

SplashScreen.preventAutoHideAsync();

function RootNavigator() {
  const { token, carregandoSessao } = useAuth();
  const { modo, cores } = useTema();
  const styles = useMemo(() => criarEstilos(cores), [cores]);

  useEffect(() => {
    if (!carregandoSessao) {
      SplashScreen.hideAsync();
    }
  }, [carregandoSessao]);

  if (carregandoSessao) {
    return null;
  }

  return (
    <>
      <StatusBar style={modo === "escuro" ? "light" : "dark"} />
      <Stack screenOptions={{ headerShown: false, contentStyle: styles.conteudoTela }}>
        <Stack.Protected guard={!!token}>
          <Stack.Screen name="(app)" />
        </Stack.Protected>
        <Stack.Protected guard={!token}>
          <Stack.Screen name="(auth)" />
        </Stack.Protected>
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <TemaProvider>
      <ToastProvider>
        <AuthProvider>
          <RootNavigator />
        </AuthProvider>
      </ToastProvider>
    </TemaProvider>
  );
}
