import express from "express";
import { contactRoutes } from "./adapters/http/routes.js";
import { errorHandler } from "./middlewares/error-handler.js";
import { checkDatabaseConnection } from "./infra/mysql/database.js";

const app = express();

app.use(express.json());

app.get("/health", async (_request, response) => {
  try {
    await checkDatabaseConnection();

    return response.status(200).json({
      status: "ok",
      service: "contatos-api",
      database: "connected",
    });
  } catch {
    return response.status(503).json({
      status: "error",
      service: "contatos-api",
      database: "disconnected",
    });
  }
});

app.get("/", (_request, response) => {
  response.status(200).json({
    message: "Contacts API is running.",
  });
});

app.use(contactRoutes);
app.use(errorHandler);

export { app };