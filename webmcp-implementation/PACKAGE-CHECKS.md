# Package checks

Checked September 17, 2026.

| Check | Result |
| --- | --- |
| Skill name, description, YAML frontmatter, string metadata | Passed |
| Optional Codex UI metadata | Passed |
| Main skill links to bundled resources | Passed |
| Browser probe JavaScript syntax | Passed |
| Probe under eight synthetic test environments | 8 passed |

Reproduce the script checks from this skill folder:

```sh
node --check scripts/probe-webmcp.js
node --test scripts/probe-webmcp.test.cjs
```

The tests use Node's built-in test runner and require no npm dependencies. They were run with Node v22.16.0.

The synthetic tests cover no browser globals, absent support, current-shaped properties, legacy-shaped properties, throwing getters, unknown permissions-policy features, blocked policy, and frame detection. They verify that the probe does not call tool registration, discovery, or execution APIs.

**Not performed:** installation into a user's coding agent; changes to a target repository; native browser conformance; application workflow tests; or end-to-end consumer tests. Those checks are explicitly required during an actual implementation. A capability property can be shimmed, so its presence is never treated as proof of native support.
