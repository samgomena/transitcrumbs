import { useEffect } from "react";
import * as L from "leaflet";
import { MapLayerProps, useLeaflet } from "react-leaflet";

import _MovingMarker from "./moving_marker";
// import BusMarker from "./Marker";

type MovingMarkerProps = {
  positions: L.LatLngTuple[];
  durations?: number[];
  // MapLayerProps
  icon?: L.Icon | L.DivIcon;
  draggable?: boolean;
  opacity?: number;
  // position: LatLngExpression;
  // duration: number;
  keepAtCenter?: boolean;
  zIndexOffset?: number;
} & MapLayerProps;

const MovingMarker = (props: MovingMarkerProps) => {
  const { map } = useLeaflet();
  // Short circuit if the map's unavailable
  if (map === undefined) return null;

  useEffect(() => {
    const marker = new _MovingMarker(props.positions, 30000);
    marker.once("click", () => {
      marker.start();
      marker.closePopup();
      marker.unbindPopup();
      marker.on("click", () =>
        marker.isRunning() ? marker.pause() : marker.start()
      );
    });
    marker.addTo(map);
  });
  return null;
};

export default MovingMarker;
