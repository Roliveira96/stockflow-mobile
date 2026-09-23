import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Animated, Pressable, Text, TouchableOpacity, View } from "react-native";

import { useTema } from "@/contexts/TemaContext";
import type { MenuLateralProps } from "@/types";

import { criarEstilos, LARGURA_MENU } from "./styles";

export function MenuLateral({
  visivel,
  aoFechar,
  nomeUsuario,
  emailUsuario,
  cargoUsuario,
  aoSair,
  aoAbrirCategorias,
  telaAtiva,
  totalProdutos,
  totalCategorias,
  pedidosPendentes,
}: MenuLateralProps) {
  const router = useRouter();
  const { cores, modo, alternarTema } = useTema();
  const styles = useMemo(() => criarEstilos(cores), [cores]);
  const [translateX] = useState(() => new Animated.Value(LARGURA_MENU));
  const [opacidadeOverlay] = useState(() => new Animated.Value(0));
  const iniciais = nomeUsuario
    .split(" ")
    .map((parte) => parte[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateX, {
        toValue: visivel ? 0 : LARGURA_MENU,
        duration: 240,
        useNativeDriver: true,
      }),
      Animated.timing(opacidadeOverlay, {
        toValue: visivel ? 0.6 : 0,
        duration: 240,
        useNativeDriver: true,
      }),
    ]).start();
  }, [visivel, translateX, opacidadeOverlay]);

  return (
    <View style={styles.recorte} pointerEvents="box-none">
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
        <View style={styles.topo}>
          <TouchableOpacity
            style={styles.botaoTema}
            onPress={alternarTema}
            accessibilityRole="button"
            accessibilityLabel={modo === "escuro" ? "Ativar modo claro" : "Ativar modo escuro"}
          >
            <Ionicons
              name={modo === "escuro" ? "sunny-outline" : "moon-outline"}
              size={16}
              color={cores.textoSecundario}
            />
            <Text style={styles.botaoTemaTexto}>
              {modo === "escuro" ? "Modo claro" : "Modo escuro"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.botaoFechar}
            onPress={aoFechar}
            accessibilityRole="button"
            accessibilityLabel="Fechar menu"
          >
            <Ionicons name="close" size={18} color={cores.textoSecundario} />
          </TouchableOpacity>
        </View>

        <View style={styles.cabecalhoUsuario}>
          <View style={styles.avatar}>
            <Text style={styles.avatarTexto}>{iniciais}</Text>
          </View>
          <View style={styles.infoUsuario}>
            <Text style={styles.nomeUsuario} numberOfLines={1}>
              {nomeUsuario}
            </Text>
            <Text style={styles.cargoUsuario}>{cargoUsuario}</Text>
            <Text style={styles.emailUsuario} numberOfLines={1}>
              {emailUsuario}
            </Text>
          </View>
        </View>

        <View style={styles.menuLista}>
          <TouchableOpacity
            style={[styles.itemMenu, telaAtiva === "produtos" ? styles.itemMenuAtivo : undefined]}
            onPress={() => {
              aoFechar();
              if (telaAtiva !== "produtos") router.navigate("/");
            }}
            accessibilityRole="button"
            accessibilityLabel="Produtos"
            accessibilityState={{ selected: telaAtiva === "produtos" }}
          >
            <View style={styles.itemMenuConteudo}>
              <Ionicons
                name="cube-outline"
                size={20}
                color={telaAtiva === "produtos" ? cores.primaria : cores.textoSecundario}
              />
              <Text
                style={[
                  styles.itemMenuTexto,
                  telaAtiva === "produtos" ? styles.itemMenuTextoAtivo : undefined,
                ]}
              >
                Produtos
              </Text>
            </View>
            {totalProdutos !== undefined ? (
              <View style={[styles.contadorItem, styles.contadorItemAtivo]}>
                <Text style={[styles.contadorItemTexto, styles.contadorItemTextoAtivo]}>
                  {totalProdutos}
                </Text>
              </View>
            ) : null}
          </TouchableOpacity>

          {aoAbrirCategorias ? (
            <TouchableOpacity
              style={styles.itemMenu}
              onPress={aoAbrirCategorias}
              accessibilityRole="button"
              accessibilityLabel="Categorias"
            >
              <View style={styles.itemMenuConteudo}>
                <Ionicons name="pricetags-outline" size={20} color={cores.textoSecundario} />
                <Text style={styles.itemMenuTexto}>Categorias</Text>
              </View>
              {totalCategorias !== undefined ? (
                <View style={styles.contadorItem}>
                  <Text style={styles.contadorItemTexto}>{totalCategorias}</Text>
                </View>
              ) : null}
            </TouchableOpacity>
          ) : null}

          <TouchableOpacity
            style={[styles.itemMenu, telaAtiva === "vendas" ? styles.itemMenuAtivo : undefined]}
            onPress={() => {
              aoFechar();
              if (telaAtiva !== "vendas") router.navigate("/vendas");
            }}
            accessibilityRole="button"
            accessibilityLabel="Vendas"
            accessibilityState={{ selected: telaAtiva === "vendas" }}
          >
            <View style={styles.itemMenuConteudo}>
              <Ionicons
                name="bag-handle-outline"
                size={20}
                color={telaAtiva === "vendas" ? cores.primaria : cores.textoSecundario}
              />
              <Text
                style={[
                  styles.itemMenuTexto,
                  telaAtiva === "vendas" ? styles.itemMenuTextoAtivo : undefined,
                ]}
              >
                Vendas
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.itemMenu, telaAtiva === "caixa" ? styles.itemMenuAtivo : undefined]}
            onPress={() => {
              aoFechar();
              if (telaAtiva !== "caixa") router.navigate("/caixa");
            }}
            accessibilityRole="button"
            accessibilityLabel="Caixa"
            accessibilityState={{ selected: telaAtiva === "caixa" }}
          >
            <View style={styles.itemMenuConteudo}>
              <Ionicons
                name="cash-outline"
                size={20}
                color={telaAtiva === "caixa" ? cores.primaria : cores.textoSecundario}
              />
              <Text
                style={[
                  styles.itemMenuTexto,
                  telaAtiva === "caixa" ? styles.itemMenuTextoAtivo : undefined,
                ]}
              >
                Caixa
              </Text>
            </View>
            {pedidosPendentes ? (
              <View style={styles.seloPendentes}>
                <Text style={styles.seloPendentesTexto}>{pedidosPendentes}</Text>
              </View>
            ) : null}
          </TouchableOpacity>
        </View>

        <View style={styles.rodape}>
          <TouchableOpacity
            style={styles.botaoSair}
            onPress={aoSair}
            accessibilityRole="button"
            accessibilityLabel="Sair da conta"
          >
            <Ionicons name="log-out-outline" size={18} color={cores.perigo} />
            <Text style={styles.botaoSairTexto}>Sair da conta</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}
