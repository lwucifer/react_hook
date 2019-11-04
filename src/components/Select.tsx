import React from "react";
import { FormControl, FormControlProps } from "react-bootstrap";
import _ from "lodash";

/** @jsx jsx */
import { jsx, css } from "@emotion/core";
export const jsxBabelFix = jsx;

type SelectProp<T> = {
  width?: string | number | string[] | React.ReactText[] | undefined;
  value?: T | undefined;
  onChange?: (value: T | undefined) => void;
  isInvalid?: boolean | undefined;
  size?: "sm" | "lg" | undefined;
  readOnly?: boolean | undefined;
  items: Array<{ label: string; value: string }>;
};

type SelectI<T = any> = React.FC<SelectProp<T>>;

const encodeValue = (value: string | boolean | number | undefined) => {
  if (_.isString(value)) {
    return value + "";
  }
  if (_.isBoolean(value)) {
    return value + "";
  }
  if (_.isNumber(value)) {
    return value + "";
  }
  return undefined;
};
const decodeValue = (
  value: string | boolean | number | undefined,
  changedValue: string | undefined
) => {
  if (!changedValue) {
    return undefined;
  }
  if (_.isString(value)) {
    return changedValue;
  }
  if (_.isBoolean(value)) {
    return (changedValue　=== "true");
  }
  if (_.isNumber(value)) {
    return _.toNumber(changedValue);
  }
  return undefined;
};
let i=0;
const Select: SelectI = prop => {
  const onChange = (event: React.FormEvent<FormControlProps>) => {
    prop.onChange &&
      prop.onChange!(decodeValue(prop.value!, event.currentTarget.value));
  };

  return (
    <FormControl
      as="select"
      css={css({
        width: prop.width
      })}
      size={prop.size}
      value={encodeValue(prop.value!)}
      onChange={(e: React.FormEvent<FormControlProps>) => onChange(e)}
      isInvalid={prop.isInvalid}
      readOnly={prop.readOnly}
    >
      {prop.items.map(x => {
        i++;
        return (
          <option key={i} value={x.value}>
            {x.label}
          </option>
        );
      })}
    </FormControl>
  );
};

export const SelectNum = Select as SelectI<number>;
export const SelectStr = Select as SelectI<string>;
export const SelectBool = Select as SelectI<boolean>;
