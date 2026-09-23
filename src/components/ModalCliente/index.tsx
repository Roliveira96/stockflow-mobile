import { FolhaInferior } from "@/components/FolhaInferior";
import { FormularioCliente } from "@/components/FormularioCliente";
import type { ModalClienteProps } from "@/types";

export function ModalCliente({ visivel, clienteAtual, aoFechar, aoConfirmar }: ModalClienteProps) {
  return (
    <FolhaInferior
      visivel={visivel}
      aoFechar={aoFechar}
      titulo="Identificar comprador"
      subtitulo="Totalmente opcional na venda"
      icone="person-outline"
    >
      <FormularioCliente
        clienteAtual={clienteAtual}
        aoConfirmar={aoConfirmar}
        aoCancelar={aoFechar}
      />
    </FolhaInferior>
  );
}
