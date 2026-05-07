import { AppError } from "../../errors/app-error.js";
import type { Request, Response, NextFunction } from "express";
import { createContactSchema, updateContactSchema } from "./schema.js";
import type {
  CreateContactUseCase,
  DeleteContactUseCase,
  ListContactsUseCase,
  UpdateContactUseCase,
} from "./usecases.js";

function parseContactId(id: string | string[] | undefined): number {
  if (Array.isArray(id)) {
    throw new AppError("ID inválido.", 400);
  }

  const parsedId = Number(id);

  if (!Number.isInteger(parsedId) || parsedId <= 0) {
    throw new AppError("ID inválido.", 400);
  }

  return parsedId;
}

export class ContactController {
  constructor(
    private readonly createContactUseCase: CreateContactUseCase,
    private readonly listContactsUseCase: ListContactsUseCase,
    private readonly updateContactUseCase: UpdateContactUseCase,
    private readonly deleteContactUseCase: DeleteContactUseCase
  ) {}

  create = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const data = createContactSchema.parse(request.body);

      const contact = await this.createContactUseCase.execute(data);

      return response.status(201).json(contact);
    } catch (error) {
      next(error);
    }
  };

  list = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const contacts = await this.listContactsUseCase.execute();

      return response.status(200).json(contacts);
    } catch (error) {
      next(error);
    }
  };

  update = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const id = parseContactId(request.params.id);
      const data = updateContactSchema.parse(request.body);

      const contact = await this.updateContactUseCase.execute(id, data);

      return response.status(200).json(contact);
    } catch (error) {
      next(error);
    }
  };

  delete = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const id = parseContactId(request.params.id);

      await this.deleteContactUseCase.execute(id);

      return response.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}