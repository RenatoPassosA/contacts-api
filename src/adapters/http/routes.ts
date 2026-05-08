import { Router } from "express";
import { ContactController } from "./controller.js";
import { MySqlContactRepository } from "../../infra/mysql/mysql.repository.impl.js";
import { ContactUseCase } from "../../application/usecases/usecases.js";

const contactRoutes = Router();

const contactRepository = new MySqlContactRepository();
const contactUseCase = new ContactUseCase(contactRepository);

const contactController = new ContactController(contactUseCase);

contactRoutes.post("/contatos", contactController.create);
contactRoutes.get("/contatos", contactController.list);
contactRoutes.patch("/contatos/:id", contactController.update);
contactRoutes.delete("/contatos/:id", contactController.delete);

export { contactRoutes };