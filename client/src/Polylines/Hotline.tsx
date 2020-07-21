import React from "react";

import L from "leaflet";
import { withLeaflet, Path, PolylineProps } from "react-leaflet";

import { Breadcrumb } from "../Map/Map";
import { distance } from "../utils";

// Yikes!
require("leaflet-hotline")(L);

type Props = {
  positions: Array<Breadcrumb>;
} & PolylineProps;

class Hotline extends Path<PolylineProps, L.Polyline> {
  createLeafletElement({ positions, leaflet }: Props) {
    const positionsWSpeed = positions.map(({ lat, lon, act_time }, idx) => {
      // Set last LatLng 'heat' to 0 as it probably doesn't matter
      if (idx === positions.length - 1) {
        return [lat, lon, 0];
      }

      return [
        lat,
        lon,
        distance(lat, lon, positions[idx + 1].lat, positions[idx + 1].lon) *
          (act_time / 60 / 60),
      ];
    });
    // @ts-ignore: This is egregious and I hate it; I'll be damned if it doesn't work
    return L.hotline(positionsWSpeed, {
      outlineWidth: 0,
      palette: { 0.0: "red", 0.5: "yellow", 1.0: "green" },
    }).addTo(leaflet?.map);
  }

  updateLeafletElement(fromProps: Props, toProps: Props) {
    super.updateLeafletElement(fromProps, toProps);
    this.leafletElement.redraw();
  }
}

export default withLeaflet(Hotline);
