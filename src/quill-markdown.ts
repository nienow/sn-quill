export class MarkdownShortcuts {
  private ignoreTags = ['PRE'];
  private matches = [{
    name: 'header',
    pattern: /^(#){1,6}\s/g,
    action: (text, selection, pattern) => {
      let match = pattern.exec(text);
      if (!match) {
        return;
      }
      const size = match[0].length;
      // Need to defer this action https://github.com/quilljs/quill/issues/1134
      setTimeout(() => {
        this.quill.formatLine(selection.index, 0, 'header', size - 1);
        this.quill.deleteText(selection.index - size, size);
      }, 0);
    }
  },
    {
      name: 'blockquote',
      pattern: /^(>)\s/g,
      action: (text, selection) => {
        // Need to defer this action https://github.com/quilljs/quill/issues/1134
        setTimeout(() => {
          this.quill.formatLine(selection.index, 1, 'blockquote', true);
          this.quill.deleteText(selection.index - 2, 2);
        }, 0);
      }
    },
    {
      name: 'bolditalic',
      pattern: /(?:\*|_){3}(.+?)(?:\*|_){3}/g,
      action: (text, selection, pattern, lineStart) => {
        let match = pattern.exec(text);

        const annotatedText = match[0];
        const matchedText = match[1];
        const startIndex = lineStart + match.index;

        if (text.match(/^([*_ \n]+)$/g)) {
          return;
        }

        setTimeout(() => {
          this.quill.deleteText(startIndex, annotatedText.length);
          this.quill.insertText(startIndex, matchedText, {bold: true, italic: true});
          this.quill.format('bold', false);
        }, 0);
      }
    },
    {
      name: 'bold',
      pattern: /(?:\*|_){2}(.+?)(?:\*|_){2}/g,
      action: (text, selection, pattern, lineStart) => {
        let match = pattern.exec(text);

        const annotatedText = match[0];
        const matchedText = match[1];
        const startIndex = lineStart + match.index;

        if (text.match(/^([*_ \n]+)$/g)) {
          return;
        }

        setTimeout(() => {
          this.quill.deleteText(startIndex, annotatedText.length);
          this.quill.insertText(startIndex, matchedText, {bold: true});
          this.quill.format('bold', false);
        }, 0);
      }
    },
    {
      name: 'italic',
      pattern: /(?:\*|_){1}(.+?)(?:\*|_){1}/g,
      action: (text, selection, pattern, lineStart) => {
        let match = pattern.exec(text);

        const annotatedText = match[0];
        const matchedText = match[1];
        const startIndex = lineStart + match.index;

        if (text.match(/^([*_ \n]+)$/g)) {
          return;
        }

        setTimeout(() => {
          this.quill.deleteText(startIndex, annotatedText.length);
          this.quill.insertText(startIndex, matchedText, {italic: true});
          this.quill.format('italic', false);
        }, 0);
      }
    },
    {
      name: 'strikethrough',
      pattern: /(?:~~)(.+?)(?:~~)/g,
      action: (text, selection, pattern, lineStart) => {
        let match = pattern.exec(text);

        const annotatedText = match[0];
        const matchedText = match[1];
        const startIndex = lineStart + match.index;

        if (text.match(/^([*_ \n]+)$/g)) {
          return;
        }

        setTimeout(() => {
          this.quill.deleteText(startIndex, annotatedText.length);
          this.quill.insertText(startIndex, matchedText, {strike: true});
          this.quill.format('strike', false);
        }, 0);
      }
    },
    {
      name: 'code-block',
      pattern: /^`{3}(\S*)\s$/,
      action: (text, selection, pattern) => {
        const match = pattern.exec(text);
        if (!match) return;
        const language = match[1]?.trim() || true;
        // Need to defer this action https://github.com/quilljs/quill/issues/1134
        setTimeout(() => {
          this.quill.formatLine(selection.index, 1, 'code-block', language);
          this.quill.deleteText(selection.index - match[0].length, match[0].length);
        }, 0);
      }
    },
    {
      name: 'code',
      pattern: /(?:`)(.+?)(?:`)/g,
      action: (text, selection, pattern, lineStart) => {
        let match = pattern.exec(text);

        const annotatedText = match[0];
        const matchedText = match[1];
        const startIndex = lineStart + match.index;

        if (text.match(/^([*_ \n]+)$/g)) {
          return;
        }

        setTimeout(() => {
          this.quill.deleteText(startIndex, annotatedText.length);
          this.quill.insertText(startIndex, matchedText, {code: true});
          this.quill.format('code', false);
          this.quill.insertText(this.quill.getSelection(), ' ');
        }, 0);
      }
    }];

  constructor(private quill) {
    // Handler that looks for insert deltas that match specific characters
    this.quill.on('text-change', (delta) => {
      for (const op of delta.ops) {
        if (typeof op.insert !== 'string') continue;
        if (op.insert === ' ') {
          this.onSpace();
        } else if (op.insert.includes('```')) {
          setTimeout(() => this.onPasteCodeBlock(), 0);
        }
      }
    });
  }

  private onPasteCodeBlock() {
    const selection = this.quill.getSelection();
    if (!selection) return;

    const searchStart = Math.max(0, selection.index - 5000);
    const searchEnd = Math.min(this.quill.getLength(), selection.index + 100);
    const text = this.quill.getText(searchStart, searchEnd - searchStart);

    const match = /`{3}(\S*)\n([\s\S]*?)\n`{3}/.exec(text);
    if (!match) return;

    const language = match[1]?.trim() || true;
    const codeContent = match[2] ?? "";
    const startIndex = searchStart + match.index;

    this.quill.deleteText(startIndex, match[0].length);
    this.quill.insertText(startIndex, codeContent + "\n");

    // Format each line as code-block
    let curIndex = startIndex;
    for (const line of codeContent.split("\n")) {
      this.quill.formatLine(curIndex, 1, "code-block", language);
      curIndex += line.length + 1;
    }
  }

  private isValid(text, tagName) {
    return text && !this.ignoreTags.includes(tagName);
  }

  private onSpace() {
    const selection = this.quill.getSelection();
    if (!selection) {
      return;
    }
    const [line, offset] = this.quill.getLine(selection.index);
    const text = line.domNode.textContent;
    const lineStart = selection.index - offset;
    if (this.isValid(text, line.domNode.tagName)) {
      for (let match of this.matches) {
        const matchedText = text.match(match.pattern);
        if (matchedText) {
          // We need to replace only matched text not the whole line
          match.action(text, selection, match.pattern, lineStart);
          return;
        }
      }
    }
  }
}
