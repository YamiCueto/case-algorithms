import React from 'react';

export type NodeVisualState =
  | 'default'
  | 'active'
  | 'comparing'
  | 'swapping'
  | 'sorted'
  | 'discarded';

export type NodeShape = 'rect' | 'circle';

export type EdgeStyle = 'solid' | 'dashed' | 'dotted';

export type PointerDirection = 'top' | 'bottom' | 'left' | 'right';

export type HighlightVariant = 'primary' | 'comparing' | 'swapping' | 'sorted' | 'subtle';

export interface ViewBoxDimensions {
  readonly x?: number;
  readonly y?: number;
  readonly width: number;
  readonly height: number;
}

export interface SVGViewportProps extends React.SVGProps<SVGSVGElement> {
  readonly viewBoxDimensions?: ViewBoxDimensions;
  readonly showGrid?: boolean;
  readonly title?: string;
  readonly description?: string;
  readonly children: React.ReactNode;
}

export interface VisualNodeProps {
  readonly id?: string;
  readonly x: number;
  readonly y: number;
  readonly width?: number;
  readonly height?: number;
  readonly radius?: number;
  readonly shape?: NodeShape;
  readonly label: string | number;
  readonly subLabel?: string | number;
  readonly state?: NodeVisualState;
  readonly isSelected?: boolean;
  readonly className?: string;
  readonly onClick?: () => void;
}

export interface VisualEdgeProps {
  readonly id?: string;
  readonly from: { readonly x: number; readonly y: number };
  readonly to: { readonly x: number; readonly y: number };
  readonly styleVariant?: EdgeStyle;
  readonly isDirected?: boolean;
  readonly isActive?: boolean;
  readonly label?: string | number;
  readonly color?: string;
  readonly strokeWidth?: number;
  readonly className?: string;
}

export interface VisualPointerProps {
  readonly id?: string;
  readonly x: number;
  readonly y: number;
  readonly label: string;
  readonly direction?: PointerDirection;
  readonly colorVar?: string;
  readonly length?: number;
  readonly className?: string;
}

export interface VisualHighlightProps {
  readonly id?: string;
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  readonly variant?: HighlightVariant;
  readonly shape?: 'rect' | 'ellipse';
  readonly label?: string;
  readonly className?: string;
}

export interface VisualLabelProps {
  readonly id?: string;
  readonly x: number;
  readonly y: number;
  readonly text: string | number;
  readonly variant?: 'default' | 'accent' | 'muted';
  readonly fontType?: 'mono' | 'sans';
  readonly anchor?: 'start' | 'middle' | 'end';
  readonly fontSize?: number;
  readonly className?: string;
}
