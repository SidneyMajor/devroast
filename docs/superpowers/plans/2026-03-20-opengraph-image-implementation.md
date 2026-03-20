# OpenGraph Image Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Criar imagens OpenGraph dinâmicas (1200x630) para páginas de resultado de roast usando Takumi

**Architecture:** Endpoint `/api/og` que usa `@takumi-rs/image-response` para gerar PNG dinâmico. A página de roast inclui `generateMetadata` que aponta para este endpoint via meta tag `og:image`.

**Tech Stack:** `@takumi-rs/image-response`, Next.js App Router, Takumi Rust renderer

---

## File Structure

| Ficheiro | Responsabilidade |
|----------|----------------|
| `src/app/api/og/route.tsx` | Endpoint Takumi - gera PNG 1200x630 |
| `src/app/roast/[id]/page.tsx` | Adiciona `generateMetadata` com og:image |
| `next.config.ts` | Configura `serverExternalPackages` |
| `package.json` | Adiciona `@takumi-rs/image-response` |

---

## Tasks

### Task 1: Configurar Next.js para Takumi

**Files:**
- Modify: `next.config.ts`

- [ ] **Step 1: Verificar configuração atual**

Verificar se `next.config.ts` existe e tem estrutura básica.

- [ ] **Step 2: Adicionar serverExternalPackages**

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@takumi-rs/core"],
};

export default nextConfig;
```

---

### Task 2: Criar endpoint OG Image

**Files:**
- Create: `src/app/api/og/route.tsx`

**Reference:** Spec em `docs/superpowers/specs/2026-03-20-opengraph-image-design.md`

- [ ] **Step 1: Criar endpoint básico**

```tsx
import { ImageResponse } from "@takumi-rs/image-response";
import { getRoastDetails } from "@/db/queries";
import { NextRequest } from "next/server";

export const runtime = "nodejs";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const result = await getRoastDetails(id);

  if (!result) {
    return new Response("Not found", { status: 404 });
  }

  const { roast } = result;
  const score = Number(roast.score);
  
  const verdictColors = {
    critical: { dot: "#EF4444", text: "#EF4444" },
    warning: { dot: "#F59E0B", text: "#F59E0B" },
    good: { dot: "#22C55E", text: "#22C55E" },
  };
  
  const verdictVariant = score <= 2 ? "critical" : score <= 5 ? "warning" : "good";
  const colors = verdictColors[verdictVariant];

  return new ImageResponse(
    (
      <div
        style={{
          background: "#0A0A0A",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: "64px",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "28px" }}>
          <span style={{ color: "#22C55E", fontSize: "24px", fontWeight: 700 }}>{`>`}</span>
          <span style={{ color: "#FAFAFA", fontSize: "20px", fontWeight: 500 }}>devroast</span>
        </div>

        <div style={{ display: "flex", alignItems: "baseline", gap: "4px", marginBottom: "28px" }}>
          <span style={{ color: "#F59E0B", fontSize: "160px", fontWeight: 900, lineHeight: 1 }}>
            {score.toFixed(1)}
          </span>
          <span style={{ color: "#6B7280", fontSize: "56px" }}>/10</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "28px" }}>
          <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: colors.dot }} />
          <span style={{ color: colors.text, fontSize: "20px" }}>
            {roast.verdict.replace(/_/g, " ")}
          </span>
        </div>

        <span style={{ color: "#6B7280", fontSize: "16px", marginBottom: "28px" }}>
          lang: {roast.language} · {roast.lineCount} lines
        </span>

        <div style={{ maxWidth: "100%", textAlign: "center" }}>
          <span style={{ color: "#FAFAFA", fontSize: "22px", lineHeight: 1.5 }}>
            "{roast.roastQuote}"
          </span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
```

- [ ] **Step 2: Testar endpoint**

Run dev server: `npm run dev`
Test: `curl http://localhost:3000/api/og?id={valid_id}` - deve retornar PNG

---

### Task 3: Adicionar generateMetadata à página de roast

**Files:**
- Modify: `src/app/roast/[id]/page.tsx`

- [ ] **Step 1: Adicionar generateMetadata**

Adicionar função `generateMetadata` após imports e antes de `RoastPage`:

```tsx
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await getRoastDetails(id);

  if (!result) {
    return { title: "Roast Not Found" };
  }

  return {
    title: `Score: ${result.roast.score}/10 - ${result.roast.verdict}`,
    description: result.roast.roastQuote || "Check out this code roast!",
    openGraph: {
      title: `Score: ${result.roast.score}/10 - ${result.roast.verdict}`,
      description: result.roast.roastQuote || "Check out this code roast!",
      images: [`/api/og?id=${id}`],
    },
    twitter: {
      card: "summary_large_image",
      title: `Score: ${result.roast.score}/10 - ${result.roast.verdict}`,
      description: result.roast.roastQuote || "Check out this code roast!",
      images: [`/api/og?id=${id}`],
    },
  };
}
```

---

### Task 4: Build e Verificação

- [ ] **Step 1: Run build**

```bash
npm run build
```
Expected: Build successful

- [ ] **Step 2: Commit**

```bash
git add next.config.ts src/app/api/og/route.tsx src/app/roast/[id]/page.tsx
git commit -m "feat: add OpenGraph image generation with Takumi"
```

---

## Verification Checklist

- [ ] `GET /api/og?id={valid_id}` retorna PNG 1200x630
- [ ] `GET /api/og?id={invalid_id}` retorna 404
- [ ] `<meta property="og:image">` presente no HTML da página
- [ ] Twitter Card preview funciona
