import React, { FunctionComponent } from "react";
import { Map as LeafletMap, TileLayer, Polyline } from "react-leaflet";

import MovingMarker from "../Markers/MovingMarker";
import { useBreadcrumbs } from "../Search/Search";

import "leaflet/dist/leaflet.css";

const CTRAN_GARAGE = [45.638574, -122.603547];

type LatLng = {
  lat: number;
  lon: number;
};

interface MapProps {
  center?: [number, number];
  zoom?: number;
  date?: Date | null;
  vehicle?: number | null;
}

const colors = [
  "#2d81c4",
  "#e7590d",
  "#32e213",
  "#ed0815",
  "#a3228f",
  "#9eb217",
  "#845ec2",
  "#4ffbdf",
  "#00c2a8",
  "#008b74",
];

const Map: FunctionComponent<MapProps> = ({
  center = [45.5925204, -122.6080728],
  zoom = 12,
  // date,
  vehicle,
}) => {
  const templateUrl =
    "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";
  const attribution = `&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | <a href="https://carto.com/location-data-services/basemaps/">CartoDB</a> | <a href="https://digitransit.fi/en/developers/apis/4-realtime-api/vehicle-positions/">Digitransit</a>`;

  const date = "2020-03-17";
  vehicle = 4028;

  const { data, loading, error } = useBreadcrumbs(date, vehicle);

  return (
    <LeafletMap
      center={center}
      zoom={zoom}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer url={templateUrl} attribution={attribution} />
      {!loading && data && (
        <>
          <MovingMarker date={date} breadcrumbs={data.breadcrumbs} />
          {data.unique_trips.map(
            (
              { event_no_trip: unique_trip }: { event_no_trip: number },
              idx: number
            ) => (
              <Polyline
                key={idx}
                positions={data.breadcrumbs.filter(
                  ({ event_no_trip }: { event_no_trip: number }) =>
                    unique_trip === event_no_trip
                )}
                color={colors[idx]}
              />
            )
          )}
        </>
      )}
    </LeafletMap>
  );
};

export default Map;
