import {useEffect} from 'react';
import {styled} from "goober";

import Quill from 'quill';
import './quill.css';
import {MarkdownShortcuts} from "./quill-markdown";
import snApi from "sn-extension-api";
import {getPreviewText} from "./utils";

// Register Quill modules/formats once at module load time
const Font = Quill.import('attributors/class/font') as { whitelist: (string | boolean)[] };
Font.whitelist = [false, 'serif', 'sans-serif', 'monospace', 'arial', 'comic-sans'];
Quill.register(Font as any, true);
Quill.register('modules/markdown', MarkdownShortcuts, true);

const BlockEmbed = Quill.import('blots/block/embed') as { new(): any };
class DividerBlot extends BlockEmbed {
  static blotName = 'divider';
  static tagName = 'hr';
}
Quill.register(DividerBlot as any, true);

const icons = Quill.import('ui/icons') as Record<string, string>;
icons.divider = '<svg viewBox="0 0 18 18" class="ql-fill"><rect height="2" width="14" x="2" y="8"></rect></svg>';

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
    quill = new Quill(`#quill`, {
      readOnly: snApi.locked,
      modules: {
        toolbar: [
          [{'font': Font.whitelist}, {'header': '1'}, {'header': '2'}, 'bold', 'italic', 'underline', 'strike', 'blockquote', 'code', 'link', 'image', 'divider', {'list': 'ordered'}, {'list': 'bullet'}, {'align': []}, {'color': []}, {'background': []}, 'clean'],
        ],
        keyboard: {
          bindings: {
            'keep-font': {
              key: 'Enter',
              handler: function (range, context) {
                setTimeout(() => {
                  // keep font style on new lines
                  this.quill.format('font', context.format.font, Quill.sources.USER);
                });
                return true;
              }
            }
          }
        },
        markdown: {},
      },
      theme: 'snow',
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
  }, []);

  return (
    <Container>
      <div id="quill"></div>
    </Container>
  );
};

export default QuillEditor;
