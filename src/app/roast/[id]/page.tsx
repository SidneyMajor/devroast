import { CodeBlock } from "@/components/ui/code-block";

function ScoreRing({ score }: { score: number }) {
  const getScoreColor = (s: number) => {
    if (s <= 3.5) return "#EF4444";
    if (s <= 6) return "#F59E0B";
    return "#22C55E";
  };

  const scoreColor = getScoreColor(score);
  const rotation = -45 + (score / 10) * 270;

  return (
    <div className="relative h-[180px] w-[180px]">
      <div className="absolute inset-0 rounded-full border-4 border-[#2A2A2A]" />
      <div
        className="absolute inset-0 rounded-full border-4 border-t-transparent border-r-transparent"
        style={{
          borderColor: `${scoreColor} ${scoreColor} transparent transparent`,
          transform: `rotate(${rotation}deg)`,
        }}
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono text-[48px] font-bold" style={{ color: scoreColor }}>
          {score}
        </span>
        <span className="font-mono text-[16px] text-[#4B5563]">/10</span>
      </div>
    </div>
  );
}

function Badge({ label, variant }: { label: string; variant: "critical" | "warning" | "good" }) {
  const colors = {
    critical: "bg-[#EF4444]",
    warning: "bg-[#F59E0B]",
    good: "bg-[#22C55E]",
  };
  const textColors = {
    critical: "text-[#EF4444]",
    warning: "text-[#F59E0B]",
    good: "text-[#22C55E]",
  };

  return (
    <div className="flex items-center gap-2">
      <div className={`h-2 w-2 rounded-full ${colors[variant]}`} />
      <span className={`font-mono text-[12px] font-medium ${textColors[variant]}`}>
        {label}
      </span>
    </div>
  );
}

const staticCode = `function calculateTotal(items) {
  var total = 0;
  for (var i = 0; i < items.length; i++) {
    total = total + items[i].price;
  }

  if (total > 100) {
    console.log("discount applied");
    total = total * 0.9;
  }

  // TODO: handle tax calculation
  // TODO: handle currency conversion

  return total;
}`;

const issues = [
  {
    severity: "critical" as const,
    title: "using var instead of const/let",
    description: "var is function-scoped and leads to hoisting bugs. use const by default, let when reassignment is needed.",
  },
  {
    severity: "warning" as const,
    title: "imperative loop pattern",
    description: "for loops are verbose and error-prone. use .reduce() or .map() for cleaner, functional transformations.",
  },
  {
    severity: "good" as const,
    title: "clear naming conventions",
    description: "calculateTotal and items are descriptive, self-documenting names that communicate intent without comments.",
  },
  {
    severity: "good" as const,
    title: "single responsibility",
    description: "the function does one thing well — calculates a total. no side effects, no mixed concerns, no hidden complexity.",
  },
];

const diffLines = [
  { type: "context" as const, text: "function calculateTotal(items) {" },
  { type: "removed" as const, text: "  var total = 0;" },
  { type: "removed" as const, text: "  for (var i = 0; i < items.length; i++) {" },
  { type: "removed" as const, text: "    total = total + items[i].price;" },
  { type: "removed" as const, text: "  }" },
  { type: "removed" as const, text: "  return total;" },
  { type: "added" as const, text: "  return items.reduce((sum, item) => sum + item.price, 0);" },
  { type: "context" as const, text: "}" },
];

export default function RoastPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <div className="flex min-h-[calc(100vh-56px)] flex-col px-10 py-10">
      <div className="flex flex-col gap-10">
        <div className="flex items-center justify-center gap-12">
          <ScoreRing score={3.5} />
          
          <div className="flex flex-1 flex-col gap-4">
            <Badge label="verdict: needs_serious_help" variant="critical" />
            <h1 className="max-w-xl font-mono text-[20px] font-normal leading-[1.5] text-[#FAFAFA]">
              "this code looks like it was written during a power outage... in 2005."
            </h1>
            <div className="flex items-center gap-4">
              <span className="font-mono text-[12px] text-[#4B5563]">lang: javascript</span>
              <span className="text-[12px] text-[#4B5563]">·</span>
              <span className="font-mono text-[12px] text-[#4B5563]">7 lines</span>
            </div>
            <button className="mt-2 w-fit rounded border border-[#2A2A2A] px-4 py-2 font-mono text-[12px] text-[#FAFAFA] hover:bg-[#2A2A2A] transition-colors">
              $ share_roast
            </button>
          </div>
        </div>

        <div className="h-px w-full bg-[#2A2A2A]" />

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[14px] font-bold text-[#22C55E]">//</span>
            <h2 className="font-mono text-[14px] font-bold text-[#FAFAFA]">your_submission</h2>
          </div>
          <CodeBlock code={staticCode} language="javascript" />
        </div>

        <div className="h-px w-full bg-[#2A2A2A]" />

        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[14px] font-bold text-[#22C55E]">//</span>
            <h2 className="font-mono text-[14px] font-bold text-[#FAFAFA]">detailed_analysis</h2>
          </div>
          <div className="grid grid-cols-2 gap-5">
            {issues.map((issue, i) => (
              <div key={i} className="flex flex-col gap-3 rounded-lg border border-[#2A2A2A] p-5">
                <div className="flex items-center gap-2">
                  <Badge 
                    label={issue.severity} 
                    variant={issue.severity} 
                  />
                </div>
                <h3 className="font-mono text-[13px] font-medium text-[#FAFAFA]">{issue.title}</h3>
                <p className="font-mono text-[12px] leading-[1.5] text-[#6B7280]">{issue.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="h-px w-full bg-[#2A2A2A]" />

        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[14px] font-bold text-[#22C55E]">//</span>
            <h2 className="font-mono text-[14px] font-bold text-[#FAFAFA]">suggested_fix</h2>
          </div>
          <div className="flex flex-col rounded-lg border border-[#2A2A2A] bg-[#111111] overflow-hidden">
            <div className="flex h-10 items-center border-b border-[#2A2A2A] px-4">
              <span className="font-mono text-[12px] font-medium text-[#6B7280]">your_code.ts → improved_code.ts</span>
            </div>
            <div className="flex flex-col">
              {diffLines.map((line, i) => (
                <div
                  key={i}
                  className={`flex h-7 items-center px-4 font-mono text-[12px] ${
                    line.type === "removed" 
                      ? "bg-[#EF44441A] text-[#EF4444]" 
                      : line.type === "added" 
                      ? "bg-[#22C55E1A] text-[#22C55E]" 
                      : "text-[#6B7280]"
                  }`}
                >
                  <span className="w-5">
                    {line.type === "removed" ? "-" : line.type === "added" ? "+" : " "}
                  </span>
                  {line.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
