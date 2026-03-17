# DevRoast - Padrões do Projeto

## Visão Geral

Aplicação web para submissão de código e feedback automático com humor.

## Estrutura

```
src/
├── app/              # Next.js App Router
│   ├── page.tsx      # Homepage
│   ├── layout.tsx    # Layout raiz + Navbar
│   └── components/   # Página de componentes
└── components/
    ├── ui/           # Componentes de UI
    └── navbar.tsx    # Navbar global
```

## Padrões de Componentes UI

### Padrão de Composição

Componentes usam composição em vez de props:

```tsx
// ✅ Correto
<CardRoot>
  <CardBadge variant="critical">critical</CardBadge>
  <CardTitle>Título</CardTitle>
  <CardDescription>Descrição</CardDescription>
</CardRoot>

// ❌ Errado (modo legado ainda funciona)
<Card title="..." description="..." />
```

### Estrutura de Arquivo

```
src/components/ui/
├── button.tsx      # Componente + sub-componentes
├── card.tsx        # CardRoot, CardBadge, etc.
└── ...
```

### Named Exports

Sempre usar named exports:

```tsx
export function CardRoot() {}
export function CardBadge() {}
```

### Cores

Usar cores hex diretamente (não classes Tailwind inventadas):

```tsx
// ✅
className="text-[#EF4444]"

// ❌
className="text-accent-red"
```

### Button Hover

Hover separado do base para evitar efeito quando disabled:

```tsx
const buttonVariants = tv({...})
const hoverVariants = tv({...})

// Aplica hover apenas se não disabled
const hoverClass = !isDisabled ? hoverVariants({ variant }) : ""
```

## Scripts

```bash
npm run dev      # Desenvolvimento
npm run build   # Build produção
npm run check   # Lint + format
```
