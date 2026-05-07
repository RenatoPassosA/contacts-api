import { Router } from "express";
import { ContactController } from "./controller.js";
import { MySqlContactRepository } from "./mysql.repository.impl.js";
import {
  CreateContactUseCase,
  DeleteContactUseCase,
  ListContactsUseCase,
  UpdateContactUseCase,
} from "./usecases.js";

const contactRoutes = Router();

const contactRepository = new MySqlContactRepository();

const createContactUseCase = new CreateContactUseCase(contactRepository);
const listContactsUseCase = new ListContactsUseCase(contactRepository);
const updateContactUseCase = new UpdateContactUseCase(contactRepository);
const deleteContactUseCase = new DeleteContactUseCase(contactRepository);

const contactController = new ContactController(
  createContactUseCase,
  listContactsUseCase,
  updateContactUseCase,
  deleteContactUseCase
);

contactRoutes.post("/contatos", contactController.create);
contactRoutes.get("/contatos", contactController.list);
contactRoutes.patch("/contatos/:id", contactController.update);
contactRoutes.delete("/contatos/:id", contactController.delete);

export { contactRoutes };