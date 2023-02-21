module.exports.Solver = class Solver {
  constructor(board) {
    this.original_board = board;
    this.solver_board = board.map((arr) => arr.slice());
    this.index_map = new Map();
    this.sorted_map = [];
    this.insertion_order = [];
    this.adjustments = [];
    this.solve();
  }

  solve() {
    this.original_board.forEach((row, row_index) => {
      row.forEach((val, col_index) => {
        let board_index = row_index * 9 + col_index;
        this.index_map.set(board_index, {
          possible_values: this.getPossibleValues(board_index),
          value: this.original_board[row_index][col_index],
          possible_values_index: 0,
        });
      });
    });
    this.sorted_map = this.sortMap();
    let single_possible_value = true;
    while (this.sorted_map.length && single_possible_value) {
      if (this.sorted_map[0][1].possible_values.length === 1) {
        let board_index = this.sorted_map[0][0];
        let value = this.sorted_map[0][1].possible_values[0];
        this.handleInsert(board_index, value, true);
        this.sorted_map = this.sortMap();
      } else {
        single_possible_value = false;
      }
    }
    let innerFunc = () => {
      if (this.boardIsValid()) {
        return;
      } else if (
        this.sorted_map.length &&
        this.sorted_map.length === this.getNumberOfUnassignedElements()
      ) {
        let [board_index, board_index_object] = this.sorted_map[0];
        let { possible_values, possible_values_index } = board_index_object;
        if (possible_values[possible_values_index] !== undefined) {
          let value = possible_values[possible_values_index];
          this.handleInsert(board_index, value);
          board_index_object.possible_values_index =
            board_index_object.possible_values_index + 1;
        } else {
          let last_inserted_board_index = this.insertion_order.pop();
          this.handleRemove(last_inserted_board_index);
          board_index_object.possible_values_index = 0;
        }
      } else {
        let last_inserted_board_index = this.insertion_order.pop();
        this.handleRemove(last_inserted_board_index);
      }
      this.sorted_map = this.sortMap();
      innerFunc();
    };
    innerFunc();
  }

  handleInsert(board_index, value, singlePossibleInsertion = false) {
    let row_index = Math.floor(board_index / 9);
    let col_index = Math.floor(board_index % 9);
    this.solver_board[row_index][col_index] = value;
    if (!this.indexIsValid(board_index)) {
      this.solver_board[row_index][col_index] = ".";
      return;
    }
    let board_index_object = this.index_map.get(board_index);
    board_index_object.value = value;
    this.insertion_order.push(board_index);
    this.adjustments.push({
      board_index: board_index,
      value: value,
      definite: singlePossibleInsertion,
    });
    this.getAffectedIndexPairs(board_index).forEach((board_idx) => {
      let possible_values = this.index_map.get(board_idx).possible_values;
      let possibleIndex = possible_values.indexOf(value);
      if (possibleIndex !== -1) {
        possible_values.splice(possible_values.indexOf(value.toString()), 1);
      }
    });
  }

  handleRemove(board_index) {
    let row_index = Math.floor(board_index / 9);
    let col_index = board_index % 9;
    let prev_value = this.solver_board[row_index][col_index];
    this.adjustments.push({ board_index: board_index, value: "." });
    this.solver_board[row_index][col_index] =
      this.original_board[row_index][col_index];
    let board_index_object = this.index_map.get(board_index);
    board_index_object.value = this.original_board[row_index][col_index];
    this.getAffectedIndexPairs(board_index).forEach((board_idx) => {
      let possible_values = this.index_map.get(board_idx).possible_values;
      if (this.getPossibleValues(board_idx).includes(prev_value)) {
        this.index_map.get(board_idx).possible_values = this.orderedInsert(
          possible_values,
          prev_value
        );
      }
    });
  }

  sortMap() {
    return [...this.index_map.entries()]
      .filter((a) => a[1].possible_values.length !== 0)
      .filter((a) => a[1].value === ".")
      .sort(
        (a, b) => a[1].possible_values.length - b[1].possible_values.length
      );
  }

  indexIsValid(board_index) {
    let shared_values = this.getRow(board_index).concat(
      this.getCol(board_index).concat(this.getSquare(board_index))
    );
    let occurrences = {};
    for (let i = 0; i < shared_values.length; i++) {
      if (shared_values[i] !== ".") {
        occurrences[shared_values[i]] = occurrences[shared_values[i]] + 1 || 1;
        if (occurrences[shared_values[i]] > 3) {
          return false;
        }
      }
    }
    return true;
  }

  orderedInsert(arr, value) {
    if (arr.includes(value)) {
      return arr;
    }
    let inserted = false;
    for (let i = 0; i < arr.length; i++) {
      if (value < parseInt(arr[i])) {
        let temp = arr[i];
        for (let j = arr.length; j > i; j--) {
          arr[j] = arr[j - 1];
        }
        inserted = true;
        arr[i] = value;
        break;
      }
    }
    if (inserted) {
      return arr;
    } else {
      arr.push(value);
      return arr;
    }
  }

  getRow(board_index, indices = false) {
    let row_index = Math.floor(board_index / 9);
    if (indices) {
      let arr = [];
      for (let i = 0; i < 9; i++) {
        arr.push(row_index * 9 + i);
      }
      return arr;
    }
    return this.solver_board[row_index];
  }

  getCol(board_index, indices = false) {
    let col_index = board_index % 9;
    let arr = [];
    this.solver_board.forEach((row, i) => {
      if (indices) {
        arr.push(i * 9 + col_index);
      } else {
        arr.push(row[col_index]);
      }
    });
    return arr;
  }

  getSquare(board_index, indices = false) {
    let row_index = Math.floor(board_index / 9);
    let col_index = board_index % 9;
    let grid_row = Math.floor(row_index / 3);
    let grid_col = Math.floor(col_index / 3);
    let square = [];
    for (let i = grid_row * 3; i < grid_row * 3 + 3; i++) {
      for (let j = grid_col * 3; j < grid_col * 3 + 3; j++) {
        if (indices) {
          square.push(i * 9 + j);
        } else {
          square.push(this.solver_board[i][j]);
        }
      }
    }
    return square;
  }

  getAffectedIndexPairs(board_index) {
    return this.getRow(board_index, true)
      .concat(this.getCol(board_index, true))
      .concat(this.getSquare(board_index, true));
  }

  getPossibleValues(board_index) {
    let impossible = this.getRow(board_index)
      .concat(this.getCol(board_index))
      .concat(this.getSquare(board_index))
      .filter((val) => {
        return val !== ".";
      });
    let possible = [];
    for (let i = 1; i < 10; i++) {
      if (!impossible.includes(i.toString())) {
        possible.push(i.toString());
      }
    }
    return possible;
  }

  arrIsValid(arr) {
    let occurrences = {};
    for (let i = 0; i < arr.length; i++) {
      if (occurrences[arr[i]] || arr[i] === ".") {
        return false;
      } else {
        occurrences[arr[i]] = 1;
      }
    }
    return true;
  }

  boardIsValid() {
    for (let i = 0; i < this.solver_board.length; i++) {
      if (!this.arrIsValid(this.solver_board[i])) {
        return false;
      }
    }
    return true;
  }

  getNumberOfUnassignedElements() {
    let count = 0;
    this.solver_board.forEach((row) => {
      row.forEach((element) => {
        if (element === ".") {
          count++;
        }
      });
    });
    return count;
  }
};

