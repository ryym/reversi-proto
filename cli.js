const readline = require('readline');
const { Play } = require('./play');
const { Piece, Point } = require('./board');
const { repeat } = require('./util');

const pieces = {
  [Piece.NONE]: ' ',
  [Piece.WHITE]: 'O',
  [Piece.BLACK]: 'X',
};

const showBoard = board => {
  let yScale = 1;
  const rows = [];
  for (let y = 0; y < board.size; y++) {
    let row = `${yScale} |`;
    yScale += 1;
    for (let x = 0; x < board.size; x++) {
      const pt = new Point(x, y);
      const piece = board.get(pt);
      row += `${pieces[piece]}|`;
    }
    rows.push(row);
  }

  const xAxis = '   ' + repeat(board.size, i => i + 1).join(' ');
  rows.push(xAxis);
  return rows.join('\n');
};

const showResult = result => {
  return `Result:
${pieces[Piece.WHITE]}: ${result[Piece.WHITE]}
${pieces[Piece.BLACK]}: ${result[Piece.BLACK]}`;
};

const play = (reader, config) => {
  const state = {
    play: new Play({ size: config.boardSize }),
  };
  const prompt = 'put at:';
  const inputPattern = /^\s*(\d+)\s+(\d+)\s*$/;

  const writeState = () => {
    reader.write(`player: ${pieces[state.play.player]}\n`);
    reader.write(showBoard(state.play.board) + '\n');
  };

  const handleInput = input => {
    const m = input.match(inputPattern);

    if (m == null) {
      reader.write(`example: "${prompt}2 1" (y x)\n`);
      writeState();
      reader.question(prompt, handleInput);
      return;
    }

    const y = Number(m[1]) - 1;
    const x = Number(m[2]) - 1;
    const pt = new Point(x, y);
    const result = state.play.putPiece(pt);

    if (result && result.finished) {
      writeState();
      reader.write(showResult(result) + '\n');
      reader.close();
      return;
    }

    if (result == null) {
      reader.write('cannot put\n');
    } else {
      writeState();
    }
    reader.question(prompt, handleInput);
  };

  writeState();
  reader.question(prompt, handleInput);
};

const reader = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const config = {
  boardSize: process.env.REVERSI_SIZE || 4,
};

play(reader, config);
