import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { AppError } from "../errors/app-error.js";
import { DatabaseError } from "../errors/database-error.js";

export function errorHandler(
  error: unknown,
  _request: Request,
  response: Response,
  _next: NextFunction
) {
  if (error instanceof ZodError) {
    return response.status(400).json({
      message: "Dados inválidos.",
      errors: error.issues.map((issue) => issue.message),
    });
  }

  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      message: error.message,
    });
  }

  if (error instanceof DatabaseError) {
    return response.status(500).json({
      message: error.message,
    });
  }

  return response.status(500).json({
    message: "Erro interno do servidor.",
  });
}