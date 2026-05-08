import { AppError } from "../../errors/app-error.js";
import type { ContactRepository } from "../../domain/repository.js";
import type { CreateContactDto, UpdateContactDto } from "../../domain/types.js";

export class ContactUseCase {
  constructor(private readonly contactRepository: ContactRepository) {}

  async create(data: CreateContactDto) {
    return this.contactRepository.create(data);
  }

  async read() {
    return this.contactRepository.findAll();
  }

  async update(id: number, data: UpdateContactDto) {
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

  async delete(id: number) {
    const deleted = await this.contactRepository.delete(id);

    if (!deleted) {
      throw new AppError("Contato não encontrado.", 404);
    }
  }
}