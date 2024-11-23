import migrationRunner from "node-pg-migrate";
import { join } from "node:path";
import database from "infra/database";

export default async function migrations(request, response) {
  let dbClient;
  const allowedMethods = ["GET", "POST"];

  if (!allowedMethods.includes(request.method)) {
    return response.status(405).json({
      error: `Method ${request.method} not allowed`,
    });
  }

  try {
    dbClient = await database.getNewClient();
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
      return response.status(200).json(pendingMigrations);
    }

    if (request.method === "POST") {
      const migrateMigrations = await migrationRunner({
        ...defaultMigrationsOption,
        dryRun: false,
      });

      if (migrateMigrations.length > 0) {
        return response.status(201).json(migrateMigrations);
      }

      return response.status(200).json(migrateMigrations);
    }
  } catch (err) {
    console.error(err);
    throw err;
  } finally {
    await dbClient.end();
  }
}
