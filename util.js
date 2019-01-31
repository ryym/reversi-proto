const repeat = (count, makeValue) => {
  const arr = [];
  for (let i = 0; i < count; i++) {
    arr[i] = makeValue(i);
  }
  return arr;
};

module.exports = { repeat };
