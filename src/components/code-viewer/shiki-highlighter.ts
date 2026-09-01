import {
  createHighlighterCore,
  createCssVariablesTheme,
  HighlighterCore,
  LanguageRegistration,
} from 'shiki/core';
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript';
import typescriptLang from 'shiki/langs/typescript.mjs';

export interface CodeToken {
  content: string;
  className: string;
}

export interface HighlightedLine {
  lineNumber: number;
  tokens: CodeToken[];
  rawText: string;
}

const pseudocodeGrammar: LanguageRegistration = {
  name: 'pseudocode',
  scopeName: 'source.pseudocode',
  displayName: 'Pseudocode',
  patterns: [
    {
      name: 'comment.line.pseudocode',
      match: '#.*$',
    },
    {
      name: 'keyword.control.pseudocode',
      match: '\\b(procedure|end procedure|if|then|else|end if|for|from|to|do|end for|while|end while|return|throw|break|not|and|or|mod)\\b',
    },
    {
      name: 'constant.language.pseudocode',
      match: '\\b(true|false|null)\\b',
    },
    {
      name: 'entity.name.type.pseudocode',
      match: '\\b(Item|Integer|Boolean|String|Stack|Queue|LinkedList|Node|StackOverflowError|StackUnderflowError|QueueOverflowError|QueueUnderflowError)\\b',
    },
    {
      name: 'keyword.operator.pseudocode',
      match: '(:=|->|<=|>=|!=|=|>|<|\\+|-|\\*|/)',
    },
    {
      name: 'entity.name.function.pseudocode',
      match: '\\b([a-zA-Z_][a-zA-Z0-9_]*)(?=\\s*\\()',
    },
    {
      name: 'constant.numeric.pseudocode',
      match: '\\b[0-9]+\\b',
    },
  ],
  repository: {},
};

const cssVariablesTheme = createCssVariablesTheme({
  name: 'css-variables',
  variablePrefix: '--shiki-',
});

let highlighterPromise: Promise<HighlighterCore> | null = null;
export let cachedHighlighter: HighlighterCore | null = null;

export function getHighlighterPromise(): Promise<HighlighterCore> {
  if (cachedHighlighter) {
    return Promise.resolve(cachedHighlighter);
  }
  if (!highlighterPromise) {
    highlighterPromise = createHighlighterCore({
      langs: [typescriptLang, pseudocodeGrammar],
      themes: [cssVariablesTheme],
      engine: createJavaScriptRegexEngine(),
    }).then((hl) => {
      cachedHighlighter = hl;
      return hl;
    });
  }
  return highlighterPromise;
}

getHighlighterPromise();

export function getTokenClassName(color: string | undefined): string {
  if (!color || !color.startsWith('var(--shiki-token-')) {
    return 'shiki-token-default';
  }
  const tokenType = color.slice('var(--shiki-token-'.length, -1);
  return tokenType ? `shiki-token-${tokenType}` : 'shiki-token-default';
}

export function highlightCode(
  code: string,
  language: 'typescript' | 'pseudocode'
): HighlightedLine[] {
  const rawLines = code.split('\n');

  if (!cachedHighlighter) {
    return rawLines.map((line, idx) => ({
      lineNumber: idx + 1,
      tokens: [{ content: line || ' ', className: 'shiki-token-default' }],
      rawText: line,
    }));
  }

  try {
    const result = cachedHighlighter.codeToTokens(code, {
      lang: language,
      theme: 'css-variables',
    });

    return result.tokens.map((lineTokens, idx) => ({
      lineNumber: idx + 1,
      tokens:
        lineTokens.length === 0
          ? [{ content: ' ', className: 'shiki-token-default' }]
          : lineTokens.map((t) => ({
              content: t.content,
              className: getTokenClassName(t.color),
            })),
      rawText: rawLines[idx] ?? '',
    }));
  } catch {
    return rawLines.map((line, idx) => ({
      lineNumber: idx + 1,
      tokens: [{ content: line || ' ', className: 'shiki-token-default' }],
      rawText: line,
    }));
  }
}
