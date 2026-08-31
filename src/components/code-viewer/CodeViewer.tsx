import React from 'react';

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
  const lines = code.split('\n');
  const validActiveLine =
    typeof activeLine === 'number' && Number.isInteger(activeLine) && activeLine >= 1 && activeLine <= lines.length
      ? activeLine
      : undefined;

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
        className="code-viewer-scroll-box"
        tabIndex={0}
        role="group"
        aria-label="Code content"
      >
        <table className="code-viewer-table">
          <tbody>
            {lines.map((lineText, index) => {
              const lineNumber = index + 1;
              const isActive = validActiveLine === lineNumber;

              return (
                <tr
                  key={`line-${lineNumber}`}
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
                      <code>{lineText || ' '}</code>
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
