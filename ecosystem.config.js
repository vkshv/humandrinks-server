module.exports = {
  apps: [
    {
      name: 'server',
      script: 'index.js',
      instances: 'max',
      exec_mode: 'cluster',
      watch: true,
    },
  ],
};
