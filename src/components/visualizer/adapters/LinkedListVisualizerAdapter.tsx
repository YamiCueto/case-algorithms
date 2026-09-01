import React from 'react';
import { ExecutionStep } from '@/core/types';
import { LinkedListState } from '@/core/data-structures/linked-list';
import { NodeVisualState, HighlightVariant } from '../types';
import { SVGViewport } from '../SVGViewport';
import { VisualNode } from '../VisualNode';
import { VisualEdge } from '../VisualEdge';
import { VisualPointer } from '../VisualPointer';
import { VisualHighlight } from '../VisualHighlight';
import { VisualLabel } from '../VisualLabel';

export interface LinkedListVisualizerAdapterProps {
  readonly step: ExecutionStep<LinkedListState> | null;
  readonly viewBoxWidth?: number;
  readonly viewBoxHeight?: number;
  readonly onNodeClick?: (index: number, value: number) => void;
}

export const LinkedListVisualizerAdapter: React.FC<LinkedListVisualizerAdapterProps> = ({
  step,
  viewBoxWidth = 800,
  viewBoxHeight = 360,
  onNodeClick,
}) => {
  if (!step) {
    return (
      <SVGViewport
        viewBoxDimensions={{ width: viewBoxWidth, height: viewBoxHeight }}
        title="Linked List Visualization Canvas"
        description="No linked list data available. Perform an operation to begin."
      >
        <VisualLabel
          x={viewBoxWidth / 2}
          y={viewBoxHeight / 2}
          text="No linked list data available. Perform an operation to begin."
          variant="muted"
          fontType="sans"
        />
      </SVGViewport>
    );
  }

  const { nodes, headId, tailId, size, activeNodeId, targetIndex } = step.state;
  const action = step.action;

  const isFound = action === 'FOUND';
  const isSearch = action === 'SEARCH' || action === 'TRAVERSE';
  const isRemove = action === 'REMOVE_AT';
  const isInsert = action === 'INSERT_AT' || action === 'PREPEND' || action === 'APPEND';
  const isError = action === 'UNDERFLOW' || action === 'NOT_FOUND';

  const nodeWidth = 56;
  const nodeHeight = 56;
  const edgeLength = 48;
  const nullBoxWidth = 52;
  const nullBoxHeight = 36;

  const totalElements = nodes.length;
  const totalChainWidth =
    totalElements === 0
      ? 120
      : totalElements * nodeWidth +
        (totalElements - 1) * edgeLength +
        edgeLength +
        nullBoxWidth;

  const startX = Math.max(40, (viewBoxWidth - totalChainWidth) / 2 + nodeWidth / 2);
  const centerY = viewBoxHeight / 2 + 8;

  const getNodeCenterX = (idx: number) => {
    return startX + idx * (nodeWidth + edgeLength);
  };

  const headIdx = nodes.findIndex((n) => n.id === headId);
  const tailIdx = nodes.findIndex((n) => n.id === tailId);
  const activeIdx = activeNodeId ? nodes.findIndex((n) => n.id === activeNodeId) : -1;

  return (
    <SVGViewport
      viewBoxDimensions={{ width: viewBoxWidth, height: viewBoxHeight }}
      title="Linked List Visualization Canvas"
      description={step.a11yMessage}
    >
      <VisualLabel
        x={viewBoxWidth / 2}
        y={26}
        text={step.description}
        variant={isError ? 'default' : isFound ? 'default' : 'accent'}
        fontType="mono"
        fontSize={13}
      />

      <VisualLabel
        x={viewBoxWidth / 2}
        y={50}
        text={`Size: ${size} node${size === 1 ? '' : 's'}`}
        variant="muted"
        fontType="mono"
        anchor="middle"
        fontSize={11}
      />

      {totalElements === 0 ? (
        <g>
          <VisualPointer
            x={viewBoxWidth / 2 - 30}
            y={centerY - 24}
            label="HEAD"
            direction="top"
            colorVar="var(--accent-cyan)"
            length={24}
          />
          <VisualEdge
            from={{ x: viewBoxWidth / 2 - 30, y: centerY }}
            to={{ x: viewBoxWidth / 2 + 10, y: centerY }}
            isDirected={true}
            color="var(--border-subtle)"
            strokeWidth={2}
          />
          <g>
            <rect
              x={viewBoxWidth / 2 + 10}
              y={centerY - nullBoxHeight / 2}
              width={nullBoxWidth}
              height={nullBoxHeight}
              rx="6"
              fill="rgba(255, 255, 255, 0.03)"
              stroke="var(--border-subtle)"
              strokeWidth="1"
            />
            <VisualLabel
              x={viewBoxWidth / 2 + 10 + nullBoxWidth / 2}
              y={centerY}
              text="NULL"
              variant="muted"
              fontType="mono"
              fontSize={11}
            />
          </g>
        </g>
      ) : (
        <>
          {nodes.map((node, i) => {
            const nodeCenterX = getNodeCenterX(i);
            const isActive = node.id === activeNodeId || i === targetIndex;

            let visualState: NodeVisualState = 'default';
            let highlightVariant: HighlightVariant = 'primary';

            if (isFound && isActive) {
              visualState = 'sorted';
              highlightVariant = 'sorted';
            } else if (isSearch && isActive) {
              visualState = 'comparing';
              highlightVariant = 'comparing';
            } else if (isRemove && isActive) {
              visualState = 'swapping';
              highlightVariant = 'swapping';
            } else if (isInsert && isActive) {
              visualState = 'active';
              highlightVariant = 'primary';
            }

            return (
              <g key={`ll-node-${node.id}-${i}`}>
                <VisualNode
                  x={nodeCenterX}
                  y={centerY}
                  width={nodeWidth}
                  height={nodeHeight}
                  label={node.value}
                  subLabel={`[${i}]`}
                  state={visualState}
                  shape="rect"
                  onClick={() => onNodeClick?.(i, node.value)}
                />

                {isActive && (
                  <VisualHighlight
                    x={nodeCenterX - nodeWidth / 2 - 4}
                    y={centerY - nodeHeight / 2 - 4}
                    width={nodeWidth + 8}
                    height={nodeHeight + 8}
                    variant={highlightVariant}
                    shape="rect"
                  />
                )}

                {i < totalElements - 1 ? (
                  <VisualEdge
                    from={{ x: nodeCenterX + nodeWidth / 2, y: centerY }}
                    to={{ x: getNodeCenterX(i + 1) - nodeWidth / 2, y: centerY }}
                    isDirected={true}
                    color="var(--accent-cyan)"
                    strokeWidth={2}
                  />
                ) : (
                  <g key="tail-null-connector">
                    <VisualEdge
                      from={{ x: nodeCenterX + nodeWidth / 2, y: centerY }}
                      to={{ x: nodeCenterX + nodeWidth / 2 + edgeLength, y: centerY }}
                      isDirected={true}
                      color="var(--border-highlight)"
                      strokeWidth={2}
                    />
                    <rect
                      x={nodeCenterX + nodeWidth / 2 + edgeLength}
                      y={centerY - nullBoxHeight / 2}
                      width={nullBoxWidth}
                      height={nullBoxHeight}
                      rx="6"
                      fill="rgba(255, 255, 255, 0.04)"
                      stroke="var(--border-subtle)"
                      strokeWidth="1"
                    />
                    <VisualLabel
                      x={nodeCenterX + nodeWidth / 2 + edgeLength + nullBoxWidth / 2}
                      y={centerY}
                      text="NULL"
                      variant="muted"
                      fontType="mono"
                      fontSize={11}
                    />
                  </g>
                )}
              </g>
            );
          })}

          {headIdx >= 0 && (
            <VisualPointer
              x={getNodeCenterX(headIdx)}
              y={
                headIdx === tailIdx
                  ? centerY + nodeHeight / 2 + 28
                  : centerY - nodeHeight / 2 - 28
              }
              label="HEAD"
              direction={headIdx === tailIdx ? 'bottom' : 'top'}
              colorVar="var(--accent-cyan)"
              length={24}
            />
          )}

          {tailIdx >= 0 && (
            <VisualPointer
              x={getNodeCenterX(tailIdx)}
              y={centerY - nodeHeight / 2 - 28}
              label="TAIL"
              direction="top"
              colorVar="var(--accent-amber)"
              length={24}
            />
          )}

          {activeIdx >= 0 && activeIdx !== headIdx && activeIdx !== tailIdx && isSearch && (
            <VisualPointer
              x={getNodeCenterX(activeIdx)}
              y={centerY + nodeHeight / 2 + 28}
              label="CURR"
              direction="bottom"
              colorVar="var(--accent-primary)"
              length={24}
            />
          )}
        </>
      )}
    </SVGViewport>
  );
};
