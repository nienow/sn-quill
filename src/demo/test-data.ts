import {MyEditorMeta} from '../definitions';

export interface TestData {
  title: string;
  text: string;
  meta?: MyEditorMeta;
}

export const EMPTY = {
  title: 'Empty',
  text: ''
};
export const PLAIN = {
  title: 'Plain Text',
  text: '',
  meta: {}
};

export const RICH = {
  title: 'Rich Text',
  text: JSON.stringify({
    'ops': [
      {
        'insert': 'This editor also supports Markdown shortcuts!\n\nHeader'
      },
      {
        'attributes': {
          'header': 1
        },
        'insert': '\n'
      },
      {
        'insert': '\nSubheader'
      },
      {
        'attributes': {
          'header': 2
        },
        'insert': '\n'
      },
      {
        'insert': '\n'
      },
      {
        'attributes': {
          'bold': true
        },
        'insert': 'Bold'
      },
      {
        'insert': '\n\n'
      },
      {
        'attributes': {
          'italic': true
        },
        'insert': 'Italics'
      },
      {
        'insert': '\n\n'
      },
      {
        'attributes': {
          'underline': true
        },
        'insert': 'Underline'
      },
      {
        'insert': '\n\n'
      },
      {
        'attributes': {
          'strike': true
        },
        'insert': 'Strikethrough'
      },
      {
        'insert': '\n\nQuote'
      },
      {
        'attributes': {
          'blockquote': true
        },
        'insert': '\n'
      },
      {
        'insert': '\n'
      },
      {
        'attributes': {
          'code': true
        },
        'insert': 'export const something = "blah";'
      },
      {
        'insert': '\n\n'
      },
      {
        'attributes': {
          'link': 'https://randombits.dev'
        },
        'insert': 'https://randombits.dev'
      },
      {
        'insert': '\n\nOne'
      },
      {
        'attributes': {
          'list': 'ordered'
        },
        'insert': '\n'
      },
      {
        'insert': 'Two'
      },
      {
        'attributes': {
          'list': 'ordered'
        },
        'insert': '\n'
      },
      {
        'insert': '\nOne'
      },
      {
        'attributes': {
          'list': 'bullet'
        },
        'insert': '\n\n'
      },
      {
        'insert': '\n'
      },
      {
        'attributes': {
          'color': '#e60000'
        },
        'insert': 'Red Text'
      },
      {
        'insert': '\n\n'
      },
      {
        'attributes': {
          'color': '#fff',
          'background': '#e60000'
        },
        'insert': 'Red Background'
      },
      {
        'insert': '\n'
      }
    ]
  }),
  meta: {}
};

export const TEST_DATA: TestData[] = [PLAIN, RICH, EMPTY];
