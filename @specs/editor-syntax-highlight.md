# Especificação: Editor com Syntax Highlight

## 1. Requisitos Validados

- ✅ Editor de código editável para usuário colar código
- ✅ Syntax highlight aplicado automaticamente
- ✅ Detecção automática de linguagem (recomendado)
- ✅ Fallback: usuário pode selecionar manualmente
- ✅ Experiência visual similar ao ray.so

---

## 2. Stack Confirmada

| Componente | Biblioteca Escolhida | Justificativa |
|------------|---------------------|----------------|
| Highlighting | **react-syntax-highlighter** | Mais leve que Shiki, detecção automática incluída |
| Detecção | **highlight.js** (built-in) | Já vem no pacote, detecta ~185 linguagens |
| Editor | Textarea com overlay | Leve, apenas highlighting (sem autocomplete) |

---

## 3. To-Dos

- [x] 1. Instalar dependências
- [x] 2. Criar componente `CodeEditor` em `src/components/code-editor.tsx`
      - [x] Textarea editável
      - [x] Line numbers (automático)
      - [x] Syntax highlight em tempo real
      - [x] Detecção automática de linguagem (highlight.js)
      - [x] Seletor manual de linguagem
- [x] 3. Integrar na homepage (`src/app/page.tsx`)
- [x] 4. Testar com linguagens comuns

---

## 4. Implementação Final

| Decisão | Valor |
|---------|-------|
| Biblioteca | react-syntax-highlighter |
| Tema | atomDark (tema escuro similar ao VSCode) |
| Languages | 14 + auto-detect |
| Estados | value, onChange, language, onLanguageChange |

---

## 4. Linguagens Iniciais

Sugestão: apenas as mais comuns (10-15)
- JavaScript, TypeScript, Python, Java, C#, Go, Rust, PHP, Ruby, Swift, Kotlin, C, C++, SQL
