import React from "react";
import { useObserver, useLocalStore } from "mobx-react-lite";

type TestPageProp = {};

const TestPage: React.FC<TestPageProp> = prop => {
  //Storeの作成
  const store = useLocalStore(() => ({
    stateValue: "",
    stateValueChange() {
      this.stateValue = "aaa";
    }
  }));
  //Store変更を反映させたい場合はuseObserverを利用する
  return useObserver(() => (
    <div>
      <div>{store.stateValue}</div>
      <button onClick={store.stateValueChange}> Click </button>
    </div>
  ));
};

export default TestPage;
