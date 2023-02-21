const express = require("express");
const path = require("path");
const app = express();
const { Solver } = require("../sudokuSolver.js");
const { boards } = require("./boards.js");

app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

app.get("/board", (req, res) => {
  let board = boards[Math.floor(Math.random() * boards.length)];
  let x = new Solver(board);
  res.send(x);
});

app.listen(3001);
