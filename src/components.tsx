import React from "react";
import { LoaderProps } from "./types.js";

export function Loader({ children, text }: LoaderProps) {
  return (
    <div className="rfpe-loader">
      <div className="rfpe-loader-spinner" />
      {children ?? <div className="rfpe-loader-text">{text}</div>}
    </div>
  );
}
