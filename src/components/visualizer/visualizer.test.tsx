import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import {
  SVGViewport,
  VisualNode,
  VisualEdge,
  VisualPointer,
  VisualHighlight,
  VisualLabel,
} from './index';

describe('SVG Visualizer Primitives', () => {
  describe('SVGViewport component', () => {
    it('renders with default props and accessible attributes', () => {
      render(
        <SVGViewport title="Main Viewport" description="Canvas area for algorithms">
          <circle cx="50" cy="50" r="10" data-testid="child-element" />
        </SVGViewport>
      );

      const svg = screen.getByRole('img');
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveAttribute('viewBox', '0 0 800 400');
      expect(screen.getByText('Main Viewport')).toBeInTheDocument();
      expect(screen.getByText('Canvas area for algorithms')).toBeInTheDocument();
      expect(screen.getByTestId('child-element')).toBeInTheDocument();
    });

    it('supports custom viewBox dimensions and toggling grid', () => {
      const { container } = render(
        <SVGViewport
          viewBoxDimensions={{ x: 10, y: 20, width: 500, height: 250 }}
          showGrid={false}
        >
          <g />
        </SVGViewport>
      );

      const svg = screen.getByRole('img');
      expect(svg).toHaveAttribute('viewBox', '10 20 500 250');
      expect(container.querySelector('.svg-viewport-grid-bg')).toBeNull();
    });

    it('generates unique instance IDs for defs and markers across simultaneous viewports', () => {
      const { container } = render(
        <div>
          <SVGViewport title="Viewport A">
            <VisualEdge from={{ x: 0, y: 0 }} to={{ x: 10, y: 10 }} isDirected />
          </SVGViewport>
          <SVGViewport title="Viewport B">
            <VisualEdge from={{ x: 0, y: 0 }} to={{ x: 20, y: 20 }} isDirected />
          </SVGViewport>
        </div>
      );

      const svgs = container.querySelectorAll('svg.svg-viewport');
      expect(svgs).toHaveLength(2);

      const patterns = container.querySelectorAll('pattern');
      expect(patterns).toHaveLength(2);
      expect(patterns[0]?.id).not.toBe(patterns[1]?.id);

      const markers = container.querySelectorAll('marker');
      expect(markers.length).toBeGreaterThanOrEqual(4);
      const markerIds = Array.from(markers).map((m) => m.id);
      const uniqueMarkerIds = new Set(markerIds);
      expect(uniqueMarkerIds.size).toBe(markerIds.length);
    });
  });

  describe('VisualNode component', () => {
    it('renders a rectangular node with label and sublabel', () => {
      render(
        <svg>
          <VisualNode x={100} y={100} label="42" subLabel="idx: 0" shape="rect" />
        </svg>
      );

      expect(screen.getByText('42')).toBeInTheDocument();
      expect(screen.getByText('idx: 0')).toBeInTheDocument();
    });

    it('renders a circular node with state and handles click events via CSS class', () => {
      const handleClick = vi.fn();
      render(
        <svg>
          <VisualNode
            x={150}
            y={150}
            shape="circle"
            radius={30}
            label="Root"
            state="active"
            onClick={handleClick}
          />
        </svg>
      );

      const nodeText = screen.getByText('Root');
      expect(nodeText).toBeInTheDocument();
      const nodeGroup = nodeText.closest('g');
      expect(nodeGroup).toHaveClass('viz-node-active');
      expect(nodeGroup).toHaveClass('viz-node-clickable');

      if (nodeGroup) {
        fireEvent.click(nodeGroup);
        expect(handleClick).toHaveBeenCalledTimes(1);
      }
    });

    it('applies visual states correctly', () => {
      const { rerender } = render(
        <svg>
          <VisualNode x={50} y={50} label="Val" state="comparing" />
        </svg>
      );
      expect(screen.getByText('Val').closest('g')).toHaveClass('viz-node-comparing');

      rerender(
        <svg>
          <VisualNode x={50} y={50} label="Val" state="swapping" />
        </svg>
      );
      expect(screen.getByText('Val').closest('g')).toHaveClass('viz-node-swapping');

      rerender(
        <svg>
          <VisualNode x={50} y={50} label="Val" state="sorted" />
        </svg>
      );
      expect(screen.getByText('Val').closest('g')).toHaveClass('viz-node-sorted');

      rerender(
        <svg>
          <VisualNode x={50} y={50} label="Val" state="discarded" />
        </svg>
      );
      expect(screen.getByText('Val').closest('g')).toHaveClass('viz-node-discarded');
    });
  });

  describe('VisualEdge component', () => {
    it('renders a line with coordinates and directed arrowhead from viewport context', () => {
      const { container } = render(
        <SVGViewport>
          <VisualEdge
            from={{ x: 50, y: 50 }}
            to={{ x: 200, y: 200 }}
            isDirected={true}
            isActive={true}
            label="weight: 5"
          />
        </SVGViewport>
      );

      const line = container.querySelector('line.viz-edge-line');
      expect(line).toHaveAttribute('x1', '50');
      expect(line).toHaveAttribute('y1', '50');
      expect(line).toHaveAttribute('x2', '200');
      expect(line).toHaveAttribute('y2', '200');
      expect(line?.getAttribute('marker-end')).toMatch(/url\(#:r.*:\)/);
      expect(screen.getByText('weight: 5')).toBeInTheDocument();
    });

    it('dynamically sizes label background for short and long labels', () => {
      const { container, rerender } = render(
        <svg>
          <VisualEdge from={{ x: 0, y: 0 }} to={{ x: 100, y: 100 }} label="5" />
        </svg>
      );

      const shortRect = container.querySelector('rect.viz-edge-label-bg');
      const shortWidth = Number(shortRect?.getAttribute('width'));
      expect(shortWidth).toBeGreaterThanOrEqual(28);

      rerender(
        <svg>
          <VisualEdge
            from={{ x: 0, y: 0 }}
            to={{ x: 100, y: 100 }}
            label="cost: 999999 units"
          />
        </svg>
      );

      const longRect = container.querySelector('rect.viz-edge-label-bg');
      const longWidth = Number(longRect?.getAttribute('width'));
      expect(longWidth).toBeGreaterThan(shortWidth);
      expect(screen.getByText('cost: 999999 units')).toBeInTheDocument();
    });

    it('renders dashed and dotted styles', () => {
      const { container, rerender } = render(
        <svg>
          <VisualEdge from={{ x: 0, y: 0 }} to={{ x: 10, y: 10 }} styleVariant="dashed" />
        </svg>
      );

      expect(container.querySelector('line.viz-edge-line')).toHaveAttribute('stroke-dasharray', '6,6');

      rerender(
        <svg>
          <VisualEdge from={{ x: 0, y: 0 }} to={{ x: 10, y: 10 }} styleVariant="dotted" />
        </svg>
      );
      expect(container.querySelector('line.viz-edge-line')).toHaveAttribute('stroke-dasharray', '2,4');
    });
  });

  describe('VisualPointer component', () => {
    it('renders pointer with label in top and bottom orientations', () => {
      const { rerender } = render(
        <svg>
          <VisualPointer x={100} y={150} label="i" direction="top" />
        </svg>
      );

      expect(screen.getByText('i')).toBeInTheDocument();
      expect(screen.getByText('i').closest('g.viz-pointer')).toHaveClass('viz-pointer-top');

      rerender(
        <svg>
          <VisualPointer x={100} y={150} label="high" direction="bottom" />
        </svg>
      );
      expect(screen.getByText('high')).toBeInTheDocument();
      expect(screen.getByText('high').closest('g.viz-pointer')).toHaveClass('viz-pointer-bottom');
    });

    it('renders left and right orientations', () => {
      const { rerender } = render(
        <svg>
          <VisualPointer x={200} y={200} label="head" direction="left" />
        </svg>
      );
      expect(screen.getByText('head').closest('g.viz-pointer')).toHaveClass('viz-pointer-left');

      rerender(
        <svg>
          <VisualPointer x={200} y={200} label="tail" direction="right" />
        </svg>
      );
      expect(screen.getByText('tail').closest('g.viz-pointer')).toHaveClass('viz-pointer-right');
    });
  });

  describe('VisualHighlight component', () => {
    it('renders rectangular highlight with variant and label', () => {
      render(
        <svg>
          <VisualHighlight
            x={10}
            y={20}
            width={100}
            height={50}
            variant="comparing"
            label="Active Window"
          />
        </svg>
      );

      expect(screen.getByText('Active Window')).toBeInTheDocument();
      expect(screen.getByText('Active Window').closest('g')).toHaveClass('viz-highlight-comparing');
    });

    it('renders ellipse highlight shape', () => {
      const { container } = render(
        <svg>
          <VisualHighlight x={0} y={0} width={80} height={40} shape="ellipse" />
        </svg>
      );

      expect(container.querySelector('ellipse')).toBeInTheDocument();
    });
  });

  describe('VisualLabel component', () => {
    it('renders auxiliary text with custom styling variants', () => {
      render(
        <svg>
          <VisualLabel
            x={50}
            y={80}
            text="Step 3: Pivot Selected"
            variant="accent"
            fontType="mono"
          />
        </svg>
      );

      const label = screen.getByText('Step 3: Pivot Selected');
      expect(label).toBeInTheDocument();
      expect(label).toHaveClass('viz-label-accent');
      expect(label).toHaveClass('viz-label-mono');
    });
  });
});
