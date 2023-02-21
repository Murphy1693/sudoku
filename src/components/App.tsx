import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
// import { board1, boardState } from "./../utils/boards";
import Board from "./Board";
import ControlPanel from "./ControlPanel";
import axios from "axios";
// import { valuesSubscription } from "../../subscription";
// let listeners: { [key: number]: React.Dispatch<any>[] } = {};
let listeners: { [key: number]: (dispatchObject: DispatchObject) => void } = {};

export type DispatchObject = Adjustment & {
  color?: 0 | 1 | 2 | 3 | 4;
};

export type Adjustment = {
  board_index: number;
  definite?: boolean;
  value: string;
};

export type ElementSubscription = {
  subscribe: (
    board_index: number,
    handleDispatch: (dispatchObject: DispatchObject) => void
  ) => void;
  dispatch: (dispatchObject: DispatchObject) => void;
};

export const valuesSubscription: ElementSubscription = {
  subscribe: (board_index, handleDispatch) => {
    listeners[board_index] = handleDispatch;
  },

  dispatch: (dispatchObject) => {
    const { board_index, definite, value } = dispatchObject;
    if (board_index === -1) {
      for (const index in listeners) {
        listeners[index]({ board_index: -1, value: "0" });
      }
    } else {
      listeners[board_index](dispatchObject);
    }
  },
};

const initialBoard = [
  ["", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", ""],
];

export type IntervalTimer = string | number | NodeJS.Timer | undefined;
let intervalTimer: IntervalTimer;

const App = () => {
  const [board, setBoard] = useState(initialBoard);
  const [finished, setFinished] = useState(false);
  const [boardState, setBoardState] = useState<Adjustment[]>([]);
  let boardStateIndex = useRef<number>(0);
  const [speed, setSpeed] = useState(128);
  const [solving, setSolving] = useState(false);

  useEffect(() => {
    axios.get("./board").then((response) => {
      setBoard(response.data.original_board);
      setBoardState(response.data.adjustments);
    });
  }, []);

  useEffect(() => {
    boardStateIndex.current = 0;
    board.forEach((row, row_index) => {
      row.forEach((val, col_index) => {
        if (val === ".") {
          valuesSubscription.dispatch({
            board_index: row_index * 9 + col_index,
            definite: false,
            value: ".",
            color: 0,
          });
        } else {
          valuesSubscription.dispatch({
            board_index: row_index * 9 + col_index,
            value: "0",
            definite: true,
            color: 1,
          });
        }
      });
    });
  }, [board]);

  useEffect(() => {
    if (boardStateIndex.current < boardState.length && solving) {
      setSolving(true);
      intervalTimer = setInterval(() => {
        valuesSubscription.dispatch(boardState[boardStateIndex.current]);
        boardStateIndex.current++;
        if (boardStateIndex.current === boardState.length) {
          clearInterval(intervalTimer);
          valuesSubscription.dispatch({
            board_index: -1,
            definite: true,
            value: "0",
          });
          setFinished(true);
          setSolving(false);
        }
      }, speed);
    }
    return () => {
      clearInterval(intervalTimer);
    };
  }, [solving, speed]);

  return (
    <div className="min-h-screen">
      <div className="flex flex-col pt-6 md:flex-row">
        <Board
          board={board}
          boardStateIndex={boardStateIndex}
          valuesSubscription={valuesSubscription}
          // board={board}
          setSolving={setSolving}
          setFinished={setFinished}
          boardState={boardState}
          setBoardState={setBoardState}
          finished={finished}
          solving={solving}
          setSpeed={setSpeed}
          speed={speed}
          setBoard={setBoard}
          intervalTimer={intervalTimer}
        />
      </div>
    </div>
  );
};

export default App;
