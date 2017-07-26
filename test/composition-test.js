const expect = require('expect');
const composition = require('../composition');

function maintainer(username, alumnus) {
  return {github_username: username, alumnus}; // eslint-disable-line camelcase
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
    expect(diff.alumni).toEqual([]);
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
  it('with alumni', () => {
    const members = ['alice', 'bob', 'charlie'];
    const isAlumnus = true;
    const maintainers = [
      maintainer('alice'),
      maintainer('bob', isAlumnus),
      maintainer('charlie', isAlumnus)
    ];
    const diff = composition(members, maintainers);
    expect(diff.additions).toEqual([]);
    expect(diff.deletions).toEqual(['bob', 'charlie']);
    expect(diff.alumni).toEqual(['bob', 'charlie']);
  });
  it('with all the changes', () => {
    const members = ['alice', 'bob'];
    const isAlumnus = true;
    const maintainers = [
      maintainer('charlie'),
      maintainer('dave', isAlumnus)
    ];
    const diff = composition(members, maintainers);
    expect(diff.additions).toEqual(['charlie']);
    expect(diff.deletions).toEqual(['alice', 'bob']);
    expect(diff.alumni).toEqual(['dave']);
  });
});
