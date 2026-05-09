import { z } from "zod";
import type { UpdateContactDto } from "../../domain/types.js";

function isValidFullName(value: string) {
  const words = value.trim().split(/\s+/);

  return words.length >= 2 && words.every((word) => word.length >= 3);
}

function isValidPhone(value: string) {
  const allowedCharacters = /^[0-9\s()+-]+$/;

  if (!allowedCharacters.test(value)) {
    return false;
  }

  let digits = value.replace(/\D/g, "");

  if (digits.startsWith("55")) {
    digits = digits.slice(2);
  }

  return digits.length === 10 || digits.length === 11;
}

const nomeSchema = z
  .string({
    error: (issue) =>
      issue.input === undefined
        ? "O nome é obrigatório."
        : "O nome deve ser um texto.",
  })
  .trim()
  .min(1, "O nome é obrigatório.")
  .refine(isValidFullName, {
    message: "O nome deve conter pelo menos duas palavras com no mínimo 3 letras cada.",
  });

const telefoneSchema = z
  .string({
    error: (issue) =>
      issue.input === undefined
        ? "O telefone é obrigatório."
        : "O telefone deve ser um texto.",
  })
  .trim()
  .min(1, "O telefone é obrigatório.")
  .max(20, "O telefone deve ter no máximo 20 caracteres.")
  .refine(isValidPhone, {
    message: "O telefone é inválido.",
  });

export const createContactSchema = z.object({
  nome: nomeSchema,
  telefone: telefoneSchema,
});

export const updateContactSchema = z
  .object({
    nome: nomeSchema.optional(),
    telefone: telefoneSchema.optional(),
  })
  .refine((data) => data.nome !== undefined || data.telefone !== undefined, {
    message: "Informe pelo menos um campo para atualização.",
  })
  .transform((data): UpdateContactDto => {
    const result: UpdateContactDto = {};

    if (data.nome !== undefined) {
      result.nome = data.nome;
    }

    if (data.telefone !== undefined) {
      result.telefone = data.telefone;
    }

    return result;
  });