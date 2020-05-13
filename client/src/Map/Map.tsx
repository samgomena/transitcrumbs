import React, { FunctionComponent } from "react";
import { Map as LeafletMap, Popup, TileLayer } from "react-leaflet";

import BusMarker from "../Markers/Marker";
import MovingMarker from "../Markers/MovingMarker";

import { useBreadcrumbs } from "../Search/Search";

import "leaflet/dist/leaflet.css";

interface MapProps {
  center?: [number, number];
  zoom?: number;
}

const Map: FunctionComponent<MapProps> = ({
  center = [45.5925204, -122.6080728],
  zoom = 12,
}) => {
  const templateUrl =
    "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";
  const attribution = `&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | <a href="https://carto.com/location-data-services/basemaps/">CartoDB</a> | <a href="https://digitransit.fi/en/developers/apis/4-realtime-api/vehicle-positions/">Digitransit</a>`;

  const { data, loading, error } = useBreadcrumbs();

  const breadcrumbs: L.LatLngTuple[] =
    data &&
    data.breadcrumbs.map(
      ({ lat, lon }: { lat: number; lon: number }): L.LatLngTuple => [lat, lon]
    );

  return (
    <LeafletMap
      center={center}
      zoom={zoom}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer url={templateUrl} attribution={attribution} />
      {data && breadcrumbs && <MovingMarker positions={breadcrumbs} />}

      <BusMarker position={center} />
      {/* <Popup>
          A pretty CSS3 popup.
          <br />
          Easily customizable.
        </Popup> */}
      {/* </BusMarker> */}
    </LeafletMap>
  );
};

export default Map;
