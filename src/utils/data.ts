const formatadorData = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "short",
});

export function formatarData(iso: string): string {
  return formatadorData.format(new Date(iso));
}
