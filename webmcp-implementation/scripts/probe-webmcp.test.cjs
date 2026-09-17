// Tests the diagnostic under synthetic globals, NOT a native browser or WebMCP.
// Run: node --test scripts/probe-webmcp.test.cjs
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const { test } = require('node:test');
const code = fs.readFileSync(path.join(__dirname, 'probe-webmcp.js'), 'utf8');

function run(globals = {}) {
  const messages = [];
  const result = vm.runInNewContext(code, {
    console: { log: (message) => messages.push(message) },
    ...globals,
  });
  assert.equal(messages.length, 1);
  assert.doesNotThrow(() => JSON.parse(messages[0]));
  return result;
}

test('no browser globals reports unavailable', () => {
  const result = run();
  assert.equal(result.hasDocument, false);
  assert.equal(result.documentModelContext.present, false);
  assert.ok(result.diagnostics.some((s) => s.startsWith('No document')));
});

test('unsupported browser reports missing APIs', () => {
  const window = {}; window.top = window;
  const result = run({ document: {}, navigator: { userAgent: 'synthetic' }, window, isSecureContext: true });
  assert.equal(result.hasDocument, true);
  assert.equal(result.topLevel, true);
  assert.equal(result.toolsPolicy, 'unknown');
  assert.equal(result.documentModelContext.methods.registerTool, false);
});

test('current-shaped API is inspected without tool calls', () => {
  let calls = 0;
  const api = { registerTool() { calls++; }, getTools() { calls++; }, executeTool() { calls++; } };
  const policy = { features() { return ['tools']; }, allowsFeature(name) { assert.equal(name, 'tools'); return true; } };
  const result = run({ document: { modelContext: api, permissionsPolicy: policy } });
  assert.equal(result.documentModelContext.methods.registerTool, true);
  assert.equal(result.documentModelContext.methods.getTools, true);
  assert.equal(result.documentModelContext.methods.executeTool, true);
  assert.equal(result.documentModelContext.methods.unregisterTool, false);
  assert.equal(result.toolsPolicy, 'allowed');
  assert.equal(calls, 0);
  assert.ok(result.provenance.startsWith('unverified'));
});

test('legacy-shaped API remains separate', () => {
  let calls = 0;
  const result = run({ document: {}, navigator: { modelContext: {
    registerTool() { calls++; }, unregisterTool() { calls++; },
  } } });
  assert.equal(result.documentModelContext.present, false);
  assert.equal(result.navigatorModelContext.present, true);
  assert.equal(result.navigatorModelContext.methods.unregisterTool, true);
  assert.equal(calls, 0);
});

test('throwing capability getter is handled', () => {
  const document = {};
  Object.defineProperty(document, 'modelContext', { get() { throw new Error('synthetic denial'); } });
  const result = run({ document });
  assert.equal(result.documentModelContext.present, false);
  assert.ok(result.diagnostics.some((s) => s.includes('document.modelContext')));
});

test('unknown policy feature is not queried', () => {
  let queried = false;
  const result = run({ document: { permissionsPolicy: {
    features() { return ['camera']; },
    allowsFeature() { queried = true; return true; },
  } } });
  assert.equal(result.toolsPolicy, 'unknown');
  assert.equal(queried, false);
});

test('blocked tools policy is distinct from unknown', () => {
  const result = run({ document: { permissionsPolicy: {
    features() { return ['tools']; }, allowsFeature() { return false; },
  } } });
  assert.equal(result.toolsPolicy, 'blocked');
});

test('iframe reports non-top-level', () => {
  const result = run({ document: {}, window: { top: {} } });
  assert.equal(result.topLevel, false);
});
