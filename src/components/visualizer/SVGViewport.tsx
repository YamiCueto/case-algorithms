import React, { useId, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SVGViewportProps } from './types';
import { SVGViewportContext } from './context';

export const SVGViewport: React.FC<SVGViewportProps> = ({
  viewBoxDimensions = { x: 0, y: 0, width: 800, height: 400 },
  showGrid = true,
  title = 'Algorithm Visualization Viewport',
  description = 'Interactive visual representation of algorithm execution state',
  children,
  className = '',
  ...props
}) => {
  const gridPatternId = useId();
  const { t } = useTranslation('common');
  const [zoom, setZoom] = useState(0);
  const titleId = useId();
  const descId = useId();
  const markerArrowId = useId();
  const markerArrowActiveId = useId();

  const { x = 0, y = 0, width, height } = viewBoxDimensions;
  const viewBoxStr = `${x} ${y} ${width} ${height}`;

  return (
    <SVGViewportContext.Provider
      value={{
        markerArrowId,
        markerArrowActiveId,
      }}
    >
      <div className="svg-viewport-frame">
      <div className="viz-zoom-controls" role="group" aria-label={t('zoomControls')}>
        <button type="button" disabled={zoom === 0} onClick={() => setZoom(Math.max(0, zoom - 1))} aria-label={t('zoomOut')}>−</button>
        <button type="button" onClick={() => setZoom(0)} aria-label={t('fitView')}>{zoom === 0 ? t('fitLabel') : `${zoom * 100}%`}</button>
        <button type="button" disabled={zoom === 2} onClick={() => setZoom(Math.min(2, zoom + 1))} aria-label={t('zoomIn')}>+</button>
      </div>
      <div className={`svg-viewport-container${zoom > 0 ? ' is-zoomed' : ''} ${className}`.trim()} tabIndex={zoom > 0 ? 0 : undefined} role={zoom > 0 ? 'region' : undefined} aria-label={zoom > 0 ? t('panCanvas') : undefined}>
        <svg
          role="img"
          aria-labelledby={title ? titleId : undefined}
          aria-describedby={description ? descId : undefined}
          viewBox={viewBoxStr}
          preserveAspectRatio="xMidYMid meet"
          className="svg-viewport"
          style={zoom > 0 ? { width: width * zoom, height: height * zoom, flexShrink: 0 } : undefined}
          {...props}
        >
          {title && <title id={titleId}>{title}</title>}
          {description && <desc id={descId}>{description}</desc>}

          <defs>
            {showGrid && (
              <pattern
                id={gridPatternId}
                width="24"
                height="24"
                patternUnits="userSpaceOnUse"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="1"
                  fill="var(--border-default)"
                  opacity="0.6"
                />
              </pattern>
            )}

            <marker
              id={markerArrowId}
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 10 5 L 0 9 z" fill="var(--border-highlight)" />
            </marker>

            <marker
              id={markerArrowActiveId}
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 10 5 L 0 9 z" fill="var(--accent-cyan)" />
            </marker>
          </defs>

          {showGrid && (
            <rect
              x={x}
              y={y}
              width={width}
              height={height}
              fill={`url(#${gridPatternId})`}
              className="svg-viewport-grid-bg"
              aria-hidden="true"
            />
          )}

          <g className="svg-viewport-content">{children}</g>
        </svg>
      </div>
      </div>
    </SVGViewportContext.Provider>
  );
};
