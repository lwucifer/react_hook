import React from "react";
import { FormControl, FormControlProps } from "react-bootstrap";

/** @jsx jsx */
import { jsx, css } from "@emotion/core";
export const jsxBabelFix = jsx;

type PasswordProp = {
  width?: string | number | string[] | React.ReactText[] | undefined;
  backgroundColor?: string | string[] | undefined;
  placeholder?: string | undefined;
  value?: string | undefined;
  onChange?: (value: string | undefined) => void;
  isInvalid?: boolean | undefined;
  size?: "sm" | "lg" | undefined;
};

const Password: React.FC<PasswordProp> = prop => {
  const onChange = (event: React.FormEvent<FormControlProps>) => {
    prop.onChange!(event.currentTarget.value);
  };

  return (
    <FormControl
      css={css({ width: prop.width, backgroundColor: "" })}
      size={prop.size}
      type="password"
      placeholder={prop.placeholder}
      value={prop.value!}
      onChange={(e: React.FormEvent<FormControlProps>) => onChange(e)}
      onFocus={(e: React.FormEvent<HTMLInputElement>) =>
        e.currentTarget.select()
      }
      isInvalid={prop.isInvalid}
    />
  );
};

export default Password;
