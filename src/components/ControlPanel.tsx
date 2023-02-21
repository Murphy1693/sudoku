import { MutableRefObject, SetStateAction } from "react";
import { Adjustment, ElementSubscription, IntervalTimer } from "./App";
import axios from "axios";

export type ControlPanelProps = {
  boardStateIndex: MutableRefObject<number>;
  intervalTimer: IntervalTimer;
  valuesSubscription: ElementSubscription;
  board: string[][];
  finished: boolean;
  solving: boolean;
  speed: number;
  boardState: Adjustment[];
  setFinished: React.Dispatch<SetStateAction<boolean>>;
  setSolving: React.Dispatch<SetStateAction<boolean>>;
  setBoard: React.Dispatch<SetStateAction<string[][]>>;
  setBoardState: React.Dispatch<SetStateAction<Adjustment[]>>;
  setSpeed: React.Dispatch<SetStateAction<number>>;
};

const ControlPanel = ({
  boardStateIndex,
  valuesSubscription,
  board,
  speed,
  boardState,
  solving,
  intervalTimer,
  setSpeed,
  setFinished,
  setSolving,
  setBoard,
  setBoardState,
  finished,
}: ControlPanelProps) => {
  return (
    <div className="flex max-w-[244px] flex-row flex-wrap justify-between font-bold md:max-w-[460px]">
      <button
        className="basis-1/2 bg-orange-300 py-2"
        onClick={() => {
          axios.get("/board").then((response) => {
            clearInterval(intervalTimer);
            setFinished(false);
            setSolving(false);
            setSpeed(128);
            setBoard(response.data.original_board);
            setBoardState(response.data.adjustments);
          });
        }}
      >
        New Game
      </button>
      <button
        className={
          boardStateIndex.current === boardState.length && finished
            ? "basis-1/2 bg-purple-300 py-2"
            : solving
            ? "basis-1/2 bg-red-300 py-2"
            : "basis-1/2 bg-green-300 py-2"
        }
        onClick={() => {
          if (boardStateIndex.current === boardState.length && finished) {
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
              setFinished(false);
              setSolving(false);
              boardStateIndex.current = 0;
            });
          } else if (solving) {
            clearTimeout(intervalTimer);
            setSolving(false);
          } else if (!solving) {
            setSolving(true);
          }
        }}
      >
        {boardStateIndex.current === boardState.length && finished
          ? "Reset"
          : solving
          ? "Stop!"
          : "Start"}
      </button>
      <button
        className={
          speed < 25
            ? "basis-1/2 bg-slate-100 py-2 opacity-40"
            : "basis-1/2 bg-slate-100 py-2"
        }
        onClick={() => {
          if (speed > 25) {
            setSpeed(speed / 2);
          }
        }}
      >
        Speed++
      </button>
      <button
        className={
          speed >= 2048
            ? "basis-1/2 bg-slate-100 py-2 opacity-40"
            : "basis-1/2 bg-slate-100 py-2"
        }
        onClick={() => {
          if (speed < 2048) {
            setSpeed(speed * 2);
          }
        }}
      >
        Speed--
      </button>
    </div>
  );
};

export default ControlPanel;
