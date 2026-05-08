import type { Contact, CreateContactDto, UpdateContactDto } from "./types.js";

export interface ContactRepository {
  create(data: CreateContactDto): Promise<Contact>;
  findAll(): Promise<Contact[]>;
  findById(id: number): Promise<Contact | null>;
  update(id: number, data: UpdateContactDto): Promise<Contact | null>;
  delete(id: number): Promise<boolean>;
}