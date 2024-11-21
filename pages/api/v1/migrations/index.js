import migrationRunner from "node-pg-migrate";
import { join } from "node:path";
import database from "infra/database";

export default async function migrations(request, response) {
  const dbClient = await database.getNewClient();
  const defaultMigrationsOption = {
    dbClient: dbClient,
    dryRun: true,
    dir: join("infra", "migrations"),
    direction: "up",
    verbose: true,
    migrationsTable: "pg-migrations",
  };

  if (request.method === "GET") {
    const pendingMigrations = await migrationRunner(defaultMigrationsOption);
    await dbClient.end();
    return response.status(200).json(pendingMigrations);
  }

  if (request.method === "POST") {
    const migrateMigrations = await migrationRunner({
      ...defaultMigrationsOption,
      dryRun: false,
    });

    await dbClient.end();

    if (migrateMigrations.length > 0) {
      return response.status(201).json(migrateMigrations);
    }

    return response.status(200).json(migrateMigrations);
  }

  return response.status(405).end();
}
