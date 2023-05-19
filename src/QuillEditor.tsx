import React, {useEffect} from 'react';
import {styled} from "goober";

import Quill from 'quill';
import './quill.css';
import {MarkdownShortcuts} from "./quill-markdown";
import {isLocked, text, updateText} from "./index";

const Container = styled('div')`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
`;

const QuillEditor = () => {
  useEffect(() => {
    Quill.register('modules/markdown', MarkdownShortcuts);
    const quill = new Quill(`#quill`, {
      readOnly: isLocked(),
      modules: {
        toolbar: [
          [{'header': '1'}, {'header': '2'}, 'bold', 'italic', 'underline', 'strike', 'blockquote', 'code', 'link', {'list': 'ordered'}, {'list': 'bullet'}, {'align': []}, {'color': []}, {'background': []}, 'clean'],
        ],
        markdown: {}
      },
      theme: 'snow'
    });
    const initialText = text();
    if (initialText) {
      try {
        const data = JSON.parse(initialText);
        if (data.ops) {
          quill.setContents(data);
        } else {
          quill.setText(initialText);
        }
      } catch {
        quill.setText(initialText);
      }
    }
    quill.on('text-change', () => {
      updateText(JSON.stringify(quill.getContents()));
    });
  });

  return (
    <Container>
      <div id="quill"></div>
    </Container>
  );
};

export default QuillEditor;
