import {
  add,
  pos,
  rect,
  outline,
  area,
  text,
  anchor,
  color,
  width,
  height,
  center,
  opacity,
  scene,
  go,
  vec2,
  setCursor,
  scale,
  rgb,
} from "./kaboomCtx";
import { AreaComp, GameObj, RectComp } from "kaboom";

enum GameStatus {
  RUNNING,
  FINISHED,
}

const EMPTY = "";
const PLAYER_X = "X";
const PLAYER_O = "O";
const ROWSXCELLS = Math.sqrt(9);
const GAMESIZE = 500;
const CELLSIZE = 80;
const BOARDSIZE = CELLSIZE * ROWSXCELLS;

let gameStatus = GameStatus.RUNNING;
let currentPlayer = PLAYER_X;

function resetGame() {
  gameStatus = GameStatus.RUNNING;
  currentPlayer = PLAYER_X;
}

scene("game", () => {
  const boardState: Array<Array<string>> = [];
  const board: Array<Array<GameObj<AreaComp>>> = makeBoard();

  resetGame();
  mapCellsToClick();

  function makeCell(x: number, y: number): GameObj<AreaComp> {
    return add([
      rect(CELLSIZE, CELLSIZE),
      pos(x, y),
      outline(3),
      area(),
      anchor("center"),
    ]);
  }

  function makeBoard(): Array<Array<GameObj<AreaComp>>> {
    const cells: [][] = [];
    const initialPositionX = (GAMESIZE - BOARDSIZE) / 2;
    const initialPositionY = (GAMESIZE - BOARDSIZE) / 2;

    for (let line = 0; line < ROWSXCELLS; line++) {
      for (let cell = 0; cell < ROWSXCELLS; cell++) {
        if (cells[line] === undefined) {
          cells[line] = [];
          boardState[line] = [];
        }

        const cellX = initialPositionX + cell * CELLSIZE + CELLSIZE / 2;
        const cellY = initialPositionY + line * CELLSIZE + CELLSIZE / 2;

        cells[line].push(makeCell(cellX, cellY) as never);
        boardState[line][cell] = EMPTY;
      }
    }

    return cells;
  }

  function mapCellsToClick() {
    for (let line = 0; line < ROWSXCELLS; line++) {
      for (let cell = 0; cell < ROWSXCELLS; cell++) {
        board[line][cell].onClick(() => {
          makeMove(line, cell);
        });
      }
    }
  }

  function makeMove(line: number, cell: number) {
    if (gameStatus === GameStatus.FINISHED) return;

    if (boardState[line][cell] === EMPTY) {
      boardState[line][cell] = currentPlayer;
      board[line][cell].add([
        text(currentPlayer),
        anchor("center"),
        color(0, 0, 0),
      ]);

      if (checkWin()) {
        showMessage(`Player ${currentPlayer} wins!`);
        gameStatus = GameStatus.FINISHED;
      } else if (checkDraw()) {
        showMessage("Draw!");
        gameStatus = GameStatus.FINISHED;
      } else {
        nextPlayer();
        gameStatus = GameStatus.RUNNING;
      }
    }
  }

  function nextPlayer() {
    currentPlayer = currentPlayer === PLAYER_X ? PLAYER_O : PLAYER_X;
  }

  function checkWin() {
    for (let line = 0; line < ROWSXCELLS; line++) {
      for (let cell = 0; cell < ROWSXCELLS; cell++) {
        if (boardState[line][cell] === currentPlayer) {
          if (checkLine(line)) {
            return true;
          }

          if (checkColumn(cell)) {
            return true;
          }

          if (checkDiagonal()) {
            return true;
          }
        }
      }
    }
  }

  function checkLine(line: number) {
    for (let cell = 0; cell < ROWSXCELLS; cell++) {
      if (boardState[line][cell] !== currentPlayer) {
        return false;
      }
    }

    return true;
  }

  function checkColumn(column: number) {
    for (let line = 0; line < ROWSXCELLS; line++) {
      if (boardState[line][column] !== currentPlayer) {
        return false;
      }
    }

    return true;
  }

  function checkDiagonal() {
    return checkDiagonal1() || checkDiagonal2();
  }

  function checkDiagonal1() {
    for (let line = 0; line < ROWSXCELLS; line++) {
      if (boardState[line][line] !== currentPlayer) {
        return false;
      }
    }

    return true;
  }

  function checkDiagonal2() {
    for (let line = 0; line < ROWSXCELLS; line++) {
      if (boardState[line][ROWSXCELLS - line - 1] !== currentPlayer) {
        return false;
      }
    }

    return true;
  }

  function checkDraw() {
    for (let line = 0; line < ROWSXCELLS; line++) {
      for (let cell = 0; cell < ROWSXCELLS; cell++) {
        if (boardState[line][cell] === EMPTY) {
          return false;
        }
      }
    }

    return true;
  }

  function showMessage(message: string): Array<GameObj<RectComp>> {
    const box = add([
      rect(width(), height(), {
        radius: width() / 2,
      }),
      pos(0, 0),
      color(0, 0, 0),
      opacity(0.5),
    ]);

    box.add([
      text(message, { size: 32, width: width() - 230, align: "center" }),
      pos(center().x, center().y),
      anchor("center"),
      color(255, 255, 255),
    ]);

    const btn = add([
      rect(200, 50, { radius: 8 }),
      pos(center().x, center().y + 50),
      anchor("center"),
      color(255, 255, 255),
      area(),
      scale(1),
    ]);

    btn.add([text("Restart", { size: 32 }), anchor("center"), color(0, 0, 0)]);

    btn.onClick(() => {
      go("game");
    });

    btn.onHoverUpdate(() => {
      btn.color = rgb(253, 253, 253);
      btn.scale = vec2(1.1);
      setCursor("pointer");
    });

    btn.onHoverEnd(() => {
      btn.scale = vec2(1);
      btn.color = rgb(255, 255, 255);
    });

    return [box, btn];
  }
});

go("game");
