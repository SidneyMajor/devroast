declare module "highlight.js/lib/core" {
  interface HLJSApi {
    registerLanguage(name: string, language: LanguageDefinition): void;
    highlightAuto(code: string, languageSubset?: string[]): HighlightResult;
    highlight(code: string, options: { language: string; ignoreIllegals?: boolean }): HighlightResult;
  }

  interface LanguageDefinition {
    name?: string;
    aliases?: string[];
    disableAutodetect?: boolean;
    contains?: any[];
    case_insensitive?: boolean;
    keywords?: any;
    exports?: any;
    classNameAliases?: Record<string, string>;
  }

  interface HighlightResult {
    language?: string;
    relevance?: number;
    value: string;
    emitter?: any;
  }

  const hljs: HLJSApi;
  export default hljs;
}

declare module "highlight.js/lib/languages/*" {
  import type { LanguageDefinition } from "highlight.js/lib/core";
  const language: LanguageDefinition;
  export default language;
}
