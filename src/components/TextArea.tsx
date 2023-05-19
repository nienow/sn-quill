import React, {useState} from 'react';
import {isLocked, meta, text, updateText} from "../index";

const TextArea = () => {
  const [value, setValue] = useState(text());

  const onLocalChange = (e) => {
    setValue(e.target.value);
    updateText(e.target.value);
  };

  const rows = meta().rows;
  return (
    <textarea rows={rows || 3} disabled={isLocked()} value={value} onChange={onLocalChange}></textarea>
  );
}

export default TextArea
