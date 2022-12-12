import React from "react";
import Pane from "./Pane";

const Split: React.FC<SplitProps> = ({
  children,
  allowResize = true,
  className = "",
  minSize = 50,
  primary = "first",
  split = "vertical",
  paneClassName = "",
  pane1ClassName = "",
  pane2ClassName = "",
}) => {
  const classes = ["Split", className, split];

  const nonNullChildren = React.Children.toArray(children).filter(
    (child) => child
  );

  return (
    <div className={classes.join(" ")}>
      <Pane className={pane1ClassName} key="pane1">
        {nonNullChildren[0]}
      </Pane>
    </div>
  );
};

export default Split;

// Types

type SplitProps = {
  allowResize?: boolean;
  children: React.ReactNode;
  className?: string;
  primary?: "first" | "second";
  minSize?: string | number;
  maxSize?: string | number;
  defaultSize?: string | number;
  size?: string | number;
  split?: "horizontal" | "vertical";
  paneClassName?: string;
  pane1ClassName?: string;
  pane2ClassName?: string;
};
