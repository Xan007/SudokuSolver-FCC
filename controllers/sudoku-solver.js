const PUZZLE_REGEX = /^[.\d]+$/

class SudokuSolver {
  validate(puzzleString) {
    if (!puzzleString)
      throw "Expected puzzle string"

    if (!puzzleString instanceof String)
      throw "Expected puzzle to be a string"

    if (puzzleString.length !== 81)
      throw "Expected puzzle to be 81 characters long"

    if (!PUZZLE_REGEX.test(puzzleString))
      throw "Invalid characters in puzzle"

    return true
  }

  getPuzzleArray(puzzleString) {
    if (!this.validate(puzzleString))
      return

    let puzzleArray = []

    for (let row = 0; row < 9; row++) {
      let rowString = puzzleString.slice(row * 9, 9 + (row * 9))
      let columns = rowString.split("").map(
        number => number === "." ? 0 : Number(number)
      )

      puzzleArray.push(columns)
    }

    return puzzleArray
  }

  getPuzzleString(puzzleArray) {
    return puzzleArray.flatMap(rowArray => {
      return rowArray.map(num => num === 0 ? "." : String(num))
    }).join('')
  }

  checkCoordinate(row, column, value) {
    if (!(0 <= row < 9))
      throw "Invalid coordinate"

    if (!(0 <= column < 9))
      throw "Invalid coordinate"

    if (!(1 <= value <= 9))
      throw "Invalid value"

    return true
  }

  checkRowPlacement(puzzleArray, row, column, value) {
    this.checkCoordinate(row, column, value)

    for (let columnVar = 0; columnVar < 9; columnVar++) {
      if (columnVar === column)
        continue

      if (puzzleArray[row][columnVar] === value)
        return false
    }

    return true
  }

  checkColPlacement(puzzleArray, row, column, value) {
    this.checkCoordinate(row, column, value)

    for (let rowVar = 0; rowVar < 9; rowVar++) {
      if (rowVar === row)
        continue

      if (puzzleArray[rowVar][column] === value)
        return false
    }

    return true
  }

  checkRegionPlacement(puzzleArray, row, column, value) {
    this.checkCoordinate(row, column, value)

    let rowStart = Math.floor(row / 3) * 3
    let colStart = Math.floor(column / 3) * 3

    for (let rowVar = rowStart; rowVar < rowStart+3; rowVar++) {
      for (let columnVar = colStart; columnVar < colStart+3; columnVar++) {
        if (rowVar === row && columnVar === column)
          continue

        if (puzzleArray[rowVar][columnVar] === value) {
          return false
        }
      }
    }

    return true
  }

  possible(puzzleArray, row, column, value) {
    let problems = []

    if (!this.checkRowPlacement(puzzleArray, row, column, value))
      problems.push("row")

    if (!this.checkColPlacement(puzzleArray, row, column, value)) {
      problems.push("column")
    }

    if (!this.checkRegionPlacement(puzzleArray, row, column, value))
      problems.push("region")
      
    console.log(problems)

    //Result, problems
    return [problems.length == 0, problems]
  }

  solve(puzzleArray) {
    for (let row = 0; row < 9; row++) {
      for (let column = 0; column < 9; column++) {
        if (puzzleArray[row][column] !== 0)
            continue

        for (let value = 1; value <= 9; value++) {
          if (this.possible(puzzleArray, row, column, value)) {
            puzzleArray[row][column] = value

            if (this.solve(puzzleArray) == true){
              return puzzleArray
            }
          }

          puzzleArray[row][column] = 0
        }

        return false
      }
    }

    return puzzleArray
  }
}

module.exports = SudokuSolver;

/* Sale error region cuando
- En el cuadro de 3x3 ya hay un numero con ese numero...

Sale error row cuando:
- Cuando en la fila (la letra [1-9]) ya hay un numero igual

Sale error column cuando:
- Cuando en la columna (A-I) ya hay un numero igual*/