import React from "react";
import BootStrapButton from "react-bootstrap/Button";

/** @jsx jsx */
import {jsx, css} from "@emotion/core";

export const jsxBabelFix = jsx;

type ButtonProp = {
    size?: "lg" | "sm" | undefined;
    onClick?: () => void;
    className?: string | undefined;
    id?: string | undefined;
    width?: number | string | undefined;
    variant?:
        | "primary"
        | "secondary"
        | "success"
        | "danger"
        | "warning"
        | "info"
        | "dark"
        | "light"
        | "link"
        | "outline-primary"
        | "outline-secondary"
        | "outline-success"
        | "outline-danger"
        | "outline-warning"
        | "outline-info"
        | "outline-dark"
        | "outline-light";
    disabled?: boolean;
};

const Button: React.FC<ButtonProp> = prop => {
    return (
        <BootStrapButton
            size={prop.size}
            onClick={() => {
                prop.onClick && prop.onClick!();
            }}
            className={prop.className}
            id={prop.id}
            css={css({
                width: prop.width
            })}
            variant={prop.variant}
            disabled={prop.disabled}
        >
            {prop.children}
        </BootStrapButton>
    );
};
export default Button;