// let board1 = [
//   ["4", ".", ".", "7", ".", "1", ".", ".", "3"],
//   [".", ".", "5", ".", ".", ".", "2", ".", "."],
//   [".", "6", ".", ".", ".", "3", ".", "4", "."],
//   [".", "7", "8", "6", ".", ".", "9", ".", "."],
//   [".", ".", ".", ".", "5", ".", ".", ".", "."],
//   [".", ".", "4", ".", ".", "2", "1", "8", "."],
//   [".", "1", ".", "8", ".", ".", ".", "2", "."],
//   [".", ".", "2", ".", ".", ".", "3", ".", "."],
//   ["8", ".", ".", "2", ".", "5", ".", ".", "4"],
// ];

// let board2 = [
//   ["5", "3", ".", ".", "7", ".", ".", ".", "."],
//   ["6", ".", ".", "1", "9", "5", ".", ".", "."],
//   [".", "9", "8", ".", ".", ".", ".", "6", "."],
//   ["8", ".", ".", ".", "6", ".", ".", ".", "3"],
//   ["4", ".", ".", "8", ".", "3", ".", ".", "1"],
//   ["7", ".", ".", ".", "2", ".", ".", ".", "6"],
//   [".", "6", ".", ".", ".", ".", "2", "8", "."],
//   [".", ".", ".", "4", "1", "9", ".", ".", "5"],
//   [".", ".", ".", ".", "8", ".", ".", "7", "9"],
// ];

// let board3 = [
//   ["1", ".", ".", ".", ".", ".", ".", ".", "."],
//   [".", "2", ".", ".", ".", ".", ".", ".", "."],
//   [".", ".", "3", ".", ".", ".", ".", ".", "."],
//   [".", ".", ".", "4", ".", ".", ".", ".", "."],
//   [".", ".", ".", ".", "5", ".", ".", ".", "."],
//   [".", ".", ".", ".", ".", "6", ".", ".", "."],
//   [".", ".", ".", ".", ".", ".", "7", ".", "."],
//   [".", ".", ".", ".", ".", ".", ".", "8", "."],
//   [".", ".", ".", ".", ".", ".", ".", ".", "9"],
// ];
// let z = new Solver(board1);
