module.exports = {
  apps: [
    {
      name: 'turborepo',
      script: 'npm run serve',
      error_file: './turborepo-error.log',
      out_file: './turborepo-out.log',
    },
    {
      name: 'prisma',
      script: 'npm run db:studio --workspace=api',
      error_file: './prisma-error.log',
      out_file: './prisma-out.log',
    },
  ],
};
