import React from "react";
import { FormControl, FormControlProps } from "react-bootstrap";

/** @jsx jsx */
import { jsx, css } from "@emotion/core";
export const jsxBabelFix = jsx;

type TextProp = {
  width?: string | number | string[] | React.ReactText[] | undefined;
  placeholder?: string | undefined;
  value?: string | undefined;
  defaultValue?: string | undefined;
  type?: string | undefined;
  onChange?: (value: string | undefined) => void;
  onBlur?: (value: string | undefined) => void;
  imeOff?: boolean | undefined;
  isInvalid?: boolean | undefined;
  size?: "sm" | "lg" | undefined;
  maxLength?: number | undefined;
  readOnly?: boolean | undefined;
};

const Text: React.FC<TextProp> = prop => {
  const onChange = (event: React.FormEvent<FormControlProps>) => {
    prop.onChange && prop.onChange!(event.currentTarget.value);
  };
  const onBlur = (event: React.FormEvent<HTMLInputElement>) => {
    prop.onBlur && prop.onBlur!(event.currentTarget.value);
  };

  const type = prop.type ? prop.type : 'text';
  return (
    <FormControl
      css={css({
        width: prop.width
      })}
      size={prop.size}
      type={type}
      placeholder={prop.placeholder!}
      value={prop.value!}
      defaultValue={prop.defaultValue!}
      inputMode={prop.imeOff ? "url" : "text"}
      onChange={(e: React.FormEvent<FormControlProps>) => onChange(e)}
      onBlur={(e: React.FormEvent<HTMLInputElement>) => onBlur(e)}
      onFocus={(e: React.FormEvent<HTMLInputElement>) =>
        e.currentTarget.select()
      }
      isInvalid={prop.isInvalid}
      maxLength={prop.maxLength}
      readOnly={prop.readOnly}
    />
  );
};

export default Text;
