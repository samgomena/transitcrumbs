import React, { FunctionComponent } from "react";
import { Map as LeafletMap, TileLayer, Polyline } from "react-leaflet";

import { appState } from "../index";
import MovingMarker from "../Markers/MovingMarker";
import { useBreadcrumbs, useTripBreadcrumbs } from "../Search/Search";

import "leaflet/dist/leaflet.css";

const CTRAN_GARAGE = [45.638574, -122.603547];

type LatLng = {
  lat: number;
  lon: number;
};

type MapProps = {
  center?: [number, number];
  zoom?: number;
  state: appState;
  date?: Date | string | null;
  vehicle?: number | null;
  trips?: Array<number> | null;
};

type Breadcrumb = {
  lat: number;
  lon: number;
  act_time: number;
  event_no_trip: number;
};

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
  state,
  date,
  vehicle,
  trips,
}) => {
  const templateUrl =
    "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";
  const attribution = `&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | <a href="https://carto.com/location-data-services/basemaps/">CartoDB</a> | <a href="https://digitransit.fi/en/developers/apis/4-realtime-api/vehicle-positions/">Digitransit</a>`;

  date = "2020-03-11";
  trips = [
    153300419,
    153300424,
    153300431,
    153300453,
    153300464,
    153300484,
    153300495,
    153300512,
    153300524,
    153300539,
    153300552,
    153300570,
    153300585,
    153300602,
    153300629,
    153300641,
    153300665,
  ];
  // vehicle = 4028;

  const { data, loading, error } = useTripBreadcrumbs(date, trips);
  console.log(error);

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
                  ({ lat, lon, event_no_trip }: Breadcrumb) =>
                    unique_trip === event_no_trip &&
                    lat !== null &&
                    lon !== null
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
