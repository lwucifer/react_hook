import React from "react";
import { Interpolation } from "@emotion/serialize";

/** @jsx jsx */
import { jsx, css } from "@emotion/core";
export const jsxBabelFix = jsx;

type RowProp = {
  css?: Interpolation;
};

const Row: React.FC<RowProp> = prop => {
  return <div className={'irow'} css={css(prop.css, { display: "flex",marginBottom: 10, alignItems: "center" })}>{prop.children}</div>;
};
export default Row;
