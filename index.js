const yaml = require('js-yaml');
const composition = require('./composition');

module.exports = robot => {
  const CONFIG_FILENAME = '.github/maintainers.yml';

  robot.on('pull_request.closed', sync);

  async function sync(context) {
    if (!context.payload.pull_request.merged) {
      // If a pull request is closed without merging,
      // then we have no work to do.
      return;
    }

    if (context.payload.pull_request.base.ref !== 'master') {
      // We only care about pull requests that are merged to master.
      return;
    }

    const config = await readConfig(context.payload.repository, context.github);
    if (!config.perform) {
      // If we didn't find a config file,
      // then we have nothing to do.
      return;
    }

    const organization = context.payload.repository.owner.login;

    const opts = {
      owner: organization,
      repo: context.payload.repository.name,
      number: context.payload.pull_request.number
    };
    const files = await context.github.pullRequests.getFiles(opts);
    let found = false;
    for (const file of files.data) {
      if (file.filename === CONFIG_FILENAME) {
        found = true;
      }
    }
    if (!found) {
      // The config file didn't change.
      // No point in syncing the maintainer team.
      return;
    }

    const team = await findTeam(context.payload.repository, context.github);

    const teamMembers = await findTeamMembers(team, context.github);
    const diff = composition(teamMembers, config.maintainers);

    diff.additions.forEach(username => {
      return context.github.orgs.addTeamMembership({id: team.id, role: 'member', username});
    });
    diff.deletions.forEach(username => {
      context.github.orgs.removeTeamMembership({id: team.id, username});
    });
  }

  async function findTeamMembers(team, github) {
    const members = [];
    let res = await github.orgs.getTeamMembers({id: team.id, role: 'all', page: 1, per_page: 100}); // eslint-disable-line camelcase
    for (;;) {
      for (const member of res.data) {
        members.push(member.login);
      }

      if (!github.hasNextPage(res)) {
        return members;
      }
      res = await context.github.getNextPage(res); // eslint-disable-line no-await-in-loop
    }
  }

  async function findTeam(repository, github) {
    let res = await github.orgs.getTeams({org: repository.owner.login, page: 1, per_page: 100}); // eslint-disable-line camelcase
    for (;;) {
      for (const team of res.data) {
        if (team.name === repository.name) {
          return team;
        }
      }

      if (!github.hasNextPage(res)) {
        return;
      }
      res = await context.github.getNextPage(res); // eslint-disable-line no-await-in-loop
    }
  }

  async function readConfig(repository, github) {
    const owner = repository.owner.login;
    const repo = repository.name;
    const path = CONFIG_FILENAME;
    let config;

    try {
      const res = await github.repos.getContent({owner, repo, path});
      config = yaml.load(Buffer.from(res.data.content, 'base64').toString()) || {};
      config.perform = true;
      return config;
    } catch (err) {
      return {perform: false};
    }
  }
};
