import { render, screen } from "@testing-library/react";

import Home from "@/app/page";

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
