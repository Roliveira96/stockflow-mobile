import Ionicons from "@expo/vector-icons/Ionicons";
import { useMemo, useState } from "react";
import { Alert, Modal, Pressable, Text, TouchableOpacity, View } from "react-native";

import { CustomButton } from "@/components/CustomButton";
import { CustomInput } from "@/components/CustomInput";
import { useTema } from "@/contexts/TemaContext";
import { criarCategoria } from "@/services/categorias";
import type { ModalCategoriaProps } from "@/types";

import { criarEstilos } from "./styles";

const ICONES_RAPIDOS = ["📦", "⌨️", "🔌", "⚡", "🎧", "🖥️", "🖱️", "💨"];

export function ModalCategoria({ visivel, aoFechar, aoCriar }: ModalCategoriaProps) {
  const { cores } = useTema();
  const styles = useMemo(() => criarEstilos(cores), [cores]);
  const [nome, setNome] = useState("");
  const [icone, setIcone] = useState("📦");
  const [descricao, setDescricao] = useState("");
  const [enviando, setEnviando] = useState(false);

  function handleFechar() {
    setNome("");
    setIcone("📦");
    setDescricao("");
    aoFechar();
  }

  async function handleSalvar() {
    if (nome.trim().length === 0) {
      Alert.alert("Nome obrigatório", "Informe o nome da categoria.");
      return;
    }

    setEnviando(true);

    try {
      const categoria = await criarCategoria({
        nome: nome.trim(),
        icone: icone.trim() || "📦",
        descricao: descricao.trim() || undefined,
      });

      aoCriar(categoria);
      handleFechar();
    } catch {
      Alert.alert("Erro de conexão", "Não foi possível salvar a categoria.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <Modal visible={visivel} transparent animationType="fade" onRequestClose={handleFechar}>
      <View style={styles.overlay}>
        <Pressable
          style={styles.overlayPressable}
          onPress={handleFechar}
          accessibilityRole="button"
          accessibilityLabel="Fechar"
        />

        <View style={styles.painel}>
          <View style={styles.cabecalho}>
            <View style={styles.cabecalhoTextos}>
              <View style={styles.cabecalhoIcone}>
                <Ionicons name="pricetag-outline" size={16} color={cores.primaria} />
              </View>
              <View>
                <Text style={styles.titulo}>Nova categoria</Text>
                <Text style={styles.subtitulo}>Classificação para produtos e estoque</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.botaoFechar}
              onPress={handleFechar}
              accessibilityRole="button"
              accessibilityLabel="Fechar"
            >
              <Ionicons name="close" size={16} color={cores.textoSecundario} />
            </TouchableOpacity>
          </View>

          <CustomInput
            label="Nome da categoria"
            obrigatorio
            value={nome}
            onChangeText={setNome}
            placeholder="Ex: Hardware, Áudio & Vídeo..."
          />

          <View style={styles.linhaIcone}>
            <View style={styles.campoIcone}>
              <CustomInput label="Ícone" value={icone} onChangeText={setIcone} maxLength={2} />
            </View>
            <View style={styles.opcoesIcone}>
              {ICONES_RAPIDOS.map((emoji) => (
                <TouchableOpacity
                  key={emoji}
                  style={[styles.opcaoIcone, icone === emoji ? styles.opcaoIconeSelecionada : undefined]}
                  onPress={() => setIcone(emoji)}
                  accessibilityRole="button"
                  accessibilityLabel={`Usar ícone ${emoji}`}
                >
                  <Text style={styles.opcaoIconeTexto}>{emoji}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <CustomInput
            label="Descrição (opcional)"
            value={descricao}
            onChangeText={setDescricao}
            placeholder="Observações da categoria"
          />

          <View style={styles.acoes}>
            <CustomButton
              titulo="Cancelar"
              onPress={handleFechar}
              variante="neutro"
              compacto
              estiloContainer={styles.botaoAcao}
            />
            <CustomButton
              titulo="Salvar categoria"
              onPress={handleSalvar}
              carregando={enviando}
              compacto
              estiloContainer={styles.botaoAcaoPrincipal}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}
