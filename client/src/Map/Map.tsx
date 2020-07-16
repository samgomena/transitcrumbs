import React, { FunctionComponent } from "react";
import { Map as LeafletMap, TileLayer, Polyline } from "react-leaflet";

import { useAppState } from "../reducer";
import Control from "../Control/Control";
import Loading from "../components/Loading";
import MovingMarker from "../Markers/MovingMarker";
import { useBreadcrumbs, useTripBreadcrumbs } from "../Search/Search";

import { generateColor } from "../utils";

import "leaflet/dist/leaflet.css";

const CTRAN_GARAGE = [45.638574, -122.603547];

type MapProps = {
  center?: [number, number];
  zoom?: number;
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

const colors: Array<string> = [];

const Map: FunctionComponent<MapProps> = ({
  center = [45.5925204, -122.6080728],
  zoom = 12,
}) => {
  const templateUrl =
    "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";

  // const templateUrl = `http://{switch:a,b,c}.tiles.mapbox.com/v3/openstreetmap.map-4wvf9l0l/${zoom}/{x}/{y}.png`;
  // const templateUrl = `http://{switch:a,b,c}.tile.openstreetmap.us/usgs_large_scale/15/{x}/{y}.jpg`;
  const attribution = `&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | <a href="https://carto.com/location-data-services/basemaps/">CartoDB</a> | <a href="https://digitransit.fi/en/developers/apis/4-realtime-api/vehicle-positions/">Digitransit</a>`;

  const [state, _] = useAppState();
  const { date, trips, vehicle } = state;

  const { data, loading, error } = useTripBreadcrumbs(date, trips);
  data && data.unique_trips.forEach(() => colors.push(generateColor()));

  return (
    <LeafletMap
      center={center}
      zoom={zoom}
      style={{
        height: "100%",
        width: "100%",
      }}
    >
      <TileLayer url={templateUrl} attribution={attribution} />
      <Control position="topleft">
        {loading ? <Loading style={{ width: "26px", height: "26px" }} /> : null}
      </Control>
      {!loading && data && data.breadcrumbs.length > 0 && (
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
