const { repeat } = require('./util');

const Piece = {
  NONE: 0,
  BLACK: 1,
  WHITE: 2,
};

Piece.flip = piece => {
  switch (piece) {
    case Piece.BLACK:
      return Piece.WHITE;
    case Piece.WHITE:
      return Piece.BLACK;
    default:
      throw new Error('cannot flip empty cell');
  }
};

// ボード上の座標 (位置) を表す。
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  is(other) {
    return other instanceof Point && this.x === other.x && this.y === other.y;
  }
}

// 正方形のボード。
class Board {
  constructor(size) {
    this.size = size;
    this.board = repeat(size, () => repeat(size, () => Piece.NONE));
  }

  get(pt) {
    this.assertPoint(pt);
    return this.board[pt.y][pt.x];
  }

  put(pt, piece) {
    this.assertPoint(pt);
    this.board[pt.y][pt.x] = piece;
  }

  canPut(pt) {
    return this.isValidPoint(pt) && this.get(pt) === Piece.NONE;
  }

  flip(pt) {
    const piece = this.get(pt);
    this.put(pt, Piece.flip(piece));
  }

  assertPoint(pt) {
    if (!this.isValidPoint(pt)) {
      throw new Error('invalid point');
    }
  }

  isValidPoint(pt) {
    return 0 <= pt.y && pt.y < this.size && 0 <= pt.x && pt.x < this.size;
  }
}

module.exports = {
  Piece,
  Point,
  Board,
};
