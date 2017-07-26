module.exports = function (members, maintainers) {
  function diff(arr1, arr2) {
    return arr1.filter(item => {
      return arr2.indexOf(item) === -1;
    });
  }

  function username(maintainer) {
    return maintainer.github_username;
  }

  const src = members;
  const dst = maintainers.map(username);

  return {
    additions: diff(dst, src),
    deletions: diff(src, dst)
  };
};
