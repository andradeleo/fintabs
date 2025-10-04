import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
  await orchestrator.deleteAllEmails();
});

describe("Use case: Registration Flow (all successful", () => {
  test("Create user account", async () => {
    const createUseResponse = await fetch(
      "http://localhost:3000/api/v1/users",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "andrleo",
          email: "contato@andrleo",
          password: "senha123",
        }),
      },
    );

    expect(createUseResponse.status).toBe(201);

    const createUseResponseBody = await createUseResponse.json();

    expect(createUseResponseBody).toEqual({
      id: createUseResponseBody.id,
      username: createUseResponseBody.username,
      email: createUseResponseBody.email,
      features: ["read:activation_token"],
      password: createUseResponseBody.password,
      created_at: createUseResponseBody.created_at,
      updated_at: createUseResponseBody.updated_at,
    });
  });

  test("Receive activation email", async () => {});

  test("Activate account", async () => {});

  test("Login", async () => {});

  test("Get user information", async () => {});
});
