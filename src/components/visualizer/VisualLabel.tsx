import React from 'react';
import { VisualLabelProps } from './types';

export const VisualLabel: React.FC<VisualLabelProps> = ({
  id,
  x,
  y,
  text,
  variant = 'default',
  fontType = 'sans',
  anchor = 'middle',
  fontSize = 13,
  className = '',
}) => {
  return (
    <text
      id={id}
      x={x}
      y={y}
      textAnchor={anchor}
      dominantBaseline="middle"
      fontSize={fontSize}
      className={`viz-label viz-label-${variant} viz-label-${fontType} ${className}`.trim()}
    >
      {text}
    </text>
  );
};
