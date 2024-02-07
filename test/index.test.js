// Requiring our app implementation
const myProbotApp = require("..");
const { Probot, ProbotOctokit } = require("probot");
// Requiring our fixtures
const payload = require("./fixtures/issues.opened");
const fs = require("fs");
const path = require("path");

const { setupServer } = require("msw/node");
const { tokenHandler, commentsHandler } = require("./handlers");

const privateKey = fs.readFileSync(
  path.join(__dirname, "fixtures/mock-cert.pem"),
  "utf-8",
);

const server = setupServer(tokenHandler);

let mockedResponsesSent = 0;
server.events.on("response:mocked", () => {
  mockedResponsesSent += 1;
});

describe("My Probot app", () => {
  let probot;

  beforeAll(() => {
    server.listen({ onUnhandledRequest: "error" });
  });

  beforeEach(async () => {
    probot = new Probot({
      appId: 123,
      privateKey,
      logLevel: "trace",
      // disable request throttling and retries for testing
      Octokit: ProbotOctokit.defaults({
        retry: { enabled: false },
        throttle: { enabled: false },
      }),
    });
    // Load our app into probot
    await probot.load(myProbotApp);
  });

  afterEach(() => {
    server.resetHandlers();
    mockedResponsesSent = 0;
  });

  afterAll(() => {
    server.close();
  });

  test("creates a comment when an issue is opened", async () => {
    server.use(commentsHandler);

    // Receive a webhook event
    await probot.receive({ name: "issues", payload });
    expect(mockedResponsesSent).toBe(2);
  });

  test("creates a comment when an issue is opened - 2", async () => {
    server.use(commentsHandler);

    // Receive a webhook event
    await probot.receive({ name: "issues", payload });
    expect(mockedResponsesSent).toBe(2);
  });
});
