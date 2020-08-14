import React, { useState, useRef, useEffect } from "react";
import "./styles.css";
import { numbers1, numbers2 } from "./numbers";

const PanelType = {
  PANEL_1: "PANEL_1",
  PANEL_2: "PANEL_2"
};

const Row = ({ num, index, setClickedIndex, rowHeight }) => {
  const [showSubmenu, setShowSubmenu] = useState(false);
  const rowRef = useRef();

  return (
    <div className="row" ref={rowRef}>
      <div className="row-inner" style={{ height: `${rowHeight}px` }}>
        <input type="checkbox" />
        <div className="row-inner-wrap">
          <span onClick={() => setClickedIndex(index)} className="row-number">
            {index}
            {" - "}
            {num}
          </span>
          <span
            className="row-expand"
            onClick={() => {
              setShowSubmenu(!showSubmenu);
              setTimeout(() => {
                console.log("row new height: ", rowRef.current.offsetHeight);
              });
            }}
          >
            C
          </span>
        </div>
      </div>
      {showSubmenu && (
        <div
          style={{ height: (num * 1000) / 2 + "px", backgroundColor: "orange" }}
        />
      )}
    </div>
  );
};

const Window = ({
  rows,
  rowRenderer,
  topRowHeight,
  numRowsOutOfViewOnTop,
  bottomRowHeight,
  numRowsOutOfViewOnBottom,
  numberOfVisibleRows
}) => {
  const extraAbove = 0; // This will cause extra rows to be rendered above the window
  const extraBelow = 1; // This will cause extra rows to be rendered below the bottom of the window, cannot be less than 1.
  const visibleRows = rows.slice(
    numRowsOutOfViewOnTop - extraAbove < 0
      ? 0
      : numRowsOutOfViewOnTop - extraAbove,
    numRowsOutOfViewOnTop + numberOfVisibleRows + extraBelow
  );
  console.log("rowsLength: ", rows.length);
  console.log("visibleRowsLength: ", visibleRows.length);
  console.log(
    "visibleRows: ",
    visibleRows.map(({ value }) => value)
  );
  return (
    <div className="window">
      <div style={{ height: `${topRowHeight}px`, backgroundColor: "green" }} />
      {visibleRows.map(rowRenderer)}
      <div
        style={{ height: `${bottomRowHeight}px`, backgroundColor: "green" }}
      />
    </div>
  );
};

const Panel = ({ clickedIndex, setClickedIndex, numbers }) => {
  const ROW_HEIGHT = 60;

  const rowsCache = numbers.map((number, index) => ({
    value: number,
    height: ROW_HEIGHT,
    originalIndex: index
  }));

  const listRef = useRef();
  const [topRowHeight, setTopRowHeight] = useState(0);
  const [numRowsOutOfViewOnTop, setNumRowsOutOfViewOnTop] = useState(0);

  const [bottomRowHeight, setBottomRowHeight] = useState(0);
  const [numRowsOutOfViewOnBottom, setNumRowsOutOfViewOnBottom] = useState(0);

  const [numberOfVisibleRows, setNumberOfVisibleRows] = useState(0);

  const rowRenderer = (row) => {
    return (
      <Row
        key={row.originalIndex + " " + row.value}
        {...{
          num: row.value,
          index: row.originalIndex,
          setClickedIndex,
          rowHeight: ROW_HEIGHT
        }}
      />
    );
  };

  useEffect(() => {
    console.log("topRowHeight: ", topRowHeight);
    console.log("num rows out of view: ", numRowsOutOfViewOnTop);
  }, [topRowHeight, numRowsOutOfViewOnTop]);

  useEffect(() => {
    setNumberOfVisibleRows(
      Math.floor(listRef.current.offsetHeight / ROW_HEIGHT)
    );
  }, [numbers.length]);

  return (
    <div>
      <div className="panel-heading">Clicked Index: {" " + clickedIndex}</div>
      <div
        onScroll={() => {
          const _numRowsOutOfViewOnTop =
            Math.floor(listRef.current.scrollTop / ROW_HEIGHT) + 0; // WAS 0
          setNumRowsOutOfViewOnTop(_numRowsOutOfViewOnTop);
          setTopRowHeight(_numRowsOutOfViewOnTop * ROW_HEIGHT);

          // Get total number of rows
          // and subtract those rows that exist above off screen
          // plus the number that are visible in the window,
          // and this will leave the total number that exist beneath.
          const _numRowsOutOfViewOnBottom =
            numbers.length -
            (_numRowsOutOfViewOnTop +
              Math.floor(listRef.current.offsetHeight / ROW_HEIGHT));
          setNumRowsOutOfViewOnBottom(_numRowsOutOfViewOnBottom);
          setBottomRowHeight(_numRowsOutOfViewOnBottom * ROW_HEIGHT);
        }}
        ref={listRef}
        className="list"
      >
        <Window
          {...{
            rows: rowsCache,
            rowRenderer,
            topRowHeight,
            numRowsOutOfViewOnTop,
            bottomRowHeight,
            numRowsOutOfViewOnBottom,
            numberOfVisibleRows
          }}
        />
      </div>
    </div>
  );
};

export default function App() {
  const [clickedIndex, setClickedIndex] = useState("Select a number!");
  const [clickedIndex2, setClickedIndex2] = useState("Select a number!");
  const [activePanel, setActivePanel] = useState(PanelType.PANEL_1);
  return (
    <div>
      <h2>Numbers</h2>
      <div className="panel-tab-wrap">
        {" "}
        <span
          className="panel-tab"
          style={{
            borderBottom:
              activePanel === PanelType.PANEL_1 ? "2px solid black" : "none"
          }}
          onClick={() => setActivePanel(PanelType.PANEL_1)}
        >
          Panel 1
        </span>
        <span
          className="panel-tab"
          style={{
            borderBottom:
              activePanel === PanelType.PANEL_2 ? "2px solid black" : "none"
          }}
          onClick={() => setActivePanel(PanelType.PANEL_2)}
        >
          Panel 2
        </span>
      </div>

      {activePanel === PanelType.PANEL_1 && (
        <Panel {...{ clickedIndex, setClickedIndex, numbers: numbers1 }} />
      )}
      {activePanel === PanelType.PANEL_2 && (
        <Panel
          {...{
            clickedIndex: clickedIndex2,
            setClickedIndex: setClickedIndex2,
            numbers: numbers2
          }}
        />
      )}
    </div>
  );
}
