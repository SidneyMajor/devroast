interface LeaderboardErrorProps {
  title?: string;
  message?: string;
}

export function LeaderboardError({
  title = "// lista temporariamente indisponivel",
  message = "aguarde alguns segundos e atualize a pagina",
}: LeaderboardErrorProps) {
  return (
    <div className="flex items-center justify-center rounded-md border border-[#2A2A2A] bg-[#0A0A0A] py-12">
      <div className="flex flex-col items-center gap-2 text-center">
        <span className="font-mono text-sm text-[#F59E0B]">{title}</span>
        <span className="font-mono text-xs text-[#6B7280]">{message}</span>
      </div>
    </div>
  );
}
