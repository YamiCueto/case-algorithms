import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { ExecutionStep } from '@/core/types';
import { QueueState } from '@/core/data-structures/queue';
import { NodeVisualState, HighlightVariant } from '../types';
import { SVGViewport } from '../SVGViewport';
import { VisualNode } from '../VisualNode';
import { VisualPointer } from '../VisualPointer';
import { VisualHighlight } from '../VisualHighlight';
import { VisualLabel } from '../VisualLabel';
import { QueueTransitionContext } from './queueTransitionTypes';
import { useQueueAnimation } from './useQueueAnimation';

export interface QueueVisualizerAdapterProps {
  readonly step: ExecutionStep<QueueState> | null;
  readonly transitionContext?: QueueTransitionContext;
  readonly viewBoxWidth?: number;
  readonly viewBoxHeight?: number;
  readonly onNodeClick?: (index: number, value: number) => void;
}

export const QueueVisualizerAdapter: React.FC<QueueVisualizerAdapterProps> = ({
  step,
  transitionContext,
  viewBoxWidth = 800,
  viewBoxHeight = 360,
  onNodeClick,
}) => {
  const { t } = useTranslation(['queue']);
  const containerRef = useRef<SVGGElement | null>(null);

  const { ghostNode } = useQueueAnimation({
    step,
    transitionContext,
    containerRef,
  });

  if (!step) {
    return (
      <SVGViewport
        viewBoxDimensions={{ width: viewBoxWidth, height: viewBoxHeight }}
        title={t('queue:canvas.title')}
        description={t('queue:canvas.emptyDescription')}
      >
        <VisualLabel
          x={viewBoxWidth / 2}
          y={viewBoxHeight / 2}
          text={t('queue:canvas.noData')}
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
      title={t('queue:canvas.title')}
      description={step.a11yMessage}
    >
      <g ref={containerRef} className="queue-stage-container">
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
          text={t('queue:canvas.outflow')}
          variant="muted"
          fontType="mono"
          anchor="end"
          fontSize={11}
        />

        <VisualLabel
          x={pipeRight + 10}
          y={centerY}
          text={t('queue:canvas.inflow')}
          variant="muted"
          fontType="mono"
          anchor="start"
          fontSize={11}
        />

        <VisualLabel
          x={startX}
          y={pipeTop - 12}
          text={t('queue:canvas.bufferCapacity', { capacity: maxCapacity, count })}
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
            <g key={`queue-node-${i}-${val}`} id={`queue-slot-${i}`}>
              <VisualNode
                id={`queue-node-${i}`}
                className="queue-node-motion"
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

        {ghostNode && (
          <g key={ghostNode.id} className="queue-ghost-group">
            <VisualNode
              id="queue-ghost-node"
              className="queue-ghost-motion"
              x={getSlotX(ghostNode.slotIndex)}
              y={centerY}
              width={nodeWidth}
              height={nodeHeight}
              label={ghostNode.value}
              state="swapping"
              shape="rect"
            />
          </g>
        )}

        {frontIndex >= 0 && (
          <g className="queue-pointer-motion queue-front-pointer-motion">
            <VisualPointer
              x={frontNodeX}
              y={centerY + nodeHeight / 2 + 28}
              label={t('queue:canvas.frontLabel')}
              direction="bottom"
              colorVar="var(--accent-cyan)"
              length={24}
            />
          </g>
        )}

        {rearIndex >= 0 && (
          <g className="queue-pointer-motion queue-rear-pointer-motion">
            <VisualPointer
              x={rearNodeX}
              y={centerY - nodeHeight / 2 - 28}
              label={t('queue:canvas.rearLabel')}
              direction="top"
              colorVar="var(--accent-amber)"
              length={24}
            />
          </g>
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
      </g>
    </SVGViewport>
  );
};
