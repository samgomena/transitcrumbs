import React, { useState, useReducer } from "react";
import { render } from "react-dom";
import { ApolloProvider } from "@apollo/react-hooks";

import SplitPane from "react-split-pane";
import Pane from "react-split-pane/lib/Pane";

import { client } from "./api";
import Map from "./Map/Map";
import { Routes, Breakdown } from "./Search/Search";

import "leaflet/dist/leaflet.css";
import "./index.css";

export interface appState {
  route: number | null;
  date: Date | string | null;
  vehicle: number | null;
  trips: Array<number> | null;
}

export enum appActionType {
  SET_ROUTE,
  SET_DATE,
  SET_VEHICLE,
  SET_TRIPS,
}

type appActionPayload = any;

interface appActions {
  type: appActionType;
  payload: appActionPayload;
}

const initialState: appState = {
  route: null,
  date: null,
  vehicle: null,
  trips: [],
};

function reducer(state: appState, action: appActions) {
  const { SET_ROUTE, SET_DATE, SET_VEHICLE, SET_TRIPS } = appActionType;
  switch (action.type) {
    case SET_ROUTE:
      return { ...state, route: action.payload };
    case SET_DATE:
      return { ...state, date: action.payload };
    case SET_VEHICLE:
      return { ...state, vehicle: action.payload };
    case SET_TRIPS:
      return { ...state, trips: action.payload };
    default:
      return state;
  }
}

function App() {
  const [route, setRoute] = useState<number | null>(null);
  const [date, setDate] = useState<Date | null>(null);
  const [vehicle, setVehicle] = useState<number | null>(null);
  const [trips, setTrips] = useState<Array<number> | null>(null);

  const [state, dispatch] = useReducer(reducer, initialState);
  console.log(`State:`, state);

  return (
    <ApolloProvider client={client}>
      <SplitPane split="vertical" primary="second">
        <Pane initialSize="20%" minSize="10%">
          <div
            style={{
              display: "flex",
              margin: "0.75rem",
              flexDirection: "column",
            }}
          >
            <h2>Search</h2>
            <Routes state={state} dispatch={dispatch} />
            <Breakdown
              state={state}
              dispatch={dispatch}
              // route_number={route}
              // date={date}
              // setDate={setDate}
              // vehicle={vehicle}
              // setVehicle={setVehicle}
              // trips={trips}
              // setTrips={setTrips}
            />
          </div>
        </Pane>
        <Pane initialSize="80%" minSize="50%" maxSize="100%">
          <Map state={state} date={date} vehicle={vehicle} trips={trips} />
        </Pane>
      </SplitPane>
    </ApolloProvider>
  );
}

render(<App />, document.getElementById("root"));
