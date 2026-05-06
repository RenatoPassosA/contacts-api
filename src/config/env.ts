import "dotenv/config";

const requiredEnvVariables = [
  "PORT",
  "DB_HOST",
  "DB_PORT",
  "DB_USER",
  "DB_NAME",
];

requiredEnvVariables.forEach((variable) => {
  if (!process.env[variable]) {
    throw new Error(`Missing environment variable: ${variable}`);
  }
});

export const env = {
  port: Number(process.env.PORT),
  database: {
    host: process.env.DB_HOST as string,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER as string,
    password: process.env.DB_PASSWORD ?? "",
    name: process.env.DB_NAME as string,
  },
};