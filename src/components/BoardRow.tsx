import BoardElement from "./BoardElement";

type BoardRowProps = {
  row: string[];
  rowNumber: number;
};

const BoardRow = ({ row, rowNumber }: BoardRowProps) => {
  return (
    <div
      className={
        rowNumber === 8
          ? "flex border-t-2 border-b-2 border-black"
          : "flex border-t-2 border-black"
      }
    >
      {row.map((val, colNumber) => {
        return (
          <BoardElement
            value={val}
            columnNumber={colNumber}
            rowNumber={rowNumber}
          />
        );
      })}
    </div>
  );
};

export default BoardRow;
