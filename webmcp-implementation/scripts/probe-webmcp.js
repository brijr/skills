/*
 * Run in a DEVELOPMENT page's main-world DevTools console, not a Node CLI.
 * This read-only diagnostic neither registers nor invokes tools.
 * Method presence does NOT establish native provenance, activation state,
 * correct cleanup semantics, declarative support, or agent compatibility.
 * Do not paste unreviewed scripts into a sensitive production page.
 */
(() => {
  "use strict";

  const diagnostics = [];
  const read = (target, key, label) => {
    if (target == null) return undefined;
    try {
      return target[key];
    } catch {
      diagnostics.push(`Unable to read ${label}; inspect this environment manually.`);
      return undefined;
    }
  };

  const doc = typeof document === "object" ? document : undefined;
  const nav = typeof navigator === "object" ? navigator : undefined;
  const win = typeof window === "object" ? window : undefined;
  const modern = read(doc, "modelContext", "document.modelContext");
  const legacy = read(nav, "modelContext", "navigator.modelContext");

  const methods = (context, label) => {
    const names = ["registerTool", "getTools", "executeTool", "unregisterTool",
      "provideContext", "clearContext", "listTools"];
    return Object.fromEntries(names.map((name) => [
      name,
      typeof read(context, name, `${label}.${name}`) === "function",
    ]));
  };

  let topLevel = null;
  if (win) {
    try { topLevel = win.top === win; } catch {
      diagnostics.push("Unable to determine frame position.");
    }
  }

  let toolsPolicy = "unknown";
  const policy = read(doc, "permissionsPolicy", "document.permissionsPolicy")
    ?? read(doc, "featurePolicy", "document.featurePolicy");
  // Query only a feature the browser explicitly recognizes. Do not confuse
  // a missing policy-inspection API with a disabled tools policy.
  if (policy && typeof read(policy, "features", "policy.features") === "function"
      && typeof read(policy, "allowsFeature", "policy.allowsFeature") === "function") {
    try {
      const known = policy.features();
      if (Array.isArray(known) && known.includes("tools")) {
        toolsPolicy = policy.allowsFeature("tools") ? "allowed" : "blocked";
      }
    } catch {
      diagnostics.push("Permissions Policy inspection unavailable.");
    }
  }

  const report = {
    checkedAt: new Date().toISOString(),
    hasDocument: Boolean(doc),
    userAgent: read(nav, "userAgent", "navigator.userAgent") ?? null,
    secureContext: typeof isSecureContext === "boolean" ? isSecureContext : null,
    topLevel,
    toolsPolicy,
    documentModelContext: { present: modern != null, methods: methods(modern, "document.modelContext") },
    navigatorModelContext: { present: legacy != null, methods: methods(legacy, "navigator.modelContext") },
    provenance: "unverified: these properties could be native or supplied by a shim",
    diagnostics,
    verificationStillRequired: [
      "Exact browser and consumer support; activation mechanism",
      "Native registration, discovery, execution, and cleanup",
      "Execution cancellation and result representation",
      "Declarative support if needed; intended agent end-to-end workflow",
    ],
  };

  if (!doc) diagnostics.push("No document: rerun in the target page's main-world browser console.");
  console.log(JSON.stringify(report, null, 2));
  return report;
})();
