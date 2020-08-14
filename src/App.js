import React, { useState, useRef, useEffect, memo } from "react";
import "./styles.css";
import { numbers1, numbers2 } from "./numbers";

const PanelType = {
  PANEL_1: "PANEL_1",
  PANEL_2: "PANEL_2"
};

const Row = ({ num, index, setClickedIndex, rowHeight, clickHandler }) => {
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
                clickHandler(index, rowRef.current.offsetHeight);
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
  windowMetrics,
  numberOfVisibleRows,
  setRowsCache,
  visibleRows
}) => {
  const windowRef = useRef();

  const {
    topRowHeight,
    numRowsOutOfViewOnTop,
    bottomRowHeight,
    numRowsOutOfViewOnBottom
  } = windowMetrics;

  // const extraAbove = 0; // This will cause extra rows to be rendered above the window
  // const extraBelow = 1; // This will cause extra rows to be rendered below the bottom of the window, cannot be less than 1.
  // const visibleRows = rows.slice(
  //   numRowsOutOfViewOnTop - extraAbove < 0
  //     ? 0
  //     : numRowsOutOfViewOnTop - extraAbove,
  //   numRowsOutOfViewOnTop + numberOfVisibleRows + extraBelow
  // );
  // console.log("rowsLength: ", rows.length);
  // console.log("visibleRowsLength: ", visibleRows.length);
  console.log(
    "visibleRows: ",
    // visibleRows.map(({ value }) => value)
    visibleRows.map((row) => row)
  );
  return (
    <div className="window" ref={windowRef}>
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

  // const rowsCache = numbers.map((number, index) => ({
  //   value: number,
  //   height: ROW_HEIGHT,
  //   originalIndex: index
  // }));

  const [rowsCache, setRowsCache] = useState([]);

  const listRef = useRef();

  const [windowMetrics, setWindowMetrics] = useState({
    topRowHeight: 0,
    numRowsOutOfViewOnTop: 0,
    bottomRowHeight: 0,
    numRowsOutOfViewOnBottom: 0
  });

  const [visibleRows, setVisibleRows] = useState([]);
  const [numberOfVisibleRows, setNumberOfVisibleRows] = useState(0);

  const clickHandler = (index, newHeight) => {
    console.log(rowsCache[index]);
    const newRowsCache = rowsCache.map((row) => ({ ...row }));
    newRowsCache[index].height = newHeight;
    setRowsCache(newRowsCache);
  };

  const rowRenderer = (row) => {
    return (
      <Row
        key={row.originalIndex + " " + row.value}
        {...{
          num: row.value,
          index: row.originalIndex,
          setClickedIndex,
          rowHeight: ROW_HEIGHT,
          clickHandler
        }}
      />
    );
  };

  useEffect(() => {
    console.log("IN USE EFFECT");
    setNumberOfVisibleRows(
      Math.floor(listRef.current.offsetHeight / ROW_HEIGHT)
    );
  }, [numbers.length]);

  useEffect(() => {
    const _rowsCache = numbers.map((number, index) => ({
      value: number,
      height: ROW_HEIGHT,
      originalIndex: index
    }));

    setRowsCache(_rowsCache);

    const extraAbove = 0; // This will cause extra rows to be rendered above the window
    const extraBelow = 1; // This will cause extra rows to be rendered below the bottom of the window, cannot be less than 1.
    const _visibleRows = _rowsCache.slice(
      windowMetrics.numRowsOutOfViewOnTop - extraAbove < 0
        ? 0
        : windowMetrics.numRowsOutOfViewOnTop - extraAbove,
      windowMetrics.numRowsOutOfViewOnTop + numberOfVisibleRows + extraBelow
    );
    console.log("FIRST: ", _visibleRows);
    setVisibleRows(_visibleRows);
  }, [windowMetrics, numberOfVisibleRows]);

  return (
    <div>
      <div className="panel-heading">Clicked Index: {" " + clickedIndex}</div>
      <div
        onScroll={() => {
          const _numRowsOutOfViewOnTop =
            Math.floor(listRef.current.scrollTop / ROW_HEIGHT) + 0; // WAS 0

          const _numRowsOutOfViewOnBottom =
            numbers.length - (_numRowsOutOfViewOnTop + numberOfVisibleRows);

          const extraAbove = 0; // This will cause extra rows to be rendered above the window
          const extraBelow = 1; // This will cause extra rows to be rendered below the bottom of the window, cannot be less than 1.
          const _visibleRows = rowsCache.slice(
            _numRowsOutOfViewOnTop - extraAbove < 0
              ? 0
              : _numRowsOutOfViewOnTop - extraAbove,
            _numRowsOutOfViewOnTop + numberOfVisibleRows + extraBelow
          );
          console.log("FIRST: ", _visibleRows);
          setVisibleRows(_visibleRows);

          setWindowMetrics({
            topRowHeight: _numRowsOutOfViewOnTop * ROW_HEIGHT,
            numRowsOutOfViewOnTop: _numRowsOutOfViewOnTop,
            bottomRowHeight: _numRowsOutOfViewOnBottom * ROW_HEIGHT,
            numRowsOutOfViewOnBottom: _numRowsOutOfViewOnBottom
          });
        }}
        ref={listRef}
        className="list"
      >
        <Window
          {...{
            rows: rowsCache,
            rowRenderer,
            windowMetrics,
            numberOfVisibleRows,
            setRowsCache,
            visibleRows
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
