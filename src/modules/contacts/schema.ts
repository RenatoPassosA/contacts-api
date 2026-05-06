import { z } from "zod";

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

export const createContactSchema = z.object({
  name: z
    .string()
    .trim()
    .refine(isValidFullName, {
      message: "O nome deve conter pelo menos duas palavras com no mínimo 3 letras cada.",
    }),
    phone: z
      .string()
      .trim()
      .min(1, "O telefone é obrigatório.")
      .max(20, "O telefone deve ter no máximo 20 caracteres.")
      .refine(isValidPhone, {
        message: "O telefone é inválido.",
      }),
});

export const updateContactSchema = z
  .object({
    name: z
      .string()
      .trim()
      .refine(isValidFullName, {
        message: "O nome deve conter pelo menos duas palavras com no mínimo 3 letras cada.",
      })
      .optional(),
    phone: z
      .string()
      .trim()
      .min(1, "O telefone é obrigatório.")
      .max(20, "O telefone deve ter no máximo 20 caracteres.")
      .refine(isValidPhone, {
        message: "O telefone é inválido.",
      })
      .optional(),
  })
  .refine((data) => data.name !== undefined || data.phone !== undefined, {
    message: "Informe pelo menos um campo para atualização.",
  });