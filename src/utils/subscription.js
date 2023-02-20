let listeners = {};

export const valuesSubscription = {
  subscribe: (elementIndex, setValue, setDefinite) => {
    listeners[elementIndex] = [setValue, setDefinite];
  },

  dispatch: ({ indexPair, definite, value }) => {
    console.log("dispatching");
    let targetIndex = parseInt(indexPair[0]) * 9 + parseInt(indexPair[2]);
    for (const index in listeners) {
      listeners[index][1](false);
      if (index === targetIndex.toString()) {
        listeners[index][0](value);
        listeners[index][1](definite);
      }
    }
  },
};
