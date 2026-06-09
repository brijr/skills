import { defineConfig } from "vitest/config";

// Eval tasks call the Anthropic API and can legitimately take minutes
// (software-design generates two full design proposals per case).
export default defineConfig({
  test: {
    testTimeout: 180_000,
  },
});
