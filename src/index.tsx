import React from 'react';
import {setup} from "goober";

import './index.scss';
import {createRoot} from "react-dom/client";
import QuillEditor from "./QuillEditor";
import snApi from "sn-extension-api";

setup(React.createElement);


snApi.initialize({
  debounceSave: 300
});

const root = createRoot(document.getElementById('root'));

snApi.subscribe(() => {
  rerender();
});

export const rerender = () => {
  root.unmount();
  root.render(
    <React.StrictMode>
      <QuillEditor/>
    </React.StrictMode>
  );
};

