import express from "express";
import { contactRoutes } from "./modules/contacts/routes.js";
import { errorHandler } from "./middlewares/error-handler.js";

const app = express();

app.use(express.json());

app.get("/health", (request, response) => {
  response.status(200).json({
    status: "ok",
    service: "contatos-api",
  });
});

app.get("/", (request, response) => {
  response.status(200).json({
    message: "Contacts API is running.",
  });
});

app.use(contactRoutes);
app.use(errorHandler);

export { app };