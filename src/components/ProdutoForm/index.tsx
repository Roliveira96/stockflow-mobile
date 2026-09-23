import Ionicons from "@expo/vector-icons/Ionicons";
import { useEffect, useMemo, useState } from "react";
import { Switch, Text, TouchableOpacity, View } from "react-native";

import { CustomButton } from "@/components/CustomButton";
import { CustomInput } from "@/components/CustomInput";
import { ModalCategoria } from "@/components/ModalCategoria";
import { useTema } from "@/contexts/TemaContext";
import { useCampoMoeda } from "@/hooks/useCampoMoeda";
import { listarCategorias } from "@/services/categorias";
import type { Categoria, ProdutoFormProps } from "@/types";
import { calcularMargem, MARGEM_ALVO_PADRAO } from "@/utils/lote";
import { extrairDigitos } from "@/utils/moeda";

import { criarEstilos } from "./styles";

const LIMITE_NOME = 80;
const LIMITE_DESCRICAO = 1000;
const LIMITE_CODIGO_AUXILIAR = 30;

function gerarCodigoBarras() {
  const aleatorio = Math.floor(Math.random() * 10_000_000_000)
    .toString()
    .padStart(10, "0");
  return `789${aleatorio}`;
}

export function ProdutoForm({ valoresIniciais, enviando, textoBotao, aoEnviar }: ProdutoFormProps) {
  const { cores } = useTema();
  const styles = useMemo(() => criarEstilos(cores), [cores]);

  const [nome, setNome] = useState(valoresIniciais?.nome ?? "");
  const [codigoBarras, setCodigoBarras] = useState(valoresIniciais?.codigoBarras ?? "");
  const [codigoAuxiliar, setCodigoAuxiliar] = useState(valoresIniciais?.codigoAuxiliar ?? "");
  const [quantidade, setQuantidade] = useState(
    valoresIniciais ? String(valoresIniciais.quantidade) : ""
  );
  const campoPreco = useCampoMoeda(valoresIniciais?.preco ?? 0);
  const campoCusto = useCampoMoeda(valoresIniciais?.precoCusto ?? 0);
  const [descricao, setDescricao] = useState(valoresIniciais?.descricao ?? "");
  const [ativo, setAtivo] = useState(valoresIniciais?.ativo ?? true);

  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriaNome, setCategoriaNome] = useState(valoresIniciais?.categoria ?? "");
  const [categoriaIcone, setCategoriaIcone] = useState(valoresIniciais?.categoriaIcone ?? "📦");
  const [seletorCategoriaAberto, setSeletorCategoriaAberto] = useState(false);
  const [modalCategoriaVisivel, setModalCategoriaVisivel] = useState(false);

  const [erroNome, setErroNome] = useState("");
  const [erroCodigoBarras, setErroCodigoBarras] = useState("");
  const [erroQuantidade, setErroQuantidade] = useState("");
  const [erroPreco, setErroPreco] = useState("");
  const [precoModificado, setPrecoModificado] = useState(false);

  useEffect(() => {
    async function carregarCategorias() {
      try {
        const resultado = await listarCategorias();
        setCategorias(resultado);
      } catch {
        setCategorias([]);
      }
    }

    carregarCategorias();
  }, []);

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

  const permiteQuantidadeNegativa = valoresIniciais !== undefined;

  useEffect(() => {
    const valor = Number(quantidade);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setErroQuantidade(
      quantidade.length > 0 && Number.isNaN(valor)
        ? "Informe um número válido."
        : quantidade.length > 0 && valor < 0 && !permiteQuantidadeNegativa
          ? "A quantidade não pode ser negativa."
          : ""
    );
  }, [quantidade, permiteQuantidadeNegativa]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setErroPreco(
      precoModificado && campoPreco.centavos <= 0
        ? "O preço deve ser maior que zero."
        : ""
    );
  }, [campoPreco.centavos, precoModificado]);

  const formularioValido =
    nome.trim().length >= 3 &&
    !erroNome &&
    extrairDigitos(codigoBarras).length >= 8 &&
    !erroCodigoBarras &&
    quantidade.trim().length > 0 &&
    !erroQuantidade &&
    campoPreco.centavos > 0 &&
    !erroPreco &&
    campoCusto.centavos > 0;

  const margemEstimada =
    campoPreco.centavos > 0 ? calcularMargem(campoPreco.valor, campoCusto.valor) : null;
  const estiloMargem =
    margemEstimada === null || margemEstimada < 0
      ? styles.margemValorPerigo
      : margemEstimada < MARGEM_ALVO_PADRAO
        ? styles.margemValorAlerta
        : styles.margemValorSucesso;

  function handleSelecionarCategoria(categoria: Categoria) {
    setCategoriaNome(categoria.nome);
    setCategoriaIcone(categoria.icone);
    setSeletorCategoriaAberto(false);
  }

  function handleCategoriaCriada(categoria: Categoria) {
    setCategorias((atual) => [...atual, categoria]);
    setCategoriaNome(categoria.nome);
    setCategoriaIcone(categoria.icone);
  }

  function handleEnviar() {
    aoEnviar({
      nome: nome.trim(),
      codigoBarras: extrairDigitos(codigoBarras),
      codigoAuxiliar: codigoAuxiliar.trim() || undefined,
      quantidade: Number(quantidade),
      preco: campoPreco.valor,
      precoCusto: campoCusto.valor,
      descricao: descricao.trim() || undefined,
      categoria: categoriaNome || undefined,
      categoriaIcone: categoriaNome ? categoriaIcone : undefined,
      ativo,
    });
  }

  return (
    <View>
      <View style={styles.secao}>
        <Text style={styles.secaoTitulo}>Identificação</Text>
        <CustomInput
          label="Nome do produto"
          obrigatorio
          contador={`${nome.length}/${LIMITE_NOME}`}
          maxLength={LIMITE_NOME}
          value={nome}
          onChangeText={setNome}
          erro={erroNome}
          placeholder="Ex: Mouse gamer sem fio 16000 DPI"
        />

        <View style={styles.linhaLabel}>
          <Text style={styles.label}>Categoria</Text>
          <TouchableOpacity
            style={styles.botaoLink}
            onPress={() => setModalCategoriaVisivel(true)}
            accessibilityRole="button"
            accessibilityLabel="Criar nova categoria"
            hitSlop={{ top: 8, bottom: 8 }}
          >
            <Ionicons name="add" size={15} color={cores.primaria} />
            <Text style={styles.botaoLinkTexto}>Nova categoria</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={[
            styles.campoCategoria,
            seletorCategoriaAberto ? styles.campoCategoriaAberto : undefined,
          ]}
          onPress={() => setSeletorCategoriaAberto((atual) => !atual)}
          accessibilityRole="button"
          accessibilityLabel={`Categoria: ${categoriaNome || "nenhuma"}`}
        >
          <Text
            style={[
              styles.campoCategoriaTexto,
              categoriaNome ? undefined : styles.campoCategoriaPlaceholder,
            ]}
            numberOfLines={1}
          >
            {categoriaNome ? `${categoriaIcone}  ${categoriaNome}` : "Selecionar categoria"}
          </Text>
          <Ionicons
            name={seletorCategoriaAberto ? "chevron-up" : "chevron-down"}
            size={16}
            color={cores.textoTerciario}
          />
        </TouchableOpacity>

        {seletorCategoriaAberto ? (
          <View style={styles.seletorCategoriaPainel}>
            {categorias.length === 0 ? (
              <Text style={styles.seletorCategoriaVazio}>Nenhuma categoria cadastrada ainda.</Text>
            ) : (
              categorias.map((categoria) => {
                const selecionada = categoria.nome === categoriaNome;

                return (
                  <TouchableOpacity
                    key={categoria.id}
                    style={[
                      styles.seletorCategoriaOpcao,
                      selecionada ? styles.seletorCategoriaOpcaoSelecionada : undefined,
                    ]}
                    onPress={() => handleSelecionarCategoria(categoria)}
                    accessibilityRole="button"
                    accessibilityLabel={`Selecionar categoria ${categoria.nome}`}
                    accessibilityState={{ selected: selecionada }}
                  >
                    <Text
                      style={[
                        styles.seletorCategoriaOpcaoTexto,
                        selecionada ? styles.seletorCategoriaOpcaoTextoSelecionada : undefined,
                      ]}
                    >
                      {categoria.icone} {categoria.nome}
                    </Text>
                    {selecionada ? (
                      <Ionicons name="checkmark" size={16} color={cores.primaria} />
                    ) : null}
                  </TouchableOpacity>
                );
              })
            )}
          </View>
        ) : null}

        <View style={styles.linhaComBotao}>
          <View style={styles.flex}>
            <CustomInput
              label="Código de barras (EAN)"
              obrigatorio
              value={codigoBarras}
              onChangeText={setCodigoBarras}
              erro={erroCodigoBarras}
              keyboardType="numeric"
              placeholder="Entre 8 e 13 dígitos"
              monoespacado
            />
          </View>
          <TouchableOpacity
            style={styles.botaoGerar}
            onPress={() => setCodigoBarras(gerarCodigoBarras())}
            accessibilityRole="button"
            accessibilityLabel="Gerar código de barras"
          >
            <Text style={styles.botaoGerarTexto}>Gerar</Text>
          </TouchableOpacity>
        </View>

        <CustomInput
          label="Código auxiliar (opcional)"
          contador={`${codigoAuxiliar.length}/${LIMITE_CODIGO_AUXILIAR}`}
          maxLength={LIMITE_CODIGO_AUXILIAR}
          value={codigoAuxiliar}
          onChangeText={setCodigoAuxiliar}
          placeholder="Ex: código do catálogo do fornecedor"
          autoCapitalize="characters"
          autoCorrect={false}
          monoespacado
        />
      </View>

      <View style={styles.secao}>
        <Text style={styles.secaoTitulo}>Preço e estoque</Text>
        <View style={styles.linhaDupla}>
          <View style={styles.flex}>
            <CustomInput
              label="Preço de venda (R$)"
              obrigatorio
              value={campoPreco.texto}
              onChangeText={(texto) => {
                setPrecoModificado(true);
                campoPreco.aoMudarTexto(texto);
              }}
              erro={erroPreco}
              keyboardType="numeric"
              selection={campoPreco.selecao}
              onSelectionChange={campoPreco.aoFocar}
              onFocus={campoPreco.aoFocar}
              onBlur={() => setPrecoModificado(true)}
              monoespacado
            />
          </View>
          <View style={styles.flex}>
            <CustomInput
              label="Preço de custo (R$)"
              obrigatorio
              value={campoCusto.texto}
              onChangeText={campoCusto.aoMudarTexto}
              keyboardType="numeric"
              selection={campoCusto.selecao}
              onSelectionChange={campoCusto.aoFocar}
              onFocus={campoCusto.aoFocar}
              monoespacado
            />
          </View>
        </View>

        <View style={styles.margemCaixa}>
          <View style={styles.flex}>
            <Text style={styles.margemRotulo}>Margem estimada</Text>
            {margemEstimada !== null && margemEstimada < 0 ? (
              <Text style={styles.margemDica}>Preço de venda abaixo do custo</Text>
            ) : (
              <Text style={styles.margemDica}>Alvo: {MARGEM_ALVO_PADRAO.toFixed(1)}%</Text>
            )}
          </View>
          <Text style={[styles.margemValor, estiloMargem]}>
            {margemEstimada !== null ? `${margemEstimada.toFixed(1)}%` : "—"}
          </Text>
        </View>

        <CustomInput
          label={valoresIniciais ? "Quantidade" : "Quantidade inicial"}
          obrigatorio
          value={quantidade}
          onChangeText={setQuantidade}
          erro={erroQuantidade}
          keyboardType={permiteQuantidadeNegativa ? "numbers-and-punctuation" : "numeric"}
          placeholder="0"
          monoespacado
        />
        {!valoresIniciais && Number(quantidade) > 0 ? (
          <Text style={styles.dicaLoteInicial}>
            Um lote inicial com {quantidade} un. ao custo informado será registrado automaticamente.
          </Text>
        ) : null}
      </View>

      <View style={styles.secao}>
        <Text style={styles.secaoTitulo}>Detalhes</Text>
        <CustomInput
          label="Descrição detalhada (opcional)"
          contador={`${descricao.length} / ${LIMITE_DESCRICAO}`}
          maxLength={LIMITE_DESCRICAO}
          value={descricao}
          onChangeText={setDescricao}
          placeholder="Especificações técnicas, compatibilidade, conteúdo da caixa, garantia..."
          multiline
        />

        <View style={styles.linhaSwitch}>
          <View style={styles.flex}>
            <Text style={styles.rotuloSwitch}>Ativo para venda</Text>
            <Text style={styles.dicaSwitch}>Produtos inativos não aparecem como disponíveis</Text>
          </View>
          <Switch
            value={ativo}
            onValueChange={setAtivo}
            trackColor={{ true: cores.botaoPrimario, false: cores.neutroFundoForte }}
            thumbColor={cores.superficie}
            accessibilityLabel="Ativo para venda"
            accessibilityRole="switch"
          />
        </View>
      </View>

      <CustomButton
        titulo={textoBotao}
        onPress={handleEnviar}
        carregando={enviando}
        desabilitado={!formularioValido}
        icone="checkmark"
      />

      <ModalCategoria
        visivel={modalCategoriaVisivel}
        aoFechar={() => setModalCategoriaVisivel(false)}
        aoCriar={handleCategoriaCriada}
      />
    </View>
  );
}
