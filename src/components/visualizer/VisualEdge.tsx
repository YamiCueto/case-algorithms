import React from 'react';
import { VisualEdgeProps } from './types';
import { useSVGViewport } from './context';

export const VisualEdge: React.FC<VisualEdgeProps> = ({
  id,
  from,
  to,
  styleVariant = 'solid',
  isDirected = false,
  isActive = false,
  label,
  color,
  strokeWidth = 2,
  className = '',
}) => {
  const { markerArrowId, markerArrowActiveId } = useSVGViewport();
  const midX = (from.x + to.x) / 2;
  const midY = (from.y + to.y) / 2;

  const getStrokeDashArray = () => {
    switch (styleVariant) {
      case 'dashed':
        return '6,6';
      case 'dotted':
        return '2,4';
      case 'solid':
      default:
        return undefined;
    }
  };

  const markerId = isDirected
    ? isActive
      ? `url(#${markerArrowActiveId})`
      : `url(#${markerArrowId})`
    : undefined;

  const labelStr = label !== undefined ? String(label) : '';
  const labelWidth = Math.max(28, labelStr.length * 8 + 12);
  const labelHeight = 20;

  return (
    <g
      id={id}
      className={`viz-edge ${isActive ? 'viz-edge-active' : ''} ${className}`.trim()}
    >
      <line
        x1={from.x}
        y1={from.y}
        x2={to.x}
        y2={to.y}
        stroke={color || (isActive ? 'var(--accent-cyan)' : 'var(--border-highlight)')}
        strokeWidth={strokeWidth}
        strokeDasharray={getStrokeDashArray()}
        markerEnd={markerId}
        className="viz-edge-line"
      />

      {label !== undefined && (
        <g className="viz-edge-label-group">
          <rect
            x={midX - labelWidth / 2}
            y={midY - labelHeight / 2}
            width={labelWidth}
            height={labelHeight}
            rx={4}
            ry={4}
            className="viz-edge-label-bg"
          />
          <text
            x={midX}
            y={midY + 1}
            textAnchor="middle"
            dominantBaseline="middle"
            className="viz-edge-label-text"
          >
            {label}
          </text>
        </g>
      )}
    </g>
  );
};
