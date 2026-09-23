import Ionicons from "@expo/vector-icons/Ionicons";
import { useEffect, useMemo, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

import { CustomButton } from "@/components/CustomButton";
import { CustomInput } from "@/components/CustomInput";
import { FolhaInferior } from "@/components/FolhaInferior";
import { useTema } from "@/contexts/TemaContext";
import { buscarClientes } from "@/services/clientes";
import type { ClienteCadastrado, ModalClienteProps, SugestoesClienteProps } from "@/types";
import { extrairDigitos } from "@/utils/moeda";
import { formatarCpf, formatarTelefone, validarCpf, validarTelefone } from "@/utils/venda";

import { criarEstilos } from "./styles";

type CampoBusca = "nome" | "cpf";

function SugestoesCliente({ sugestoes, aoSelecionar }: SugestoesClienteProps) {
  const { cores } = useTema();
  const styles = useMemo(() => criarEstilos(cores), [cores]);

  if (sugestoes.length === 0) return null;

  return (
    <View style={styles.sugestoes}>
      <Text style={styles.sugestoesTitulo}>Clientes cadastrados</Text>
      {sugestoes.map((cliente) => (
        <TouchableOpacity
          key={cliente.id}
          style={styles.sugestao}
          onPress={() => aoSelecionar(cliente)}
          accessibilityRole="button"
          accessibilityLabel={`Selecionar ${cliente.nome}, CPF ${formatarCpf(cliente.cpf)}`}
        >
          <View style={styles.sugestaoIcone}>
            <Ionicons name="person" size={14} color={cores.primaria} />
          </View>
          <View style={styles.flex}>
            <Text style={styles.sugestaoNome} numberOfLines={1}>
              {cliente.nome}
            </Text>
            <Text style={styles.sugestaoDetalhe} numberOfLines={1}>
              {formatarCpf(cliente.cpf)}
              {cliente.telefone ? ` · ${formatarTelefone(cliente.telefone)}` : ""}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color={cores.textoTerciario} />
        </TouchableOpacity>
      ))}
    </View>
  );
}

export function ModalCliente({ visivel, clienteAtual, aoFechar, aoConfirmar }: ModalClienteProps) {
  const { cores } = useTema();
  const styles = useMemo(() => criarEstilos(cores), [cores]);
  const [nome, setNome] = useState(clienteAtual?.nome ?? "");
  const [cpf, setCpf] = useState(clienteAtual?.cpf ? formatarCpf(clienteAtual.cpf) : "");
  const [telefone, setTelefone] = useState(
    clienteAtual?.telefone ? formatarTelefone(clienteAtual.telefone) : ""
  );
  const [campoBusca, setCampoBusca] = useState<CampoBusca | null>(null);
  const [sugestoes, setSugestoes] = useState<ClienteCadastrado[]>([]);

  const termoBusca = campoBusca === "cpf" ? cpf : campoBusca === "nome" ? nome : "";

  useEffect(() => {
    if (!campoBusca) return;

    let ativo = true;
    const temporizador = setTimeout(async () => {
      try {
        const resultado = await buscarClientes(campoBusca, termoBusca);
        if (ativo) setSugestoes(resultado);
      } catch {
        if (ativo) setSugestoes([]);
      }
    }, 250);

    return () => {
      ativo = false;
      clearTimeout(temporizador);
    };
  }, [campoBusca, termoBusca]);

  const digitosCpf = extrairDigitos(cpf);
  const digitosTelefone = extrairDigitos(telefone);
  const erroCpf =
    digitosCpf.length > 0 && (digitosCpf.length !== 11 || !validarCpf(cpf))
      ? digitosCpf.length === 11
        ? "CPF inválido. Confira os dígitos."
        : "O CPF deve ter 11 dígitos."
      : "";
  const erroTelefone =
    digitosTelefone.length > 0 && !validarTelefone(telefone)
      ? "Informe DDD + número (10 ou 11 dígitos)."
      : "";
  const podeVincular =
    (nome.trim().length > 0 || digitosCpf.length > 0) && !erroCpf && !erroTelefone;

  function handleSelecionarSugestao(cliente: ClienteCadastrado) {
    setNome(cliente.nome);
    setCpf(formatarCpf(cliente.cpf));
    setTelefone(cliente.telefone ? formatarTelefone(cliente.telefone) : "");
    setCampoBusca(null);
    setSugestoes([]);
  }

  function handleMudarNome(texto: string) {
    setNome(texto);
    setCampoBusca("nome");
  }

  function handleMudarCpf(texto: string) {
    setCpf(formatarCpf(texto));
    setCampoBusca("cpf");
  }

  function handleVincular() {
    aoConfirmar({
      nome: nome.trim() || "Cliente com CPF",
      cpf: digitosCpf || undefined,
      telefone: digitosTelefone || undefined,
    });
  }

  return (
    <FolhaInferior
      visivel={visivel}
      aoFechar={aoFechar}
      titulo="Identificar comprador"
      subtitulo="Totalmente opcional na venda"
      icone="person-outline"
      rodape={
        <>
          <CustomButton
            titulo="Cancelar"
            onPress={aoFechar}
            variante="neutro"
            compacto
            estiloContainer={styles.botaoSecundario}
          />
          <CustomButton
            titulo="Vincular ao pedido"
            onPress={handleVincular}
            desabilitado={!podeVincular}
            compacto
            estiloContainer={styles.botaoPrincipal}
          />
        </>
      }
    >
      <TouchableOpacity
        style={styles.opcaoAnonimo}
        onPress={() => aoConfirmar(null)}
        accessibilityRole="button"
        accessibilityLabel="Usar consumidor não identificado"
      >
        <View style={styles.flex}>
          <Text style={styles.opcaoAnonimoTitulo}>Consumidor não identificado</Text>
          <Text style={styles.opcaoAnonimoTexto}>Venda rápida sem necessidade de cadastro</Text>
        </View>
        <Text style={styles.opcaoAnonimoAcao}>Usar</Text>
      </TouchableOpacity>

      <View style={styles.divisor}>
        <View style={styles.divisorLinha} />
        <Text style={styles.divisorTexto}>Ou preencher dados</Text>
        <View style={styles.divisorLinha} />
      </View>

      <View>
        <CustomInput
          label="CPF na nota (opcional)"
          value={cpf}
          onChangeText={handleMudarCpf}
          erro={erroCpf}
          placeholder="000.000.000-00"
          keyboardType="numeric"
          maxLength={14}
          monoespacado
        />
        {campoBusca === "cpf" ? (
          <SugestoesCliente sugestoes={sugestoes} aoSelecionar={handleSelecionarSugestao} />
        ) : null}

        <CustomInput
          label="Nome do cliente"
          value={nome}
          onChangeText={handleMudarNome}
          placeholder="Ex: Carlos Oliveira"
          autoCapitalize="words"
        />
        {campoBusca === "nome" ? (
          <SugestoesCliente sugestoes={sugestoes} aoSelecionar={handleSelecionarSugestao} />
        ) : null}

        <CustomInput
          label="Telefone (opcional)"
          value={telefone}
          onChangeText={(texto) => setTelefone(formatarTelefone(texto))}
          erro={erroTelefone}
          placeholder="(00) 00000-0000"
          keyboardType="phone-pad"
          maxLength={15}
          monoespacado
        />
      </View>
    </FolhaInferior>
  );
}
