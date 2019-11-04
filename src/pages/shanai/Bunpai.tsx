import React, {useEffect} from "react";
import Button from "../../components/Button";
import Row from "../../components/Row";
import Label from "../../components/Label";
import Text from "../../components/Text";
import MainLayout from "../../layouts/MainLayout";
import $ from "jquery";
import "free-jqgrid";
import "free-jqgrid/dist/i18n/grid.locale-ja";

/** @jsx jsx */
import {jsx, css} from "@emotion/core";
import {useLocalStore, useObserver} from "mobx-react-lite";
import {
    clearInvalidProp,
    covertToInt,
    createInputProp,
    createInputStore,
    createInputValueObject,
    ErrorResData,
    postRequest,
    removeComma,
    resetStore,
    separateByComma,
    checkTaxRate
} from "../../utils/AppUtils";
import {storeContext} from "../../Context";
import Radio from "../../components/Radio";
import DatePicker from "../../components/DatePicker";
import {globalState} from "mobx/lib/core/globalstate";

export const jsxBabelFix = jsx;

type BunpaiProp = {};

const conditionBlock = css({
    padding: 10,
    display: "inline-block",
    verticalAlign: "top"
});

type ShanaiBunpai = {};

const Bunpai: React.FC<BunpaiProp> = prop => {
    const grobalStore = React.useContext(storeContext);
    const store = useLocalStore(() => ({
        constNo: createInputStore<string>("工事番号"),
        constDetailNo: createInputStore<string>("工事番号枝番"),
        kbn: createInputStore<string>("区分",'0'),
        constName: createInputStore<string>("物件名"),
        bunpaigakuZeiNuki: createInputStore<string>("分配額（税抜）"),
        bunpaigakuZeiKomi: createInputStore<string>("分配額（税込）"),
        taxRate: createInputStore<string>("税率"),
        genTantoId: createInputStore<string>("現担当者"),
        bunpaiTantoId: createInputStore<string>("分配担当者"),
        bunpaiKbn: createInputStore<string>("分配内容" , '0'),
        bunpaiYm: createInputStore<string>("分配月"),
        uriageYm: createInputStore<string>("売上月"),
        biko: createInputStore<string>("備考"),
        genTantoName: '',
        bunpaiTantoName: '',
        bunpaigakuZeiNukiTemp: '',
        bunpaigakuZeiKomiTemp: '',

        genBushoCode: createInputStore<string>(""),
        genBumonCode: createInputStore<string>(""),
        genTeamCode: createInputStore<string>(""),
        bunpaiBushoCode: createInputStore<string>(""),
        bunpaiBumonCode: createInputStore<string>(""),
        bunpaiTeamCode: createInputStore<string>(""),

        async validate(sendData: { shanaiBunpai: ShanaiBunpai }) {
            const validateRes = await postRequest<{ token: string }>(
                "shanaiBunpai/validate",
                sendData
            );
            if (validateRes instanceof ErrorResData) {
                await grobalStore!.showInvalidAlert(validateRes, this);
                if (store.taxRate.isInvalid) store.taxRate.value = '';
                return false;
            }
            return true;
        },

        async create() {
            clearInvalidProp(this);
            let sendData = {
                shanaiBunpai: Object.assign(createInputValueObject(this))
            };

            if (!(await this.validate(sendData))) {
                return;
            }

            if (
                !(await grobalStore!.showConfirm(
                    "部署情報を登録します。よろしいですか？"
                ))
            ) {
                return;
            }
            const createRes = await postRequest<{ token: string }>(
                "shanaiBunpai/update",
                sendData
            );
            if (createRes instanceof ErrorResData) {
                await grobalStore!.showInvalidAlert(createRes, this);
                return;
            }
            await grobalStore!.showAlert("部署情報を登録しました。");

            resetStore(this);
            store.bunpaiTantoName = '';
            store.genTantoName = '';
            store.bunpaigakuZeiNukiTemp = '';
            store.bunpaigakuZeiKomiTemp = '';
            store.bunpaiKbn.value = '0';
            $(".input_radio").prop("checked", false)
                .filter('[value="0"]').prop("checked", true);
        },

        async setValueNuki(komi: any, tax: any) {
            if (komi) {
                let com;
                let rate = tax ? 100 + covertToInt(tax) : 100;
                let i = covertToInt(komi) / rate * 100;
                store.bunpaigakuZeiNukiTemp = com = separateByComma(covertToInt(String(i)));
                store.bunpaigakuZeiNuki.value = removeComma(com);
            } else {
                store.bunpaigakuZeiNukiTemp = '';
                store.bunpaigakuZeiNuki.value = '';
            }
        },
    }));

    useEffect(() => { });

    return useObserver(() => (
        <MainLayout
            systemName="業務システム"
            tilte="社内分配入力"
        >
            <div className={'table max-w'}>
                <div css={conditionBlock} className={'form p-0'}>
                    <Row>
                        <Label width={135}>工事番号</Label>
                        <Text width={100} maxLength={8} imeOff {...createInputProp(store.constNo)}/>
                        <span className={'ml-1 mr-2'}>-</span>
                        <Text width={50} maxLength={2} {...createInputProp(store.constDetailNo)}/>
                    </Row>
                    <Row>
                        <Label width={135}>分配額（税抜）</Label>
                        <Text width={120} value={store.bunpaigakuZeiNukiTemp} readOnly={true} maxLength={40}/>
                    </Row>
                    <Row>
                        <Label width={135}>現担当者</Label>
                        <Text width={200} value={store.genTantoName} readOnly={true} isInvalid={store.genTantoId.isInvalid}/>
                        <Button
                            className="fa fa-search"
                            onClick={async () => {
                                const ret = await grobalStore!.showUserSearchDialog();
                                if (ret) {
                                    store.genBushoCode!.value = ret.bushoCode;
                                    store.genBumonCode!.value = ret.bumonCode;
                                    store.genTeamCode!.value = ret.teamCode;
                                    store.genTantoId!.value = ret.userId;
                                    store.genTantoName = String(ret.userName);
                                }
                            }}
                        />
                        <Button className="mr-5px" variant={'secondary'}
                                onClick={() => {
                                    store.genBushoCode!.value = '';
                                    store.genBumonCode!.value = '';
                                    store.genTeamCode!.value = '';
                                    store.genTantoId!.value = '';
                                    store.genTantoName = '';
                                }}
                        >取消</Button>
                    </Row>
                    <Row>
                        <Label width={135}>分配先担当者</Label>
                        <Text width={200} value={store.bunpaiTantoName} readOnly={true} isInvalid={store.bunpaiTantoId.isInvalid}/>
                        <Button
                            className="fa fa-search"
                            onClick={async () => {
                                const ret = await grobalStore!.showUserSearchDialog();
                                if (ret) {
                                    store.bunpaiTantoId!.value = ret.userId;
                                    store.bunpaiTantoName = String(ret.userName);
                                    store.bunpaiBushoCode!.value = ret.bushoCode;
                                    store.bunpaiBumonCode!.value = ret.bumonCode;
                                    store.bunpaiTeamCode!.value = ret.teamCode;
                                }
                            }}
                        />
                        <Button className="mr-5px" variant={'secondary'}
                                onClick={() => {
                                    store.bunpaiTantoId!.value = '';
                                    store.bunpaiTantoName = '';
                                    store.bunpaiBushoCode!.value = '';
                                    store.bunpaiBumonCode!.value = '';
                                    store.bunpaiTeamCode!.value = '';
                                }}
                        >取消</Button>
                    </Row>
                    <Row>
                        <Label width={135}>	分配内容</Label>
                        <Radio name={'name'}
                               className={'input_radio'}
                               items={[
                                   {label: '売上のみ', value: '0', checked: store.bunpaiKbn!.value == '0'},
                                   {label: '受注・売上の両方', value: '1', checked: store.bunpaiKbn!.value == '1'},
                                   {label: '受注のみ', value: '2', checked: store.bunpaiKbn!.value == '2'}
                               ]}
                        {...createInputProp(store.bunpaiKbn!)}
                        />
                    </Row>
                    <Row>
                        <Label width={135}>	分配月</Label>
                        <DatePicker {...createInputProp(store.bunpaiYm)}/>
                    </Row>
                    <Row>
                        <Label width={135}>備考</Label>
                        <Text width={400} {...createInputProp(store.biko!)} maxLength={200}/>
                    </Row>
                </div>
                <div css={conditionBlock} className={'form p-0 border-left-0'}>
                    <Row>
                        <Label width={135}>	物件名</Label>
                        <Text width={200} {...createInputProp(store.constName!)} maxLength={40}/>
                    </Row>
                    <Row>
                        <Label width={135}>分配額（税込）</Label>
                        <Text width={100}  value={store.bunpaigakuZeiKomiTemp}
                              isInvalid={store['bunpaigakuZeiKomi'].isInvalid}
                              onChange={async (e) => {
                                  let num = removeComma(e);
                                  let com = separateByComma(covertToInt(num));
                                  store.bunpaigakuZeiKomi.value = num;
                                  store.bunpaigakuZeiKomiTemp = com;
                                  store.setValueNuki(num, store.taxRate.value);
                              }}
                        />
                        <Label width={135} marginLeft={100}>税率</Label>
                        <Text width={50} {...createInputProp(store.taxRate!)} maxLength={2}
                              onBlur={async (e) => {
                                  checkTaxRate(e, store, grobalStore);
                                  store.setValueNuki(store.bunpaigakuZeiKomi.value, e);
                              }}
                        />
                        <span>%</span>
                    </Row>
                    <Row><span className={'h40'}/></Row>
                    <Row><span className={'h40'}/></Row>
                    <Row><span className={'h40'}/></Row>
                    <Row>
                        <Label width={135}>売上月</Label>
                        <DatePicker {...createInputProp(store.uriageYm)}/>
                    </Row>
                    <Row><span className={'h40'}/></Row>
                </div>
            </div>
            <Button size="lg" onClick={store.create} className={'float-right'}>更新</Button>
        </MainLayout>
    ));
};

export default Bunpai;
