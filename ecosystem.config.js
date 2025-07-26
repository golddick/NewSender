// module.exports = {
//   apps: [
//     {
//       name: "email-processor",
//       script: "./src/shared/libs/emailProcessor.js",  // Directly point to your JS file
//       interpreter: "node",
//       watch: false,
//       autorestart: true,
//       max_restarts: 5,
//       restart_delay: 5000,
//       env: {
//         NODE_ENV: "production"
//       },
//       env_development: {
//         NODE_ENV: "development"
//       }
//     }
//   ]
// };


module.exports = {
  apps: [
    {
      name: "thenews-app",
      script: "server.js",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "500M",
      env: {
        NODE_ENV: "production",
      },
    },
    {
      name: "email-processor",
      script: "dist/shared/libs/emailProcessor.js", // Compiled JS file
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "250M",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};


