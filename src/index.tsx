import React from 'react';

import './index.scss';
import {createRoot} from "react-dom/client";
import ComponentRelay from "@standardnotes/component-relay";
import {getPreviewText} from "./utils";
import CustomEditor from "./components/CustomEditor";
import {MyEditorMeta} from "./definitions";

const SN_DOMAIN = 'org.standardnotes.sn';
const MY_DOMAIN = 'dev.randombits.my-editor';

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
  root.render(
    <React.StrictMode>
      <CustomEditor/>
    </React.StrictMode>
  );
};

const save = () => {
  componentRelay.saveItemWithPresave(currentNote, () => {
    currentNote.content.preview_plain = getPreviewText(currentNote.content.text);
  });
};

export const text = (): string => {
  return currentNote.content.text || '';
}

export const meta = (): MyEditorMeta => {
  return currentNote.content.appData[MY_DOMAIN] || {};
};

export const isLocked = () => {
  return currentNote.content.appData[SN_DOMAIN]['locked'];
};

export const updateText = (newText: string) => {
  currentNote.content.text = newText;
  save();
};

export const updateMeta = (newMeta: Partial<MyEditorMeta>) => {
  currentNote.content.appData[MY_DOMAIN] = {
    ...currentNote.content.appData[MY_DOMAIN],
    ...newMeta
  };
  save();
};





