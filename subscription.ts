// let listeners: { [key: number]: (value: string | number) => void } = {};

// export const valuesSubscription = {
//   subscribe: (elementIndex: number, callback: () => void) => {
//     listeners[elementIndex] = callback;
//   },

//   dispatch: ({
//     indexPair,
//     definite,
//     value,
//   }: {
//     indexPair: string;
//     definite?: boolean;
//     value: number | string;
//   }) => {
//     let targetIndex = parseInt(indexPair[0]) * 9 + parseInt(indexPair[2]);
//     for (const index in listeners) {
//       if (index === targetIndex.toString()) {
//         listeners[index](value);
//       }
//     }
//   },
// };
