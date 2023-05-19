import React, {useState} from 'react';
import {isLocked, meta, rerender, updateMeta} from "../index";

const RowControl = () => {
  const [rows, setRows] = useState(meta().rows || 3);

  const changeRows = (newRows: number) => {
    setRows(newRows);
    updateMeta({rows: newRows});
    rerender();
  };

  return (
    <div>
      <button disabled={isLocked()} onClick={() => changeRows(rows - 1)}>-</button>
      <span> {rows} Rows </span>
      <button disabled={isLocked()} onClick={() => changeRows(rows + 1)}>+</button>
      <span> (This is an example of saving metadata outside of the note content).</span>
    </div>
  );
}

export default RowControl
