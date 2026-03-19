# 🔥 DEVROAST - Roast Submission Feature Design

**Data**: 2026-03-19  
**Versão**: 1.0  
**Estado**: Approved

---

## 1. Visão Geral

Permitir que utilizadores submetam código para análise por IA, recibieron feedback sarcástico (roast mode) ou construtivo (honest mode). O sistema integra com **OpenAI GPT-4o-mini** para análise de código e guarda os resultados na base de dados PostgreSQL.

---

## 2. User Flow

```
┌─────────────────┐
│  Homepage       │
│  (CodeEditor)   │
└────────┬────────┘
         │
         │ user writes code + toggles roast mode
         │ user clicks "roast_my_code"
         │
         ▼
┌─────────────────┐
│  Submit Flow    │
│  - Validate     │
│  - Disable btn  │
│  - "roasting..."│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  POST /api/submit │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  OpenAI API     │
│  - GPT-4o-mini  │
│  - System prompt│
│  - User code    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Parse Response │
│  - Score        │
│  - Issues       │
│  - Diff         │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Save to DB     │
│  - roast record │
│  - analysis_items│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Redirect       │
│  /roast/{id}    │
└─────────────────┘
```

---

## 3. Arquitetura Técnica

### 3.1 Estrutura de Ficheiros

```
src/
├── app/
│   ├── page.tsx                    # Homepage (existente)
│   ├── _components/
│   │   └── HomeInteractive.tsx     # CodeEditor + Submit (modificar)
│   └── roast/[id]/
│       └── page.tsx                # Result page (modificar)
├── app/api/
│   └── submit/
│       └── route.ts                # Submit API (modificar)
├── components/
│   ├── code-editor.tsx             # CodeEditor (existente)
│   └── ui/
│       └── toast.tsx               # Toast notification (criar)
├── lib/
│   ├── roast.ts                    # Roast logic (modificar)
│   └── openai.ts                   # OpenAI client (criar)
├── db/
│   ├── schema.ts                   # Schema (existente)
│   └── queries.ts                  # Queries (modificar)
└── trpc/
    └── routers/
        └── _app.ts                 # tRPC (modificar)
```

### 3.2 API Design

#### POST `/api/submit`

**Request:**
```typescript
{
  code: string;        // max 2000 chars
  language: string;    // e.g., "javascript"
  roastMode: boolean;  // true = sarcastic, false = honest
}
```

**Response (sucesso):**
```typescript
{
  id: string;           // UUID do roast
  score: number;        // 0-10
  verdict: string;      // e.g., "needs_serious_help"
  roastQuote: string;   // Frase sarcástica/constructiva
  code: string;
  language: string;
  lineCount: number;
  roastMode: boolean;
  analysisItems: {
    id: string;
    severity: "critical" | "warning" | "good";
    title: string;
    description: string;
    order: number;
  }[];
}
```

**Response (erro):**
```typescript
{
  error: string;        // Mensagem de erro
}
```

### 3.3 Estrutura da Resposta OpenAI

#### Modelo
- **GPT-4o-mini** - Rápido, barato e suficiente para análise de código

#### Prompt do Sistema (Roast Mode)

```
You are an expert code reviewer with a sarcastic, brutally honest personality.
Your mission is to roast terrible code while being technically accurate.
Be witty, mean, and educational. Make developers laugh while they cry.
```

#### Prompt do Sistema (Honest Mode)

```
You are a constructive code reviewer helping developers improve.
Provide honest, actionable feedback with empathy.
Focus on teaching, not insulting.
```

#### Estrutura do JSON Output

```json
{
  "feedback": "String - frase principal sarcástica ou construtiva",
  "score": 0-10,
  "issues": [
    {
      "severity": "critical" | "warning" | "good",
      "title": "String - título curto",
      "description": "String - explicação detalhada"
    }
  ],
  "diff": [
    {
      "type": "removed" | "added" | "context",
      "content": "String - linha de código"
    }
  ]
}
```

---

## 4. Componentes

### 4.1 HomeInteractive.tsx (Modificar)

**Estado Local:**
```typescript
const [code, setCode] = useState("");
const [language, setLanguage] = useState("javascript");
const [roastMode, setRoastMode] = useState(true);
const [isSubmitting, setIsSubmitting] = useState(false);
const [error, setError] = useState<string | null>(null);
```

**Fluxo de Submit:**
1. Validar código (não vazio, < 2000 chars)
2. Desabilitar botão + mostrar "roasting..."
3. Chamar `POST /api/submit`
4. Se sucesso → redirect para `/roast/{id}`
5. Se erro → mostrar toast + reabilitar botão

