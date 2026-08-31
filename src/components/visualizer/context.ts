import React from 'react';

export interface SVGViewportContextValue {
  readonly markerArrowId: string;
  readonly markerArrowActiveId: string;
}

export const SVGViewportContext = React.createContext<SVGViewportContextValue>({
  markerArrowId: 'viz-arrowhead',
  markerArrowActiveId: 'viz-arrowhead-active',
});

export const useSVGViewport = (): SVGViewportContextValue => {
  return React.useContext(SVGViewportContext);
};
