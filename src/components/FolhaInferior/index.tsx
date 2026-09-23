import Ionicons from "@expo/vector-icons/Ionicons";
import { useMemo } from "react";
import { Modal, Pressable, ScrollView, Text, TouchableOpacity, View } from "react-native";

import { useTema } from "@/contexts/TemaContext";
import type { FolhaInferiorProps } from "@/types";

import { criarEstilos } from "./styles";

export function FolhaInferior({
  visivel,
  aoFechar,
  titulo,
  subtitulo,
  icone,
  children,
  rodape,
}: FolhaInferiorProps) {
  const { cores } = useTema();
  const styles = useMemo(() => criarEstilos(cores), [cores]);

  return (
    <Modal visible={visivel} transparent animationType="fade" onRequestClose={aoFechar}>
      <View style={styles.overlay}>
        <Pressable
          style={styles.overlayPressable}
          onPress={aoFechar}
          accessibilityRole="button"
          accessibilityLabel="Fechar"
        />

        <View style={styles.painel}>
          <View style={styles.cabecalho}>
            <View style={styles.cabecalhoTextos}>
              {icone ? (
                <View style={styles.cabecalhoIcone}>
                  <Ionicons name={icone} size={16} color={cores.primaria} />
                </View>
              ) : null}
              <View style={styles.flex}>
                {typeof titulo === "string" ? <Text style={styles.titulo}>{titulo}</Text> : titulo}
                {typeof subtitulo === "string" ? (
                  <Text style={styles.subtitulo}>{subtitulo}</Text>
                ) : (
                  subtitulo
                )}
              </View>
            </View>
            <TouchableOpacity
              style={styles.botaoFechar}
              onPress={aoFechar}
              accessibilityRole="button"
              accessibilityLabel="Fechar"
            >
              <Ionicons name="close" size={16} color={cores.textoSecundario} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.conteudo}
            keyboardShouldPersistTaps="handled"
          >
            {children}
          </ScrollView>

          {rodape ? <View style={styles.rodape}>{rodape}</View> : null}
        </View>
      </View>
    </Modal>
  );
}
