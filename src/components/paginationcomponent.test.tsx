import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PaginationComponent from "./PaginationComponent";

var page = 120;
function handlePageChanged(p: number) {
  page = p;
}
const renderComponent = (totalPages = 10, p = page, maxItemCount?: number) => {
  return render(
    <PaginationComponent
      page={p}
      onPageChanged={handlePageChanged}
      maxItemCount={maxItemCount}
      totalPages={totalPages}
    />
  );
};
describe("PaginationComponent unit test", () => {
  it("renders all if not maxItemCount", () => {
    let totalPages = 200;
    renderComponent(totalPages, 3);
    expect(screen.getByTestId(`page_component__next`)).toBeInTheDocument();
    expect(screen.getByTestId(`page_component__prev`)).toBeInTheDocument();
    for (let i = 0; i < totalPages; i++) {
      expect(
        screen.getByTestId(`page_component__page_${i + 1}`)
      ).toBeInTheDocument();
    }
  });
  it("renders truncated to maxItemCount (scenario 1) page at start", () => {
    let totalPages = 200;
    let page = 4;
    let maxItemCount = 9;
    renderComponent(totalPages, page, maxItemCount);
    expect(screen.getByTestId(`page_component__next`)).toBeInTheDocument();
    expect(screen.getByTestId(`page_component__prev`)).toBeInTheDocument();
    for (let i = 0; i < maxItemCount - 4; i++) {
      //pages from 1 to 5
      expect(
        screen.getByTestId(`page_component__page_${i + 1}`)
      ).toBeInTheDocument();
    }
    expect(screen.getAllByText("...")).toHaveLength(1);
    expect(
      screen.getByTestId(`page_component__page_${totalPages}`)
    ).toBeInTheDocument();
  });
  it("renders truncated to maxItemCount (scenario 2) page at end", () => {
    let totalPages = 200;
    let page = 197;
    let maxItemCount = 9;
    renderComponent(totalPages, page, maxItemCount);
    expect(screen.getByTestId(`page_component__next`)).toBeInTheDocument();
    expect(screen.getByTestId(`page_component__prev`)).toBeInTheDocument();
    for (let i = totalPages - 1; i > totalPages - maxItemCount + 3; i--) {
      //pages from 195 to 200
      expect(
        screen.getByTestId(`page_component__page_${i + 1}`)
      ).toBeInTheDocument();
    }
    expect(screen.getAllByText("...")).toHaveLength(1);
    expect(screen.getByTestId(`page_component__page_${1}`)).toBeInTheDocument();
  });
  it("renders truncated to maxItemCount (scenario 3) page at middle", () => {
    let totalPages = 200;
    let page = 120;
    let maxItemCount = 9;
    renderComponent(totalPages, page, maxItemCount);
    expect(screen.getByTestId(`page_component__next`)).toBeInTheDocument();
    expect(screen.getByTestId(`page_component__prev`)).toBeInTheDocument();
    for (let i = 117; i < 122; i++) {
      //pages from 118 to 122
      expect(
        screen.getByTestId(`page_component__page_${i + 1}`)
      ).toBeInTheDocument();
    }
    expect(screen.getAllByText("...")).toHaveLength(2);
    expect(screen.getByTestId(`page_component__page_${1}`)).toBeInTheDocument();
    expect(
      screen.getByTestId(`page_component__page_${totalPages}`)
    ).toBeInTheDocument();
  });
});

describe("functionalities", () => {
  beforeEach(() => {
    let totalPages = 200;
    let maxItemCount = 9;
    renderComponent(totalPages, page, maxItemCount);
  });

  it("goes page up by 1 step", async () => {
    userEvent.click(screen.getByTestId(`page_component__next`));
    await waitFor(() => {
      expect(page).toBe(121);
    });
  });
  it("goes page down by 1 step", async () => {
    userEvent.click(screen.getByTestId(`page_component__next`));
    await waitFor(() => {
      expect(page).toBe(122);
    });
  });
  it("goes page down by 1 step", async () => {
    userEvent.click(screen.getByTestId(`page_component__prev`));
    await waitFor(() => {
      expect(page).toBe(121);
    });
  });
  it("goes page down by 1 step", async () => {
    userEvent.click(screen.getByTestId(`page_component__prev`));
    await waitFor(() => {
      expect(page).toBe(120);
    });
  });
  it("goes page down by 1 step", async () => {
    userEvent.click(screen.getByTestId(`page_component__prev`));
    await waitFor(() => {
      expect(page).toBe(119);
    });
  });
});
