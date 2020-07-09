import React, { useState } from "react";

import { TripsByBlock } from "./Search";
import { useAppState, Actions } from "../reducer";

export default function SearchResults({
  tripsByBlock,
}: {
  tripsByBlock: TripsByBlock;
}) {
  const [state, dispatch] = useAppState();
  const { trips } = state;

  return (
    <div>
      {Object.entries(tripsByBlock).map(([block, values], idx) => (
        <div
          key={`block-${idx}`}
          className="border border-dark rounded my-2 p-2"
        >
          <div style={{ fontSize: "1.2" }}>
            <input
              type="checkbox"
              title="Select all"
              className="mr-1"
              onChange={() =>
                dispatch({
                  type: Actions.SET_TRIPS,
                  payload:
                    trips.length === 0
                      ? values.map(({ trip_number }) => trip_number)
                      : values.length < trips.length
                      ? values.map(({ trip_number }) => trip_number)
                      : [],
                })
              }
            />
            Block: {block}
          </div>
          <hr />
          {values.map(({ trip_number, vehicle_number }, idx) => (
            <div key={idx}>
              <input
                className="mr-1"
                type="checkbox"
                checked={trips.includes(trip_number) ? true : false}
                onChange={() =>
                  trips.includes(trip_number)
                    ? // If trip is already in trip list remove it
                      dispatch({
                        type: Actions.SET_TRIPS,
                        payload: trips.filter((trip) => trip !== trip_number),
                      })
                    : // else add the trip to the trip list
                      dispatch({
                        type: Actions.SET_TRIPS,
                        payload: [...trips, trip_number],
                      })
                }
              />
              {trip_number} {vehicle_number}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
