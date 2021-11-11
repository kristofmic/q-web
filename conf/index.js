const path = require('path');
const nconf = require('nconf');

function init() {
  const configEnvironment = process.env.CONFIG || 'development';
  const configFiles = [`${configEnvironment}.json`, 'default.json'];

  nconf.env();
  nconf.argv();

  configFiles.forEach((fileName) => {
    nconf.file(fileName, path.resolve(__dirname, fileName));
  });
}

// NOTE: once init'd, simply require nconf and it will contain all of the enviornment info
module.exports = init;
