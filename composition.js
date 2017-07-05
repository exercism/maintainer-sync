module.exports = function(src, dst) {
  diff = function(arr1, arr2) {
    return arr1.filter((item) => {
      return arr2.indexOf(item) === -1;
    });
  }

  return {
    additions: diff(dst, src),
    deletions: diff(src, dst)
  }
}
