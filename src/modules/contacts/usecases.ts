import { AppError } from "../../errors/app-error.js";
import type { ContactRepository } from "./repository.js";
import type { CreateContactDto, UpdateContactDto } from "./types.js";

export class CreateContactUseCase {
  constructor(private readonly contactRepository: ContactRepository) {}

  async execute(data: CreateContactDto) {
    return this.contactRepository.create(data);
  }
}

export class ListContactsUseCase {
  constructor(private readonly contactRepository: ContactRepository) {}

  async execute() {
    return this.contactRepository.findAll();
  }
}

export class UpdateContactUseCase {
  constructor(private readonly contactRepository: ContactRepository) {}

  async execute(id: number, data: UpdateContactDto) {
    const contactExists = await this.contactRepository.findById(id);

    if (!contactExists) {
      throw new AppError("Contato não encontrado.", 404);
    }

    const updatedContact = await this.contactRepository.update(id, data);

    if (!updatedContact) {
      throw new AppError("Contato não encontrado.", 404);
    }

    return updatedContact;
  }
}

export class DeleteContactUseCase {
  constructor(private readonly contactRepository: ContactRepository) {}

  async execute(id: number) {
    const contactExists = await this.contactRepository.findById(id);

    if (!contactExists) {
      throw new AppError("Contato não encontrado.", 404);
    }

    const deleted = await this.contactRepository.delete(id);

    if (!deleted) {
      throw new AppError("Contato não encontrado.", 404);
    }
  }
}