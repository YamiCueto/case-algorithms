import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  getHighlighterPromise,
  highlightCode,
  cachedHighlighter,
  HighlightedLine,
} from './shiki-highlighter';

export interface CodeViewerProps {
  readonly code: string;
  readonly language: 'typescript' | 'pseudocode';
  readonly activeLine?: number;
  readonly className?: string;
}

export const CodeViewer: React.FC<CodeViewerProps> = ({
  code,
  language,
  activeLine,
  className = '',
}) => {
  const [, setHighlighterReady] = useState(() => !!cachedHighlighter);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<Map<number, HTMLTableRowElement>>(new Map());
  const lastScrollTimeRef = useRef<number>(0);

  useEffect(() => {
    let isMounted = true;
    if (!cachedHighlighter) {
      getHighlighterPromise().then(() => {
        if (isMounted) {
          setHighlighterReady(true);
        }
      });
    }
    return () => {
      isMounted = false;
    };
  }, []);

  const highlightedLines: HighlightedLine[] = useMemo(() => {
    return highlightCode(code, language);
  }, [code, language]);

  const validActiveLine =
    typeof activeLine === 'number' &&
    Number.isInteger(activeLine) &&
    activeLine >= 1 &&
    activeLine <= highlightedLines.length
      ? activeLine
      : undefined;

  useEffect(() => {
    if (validActiveLine === undefined) return;
    const activeRow = rowRefs.current.get(validActiveLine);
    const container = scrollContainerRef.current;
    if (!activeRow || !container) return;

    const rowTop = activeRow.offsetTop;
    const rowHeight = activeRow.offsetHeight || 22;
    const containerTop = container.scrollTop;
    const containerHeight = container.clientHeight;
    if (containerHeight <= 0) return;

    const maxAllowedBuffer = Math.floor(containerHeight * 0.25);
    const idealBuffer = rowHeight * 3;
    const buffer = Math.min(idealBuffer, Math.max(rowHeight, maxAllowedBuffer));

    const isAbove = rowTop < containerTop + buffer;
    const isBelow = rowTop + rowHeight > containerTop + containerHeight - buffer;

    if (isAbove || isBelow) {
      const maxScroll = Math.max(0, container.scrollHeight - containerHeight);
      let targetScroll = containerTop;

      if (isAbove) {
        targetScroll = rowTop - buffer;
      } else {
        targetScroll = rowTop + rowHeight + buffer - containerHeight;
      }

      const clampedScroll = Math.min(Math.max(0, targetScroll), maxScroll);
      if (Math.abs(clampedScroll - containerTop) < 1) return;

      const now = Date.now();
      const isRapidStep = now - lastScrollTimeRef.current < 350;
      lastScrollTimeRef.current = now;

      const prefersReducedMotion =
        typeof window !== 'undefined' &&
        typeof window.matchMedia === 'function' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      const behavior: ScrollBehavior = prefersReducedMotion || isRapidStep ? 'auto' : 'smooth';

      if (typeof container.scrollTo === 'function') {
        container.scrollTo({ top: clampedScroll, behavior });
      } else {
        container.scrollTop = clampedScroll;
      }
    }
  }, [validActiveLine]);

  return (
    <div
      className={`code-viewer-container ${className}`.trim()}
      role="region"
      aria-label={`${language === 'typescript' ? 'TypeScript' : 'Pseudocode'} viewer`}
    >
      <div className="code-viewer-header">
        <span className="code-viewer-lang-badge">
          {language === 'typescript' ? 'TypeScript' : 'Pseudocode'}
        </span>
        {validActiveLine !== undefined && (
          <span className="code-viewer-active-badge">
            Line {validActiveLine} Active
          </span>
        )}
      </div>

      <div
        ref={scrollContainerRef}
        className="code-viewer-scroll-box"
        tabIndex={0}
        role="group"
        aria-label="Code content"
      >
        <table className="code-viewer-table">
          <tbody>
            {highlightedLines.map((line) => {
              const lineNumber = line.lineNumber;
              const isActive = validActiveLine === lineNumber;

              return (
                <tr
                  key={`line-${lineNumber}`}
                  ref={(el) => {
                    if (el) {
                      rowRefs.current.set(lineNumber, el);
                    } else {
                      rowRefs.current.delete(lineNumber);
                    }
                  }}
                  className={`code-line-row ${isActive ? 'code-line-active' : ''}`.trim()}
                  aria-current={isActive ? 'true' : undefined}
                >
                  <td className="code-line-number" aria-hidden="true">
                    {lineNumber}
                  </td>
                  <td className="code-line-indicator" aria-hidden="true">
                    {isActive ? '▶' : ''}
                  </td>
                  <td className="code-line-code">
                    <pre className="code-line-pre">
                      <code>
                        {line.tokens.map((token, tokenIdx) => (
                          <span
                            key={`t-${lineNumber}-${tokenIdx}`}
                            className={token.className}
                          >
                            {token.content}
                          </span>
                        ))}
                      </code>
                    </pre>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
