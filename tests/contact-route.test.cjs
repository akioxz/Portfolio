const fs = require("fs");
const path = require("path");
const test = require("node:test");
const assert = require("node:assert/strict");
const vm = require("vm");
const ts = require(
  "C:\\Users\\User\\Documents\\Personal Projects\\portfolio\\node_modules\\typescript",
);

const routePath = path.resolve(
  "C:\\Users\\User\\Documents\\Personal Projects\\portfolio\\app\\api\\contact\\route.ts",
);
const routeSource = fs
  .readFileSync(routePath, "utf8")
  .replace(/^import .*?;\r?\n/gm, "")
  .replace("export async function POST", "async function POST");

let fetchMode = "success";
let supabaseInserts = 0;
let supabaseInsertError = null;
let rateLimitInsertError = null;
let resendSends = 0;
let resendError = null;

const source = `
const { NextResponse } = require("next/server");
const { z } = require("zod");
const { createClient } = require("@supabase/supabase-js");
const { Resend } = require("resend");
const crypto = require("crypto");
${routeSource}
`;

const compiled = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2020,
  },
}).outputText + "\nmodule.exports = { POST };";

const context = {
  console,
  Date,
  Promise,
  URLSearchParams,
  process,
  fetch: async () => {
    if (fetchMode === "network-error") throw new Error("network failure");
    if (fetchMode === "http-error") return { ok: false, status: 502 };
    if (fetchMode === "invalid") {
      return { ok: true, json: async () => ({ success: false }) };
    }
    if (fetchMode === "malformed") {
      return { ok: true, json: async () => null };
    }
    return { ok: true, json: async () => ({ success: true }) };
  },
  require(name) {
    if (name === "next/server") {
      return {
        NextResponse: {
          json(body, init) {
            return { body, status: init?.status || 200 };
          },
        },
      };
    }
    if (name === "zod") {
      return require(
        "C:\\Users\\User\\Documents\\Personal Projects\\portfolio\\node_modules\\zod",
      );
    }
    if (name === "crypto") return require("crypto");
    if (name === "@supabase/supabase-js") {
      return {
        createClient() {
          return {
            from(table) {
              return {
                delete: () => ({ lt: () => Promise.resolve({ error: null }) }),
                select: () => ({
                  eq: () => ({
                    gte: () => Promise.resolve({ data: [], error: null }),
                  }),
                }),
                insert: () => {
                  if (table === "contact_messages") {
                    supabaseInserts += 1;
                  }
                  return Promise.resolve({
                    error:
                      table === "contact_messages"
                        ? supabaseInsertError
                        : rateLimitInsertError,
                  });
                },
              };
            },
          };
        },
      };
    }
    if (name === "resend") {
      return {
        Resend: class {
          emails = {
            send: async () => {
              resendSends += 1;
              return resendError
                ? { data: null, error: resendError }
                : { data: { id: "test" }, error: null };
            },
          };
        },
      };
    }
    throw new Error(`Unexpected module: ${name}`);
  },
  module: { exports: {} },
};
context.exports = context.module.exports;
vm.runInNewContext(compiled, context, { filename: routePath });
const { POST } = context.module.exports;

const baseEnvironment = {
  NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
  SUPABASE_SERVICE_ROLE_KEY: "test-supabase-key",
  RESEND_API_KEY: "test-resend-key",
  TURNSTILE_SECRET_KEY: "test-turnstile-secret",
};

function makeRequest(token = "test-token", clientIp = "127.0.0.1") {
  return new Request("http://localhost/api/contact", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-forwarded-for": clientIp,
    },
    body: JSON.stringify({
      name: "Turnstile Test",
      email: "turnstile-test@example.com",
      message: "Isolated Turnstile branch test.",
      turnstileToken: token,
    }),
  });
}

async function invoke(
  environment,
  mode = "success",
  token = "test-token",
  insertError = null,
  options = {},
) {
  process.env = { ...environment };
  fetchMode = mode;
  supabaseInserts = 0;
  supabaseInsertError = insertError;
  rateLimitInsertError = options.rateLimitInsertError || null;
  resendSends = 0;
  resendError = options.resendError || null;
  const response = await POST(makeRequest(token, options.clientIp));
  return { response, supabaseInserts, resendSends };
}

test("rejects a missing Turnstile secret before side effects", async () => {
  const { response, supabaseInserts, resendSends } = await invoke(
    { ...baseEnvironment, TURNSTILE_SECRET_KEY: "" },
  );
  assert.equal(response.status, 503);
  assert.equal(supabaseInserts, 0);
  assert.equal(resendSends, 0);
});

test("rejects a missing token before side effects", async () => {
  const { response, supabaseInserts, resendSends } = await invoke(
    baseEnvironment,
    "success",
    null,
  );
  assert.equal(response.status, 400);
  assert.equal(supabaseInserts, 0);
  assert.equal(resendSends, 0);
});

for (const mode of ["invalid", "malformed", "http-error", "network-error"]) {
  test(`rejects Turnstile ${mode} before side effects`, async () => {
    const { response, supabaseInserts, resendSends } = await invoke(
      baseEnvironment,
      mode,
    );
    assert.equal(response.status, 400);
    assert.equal(supabaseInserts, 0);
    assert.equal(resendSends, 0);
  });
}

test("continues to persistence and email after successful verification", async () => {
  const { response, supabaseInserts, resendSends } = await invoke(
    baseEnvironment,
  );
  assert.equal(response.status, 200);
  assert.equal(response.body.success, true);
  assert.equal(supabaseInserts, 1);
  assert.equal(resendSends, 2);
});

test("does not report success when persistence fails and Resend is unavailable", async () => {
  const { response, supabaseInserts, resendSends } = await invoke(
    { ...baseEnvironment, RESEND_API_KEY: "" },
    "success",
    "test-token",
    { message: "insert failed" },
  );
  assert.equal(response.status, 503);
  assert.equal(response.body.success, undefined);
  assert.match(response.body.error, /couldn't save your message/i);
  assert.equal(supabaseInserts, 1);
  assert.equal(resendSends, 0);
});

test("does not report success when Resend returns a fulfilled error response", async () => {
  const { response, resendSends } = await invoke(
    baseEnvironment,
    "success",
    "test-token",
    null,
    { resendError: { message: "invalid sender", statusCode: 422 } },
  );
  assert.equal(response.status, 500);
  assert.equal(response.body.success, undefined);
  assert.match(response.body.error, /failed to send notification email/i);
  assert.equal(resendSends, 2);
});

test("falls back to in-memory limiting when the Supabase rate write fails", async () => {
  const options = {
    clientIp: "rate-limit-write-failure",
    rateLimitInsertError: { message: "insert failed" },
  };

  for (let attempt = 0; attempt < 3; attempt += 1) {
    const { response } = await invoke(
      { ...baseEnvironment, RESEND_API_KEY: "" },
      "success",
      "test-token",
      null,
      options,
    );
    assert.equal(response.status, 200);
  }

  const { response } = await invoke(
    { ...baseEnvironment, RESEND_API_KEY: "" },
    "success",
    "test-token",
    null,
    options,
  );
  assert.equal(response.status, 429);
});
