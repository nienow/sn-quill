import React from 'react';
import {setup} from "goober";

import './index.scss';
import {createRoot} from "react-dom/client";
import ComponentRelay from "@standardnotes/component-relay";
import {getPreviewText} from "./utils";
import QuillEditor from "./QuillEditor";

setup(React.createElement);

const SN_DOMAIN = 'org.standardnotes.sn';

let currentNote;

const componentRelay = new ComponentRelay({
  targetWindow: window,
  options: {
    coallesedSaving: true,
    coallesedSavingDelay: 400,
    debug: true
  }
});

const root = createRoot(document.getElementById('root'));

componentRelay.streamContextItem((note) => {
  currentNote = note;
  // Only update UI on non-metadata updates.
  if (!note.isMetadataUpdate) {
    rerender();
  }
});

export const rerender = () => {
  root.unmount();
  root.render(
    <React.StrictMode>
      <QuillEditor/>
    </React.StrictMode>
  );
};

const save = () => {
  componentRelay.saveItemWithPresave(currentNote, () => {
    currentNote.content.preview_plain = getPreviewText(currentNote.content.preview_plain);
  });
};

export const text = (): string => {
  return currentNote.content.text || '';
}

export const isLocked = () => {
  return currentNote.content.appData[SN_DOMAIN]['locked'];
};

export const updateText = (newText: string, preview: string) => {
  currentNote.content.text = newText;
  currentNote.content.preview_plain = preview;
  save();
};




