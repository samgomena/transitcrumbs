import { ReactChild } from "react";
import { createPortal } from "react-dom";

import {
  MapControl,
  MapControlProps,
  withLeaflet,
  LeafletContext,
} from "react-leaflet";
import { Control as LeafletControl, DomUtil, DomEvent } from "leaflet";

const DivControl = LeafletControl.extend({
  options: {
    className: "",
  },
  onAdd: function () {
    const container = DomUtil.create("div", this.options.className);
    DomEvent.disableClickPropagation(container);
    return container;
  },
});

type ControlProps = {
  children: ReactChild;
  position: string;
  className?: string;
} & MapControlProps &
  LeafletContext;

class Control extends MapControl {
  createLeafletElement(props: ControlProps) {
    return new DivControl(props);
  }

  updateLeafletElement(fromProps: ControlProps, toProps: ControlProps) {
    super.updateLeafletElement(fromProps, toProps);
  }

  componentDidMount() {
    // Appease the typescript god cuz componentDidMount "could be undefined"
    if (super.componentDidMount === undefined) return null;

    super.componentDidMount();
    this.forceUpdate();
  }

  render() {
    const container = this.leafletElement && this.leafletElement.getContainer();

    return container !== undefined
      ? createPortal(this.props.children, container)
      : null;
  }
}

export default withLeaflet(Control);
