var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'words-community'
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://localhost/words-community-development'
  },

  test: {
    root: rootPath,
    app: {
      name: 'words-community'
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://localhost/words-community-test'
  },

  production: {
    root: rootPath,
    app: {
      name: 'words-community'
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://localhost/words-community-production'
  }
};

module.exports = config[env];
