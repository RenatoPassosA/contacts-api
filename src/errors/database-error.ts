export class DatabaseError extends Error {
  constructor(message = "Erro ao acessar o banco de dados.") {
    super(message);
    this.name = "DatabaseError";
  }
}