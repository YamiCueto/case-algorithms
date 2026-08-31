import React from 'react';
import { VisualNodeProps } from './types';

export const VisualNode: React.FC<VisualNodeProps> = ({
  id,
  x,
  y,
  width = 56,
  height = 56,
  radius = 28,
  shape = 'rect',
  label,
  subLabel,
  state = 'default',
  isSelected = false,
  className = '',
  onClick,
}) => {
  const isCircle = shape === 'circle';
  const isClickable = Boolean(onClick);

  return (
    <g
      id={id}
      className={`viz-node viz-node-${state} ${isSelected ? 'viz-node-selected' : ''} ${isClickable ? 'viz-node-clickable' : ''} ${className}`.trim()}
      onClick={onClick}
    >
      {isCircle ? (
        <circle
          cx={x}
          cy={y}
          r={radius}
          className="viz-node-shape"
        />
      ) : (
        <rect
          x={x - width / 2}
          y={y - height / 2}
          width={width}
          height={height}
          rx={8}
          ry={8}
          className="viz-node-shape"
        />
      )}

      <text
        x={x}
        y={subLabel !== undefined ? y - 2 : y + 1}
        textAnchor="middle"
        dominantBaseline="middle"
        className="viz-node-label"
      >
        {label}
      </text>

      {subLabel !== undefined && (
        <text
          x={x}
          y={isCircle ? y + radius + 14 : y + height / 2 + 14}
          textAnchor="middle"
          dominantBaseline="middle"
          className="viz-node-sublabel"
        >
          {subLabel}
        </text>
      )}
    </g>
  );
};
