import React, { Children, ReactChild } from "react";
import { render, unmountComponentAtNode } from "react-dom";

import { MapControl, withLeaflet, MapControlProps } from "react-leaflet";
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
  className: string;
  children: ReactChild;
  position: string;
} & MapControlProps;

class Control extends MapControl {
  constructor(props: ControlProps) {
    super(props);
  }

  createLeafletElement({ position, className }: ControlProps) {
    this.leafletElement = new DivControl({ position, className });
    return this.leafletElement;
  }

  updateLeafletElement(fromProps: ControlProps, toProps: ControlProps) {
    super.updateLeafletElement(fromProps, toProps);
    this.renderContent();
  }

  componentDidMount() {
    super.componentDidMount();
    this.renderContent();
  }

  componentWillUnmount() {
    unmountComponentAtNode(this.leafletElement.getContainer());
    super.componentWillUnmount();
  }

  renderContent() {
    const container = this.leafletElement.getContainer();
    render(Children.only(this.props.children), container);
  }
}

export default withLeaflet(Control);
