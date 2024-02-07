const { http, HttpResponse } = require("msw");

const tokenHandler = http.post(
  "https://api.github.com/app/installations/2/access_tokens",
  () => {
    return HttpResponse.json(
      {
        token: "test",
        permissions: {
          issues: "write",
        },
      },
      { status: 200 },
    );
  },
);

const issueCreatedBody = { body: "Thanks for opening this issue!" };

const commentsHandler = http.post(
  "https://api.github.com/repos/hiimbex/testing-things/issues/1/comments",
  async ({ request }) => {
    const data = await request.json();

    if (data.body !== issueCreatedBody.body) {
      return HttpResponse.text("Incorrect body", { status: 404 });
    }

    return HttpResponse.json({}, { status: 200 });
  },
);

module.exports = { tokenHandler, commentsHandler };
