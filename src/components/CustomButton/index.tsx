import Ionicons from "@expo/vector-icons/Ionicons";
import { useMemo } from "react";
import { ActivityIndicator, Text, TouchableOpacity } from "react-native";

import { useTema } from "@/contexts/TemaContext";
import type { CustomButtonProps } from "@/types";

import { criarEstilos } from "./styles";

export function CustomButton({
  titulo,
  onPress,
  carregando,
  desabilitado,
  estiloContainer,
  icone,
  variante = "primaria",
  compacto,
}: CustomButtonProps) {
  const { cores } = useTema();
  const styles = useMemo(() => criarEstilos(cores), [cores]);
  const bloqueado = desabilitado || carregando;

  const corConteudo =
    variante === "perigo"
      ? cores.perigo
      : variante === "neutro"
        ? cores.neutroTexto
        : cores.textoSobreCor;

  return (
    <TouchableOpacity
      style={[
        styles.botao,
        styles[variante],
        compacto ? styles.compacto : undefined,
        bloqueado ? styles.desabilitado : undefined,
        estiloContainer,
      ]}
      onPress={onPress}
      disabled={bloqueado}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={titulo}
      accessibilityState={{ disabled: bloqueado, busy: carregando }}
    >
      {carregando ? (
        <ActivityIndicator color={corConteudo} />
      ) : (
        <>
          {icone ? <Ionicons name={icone} size={18} color={corConteudo} /> : null}
          <Text
            style={[
              styles.texto,
              compacto ? styles.textoCompacto : undefined,
              variante === "perigo" ? styles.textoPerigo : undefined,
              variante === "neutro" ? styles.textoNeutro : undefined,
            ]}
            numberOfLines={1}
          >
            {titulo}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}
