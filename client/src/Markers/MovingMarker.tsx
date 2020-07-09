import React, { useEffect, useState, useMemo, useRef } from "react";
import * as L from "leaflet";
import { Marker, MapLayerProps } from "react-leaflet";
import Control from "../Control/Control";

import { markerIcon } from "./moving_marker";

type MovingMarkerProps = {
  breadcrumbs: any;
  date: any;
} & MapLayerProps;

type Breadcrumb = {
  lat: number;
  lon: number;
  act_time: number;
};

type Positions = Array<L.LatLngTuple>;
type Timestamps = Array<number>;

const formatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
});

const DEFAULT_FRAME_RATE = 1000 / 60;
const FRAME_RATES = [60, 30, 20, 15, 10, 5, 2, 1];
const MIN_FRAME_TIMES = FRAME_RATES.map(
  (fps) => DEFAULT_FRAME_RATE * (60 / fps) - DEFAULT_FRAME_RATE * 0.5
);

const MovingMarker = ({ breadcrumbs, date }: MovingMarkerProps) => {
  // TODO: Not sure how I feel about this; it's quite convoluted.
  // In _one_ pass remove null lat/lng values and dump lat/lngs and act_times into individual arrays
  // Memoize it via react so we only run on breadcrumb updates which *should* only be on initial render.
  const [positions, timestamps] = useMemo(
    () =>
      breadcrumbs.reduce(
        (
          [positions, timestamps]: [Positions, Timestamps],
          { lat, lon, act_time }: Breadcrumb
        ) => {
          // Bail early if we've got null coordinates
          if (lat === null || lon === null) return [positions, timestamps];

          positions.push([lat, lon]);
          // Convert act_time from seconds to milliseconds
          timestamps.push(
            new Date(date).getTime() + act_time * 1000 - 28800000
          );
          return [positions, timestamps];
        },
        [[], []]
      ),
    [breadcrumbs]
  );

  // TODO: Ensure positions.length === timestamps.length

  const [state, setState] = useState({
    isPlaying: false,
    fpsIdx: 0,
  });

  const [tick, setTick] = useState({
    idx: 0,
    position: positions[0],
    timestamp: timestamps[0],
  });

  const requestRef = useRef<number>(0);
  const previousTickRef = useRef<number>(0);

  // Ideas and code partially taken and/or modified from the following:
  // https://css-tricks.com/using-requestanimationframe-with-react-hooks/
  // http://www.javascriptkit.com/javatutors/requestanimationframe.shtml
  // https://stackoverflow.com/questions/19764018/controlling-fps-with-requestanimationframe
  // https://riptutorial.com/html5-canvas/example/18718/set-frame-rate-using-requestanimationframe
  const animate = (time: number) => {
    if (previousTickRef.current !== undefined) {
      const deltaTime = time - previousTickRef.current;

      // Skip frame if call is "too early" for intended frame rate
      if (deltaTime < MIN_FRAME_TIMES[state.fpsIdx]) {
        requestRef.current = requestAnimationFrame(animate);
        return;
      }

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

  const onSpeedIncreaseClick = (): void => {
    setState((prevState) => {
      const nextIdx = prevState.fpsIdx - 1 <= 0 ? 0 : prevState.fpsIdx - 1;
      return {
        ...prevState,
        fpsIdx: nextIdx,
      };
    });
  };

  const onSpeedDecreaseClick = (): void => {
    setState((prevState) => {
      const nextIdx =
        prevState.fpsIdx + 1 >= FRAME_RATES.length
          ? FRAME_RATES.length - 1
          : prevState.fpsIdx + 1;
      return {
        ...prevState,
        fpsIdx: nextIdx,
      };
    });
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
            backgroundColor: "whitesmoke",
            width: "30rem",
          }}
          className="d-flex fd-row p-1 rounded"
        >
          <div className="mr-auto">
            {formatter.format(new Date(tick.timestamp))} GMT-08:00
          </div>

          <div className="btn-group btn-group-sm" role="group">
            <button
              title="Slow Down"
              className="btn btn-sm btn-secondary"
              onClick={onSpeedDecreaseClick}
            >
              -
            </button>
            <div>{FRAME_RATES[state.fpsIdx]} FPS</div>
            <button
              title="Speed Up"
              className="btn btn-sm btn-secondary mr-1"
              onClick={onSpeedIncreaseClick}
            >
              +
            </button>
          </div>

          <div className="btn-group btn-group-sm" role="group">
            <button
              className="btn btn-sm btn-secondary"
              onClick={onStepBackwardClicked}
            >
              {"<"}
            </button>
            <button
              className="btn btn-sm btn-secondary"
              onClick={onPlayPauseClick}
            >
              {state.isPlaying ? "Pause" : "Play"}
            </button>
            <button
              className="btn btn-sm btn-secondary mr-1"
              onClick={onStepForwardClicked}
            >
              {">"}
            </button>
          </div>

          <button className="btn btn-sm btn-secondary" onClick={onResetClick}>
            Reset
          </button>
        </div>
      </Control>
      <Marker position={tick.position} icon={markerIcon} />
    </>
  );
};

export default MovingMarker;
