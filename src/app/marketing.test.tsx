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
      screen.getByText("Learn From The Best."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Featured learning pathways"),
    ).toBeInTheDocument();
  });
});
