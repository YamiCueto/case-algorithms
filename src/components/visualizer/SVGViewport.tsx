import React, { useId } from 'react';
import { SVGViewportProps } from './types';

export const SVGViewport: React.FC<SVGViewportProps> = ({
  viewBoxDimensions = { x: 0, y: 0, width: 800, height: 400 },
  showGrid = true,
  title = 'Algorithm Visualization Viewport',
  description = 'Interactive visual representation of algorithm execution state',
  children,
  className = '',
  style,
  ...props
}) => {
  const gridPatternId = useId();
  const titleId = useId();
  const descId = useId();

  const { x = 0, y = 0, width, height } = viewBoxDimensions;
  const viewBoxStr = `${x} ${y} ${width} ${height}`;

  return (
    <div className={`svg-viewport-container ${className}`.trim()} style={style}>
      <svg
        role="img"
        aria-labelledby={title ? titleId : undefined}
        aria-describedby={description ? descId : undefined}
        viewBox={viewBoxStr}
        preserveAspectRatio="xMidYMid meet"
        className="svg-viewport"
        {...props}
      >
        {title && <title id={titleId}>{title}</title>}
        {description && <desc id={descId}>{description}</desc>}

        <defs>
          {showGrid && (
            <pattern
              id={gridPatternId}
              width="24"
              height="24"
              patternUnits="userSpaceOnUse"
            >
              <circle
                cx="12"
                cy="12"
                r="1"
                fill="var(--border-default)"
                opacity="0.6"
              />
            </pattern>
          )}

          <marker
            id="viz-arrowhead"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 1 L 10 5 L 0 9 z" fill="var(--border-highlight)" />
          </marker>

          <marker
            id="viz-arrowhead-active"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 1 L 10 5 L 0 9 z" fill="var(--accent-cyan)" />
          </marker>
        </defs>

        {showGrid && (
          <rect
            x={x}
            y={y}
            width={width}
            height={height}
            fill={`url(#${gridPatternId})`}
            className="svg-viewport-grid-bg"
            aria-hidden="true"
          />
        )}

        <g className="svg-viewport-content">{children}</g>
      </svg>
    </div>
  );
};
