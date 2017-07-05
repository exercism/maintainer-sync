const expect = require('expect');
const composition = require('./composition');

describe('bot behavior', function () {
  it('with no diff', function () {
    const members = ['alice', 'bob', 'charlie'];
    diff = composition(members, members)
    expect(diff.additions).toEqual([]);
    expect(diff.deletions).toEqual([]);
  })
  it('with deletions', function () {
    const team_members = ['alice', 'bob', 'charlie'];
    const config_members = ['alice', 'charlie'];
    diff = composition(team_members, config_members)
    expect(diff.additions).toEqual([]);
    expect(diff.deletions).toEqual(['bob']);
  })
  it('with additions', function () {
    const team_members = ['alice', 'bob', 'charlie'];
    const config_members = ['alice', 'bob', 'charlie', 'dave'];
    diff = composition(team_members, config_members);
    expect(diff.additions).toEqual(['dave']);
    expect(diff.deletions).toEqual([]);
  })
  it('with all the changes', function () {
    const team_members = ['alice', 'bob'];
    const config_members = ['charlie', 'dave'];
    diff = composition(team_members, config_members);
    expect(diff.additions).toEqual(['charlie', 'dave']);
    expect(diff.deletions).toEqual(['alice', 'bob']);
  })
})
