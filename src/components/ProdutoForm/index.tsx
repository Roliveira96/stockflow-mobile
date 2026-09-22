import { useEffect, useState } from "react";
import { Switch, Text, View } from "react-native";

import { CustomButton } from "@/components/CustomButton";
import { CustomInput } from "@/components/CustomInput";
import { cores } from "@/constants/theme";
import { useCampoMoeda } from "@/hooks/useCampoMoeda";
import type { ProdutoFormProps } from "@/types";
import { extrairDigitos } from "@/utils/moeda";

import { styles } from "./styles";

export function ProdutoForm({
  valoresIniciais,
  enviando,
  textoBotao,
  aoEnviar,
}: ProdutoFormProps) {
  const [nome, setNome] = useState(valoresIniciais?.nome ?? "");
  const [codigoBarras, setCodigoBarras] = useState(valoresIniciais?.codigoBarras ?? "");
  const [quantidade, setQuantidade] = useState(
    valoresIniciais ? String(valoresIniciais.quantidade) : ""
  );
  const campoPreco = useCampoMoeda(valoresIniciais?.preco ?? 0);
  const [descricao, setDescricao] = useState(valoresIniciais?.descricao ?? "");
  const [ativo, setAtivo] = useState(valoresIniciais?.ativo ?? true);

  const [erroNome, setErroNome] = useState("");
  const [erroCodigoBarras, setErroCodigoBarras] = useState("");
  const [erroQuantidade, setErroQuantidade] = useState("");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setErroNome(
      nome.length > 0 && nome.trim().length < 3 ? "O nome deve ter ao menos 3 caracteres." : ""
    );
  }, [nome]);

  useEffect(() => {
    const digitos = extrairDigitos(codigoBarras);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setErroCodigoBarras(
      digitos.length > 0 && (digitos.length < 8 || digitos.length > 13)
        ? "O código de barras deve ter entre 8 e 13 dígitos."
        : ""
    );
  }, [codigoBarras]);

  useEffect(() => {
    const valor = Number(quantidade);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setErroQuantidade(
      quantidade.length > 0 && (Number.isNaN(valor) || valor < 0)
        ? "A quantidade não pode ser negativa."
        : ""
    );
  }, [quantidade]);

  const formularioValido =
    nome.trim().length >= 3 &&
    !erroNome &&
    extrairDigitos(codigoBarras).length >= 8 &&
    !erroCodigoBarras &&
    quantidade.trim().length > 0 &&
    !erroQuantidade &&
    campoPreco.centavos > 0;

  function handleEnviar() {
    aoEnviar({
      nome: nome.trim(),
      codigoBarras: extrairDigitos(codigoBarras),
      quantidade: Number(quantidade),
      preco: campoPreco.valor,
      descricao: descricao.trim() || undefined,
      ativo,
    });
  }

  return (
    <View>
      <CustomInput
        label="Nome"
        value={nome}
        onChangeText={setNome}
        erro={erroNome}
        placeholder="Nome do produto"
      />
      <CustomInput
        label="Código de barras"
        value={codigoBarras}
        onChangeText={setCodigoBarras}
        erro={erroCodigoBarras}
        keyboardType="numeric"
        placeholder="Entre 8 e 13 dígitos"
      />
      <CustomInput
        label="Quantidade"
        value={quantidade}
        onChangeText={setQuantidade}
        erro={erroQuantidade}
        keyboardType="numeric"
        placeholder="0"
      />
      <CustomInput
        label="Preço"
        value={campoPreco.texto}
        onChangeText={campoPreco.aoMudarTexto}
        keyboardType="numeric"
        selection={campoPreco.selecao}
        onSelectionChange={campoPreco.aoFocar}
        onFocus={campoPreco.aoFocar}
      />
      <CustomInput
        label="Descrição (opcional)"
        value={descricao}
        onChangeText={setDescricao}
        placeholder="Detalhes do produto"
        multiline
      />

      <View style={styles.linhaSwitch}>
        <Text style={styles.rotuloSwitch}>Ativo para venda</Text>
        <Switch
          value={ativo}
          onValueChange={setAtivo}
          trackColor={{ true: cores.primaria }}
          accessibilityLabel="Ativo para venda"
          accessibilityRole="switch"
        />
      </View>

      <CustomButton
        titulo={textoBotao}
        onPress={handleEnviar}
        carregando={enviando}
        desabilitado={!formularioValido}
        icone="save-outline"
      />
    </View>
  );
}
