const { Reversi } = require('./reversi');
const { Board, Piece } = require('./board');

// オセロの進行を管理するクラス。
// 駒を置けるマスがなくなってもゲームを終了しないといけないけど、未実装。
// あとパスとか降参もできない。
class Play {
  constructor({ size = 8 } = {}) {
    this.game = new Reversi(new Board(size));
    this.player = Piece.BLACK;
    this.counts = {
      [Piece.WHITE]: 2,
      [Piece.BLACK]: 2,
    };
  }

  get board() {
    return this.game.board;
  }

  putPiece(pt) {
    if (!this.freeCellExists()) {
      throw new Error('game has finished');
    }

    const flipCount = this.game.put(pt, this.player);
    if (flipCount == null) {
      return null;
    }

    const opponent = Piece.flip(this.player);

    this.counts[this.player] += flipCount + 1;
    this.counts[opponent] -= flipCount;

    this.player = opponent;

    return {
      [Piece.WHITE]: this.counts[Piece.WHITE],
      [Piece.BLACK]: this.counts[Piece.BLACK],
      finished: !this.freeCellExists(),
    };
  }

  freeCellExists() {
    const total = Object.values(this.counts).reduce((t, c) => t + c, 0);
    return total < this.board.size * this.board.size;
  }
}

module.exports = { Play };
