import React, { useEffect, useState, useMemo, useRef } from "react";
import * as L from "leaflet";
import { Marker, MapLayerProps } from "react-leaflet";
import Control from "@skyeer/react-leaflet-custom-control";

import { markerIcon } from "./moving_marker";

type MovingMarkerProps = {
  breadcrumbs: any;
  date: any;
  // MapLayerProps
  icon?: L.Icon | L.DivIcon;
  draggable?: boolean;
  opacity?: number;
  // position: LatLngExpression;
  // duration: number;
  keepAtCenter?: boolean;
  zIndexOffset?: number;
} & MapLayerProps;

type LatLng = {
  lat: number;
  lon: number;
};

const formatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
});

const MovingMarker = ({ breadcrumbs, date }: MovingMarkerProps) => {
  // TODO: Not sure I feel about this; it's quite convoluted.
  // In _one_ pass remove null lat/lng values and dump lat/lngs and act_times into individual arrays
  // Memoize it via react so we only run on breadcrumb updates which *should* only be on initial render.
  const [positions, timestamps] = useMemo(
    () =>
      breadcrumbs.reduce(
        ([positions, timestamps], { lat, lon, act_time }) => {
          // Bail early if we've got null coordinates
          if (lat === null || lon === null) return [positions, timestamps];

          positions.push([lat, lon]);
          timestamps.push(new Date(date).getTime() + act_time);
          return [positions, timestamps];
        },
        [[], []]
      ),
    [breadcrumbs]
  );

  // TODO: Ensure positions.length === timestamps.length

  const [state, setState] = useState({
    isPlaying: false,
  });

  const [tick, setTick] = useState({
    idx: 0,
    position: positions[0],
    timestamp: timestamps[0],
  });

  const requestRef = useRef<number>(0);
  const previousTickRef = useRef<number>(0);

  const animate = (time: number) => {
    if (previousTickRef.current !== undefined) {
      // const deltaTime = time - previousTickRef.current;

      setTick((prevTick) => {
        // Loop around to 0 if we're at the end of the arrays
        const nextIdx =
          prevTick.idx + 1 >= positions.length ? 0 : prevTick.idx + 1;
        return {
          ...prevTick,
          idx: nextIdx,
          position: positions[nextIdx],
          timestamp: timestamps[nextIdx],
        };
      });
    }
    previousTickRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (state.isPlaying) requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [state]);

  const onPlayPauseClick = (): void => {
    setState({ ...state, isPlaying: !state.isPlaying });
  };

  const onStepForwardClicked = (): void => {
    setTick((prevTick) => {
      const nextIdx =
        prevTick.idx + 1 >= positions.length ? 0 : prevTick.idx + 1;
      return {
        ...prevTick,
        idx: nextIdx,
        position: positions[nextIdx],
        timestamp: timestamps[nextIdx],
      };
    });
  };

  const onStepBackwardClicked = (): void => {
    setTick((prevTick) => {
      const nextIdx =
        prevTick.idx - 1 <= 0 ? positions.length - 1 : prevTick.idx - 1;
      return {
        ...prevTick,
        idx: nextIdx,
        position: positions[nextIdx],
        timestamp: timestamps[nextIdx],
      };
    });
  };

  const onResetClick = (): void => {
    setTick((prevTick) => ({
      ...prevTick,
      idx: 0,
      position: positions[0],
      timestamp: timestamps[0],
    }));
  };

  return (
    <>
      <Control position="bottomright">
        <div
          style={{
            padding: "15px",
            backgroundColor: "whitesmoke",
            display: "flex",
            flexDirection: "row",
            boxSizing: "border-box",
            width: "25rem",
            borderRadius: "4px",
          }}
        >
          <div style={{ marginRight: "auto" }}>
            {/* {formatter.format(new Date(tick.timestamp))} UTC */}
            {formatter.format(new Date(tick.timestamp))} UTC
          </div>
          <button onClick={onStepBackwardClicked}>{"<"}</button>
          <button onClick={onPlayPauseClick}>
            {state.isPlaying ? "Pause" : "Play"}
          </button>
          <button onClick={onStepForwardClicked}>{">"}</button>
          <button onClick={onResetClick}>Reset</button>
        </div>
      </Control>
      <Marker position={tick.position} icon={markerIcon} />
    </>
  );
};

export default MovingMarker;
