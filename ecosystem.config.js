module.exports = {
  apps: [
    {
      script: "build/main.js",
      watch: ".",
    },
    {
      script: "./service-worker/",
      watch: ["./service-worker"],
    },
  ],

  deploy: {
    production: {
      user: "tca",
      host: "http://68.117.90.63:222/",
      ref: "origin/main",
      repo: "https://github.com/EverlyScott/TCA-Lighting",
      path: "/var/TCA-Lighting",
      "pre-deploy-local": "",
      "post-deploy": "pnpm install && pnpm build && pm2 reload ecosystem.config.js --env production",
      "pre-setup": "",
    },
  },
};
