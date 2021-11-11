const conf = require('nconf');

let startrConf = conf.get('db:startr');

if (!startrConf) {
  require('../../conf')(); // eslint-disable-line global-require
  startrConf = conf.get('db:startr');
}

function resolveVariable(name) {
  const envVar = startrConf[`${name}EnvVar`];

  return envVar ? conf.get(envVar) : startrConf[name];
}

const config = {
  client: 'pg',
  connection: {
    host: resolveVariable('host'),
    user: resolveVariable('user'),
    port: resolveVariable('port'),
    password: resolveVariable('password'),
    database: resolveVariable('name'),
  },
};

module.exports = config;
