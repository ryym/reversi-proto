const { Piece, Point } = require('./board');

// オセロのルールに従ってボードを操作するクラス。
class Reversi {
  constructor(board) {
    putInitialPieces(board);
    this.board = board;
    this.moves = moves;
  }

  put(pt, piece) {
    if (!this.board.canPut(pt)) {
      return null;
    }

    let pts = [];
    this.moves.forEach(move => {
      pts = pts.concat(flippablePoints(this.board, { putAt: pt, piece, next: move }));
    });

    // 相手の駒を1つ以上挟める位置以外には置けない。
    if (pts.length === 0) {
      return null;
    }

    this.board.put(pt, piece);
    pts.forEach(pt => this.board.flip(pt));
    return pts.length;
  }
}

const moves = [
  // rght
  pt => new Point(pt.x + 1, pt.y),
  // left
  pt => new Point(pt.x - 1, pt.y),
  // up
  pt => new Point(pt.x, pt.y + 1),
  // down
  pt => new Point(pt.x, pt.y - 1),
  // right up
  pt => new Point(pt.x + 1, pt.y - 1),
  // right down
  pt => new Point(pt.x + 1, pt.y + 1),
  // left up
  pt => new Point(pt.x - 1, pt.y - 1),
  // left down
  pt => new Point(pt.x - 1, pt.y + 1),
];

// ボードの中央に駒を置く。
const putInitialPieces = board => {
  if (board.size % 2 !== 0) {
    throw new Error('board size must be even');
  }
  const a = board.size / 2;
  const b = a - 1;
  board.put(new Point(a, a), Piece.WHITE);
  board.put(new Point(a, b), Piece.BLACK);
  board.put(new Point(b, a), Piece.BLACK);
  board.put(new Point(b, b), Piece.WHITE);
};

// 指定された方向 (next) にある相手の駒を探し、flip できる駒の位置リストを返す。
const flippablePoints = (board, { putAt: point, piece: reverser, next }) => {
  const start = next(point);

  let pts = [];
  let closed = false;
  for (let pt = start; board.isValidPoint(pt); pt = next(pt)) {
    const piece = board.get(pt);
    if (piece === Piece.NONE) {
      break;
    } else if (piece === reverser) {
      closed = true;
      break;
    } else {
      pts.push(pt);
    }
  }

  return closed ? pts : [];
};

module.exports = { Reversi };
