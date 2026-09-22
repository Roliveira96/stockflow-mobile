import { useState } from "react";

import { extrairDigitos, formatarCentavosComoTexto } from "@/utils/moeda";

export function useCampoMoeda(valorInicial = 0) {
  const [centavos, setCentavos] = useState(Math.round(valorInicial * 100));
  const texto = formatarCentavosComoTexto(centavos);
  const [selecao, setSelecao] = useState({ start: texto.length, end: texto.length });

  function moverCursorParaFinal(textoAtual: string) {
    setSelecao({ start: textoAtual.length, end: textoAtual.length });
  }

  function aoMudarTexto(novoTexto: string) {
    const digitos = extrairDigitos(novoTexto);
    const novoValor = digitos ? Number(digitos) : 0;
    setCentavos(novoValor);
    moverCursorParaFinal(formatarCentavosComoTexto(novoValor));
  }

  function aoFocar() {
    moverCursorParaFinal(texto);
  }

  return {
    valor: centavos / 100,
    centavos,
    texto,
    selecao,
    aoMudarTexto,
    aoFocar,
  };
}
