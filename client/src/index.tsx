import React, { useState } from "react";
import { render } from "react-dom";
import { ApolloProvider } from "@apollo/react-hooks";

import SplitPane from "react-split-pane";
import Pane from "react-split-pane/lib/Pane";

import { client } from "./api";
import Map from "./Map/Map";
import { Routes, Trips } from "./Search/Search";

import "leaflet/dist/leaflet.css";
import "./index.css";

function App() {
  const [route, setRoute] = useState<number | null>(null);
  const [date, setDate] = useState<Date | null>(null);
  const [vehicle, setVehicle] = useState<number | null>(null);

  console.log(`route: ${route}, date: ${date}, vehicle: ${vehicle}`);
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
            <Routes setRoute={setRoute} />
            <Trips
              route_number={route}
              date={date}
              setDate={setDate}
              vehicle={vehicle}
              setVehicle={setVehicle}
            />
          </div>
        </Pane>
        <Pane initialSize="80%" minSize="50%" maxSize="100%">
          <Map date={date} vehicle={vehicle} />
        </Pane>
      </SplitPane>
    </ApolloProvider>
  );
}

render(<App />, document.getElementById("root"));
