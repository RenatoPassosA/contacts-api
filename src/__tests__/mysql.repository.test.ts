import { jest } from "@jest/globals";

const mockExecute = jest.fn<(...args: unknown[]) => Promise<unknown>>();

jest.unstable_mockModule("../config/database.js", () => ({
  database: {
    execute: mockExecute,
  },
}));

const { MySqlContactRepository } = await import(
  "../modules/contacts/mysql.repository.impl.js"
);

const mockRow = {
  id: 1,
  nome: "João Silva",
  telefone: "11999999999",
  created_at: new Date("2026-01-01"),
  updated_at: new Date("2026-01-01"),
};

describe("MySqlContactRepository", () => {
  let repository: InstanceType<typeof MySqlContactRepository>;

  beforeEach(() => {
    repository = new MySqlContactRepository();
    mockExecute.mockReset();
  });

  describe("findAll", () => {
    it("retorna lista de contatos mapeados", async () => {
      mockExecute.mockResolvedValueOnce([[mockRow]]);

      const result = await repository.findAll();

      expect(result[0]).toEqual({
        id: 1,
        nome: "João Silva",
        telefone: "11999999999",
        createdAt: mockRow.created_at,
        updatedAt: mockRow.updated_at,
      });
    });
  });

  describe("findById", () => {
    it("retorna contato quando encontrado", async () => {
      mockExecute.mockResolvedValueOnce([[mockRow]]);

      const result = await repository.findById(1);

      expect(result).not.toBeNull();
      expect(result?.id).toBe(1);
    });

    it("retorna null quando não encontrado", async () => {
      mockExecute.mockResolvedValueOnce([[]]);

      const result = await repository.findById(99);

      expect(result).toBeNull();
    });
  });

  describe("create", () => {
    it("insere e retorna o contato criado", async () => {
      mockExecute
        .mockResolvedValueOnce([{ insertId: 1, affectedRows: 1 }])
        .mockResolvedValueOnce([[mockRow]]);

      const result = await repository.create({
        nome: "João Silva",
        telefone: "11999999999",
      });

      expect(result.id).toBe(1);
      expect(result.nome).toBe("João Silva");
    });
  });

  describe("update", () => {
    it("atualiza e retorna o contato", async () => {
      const updatedRow = {
        ...mockRow,
        nome: "João Santos",
      };

      mockExecute
        .mockResolvedValueOnce([{ affectedRows: 1 }])
        .mockResolvedValueOnce([[updatedRow]]);

      const result = await repository.update(1, {
        nome: "João Santos",
      });

      expect(result?.nome).toBe("João Santos");
    });
  });

  describe("delete", () => {
    it("retorna true quando deleta com sucesso", async () => {
      mockExecute.mockResolvedValueOnce([{ affectedRows: 1 }]);

      const result = await repository.delete(1);

      expect(result).toBe(true);
    });

    it("retorna false quando contato não existe", async () => {
      mockExecute.mockResolvedValueOnce([{ affectedRows: 0 }]);

      const result = await repository.delete(99);

      expect(result).toBe(false);
    });
  });
});