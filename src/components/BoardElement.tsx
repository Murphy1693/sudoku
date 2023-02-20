import { useEffect, useState } from "react";
import { valuesSubscription } from "./App";

type BoardElementProps = {
  value: number | string | null;
  rowNumber: number;
  columnNumber: number;
};

type dispatchObject = {};

let handleDispatch = (dispatchObject) => {};

const BoardElement = ({
  value,
  rowNumber,
  columnNumber,
}: BoardElementProps) => {
  const [displayValue, setDisplayValue] = useState(value);
  const [definite, setDefinite] = useState<boolean | null>(null);
  const [mostRecent, setMostRecent] = useState(false);

  useEffect(() => {
    let index = rowNumber * 9 + columnNumber;
    valuesSubscription.subscribe(index, setDisplayValue, setDefinite);
  }, []);

  return (
    <div
      className={
        columnNumber === 8
          ? "border-l-2 border-r-2 border-black"
          : "border-l-2 border-black"
        // rowNumber === 8
        //   ? "box-content border-r-2 border-t-2 border-b-2 border-black p-4"
        //   : "box-content border-r-2 border-t-2 border-black p-4"
      }
    >
      <div
        // className={
        //   definite === true
        //     ? "bg-green-400"
        //     : definite === false
        //     ? displayValue === "."
        //       ? "bg-red-400"
        //       : "bg-yellow-300"
        //     : "bg-gray-200 text-black"
        // }
        className={
          definite === true
            ? "bg-green-400"
            : definite === false
            ? displayValue === "." && mostRecent
              ? "bg-red-400"
              : "bg-yellow-300"
            : "bg-gray-200 text-black"
        }
      >
        <div className="p-6">
          <span className="absolute -translate-x-1/2 -translate-y-1/2">
            {displayValue === "." ? "" : displayValue}
          </span>
        </div>
      </div>
    </div>
  );
};

// const BoardElement = ({
//   value,
//   rowNumber,
//   columnNumber,
// }: BoardElementProps) => {
//   const [displayValue, setDisplayValue] = useState(value);
//   const [definite, setDefinite] = useState<boolean | null>(null);
//   const [mostRecent, setMostRecent] = useState(false);

//   useEffect(() => {
//     let handleDispatch = (dispatchObject) => {
//       if (dispatchObject.index === rowNumber * 9 + columnNumber) {
//         setMostRecent(true);
//         setDisplayValue(dispatchObject.value);
//         setDefinite(dispatchObject.definite);
//       } else {
//         setMostRecent(false);
//       }
//     };
//     let index = rowNumber * 9 + columnNumber;
//     valuesSubscription.subscribe(index, handleDispatch);
//   }, []);

//   return (
//     <div
//       className={
//         columnNumber === 8
//           ? "border-l-2 border-r-2 border-black"
//           : "border-l-2 border-black"
//         // rowNumber === 8
//         //   ? "box-content border-r-2 border-t-2 border-b-2 border-black p-4"
//         //   : "box-content border-r-2 border-t-2 border-black p-4"
//       }
//     >
//       <div
//         className={
//           definite === true
//             ? "bg-green-400"
//             : definite === false
//             ? displayValue === "."
//               ? "bg-red-400"
//               : "bg-yellow-300"
//             : "bg-gray-200 text-black"
//         }
//       >
//         <div className={mostRecent ? "scale-[2] p-6" : "p-6"}>
//           <span className="absolute -translate-x-1/2 -translate-y-1/2">
//             {displayValue}
//           </span>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BoardElement;

export default BoardElement;
