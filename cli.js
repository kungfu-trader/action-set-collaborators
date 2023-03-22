const lib = require('./lib.js');
const core = require('@actions/core');

const argv = require('yargs/yargs')(process.argv.slice(2))
  .option('token', { description: 'token', type: 'string' })
  .option('owner', { description: 'owner', type: 'string' })
  .option('repo', { description: 'repo', type: 'string' })
  .option('manager', { description: 'repo', type: 'string' })
  .help().argv;

lib.setCollaborator(argv).catch(console.error);
