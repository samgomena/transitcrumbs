import React, { CSSProperties, memo, PropsWithChildren } from "react";

const styles: CSSProperties = {
  flex: 1,
  position: "relative",
  outline: "none",
};

type PaneProps = {
  className: string;
  split?: "vertical" | "horizontal";
  style?: {}; // CSSProperties;
  size?: string | number;
  elementRef?: () => {};
};

const Pane: React.FC<PropsWithChildren<PaneProps>> = ({
  children,
  className,
  split,
  style = {},
  size,
  elementRef,
}) => {
  const classes = ["Pane", split, className];

  if (size !== undefined) {
    if (split === "vertical") {
      styles.width = size;
    } else {
      styles.height = size;
      styles.display = "flex";
    }
    styles.flex = "none";
  }

  return (
    <div
      ref={elementRef}
      className={classes.join(" ")}
      style={{ ...style, ...styles }}
    >
      {children}
    </div>
  );
};

export default memo(Pane);
