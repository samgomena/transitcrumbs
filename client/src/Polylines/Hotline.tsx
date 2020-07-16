import React from "react";

import L from "leaflet";
import { withLeaflet, Path, PolylineProps } from "react-leaflet";

import { Breadcrumb } from "../Map/Map";
import { distance } from "../utils";

// Yikes!
require("leaflet-hotline")(L);

type Props = {
  breadcrumbs: Array<Breadcrumb>;
} & PolylineProps;

class Hotline extends Path<PolylineProps, L.Polyline> {
  createLeafletElement({ breadcrumbs, leaflet }: Props) {
    const positions = breadcrumbs.map(({ lat, lon, act_time }, idx) => {
      // Set last LatLng 'heat' to 0 as it probably doesn't matter
      if (idx === breadcrumbs.length - 1) {
        return [lat, lon, 0];
      }

      return [
        lat,
        lon,
        distance(lat, lon, breadcrumbs[idx + 1].lat, breadcrumbs[idx + 1].lon) *
          (act_time / 60 / 60),
      ];
    });
    // @ts-ignore: This is egregious and I hate it; I'll be damned if it doesn't work
    return L.hotline(positions, {
      outlineWidth: 0,
    }).addTo(leaflet?.map);
  }

  updateLeafletElement(fromProps: Props, toProps: Props) {
    super.updateLeafletElement(fromProps, toProps);
  }
}

export default withLeaflet(Hotline);
