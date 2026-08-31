import React from 'react';
import { VisualPointerProps } from './types';

export const VisualPointer: React.FC<VisualPointerProps> = ({
  id,
  x,
  y,
  label,
  direction = 'top',
  colorVar = 'var(--accent-cyan)',
  length = 32,
  className = '',
}) => {
  let lineX1 = x;
  let lineY1 = y;
  let lineX2 = x;
  let lineY2 = y;
  let labelX = x;
  let labelY = y;
  let arrowHeadPath = '';

  switch (direction) {
    case 'top':
      lineY1 = y - length;
      lineY2 = y - 4;
      labelX = x;
      labelY = y - length - 12;
      arrowHeadPath = `M ${x - 4} ${y - 8} L ${x} ${y} L ${x + 4} ${y - 8} Z`;
      break;
    case 'bottom':
      lineY1 = y + length;
      lineY2 = y + 4;
      labelX = x;
      labelY = y + length + 14;
      arrowHeadPath = `M ${x - 4} ${y + 8} L ${x} ${y} L ${x + 4} ${y + 8} Z`;
      break;
    case 'left':
      lineX1 = x - length;
      lineX2 = x - 4;
      labelX = x - length - 16;
      labelY = y;
      arrowHeadPath = `M ${x - 8} ${y - 4} L ${x} ${y} L ${x - 8} ${y + 4} Z`;
      break;
    case 'right':
      lineX1 = x + length;
      lineX2 = x + 4;
      labelX = x + length + 16;
      labelY = y;
      arrowHeadPath = `M ${x + 8} ${y - 4} L ${x} ${y} L ${x + 8} ${y + 4} Z`;
      break;
  }

  const pillWidth = Math.max(24, label.length * 9 + 12);
  const pillHeight = 20;

  return (
    <g
      id={id}
      className={`viz-pointer viz-pointer-${direction} ${className}`.trim()}
    >
      <line
        x1={lineX1}
        y1={lineY1}
        x2={lineX2}
        y2={lineY2}
        stroke={colorVar}
        strokeWidth={2}
        className="viz-pointer-line"
      />

      <path d={arrowHeadPath} fill={colorVar} className="viz-pointer-arrow" />

      <g className="viz-pointer-label-group">
        <rect
          x={labelX - pillWidth / 2}
          y={labelY - pillHeight / 2}
          width={pillWidth}
          height={pillHeight}
          rx={4}
          ry={4}
          fill="var(--bg-surface-secondary)"
          stroke={colorVar}
          strokeWidth={1}
          className="viz-pointer-label-bg"
        />
        <text
          x={labelX}
          y={labelY + 1}
          textAnchor="middle"
          dominantBaseline="middle"
          fill={colorVar}
          className="viz-pointer-label-text"
        >
          {label}
        </text>
      </g>
    </g>
  );
};
