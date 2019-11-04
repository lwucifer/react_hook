import React from "react";
import {FormControl, FormControlProps} from "react-bootstrap";

/** @jsx jsx */
import {jsx, css} from "@emotion/core";

export const jsxBabelFix = jsx;

type CheckProp = {
    placeholder?: string | undefined;
    label?: string | undefined;
    value?: string | undefined;
    checked?: boolean;
    onChange?: (value: string | undefined) => void;
    onBlur?: (value: string | undefined) => void;
    isInvalid?: boolean | undefined;
};

const Checkbox: React.FC<CheckProp> = prop => {
    const onChange = (event: React.FormEvent<FormControlProps>) => {
        const checkbox = event.target as HTMLInputElement;
        prop.onChange && prop.onChange!(checkbox.checked ? '1' : '0');
    };
    const onBlur = (event: React.FormEvent<HTMLInputElement>) => {
        const checkbox = event.target as HTMLInputElement;
        prop.onBlur && prop.onBlur!(checkbox.checked ? '1' : '0');
    };

    return (
        <div className={'checkbox'}>
            <FormControl
                css={css({
                    width: 15,
                    height: 15
                })}
                type="checkbox"
                defaultChecked={prop.checked!}
                onChange={(e: React.FormEvent<FormControlProps>) => onChange(e)}
                onBlur={(e: React.FormEvent<HTMLInputElement>) => onBlur(e)}
                onFocus={(e: React.FormEvent<HTMLInputElement>) =>
                    e.currentTarget.select()
                }
                isInvalid={prop.isInvalid}
            />
            <label className={'ml-1'}>{prop.label}</label>
        </div>
    );
};

export default Checkbox;
