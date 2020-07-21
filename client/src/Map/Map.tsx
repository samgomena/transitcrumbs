import React, { FunctionComponent } from "react";
import {
  LayersControl,
  Map as LeafletMap,
  Polyline,
  Marker,
  Popup,
  LayerGroup,
  FeatureGroup,
  Circle,
  TileLayer,
} from "react-leaflet";

import { useAppState } from "../reducer";
import MovingMarker from "../Markers/MovingMarker";
import Hotline from "../Polylines/Hotline";
import { useBreadcrumbs, useTripBreadcrumbs } from "../Search/Search";

import { generateColor } from "../utils";

import "leaflet/dist/leaflet.css";
import { LatLngTuple, layerGroup } from "leaflet";

const CTRAN_GARAGE: LatLngTuple = [45.638574, -122.603547];

type LatLng = {
  lat: number;
  lon: number;
};

type MapProps = {
  center?: [number, number];
  zoom?: number;
  date?: Date | string | null;
  vehicle?: number | null;
  trips?: Array<number> | null;
};

export type Breadcrumb = {
  lat: number;
  lon: number;
  act_time: number;
  event_no_trip: number;
};

const colors: Array<string> = [];

const accessToken = `pk.eyJ1Ijoic2FtZ29tZW5hIiwiYSI6ImNrY29heTNydDBoczkyem8yb2xuMHJpN24ifQ.vCpvxiLC8GhG-k3EVkyvag`;

const Map: FunctionComponent<MapProps> = ({
  center = [45.5925204, -122.6080728],
  zoom = 12,
}) => {
  // const templateUrl = `http://{switch:a,b,c}.tiles.mapbox.com/v3/openstreetmap.map-4wvf9l0l/${zoom}/{x}/{y}.png`;
  // const templateUrl = `http://{switch:a,b,c}.tile.openstreetmap.us/usgs_large_scale/15/{x}/{y}.jpg`;
  const attribution = `&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | <a href="https://carto.com/location-data-services/basemaps/">CartoDB</a>`;

  const [state, _] = useAppState();
  let { date, trips, vehicle } = state;

  const { data, loading, error } = useTripBreadcrumbs(date, trips);
  data && data.unique_trips.forEach(() => colors.push(generateColor()));

  return (
    <LeafletMap className="h-100 w-100" center={center} zoom={zoom}>
      <LayersControl position="topright">
        <LayersControl.BaseLayer checked name="Default">
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            attribution={attribution}
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="Satellite">
          <TileLayer
            attribution={attribution}
            url={`https://api.tiles.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}.png?access_token=${accessToken}`}
          />
        </LayersControl.BaseLayer>

        <LayersControl.Overlay checked name="Colored Trip">
          <LayerGroup checked>
            {!loading && data && data.breadcrumbs.length > 0 && (
              <>
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
          </LayerGroup>
        </LayersControl.Overlay>

        <LayersControl.Overlay name="Velocity Heatmap polyline">
          <LayerGroup>
            {!loading && data && data.breadcrumbs.length > 0 && (
              <>
                {/* <MovingMarker date={date} breadcrumbs={data.breadcrumbs} /> */}
                {data.unique_trips.map(
                  (
                    { event_no_trip: unique_trip }: { event_no_trip: number },
                    idx: number
                  ) => (
                    <Hotline
                      positions={data.breadcrumbs.filter(
                        ({ lat, lon, event_no_trip }: Breadcrumb) =>
                          unique_trip === event_no_trip &&
                          lat !== null &&
                          lon !== null
                      )}
                    />
                  )
                )}
              </>
            )}
          </LayerGroup>
        </LayersControl.Overlay>

        <LayersControl.Overlay name="Show C-Tran Garage">
          <FeatureGroup>
            <Circle center={CTRAN_GARAGE} radius={100} />
          </FeatureGroup>
        </LayersControl.Overlay>
      </LayersControl>

      {!loading && data && data.breadcrumbs.length > 0 && (
        <MovingMarker date={date} breadcrumbs={data.breadcrumbs} />
      )}

      {/* {!loading && data && data.breadcrumbs.length > 0 && (
        <>
          <MovingMarker date={date} breadcrumbs={data.breadcrumbs} />
          {data.unique_trips.map(
            (
              { event_no_trip: unique_trip }: { event_no_trip: number },
              idx: number
            ) => (
              <>
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
                <Hotline
                  positions={data.breadcrumbs.filter(
                    ({ lat, lon, event_no_trip }: Breadcrumb) =>
                      unique_trip === event_no_trip &&
                      lat !== null &&
                      lon !== null
                  )}
                />
              </>
            )
          )}
        </>
      )} */}
    </LeafletMap>
  );
};

export default Map;
