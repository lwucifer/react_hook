import React from "react";

import { FormControl, FormControlProps } from "react-bootstrap";

/** @jsx jsx */
import {jsx, css} from "@emotion/core";

export const jsxBabelFix = jsx;

type RadioProp = {
    name?: string | undefined;
    value?: string | undefined | number;
    className?: string | undefined;
    onChange?: (value: string | undefined) => void;
    onClick?: () => void;
    onBlur?: (value: string | undefined) => void;
    isInvalid?: boolean | undefined;
    checked?: boolean;
    items: Array<{ label: string, value: string , checked: boolean}>;
};
const Radio: React.FC<RadioProp> = prop => {
    const onChange = (event: React.FormEvent<FormControlProps>) => {
        prop.onChange && prop.onChange!(event.currentTarget.value);
    };
    const onBlur = (event: React.FormEvent<HTMLInputElement>) => {
        prop.onBlur && prop.onBlur!(event.currentTarget.value);
    };

    let i = 0;
    return (
        <div className={'radios'}>
            {prop.items.map(x => {
                i++;
                return (
                    <div className={'radio'} key={i}>
                        <FormControl
                            css={css({
                                width: 15,
                                height: 15
                            })}
                            className={prop.className}
                            type="radio"
                            value={x.value}
                            onClick={() => {
                                prop.onClick && prop.onClick!();
                            }}
                            defaultChecked={x.checked}
                            onChange={(e: React.FormEvent<FormControlProps>) => onChange(e)}
                            onBlur={(e: React.FormEvent<HTMLInputElement>) => onBlur(e)}
                            onFocus={(e: React.FormEvent<HTMLInputElement>) =>
                                e.currentTarget.select()
                            }
                            isInvalid={prop.isInvalid}
                            name={prop.name}
                        />
                        <label className={'ml-1'}>{x.label}</label>
                    </div>
                );
            })
            }
        </div>
    );
};

export default Radio;
