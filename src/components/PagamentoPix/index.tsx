import Ionicons from "@expo/vector-icons/Ionicons";
import { useEffect, useMemo, useState } from "react";
import { Alert, Animated, Easing, Linking, Text, View } from "react-native";

import { CustomButton } from "@/components/CustomButton";
import { QrCode } from "@/components/QrCode";
import { LOJA } from "@/constants/loja";
import { useTema } from "@/contexts/TemaContext";
import type { PagamentoPixProps } from "@/types";
import { formatarMoeda } from "@/utils/moeda";
import { gerarPayloadPix } from "@/utils/pix";
import { formatarTelefone } from "@/utils/venda";
import { montarLinkWhatsapp, montarMensagemPix } from "@/utils/whatsapp";

import { criarEstilos } from "./styles";

const TAMANHO_QR = 200;
const DURACAO_GERACAO_MS = 1200;

export function PagamentoPix({ pedido, itensConferidos, gerado, aoGerar }: PagamentoPixProps) {
  const { cores } = useTema();
  const styles = useMemo(() => criarEstilos(cores), [cores]);
  const valor = pedido.total;
  const totalItens = pedido.itens.length;
  const telefoneCliente = pedido.cliente.telefone;
  const payload = useMemo(
    () => gerarPayloadPix(pedido.total, pedido.numero),
    [pedido.total, pedido.numero]
  );

  async function handleEnviarWhatsapp() {
    const link = montarLinkWhatsapp(montarMensagemPix(pedido, payload), telefoneCliente);

    try {
      await Linking.openURL(link);
    } catch {
      Alert.alert("WhatsApp", "Não foi possível abrir o WhatsApp neste dispositivo.");
    }
  }
  const [gerando, setGerando] = useState(false);
  const [pulso] = useState(() => new Animated.Value(1));
  const [entrada] = useState(() => new Animated.Value(0));
  const conferenciaCompleta = totalItens > 0 && itensConferidos === totalItens;

  useEffect(() => {
    if (!gerando) return;

    const animacao = Animated.loop(
      Animated.sequence([
        Animated.timing(pulso, {
          toValue: 1.15,
          duration: 300,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(pulso, {
          toValue: 1,
          duration: 300,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    );
    animacao.start();

    const temporizador = setTimeout(() => {
      setGerando(false);
      aoGerar();
    }, DURACAO_GERACAO_MS);

    return () => {
      animacao.stop();
      clearTimeout(temporizador);
    };
  }, [gerando, pulso, aoGerar]);

  useEffect(() => {
    if (!gerado) {
      entrada.setValue(0);
      return;
    }

    Animated.spring(entrada, {
      toValue: 1,
      friction: 6,
      tension: 60,
      useNativeDriver: true,
    }).start();
  }, [gerado, entrada]);

  const escalaEntrada = entrada.interpolate({ inputRange: [0, 1], outputRange: [0.85, 1] });

  return (
    <View style={styles.cartao}>
      <View style={styles.cabecalho}>
        <Text style={styles.icone}>⚡</Text>
        <View style={styles.flex}>
          <Text style={styles.titulo}>Pagamento via PIX</Text>
          <Text style={styles.subtitulo}>
            {gerado
              ? "Mostre o QR Code para o cliente escanear"
              : "Confira os itens antes de gerar a cobrança"}
          </Text>
        </View>
        <Text style={styles.valorCabecalho}>{formatarMoeda(valor)}</Text>
      </View>

      {!gerado && !gerando ? (
        <>
          <View style={styles.conferencia}>
            <Ionicons
              name={conferenciaCompleta ? "checkmark-circle" : "list-outline"}
              size={18}
              color={conferenciaCompleta ? cores.sucesso : cores.alerta}
            />
            <Text
              style={[
                styles.conferenciaTexto,
                conferenciaCompleta ? styles.conferenciaTextoOk : undefined,
              ]}
            >
              {conferenciaCompleta
                ? "Todos os itens conferidos"
                : `Confira os itens: ${itensConferidos} de ${totalItens}`}
            </Text>
          </View>
          <CustomButton
            titulo="Gerar pagamento PIX"
            onPress={() => setGerando(true)}
            desabilitado={!conferenciaCompleta}
            icone="qr-code-outline"
            variante="sucesso"
            compacto
          />
        </>
      ) : null}

      {gerando ? (
        <View style={styles.gerando} accessibilityLiveRegion="polite">
          <Animated.View style={[styles.gerandoIcone, { transform: [{ scale: pulso }] }]}>
            <Ionicons name="qr-code" size={44} color={cores.sucesso} />
          </Animated.View>
          <Text style={styles.gerandoTexto}>Gerando cobrança PIX…</Text>
        </View>
      ) : null}

      {gerado ? (
        <Animated.View
          style={[styles.resultado, { opacity: entrada, transform: [{ scale: escalaEntrada }] }]}
        >
          <View style={styles.moldura}>
            <QrCode valor={payload} tamanho={TAMANHO_QR} />
          </View>

          <Text style={styles.valor}>{formatarMoeda(valor)}</Text>
          <Text style={styles.recebedor}>
            {LOJA.nomeFantasia} · chave {LOJA.chavePix}
          </Text>

          <View style={styles.copiaECola}>
            <Text style={styles.copiaEColaRotulo}>PIX copia e cola</Text>
            <Text style={styles.copiaEColaTexto} selectable>
              {payload}
            </Text>
          </View>

          <CustomButton
            titulo="Enviar no WhatsApp"
            onPress={handleEnviarWhatsapp}
            icone="logo-whatsapp"
            variante="sucesso"
            compacto
            estiloContainer={styles.botaoWhatsapp}
          />
          <Text style={styles.recebedor}>
            {telefoneCliente
              ? `Para ${pedido.cliente.nome.split(" ")[0]} · ${formatarTelefone(telefoneCliente)}`
              : "Cliente sem telefone: o WhatsApp abre para escolher o contato"}
          </Text>

          <View style={styles.aviso}>
            <Ionicons name="information-circle-outline" size={15} color={cores.alerta} />
            <Text style={styles.avisoTexto}>
              QR Code fictício para demonstração: nenhum valor é cobrado. Confirme o recebimento
              manualmente.
            </Text>
          </View>
        </Animated.View>
      ) : null}
    </View>
  );
}
