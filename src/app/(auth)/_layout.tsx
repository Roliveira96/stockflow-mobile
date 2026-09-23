import { Stack } from "expo-router";
import { useMemo } from "react";

import { useTema } from "@/contexts/TemaContext";
import { criarEstilos } from "@/styles/layout.styles";

export default function AuthLayout() {
  const { cores } = useTema();
  const styles = useMemo(() => criarEstilos(cores), [cores]);

  return <Stack screenOptions={{ headerShown: false, contentStyle: styles.conteudoTela }} />;
}
