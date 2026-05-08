import {
  createContactSchema,
  updateContactSchema,
} from "../adapters/http/schema.js";

describe("createContactSchema", () => {
  describe("nome", () => {
    it("aceita nome com duas palavras válidas", () => {
      const result = createContactSchema.safeParse({
        nome: "João Silva",
        telefone: "11999999999",
      });

      expect(result.success).toBe(true);
    });

    it("rejeita nome com apenas uma palavra", () => {
      const result = createContactSchema.safeParse({
        nome: "João",
        telefone: "11999999999",
      });

      expect(result.success).toBe(false);
    });

    it("rejeita nome com palavra menor que 3 letras", () => {
      const result = createContactSchema.safeParse({
        nome: "Jo Silva",
        telefone: "11999999999",
      });

      expect(result.success).toBe(false);
    });
  });

  describe("telefone", () => {
    it("aceita telefone com 11 dígitos", () => {
      const result = createContactSchema.safeParse({
        nome: "João Silva",
        telefone: "11999999999",
      });

      expect(result.success).toBe(true);
    });

    it("aceita telefone com 10 dígitos", () => {
      const result = createContactSchema.safeParse({
        nome: "João Silva",
        telefone: "1133334444",
      });

      expect(result.success).toBe(true);
    });

    it("aceita telefone formatado", () => {
      const result = createContactSchema.safeParse({
        nome: "João Silva",
        telefone: "(11) 99999-9999",
      });

      expect(result.success).toBe(true);
    });

    it("rejeita telefone com letras", () => {
      const result = createContactSchema.safeParse({
        nome: "João Silva",
        telefone: "abc",
      });

      expect(result.success).toBe(false);
    });

    it("rejeita telefone vazio", () => {
      const result = createContactSchema.safeParse({
        nome: "João Silva",
        telefone: "",
      });

      expect(result.success).toBe(false);
    });
  });
});

describe("updateContactSchema", () => {
  it("aceita apenas nome", () => {
    const result = updateContactSchema.safeParse({
      nome: "João Santos",
    });

    expect(result.success).toBe(true);
  });

  it("aceita apenas telefone", () => {
    const result = updateContactSchema.safeParse({
      telefone: "11988887777",
    });

    expect(result.success).toBe(true);
  });

  it("aceita nome e telefone juntos", () => {
    const result = updateContactSchema.safeParse({
      nome: "João Santos",
      telefone: "11988887777",
    });

    expect(result.success).toBe(true);
  });

  it("rejeita body vazio", () => {
    const result = updateContactSchema.safeParse({});

    expect(result.success).toBe(false);
  });
});