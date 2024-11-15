import { useEffect } from 'react';
import { styled } from "goober";

import Quill from 'quill';
import './quill.css';
import { MarkdownShortcuts } from "./quill-markdown";
import snApi from "sn-extension-api";
import { getPreviewText } from "./utils";

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
    const Font = Quill.import('attributors/class/font');
    Font.whitelist = ['serif', 'sans-serif', 'monospace', 'arial', 'comic-sans'];
    Quill.register(Font, true);
    Quill.register('modules/markdown', MarkdownShortcuts);
    const BlockEmbed = Quill.import('blots/block/embed');

    class DividerBlot extends BlockEmbed {
    }

    DividerBlot.blotName = 'divider';
    DividerBlot.tagName = 'hr';
    Quill.register(DividerBlot);

    Quill.import('ui/icons').divider = '<svg viewBox="0 0 18 18" class="ql-fill"><rect height="2" width="14" x="2" y="8"></rect></svg>';

    quill = new Quill(`#quill`, {
      readOnly: snApi.locked,
      modules: {
        toolbar: [
          [{ 'font': Font.whitelist }, { 'header': '1' }, { 'header': '2' }, 'bold', 'italic', 'underline', 'strike', 'blockquote', 'code', 'link', 'image', 'divider', { 'list': 'ordered' }, { 'list': 'bullet' }, { 'align': [] }, { 'color': [] }, { 'background': [] }, 'clean'],
        ],
        markdown: {}
      },
      theme: 'snow',
      syntax: true
    });
    quill.format('font', 'serif');
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
    const fontPicker = document.querySelector('.ql-picker.ql-font');
    quill.on('text-change', () => {
      if (!quill.getFormat().font) { quill.format('font', fontPicker.querySelector('.ql-picker-label').getAttribute('data-value')); }
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
