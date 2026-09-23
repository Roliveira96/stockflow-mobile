import { api } from "@/services/api";
import type { Cliente, ClienteCadastrado } from "@/types";
import { extrairDigitos } from "@/utils/moeda";

const LIMITE_SUGESTOES = 6;

function escaparRegex(texto: string) {
  return texto.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function buscarClientes(
  campo: "nome" | "cpf",
  termo: string
): Promise<ClienteCadastrado[]> {
  const valor = campo === "cpf" ? extrairDigitos(termo) : termo.trim();

  if (valor.length === 0 || (campo === "nome" && valor.length < 2)) return [];

  const resposta = await api.get<ClienteCadastrado[]>("/clientes", {
    params: {
      [`${campo}_like`]: campo === "cpf" ? `^${valor}` : escaparRegex(valor),
      _sort: "nome",
      _order: "asc",
      _limit: LIMITE_SUGESTOES,
    },
  });

  return resposta.data;
}

export async function salvarCliente(cliente: Cliente): Promise<void> {
  if (!cliente.cpf) return;

  const existentes = await api.get<ClienteCadastrado[]>("/clientes", {
    params: { cpf: cliente.cpf },
  });
  const existente = existentes.data[0];

  if (!existente) {
    await api.post("/clientes", { ...cliente, criadoEm: new Date().toISOString() });
    return;
  }

  if (existente.nome !== cliente.nome || existente.telefone !== cliente.telefone) {
    await api.patch(`/clientes/${existente.id}`, {
      nome: cliente.nome,
      telefone: cliente.telefone ?? existente.telefone,
    });
  }
}
