module.exports = {
  apps: [
    {
      script: "build/main.js",
      watch: ".",
    },
  ],
  deploy: {
    production: {
      user: "tca",
      host: "10.0.0.1",
      ref: "origin/main",
      repo: "https://github.com/EverlyScott/TCA-Lighting",
      path: "/var/TCA-Lighting",
      "pre-deploy-local": "",
      "post-deploy":
        "pnpm install && cp src/config.template.json src/config.json && pnpm build && pm2 reload ecosystem.config.js",
      "pre-setup": "",
    },
  },
};
