import { app } from "./app.js";
import { checkDatabaseConnection } from "./config/database.js";
import { env } from "./config/env.js";

async function bootstrap() {
  await checkDatabaseConnection();

  app.listen(env.port, () => {
    console.log(`Server is running on port ${env.port}`);
  });
}

bootstrap().catch((error) => {
  console.error("Application failed to start");
  console.error(error);
  process.exit(1);
});