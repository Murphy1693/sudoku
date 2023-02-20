import { useEffect, useRef, useState } from "react";
import { board1, boardState } from "./../utils/boards";
import Board from "./Board";
// import { valuesSubscription } from "../../subscription";
let listeners: { [key: number]: React.Dispatch<any>[] } = {};

export type DispatchObject = {
  indexPair: string;
  definite?: boolean;
  value: string | null;
};

export const valuesSubscription = {
  subscribe: (
    elementIndex: number,
    setValue: React.Dispatch<string | number | null>,
    setDefinite: React.Dispatch<boolean>
  ) => {
    listeners[elementIndex] = [setValue, setDefinite];
  },

  dispatch: ({ indexPair, definite, value }: DispatchObject) => {
    if (indexPair === "-1") {
      for (const index in listeners) {
        listeners[index][1](true);
      }
      return;
    }

    // else {
    //   let targetIndex = parseInt(indexPair[0]) * 9 + parseInt(indexPair[2]);
    //   definite = definite ?? false;
    //   listeners[targetIndex][0](value);
    //   listeners[targetIndex][1](definite);

    //   // for (const index in listeners) {
    //   //   // listeners[index][1](false);
    //   //   if (index === targetIndex.toString()) {
    //   //     listeners[index][0](value);
    //   //     listeners[index][1](definite);
    //   //   }
    //   // }
    // }
  },
};

const App = () => {
  const [board, setBoard] = useState(board1);
  const [finished, setFinished] = useState(false);
  // const [boardStateIndex, setBoardStateIndex] = useState(0);
  let boardStateIndex = useRef<number>(0);
  const [speed, setSpeed] = useState(100);

  useEffect(() => {
    let x: string | number | NodeJS.Timer | undefined;
    if (boardStateIndex.current < boardState.length) {
      x = setInterval(() => {
        valuesSubscription.dispatch(boardState[boardStateIndex.current]);
        boardStateIndex.current++;
        if (boardStateIndex.current === boardState.length) {
          clearInterval(x);
          valuesSubscription.dispatch({
            indexPair: "-1",
            definite: true,
            value: null,
          });
        }
      }, speed);
    }
    return () => {
      clearInterval(x);
    };
  }, [speed]);

  return (
    <div className="min-h-screen bg-blue-50">
      <div className="flex flex-col">
        <button
          onClick={() => {
            if (speed > 25) {
              setSpeed(speed / 2);
            }
          }}
        >
          SEND IT
        </button>
        <button
          onClick={() => {
            if (speed <= 2048) {
              setSpeed(speed * 2);
            }
          }}
        >
          quit sending it
        </button>
      </div>
      <Board board={board} />
    </div>
  );
};

export default App;

// let listeners: {
//   [key: number]: (obj: {
//     indexPair: string;
//     definite: boolean;
//     value: number | string | null;
//   }) => void;
// } = {};

// export const valuesSubscription = {
//   subscribe: (
//     elementIndex: number,
//     handleDispatch: ({
//       indexPair,
//       definite,
//       value,
//     }: {
//       indexPair: string;
//       definite: boolean;
//       value: number | string | null;
//     }) => void
//     // setValue: React.Dispatch<string | number | null>,
//     // setDefinite: React.Dispatch<boolean>
//   ) => {
//     // listeners[elementIndex] = [setValue, setDefinite];
//     listeners[elementIndex] = handleDispatch;
//   },

//   dispatch: ({
//     indexPair,
//     definite,
//     value,
//   }: {
//     indexPair: string;
//     definite?: boolean;
//     value: number | string | null | ".";
//   }) => {
//     let targetIndex = parseInt(indexPair[0]) * 9 + parseInt(indexPair[2]);
//     listeners[targetIndex]({
//       indexPair: indexPair,
//       definite: definite,
//       value: value,
//     });
//     if (indexPair === "-1") {
//       // for (const index in listeners) {
//       //   listeners[index][1](true);
//       // }
//     } else {
//       // let targetIndex = parseInt(indexPair[0]) * 9 + parseInt(indexPair[2]);
//       // definite = definite ?? false;
//       // listeners[targetIndex][0](value);
//       // listeners[targetIndex][1](definite);
//       // for (const index in listeners) {
//       //   // listeners[index][1](false);
//       //   if (index === targetIndex.toString()) {
//       //     listeners[index][0](value);
//       //     listeners[index][1](definite);
//       //   }
//       // }
//     }
//   },
// };
