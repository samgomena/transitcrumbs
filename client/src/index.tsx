import React from "react";
import { render } from "react-dom";
import { ApolloProvider } from "@apollo/react-hooks";

import SplitPane from "react-split-pane";
import Pane from "react-split-pane/lib/Pane";

import { client } from "./api";
import Map from "./Map/Map";
import { Breadcrumbs } from "./search";

import initMap from "./map";

import "leaflet/dist/leaflet.css";
import "./index.css";

const map = initMap();

function App() {
  return (
    <ApolloProvider client={client}>
      <SplitPane split="vertical" primary="second">
        <Pane initialSize="20%" minSize="10%">
          <h2>My first Apollo app 🚀</h2>
        </Pane>
        <Pane initialSize="80%" minSize="50%" maxSize="100%">
          <Map />
        </Pane>
      </SplitPane>
    </ApolloProvider>
  );
}

render(<App />, document.getElementById("root"));
