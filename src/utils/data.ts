const formatadorData = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "short",
});

const formatadorDataCurta = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
});

export function formatarData(iso: string): string {
  return formatadorData.format(new Date(iso));
}

export function formatarDataCurta(iso: string): string {
  return formatadorDataCurta.format(new Date(`${iso}T00:00:00`));
}
