import React from "react";
import {Button, Form, FormGroup, Row, Col} from "react-bootstrap";

/** @jsx jsx */
import {jsx, css} from "@emotion/core";

export const jsxBabelFix = jsx;

type LabelProp = {
    width?: string | number | string[] | React.ReactText[] | undefined;
    marginLeft?: string | number | string[] | React.ReactText[] | undefined;
    marginRight?: string | number | string[] | React.ReactText[] | undefined;
    className?: string | undefined;
};

const Label: React.FC<LabelProp> = prop => {
    let classs = prop.className! + " col-form-label-sm";
    return (
        <Form.Label
            className={classs}
            css={css({
                marginLeft: prop.marginLeft!,
                marginRight: prop.marginRight!,
                width: prop.width!,
                textAlign: "right"
            })}
        >
            {prop.children}
        </Form.Label>
    );
};
export default Label;
