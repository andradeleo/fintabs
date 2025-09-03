import email from "infra/email";
import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
});

describe("infra/email.js", () => {
  test("send()", async () => {
    await orchestrator.deleteAllEmails();

    await email.send({
      from: "FinTabs <contato@fintabs.com.br>",
      to: "contato@curso.dev",
      subject: "Teste de assunto",
      text: "Teste de corpo.",
    });

    await email.send({
      from: "FinTabs <contato@fintabs.com.br>",
      to: "contato@curso.dev",
      subject: "Último email enviado.",
      text: "Corpo do último email.",
    });

    const lastEmail = await orchestrator.getLastEmail();
    console.log(lastEmail);

    expect(lastEmail.sender).toBe("<contato@fintabs.com.br>");
    expect(lastEmail.recipients[0]).toBe("<contato@curso.dev>");
    expect(lastEmail.subject).toBe("Último email enviado.");
    expect(lastEmail.text).toBe("Corpo do último email.\r\n");
  });
});
