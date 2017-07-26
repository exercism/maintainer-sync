const expect = require('expect');
const composition = require('./composition');

function maintainer(username) {
  return {github_username: username}; // eslint-disable-line camelcase
}

describe('bot behavior', () => {
  it('with no diff', () => {
    const members = ['alice', 'bob', 'charlie'];
    const maintainers = [
      maintainer('alice'),
      maintainer('bob'),
      maintainer('charlie')
    ];
    const diff = composition(members, maintainers);
    expect(diff.additions).toEqual([]);
    expect(diff.deletions).toEqual([]);
  });
  it('with deletions', () => {
    const members = ['alice', 'bob', 'charlie'];
    const maintainers = [
      maintainer('alice'),
      maintainer('charlie')
    ];
    const diff = composition(members, maintainers);
    expect(diff.additions).toEqual([]);
    expect(diff.deletions).toEqual(['bob']);
  });
  it('with additions', () => {
    const members = ['alice', 'bob', 'charlie'];
    const maintainers = [
      maintainer('alice'),
      maintainer('bob'),
      maintainer('charlie'),
      maintainer('dave')
    ];
    const diff = composition(members, maintainers);
    expect(diff.additions).toEqual(['dave']);
    expect(diff.deletions).toEqual([]);
  });
  it('with all the changes', () => {
    const members = ['alice', 'bob'];
    const maintainers = [
      maintainer('charlie'),
      maintainer('dave')
    ];
    const diff = composition(members, maintainers);
    expect(diff.additions).toEqual(['charlie', 'dave']);
    expect(diff.deletions).toEqual(['alice', 'bob']);
  });
});
