import { useEffect, useState } from "react";
import { Switch, Text, View } from "react-native";

import { CustomButton } from "@/components/CustomButton";
import { CustomInput } from "@/components/CustomInput";
import type { ProdutoFormProps } from "@/types";
import { extrairDigitos, formatarCentavosComoTexto } from "@/utils/moeda";

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
  const [precoCentavos, setPrecoCentavos] = useState(
    valoresIniciais ? Math.round(valoresIniciais.preco * 100) : 0
  );
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

  const textoPreco = formatarCentavosComoTexto(precoCentavos);
  const [selecaoPreco, setSelecaoPreco] = useState({
    start: textoPreco.length,
    end: textoPreco.length,
  });

  function moverCursorParaFinal(texto: string) {
    setSelecaoPreco({ start: texto.length, end: texto.length });
  }

  function handlePrecoChange(texto: string) {
    const digitos = extrairDigitos(texto);
    const novoValor = digitos ? Number(digitos) : 0;
    setPrecoCentavos(novoValor);
    moverCursorParaFinal(formatarCentavosComoTexto(novoValor));
  }

  const formularioValido =
    nome.trim().length >= 3 &&
    !erroNome &&
    extrairDigitos(codigoBarras).length >= 8 &&
    !erroCodigoBarras &&
    quantidade.trim().length > 0 &&
    !erroQuantidade &&
    precoCentavos > 0;

  function handleEnviar() {
    aoEnviar({
      nome: nome.trim(),
      codigoBarras: extrairDigitos(codigoBarras),
      quantidade: Number(quantidade),
      preco: precoCentavos / 100,
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
        value={textoPreco}
        onChangeText={handlePrecoChange}
        keyboardType="numeric"
        selection={selecaoPreco}
        onSelectionChange={() => moverCursorParaFinal(textoPreco)}
        onFocus={() => moverCursorParaFinal(textoPreco)}
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
        <Switch value={ativo} onValueChange={setAtivo} />
      </View>

      <CustomButton
        titulo={textoBotao}
        onPress={handleEnviar}
        carregando={enviando}
        desabilitado={!formularioValido}
      />
    </View>
  );
}
