export type Contact = {
  id: number;
  name: string;
  phone: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateContactDto  = {
  name: string;
  phone: string;
};

export type UpdateContactDto = {
  name?: string;
  phone?: string;
};