**UI During Submit:**
```tsx
<Button disabled={isSubmitting || isOverLimit || !code.trim()}>
  {isSubmitting ? "roasting..." : "roast_my_code"}
</Button>
```

### 4.2 Toast Component (Criar)

**Ficheiro:** `src/components/ui/toast.tsx`

**Funcionalidades:**
- Slide-in animation (top-right)
- Auto-dismiss após 5 segundos
- Variantes: error, success, info
- Botão dismiss

**Uso:**
```typescript
// Erro
toast({ variant: "error", title: "Failed to roast", description: error.message });

// Success
toast({ variant: "success", title: "Code roasted!", description: "Redirecting..." });
```

### 4.3 Página /roast/[id] (Modificar)

**Server Component:**
1. Extrair `id` dos params
2. Chamar `getRoastDetails(id)` da BD
3. Se não existe → 404
4. Passar dados para componente client

**Client Component:**
```typescript
interface RoastResultProps {
  roast: {
    id: string;
    code: string;
    language: string;
    score: number;
    verdict: string;
    roastQuote: string;
    lineCount: number;
  };
  analysisItems: AnalysisItem[];
}

// Renderiza o layout existente com dados reais
```

---

## 5. Base de Dados

### 5.1 Schema (Existente)

```typescript
// roasts table
{
  id: uuid,
  code: text,
  language: varchar(50),
  lineCount: integer,
  roastMode: boolean,
  score: real,
  verdict: enum("needs_serious_help", "rough_around_edges", "decent_code", "solid_work", "exceptional"),
  roastQuote: text,        // <- já existe
  suggestedFix: text,      // <- já existe (para diff)
  createdAt: timestamp
}

// analysis_items table
{
  id: uuid,
  roastId: uuid (FK),
  severity: enum("critical", "warning", "good"),
  title: varchar(200),
  description: text,
  order: integer
}
```

### 5.2 Query (Modificar)

```typescript
export async function getRoastDetails(roastId: string) {
  // Já existe, verificar se retorna tudo necessário
}
```

---

## 6. OpenAI Integração

### 6.1 Ficheiro: `src/lib/openai.ts`

```typescript
import OpenAI from "openai";

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

export const SYSTEM_PROMPTS = {
  roast: process.env.SYSTEM_PROMPT_ROAST || "You are an expert code reviewer with a sarcastic, brutally honest personality. Your mission is to roast terrible code while being technically accurate. Be witty, mean, and educational.",
  honest: process.env.SYSTEM_PROMPT_HONEST || "You are a constructive code reviewer helping developers improve. Provide honest, actionable feedback with empathy. Focus on teaching, not insulting.",
};
```

### 6.2 Função: Analyze Code

```typescript
interface AnalysisResult {
  feedback: string;
  score: number;
  issues: Issue[];
  diff: DiffLine[];
}

export async function analyzeCode(
  code: string,
  language: string,
  roastMode: boolean
): Promise<AnalysisResult> {
  const systemPrompt = roastMode 
    ? SYSTEM_PROMPTS.roast 
    : SYSTEM_PROMPTS.honest;

  const completion = await openai.chat.completions.create({
    model: OPENAI_MODEL,
    messages: [
      { role: "system", content: systemPrompt },
      { 
        role: "user", 
        content: `Analyze this ${language} code:\n\n${code}` 
      }
    ],
    response_format: { type: "json_object" },
  });

  return JSON.parse(completion.choices[0].message.content);
}
```

---

## 7. Variáveis de Ambiente

### 7.1 .env.example

```env
# OpenAI Configuration
OPENAI_API_KEY=sk-your-api-key-here
OPENAI_MODEL=gpt-4o-mini

# System Prompts (opcional - têm defaults)
SYSTEM_PROMPT_ROAST=You are an expert code reviewer with a sarcastic, brutally honest personality. Your mission is to roast terrible code while being technically accurate. Be witty, mean, and educational.
SYSTEM_PROMPT_HONEST=You are a constructive code reviewer helping developers improve. Provide honest, actionable feedback with empathy. Focus on teaching, not insulting.
```

### 7.2 Considerações de Segurança

- ✅ API key nunca em código fonte
- ✅ Prompts podem ser modificados via env
- ✅ Rate limiting futuro (não implementar agora)

---

## 8. Tratamento de Erros

### 8.1 Erros de Input

| Erro | HTTP Status | Mensagem |
|------|-------------|----------|
| Código vazio | 400 | "Code is required" |
| Código > 2000 chars | 400 | "Code too long. Maximum 2,000 characters." |
| Linguagem inválida | 400 | "Invalid language" |

