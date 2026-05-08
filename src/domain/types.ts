export type Contact = {
  id: number;
  nome: string;
  telefone: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateContactDto = {
  nome: string;
  telefone: string;
};

export type UpdateContactDto = {
  nome?: string;
  telefone?: string;
};