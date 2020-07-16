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
  createLeafletElement(props: Props) {
    const positions = props.breadcrumbs.map(({ lat, lon, act_time }, idx) => {
      if (idx === props.breadcrumbs.length - 1) {
        return [lat, lon, 0];
      }

      return [
        lat,
        lon,
        distance(
          lat,
          lon,
          props.breadcrumbs[idx + 1].lat,
          props.breadcrumbs[idx + 1].lon
        ) *
          (act_time / 60 / 60),
      ];
    });
    // @ts-ignore: This is egregious and I hate it; I'll be damned if it doesn't work
    return L.hotline(positions, {
      outlineWidth: 0,
    }).addTo(props.leaflet.map);
  }

  updateLeafletElement(fromProps: Props, toProps: Props) {
    super.updateLeafletElement(fromProps, toProps);
  }
}

export default withLeaflet(Hotline);
