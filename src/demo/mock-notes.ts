import {REGISTERED_EVENT, STREAM_EVENT_DATA} from './mock-events';
import {TestData} from './test-data';

export class MockStandardNotes {
  private childWindow;
  private streamEvent;
  private streamData;
  private locked = false;

  constructor(data: TestData, private onSave: (item: any) => void) {
    this.updateStream(data);
    window.addEventListener('message', this.handleMessage.bind(this));
  }

  public onReady(childWindow) {
    this.childWindow = childWindow;
    childWindow.postMessage(REGISTERED_EVENT);
  }

  public toggleLock(isLocked: boolean) {
    this.locked = isLocked;
    this.streamData.item.content.appData['org.standardnotes.sn']['locked'] = this.locked;
    this.childWindow.postMessage({
      action: 'reply',
      data: this.streamData,
      original: this.streamEvent
    }, '*');
  }

  public toggleTheme(isDark: boolean) {
    const themes = isDark ? ['dark.css'] : [];
    this.childWindow.postMessage({
      action: 'themes',
      data: {
        themes
      }
    }, '*');
  }

  public changeData(data: TestData) {
    this.updateStream(data);
    this.childWindow.postMessage({
      action: 'reply',
      data: this.streamData,
      original: this.streamEvent
    }, '*');
  }

  private handleMessage(e: MessageEvent) {
    const data = e.data;
    if (data.action === 'stream-context-item') {
      this.streamEvent = data;
      this.childWindow.postMessage({
        action: 'reply',
        data: this.streamData,
        original: data
      }, '*');
    } else if (data.action === 'save-items') {
      this.onSave(data.data.items[0]);
      this.childWindow.postMessage({
        action: 'reply',
        data: {},
        original: data
      }, '*');
    }
  }

  private updateStream(data: TestData) {
    this.streamData = JSON.parse(JSON.stringify(STREAM_EVENT_DATA));
    this.streamData.item.content.appData['org.standardnotes.sn']['locked'] = this.locked;
    this.streamData.item.content.text = data.text;
  }
}
