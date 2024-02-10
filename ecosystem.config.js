module.exports = {
  apps: [
    {
      name: "JMS_API",
      script: "npx",
      interpreter: "none",
      args: "npm start",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env_production: {
        NODE_ENV: "production",
      },
    },
  ],
};
