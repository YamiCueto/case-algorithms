import React from 'react';
import { ExecutionStep } from '@/core/types';
import { StackState } from '@/core/data-structures/stack';
import { SVGViewport } from '../SVGViewport';
import { VisualNode } from '../VisualNode';
import { VisualPointer } from '../VisualPointer';
import { VisualHighlight } from '../VisualHighlight';
import { VisualLabel } from '../VisualLabel';

export interface StackVisualizerAdapterProps {
  readonly step: ExecutionStep<StackState> | null;
  readonly viewBoxWidth?: number;
  readonly viewBoxHeight?: number;
  readonly onNodeClick?: (index: number, value: number) => void;
}

export const StackVisualizerAdapter: React.FC<StackVisualizerAdapterProps> = ({
  step,
  viewBoxWidth = 800,
  viewBoxHeight = 360,
  onNodeClick,
}) => {
  if (!step) {
    return (
      <SVGViewport
        viewBoxDimensions={{ width: viewBoxWidth, height: viewBoxHeight }}
        title="Stack Visualization Canvas"
        description="No stack state available. Use controls to perform stack operations."
      >
        <VisualLabel
          x={viewBoxWidth / 2}
          y={viewBoxHeight / 2}
          text="No stack data available. Perform an operation to begin."
          variant="muted"
          fontType="sans"
        />
      </SVGViewport>
    );
  }

  const { items, topIndex, capacity, operation } = step.state;
  const maxCapacity = capacity || 8;

  const nodeWidth = 160;
  const nodeHeight = 34;
  const gap = 6;
  const centerX = viewBoxWidth / 2 - 40;
  const baseY = viewBoxHeight - 55;

  const stackWallLeft = centerX - nodeWidth / 2 - 10;
  const stackWallRight = centerX + nodeWidth / 2 + 10;
  const stackWallTop = baseY - maxCapacity * (nodeHeight + gap) - 8;
  const stackWallBottom = baseY + 4;

  const getItemY = (index: number) => {
    return baseY - (index + 1) * (nodeHeight + gap) + gap / 2;
  };

  const isOverflow = operation === 'OVERFLOW';
  const isUnderflow = operation === 'UNDERFLOW';
  const isPeek = operation === 'PEEK';
  const isPop = operation === 'POP';
  const isPush = operation === 'PUSH';

  return (
    <SVGViewport
      viewBoxDimensions={{ width: viewBoxWidth, height: viewBoxHeight }}
      title="Stack Visualization Canvas"
      description={step.a11yMessage}
    >
      <VisualLabel
        x={viewBoxWidth / 2}
        y={28}
        text={step.description}
        variant={isOverflow || isUnderflow ? 'default' : 'accent'}
        fontType="mono"
        fontSize={13}
      />

      <path
        d={`M ${stackWallLeft} ${stackWallTop} L ${stackWallLeft} ${stackWallBottom} L ${stackWallRight} ${stackWallBottom} L ${stackWallRight} ${stackWallTop}`}
        fill="none"
        stroke="var(--border-subtle)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="stack-container-outline"
      />

      <VisualLabel
        x={stackWallLeft - 12}
        y={baseY - 4}
        text="[0] Base"
        variant="muted"
        fontType="mono"
        anchor="end"
        fontSize={10}
      />

      <VisualLabel
        x={stackWallLeft - 12}
        y={stackWallTop + 12}
        text={`Cap: ${maxCapacity}`}
        variant="muted"
        fontType="mono"
        anchor="end"
        fontSize={10}
      />

      {isOverflow && (
        <VisualHighlight
          x={centerX - nodeWidth / 2 - 4}
          y={stackWallTop - nodeHeight - 6}
          width={nodeWidth + 8}
          height={nodeHeight + 8}
          variant="swapping"
        />
      )}

      {isUnderflow && (
        <VisualHighlight
          x={centerX - nodeWidth / 2 - 4}
          y={baseY - nodeHeight - 4}
          width={nodeWidth + 8}
          height={nodeHeight + 8}
          variant="swapping"
        />
      )}

      {items.length === 0 && !isUnderflow && (
        <VisualLabel
          x={centerX}
          y={baseY - 30}
          text="Stack is Empty (0 items)"
          variant="muted"
          fontType="sans"
          fontSize={12}
        />
      )}

      {items.map((val, idx) => {
        const itemY = getItemY(idx);
        const isTop = idx === topIndex;

        let nodeState: 'default' | 'active' | 'comparing' | 'swapping' | 'sorted' = 'default';
        if (isTop) {
          if (isPush) nodeState = 'active';
          else if (isPop) nodeState = 'swapping';
          else if (isPeek) nodeState = 'comparing';
          else nodeState = 'active';
        }

        return (
          <g key={`stack-node-${idx}-${val}`}>
            <VisualLabel
              x={stackWallLeft - 10}
              y={itemY + nodeHeight / 2}
              text={`[${idx}]`}
              variant="muted"
              fontType="mono"
              anchor="end"
              fontSize={10}
            />

            {isTop && isPeek && (
              <VisualHighlight
                x={centerX - nodeWidth / 2 - 4}
                y={itemY - 4}
                width={nodeWidth + 8}
                height={nodeHeight + 8}
                variant="comparing"
              />
            )}
            {isTop && isPop && (
              <VisualHighlight
                x={centerX - nodeWidth / 2 - 4}
                y={itemY - 4}
                width={nodeWidth + 8}
                height={nodeHeight + 8}
                variant="swapping"
              />
            )}
            {isTop && isPush && (
              <VisualHighlight
                x={centerX - nodeWidth / 2 - 4}
                y={itemY - 4}
                width={nodeWidth + 8}
                height={nodeHeight + 8}
                variant="primary"
              />
            )}
            <VisualNode
              x={centerX}
              y={itemY + nodeHeight / 2}
              width={nodeWidth}
              height={nodeHeight}
              shape="rect"
              label={val}
              state={nodeState}
              onClick={onNodeClick ? () => onNodeClick(idx, val) : undefined}
            />
          </g>
        );
      })}

      {topIndex >= 0 ? (
        <VisualPointer
          x={stackWallRight + 6}
          y={getItemY(topIndex) + nodeHeight / 2}
          label={isPeek ? 'PEEK (TOP)' : 'TOP'}
          direction="right"
          length={32}
          colorVar={isPeek ? 'var(--accent-amber)' : isPop ? 'var(--accent-rose)' : 'var(--accent-cyan)'}
        />
      ) : (
        <VisualPointer
          x={stackWallRight + 6}
          y={baseY - 14}
          label="TOP (null)"
          direction="right"
          length={32}
          colorVar="var(--text-muted)"
        />
      )}
    </SVGViewport>
  );
};
