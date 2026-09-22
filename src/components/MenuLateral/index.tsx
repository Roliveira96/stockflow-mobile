import Ionicons from "@expo/vector-icons/Ionicons";
import { useEffect, useState } from "react";
import { Animated, Pressable, Text, TouchableOpacity, View } from "react-native";

import { cores } from "@/constants/theme";
import type { MenuLateralProps } from "@/types";

import { LARGURA_MENU, styles } from "./styles";

export function MenuLateral({ visivel, aoFechar, nomeUsuario, aoSair }: MenuLateralProps) {
  const [translateX] = useState(() => new Animated.Value(-LARGURA_MENU));
  const [opacidadeOverlay] = useState(() => new Animated.Value(0));

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateX, {
        toValue: visivel ? 0 : -LARGURA_MENU,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.timing(opacidadeOverlay, {
        toValue: visivel ? 0.5 : 0,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start();
  }, [visivel, translateX, opacidadeOverlay]);

  return (
    <>
      <Animated.View
        style={[styles.overlay, { opacity: opacidadeOverlay }]}
        pointerEvents={visivel ? "auto" : "none"}
      >
        <Pressable
          style={styles.overlayPressable}
          onPress={aoFechar}
          accessibilityRole="button"
          accessibilityLabel="Fechar menu"
        />
      </Animated.View>

      <Animated.View
        style={[styles.painel, { transform: [{ translateX }] }]}
        pointerEvents={visivel ? "auto" : "none"}
      >
        <View style={styles.cabecalhoUsuario}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={24} color={cores.textoSobreCor} />
          </View>
          <Text style={styles.nomeUsuario}>{nomeUsuario}</Text>
        </View>

        <View style={styles.menuLista}>
          <View style={[styles.itemMenu, styles.itemMenuAtivo]}>
            <Ionicons name="cube-outline" size={20} color={cores.primaria} />
            <Text style={[styles.itemMenuTexto, styles.itemMenuTextoAtivo]}>Produtos</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.botaoSair}
          onPress={aoSair}
          accessibilityRole="button"
          accessibilityLabel="Sair"
        >
          <Ionicons name="log-out-outline" size={20} color={cores.perigo} />
          <Text style={styles.botaoSairTexto}>Sair</Text>
        </TouchableOpacity>
      </Animated.View>
    </>
  );
}
