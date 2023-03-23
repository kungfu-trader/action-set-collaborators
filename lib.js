const github = require('@actions/github');
const fs = require('fs-extra');
const path = require('path');
const readline = require('readline');

async function getCodeOwner() {
  const cwd = process.cwd();
  const codeOwnerFile = path.join(cwd, '.github/CODEOWNERS');
  try {
    const isFile = fs.existsSync(codeOwnerFile);
    console.log('isFile', isFile);
    if (!isFile) {
      return '';
    }
    const fileStream = fs.createReadStream(codeOwnerFile);
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });
    for await (const line of rl) {
      if (line.trim().startsWith('*')) {
        const idx = line.indexOf('@');
        if (idx != -1) {
          return line.substring(idx).split('/')[1].trim();
        }
      }
    }
  } catch (e) {
    console.error(e);
  }
  return '';
}

exports.setCollaborator = async function (argv) {
  const octokit = github.getOctokit(argv.token);
  const teamQa = await getCodeOwner();
  const teamDev = argv.manager;
  console.log('QA and Developer:', teamQa, teamDev);
  if (teamQa) {
    await octokit.request(`PUT /orgs/${argv.owner}/teams/${teamQa}/repos/${argv.owner}/${argv.repo}`, {
      org: argv.owner,
      team_slug: teamQa,
      owner: argv.owner,
      repo: argv.repo,
      permission: 'maintain',
      headers: {
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });
  }
  if (teamDev) {
    await octokit.request(`PUT /orgs/${argv.owner}/teams/${teamDev}/repos/${argv.owner}/${argv.repo}`, {
      org: argv.owner,
      team_slug: teamDev,
      owner: argv.owner,
      repo: argv.repo,
      permission: 'maintain',
      headers: {
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });
  }
};
