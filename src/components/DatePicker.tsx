import React from "react";
import {useObserver} from "mobx-react-lite";
import ReactDatePicker, {
    setDefaultLocale,
    registerLocale
} from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ja from "date-fns/locale/ja";
import AppUtils from "../utils/AppUtils";
import dayjs from "dayjs";
import Text from "./Text";
import Button from "./Button";
/** @jsx jsx */
import {jsx, css} from "@emotion/core";

export const jsxBabelFix = jsx;

registerLocale("ja", ja);
setDefaultLocale("ja");

type CustomInputProp = {
    value?: string | undefined;
    onClick?: (() => void) | undefined;
    size?: "sm" | "lg" | undefined;
};

const CustomInput: React.FC<CustomInputProp> = prop => {
    return <Button onClick={prop.onClick} className="fa fa-calendar"/>;
};

type DatePickerProp = {
    width?: string | number | string[] | React.ReactText[] | undefined;
    backgroundColor?: string | string[] | undefined;
    placeholder?: string | undefined;
    value?: string | undefined;
    onChange?: (value: string | undefined) => void;
    isInvalid?: boolean | undefined;
    size?: "sm" | "lg" | undefined;
    type?: string | undefined;
    readOnly?: boolean | undefined;
};

const DatePicker: React.FC<DatePickerProp> = prop => {
    const format = prop.type === 'date' ? 'YYYY/MM/DD' : "YYYY/MM";

    const PickerOnChange = (date: Date | null) => {
        let val = date ? dayjs(date).format(format) : "";
        prop.onChange && prop.onChange!(val);
    };

    const TextOnChange = (value: string | undefined) => {
        prop.onChange && prop.onChange!(value);
    };

    const TextOnBlur = (value: string | undefined) => {
        let target = AppUtils.formatDate(value, prop.type === 'date' ? '' : 'yyyy/mm');
        let dVal = dayjs(target);
        let val = dVal.isValid() ? dVal.format(format) : "";
        prop.onChange && prop.onChange!(val);
    };

    let dVal = dayjs(prop.value);
    const selected = dVal.isValid() ? dVal.toDate() : null;

    return useObserver(() => (
        <div css={css({width: 150})}>
            <div css={{width: 100, display: "inline-block"}}>
                <Text maxLength={prop.type === 'date' ? 10 : 7} value={prop.value} onChange={TextOnChange}
                      onBlur={TextOnBlur}
                      readOnly={prop.readOnly}
                      isInvalid={prop.isInvalid}/>
            </div>
            <div
                css={{
                    width: 30,
                    display: "inline-block",
                    verticalAlign: "top",
                    paddingLeft: 5
                }}
            >
                {prop.type === 'date' ? (
                    <ReactDatePicker
                        value={prop.value}
                        selected={selected}
                        onChange={(date: Date | null, e: React.FormEvent<any>) =>
                            PickerOnChange(date)
                        }
                        dateFormat="yyyy/MM"
                        customInput={<CustomInput/>}
                        popperModifiers={{
                            offset: {
                                enabled: true,
                                offset: "-100px, 2px"
                            }
                        }}
                    />
                ) : (
                    <ReactDatePicker
                        value={prop.value}
                        selected={selected}
                        onChange={(date: Date | null, e: React.FormEvent<any>) =>
                            PickerOnChange(date)
                        }
                        dateFormat="MM/yyyy"
                        showMonthYearPicker
                        customInput={<CustomInput/>}
                        popperModifiers={{
                            offset: {
                                enabled: true,
                                offset: "-100px, 2px"
                            }
                        }}
                    />
                )}
            </div>
        </div>
    ));
};
export default DatePicker;
