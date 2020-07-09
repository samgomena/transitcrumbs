import React from "react";
import { render } from "react-dom";
import { ApolloProvider } from "@apollo/react-hooks";

import SplitPane from "react-split-pane";
// @ts-ignore: waiting for @next to expose typings
import Pane from "react-split-pane/lib/Pane";

import { client } from "./api";

import Map from "./Map/Map";
import StateProvider from "./reducer";
import { Routes, Dates, Vehicles, Trips } from "./Search/Search";

import "leaflet/dist/leaflet.css";
import "./index.css";

function App() {
  return (
    <ApolloProvider client={client}>
      <StateProvider>
        <SplitPane split="vertical" primary="second">
          <Pane initialSize="20%" minSize="10%">
            <div
              style={{
                margin: "0.75rem",
              }}
              className="d-flex flex-column h-100 pb-3"
            >
              <h2>Search</h2>
              <Routes />
              <Dates />
              <Vehicles />
              <Trips />
            </div>
          </Pane>
          <Pane initialSize="80%" minSize="50%" maxSize="100%">
            <Map />
          </Pane>
        </SplitPane>
      </StateProvider>
    </ApolloProvider>
  );
}

render(<App />, document.getElementById("root"));
