import { createHighlighter, codeToHtml, type Highlighter } from "shiki";

let highlighter: Highlighter | null = null;

const SUPPORTED_LANGUAGES = [
  "javascript",
  "typescript",
  "python",
  "java",
  "csharp",
  "go",
  "rust",
  "php",
  "ruby",
  "swift",
  "kotlin",
  "c",
  "cpp",
  "sql",
  "html",
  "css",
] as const;

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export function isSupportedLanguage(lang: string): lang is SupportedLanguage {
  return (SUPPORTED_LANGUAGES as readonly string[]).includes(lang);
}

export async function getShikiHighlighter(): Promise<Highlighter> {
  if (highlighter) return highlighter;

  highlighter = await createHighlighter({
    themes: ["github-dark"],
    langs: [...SUPPORTED_LANGUAGES],
  });

  return highlighter;
}

export async function highlightCode(
  code: string,
  language: string
): Promise<string> {
  const lang = isSupportedLanguage(language) ? language : "text";

  return codeToHtml(code.trim(), {
    lang,
    theme: "github-dark",
  });
}

export async function highlightDiffLines(
  lines: Array<{ diffType: "added" | "removed" | "context"; content: string }>,
  language: string
): Promise<Array<{ diffType: "added" | "removed" | "context"; html: string }>> {
  const highlighter = await getShikiHighlighter();
  const lang = isSupportedLanguage(language) ? language : "text";

  const allCode = lines.map((l) => l.content).join("\n");
  const highlighted = highlighter.codeToHtml(allCode, {
    lang,
    theme: "github-dark",
  });

  const codeMatches = highlighted.match(/<code[^>]*>([\s\S]*?)<\/code>/);
  if (!codeMatches) {
    return lines.map((l) => ({ ...l, html: escapeHtml(l.content) }));
  }

  const htmlContent = codeMatches[1];
  const spannedLines = htmlContent.split(/<\/span><span[^>]*>/);

  return lines.map((line, index) => {
    const html = spannedLines[index] ?? escapeHtml(line.content);
    return {
      diffType: line.diffType,
      html: html.replace(/^<span[^>]*>|<\/span>$/g, ""),
    };
  });
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}