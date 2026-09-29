import { webcrypto } from "node:crypto";

import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

Object.defineProperty(globalThis, "crypto", {
  configurable: true,
  value: webcrypto,
});

afterEach(() => {
  cleanup();
  window.localStorage.clear();
});
