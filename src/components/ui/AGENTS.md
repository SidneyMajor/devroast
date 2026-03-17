# Padrões de Componentes UI

## Visão Geral

Este documento define os padrões para criação de componentes de UI genéricos no projeto.

## Estrutura de Arquivos

```
src/components/ui/
├── button.tsx      # Componente Button
├── button.md      # Este documento
└── ...
```

## Padrões Obrigatórios

### 1. Named Exports

Sempre use **named exports**, nunca default exports.

```tsx
// ✅ Correto
export function Button({ ... }: ButtonProps) { ... }

// ❌ Errado
export default function Button() { ... }
```

### 2. Tailwind Variants

Use `tailwind-variants` (tv) para gerenciar variantes de componentes.

```tsx
import { tv, type VariantProps } from "tailwind-variants";

const buttonVariants = tv({
  base: "base classes aqui",
  variants: {
    variant: {
      primary: "classes para variant primary",
      secondary: "classes para variant secondary",
    },
    size: {
      sm: "classes para size sm",
      md: "classes para size md",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "md",
  },
});
```

### 3. Tailwind Merge

Use `tailwind-merge` (`twMerge`) para mesclar classes e evitar conflitos.

```tsx
import { twMerge } from "tailwind-merge";

<button className={twMerge(buttonVariants({ variant, size, className }))}>
```

### 4. Props TypeScript

Extenda as props nativas do elemento HTML base.

```tsx
import type { ButtonHTMLAttributes } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  children: ReactNode;
}
```

### 5. Nomenclatura de Arquivos

- Nome do arquivo em **kebab-case**: `button.tsx`, `text-input.tsx`
- Pasta: `src/components/ui/`
- Arquivo de documentação: `<component-name>.md` (opcional)

### 6. Cores e Tipografia

Use sempre as cores definidas no design do Pencil:
- Cores do tema: `$accent-green`, `$text-primary`, `$border-primary`, etc.
- Traduzir para Tailwind: `#10B981`, `#FAFAFA`, `#2A2A2A`
- Fontes: JetBrains Mono (`font-mono`), IBM Plex Mono

## Extraindo Design do Pencil

### Frame Properties → Tailwind

| Propriedade Pencil | Valor | Tailwind |
|-------------------|-------|----------|
| padding | [10, 24] | py-2.5 px-6 |
| gap | 8 | gap-2 |
| alignItems | center | items-center |
| fill | #10B981 | bg-[#10B981] |
| stroke | #2A2A2A | border-[#2A2A2A] |
| fontSize | 13 | text-[13px] |
| fontFamily | JetBrains Mono | font-mono |
| fontWeight | 500 | font-medium |

### children (texto)
O texto dentro do frame vira o `children` do componente.

## checklist de Criação de Componente

- [ ] Criar arquivo em `src/components/ui/<nome>.tsx`
- [ ] Usar named export
- [ ] Usar tailwind-variants para variantes
- [ ] Usar tailwind-merge para classes
- [ ] Estender props nativas do elemento HTML
- [ ] Verificar cores e fontes no design do Pencil
- [ ] Testar todas as variantes
- [ ] Rodar `npm run check` antes de commitar

