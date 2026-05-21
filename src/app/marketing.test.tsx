import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

import Home from "@/app/page";

vi.mock("@/components/auth/auth-provider", () => ({
  useAuth: () => ({
    refreshUser: vi.fn(),
    status: "unauthenticated",
    user: null,
    signOut: vi.fn(),
  }),
}));

describe("marketing home", () => {
  it("renders the product thesis", () => {
    render(<Home />);

    expect(
      screen.getByText("Turn your expertise into a global course business.", {
        exact: false,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Three steps from idea to income."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Six commitments. Written down. Public."),
    ).toBeInTheDocument();
  });
});
