import BoardElement from "./BoardElement";

type BoardRowProps = {
  row: string[];
  rowNumber: number;
  speed: number;
};

const BoardRow = ({ row, rowNumber, speed }: BoardRowProps) => {
  console.log(row);
  return (
    <div
      className={
        rowNumber === 8
          ? "flex max-w-fit border-t-2 border-b-4 border-black bg-slate-50"
          : rowNumber % 3 === 0
          ? "flex max-w-fit border-t-4 border-black bg-slate-50"
          : // : rowNumber === 8
            // ? "flex border-t-2 border-b-2 border-black"
            "flex max-w-fit border-t-2 border-black bg-slate-50"
      }
    >
      {row.map((val, colNumber) => {
        return (
          <BoardElement
            speed={speed}
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
