import {
  map as LeafletMap,
  tileLayer,
  control,
  Control,
  DomUtil,
  Polyline,
  popup,
  Point,
  polyline,
} from "leaflet";
import { route_one } from "./api";
import { indexToHue } from "./utils";
import pkg from "../package.json";

import "leaflet/dist/leaflet.css";

const r = {
  polyline: route_one,
};

export default () => {
  // Initialize the map
  const map = LeafletMap("map", {});

  const center = [45.5925204, -122.6080728];
  const zoom = 12;

  map.setView(center, zoom);

  const tileServer =
    "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";
  // const tileServer = "http://{s}.tile.osm.org/{z}/{x}/{y}.png";

  // Initialize the base layer
  tileLayer(tileServer, {
    maxZoom: 18,
    maxNativeZoom: 18,
    attribution: `v${pkg.version} | &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | <a href="https://carto.com/location-data-services/basemaps/">CartoDB</a> | <a href="https://digitransit.fi/en/developers/apis/4-realtime-api/vehicle-positions/">Digitransit</a>`,
  }).addTo(map);

  const hue = indexToHue(0, r.polyline.length);
  const color = `hsla(${hue}, 70%, 42%, 0.75)`;
  const line = polyline(r.polyline, {
    color,
    weight: 6,
    dashArray: "8, 20",
  }).addTo(map);

  const p = popup({
    autoPanPadding: new Point(50, 50),
    className: "popup",
    offset: new Point(0, -10),
  }).setContent(`
        <div class="routeId">
        <span class="icon-bus"></span>
        ${r.shortName} (${r.longName})
        </div>
        <div class="dest">Route ID: ${r.gtfsId}</div>
        `);
  line.on("popupopen", () => {
    map.fitBounds(line.getBounds());
  });

  line.bindPopup(p);

  // control contains more stuff than what is in the typedefs
  // const lc = (control as any)
  //   .locate({
  //     icon: "icon-location",
  //     iconLoading: "icon-spinner animate-spin",
  //     setView: "once",
  //     clickBehavior: {
  //       inView: "setView",
  //       outOfView: "setView"
  //     },
  //     //keepCurrentZoomLevel: true,
  //     onLocationError: (err: Error) => console.log(err.message),
  //     locateOptions: {
  //       enableHighAccuracy: true,
  //       maxZoom: 14
  //     }
  //   })
  //   .addTo(map);

  // // Needed to make setView: 'once' work after programmatic .start() invocation
  // lc._justClicked = true;

  // lc.start();

  return map;
};
