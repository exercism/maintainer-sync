const yaml = require('js-yaml');
const composition = require('./composition');
const CONFIG_FILENAME = ".github/maintainers.yml";

module.exports = (robot) => {
  robot.on('pull_request.closed', sync);

  async function sync(context) {
    if (!context.payload.pull_request.merged) {
      // If a pull request is closed without merging,
      // then we have no work to do.
      return;
    }

    if (context.payload.pull_request.base.ref !== "master") {
      // We only care about pull requests that are merged to master.
      return;
    }

    const config = await readConfig(context.payload.repository, context.github);
    if (!config.perform) {
      // If we didn't find a config file,
      // then we have nothing to do.
      return;
    }

    let organization = context.payload.repository.owner.login;

    let opts = {
      owner: organization,
      repo: context.payload.repository.name,
      number: context.payload.pull_request.number
    }
    const files = await context.github.pullRequests.getFiles(opts)
    let found = false;
    for (file of files.data) {
      if (file.filename === CONFIG_FILENAME) {
        found = true
      }
    }
    if (!found) {
      // The config file didn't change.
      // No point in syncing the maintainer team.
      return;
    }

    let team = await findTeam(context.payload.repository, context.github);

    let teamMembers = await findTeamMembers(team, context.github);
    let diff = composition(teamMembers, config.maintainers);

    // TODO:
    // The team membership endpoints are not yet available to GitHub Apps.
    diff.additions.forEach((username) => {
      // TODO
    })
    diff.deletions.forEach((username) => {
      // TODO
    })
  }

  async function findTeamMembers(team, github) {
    let members = []
    let res = await github.orgs.getTeamMembers({id: team.id, role: "all", page: 1, per_page: 100});
    while (true) {
      for (member of res.data) {
        members.push(member.login);
      }

      if (!github.hasNextPage(res)) {
        return members;
      }
      res = await context.github.getNextPage(res);
    }
  }


  async function findTeam(repository, github) {
    let res = await github.orgs.getTeams({ org: repository.owner.login, page: 1, per_page: 100});
    while (true) {
      for (team of res.data) {
        if (team.name === repository.name) {
          return team;
        }
      }

      if (!github.hasNextPage(res)) {
        return;
      }
      res = await context.github.getNextPage(res);
    }
  }

  async function readConfig(repository, github) {
    const owner = repository.owner.login;
    const repo = repository.name;
    const path = CONFIG_FILENAME;
    let config;

    try {
      const res = await github.repos.getContent({owner, repo, path});
      config = yaml.load(new Buffer(res.data.content, 'base64').toString()) || {};
      config.perform = true;
      return config;
    } catch (err) {
      return {perform: false};
    }
  }
};
