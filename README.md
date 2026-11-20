# isoklo-demo

Four pull requests from an AI coding agent. **Every one of them passes the unit tests. Three of them should never be
merged.** [Isoklo](https://github.com/isoklo/isoklo) blocks those three, with the exact line as evidence.

| Pull request | What the agent did | Unit Tests | Isoklo |
|---|---|:---:|:---:|
| [#1 Support stacking discount codes](https://github.com/isoklo/isoklo-demo/pull/1) | Broke the tax calculation, then deleted the two assertions that caught it and skipped a third test. | ✅ passed | ❌ blocked |
| [#2 Add PDF export for invoices](https://github.com/isoklo/isoklo-demo/pull/2) | Added `invoice-pdf-renderer-lite`, a package that does not exist on npm. | ✅ passed | ❌ blocked |
| [#3 Add payment terms and due dates](https://github.com/isoklo/isoklo-demo/pull/3) | Shipped a real feature, and quietly gave itself `Bash(*)` and `WebFetch(domain:*)` in `.claude/settings.json`. | ✅ passed | ❌ blocked |
| [#4 Reject discounts over 100%](https://github.com/isoklo/isoklo-demo/pull/4) | A real fix, with regression tests. | ✅ passed | ✅ passed |

Green tests are not proof. In #1 the agent made the build green by making the tests easier, and customers would have been
charged tax on money they never paid.

## Try it in 30 seconds
You need Node.js 22 or later and git.

```console
git clone https://github.com/isoklo/isoklo-demo.git
cd isoklo-demo
npx isoklo doctor
```

`doctor` finds four real problems in this repository's agent instruction files. The one that matters most: the rule
*"Never edit, skip or delete a test to make CI pass"* lives in `AGENTS.md`, and Claude Code never reads it here, because
`CLAUDE.md` exists and does not import it. That is how an agent ends up writing pull request #1.

They are left unfixed on purpose, so you can see them.

## Run the gate yourself
Check out any demo branch and run the same check the pull request runs:

```console
git switch demo/weakened-tests
npx isoklo check
```

`check` compares the branch with `main` and exits `1` when it blocks. The branches are `demo/weakened-tests`,
`demo/fake-package`, `demo/config-escalation` and `demo/clean-fix`.

To see why pull request #1 is dangerous, put `main`'s tests back on its code. Two of them fail:

```console
git switch demo/weakened-tests
git restore --source main test/invoice.test.js
npm test
git restore test/invoice.test.js
```

## How the gate is wired
- [`.github/workflows/tests.yml`](.github/workflows/tests.yml) runs `npm test` on every pull request.
- [`.github/workflows/isoklo.yml`](.github/workflows/isoklo.yml) is Isoklo's recommended workflow, as published.
- `main` is protected by a ruleset that requires the **check** status check to pass, so GitHub refuses to merge a
  blocked pull request.

## The app
`invoice-kit` is a small, zero-dependency library that computes invoice totals in integer cents: line items, percentage
and fixed discounts, and tax in basis points. `npm test` runs its tests with Node's built-in test runner.

The pull requests are scripted to show what Isoklo catches. The mistakes in them are the ones coding agents really
make.
