import { jest } from "@jest/globals";

import {
  CreateContactUseCase,
  DeleteContactUseCase,
  ListContactsUseCase,
  UpdateContactUseCase,
} from "../modules/contacts/usecases.js";

import type { ContactRepository } from "../modules/contacts/repository.js";
import type {
  Contact,
  CreateContactDto,
  UpdateContactDto,
} from "../modules/contacts/types.js";

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

describe("CreateContactUseCase", () => {
  it("cria e retorna o contato", async () => {
    const repository = makeMockRepository();
    const usecase = new CreateContactUseCase(repository);

    const result = await usecase.execute({
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

describe("ListContactsUseCase", () => {
  it("retorna lista de contatos", async () => {
    const repository = makeMockRepository();
    const usecase = new ListContactsUseCase(repository);

    const result = await usecase.execute();

    expect(repository.findAll).toHaveBeenCalled();
    expect(result).toEqual([mockContact]);
  });
});

describe("UpdateContactUseCase", () => {
  it("atualiza e retorna o contato", async () => {
    const repository = makeMockRepository();
    const usecase = new UpdateContactUseCase(repository);

    const result = await usecase.execute(1, {
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

    const usecase = new UpdateContactUseCase(repository);

    await expect(
      usecase.execute(99, {
        nome: "João Santos",
      })
    ).rejects.toThrow("Contato não encontrado.");

    expect(repository.findById).toHaveBeenCalledWith(99);
    expect(repository.update).not.toHaveBeenCalled();
  });
});

describe("DeleteContactUseCase", () => {
  it("deleta o contato existente", async () => {
    const repository = makeMockRepository();
    const usecase = new DeleteContactUseCase(repository);

    await usecase.execute(1);

    expect(repository.findById).toHaveBeenCalledWith(1);
    expect(repository.delete).toHaveBeenCalledWith(1);
  });

  it("lança erro se contato não existe", async () => {
    const repository = makeMockRepository({
      findById: jest.fn(async (_id: number) => null),
    });

    const usecase = new DeleteContactUseCase(repository);

    await expect(usecase.execute(99)).rejects.toThrow(
      "Contato não encontrado."
    );

    expect(repository.findById).toHaveBeenCalledWith(99);
    expect(repository.delete).not.toHaveBeenCalled();
  });
});