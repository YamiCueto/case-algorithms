import React from 'react';
import { VisualHighlightProps } from './types';

export const VisualHighlight: React.FC<VisualHighlightProps> = ({
  id,
  x,
  y,
  width,
  height,
  variant = 'primary',
  shape = 'rect',
  label,
  className = '',
}) => {
  const isEllipse = shape === 'ellipse';

  return (
    <g
      id={id}
      className={`viz-highlight viz-highlight-${variant} ${className}`.trim()}
    >
      {isEllipse ? (
        <ellipse
          cx={x + width / 2}
          cy={y + height / 2}
          rx={width / 2}
          ry={height / 2}
          className="viz-highlight-shape"
        />
      ) : (
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          rx={10}
          ry={10}
          className="viz-highlight-shape"
        />
      )}

      {label && (
        <text
          x={x + 8}
          y={y + height + 14}
          className="viz-highlight-label"
        >
          {label}
        </text>
      )}
    </g>
  );
};
