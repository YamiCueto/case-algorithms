import React from 'react';
import { ExecutionStep } from '@/core/types';
import { ArrayState } from '@/core/data-structures/array';
import {
  SVGViewport,
  VisualNode,
  VisualPointer,
  VisualHighlight,
  VisualLabel,
  NodeVisualState,
} from '../index';

export interface ArrayVisualizerAdapterProps {
  readonly step: ExecutionStep<ArrayState> | null;
  readonly viewBoxWidth?: number;
  readonly viewBoxHeight?: number;
  readonly onNodeClick?: (index: number, value: number) => void;
}

export const ArrayVisualizerAdapter: React.FC<ArrayVisualizerAdapterProps> = ({
  step,
  viewBoxWidth = 800,
  viewBoxHeight = 360,
  onNodeClick,
}) => {
  if (!step) {
    return (
      <SVGViewport
        viewBoxDimensions={{ width: viewBoxWidth, height: viewBoxHeight }}
        title="Array Visualizer"
        description="No array step loaded"
      >
        <VisualLabel
          x={viewBoxWidth / 2}
          y={viewBoxHeight / 2}
          text="No array data available. Provide input to begin."
          variant="muted"
          fontType="sans"
        />
      </SVGViewport>
    );
  }

  const { array, sortedIndices, comparingIndices, swappedIndices, activeIndex, phaseDescription } =
    step.state;
  const n = array.length;

  if (n === 0) {
    return (
      <SVGViewport
        viewBoxDimensions={{ width: viewBoxWidth, height: viewBoxHeight }}
        title="Array Visualizer"
        description="Empty array"
      >
        <VisualLabel
          x={viewBoxWidth / 2}
          y={viewBoxHeight / 2}
          text="Empty Array []"
          variant="muted"
          fontType="mono"
        />
      </SVGViewport>
    );
  }

  const nodeWidth = n > 8 ? 44 : 56;
  const nodeHeight = n > 8 ? 44 : 56;
  const gap = n > 8 ? 10 : 16;
  const totalWidth = n * nodeWidth + (n - 1) * gap;
  const startX = (viewBoxWidth - totalWidth) / 2 + nodeWidth / 2;
  const centerY = viewBoxHeight / 2;

  const getNodeState = (idx: number): NodeVisualState => {
    if (swappedIndices && (swappedIndices[0] === idx || swappedIndices[1] === idx)) {
      return 'swapping';
    }
    if (comparingIndices && (comparingIndices[0] === idx || comparingIndices[1] === idx)) {
      return 'comparing';
    }
    if (sortedIndices.includes(idx)) {
      return 'sorted';
    }
    if (activeIndex === idx) {
      return 'active';
    }
    return 'default';
  };

  return (
    <SVGViewport
      viewBoxDimensions={{ width: viewBoxWidth, height: viewBoxHeight }}
      title="Array Visualization Canvas"
      description={step.a11yMessage}
    >
      <VisualLabel
        x={viewBoxWidth / 2}
        y={32}
        text={step.description}
        variant="accent"
        fontType="mono"
        fontSize={13}
      />

      {comparingIndices && (
        <VisualHighlight
          x={
            startX +
            Math.min(comparingIndices[0], comparingIndices[1]) * (nodeWidth + gap) -
            nodeWidth / 2 -
            6
          }
          y={centerY - nodeHeight / 2 - 6}
          width={
            (Math.abs(comparingIndices[1] - comparingIndices[0]) + 1) * nodeWidth +
            Math.abs(comparingIndices[1] - comparingIndices[0]) * gap +
            12
          }
          height={nodeHeight + 12}
          variant="comparing"
          label="COMPARE"
        />
      )}

      {swappedIndices && (
        <VisualHighlight
          x={
            startX +
            Math.min(swappedIndices[0], swappedIndices[1]) * (nodeWidth + gap) -
            nodeWidth / 2 -
            6
          }
          y={centerY - nodeHeight / 2 - 6}
          width={
            (Math.abs(swappedIndices[1] - swappedIndices[0]) + 1) * nodeWidth +
            Math.abs(swappedIndices[1] - swappedIndices[0]) * gap +
            12
          }
          height={nodeHeight + 12}
          variant="swapping"
          label="SWAP"
        />
      )}

      {array.map((val, idx) => {
        const nodeX = startX + idx * (nodeWidth + gap);
        const nodeState = getNodeState(idx);

        return (
          <VisualNode
            key={`node-${idx}-${val}`}
            x={nodeX}
            y={centerY}
            width={nodeWidth}
            height={nodeHeight}
            label={val}
            subLabel={`[${idx}]`}
            state={nodeState}
            onClick={onNodeClick ? () => onNodeClick(idx, val) : undefined}
          />
        );
      })}

      {step.pointers?.map((p) => {
        const ptrX = startX + p.index * (nodeWidth + gap);
        return (
          <VisualPointer
            key={p.id}
            x={ptrX}
            y={centerY - nodeHeight / 2 - 10}
            label={p.label}
            direction="top"
            colorVar={p.colorVar}
          />
        );
      })}

      <VisualLabel
        x={viewBoxWidth / 2}
        y={viewBoxHeight - 20}
        text={phaseDescription}
        variant="muted"
        fontType="sans"
        fontSize={12}
      />
    </SVGViewport>
  );
};
