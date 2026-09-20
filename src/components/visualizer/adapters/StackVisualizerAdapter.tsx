import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { ExecutionStep } from '@/core/types';
import { StackState } from '@/core/data-structures/stack';
import { SVGViewport } from '../SVGViewport';
import { VisualNode } from '../VisualNode';
import { VisualPointer } from '../VisualPointer';
import { VisualHighlight } from '../VisualHighlight';
import { VisualLabel } from '../VisualLabel';
import { StackTransitionContext } from './stackTransitionTypes';
import { useStackAnimation } from './useStackAnimation';

export interface StackVisualizerAdapterProps {
  readonly step: ExecutionStep<StackState> | null;
  readonly viewBoxWidth?: number;
  readonly viewBoxHeight?: number;
  readonly onNodeClick?: (index: number, value: number) => void;
  readonly transitionContext?: StackTransitionContext;
}

export const StackVisualizerAdapter: React.FC<StackVisualizerAdapterProps> = ({
  step,
  viewBoxWidth = 800,
  viewBoxHeight = 360,
  onNodeClick,
  transitionContext,
}) => {
  const { t } = useTranslation(['stack']);
  const containerRef = useRef<SVGGElement | null>(null);

  const nodeWidth = 160;
  const nodeHeight = 34;
  const gap = 6;
  const centerX = viewBoxWidth / 2 - 40;
  const baseY = viewBoxHeight - 55;
  const maxCapacity = step?.state.capacity || 8;

  const stackWallLeft = centerX - nodeWidth / 2 - 10;
  const stackWallRight = centerX + nodeWidth / 2 + 10;
  const stackWallTop = baseY - maxCapacity * (nodeHeight + gap) - 8;
  const stackWallBottom = baseY + 4;

  const getItemY = (index: number) => {
    return baseY - (index + 1) * (nodeHeight + gap) + gap / 2;
  };

  const { ghostNode } = useStackAnimation({
    step,
    transitionContext,
    containerRef,
    getItemY,
    stackWallTop,
    nodeHeight,
    gap,
  });

  if (!step) {
    return (
      <SVGViewport
        viewBoxDimensions={{ width: viewBoxWidth, height: viewBoxHeight }}
        title={t('stack:canvas.title')}
        description={t('stack:canvas.noData')}
      >
        <VisualLabel
          x={viewBoxWidth / 2}
          y={viewBoxHeight / 2}
          text={t('stack:canvas.noData')}
          variant="muted"
          fontType="sans"
        />
      </SVGViewport>
    );
  }

  const { items, topIndex, operation } = step.state;

  const isOverflow = operation === 'OVERFLOW';
  const isUnderflow = operation === 'UNDERFLOW';
  const isPeek = operation === 'PEEK';
  const isPop = operation === 'POP';
  const isPush = operation === 'PUSH';

  return (
    <SVGViewport
      viewBoxDimensions={{ width: viewBoxWidth, height: viewBoxHeight }}
      title={t('stack:canvas.title')}
      description={step.a11yMessage}
    >
      <g ref={containerRef} className="stack-visualizer-root">
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
          text={t('stack:canvas.capacity', { capacity: maxCapacity })}
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

        {items.length === 0 && !isUnderflow && !ghostNode && (
          <VisualLabel
            x={centerX}
            y={baseY - 30}
            text={t('stack:canvas.emptyNotice')}
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
            else if (isPop) nodeState = 'default';
            else if (isPeek) nodeState = 'comparing';
            else nodeState = 'active';
          }

          return (
            <g key={`stack-slot-${idx}`} className="stack-slot-group" data-slot-index={idx}>
              <VisualLabel
                x={stackWallLeft - 10}
                y={itemY + nodeHeight / 2}
                text={`[${idx}]`}
                variant="muted"
                fontType="mono"
                anchor="end"
                fontSize={10}
              />

              <g
                transform={`translate(${centerX}, ${itemY + nodeHeight / 2})`}
                className="stack-slot-anchor"
              >
                <g className="stack-slot-motion" data-slot-index={idx}>
                  {isTop && isPeek && (
                    <VisualHighlight
                      x={-(nodeWidth + 8) / 2}
                      y={-(nodeHeight + 8) / 2}
                      width={nodeWidth + 8}
                      height={nodeHeight + 8}
                      variant="comparing"
                    />
                  )}
                  {isTop && isPush && (
                    <VisualHighlight
                      x={-(nodeWidth + 8) / 2}
                      y={-(nodeHeight + 8) / 2}
                      width={nodeWidth + 8}
                      height={nodeHeight + 8}
                      variant="primary"
                    />
                  )}
                  <VisualNode
                    x={0}
                    y={0}
                    width={nodeWidth}
                    height={nodeHeight}
                    shape="rect"
                    label={val}
                    state={nodeState}
                    onClick={onNodeClick ? () => onNodeClick(idx, val) : undefined}
                  />
                </g>
              </g>
            </g>
          );
        })}

        {ghostNode && (
          <g
            key={ghostNode.id}
            transform={`translate(${centerX}, ${getItemY(ghostNode.originalIndex) + nodeHeight / 2})`}
            className="stack-ghost-anchor"
            aria-hidden="true"
          >
            <g className="stack-ghost-motion" data-ghost-id={ghostNode.id}>
              <VisualHighlight
                x={-(nodeWidth + 8) / 2}
                y={-(nodeHeight + 8) / 2}
                width={nodeWidth + 8}
                height={nodeHeight + 8}
                variant="swapping"
              />
              <VisualNode
                x={0}
                y={0}
                width={nodeWidth}
                height={nodeHeight}
                shape="rect"
                label={ghostNode.value}
                state="swapping"
              />
            </g>
          </g>
        )}

        <g
          transform={`translate(${stackWallRight + 6}, ${topIndex >= 0 ? getItemY(topIndex) + nodeHeight / 2 : baseY - 14})`}
          className="stack-pointer-anchor"
        >
          <g className="stack-pointer-motion">
            <VisualPointer
              x={0}
              y={0}
              label={topIndex >= 0 ? (isPeek ? 'PEEK (TOP)' : 'TOP') : 'TOP (null)'}
              direction="right"
              length={32}
              colorVar={
                topIndex >= 0
                  ? isPeek
                    ? 'var(--accent-amber)'
                    : isPop
                      ? 'var(--accent-rose)'
                      : 'var(--accent-cyan)'
                  : 'var(--text-muted)'
              }
            />
          </g>
        </g>
      </g>
    </SVGViewport>
  );
};
