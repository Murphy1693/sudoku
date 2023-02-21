import { useEffect, useState } from "react";
import { DispatchObject, valuesSubscription } from "./App";

type BoardElementProps = {
  value: string;
  rowNumber: number;
  columnNumber: number;
  speed: number;
};

const colors: { [key: number | string]: string } = {
  0: "transparent", // transparent
  1: "rgb(226 232 240)", // "rgb(209 213 219)", // gray
  2: "rgb(254 240 138)", // yellow
  3: "rgb(248 113 113)", // red
  4: "rgb(134 239 172)", // green
};

const BoardElement = ({
  value,
  rowNumber,
  columnNumber,
  speed,
}: BoardElementProps) => {
  const [displayValue, setDisplayValue] = useState("");
  const [definite, setDefinite] = useState<boolean | null>(null);
  const [colorScheme, setColorScheme] = useState(0);
  const [removedValueAnimation, setRemovedValueAnimation] = useState(false);

  useEffect(() => {
    let handleDispatch = ({
      board_index,
      definite = false,
      value,
      color,
    }: DispatchObject) => {
      if (value && value !== "0") {
        setDisplayValue(value === "." ? "" : value);
      }
      if (board_index === -1) {
        setColorScheme(4);
      } else if (color !== undefined) {
        setColorScheme(color);
      } else {
        if (value === ".") {
          setColorScheme(3);
        } else if (definite === true) {
          setColorScheme(4);
        } else {
          setColorScheme(2);
        }
      }
    };
    let index = rowNumber * 9 + columnNumber;
    valuesSubscription.subscribe(index, handleDispatch);
  }, []);

  useEffect(() => {
    setDisplayValue(value === "." ? "" : value);
  }, [value]);

  return (
    <div
      className={
        columnNumber === 8
          ? "border-l-2 border-r-4 border-black"
          : columnNumber % 3 === 0
          ? "border-l-4 border-black"
          : "border-l-2 border-black"
      }
    >
      <div
        style={{
          backgroundColor: colors[colorScheme],
        }}
      >
        <div className="p-3 md:p-6">
          <span className="absolute -translate-x-1/2 -translate-y-1/2 md:text-2xl">
            {displayValue}
          </span>
        </div>
      </div>
    </div>
  );
};

export default BoardElement;
