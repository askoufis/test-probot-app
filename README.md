# test-probot-app

Reproduction repo for [issue #1972]

[issue #1972]: https://github.com/probot/probot/issues/1972

## Steps to reproduce

```sh
git clone https://github.com/askoufis/test-probot-app
cd test-probot-app
pnpm install
pnpm run test
```

The version of probot installed on the `master` branch is v12.
Tests take ~1s to run on my Macbook Pro M1.
Additional tests add <100ms to the test run.

Then:

```sh
git checkout probot-13
pnpm install
pnpm run test
```

The only difference between the `master` and `probot-13` branches are the probot version.
`probot-13` is on v13.
Tests take ~4s to run.
Additional tests add ~3s to the test run.
