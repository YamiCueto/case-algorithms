import React from 'react';
import { ExecutionStep } from '@/core/types';
import { QueueState } from '@/core/data-structures/queue';
import { NodeVisualState, HighlightVariant } from '../types';
import { SVGViewport } from '../SVGViewport';
import { VisualNode } from '../VisualNode';
import { VisualPointer } from '../VisualPointer';
import { VisualHighlight } from '../VisualHighlight';
import { VisualLabel } from '../VisualLabel';

export interface QueueVisualizerAdapterProps {
  readonly step: ExecutionStep<QueueState> | null;
  readonly viewBoxWidth?: number;
  readonly viewBoxHeight?: number;
  readonly onNodeClick?: (index: number, value: number) => void;
}

export const QueueVisualizerAdapter: React.FC<QueueVisualizerAdapterProps> = ({
  step,
  viewBoxWidth = 800,
  viewBoxHeight = 360,
  onNodeClick,
}) => {
  if (!step) {
    return (
      <SVGViewport
        viewBoxDimensions={{ width: viewBoxWidth, height: viewBoxHeight }}
        title="Queue Visualization Canvas"
        description="No queue state available. Use controls to perform queue operations."
      >
        <VisualLabel
          x={viewBoxWidth / 2}
          y={viewBoxHeight / 2}
          text="No queue data available. Perform an operation to begin."
          variant="muted"
          fontType="sans"
        />
      </SVGViewport>
    );
  }

  const { buffer, frontIndex, rearIndex, count, capacity } = step.state;
  const maxCapacity = capacity || 8;
  const action = step.action;

  const isOverflow = action === 'OVERFLOW';
  const isUnderflow = action === 'UNDERFLOW';
  const isEnqueue = action === 'ENQUEUE';
  const isDequeue = action === 'DEQUEUE';
  const isPeek = action === 'PEEK_FRONT';

  const nodeWidth = 56;
  const nodeHeight = 56;
  const gap = 12;

  const totalSlotWidth = maxCapacity * nodeWidth + (maxCapacity - 1) * gap;
  const startX = (viewBoxWidth - totalSlotWidth) / 2;
  const centerY = viewBoxHeight / 2 - 10;

  const pipeLeft = startX - 24;
  const pipeRight = startX + totalSlotWidth + 24;
  const pipeTop = centerY - nodeHeight / 2 - 10;
  const pipeBottom = centerY + nodeHeight / 2 + 10;

  const getSlotX = (index: number) => {
    return startX + index * (nodeWidth + gap) + nodeWidth / 2;
  };

  const frontNodeX = frontIndex >= 0 ? getSlotX(frontIndex) : startX + nodeWidth / 2;
  const rearNodeX = rearIndex >= 0 ? getSlotX(rearIndex) : startX + nodeWidth / 2;

  return (
    <SVGViewport
      viewBoxDimensions={{ width: viewBoxWidth, height: viewBoxHeight }}
      title="Queue Visualization Canvas"
      description={step.a11yMessage}
    >
      <VisualLabel
        x={viewBoxWidth / 2}
        y={26}
        text={step.description}
        variant={isOverflow || isUnderflow ? 'default' : 'accent'}
        fontType="mono"
        fontSize={13}
      />

      <line
        x1={pipeLeft}
        y1={pipeTop}
        x2={pipeRight}
        y2={pipeTop}
        stroke="var(--border-subtle)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <line
        x1={pipeLeft}
        y1={pipeBottom}
        x2={pipeRight}
        y2={pipeBottom}
        stroke="var(--border-subtle)"
        strokeWidth="3"
        strokeLinecap="round"
      />

      <VisualLabel
        x={pipeLeft - 10}
        y={centerY}
        text="⮜ Outflow (FRONT)"
        variant="muted"
        fontType="mono"
        anchor="end"
        fontSize={11}
      />

      <VisualLabel
        x={pipeRight + 10}
        y={centerY}
        text="⮜ Inflow (REAR)"
        variant="muted"
        fontType="mono"
        anchor="start"
        fontSize={11}
      />

      <VisualLabel
        x={startX}
        y={pipeTop - 12}
        text={`Buffer Capacity: ${maxCapacity} | Count: ${count}`}
        variant="muted"
        fontType="mono"
        anchor="start"
        fontSize={11}
      />

      {Array.from({ length: maxCapacity }).map((_, i) => {
        const slotX = startX + i * (nodeWidth + gap);
        const slotY = centerY - nodeHeight / 2;
        const hasItem = buffer && buffer[i] !== null && buffer[i] !== undefined;

        return (
          <g key={`slot-${i}`}>
            <rect
              x={slotX}
              y={slotY}
              width={nodeWidth}
              height={nodeHeight}
              rx="8"
              fill={hasItem ? 'transparent' : 'rgba(255, 255, 255, 0.02)'}
              stroke="var(--border-subtle)"
              strokeWidth="1"
              strokeDasharray={hasItem ? 'none' : '4 4'}
            />
            <VisualLabel
              x={slotX + nodeWidth / 2}
              y={pipeBottom + 16}
              text={`[${i}]`}
              variant="muted"
              fontType="mono"
              fontSize={10}
            />
          </g>
        );
      })}

      {buffer.map((val, i) => {
        if (val === null || val === undefined) {
          return null;
        }

        const nodeCenterX = getSlotX(i);
        const isCurrentRear = isEnqueue && i === rearIndex;
        const isCurrentFront = (isDequeue || isPeek) && i === frontIndex;

        let nodeState: NodeVisualState = 'default';
        let highlightVariant: HighlightVariant = 'primary';

        if (isCurrentRear) {
          nodeState = 'active';
          highlightVariant = 'primary';
        } else if (isCurrentFront) {
          nodeState = isPeek ? 'comparing' : 'swapping';
          highlightVariant = isPeek ? 'comparing' : 'swapping';
        }

        return (
          <g key={`queue-node-${i}-${val}`}>
            <VisualNode
              x={nodeCenterX}
              y={centerY}
              width={nodeWidth}
              height={nodeHeight}
              label={val}
              state={nodeState}
              shape="rect"
              onClick={() => onNodeClick?.(i, val)}
            />

            {(isCurrentRear || isCurrentFront) && (
              <VisualHighlight
                x={nodeCenterX - nodeWidth / 2 - 4}
                y={centerY - nodeHeight / 2 - 4}
                width={nodeWidth + 8}
                height={nodeHeight + 8}
                variant={highlightVariant}
                shape="rect"
              />
            )}
          </g>
        );
      })}

      {frontIndex >= 0 && (
        <VisualPointer
          x={frontNodeX}
          y={centerY + nodeHeight / 2 + 28}
          label="FRONT"
          direction="bottom"
          colorVar="var(--accent-cyan)"
          length={24}
        />
      )}

      {rearIndex >= 0 && (
        <VisualPointer
          x={rearNodeX}
          y={centerY - nodeHeight / 2 - 28}
          label="REAR"
          direction="top"
          colorVar="var(--accent-amber)"
          length={24}
        />
      )}

      {isOverflow && (
        <VisualHighlight
          x={pipeRight - 20}
          y={pipeTop - 6}
          width={40}
          height={pipeBottom - pipeTop + 12}
          variant="swapping"
          shape="rect"
        />
      )}

      {isUnderflow && (
        <VisualHighlight
          x={pipeLeft - 20}
          y={pipeTop - 6}
          width={40}
          height={pipeBottom - pipeTop + 12}
          variant="swapping"
          shape="rect"
        />
      )}
    </SVGViewport>
  );
};
