import {useEffect} from 'react';
import {styled} from "goober";

import Quill from 'quill';
import './quill.css';
import {MarkdownShortcuts} from "./quill-markdown";
import snApi from "sn-extension-api";
import {getPreviewText} from "./utils";

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
  let quill;
  useEffect(() => {
    Quill.register('modules/markdown', MarkdownShortcuts);
    const BlockEmbed = Quill.import('blots/block/embed');

    class DividerBlot extends BlockEmbed {
    }

    DividerBlot.blotName = 'divider';
    DividerBlot.tagName = 'hr';
    Quill.register(DividerBlot);

    Quill.import('ui/icons').divider = '<svg viewBox="0 0 18 18"><line x1="3" y1="9" x2="15" y2="9" stroke-width="2" stroke="currentColor"></line></svg>';

    quill = new Quill(`#quill`, {
      readOnly: snApi.locked,
      modules: {
        toolbar: [
          [{'header': '1'}, {'header': '2'}, 'bold', 'italic', 'underline', 'strike', 'blockquote', 'code', 'link', 'image', 'divider', {'list': 'ordered'}, {'list': 'bullet'}, {'align': []}, {'color': []}, {'background': []}, 'clean'],
        ],
        markdown: {}
      },
      theme: 'snow'
    });
    const initialText = snApi.text;
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

    const toolbar = quill.getModule('toolbar');
    toolbar.addHandler('divider', () => {
      let range = quill.getSelection(true);
      quill.insertText(range.index, '\n', Quill.sources.USER);
      quill.insertEmbed(range.index + 1, 'divider', true, Quill.sources.USER);
      quill.setSelection(range.index + 2, Quill.sources.SILENT);
    });

    quill.on('text-change', () => {
      snApi.text = JSON.stringify(quill.getContents());
      snApi.preview = getPreviewText(quill.getText());
    });
  });

  return (
    <Container>
      <div id="quill"></div>
    </Container>
  );
};

export default QuillEditor;
