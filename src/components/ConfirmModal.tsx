import React from "react";
import {useObserver} from "mobx-react-lite";
import {storeContext} from "../Context";
import {Modal, Button} from "react-bootstrap";

/** @jsx jsx */
import {jsx, css} from "@emotion/core";

export const jsxBabelFix = jsx;

const ConfirmModal: React.FC = prop => {
    const grobalStore = React.useContext(storeContext);
    const store = grobalStore!.confirmProp;

    return useObserver(
        () =>
            grobalStore && (
                <div>
                    <Modal show={store.show}>
                        <Modal.Header>
                            <Modal.Title>{store.Title}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>{store.Body}</Modal.Body>
                        <Modal.Footer>
                            <Button
                                variant="primary"
                                onClick={() => {
                                    store.show = false;
                                    store.status = true;
                                    store.onClose && store.onClose(true);
                                }}
                            >
                                {store.OK_ButtonLabel}
                            </Button>

                            <Button
                                variant="secondary"
                                onClick={() => {
                                    store.show = false;
                                    store.status = false;
                                    store.onClose && store.onClose(false);
                                }}
                            >
                                {store.NG_ButtonLabel}
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            )
    );
};

export default ConfirmModal;
