import React, {useEffect} from "react";
import Button from "../../components/Button";
import Row from "../../components/Row";
import Label from "../../components/Label";
import Text from "../../components/Text";
import MainLayout from "../../layouts/MainLayout";
import "free-jqgrid";
import "free-jqgrid/dist/i18n/grid.locale-ja";

/** @jsx jsx */
import {jsx, css} from "@emotion/core";
import {useLocalStore, useObserver} from "mobx-react-lite";
import {
    clearInvalidProp,
    createInputProp,
    createInputStore, downloadNoConfirm,
} from "../../utils/AppUtils";
import {storeContext} from "../../Context";
import DatePicker from "../../components/DatePicker";
import Checkbox from "../../components/Checkbox";

export const jsxBabelFix = jsx;

type DataOutputProp = {};

const conditionBlock = css({
    padding: 10,
    display: "inline-block",
    verticalAlign: "top"
});

const DataOutput: React.FC<DataOutputProp> = prop => {
    const grobalStore = React.useContext(storeContext);
    const store = useLocalStore(() => ({
        disabled: true,
        loaded: false,
        kbnMh: createInputStore<string>("発注元区分　MH", '1'),
        kbnShagai: createInputStore<string>("発注元区分　社外", '1'),
        kbnBunpai: createInputStore<string>("発注元区分　社内分配", '1'),
        constName: createInputStore<string>("邸名"),
        juchuTeamCode: createInputStore<string>("部署コード"),
        juchuTeamName: '',
        juchuTantoId: createInputStore<string>("部署"),
        juchuTantoName: '',
        uriageTeamCode: createInputStore<string>("売上チーム"),
        uriageTeamName: '',
        uriageTantoId: createInputStore<string>("売上担当者"),
        uriageTantoName: '',
        hatchumotoCode: createInputStore<string>("発注元"),
        hatchumotoSecCode: createInputStore<string>("支店・事務所コード"),
        hatchumotoName: '',

        uriageYoteiYmFrom: createInputStore<string>("売上予定年月"),
        uriageYoteiYmTo: createInputStore<string>("売上予定年月"),
        juchuYmFrom: createInputStore<string>("受注年月"),
        juchuYmTo: createInputStore<string>("受注年月"),

        seikyuYmFrom1: createInputStore<string>("請求年月１"),
        seikyuYmFrom2: createInputStore<string>("請求年月２"),
        seikyuYmTo1: createInputStore<string>("請求年月１"),
        seikyuYmTo2: createInputStore<string>("請求年月２"),
        nyukinYmFrom1: createInputStore<string>("入金年月１"),
        nyukinYmFrom2: createInputStore<string>("入金年月２"),
        nyukinYmTo1: createInputStore<string>("入金年月１"),
        nyukinYmTo2: createInputStore<string>("入金年月２"),

        torihikisakiName: '',
        torihikisakiCode: createInputStore<string>("会社名"),

        uriageBushoCode : createInputStore<string>(""),
        uriageBumonCode : createInputStore<string>(""),
        juchuBushoCode : createInputStore<string>(""),
        juchuBumonCode : createInputStore<string>(""),
    }));

    useEffect(() => {
        if (store.loaded) {
            store.disabled = false;
        }
        store.loaded = true;
    });

    return useObserver(() => (
        <MainLayout
            systemName="業務システム"
            tilte="データ出力"
        >
            <div className={'table max-w'}>
                <div css={conditionBlock} className={'form p-0'}>
                    <Row>
                        <Label width={120}>受注チーム</Label>
                        <Text width={200} value={store.juchuTeamName} readOnly={true}/>
                        <Button
                            className="fa fa-search"
                            onClick={async () => {
                                const ret = await grobalStore!.showTeamSearchDialog();
                                if (ret) {
                                    store.juchuTeamCode!.value = ret.teamCode;
                                    store.juchuTeamName = String(ret.teamName);
                                }
                            }}
                        />
                        <Button className="mr-5px" variant={'secondary'}
                                onClick={() => {
                                    store.juchuTeamCode!.value = '';
                                    store.juchuTeamName = '';
                                }}
                        >取消</Button>
                    </Row>
                    <Row>
                        <Label width={120}>売上チーム</Label>
                        <Text width={200} value={store.uriageTeamName} readOnly={true}/>
                        <Button
                            className="fa fa-search"
                            onClick={async () => {
                                const ret = await grobalStore!.showTeamSearchDialog();
                                if (ret) {
                                    store.uriageTeamCode!.value = ret.teamCode;
                                    store.uriageTeamName = String(ret.teamName);
                                }
                            }}
                        />
                        <Button className="mr-5px" variant={'secondary'}
                                onClick={() => {
                                    store.uriageTeamCode!.value = '';
                                    store.uriageTeamName = '';
                                }}
                        >取消</Button>
                    </Row>
                    <Row>
                        <Label width={120}>発注元区分</Label>
                        <Checkbox label={'MH'} {...createInputProp(store.kbnMh)} checked={true}/>
                    </Row>
                    <Row>
                        <Label width={120} className="mid-label"></Label>
                        <Checkbox label={'社外'} {...createInputProp(store.kbnShagai)} checked={true}/>
                    </Row>
                    <Row>
                        <Label width={120}></Label>
                        <Checkbox label={'社内分配'} {...createInputProp(store.kbnBunpai)} checked={true}/>
                    </Row>
                    <Row>
                        <Label width={120}>邸名</Label>
                        <Text width={200} {...createInputProp(store.constName!)} maxLength={40}/>
                    </Row>
                    <Row>
                        <Label width={120}> 受注年月</Label>
                        <DatePicker width={200} {...createInputProp(store.juchuYmFrom!)}/>
                        <span className={'mr-2'}>～</span>
                        <DatePicker width={200} {...createInputProp(store.juchuYmTo!)}/>
                    </Row>
                    <Row>
                        <Label width={120}>請求年月１</Label>
                        <DatePicker width={200} {...createInputProp(store.seikyuYmFrom1!)}/>
                        <span className={'mr-2'}>～</span>
                        <DatePicker width={200} {...createInputProp(store.seikyuYmTo1!)}/>
                    </Row>
                    <Row>
                        <Label width={120}>請求年月２</Label>
                        <DatePicker width={200} {...createInputProp(store.seikyuYmFrom2!)}/>
                        <span className={'mr-2'}>～</span>
                        <DatePicker width={200} {...createInputProp(store.seikyuYmTo2!)}/>
                    </Row>
                </div>
                <div css={conditionBlock} className={'form p-0'}>
                    <Row>
                        <Label width={120}> 受注担当者</Label>
                        <Text width={200} value={store.juchuTantoName} readOnly={true}/>
                        <Button
                            className="fa fa-search"
                            onClick={async () => {
                                const ret = await grobalStore!.showUserSearchDialog();
                                if (ret) {
                                    store.juchuTantoId!.value = ret.userId;
                                    store.juchuTantoName = String(ret.userName);
                                    store.juchuBumonCode!.value = ret.bumonCode;
                                    store.juchuBushoCode!.value = ret.bushoCode;
                                }
                            }}
                        />
                        <Button className="mr-5px" variant={'secondary'}
                                onClick={() => {
                                    store.juchuTantoId!.value = '';
                                    store.juchuTantoName = '';
                                    store.juchuBumonCode!.value = '';
                                    store.juchuBushoCode!.value = '';
                                }}
                        >取消</Button>
                    </Row>
                    <Row>
                        <Label width={120}> 売上担当者</Label>
                        <Text width={200} value={store.uriageTantoName} readOnly={true}/>
                        <Button
                            className="fa fa-search"
                            onClick={async () => {
                                const ret = await grobalStore!.showUserSearchDialog();
                                if (ret) {
                                    store.uriageTantoId!.value = ret.userId;
                                    store.uriageTantoName = String(ret.userName);
                                    store.uriageBumonCode!.value = ret.bumonCode;
                                    store.uriageBushoCode!.value = ret.bushoCode;
                                }
                            }}
                        />
                        <Button className="mr-5px" variant={'secondary'}
                                onClick={() => {
                                    store.uriageTantoId!.value = '';
                                    store.uriageTantoName = '';
                                    store.uriageBumonCode!.value = '';
                                    store.uriageBushoCode!.value = '';
                                }}
                        >取消</Button>
                    </Row>
                    <Row>
                        <Label width={120} className={store.kbnMh.value === '0' ? 'disabled' : ''}>支店・事業所</Label>
                        <Text width={200} {...createInputProp(store.hatchumotoSecCode!)} readOnly={true}/>
                        <Button
                            className='fa fa-search'
                            disabled={store.kbnMh.value === '0'}
                            onClick={async () => {
                                const ret = await grobalStore!.showBranchSearchDialog();
                                if (ret) {
                                    store.hatchumotoSecCode!.value = ret.labelName;
                                }
                            }}
                        />
                        <Button className="mr-5px" variant={'secondary'}
                                onClick={() => {
                                    store.hatchumotoSecCode!.value = '';
                                }}
                        >取消</Button>
                    </Row>
                    <Row>
                        <Label width={120} className={store.kbnShagai.value === '0' ? 'disabled' : ''}>会社名</Label>
                        <Text width={200} value={store.torihikisakiName} readOnly={true}/>
                        <Button
                            className="fa fa-search"
                            disabled={store.kbnShagai.value === '0'}
                            onClick={async () => {
                                const ret = await grobalStore!.showTorihikisakiSearchDialog({kbn: "OTHER"});
                                if (ret) {
                                    store.torihikisakiCode!.value = ret.torihikisakiCode;
                                    store.torihikisakiName = String(ret.torihikisakiName);
                                }
                            }}
                        />
                        <Button className="mr-5px" variant={'secondary'}
                                onClick={() => {
                                    store.torihikisakiCode!.value = '';
                                    store.torihikisakiName = '';
                                }}
                        >取消</Button>
                    </Row>
                    <Row><span className={'h40'}/></Row>
                    <Row><span className={'h40'}/></Row>
                    <Row>
                        <Label width={120}> 売上予定年月</Label>
                        <DatePicker width={200} {...createInputProp(store.uriageYoteiYmFrom!)}/>
                        <span className={'mr-2'}>～</span>
                        <DatePicker width={200} {...createInputProp(store.uriageYoteiYmTo!)}/>
                    </Row>
                    <Row>
                        <Label width={120}>入金年月１</Label>
                        <DatePicker width={200} {...createInputProp(store.nyukinYmFrom1!)}/>
                        <span className={'mr-2'}>～</span>
                        <DatePicker width={200} {...createInputProp(store.nyukinYmTo1!)} />
                    </Row>
                    <Row>
                        <Label width={120}>入金年月２</Label>
                        <DatePicker width={200} {...createInputProp(store.nyukinYmFrom2!)}/>
                        <span className={'mr-2'}>～</span>
                        <DatePicker width={200} {...createInputProp(store.nyukinYmTo2!)} />
                    </Row>
                </div>
            </div>
            <Button size="lg" className={'float-right'}
                    onClick={() => {
                        clearInvalidProp(store);
                        downloadNoConfirm("dataOutput/download", store, grobalStore)
                    }}
            >出力</Button>
        </MainLayout>
    ));
};

export default DataOutput;
