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

import MovingMarker from "./marker";
import { route_one } from "./api";
import { indexToHue } from "./utils";
import pkg from "../package.json";

export default () => {
  // Initialize the map
  const map = LeafletMap("map", {});

  const center: [number, number] = [45.5925204, -122.6080728];
  const zoom: number = 12;

  map.setView(center, zoom);

  const tileServer =
    "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";

  // Initialize the base layer
  tileLayer(tileServer, {
    maxZoom: 18,
    maxNativeZoom: 18,
    minZoom: 8,
    minNativeZoom: 8,
    attribution: `v${pkg.version} | &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | <a href="https://carto.com/location-data-services/basemaps/">CartoDB</a>`,
  }).addTo(map);

  const marker1 = new MovingMarker(route_one, 30000, { loop: true }).addTo(map);

  const hue = indexToHue(0, route_one.length);
  const color = `hsla(${hue}, 70%, 42%, 0.75)`;
  const line = polyline(route_one, {
    color,
    weight: 4,
  }).addTo(map);

  marker1.once("click", () => {
    marker1.start();
    marker1.closePopup();
    marker1.unbindPopup();
    marker1.on("click", () =>
      marker1.isRunning() ? marker1.pause() : marker1.start()
    );
  });

  marker1.bindPopup("<b>Click me to start !</b>", { closeOnClick: false });
  marker1.openPopup();

  const p = popup({
    autoPanPadding: new Point(50, 50),
    className: "popup",
    offset: new Point(0, -10),
  });
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