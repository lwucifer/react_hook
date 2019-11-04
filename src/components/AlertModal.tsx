import React from "react";
import { useObserver } from "mobx-react-lite";
import { storeContext } from "../Context";
import { Modal, Button } from "react-bootstrap";

/** @jsx jsx */
import { jsx, css } from "@emotion/core";
export const jsxBabelFix = jsx;

const AlertModal: React.FC = prop => {
  const grobalStore = React.useContext(storeContext);
  const store = grobalStore!.alertProp;

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
                  store.onClose && store.onClose();
                }}
              >
                {store.ButtonLabel}
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      )
  );
};

export default AlertModal;
