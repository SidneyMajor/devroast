# OpenGraph Image for Roast Results - Design Spec

**Autor:** AI Assistant  
**Data:** 2026-03-20  
**Status:** Approved  
**Source:** `devroast.pen.txt` - Frame `4J5QT` (Screen 4 - OG Image)

---

## 1. Visão Geral

Criar imagens OpenGraph dinâmicas (1200x630) para páginas de resultado de roast, permitindo compartilhamento visual em redes sociais (Twitter, Discord, LinkedIn, etc.).

---

## 2. Especificações da Imagem

| Propriedade | Valor |
|-------------|-------|
| **Largura** | 1200px |
| **Altura** | 630px |
| **Formato** | PNG |
| **Fundo** | `#0A0A0A` (dark) |

---

## 3. Layout

```
┌────────────────────────────────────────────────────────────────────┐
│                                                                    │
│                         > devroast                                 │
│                                                                    │
│                           3.5                                      │
│                          /10                                       │
│                                                                    │
│                     ● needs_serious_help                          │
│                                                                    │
│                   lang: javascript · 7 lines                       │
│                                                                    │
│           "this code was written during a power outage..."          │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

---

## 4. Elementos Visuais

### 4.1 Logo
| Propriedade | Valor |
|-------------|-------|
| **Conteúdo** | `> devroast` |
| **Cor** | `#22C55E` (verde) |
| **Font** | JetBrains Mono |
| **Tamanho** | 20px |
| **Peso** | 500 |
| **Alinhamento** | Centro |

### 4.2 Score
| Propriedade | Valor |
|-------------|-------|
| **Número** | `3.5` |
| **Cor** | `#F59E0B` (âmbar) |
| **Font** | JetBrains Mono |
| **Tamanho** | 160px |
| **Peso** | 900 |

| Propriedade | Valor |
|-------------|-------|
| **Denominador** | `/10` |
| **Cor** | `#6B7280` (cinza) |
| **Font** | JetBrains Mono |
| **Tamanho** | 56px |

### 4.3 Verdict Badge
| Propriedade | Valor |
|-------------|-------|
| **Dot** | Elipse 12x12, `#EF4444` (vermelho) |
| **Texto** | `needs_serious_help` |
| **Cor** | `#EF4444` (vermelho) |
| **Font** | JetBrains Mono |
| **Tamanho** | 20px |
| **Alinhamento** | Centro |

**Cores por Verdict:**
| Verdict | Score | Cor |
|---------|-------|-----|
| critical | 0-2 | `#EF4444` |
| warning | 3-5 | `#F59E0B` |
| good | 6-10 | `#22C55E` |

### 4.4 Info
| Propriedade | Valor |
|-------------|-------|
| **Conteúdo** | `lang: javascript · 7 lines` |
| **Cor** | `#6B7280` |
| **Font** | JetBrains Mono |
| **Tamanho** | 16px |
| **Alinhamento** | Centro |

### 4.5 Quote
| Propriedade | Valor |
|-------------|-------|
| **Conteúdo** | `{roastQuote}` |
| **Cor** | `#FAFAFA` (branco) |
| **Font** | IBM Plex Mono |
| **Tamanho** | 22px |
| **Line Height** | 1.5 |
| **Alinhamento** | Centro |
| **Largura** | fill_container |

---

## 5. Arquitetura

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   Página Roast  │────▶│  generateMetadata │────▶│  <meta og:image> │
│   /roast/[id]  │     │  define OG URL   │     │  /api/og?id=xxx  │
└─────────────────┘     └──────────────────┘     └─────────────────┘
                                                              │
                                                              ▼
                                                    ┌─────────────────┐
                                                    │  /api/og/route   │
                                                    │  Takumi generates │
                                                    │  PNG 1200x630    │
                                                    └─────────────────┘
```

---

## 6. Endpoint

**Rota:** `GET /api/og?id={roastId}`

**Formato:** PNG  
**Dimensões:** 1200x630

---

## 7. Ficheiros a Criar/Modificar

| Ficheiro | Ação | Descrição |
|----------|------|-----------|
| `src/app/api/og/route.tsx` | Criar | Endpoint Takumi para gerar imagem |
| `src/app/roast/[id]/page.tsx` | Modificar | Adicionar `generateMetadata` |
| `next.config.ts` | Modificar | Adicionar `serverExternalPackages` |
| `package.json` | Modificar | Adicionar `@takumi-rs/image-response` |

---

## 8. Dependencies

```bash
npm install @takumi-rs/image-response
```

**Configuração Next.js:**
```typescript
// next.config.ts
export default {
  serverExternalPackages: ["@takumi-rs/core"],
};
```

---

## 9. Dados Dinâmicos

| Campo | Fonte |
|-------|-------|
| `score` | `roast.score` (1 casa decimal) |
| `verdict` | `roast.verdict` |
| `language` | `roast.language` |
| `lineCount` | `roast.lineCount` |
| `roastQuote` | `roast.roastQuote` |

---

## 10. Testes

- [ ] GET `/api/og?id={valid_id}` retorna PNG 1200x630
- [ ] GET `/api/og?id={invalid_id}` retorna 404
- [ ] `<meta property="og:image">` presente na página
- [ ] Preview no Twitter Card Validator funciona

---

## 11. Considerações

- **Performance:** Takumi usa Rust, geração ~50ms
- **Fonts:** JetBrains Mono + IBM Plex Mono (já disponíveis no projeto)
- **Cache:** Possível adicionar CDN cache no futuro
