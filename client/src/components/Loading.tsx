import React from "react";

export default function Loading(props: any) {
  return (
    <div {...props} className="spinner-border text-dark" role="status">
      <span className="sr-only">Loading...</span>
    </div>
  );
}
