import React from "react";

type ResizeProps = {
  className: string;
  onClick?: React.MouseEventHandler;
  onDoubleClick?: React.MouseEventHandler;
  onMouseDown: React.MouseEventHandler;
  resizeClassName: string;
  split: "vertical" | "horizontal";
  style: React.CSSProperties;
};

const Resize: React.FC<ResizeProps> = ({
  className,
  onClick,
  onDoubleClick,
  onMouseDown,
  resizeClassName,
  split,
  style,
}) => {
  const classes = [resizeClassName, split, className];
  const onClickIfExists = (
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>,
    cb?: React.MouseEventHandler<HTMLSpanElement>
  ) => {
    if (cb) {
      e.preventDefault();
      cb(e);
    }
  };

  return (
    <span
      role="presentation"
      className={classes.join(" ")}
      style={style}
      onMouseDown={(e) => onMouseDown(e)}
      onClick={(e) => onClickIfExists(e, onClick)}
      onDoubleClick={(e) => onClickIfExists(e, onDoubleClick)}
    />
  );
};

export default Resize;
