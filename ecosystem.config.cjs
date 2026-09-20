module.exports = {
  apps: [
    {
      name: "bit3un-frontend",
      script: "./server/bit3un-static-router.mjs",
      interpreter: "node",
      env: {
        NODE_ENV: "production",
        BIT3UN_FRONTEND_HOST: "127.0.0.1",
        BIT3UN_FRONTEND_PORT: "3004",
        BIT3UN_FRONTEND_ROOT: "/var/www/bit3un-new",
        BIT3UN_DEBUG_PORT: "3338"
      }
    },
    {
      name: "bit3un-debugger-agent",
      script: "./backend/automated-debugger-agent.mjs",
      interpreter: "node",
      env: {
        NODE_ENV: "production",
        BIT3UN_DEBUG_HOST: "127.0.0.1",
        BIT3UN_DEBUG_PORT: "3338"
      }
    }
  ]
};
