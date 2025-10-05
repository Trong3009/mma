module.exports = {
  apps: [
    {
      name: "dev",
      script: "src/index.js",
      env_dev: {
        NODE_ENV: "dev",
        PORT: 3001,
        API_URL: "http://localhost:3001/api"
      }
    }
  ]
};