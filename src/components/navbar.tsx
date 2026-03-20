import Link from "next/link";

export function Navbar() {
  return (
    <nav className="flex h-14 items-center justify-between border-b border-[#2A2A2A] bg-[#0A0A0A] px-10">
      <Link href="/" className="flex items-center gap-2">
        <span className="font-mono text-xl font-bold text-[#10B981]">›</span>
        <span className="font-mono text-lg font-medium text-[#FAFAFA]">devroast</span>
      </Link>
      <div className="flex items-center gap-6">
        <Link href="/roasts" className="font-mono text-[13px] text-[#6B7280] hover:text-[#FAFAFA] transition-colors">
          roasts
        </Link>
        <Link href="/leaderboard" className="font-mono text-[13px] text-[#6B7280] hover:text-[#FAFAFA] transition-colors">
          leaderboard
        </Link>
      </div>
    </nav>
  );
}
