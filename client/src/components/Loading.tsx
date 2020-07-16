import React, { ReactChildren } from "react";

export default function Loading({
  loading,
  ...rest
}: {
  loading: boolean;
  rest: any;
}) {
  return (
    <div
      className={loading ? "spinner-border text-dark" : ""}
      {...rest}
      role="status"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}
