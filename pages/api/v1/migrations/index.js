import  { createRouter } from "next-connect";
import migrationRunner from "node-pg-migrate";
import { resolve } from "node:path";
import database from "infra/database";
import controller from "infra/controller";

const router = createRouter();

router.get(getHandler);
router.post(postHandler);

export default router.handler(controller.errorHandlers);

const defaultMigrationsOption = {
  dryRun: true,
  dir: resolve("infra", "migrations"),
  direction: "up",
  verbose: true,
  migrationsTable: "pg-migrations",
};

async function getHandler(request, response) {
  let dbClient;

  try {
    dbClient = await database.getNewClient();

    const pendingMigrations = await migrationRunner({
      ...defaultMigrationsOption, 
      dbClient
    });

    return response.status(200).json(pendingMigrations);

  } finally {
    await dbClient.end();
  }
}

async function postHandler(request, response) {
  let dbClient;

  try {
    dbClient = await database.getNewClient();

    const migrateMigrations = await migrationRunner({
      ...defaultMigrationsOption,
      dbClient,
      dryRun: false,
    });

    if (migrateMigrations.length > 0) {
      return response.status(201).json(migrateMigrations);
    }

    return response.status(200).json(migrateMigrations);

  } finally {
    await dbClient.end();
  }
}