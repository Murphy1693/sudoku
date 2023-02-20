import BoardElement from "./BoardElement";
import BoardRow from "./BoardRow";

type BoardProps = {
  board: string[][];
};

const Board = ({ board }: BoardProps) => {
  return (
    <div className="ml-4 flex">
      <div className="flex flex-col">
        {board.map((row, i) => {
          return <BoardRow row={row} rowNumber={i} />;
        })}
      </div>
    </div>
  );
};

export default Board;
