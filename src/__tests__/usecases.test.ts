import { jest } from "@jest/globals";

import { ContactUseCase } from "../application/usecases/usecases.js";

import type { ContactRepository } from "../domain/repository.js";
import type {
  Contact,
  CreateContactDto,
  UpdateContactDto,
} from "../domain/types.js";

const mockContact: Contact = {
  id: 1,
  nome: "João Silva",
  telefone: "11999999999",
  createdAt: new Date(),
  updatedAt: new Date(),
};

type MockContactRepository = jest.Mocked<ContactRepository>;

function makeMockRepository(
  overrides: Partial<MockContactRepository> = {}
): MockContactRepository {
  const repository: MockContactRepository = {
    create: jest.fn(async (_data: CreateContactDto) => mockContact),

    findAll: jest.fn(async () => [mockContact]),

    findById: jest.fn(async (_id: number) => mockContact),

    update: jest.fn(
      async (_id: number, _data: UpdateContactDto) => ({
        ...mockContact,
        nome: "João Santos",
      })
    ),

    delete: jest.fn(async (_id: number) => true),
  };

  return {
    ...repository,
    ...overrides,
  };
}

describe("ContactUseCase", () => {
  describe("create", () => {
    it("cria e retorna o contato", async () => {
      const repository = makeMockRepository();
      const usecase = new ContactUseCase(repository);

      const result = await usecase.create({
        nome: "João Silva",
        telefone: "11999999999",
      });

      expect(repository.create).toHaveBeenCalledWith({
        nome: "João Silva",
        telefone: "11999999999",
      });

      expect(result).toEqual(mockContact);
    });
  });

  describe("list", () => {
    it("retorna lista de contatos", async () => {
      const repository = makeMockRepository();
      const usecase = new ContactUseCase(repository);

      const result = await usecase.read();

      expect(repository.findAll).toHaveBeenCalled();
      expect(result).toEqual([mockContact]);
    });
  });

  describe("update", () => {
    it("atualiza e retorna o contato", async () => {
      const repository = makeMockRepository();
      const usecase = new ContactUseCase(repository);

      const result = await usecase.update(1, {
        nome: "João Santos",
      });

      expect(repository.findById).toHaveBeenCalledWith(1);

      expect(repository.update).toHaveBeenCalledWith(1, {
        nome: "João Santos",
      });

      expect(result.nome).toBe("João Santos");
    });

    it("lança erro se contato não existe", async () => {
      const repository = makeMockRepository({
        findById: jest.fn(async (_id: number) => null),
      });

      const usecase = new ContactUseCase(repository);

      await expect(
        usecase.update(99, {
          nome: "João Santos",
        })
      ).rejects.toThrow("Contato não encontrado.");

      expect(repository.findById).toHaveBeenCalledWith(99);
      expect(repository.update).not.toHaveBeenCalled();
    });
  });

  describe("delete", () => {
    it("deleta o contato existente", async () => {
      const repository = makeMockRepository();
      const usecase = new ContactUseCase(repository);

      await usecase.delete(1);

      expect(repository.delete).toHaveBeenCalledWith(1);
    });

    it("lança erro se contato não existe", async () => {
      const repository = makeMockRepository({
        delete: jest.fn(async (_id: number) => false),
      });

      const usecase = new ContactUseCase(repository);

      await expect(usecase.delete(99)).rejects.toThrow(
        "Contato não encontrado."
      );

      expect(repository.delete).toHaveBeenCalledWith(99);
    });
  });
});