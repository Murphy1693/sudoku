import BoardElement from "./BoardElement";
import BoardRow from "./BoardRow";
import ControlPanel, { ControlPanelProps } from "./ControlPanel";

const Board = ({
  board,
  boardStateIndex,
  valuesSubscription,
  boardState,
  setSolving,
  setFinished,
  finished,
  setSpeed,
  speed,
  setBoard,
  intervalTimer,
  solving,
  setBoardState,
}: ControlPanelProps) => {
  return (
    <div className="ml-4 flex">
      <div className="flex flex-col">
        {board.map((row, i) => {
          return <BoardRow key={i} speed={speed} row={row} rowNumber={i} />;
        })}
        <ControlPanel
          boardStateIndex={boardStateIndex}
          valuesSubscription={valuesSubscription}
          board={board}
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
        ></ControlPanel>
      </div>
    </div>
  );
};

export default Board;
