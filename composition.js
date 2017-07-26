module.exports = function (members, maintainers) {
  function diff(arr1, arr2) {
    return arr1.filter(item => {
      return arr2.indexOf(item) === -1;
    });
  }

  function isAlum(maintainer) {
    return maintainer.alumnus;
  }

  function isCurrent(maintainer) {
    return !maintainer.alumnus;
  }

  function username(maintainer) {
    return maintainer.github_username;
  }

  const src = members;
  const dst = maintainers.filter(isCurrent).map(username);

  return {
    alumni: maintainers.filter(isAlum).map(username),
    additions: diff(dst, src),
    deletions: diff(src, dst)
  };
};
