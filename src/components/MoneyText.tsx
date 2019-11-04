import React from "react";
import { useLocalStore, useObserver } from "mobx-react-lite";
import { FormControl, FormControlProps } from "react-bootstrap";
import { Decimal } from "decimal.js";
import AppUtils from "../utils/AppUtils";

/** @jsx jsx */
import { jsx, css } from "@emotion/core";
export const jsxBabelFix = jsx;

type MoneyTextProp = {
  width?: string | number | string[] | React.ReactText[] | undefined;
  backgroundColor?: string | string[] | undefined;
  placeholder?: string | undefined;
  value?: string | undefined;
  onChange?: (value: string | undefined) => void;
  imeOff?: boolean | undefined;
  isInvalid?: boolean | undefined;
  size?: "sm" | "lg" | undefined;
  maxLength?: number | undefined;
};

const MoneyText: React.FC<MoneyTextProp> = prop => {
  const store = useLocalStore(() => ({
    value: ""
  }));
  const onChange = (event: React.FormEvent<FormControlProps>) => {
    let val = event.currentTarget.value || "";
    store.value = val;
    prop.onChange && prop.onChange!(val);
  };
  const onFocus = (event: React.FormEvent<HTMLInputElement>) => {
    let val = AppUtils.removeComma(event.currentTarget.value);
    if (!AppUtils.isInteger(val)) {
      val = "";
    }
    store.value = val;
  };
  const onBlur = (event: React.FormEvent<HTMLInputElement>) => {
    let val = AppUtils.removeComma(event.currentTarget.value);
    if (!AppUtils.isInteger(val)) {
      store.value = "";
    } else {
      let dec = new Decimal(val);
      store.value = AppUtils.separateByComma(dec.toNumber());
    }
    prop.onChange && prop.onChange!(store.value);
  };

  return useObserver(() => (
    <FormControl
      css={css({
        width: prop.width,
        textAlign: "right"
      })}
      size={prop.size}
      type="text"
      placeholder={prop.placeholder!}
      value={store.value}
      inputMode="url"
      onChange={(e: React.FormEvent<FormControlProps>) => onChange(e)}
      onFocus={(e: React.FormEvent<HTMLInputElement>) => onFocus(e)}
      onBlur={(e: React.FormEvent<HTMLInputElement>) => onBlur(e)}
      isInvalid={prop.isInvalid}
      maxLength={prop.maxLength}
    />
  ));
};
export default MoneyText;
