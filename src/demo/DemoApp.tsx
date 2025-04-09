import {useRef, useState} from 'react';
import {TEST_DATA} from "./test-data";
import {MockStandardNotes} from "./mock-notes";

const mock = new MockStandardNotes(TEST_DATA[0], (item: any) => {
  document.getElementById('last-saved').textContent = `Last Saved: ${new Date().toLocaleTimeString()}`;
  document.getElementById('text-preview').textContent = 'Preview: ' + item.content.preview_plain;
});

const DemoApp = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [selected, setSelected] = useState(0);
  const [disabled, setDisabled] = useState(false);
  const [theme, setTheme] = useState('light');

  const changeMenuItem = (i) => {
    if (selected == i) return;
    setSelected(i);
    mock.changeData(TEST_DATA[i]);
    document.getElementById('last-saved').textContent = '';
    document.getElementById('text-preview').textContent = '';
  };

  const renderMenuItem = (_, i) => {
    return <div className={selected === i ? 'menu-item selected' : 'menu-item'}
                onClick={() => changeMenuItem(i)}>{TEST_DATA[i].title}</div>;
  };

  const onToggleDisabled = (e) => {
    setDisabled(e.target.checked);
    mock.toggleLock(e.target.checked);
  };

  const onChangeTheme = (e) => {
    setTheme(e.target.checked ? 'dark' : 'light');
    mock.toggleTheme(e.target.checked);
  };

  const onFrameLoad = () => {
    mock.onReady(iframeRef.current.contentWindow);
  };
  return (
    <div className="demo">
      <div className="menu">
        {
          TEST_DATA.map(renderMenuItem)
        }
      </div>
      <div className="content">
        <div className="content-header">
          <div><input id="editingDisabled" type="checkbox" checked={disabled} onChange={onToggleDisabled}></input><label
            htmlFor="editingDisabled"> Editing Disabled</label></div>
          <div><input id="isDark" type="checkbox" checked={theme === 'dark'} onChange={onChangeTheme}></input><label
            htmlFor="isDark"> Dark Theme</label></div>
          <div id="last-saved"></div>
          <div id="text-preview"></div>
        </div>
        <iframe ref={iframeRef} src="index.html" onLoad={onFrameLoad}/>
      </div>
    </div>
  );
};

export default DemoApp;
