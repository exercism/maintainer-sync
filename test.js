const expect = require('expect');
const composition = require('./composition');

describe('bot behavior', () => {
  it('with no diff', () => {
    const members = ['alice', 'bob', 'charlie'];
    const diff = composition(members, members);
    expect(diff.additions).toEqual([]);
    expect(diff.deletions).toEqual([]);
  });
  it('with deletions', () => {
    const members = ['alice', 'bob', 'charlie'];
    const maintainers = ['alice', 'charlie'];
    const diff = composition(members, maintainers);
    expect(diff.additions).toEqual([]);
    expect(diff.deletions).toEqual(['bob']);
  });
  it('with additions', () => {
    const members = ['alice', 'bob', 'charlie'];
    const maintainers = ['alice', 'bob', 'charlie', 'dave'];
    const diff = composition(members, maintainers);
    expect(diff.additions).toEqual(['dave']);
    expect(diff.deletions).toEqual([]);
  });
  it('with all the changes', () => {
    const members = ['alice', 'bob'];
    const maintainers = ['charlie', 'dave'];
    const diff = composition(members, maintainers);
    expect(diff.additions).toEqual(['charlie', 'dave']);
    expect(diff.deletions).toEqual(['alice', 'bob']);
  });
});