### 8.2 Erros de API

| Erro | HTTP Status | UI Feedback |
|------|-------------|------------|
| OpenAI timeout | 504 | Toast: "Analysis took too long. Please try again." |
| OpenAI error | 500 | Toast: "Failed to analyze code. Please try again." |
| DB error | 500 | Toast: "Failed to save result. Please try again." |

### 8.3 Toast Component

**Ficheiro:** `src/components/ui/toast.tsx`

**Variantes:**
- `error` - bg-red, ícone X
- `success` - bg-green, ícone ✓
- `info` - bg-blue, ícone i

**Posição:** top-right, stack vertical

**Auto-dismiss:** 5000ms

---

## 9. Implementação Passo a Passo

### Fase 1: Setup (10 min)
1. [ ] Instalar `openai` package
2. [ ] Criar `.env` com variáveis
3. [ ] Criar `src/lib/openai.ts`

### Fase 2: Toast Component (20 min)
1. [ ] Criar `src/components/ui/toast.tsx`
2. [ ] Criar hook `useToast`
3. [ ] Integrar no layout ou provider

### Fase 3: OpenAI Integration (30 min)
1. [ ] Implementar `analyzeCode()` em `lib/roast.ts`
2. [ ] Modificar `submitCode()` para usar IA real
3. [ ] Testar com código mock

### Fase 4: Frontend Integration (30 min)
1. [ ] Modificar `HomeInteractive.tsx` com estado de submit
2. [ ] Implementar redirect no sucesso
3. [ ] Implementar toast no erro

### Fase 5: Result Page (20 min)
1. [ ] Modificar `/roast/[id]/page.tsx` para usar BD
2. [ ] Criar Server Component para fetch data
3. [ ] Testar com dados reais

### Fase 6: Testing (15 min)
1. [ ] Testar fluxo completo
2. [ ] Testar erros (vazio, longo, etc.)
3. [ ] Verificar UI durante loading

---

## 10. Estimativa de Tempo

| Fase | Tempo | Total |
|------|-------|-------|
| Setup | 10 min | 10 min |
| Toast | 20 min | 30 min |
| OpenAI | 30 min | 60 min |
| Frontend | 30 min | 90 min |
| Result Page | 20 min | 110 min |
| Testing | 15 min | 125 min |
| **Total** | | **~2 horas** |

---

## 11. Critérios de Sucesso

- [ ] Utilizador consegue submeter código
- [ ] Feedback da IA é sarcástico (roast mode) ou construtivo (honest mode)
- [ ] Página de resultado mostra dados reais da BD
- [ ] Erros mostram toast e permitem retry
- [ ] Botão desabilitado durante submit
- [ ] UI responsiva e consistente com design existente
- [ ] Build passa sem erros
- [ ] Testes Playwright passam

---

## 12. Out of Scope (Futuro)

- Partilha de roasts (share)
- Rate limiting
- Autenticação/utilizadores
- Dashboard admin para editar prompts
- Histórico de submissions
- Exportar/importar código

---

## 13. Riscos e Mitigações

| Risco | Probabilidade | Impacto | Mitigação |
|-------|--------------|---------|----------|
| OpenAI API key inválida | Baixa | Alto | Validação early + mensagem clara |
| Response mal formatado | Média | Médio | Try/catch + fallback parsing |
| Custo inesperado | Baixa | Médio | Limite de 2000 chars por submit |
| Rate limits OpenAI | Baixa | Médio | Retry com backoff |
| Performance lenta | Baixa | Baixo | UI de loading + timeout |

---

## 14. Decisões Tomadas

| # | Pergunta | Resposta |
|---|----------|----------|
| 1 | Fluxo após submit | A - Redirect para `/roast/{id}` |
| 2 | Estado durante processamento | A - Desabilitar botão + "roasting..." |
| 3 | Tratamento de erros | A - Toast notification + retry |
| 4 | Fonte da análise | B - OpenAI real |
| 5 | Provedor IA | A - OpenAI |
| 5b | Modelo | **gpt-4o-mini** (rápido, barato) |
| 6 | Tom do prompt | B - Depende do roastMode toggle |
| 7 | Estrutura resposta IA | B - Detailed (Score + Issues + Diffs) |
| 8 | Limites de input | A - Apenas 2000 chars |
| 9 | Validação | A - Apenas tamanho |
| 10 | Design página resultado | Layout vertical existente |
| 11 | Armazenamento prompts | A - Variáveis de ambiente |

---

**Documento gerado em**: 2026-03-19  
**Próximo passo**: Implementation Plan
