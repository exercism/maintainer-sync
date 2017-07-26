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
    const teamMembers = ['alice', 'bob', 'charlie'];
    const configMembers = ['alice', 'charlie'];
    const diff = composition(teamMembers, configMembers);
    expect(diff.additions).toEqual([]);
    expect(diff.deletions).toEqual(['bob']);
  });
  it('with additions', () => {
    const teamMembers = ['alice', 'bob', 'charlie'];
    const configMembers = ['alice', 'bob', 'charlie', 'dave'];
    const diff = composition(teamMembers, configMembers);
    expect(diff.additions).toEqual(['dave']);
    expect(diff.deletions).toEqual([]);
  });
  it('with all the changes', () => {
    const teamMembers = ['alice', 'bob'];
    const configMembers = ['charlie', 'dave'];
    const diff = composition(teamMembers, configMembers);
    expect(diff.additions).toEqual(['charlie', 'dave']);
    expect(diff.deletions).toEqual(['alice', 'bob']);
  });
});
