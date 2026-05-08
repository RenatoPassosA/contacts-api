import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { database } from "../../config/database.js";
import type { Contact, CreateContactDto, UpdateContactDto } from "./types.js";
import type { ContactRepository } from "./repository.js";

type ContactRow = RowDataPacket & {
  id: number;
  nome: string;
  telefone: string;
  created_at: Date;
  updated_at: Date;
};

function mapContactRow(row: ContactRow): Contact {
  return {
    id: row.id,
    nome: row.nome,
    telefone: row.telefone,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export class MySqlContactRepository implements ContactRepository {
  async create(data: CreateContactDto): Promise<Contact> {
    const [result] = await database.execute<ResultSetHeader>(
      "INSERT INTO contacts (nome, telefone) VALUES (?, ?)",
      [data.nome, data.telefone]
    );

    const contact = await this.findById(result.insertId);

    if (!contact) {
      throw new Error("Contato não encontrado após a criação.");
    }

    return contact;
  }

  async findAll(): Promise<Contact[]> {
    const [rows] = await database.execute<ContactRow[]>(
      "SELECT id, nome, telefone, created_at, updated_at FROM contacts ORDER BY id DESC"
    );

    return rows.map(mapContactRow);
  }

  async findById(id: number): Promise<Contact | null> {
    const [rows] = await database.execute<ContactRow[]>(
      "SELECT id, nome, telefone, created_at, updated_at FROM contacts WHERE id = ?",
      [id]
    );

    const [contact] = rows;

    if (!contact) {
      return null;
    }

    return mapContactRow(contact);
  }

  async update(id: number, data: UpdateContactDto): Promise<Contact | null> {
    const fields: string[] = [];
    const values: Array<string | number> = [];

    if (data.nome !== undefined) {
      fields.push("nome = ?");
      values.push(data.nome);
    }

    if (data.telefone !== undefined) {
      fields.push("telefone = ?");
      values.push(data.telefone);
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    values.push(id);

    await database.execute(
      `UPDATE contacts SET ${fields.join(", ")} WHERE id = ?`,
      values
    );

    return this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const [result] = await database.execute<ResultSetHeader>(
      "DELETE FROM contacts WHERE id = ?",
      [id]
    );

    return result.affectedRows > 0;
  }
}