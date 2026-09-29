import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { AuthProvider } from "./auth-provider";
import { useAuth } from "./use-auth";

function AuthHarness() {
  const { user, register, login, logout } = useAuth();

  if (user) {
    return (
      <div>
        <span>{user.fullName}</span>
        <span>{user.balance}</span>

        <button type="button" onClick={logout}>
          Logout
        </button>
      </div>
    );
  }

  return (
    <div>
      <span>Logged out</span>

      <button
        type="button"
        onClick={() =>
          register({
            fullName: "Adrian Test",
            email: "adrian@example.com",
            password: "Carrera123",
          })
        }
      >
        Register
      </button>

      <button
        type="button"
        onClick={() =>
          login({
            email: "adrian@example.com",
            password: "Carrera123",
          })
        }
      >
        Login
      </button>
    </div>
  );
}

describe("AuthProvider", () => {
  it("registers, logs out and restores access with a hashed password", async () => {
    const user = userEvent.setup();

    render(
      <AuthProvider>
        <AuthHarness />
      </AuthProvider>,
    );

    await user.click(
      screen.getByRole("button", {
        name: "Register",
      }),
    );

    expect(await screen.findByText("Adrian Test")).toBeInTheDocument();
    expect(screen.getByText("0")).toBeInTheDocument();

    const storedUser = JSON.parse(
      window.localStorage.getItem("snail-gp:user:v1") ?? "{}",
    ) as Record<string, unknown>;

    expect(storedUser.passwordHash).toMatch(/^\$2[aby]\$12\$/);
    expect(JSON.stringify(storedUser)).not.toContain("Carrera123");

    await user.click(
      screen.getByRole("button", {
        name: "Logout",
      }),
    );

    expect(screen.getByText("Logged out")).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", {
        name: "Login",
      }),
    );

    expect(await screen.findByText("Adrian Test")).toBeInTheDocument();
  });
});
