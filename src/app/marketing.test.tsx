import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

import Home from "@/app/page";

vi.mock("@/components/auth/auth-provider", () => ({
  useAuth: () => ({
    status: "unauthenticated",
    user: null,
    signOut: vi.fn(),
  }),
}));

describe("marketing home", () => {
  it("renders the product thesis", () => {
    render(<Home />);

    expect(
      screen.getByText("Skillset Is Being Built."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Three steps from idea to income."),
    ).toBeInTheDocument();
  });
});
