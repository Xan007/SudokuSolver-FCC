'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');
const CoordinateFormat = /([A-I])([1-9])/

const RowTranslator = ["A", "B", "C", "D", "E", "F", "G", "H", "I"]

module.exports = function (app) {

  const solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      let { puzzle, coordinate, value } = req.body

      if (!puzzle || !coordinate || !value)
        return res.send({ error: "Required field(s) missing" })

      try {
        solver.validate(puzzle)
      } catch (err) {
        return res.send({ error: err })
      }

      const matchCoordinate = coordinate.match(CoordinateFormat)

      if (!matchCoordinate) {
        return res.send({ error: "Invalid coordinate" })
      }

      const row = RowTranslator.indexOf(matchCoordinate[1])
      const column = Number(matchCoordinate[2])
      value = Number(value)

      try {
        solver.checkCoordinate(row, column, value)
      } catch (err) {
        return res.send({ error: err })
      }

      const puzzleArray = solver.getPuzzleArray(puzzle)
      const [result, problems] = solver.possible(puzzleArray, row, column, value)

      if (!result)
        return res.send({ valid: false, conflict: problems})

      return res.send({ valid: true })
    });

  app.route('/api/solve')
    .post((req, res) => {
      const { puzzle } = req.body

      if (!puzzle)
        return res.send({ error: "Required field missing" })

      try { solver.validate(puzzle) }
      catch (err) {
        res.send({ error: err })
      }

      const solutionArray = solver.solve(solver.getPuzzleArray(puzzle))
      if (!solutionArray)
        return res.send({ error: "Puzzle cannot be solved" })

      res.send({
        solution: solver.getPuzzleString(solutionArray)
      })
    });
};
