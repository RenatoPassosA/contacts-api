import express from "express";

const app = express();

app.use(express.json());

app.get("/health", (request, response) => {
  response.status(200).json({
    status: "ok",
    service: "contatos-api",
  });
});

export { app };