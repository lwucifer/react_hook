import React from "react";
import { FormControl, FormControlProps } from "react-bootstrap";
import { Decimal } from "decimal.js";
import AppUtils from "../utils/AppUtils";

/** @jsx jsx */
import { jsx, css } from "@emotion/core";
export const jsxBabelFix = jsx;

type DecimalTextProp = {
  width?: string | number | string[] | React.ReactText[] | undefined;
  backgroundColor?: string | string[] | undefined;
  placeholder?: string | undefined;
  value?: string | undefined;
  onChange?: (value: string | undefined) => void;
  imeOff?: boolean | undefined;
  isInvalid?: boolean | undefined;
  size?: "sm" | "lg" | undefined;
  precision: number;
  scale?: number | undefined;
};

const DecimalText: React.FC<DecimalTextProp> = prop => {
  const onChange = (event: React.FormEvent<FormControlProps>) => {
    let val = event.currentTarget.value || "";
    prop.onChange && prop.onChange!(val);
  };
  const onBlur = (event: React.FormEvent<HTMLInputElement>) => {
    let val = event.currentTarget.value;
    if (
      !AppUtils.isDecimal(event.currentTarget.value, prop.precision, prop.scale)
    ) {
      val = "";
    }
    prop.onChange && prop.onChange!(val);
  };

  return (
    <FormControl
      css={css({
        width: prop.width,
        textAlign: "right"
      })}
      size={prop.size}
      type="text"
      placeholder={prop.placeholder!}
      value={prop.value}
      inputMode="url"
      onChange={(e: React.FormEvent<FormControlProps>) => onChange(e)}
      onBlur={(e: React.FormEvent<HTMLInputElement>) => onBlur(e)}
      onFocus={(e: React.FormEvent<HTMLInputElement>) =>
        e.currentTarget.select()
      }
      isInvalid={prop.isInvalid}
      maxLength={prop.precision + 1}
    />
  );
};
DecimalText.defaultProps = {
  scale: 0
};
export default DecimalText;
