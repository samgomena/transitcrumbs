import React from "react";

import * as L from "leaflet";
import { Marker } from "react-leaflet";

type BusMarkerProps = {
  position: [number, number];
};

const BusMarker = (props: BusMarkerProps) => {
  const markerIcon = L.icon({
    iconSize: [25, 41],
    iconAnchor: [10, 41],
    popupAnchor: [2, -40],
    // specify the path here
    iconUrl: "https://unpkg.com/leaflet@1.5.1/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.5.1/dist/images/marker-shadow.png",
  });

  const { position } = props;
  return <Marker position={position} icon={markerIcon} />;
};

export default BusMarker;
